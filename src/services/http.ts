import type { ApiResult } from '../types'

type RequestOptions = {
  body?: unknown
  token?: string
}

const baseURL = import.meta.env.VITE_API_BASE || ''

export async function request<T>(
  method: string,
  path: string,
  options: RequestOptions = {},
): Promise<ApiResult<T>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json; charset=utf-8',
  }

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`
  }

  try {
    const response = await fetch(baseURL + path, {
      method,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    })

    if (!response.ok) {
      return { success: false, message: `请求失败 (${response.status})` }
    }

    return await response.json() as ApiResult<T>
  } catch {
    return { success: false, message: '网络错误，请稍后再试' }
  }
}
