'use strict'

const { verifyAdminToken } = require('../utils/token')

function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: '未授权' })
  }

  const token = authHeader.slice(7)
  const secret = process.env.ADMIN_TOKEN_SECRET

  if (!verifyAdminToken(token, secret)) {
    return res.status(401).json({ success: false, message: '未授权' })
  }

  next()
}

module.exports = { requireAdmin }
