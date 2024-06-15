// controllers/cardsController.ts
import { Request, Response, NextFunction } from 'express'
import { CardsModel } from '../models/Cards'

const getCards = async (req: Request, res: Response, next: NextFunction) => {
  /**
   * #swagger.tags = ['卡片清單']
   * #swagger.description = '取得卡片清單'
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
   * #swagger.responses[200] = {
      description: '成功',
      schema: {
        code: 'success',
        data: [
          {
            _id: '60d0fe4f5311236168a109ca',
            cardNum: '001',
            Name: 'Sample Card',
            createDT: '2021-06-21T10:28:47.713Z',
            updateDT: '2021-06-21T10:28:47.713Z'
          }
        ]
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
    const cards = await CardsModel.find()
    res.status(200).json({ code: 'success', data: cards })
  } catch (err) {
    next(err)
  }
}

const createCards = async (req: Request, res: Response, next: NextFunction) => {
  /**
   * #swagger.tags = ['卡片清單']
   * #swagger.description = '新增卡片清單'
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
      description: '卡片資料',
      required: true,
      schema: {
        cardNum: '001',
        Name: 'Sample Card'
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
    const { Name, cardNum } = req.body
    const newCard = new CardsModel({ cardNum, Name })
    await newCard.save()
    res.status(201).json({ code: 'success', data: newCard })
  } catch (err) {
    next(err)
  }
}

const updateCards = async (req: Request, res: Response, next: NextFunction) => {
  /**
   * #swagger.tags = ['卡片清單']
   * #swagger.description = '更新卡片清單'
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
   * #swagger.parameters['id'] = {
      in: 'path',
      name: 'id',
      description: '卡片ID',
      required: true,
      type: 'string'
    }
   * #swagger.parameters['body'] = {
      in: 'body',
      name: 'body',
      description: '卡片資料',
      required: true,
      schema: {
        cardNum: '001',
        Name: 'Updated Card'
      }
    }
   * #swagger.responses[200] = {
      description: '成功',
      schema: {
        code: 'success',
        data: {
          _id: '60d0fe4f5311236168a109ca',
          cardNum: '001',
          Name: 'Updated Card',
          createDT: '2021-06-21T10:28:47.713Z',
          updateDT: '2021-06-21T10:28:47.713Z'
        }
      }
    }
   * #swagger.responses[404] = {
      description: '找不到卡片',
      schema: {
        code: 'error',
        message: '找不到此卡片'
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
    const { id } = req.params
    const { labelName } = req.body
    const updatedCard = await CardsModel.findByIdAndUpdate(id, { labelName }, { new: true })
    if (!updatedCard) {
      return res.status(404).json({ code: 'error', msg: '找不到此房屋徵狀' })
    }
    res.status(200).json({ code: 'success', data: updatedCard })
  } catch (err) {
    next(err)
  }
}

const deleteCards = async (req: Request, res: Response, next: NextFunction) => {
  /**
   * #swagger.tags = ['卡片清單']
   * #swagger.description = '刪除卡片'
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
   * #swagger.parameters['id'] = {
      in: 'path',
      name: 'id',
      description: '卡片ID',
      required: true,
      type: 'string'
    }
   * #swagger.responses[200] = {
      description: '成功',
      schema: {
        code: 'success',
        data: {
          _id: '60d0fe4f5311236168a109ca',
          cardNum: '001',
          Name: 'Deleted Card',
          createDT: '2021-06-21T10:28:47.713Z',
          updateDT: '2021-06-21T10:28:47.713Z'
        }
      }
    }
   * #swagger.responses[404] = {
      description: '找不到卡片',
      schema: {
        code: 'error',
        message: '找不到此卡片'
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
    const { id } = req.params
    const deletedCard = await CardsModel.findByIdAndDelete(id)
    if (!deletedCard) {
      return res.status(404).json({ code: 'error', msg: '找不到此房屋徵狀' })
    }
    res.status(200).json({ code: 'success', data: deletedCard })
  } catch (err) {
    next(err)
  }
}

export { getCards, createCards, updateCards, deleteCards }
