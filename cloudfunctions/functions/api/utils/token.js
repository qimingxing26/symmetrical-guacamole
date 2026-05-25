'use strict'

const crypto = require('crypto')

function base64url(text) {
  return Buffer.from(text).toString('base64url')
}

function base64urlDecode(text) {
  return Buffer.from(text, 'base64url').toString('utf8')
}

function signAdminToken(payload, secret) {
  const encodedPayload = base64url(JSON.stringify(payload))
  const signature = crypto
    .createHmac('sha256', secret)
    .update(encodedPayload)
    .digest('base64url')
  return `${encodedPayload}.${signature}`
}

function verifyAdminToken(token, secret) {
  if (!token || !secret) return false

  const parts = token.split('.')
  if (parts.length !== 2) return false

  const [encodedPayload, signature] = parts
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(encodedPayload)
    .digest('base64url')

  if (signature !== expectedSignature) return false

  try {
    const payload = JSON.parse(base64urlDecode(encodedPayload))
    if (!payload.exp || Date.now() > payload.exp) return false
  } catch {
    return false
  }

  return true
}

module.exports = { signAdminToken, verifyAdminToken }
