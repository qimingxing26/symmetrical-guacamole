import { useState } from 'react'
import { createComment } from '../services/commentService'
import type { Comment } from '../types'

type CommentFormProps = {
  projectId: string
  onSuccess: (comment: Comment) => void
}

export default function CommentForm({ projectId, onSuccess }: CommentFormProps) {
  const [nickname, setNickname] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    const res = await createComment({
      projectId,
      nickname: nickname.trim(),
      content: content.trim(),
    })

    setSubmitting(false)

    if (res.success && res.data) {
      onSuccess(res.data)
      setNickname('')
      setContent('')
    } else {
      setError(res.message || '提交失败，请稍后再试')
    }
  }

  return (
    <div className="comment-form">
      <p className="comment-form-title">发表评论</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="nickname">昵称</label>
          <input
            className="form-input"
            id="nickname"
            type="text"
            placeholder="你的昵称"
            maxLength={20}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <p className="form-hint">最多 20 个字符</p>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="content">评论内容</label>
          <textarea
            className="form-textarea"
            id="content"
            placeholder="写下你的想法……"
            maxLength={500}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <p className="form-hint">最多 500 个字符</p>
        </div>
        {error && <p style={{ color: '#b55a5a', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{error}</p>}
        <button className="form-submit" type="submit" disabled={submitting}>
          {submitting ? '提交中...' : '提交评论'}
        </button>
      </form>
    </div>
  )
}
