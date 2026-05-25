# My Site 架构说明

> 本文档说明项目结构、文件职责和数据流。页面交互见 DESIGN.md，数据字段见 DATA_MODEL.md。

## 1. 开发基线

**脚手架已有代码是稳定基线，所有开发基于现有文件渐进式修改，不删除 `src/` 重写。**

当前已有：
- `src/pages/` 四个页面组件（HomePage, ProjectDetailPage, AdminLoginPage, AdminCommentsPage）
- `src/components/` 通用组件（NavBar, Footer, ProjectCard, CommentForm, CommentList, AdminGuard）
- `src/services/` HTTP 调用封装（http.ts, commentService.ts, adminService.ts）
- `src/data/` 静态数据（projects.ts, profile.ts）
- `src/types/` TypeScript 类型定义
- `cloudfunctions/functions/api/` Express 云函数骨架

## 2. 总体架构

```
浏览器
  → React 页面 (src/pages/)
  → Service 层 (src/services/)
  → /api 请求
      [开发] Vite proxy → localhost:3000
      [生产] HTTP 触发器 → CloudBase 云函数
  → Express app (cloudfunctions/functions/api/app.js)
  → CloudBase SDK → comments 集合
```

## 3. 双运行时边界

| | 前端 | 后端 |
|---|---|---|
| 运行时 | Vite / 浏览器 ESM | Node.js 20 CommonJS |
| 模块语法 | `import` / `export` | `require()` / `module.exports` |
| 类型系统 | TypeScript (`src/types/`) | JSDoc 或纯 JS |
| 入口 | `src/main.tsx` | `cloudfunctions/functions/api/index.js` |
| 包管理 | `package.json` (root) | `cloudfunctions/functions/api/package.json` |

**规则：前端代码不写 `require()`，后端代码不写 `import`。**

## 4. 文件职责

### 4.1 前端 `src/`

| 目录/文件 | 职责 | 约束 |
|---|---|---|
| `src/pages/` | 页面级组件，负责布局组合 | 不直接写 fetch，不直接操作 DOM |
| `src/components/` | 可复用 UI 组件 | 接收 props，触发回调，不调 service |
| `src/services/` | 所有 HTTP 请求封装 | 页面只能通过这里调用 API |
| `src/data/` | 静态内容（作品、个人信息） | 不进数据库，手动编辑 |
| `src/types/` | TypeScript 类型定义 | 前端唯一类型来源 |
| `src/styles/` | 全局 CSS | 组件级样式优先内联或 CSS Module |

### 4.2 后端 `cloudfunctions/functions/api/`

| 文件 | 职责 |
|---|---|
| `index.js` | CloudBase 入口，`serverless-http` 包装 Express |
| `app.js` | Express 实例：CORS、JSON 解析、路由挂载 |
| `dev.js` | 本地开发服务器（读 `.env.local`，端口 3000） |
| `db.js` | CloudBase SDK 初始化 |
| `routes/comments.js` | 公开评论接口 |
| `routes/admin.js` | 管理员登录 + 评论管理接口 |
| `middleware/auth.js` | Bearer token 验证中间件 |
| `utils/token.js` | HMAC-SHA256 token 签发/校验 |

## 5. 数据流

### 5.1 读取评论（访客）

```
ProjectDetailPage
  → commentService.getComments(projectId)
  → GET /api/comments?projectId=xxx
  → CloudBase comments 集合查询
  → 返回 Comment[]（按 createdAt 降序）
  → CommentList 渲染
```

### 5.2 提交评论（访客）

```
CommentForm
  → commentService.createComment(input)
  → POST /api/comments
  → 云函数校验 → 写入 comments 集合
  → 返回新创建的 Comment 对象
  → 直接插入列表顶部（不重新 GET 全量）
```

### 5.3 管理员登录

```
AdminLoginPage
  → adminService.login(input)
  → POST /api/admin/login
  → 校验环境变量中的账号密码
  → 返回 { token }
  → localStorage.setItem('admin_token', token)
  → navigate('/admin/comments')
```

### 5.4 管理员查看/删除评论

```
AdminCommentsPage（AdminGuard 包裹）
  → adminService.listComments()
  → GET /api/admin/comments (Authorization: Bearer <token>)
  → 返回全部 Comment[]（按 createdAt 降序）

删除：
  → adminService.deleteComment(id)
  → DELETE /api/admin/comments/:id (Authorization: Bearer <token>)
  → 从 comments 集合删除
  → 行从 DOM 移除，Toast 反馈
```

### 5.5 401 处理

任何 API 返回 401 → `localStorage.removeItem('admin_token')` → `navigate('/admin/login')`

## 6. 环境变量归属

| 变量 | 位置 | 说明 |
|---|---|---|
| `VITE_API_BASE` | 前端 `.env.local` | API 地址，本地开发留空走 Vite proxy |
| `ENV_ID` | 云函数 `.env.local` | CloudBase 环境 ID |
| `TENCENTCLOUD_SECRET_ID` | 云函数 `.env.local` | 腾讯云密钥 |
| `TENCENTCLOUD_SECRET_KEY` | 云函数 `.env.local` | 腾讯云密钥 |
| `ADMIN_USERNAME` | 云函数 `.env.local` | 管理员账号 |
| `ADMIN_PASSWORD` | 云函数 `.env.local` | 管理员密码 |
| `ADMIN_TOKEN_SECRET` | 云函数 `.env.local` | Token 签名密钥 |

**规则：管理员凭据和腾讯云密钥只存在于云函数环境变量，绝不出现在前端代码或 `.env`（前端）中。**

## 7. 架构边界

- 前端不直连数据库，全部通过 `/api`。
- 页面不写 fetch，全部通过 `src/services/`。
- 只有评论进数据库（`comments` 集合）。
- 作品和个人信息是 `src/data/` 中的静态文件。
- 后台只做：登录 + 查看评论 + 删除评论。不做编辑、发布、用户管理。
- 评论无审核状态，提交即展示。
