'use strict'

const app = require('./app')

module.exports.main = require('serverless-http')(app)
