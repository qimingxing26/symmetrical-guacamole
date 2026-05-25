import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
import NavBar from '../components/NavBar'
import { loginAdmin } from '../services/adminService'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    const res = await loginAdmin({ username: username.trim(), password })

    setSubmitting(false)

    if (res.success && res.data) {
      localStorage.setItem('admin_token', res.data.token)
      navigate('/admin/comments')
    } else {
      setError(res.message || '账号或密码错误，请重试。')
    }
  }

  return (
    <div className="page-shell">
      <NavBar variant="back" />

      <main className="login-wrapper">
        <div className="login-card">
          <h1 className="login-title">管理员登录</h1>
          <p className="login-subtitle">请输入账号和密码</p>

          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="username">账号</label>
              <input
                className="form-input"
                id="username"
                type="text"
                placeholder="请输入管理员账号"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="password">密码</label>
              <input
                className="form-input"
                id="password"
                type="password"
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className="login-submit" type="submit" disabled={submitting}>
              {submitting ? '登录中...' : '登 录'}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}
