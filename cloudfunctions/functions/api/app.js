'use strict'

const express = require('express')

const app = express()

// Debug: log raw request body encoding before body-parser consumes it
app.use((req, res, next) => {
  const chunks = []
  req.on('data', (chunk) => {
    chunks.push(chunk)
  })
  req.on('end', () => {
    if (chunks.length > 0) {
      const raw = Buffer.concat(chunks)
      console.log('[DEBUG] raw body hex (first 200 bytes):', raw.slice(0, 200).toString('hex'))
      console.log('[DEBUG] raw body utf8 (first 200 bytes):', raw.slice(0, 200).toString('utf8'))
    }
  })
  next()
})

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  if (req.method === 'OPTIONS') return res.status(204).end()
  next()
})

app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ success: true, data: 'ok' })
})

app.use(require('./routes/comments'))
app.use(require('./routes/admin'))

module.exports = app
