import express from 'express'
import bcrypt from 'bcrypt'
import UserModal from '../models/User'
import authMiddleware from '../middleware/authMiddleware'
import { getJWTtoken, verifyJWTtoken } from '../utils/jwt'
import { sendMail } from '../service/sendMail'

const router = express.Router()

// 註冊
router.post('/sign-up', async function (req, res) {
  /**
     * #swagger.tags = ['管理者']
     * #swagger.description = '管理者註冊'
     * #swagger.security = [{
        token: []
       }]
     * #swagger.parameters['body'] = {
        in: 'body',
        description: '管理者註冊',
        type: 'object',
        required: true,
        schema: {
          $email: 'elsa@gmail.com',
          $password: 'abc123456',
          nickName: 'elsa'
        }
       }
     * #swagger.responses[200] = {
        description: '登入成功',
        schema: {
          "status": "success",
          "message": "註冊成功",
        },
       }
     * #swagger.responses[400] = {
        description: '註冊失敗',
        schema: {
          "status": "error",
          "message": "請輸入Email | 請輸入有效的Email | 請輸入Password | 密碼至少需要 8 位數 | 這個 Email 已經被註冊過了"
        },
       }
     *
     */
  try {
    // console.log(req)
    console.log(req.body)
    const { email, password, nickName } = req.body

    if (!email) {
      res.status(400).json({
        status: 'error',
        message: '請輸入Email'
      })
      return
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        res.status(400).json({
          status: 'error',
          message: '請輸入有效的Email'
        })
        return
      }
    }

    if (!password) {
      res.status(400).json({
        status: 'error',
        message: '請輸入Password'
      })
      return
    } else {
      // 密碼長度需大於 8
      if (password.length < 8) {
        res.status(400).json({
          status: 'error',
          message: '密碼至少需要 8 位數'
        })
        return
      }
    }

    const userData = await UserModal.findOne({ email })
    if (userData) {
      res.status(400).json({
        status: 'error',
        message: '這個 Email 已經被註冊過了'
      })
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const data = {
      email,
      nickName,
      password: hashedPassword
    }

    const result = await UserModal.create(data)
    const { _id, nickName: resNickName, email: resEmail } = result
    res.status(200).json({
      status: 'success',
      message: '註冊成功',
      results: {
        id: _id,
        email: resEmail,
        nickName: resNickName
      }
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: '伺服器錯誤'
    })
  }
})

// 登入
router.post('/login', async function (req, res) {
  /**
     * #swagger.tags = ['管理者']
     * #swagger.description = '管理者登入'
     * #swagger.security = [{
        token: []
       }]
     * #swagger.parameters['body'] = {
        in: 'body',
        description: '管理者登入',
        type: 'object',
        required: true,
        schema: {
          $email: 'elsa@gmail.com',
          $password: 'abc123456',
        }
       }
     * #swagger.responses[200] = {
        description: '登入成功',
        schema: {
          "status": "success",
          "message": "登入成功",
          "results": {
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVsc2FAZ21haWwuY29tIiwiYXV0aCI6MCwiaWF0IjoxNzE1MTAwODQxLCJleHAiOjE3MTUxODcyNDF9.iENpkK1osDQguIKY2oAmDkzuSo049qtWQlG0SwzSnTY",
            expires: 1615108416,
            avatar: "https://fakeimg.pl/300/",
            auth: 0
          }
        },
       }
     * #swagger.responses[400] = {
        description: '登入失敗',
        schema: {
          "status": "error",
          "message": "請輸入Email | 請輸入有效的Email | 請輸入Password | 密碼錯誤 | 這個 Email 尚未註冊"
        },
       }
     *
     */
  try {
    const { email, password } = req.body

    if (!email) {
      res.status(400).json({
        status: 'error',
        message: '請輸入Email'
      })
      return
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        res.status(400).json({
          status: 'error',
          message: '請輸入有效的Email'
        })
        return
      }
    }

    if (!password) {
      res.status(400).json({
        status: 'error',
        message: '請輸入Password'
      })
      return
    }

    const userData = await UserModal.findOne({ email })
    if (userData) {
      const isPasswordValid = await bcrypt.compare(`${password}`, userData.password)

      if (isPasswordValid) {
        const token = getJWTtoken(userData.auth || 0, userData.id)

        res.status(200).json({
          status: 'success',
          message: '登入成功',
          results: {
            token,
            expires: Math.floor(Date.now() / 1000) + 86400,
            avatar: userData.avatar,
            auth: userData.auth
          }
        })
      } else {
        res.status(400).json({
          status: 'error',
          message: '密碼錯誤'
        })
      }
    } else {
      res.status(400).json({
        status: 'error',
        message: '這個 Email 尚未註冊'
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 'error',
      message: '伺服器錯誤'
    })
  }
})

// 確認登入
router.post('/check-member', async function (req, res) {
  /**
     * #swagger.tags = ['管理者']
     * #swagger.description = '確認登入'
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
    const { authorization, Authorization } = req.headers
    const auth = authorization || Authorization || ''
    if (!auth) {
      res.status(401).json({
        status: 'error',
        message: '身分驗證失敗，請重新登入'
      })
    } else {
      const token = String(auth).replace('Bearer ', '')
      try {
        await verifyJWTtoken(token)
        res.status(200).json({
          status: 'success',
          message: '登入成功'
        })
      } catch (error) {
        res.status(401).json({
          status: 'error',
          message: '身分驗證失敗，請重新登入'
        })
      }
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 'error',
      message: '伺服器錯誤'
    })
  }
})

router.post('/forget-password', async function (req, res) {
  /**
     * #swagger.tags = ['管理者']
     * #swagger.description = '忘記密碼'
     * #swagger.security = [{
        token: []
       }]
     * #swagger.parameters['body'] = {
        in: 'body',
        description: '忘記密碼',
        type: 'object',
        required: true,
        schema: {
          $email: 'elsa@gmail.com',
        }
       }
     * #swagger.responses[200] = {
        description: '成功',
        schema: {
          "status": "success",
          "message": "新密碼已寄出，請查看您的信箱",
        },
       }
     * #swagger.responses[400] = {
        description: '重設密碼失敗',
        schema: {
          "status": "error",
          "message": "請輸入Email | 無此會員"
        },
       }
     *
     */
  const { email } = req.body
  if (!email) return res.status(400).json({ status: 'error', message: '請輸入Email' })

  try {
    const userData = await UserModal.findOne({ email })
    if (userData) {
      const newPassword = generatePassword(10)
      const hashedPassword = await bcrypt.hash(newPassword, 10)
      const updated = await UserModal.findOneAndUpdate({ _id: userData._id }, { password: hashedPassword })

      if (updated) {
        const MailInfo = await sendMail({
          to: email,
          subject: '門禁系統 - 重設密碼',
          text: `親愛的用戶您好，您的新密碼是${newPassword}`
        })
        console.log(MailInfo)
        res.status(200).json({
          status: 'success',
          message: '新密碼已寄出，請查看您的信箱'
        })
      }
    } else {
      res.status(400).json({
        status: 'error',
        message: '無此會員'
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 'error',
      message: '伺服器錯誤'
    })
  }
})

// 取得會員資料
router.get('/', authMiddleware, async function (req, res) {
  /**
     * #swagger.tags = ['管理者']
     * #swagger.description = '取得管理者資料'
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
        description: '成功取得管理者資料',
        schema: {
          "status": "success",
          "message": "成功取得管理者資料",
          "results": {
            "email": "elsa@gmail.com",
            "auth": 0,
            "nickName": "Elsa",
            "userName": "",
            "gender": 0,
            "phone": "",
            "address": "",
            "teamName": "",
            "aboutMe": "",
            "avatar": "",
            "createTime": 1715098808,
            "updateTime": 1715098808,
            "id": "663a54b8c9225d0f16b55020"
          }
        },
       }
     * #swagger.responses[400] = {
        description: '取得管理者資料失敗',
        schema: {
          "status": "error",
          "message": "無此管理者"
        },
       }
     *
     */
  try {
    const { id } = (req as any).user

    const userData = await UserModal.findOne({ _id: id }, { password: 0 })

    if (userData) {
      res.status(200).json({
        status: 'success',
        message: '成功取得會員資料',
        results: userData
      })
    } else {
      res.status(400).json({
        status: 'error',
        message: '無此會員'
      })
    }
  } catch (error) {
    console.log(error)

    res.status(500).json({
      status: 'error',
      message: '伺服器錯誤'
    })
  }
})

// 修改會員資料
router.patch('/', authMiddleware, async function (req, res) {
  /**
     * #swagger.tags = ['管理者']
     * #swagger.description = '修改管理者資料'
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
 * #swagger.parameters['body'] = {
        in: 'body',
        description: '修改管理者資料<br>*只會更新body有帶的key',
        type: 'object',
        required: true,
        schema: {
          nickName: "Elsa",
          userName: "",
          gender: 0,
          phone: "",
          address: "",
          teamName: "",
          aboutMe: "",
          avatar: "",
        }
       }
     * #swagger.responses[200] = {
        description: '修改管理者資料',
        schema: {
          "status": "success",
          "message": "修改管理者資料成功",
          "results": {
            "email": "elsa@gmail.com",
            "auth": 0,
            "nickName": "Elsa",
            "userName": "",
            "gender": 0,
            "phone": "",
            "address": "",
            "teamName": "",
            "aboutMe": "",
            "avatar": "",
            "createTime": 1715098808,
            "updateTime": 1715098808,
            "id": "663a54b8c9225d0f16b55020"
          }
        },
       }
     * #swagger.responses[400] = {
        description: '修改管理者資料失敗',
        schema: {
          "status": "error",
          "message": "無此管理者 || 修改失敗"
        },
       }
     *
     */
  try {
    const { id } = (req as any).user
    const { nickName, userName, gender, phone, address, teamName, aboutMe, avatar } = req.body
    const payload = {
      nickName,
      userName,
      gender,
      phone,
      address,
      teamName,
      aboutMe,
      avatar
    }
    // 更新會員資料
    const updateData = await await UserModal.findOneAndUpdate({ _id: id }, payload, { new: true }).select('-password')

    res.status(200).json({
      status: 'success',
      message: '更新管理者資料成功',
      results: updateData
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      status: 'error',
      message: '更新管理者資料失敗'
    })
  }
})

function generatePassword(length: number) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

export default router
