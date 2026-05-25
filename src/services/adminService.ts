import { request } from './http'
import type { AdminLoginInput, ApiResult, Comment } from '../types'

export function loginAdmin(input: AdminLoginInput): Promise<ApiResult<{ token: string }>> {
  return request<{ token: string }>('POST', '/api/admin/login', { body: input })
}

export function listAdminComments(token: string): Promise<ApiResult<Comment[]>> {
  return request<Comment[]>('GET', '/api/admin/comments', { token })
}

export function deleteAdminComment(token: string, commentId: string): Promise<ApiResult<null>> {
  return request<null>('DELETE', `/api/admin/comments/${commentId}`, { token })
}
