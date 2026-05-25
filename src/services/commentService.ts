import { request } from './http'
import type { ApiResult, Comment, CreateCommentInput } from '../types'

export function listComments(projectId: string): Promise<ApiResult<Comment[]>> {
  return request<Comment[]>('GET', `/api/comments?projectId=${encodeURIComponent(projectId)}`)
}

export function createComment(input: CreateCommentInput): Promise<ApiResult<Comment>> {
  return request<Comment>('POST', '/api/comments', { body: input })
}
