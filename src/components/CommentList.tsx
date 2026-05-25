import type { Comment } from '../types'

type CommentListProps = {
  comments: Comment[]
  loading?: boolean
  error?: string
  onRetry?: () => void
  newCommentId?: string
}

export default function CommentList({ comments, loading = false, error, onRetry, newCommentId }: CommentListProps) {
  if (loading) return <p className="comment-empty">加载中...</p>
  if (error) {
    return (
      <div className="comment-empty" style={{ color: '#b55a5a' }}>
        <p>{error}</p>
        {onRetry && (
          <button className="form-submit" style={{ marginTop: '0.75rem' }} onClick={onRetry}>
            重试
          </button>
        )}
      </div>
    )
  }
  if (comments.length === 0) {
    return <p className="comment-empty">还没有评论，来说点什么吧。</p>
  }

  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <div className={`comment${comment._id === newCommentId ? ' is-new' : ''}`} key={comment._id}>
          <div className="comment-head">
            <span className="comment-nickname">{comment.nickname}</span>
            <span className="comment-time">
              {new Date(comment.createdAt).toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          <p className="comment-content">{comment.content}</p>
        </div>
      ))}
    </div>
  )
}
