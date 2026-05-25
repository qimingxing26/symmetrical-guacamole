import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminNav from '../components/AdminNav'
import Footer from '../components/Footer'
import { projects } from '../data/projects'
import { deleteAdminComment, listAdminComments } from '../services/adminService'
import type { Comment } from '../types'

function getToken() {
  return localStorage.getItem('admin_token') || ''
}

function getProjectTitle(projectId: string) {
  return projects.find((p) => p.id === projectId)?.title || projectId
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function AdminCommentsPage() {
  const navigate = useNavigate()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedProject, setSelectedProject] = useState('')

  const [modalComment, setModalComment] = useState<Comment | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState('')

  const doFetch = () => {
    const token = getToken()
    if (!token) {
      navigate('/admin/login')
      return
    }
    setLoading(true)
    setError('')
    listAdminComments(token).then((res) => {
      if (res.success && res.data) {
        setComments(res.data)
      } else {
        const msg = res.message || '加载失败'
        setError(msg)
        if (msg.includes('401') || msg.includes('未授权')) {
          localStorage.removeItem('admin_token')
          navigate('/admin/login')
        }
      }
      setLoading(false)
    })
  }

  useEffect(() => {
    const token = getToken()
    if (!token) {
      navigate('/admin/login')
      return
    }
    listAdminComments(token).then((res) => {
      if (res.success && res.data) {
        setComments(res.data)
      } else {
        const msg = res.message || '加载失败'
        setError(msg)
        if (msg.includes('401') || msg.includes('未授权')) {
          localStorage.removeItem('admin_token')
          navigate('/admin/login')
        }
      }
      setLoading(false)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2000)
  }

  const openModal = (comment: Comment) => {
    setModalComment(comment)
  }

  const closeModal = () => {
    if (!deleting) setModalComment(null)
  }

  const confirmDelete = () => {
    if (!modalComment) return
    const token = getToken()
    setDeleting(true)
    const commentId = modalComment._id
    deleteAdminComment(token, commentId).then((res) => {
      setDeleting(false)
      if (res.success) {
        setComments((prev) => prev.filter((c) => c._id !== commentId))
        setModalComment(null)
        showToast('评论已删除')
      } else {
        const msg = res.message || '删除失败'
        if (msg.includes('401') || msg.includes('未授权')) {
          localStorage.removeItem('admin_token')
          navigate('/admin/login')
        } else {
          setModalComment(null)
          showToast(msg)
        }
      }
    })
  }

  const filteredComments = selectedProject
    ? comments.filter((c) => c.projectId === selectedProject)
    : comments

  return (
    <div className="page-shell">
      <AdminNav />

      <main className="admin-main">
        <div className="filter-bar">
          <span className="filter-label">筛选作品：</span>
          <select
            className="filter-select"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            <option value="">全部作品</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
          <span className="filter-count">共 {filteredComments.length} 条评论</span>
        </div>

        {loading ? (
          <p className="comment-empty">加载中...</p>
        ) : error ? (
          <div className="comment-empty" style={{ color: '#b55a5a' }}>
            <p>{error}</p>
            <button className="form-submit" style={{ marginTop: '0.75rem' }} onClick={doFetch}>
              重试
            </button>
          </div>
        ) : filteredComments.length === 0 ? (
          <p className="comment-empty">暂无评论</p>
        ) : (
          <div className="comment-list">
            {filteredComments.map((comment) => (
              <div className="comment-row" key={comment._id}>
                <div className="comment-info">
                  <div className="comment-meta-line">
                    <span className="comment-project">{getProjectTitle(comment.projectId)}</span>
                    <span className="comment-nickname">{comment.nickname}</span>
                    <span className="comment-time">{formatTime(comment.createdAt)}</span>
                  </div>
                  <p className="comment-text">{comment.content}</p>
                </div>
                <button
                  className="delete-btn"
                  type="button"
                  onClick={() => openModal(comment)}
                >
                  删除
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {toast && <div className={`toast${toast ? ' show' : ''}`}>{toast}</div>}

      {modalComment && (
        <div
          className={`modal-overlay${modalComment ? ' show' : ''}`}
          onClick={closeModal}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">确认删除</h3>
            <p className="modal-desc">删除后将无法恢复，确定要删除这条评论吗？</p>
            <div className="modal-preview">
              <strong>{modalComment.nickname}</strong>：{modalComment.content}
            </div>
            <div className="modal-actions">
              <button
                className="modal-cancel"
                type="button"
                onClick={closeModal}
                disabled={deleting}
              >
                取消
              </button>
              <button
                className="modal-confirm"
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting ? '删除中...' : '确认删除'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
