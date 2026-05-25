'use strict'

const express = require('express')
const { requireAdmin } = require('../middleware/auth')
const { signAdminToken } = require('../utils/token')
const { db } = require('../db')

const router = express.Router()

router.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body || {}

  if (!username || !password) {
    return res.json({ success: false, message: '账号和密码不能为空' })
  }

  const adminUser = process.env.ADMIN_USERNAME
  const adminPass = process.env.ADMIN_PASSWORD
  const tokenSecret = process.env.ADMIN_TOKEN_SECRET

  if (!adminUser || !adminPass || !tokenSecret) {
    return res.json({ success: false, message: '服务端配置缺失，请联系管理员' })
  }

  if (username !== adminUser || password !== adminPass) {
    return res.json({ success: false, message: '账号或密码错误' })
  }

  const token = signAdminToken({ exp: Date.now() + 24 * 60 * 60 * 1000 }, tokenSecret)

  return res.json({ success: true, data: { token } })
})

router.get('/api/admin/comments', requireAdmin, async (req, res) => {
  try {
    const result = await db.collection('comments').orderBy('createdAt', 'desc').get()
    return res.json({ success: true, data: result.data })
  } catch (err) {
    return res.json({ success: false, message: err.message || '查询评论失败' })
  }
})

router.delete('/api/admin/comments/:id', requireAdmin, async (req, res) => {
  const { id } = req.params

  if (!id) {
    return res.json({ success: false, message: '评论 ID 不能为空' })
  }

  try {
    await db.collection('comments').doc(id).remove()
    return res.json({ success: true, data: null })
  } catch (err) {
    return res.json({ success: false, message: err.message || '删除评论失败' })
  }
})

module.exports = router
