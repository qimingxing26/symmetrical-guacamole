import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

type AdminGuardProps = {
  children: ReactNode
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const token = localStorage.getItem('admin_token')
  if (!token) return <Navigate to="/admin/login" replace />
  return children
}
