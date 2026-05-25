export type ProjectImage = {
  src: string
  alt: string
  videoUrl?: string
}

export type Project = {
  id: string
  title: string
  description: string
  content: string[]
  cover: string
  tags: string[]
  year?: string
  category?: string
  images?: ProjectImage[]
}

export type Comment = {
  _id: string
  projectId: string
  nickname: string
  content: string
  createdAt: number
  updatedAt: number
}

export type ApiResult<T> = {
  success: boolean
  data?: T
  message?: string
}

export type CreateCommentInput = {
  projectId: string
  nickname: string
  content: string
}

export type AdminLoginInput = {
  username: string
  password: string
}

export type Profile = {
  name: string
  role: string
  about: string[]
  details: { label: string; value: string }[]
}
