import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import CommentForm from '../components/CommentForm'
import CommentList from '../components/CommentList'
import Footer from '../components/Footer'
import NavBar from '../components/NavBar'
import { projects } from '../data/projects'
import { listComments } from '../services/commentService'
import type { Comment } from '../types'

export default function ProjectDetailPage() {
  const { id } = useParams()
  const project = projects.find((item) => item.id === id)

  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [newCommentId, setNewCommentId] = useState('')

  const doFetch = () => {
    if (!project) return
    setLoading(true)
    setError('')
    listComments(project.id).then((res) => {
      if (res.success && res.data) {
        setComments(res.data)
      } else {
        setError(res.message || '加载失败')
      }
      setLoading(false)
    })
  }

  const handleCommentSuccess = (comment: Comment) => {
    setComments((prev) => [comment, ...prev])
    setNewCommentId(comment._id)
    setTimeout(() => setNewCommentId(''), 2100)
  }

  useEffect(() => {
    if (!project) return
    listComments(project.id).then((res) => {
      if (res.success && res.data) {
        setComments(res.data)
      } else {
        setError(res.message || '加载失败')
      }
      setLoading(false)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.id])

  if (!project) {
    return (
      <div className="page-shell">
        <NavBar variant="back" />
        <main className="article">
          <h1>作品不存在</h1>
          <Link to="/">返回首页</Link>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="page-shell">
      <NavBar variant="back" />

      <main>
        <article className="article">
          <div className="article-header">
            <h1 className="article-title">{project.title}</h1>
            <div className="article-meta">
              <span>{project.year}</span>
              <span className="article-tags">
                {project.tags.map((tag) => (
                  <span className="article-tag" key={tag}>{tag}</span>
                ))}
              </span>
            </div>
          </div>

          <div className="article-divider" />

          {project.cover && (
            <img className="article-cover" src={project.cover} alt={project.title} />
          )}

          <div className="article-body">
            {project.content.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}

            {project.images && project.images.length > 0 && (
              <div className="photo-grid">
                {project.images.map((item) =>
                  item.videoUrl ? (
                    <div className="video-wrapper" key={item.src}>
                      <video
                        src={item.videoUrl}
                        controls
                        preload="metadata"
                        className="video-player"
                      >
                        您的浏览器不支持视频播放。
                      </video>
                      <p className="video-label">{item.alt}</p>
                    </div>
                  ) : (
                    <img
                      key={item.src}
                      className="photo-item"
                      src={item.src}
                      alt={item.alt}
                    />
                  ),
                )}
              </div>
            )}
          </div>
        </article>

        <section className="comments-section" id="comments">
          <h2 className="comments-header">
            Comments <span className="comments-count">({comments.length} 条评论)</span>
          </h2>

          <CommentList comments={comments} loading={loading} error={error} onRetry={doFetch} newCommentId={newCommentId} />

          <CommentForm projectId={project.id} onSuccess={handleCommentSuccess} />
        </section>
      </main>

      <Footer />
    </div>
  )
}
