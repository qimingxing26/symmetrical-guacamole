import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AdminGuard from './components/AdminGuard'
import ScrollToTop from './components/ScrollToTop'
import AdminCommentsPage from './pages/AdminCommentsPage'
import AdminLoginPage from './pages/AdminLoginPage'
import HomePage from './pages/HomePage'
import ProjectDetailPage from './pages/ProjectDetailPage'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin/comments"
          element={
            <AdminGuard>
              <AdminCommentsPage />
            </AdminGuard>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
