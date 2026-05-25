# My Site 数据模型与接口说明

## 1. 数据范围

第一版只有评论进入数据库。

静态配置：

- 个人信息
- 作品信息
- 作品图片
- 社交链接

数据库保存：

- 访客评论

## 2. 作品数据

作品数据放在 `src/data/projects.ts`。

### 2.1 Project

```ts
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
```

`cover` 字段路径规范：封面图存放在 `public/covers/`，`cover` 值格式为 `/covers/xxx.jpg`（以 `/` 开头，省略 `public` 前缀）。前端引用时直接用 `project.cover` 作为 `<img src>`。

### 2.2 ProjectImage

摄影类作品使用 `images[]` 存放图片或视频。

```ts
export type ProjectImage = {
  src: string
  alt: string
  videoUrl?: string  // 有此字段则渲染 <video>，否则渲染 <img>
}
```

### 2.3 ID 命名规则

`id` 使用 `{category}-{slug}` 格式，稳定的 `id` 保证评论通过 `projectId` 正确关联。

| id | 作品 |
|---|---|
| `project-homepage` | 个人主页 |
| `project-ai` | ai小智 |
| `project-cup` | 智能水杯 |
| `photo-sky` | 光遇 |
| `photo-school` | 学校的风景 |
| `article-ninan` | 呢喃 |
| `article-taohua` | 桃花灼灼，君知我 |
| `article-zhuiyi` | 追忆 |

## 3. 个人信息

个人信息放在 `src/data/profile.ts`。

```ts
export type Profile = {
  name: string
  role: string
  about: string[]
  details: { label: string; value: string }[]
}
```

## 4. 评论集合

CloudBase 集合名：

```text
comments
```

字段：

```ts
export type Comment = {
  _id: string
  projectId: string
  nickname: string
  content: string
  createdAt: number
  updatedAt: number
}
```

第一版不设置 `status` 字段。评论提交后直接展示，后台只负责删除。

## 5. 评论校验规则

- `projectId` 不能为空，必须匹配已有作品的 `id`。
- `nickname` 不能为空，最长 20 个字符。
- `content` 不能为空，最长 500 个字符。
- 前端做体验校验，云函数必须再校验一次。

## 6. 接口入参与出参类型

### 6.1 统一响应格式

```ts
export type ApiResult<T> = {
  success: boolean
  data?: T
  message?: string
}
```

### 6.2 创建评论

```ts
export type CreateCommentInput = {
  projectId: string
  nickname: string
  content: string
}
```

- `POST /api/comments` 接收 `CreateCommentInput`，返回 `ApiResult<Comment>`（新创建的完整评论对象，前端直接插入列表顶部）。

### 6.3 获取评论

- `GET /api/comments?projectId=xxx` 返回 `ApiResult<Comment[]>`，按 `createdAt` 降序。
- `GET /api/admin/comments` 返回 `ApiResult<Comment[]>`（全部评论），需要 `Authorization: Bearer <token>`。

### 6.4 删除评论

- `DELETE /api/admin/comments/:id` 返回 `ApiResult<null>`，需要 `Authorization: Bearer <token>`。

### 6.5 管理员登录

```ts
export type AdminLoginInput = {
  username: string
  password: string
}
```

- `POST /api/admin/login` 接收 `AdminLoginInput`，成功返回 `ApiResult<{ token: string }>`，失败返回 `ApiResult<null>` + `message`。

## 7. API 清单

```text
GET    /api/health
GET    /api/comments?projectId=xxx
POST   /api/comments
POST   /api/admin/login
GET    /api/admin/comments
DELETE /api/admin/comments/:id
```

## 8. 管理员鉴权

- 管理员账号密码存在云函数环境变量。
- 登录成功后返回 token。
- 管理接口使用 `Authorization: Bearer <token>`。
- token 使用 HMAC-SHA256 签名。
- token 有过期时间，建议 24 小时。
