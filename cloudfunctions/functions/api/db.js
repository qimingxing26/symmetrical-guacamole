'use strict'

const cloud = require('@cloudbase/node-sdk')

const app = cloud.init({
  env: process.env.ENV_ID,
  secretId: process.env.TENCENTCLOUD_SECRET_ID,
  secretKey: process.env.TENCENTCLOUD_SECRET_KEY,
})

const db = app.database()
const _ = db.command

module.exports = { db, _ }
