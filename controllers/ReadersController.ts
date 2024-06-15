// controllers/houseSymptomsController.ts
import { Request, Response, NextFunction } from 'express'
import { ReadersModel } from '../models/Readers'

const getReaders = async (req: Request, res: Response, next: NextFunction) => {
  /**
     * #swagger.tags = ['讀卡機']
     * #swagger.description = '取得讀卡機'
     * #swagger.security = [{
        token: []
       }]
    * #swagger.parameters['header'] = {
        in: 'header',
        name: 'authorization',
        description: 'Bearer token',
        required: true,
        type: 'string'
      }
     * #swagger.responses[200] = {
        description: '登入成功',
        schema: {
          "status": "success",
          "message": "登入成功"
        },
       }
     * #swagger.responses[401] = {
        description: '登入失敗',
        schema: {
          "status": "error",
          "message": "身分驗證失敗，請重新登入"
        },
       }
     *
     */
  try {
    const readers = await ReadersModel.find()
    res.status(200).json({ code: 'success', data: readers })
  } catch (err) {
    next(err)
  }
}

const createReaders = async (req: Request, res: Response, next: NextFunction) => {
  /**
     * #swagger.tags = ['讀卡機']
     * #swagger.description = '讀卡機新增'
     * #swagger.security = [{
        token: []
       }]
     * #swagger.parameters['body'] = {
        in: 'body',
        description: '讀卡機新增',
        type: 'object',
        required: true,
        schema: {
          name: '預設讀卡機',
          connection: {
            ip: "192.168.100.78",
            port: 4444
          }
        }
       }
     * #swagger.responses[200] = {
        description: '讀卡機新增成功',
        schema: {
          "status": "success",
          "message": "讀卡機新增成功",
        },
       }
     * #swagger.responses[400] = {
        description: '讀卡機新增失敗',
        schema: {
          "status": "error",
          "message": "讀卡機新增"
        },
       }
     *
     */
  try {
    const { name, connection } = req.body
    const readers = new ReadersModel({ name, connection })
    await readers.save()
    res.status(201).json({ code: 'success', data: readers })
  } catch (err) {
    next(err)
  }
}

const updateReaders = async (req: Request, res: Response, next: NextFunction) => {
  /**
     * #swagger.tags = ['讀卡機']
     * #swagger.description = '更新讀卡機'
     * #swagger.security = [{
        token: []
       }]
    * #swagger.parameters['header'] = {
        in: 'header',
        name: 'authorization',
        description: 'Bearer token',
        required: true,
        type: 'string'
      }
     * #swagger.responses[200] = {
        description: '登入成功',
        schema: {
          "status": "success",
          "message": "登入成功"
        },
       }
     * #swagger.responses[401] = {
        description: '登入失敗',
        schema: {
          "status": "error",
          "message": "身分驗證失敗，請重新登入"
        },
       }
     *
     */
  try {
    const { id } = req.params
    const updatedHouseSymptoms = await ReadersModel.findByIdAndUpdate(id)
    if (!updatedHouseSymptoms) {
      return res.status(404).json({ code: 'error', msg: '找不到此讀卡機' })
    }
    res.status(200).json({ code: 'success', data: updatedHouseSymptoms })
  } catch (err) {
    next(err)
  }
}

const deleteReaders = async (req: Request, res: Response, next: NextFunction) => {
  /**
     * #swagger.tags = ['讀卡機']
     * #swagger.description = '刪除讀卡機'
     * #swagger.security = [{
        token: []
       }]
    * #swagger.parameters['header'] = {
        in: 'header',
        name: 'authorization',
        description: 'Bearer token',
        required: true,
        type: 'string'
      }
     * #swagger.responses[200] = {
        description: '登入成功',
        schema: {
          "status": "success",
          "message": "登入成功"
        },
       }
     * #swagger.responses[401] = {
        description: '登入失敗',
        schema: {
          "status": "error",
          "message": "身分驗證失敗，請重新登入"
        },
       }
     *
     */
  try {
    const { id } = req.params
    const deletedReader = await ReadersModel.findByIdAndDelete(id)
    if (!deletedReader) {
      return res.status(404).json({ code: 'error', msg: '找不到此讀卡機' })
    }
    res.status(200).json({ code: 'success', data: deletedReader })
  } catch (err) {
    next(err)
  }
}

export { getReaders, createReaders, updateReaders, deleteReaders }
