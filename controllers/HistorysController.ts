// controllers/cooperativeExpertController.ts
import { Request, Response, NextFunction } from 'express'
import { HistorysModel, History } from '../models/Historys'

let readers: History[] = []

// Get all experts

export const getHistorys = async (req: Request, res: Response, next: NextFunction) => {
  /**
     * #swagger.tags = ['歷史紀錄']
     * #swagger.description = '取得所有歷史紀錄'
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
    const cards = await HistorysModel.find()
    res.status(200).json({ code: 'success', data: cards })
  } catch (err) {
    next(err)
  }
}

// Create an expert
export const createHistorys = (req: Request, res: Response) => {
  /**
     * #swagger.tags = ['歷史紀錄']
     * #swagger.description = '建立歷史紀錄'
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

  const newExpert: History = {
    id: String(readers.length + 1),
    cardNum: '',
    name: '',
    accessDT: new Date(),
    createDT: new Date(),
    tags: [''],
    updateDT: new Date(),
    recvDT: new Date()
  }
  readers.push(newExpert)
  res.status(201).json(newExpert)
}

// Update an expert
export const updateHistorys = (req: Request, res: Response) => {
  /**
     * #swagger.tags = ['歷史紀錄']
     * #swagger.description = '更新歷史紀錄'
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
  const id = req.params.id

  const index = readers.findIndex((r) => r.id === id)
  if (index !== -1) {
    readers[index] = {
      ...readers[index]
    }
    res.json(readers[index])
  } else {
    res.status(404).json({ message: 'Expert not found' })
  }
}

// Delete an expert
export const deleteHistorys = (req: Request, res: Response) => {
  /**
     * #swagger.tags = ['歷史紀錄']
     * #swagger.description = '刪除歷史紀錄'
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
  const id = req.params.id
  readers = readers.filter((r) => r.id !== id)
  res.sendStatus(204)
}
