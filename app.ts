import express, { NextFunction, Request, Response } from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import connectMongoDB from './connections/'
import type errorTask from './interface/errorTask'
import responseError from './service/responseError'
import cors from 'cors'
import session from 'express-session'

import userRouter from './routes/users'
import readersRouter from './routes/readers'
import historysRouter from './routes/historys'
import CardsRouter from './routes/Cards'
// import gmailAuthRouter from './routes/gmailAuth'

// Swagger 使用
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from './swagger-output.json'

const app = express()
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// 出現預料外的錯誤
process.on('uncaughtException', (err) => {
  // 記錄錯誤下來，等到服務都處理完後，停掉該 process
  console.error('未捕抓到的異常', err)
  console.error(err.name)
  console.error(err.message)
  console.error(err.stack) // 可以追蹤到哪裡發生錯誤
  process.exit(1)
})

// 連接資料庫
connectMongoDB()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors())
app.use(
  session({
    secret: 'keyboard cat',
    saveUninitialized: true,
    resave: false,
    cookie: { secure: false }
  })
)

// app.use('/home', homeRouter)
app.use('/user', userRouter)
app.use('/readers', readersRouter)
app.use('/historys', historysRouter)
app.use('/Cards', CardsRouter)

// 404 路由
app.use((req: Request, res: Response) => {
  res.status(404).json({
    code: 'error',
    msg: '查無此路由'
  })
})

// next() 錯誤處理
app.use((err: errorTask, req: Request, res: Response, next: NextFunction) => {
  err.httpStatus = err.httpStatus || 500

  // 開發模式
  if (process.env.NODE_ENV === 'dev') {
    return responseError.error_dev(err, res)
  }

  // 生產模式
  // 可預期錯誤
  if (err.name === 'ValidationError') {
    err.isOperational = true

    const errors = Object.values(err.errors)
    const schemaError = errors.find((item: any) => item.name === 'ValidatorError')
    if (errors.length && schemaError) {
      // mongoose 驗證錯誤
      err.message = (schemaError as Error).message
    } else {
      err.message = '參數錯誤'
    }
    return responseError.error_production(err, res)
  }

  if (err.name === 'BSONError') {
    err.isOperational = true
    err.httpStatus = 400
    err.message = 'id 編碼錯誤'
    return responseError.error_production(err, res)
  }

  // 非預期錯誤
  responseError.error_production(err, res)
  next()
})

// 未捕捉到的 catch
process.on('unhandledRejection', (reason, promise) => {
  console.error('未捕捉到的 rejection：', promise, '原因：', reason)
})

export default app
