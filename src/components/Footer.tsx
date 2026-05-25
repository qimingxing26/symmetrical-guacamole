import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <p>&copy; 2026 黄启贺 &nbsp;&middot;&nbsp; <Link to="/admin/login">Admin</Link></p>
    </footer>
  )
}
