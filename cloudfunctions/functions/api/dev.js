'use strict'

const path = require('path')

try {
  require('dotenv').config({ path: path.join(__dirname, '../../../.env.local') })
} catch {
  console.warn('[api] dotenv not available, skip .env.local loading')
}

const app = require('./app')

const PORT = 3000
app.listen(PORT, () => {
  console.log(`[api] dev server running on http://localhost:${PORT}`)
})
