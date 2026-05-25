'use strict'

const express = require('express')
const { db } = require('../db')

const router = express.Router()

const VALID_PROJECT_IDS = [
  'project-homepage',
  'project-ai',
  'project-cup',
  'photo-sky',
  'photo-school',
  'article-ninan',
  'article-taohua',
  'article-zhuiyi',
]

// GET /api/comments?projectId=xxx
router.get('/api/comments', async (req, res) => {
  try {
    const projectId = typeof req.query.projectId === 'string' ? req.query.projectId.trim() : ''

    if (!projectId) {
      return res.json({ success: false, message: '项目 ID 不能为空' })
    }

    const result = await db
      .collection('comments')
      .where({ projectId })
      .orderBy('createdAt', 'desc')
      .get()

    return res.json({ success: true, data: result.data })
  } catch (err) {
    return res.json({ success: false, message: err.message || '查询评论失败' })
  }
})

// POST /api/comments
router.post('/api/comments', async (req, res) => {
  try {
    const { projectId, nickname, content } = req.body || {}
    console.log('[DEBUG] POST body parsed:', JSON.stringify({ projectId, nickname, content }))

    if (!projectId || typeof projectId !== 'string' || !projectId.trim()) {
      return res.json({ success: false, message: '项目 ID 不能为空' })
    }
    if (!VALID_PROJECT_IDS.includes(projectId.trim())) {
      return res.json({ success: false, message: '无效的项目 ID' })
    }
    if (!nickname || typeof nickname !== 'string' || !nickname.trim()) {
      return res.json({ success: false, message: '昵称不能为空' })
    }
    if (nickname.trim().length > 20) {
      return res.json({ success: false, message: '昵称最多 20 个字符' })
    }
    if (!content || typeof content !== 'string' || !content.trim()) {
      return res.json({ success: false, message: '评论内容不能为空' })
    }
    if (content.trim().length > 500) {
      return res.json({ success: false, message: '评论内容最多 500 个字符' })
    }

    const now = Date.now()
    const doc = {
      projectId: projectId.trim(),
      nickname: nickname.trim(),
      content: content.trim(),
      createdAt: now,
      updatedAt: now,
    }

    const result = await db.collection('comments').add(doc)

    return res.json({
      success: true,
      data: { _id: result.id, ...doc },
    })
  } catch (err) {
    return res.json({ success: false, message: err.message || '提交评论失败' })
  }
})

module.exports = router
