import { Link, useNavigate } from 'react-router-dom'

export default function AdminNav() {
  const navigate = useNavigate()

  function logout() {
    localStorage.removeItem('admin_token')
    navigate('/')
  }

  return (
    <div className="admin-header">
      <div className="header-inner">
        <span className="header-title">评论管理</span>
        <div className="header-actions">
          <Link to="/" className="header-home">Home</Link>
          <button className="logout-btn" type="button" onClick={logout}>退出登录</button>
        </div>
      </div>
    </div>
  )
}
