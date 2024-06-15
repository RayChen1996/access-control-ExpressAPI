// controllers/cooperativeExpertController.ts
import { Request, Response, NextFunction } from 'express'
import { HistorysModel, History } from '../models/Historys'
import { ReadersModel } from '../models/Readers'
import mongoose from 'mongoose'
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
export const createHistorys = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['歷史紀錄']
   * #swagger.description = '新增歷史紀錄'
   * #swagger.security = [{
      "Bearer": []
     }]
   * #swagger.parameters['Authorization'] = {
      in: 'header',
      name: 'Authorization',
      description: 'Bearer token',
      required: true,
      type: 'string'
    }
   * #swagger.parameters['body'] = {
      in: 'body',
      name: 'body',
      description: '歷史紀錄',
      required: true,
      schema: {
          cardNum: "0000666666",
          reader: {
              id: "",
              name: "",
              connection: {
                ip: "192.168.10.89",
                port: 4444
              },
          },
          name: "TEST",
      }
    }
   * #swagger.responses[201] = {
      description: '成功',
      schema: {
        code: 'success',
        data: {
          _id: '60d0fe4f5311236168a109ca',
          cardNum: '001',
          Name: 'Sample Card',
          createDT: '2021-06-21T10:28:47.713Z',
          updateDT: '2021-06-21T10:28:47.713Z'
        }
      }
    }
   * #swagger.responses[401] = {
      description: '身分驗證失敗，請重新登入',
      schema: {
        code: 'error',
        message: '身分驗證失敗，請重新登入'
      }
    }
   */

  try {
    const { cardNum, name, reader } = req.body

    console.log('打印 ', reader.id)
    // 確認讀卡機存在
    const _reader = await ReadersModel.findById(reader.id)
    if (!_reader) {
      return res.status(404).json({ status: 'error', message: '讀卡機不存在' })
    }

    const newHistory = new HistorysModel({
      id: new mongoose.Types.ObjectId(), // 使用 MongoDB 生成的 ObjectId
      cardNum,
      name,
      reader: reader.id, // 關聯的 Reader _id
      accessDT: new Date(),
      createDT: new Date(),
      recvDT: new Date(),
      updateDT: new Date()
    })

    await newHistory.save()

    res.status(201).json({ status: 'success', message: '歷史紀錄創建成功', data: newHistory })
  } catch (error) {
    console.error(error)
    res.status(500).json({ status: 'error', message: '伺服器錯誤' })
  }
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
