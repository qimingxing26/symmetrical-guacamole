# My Site 开发任务清单

## 执行规则

1. 每次只做一个编号任务。
2. 开始前阅读 `memory-bank/` 中相关文档。
3. 不实现任务清单之外的功能。
4. 完成后更新 `memory-bank/PROGRESS.md`。
5. 改动架构或数据字段时，同步更新 `ARCHITECTURE.md` 或 `DATA_MODEL.md`。

## Phase 0：准备

- [x] 0.1 复制 `.env.example` 为 `.env.local`，先保留占位值。
  - **标准**：项目根目录存在 `.env.local`，内容与 `.env.example` 结构一致。
  - **验证**：`cat .env.local` 确认变量名正确。
- [x] 0.2 安装依赖并确认能启动。
  - **标准**：`npm install` 无报错，`npm run dev` 能打开前端首页。
  - **验证**：浏览器访问 `http://localhost:5173`，看到页面内容。

## Phase 1：静态数据 — 个人内容与作品

> 当前状态：`profile.ts` 和 `projects.ts` 已有真实数据、8 个作品、封面图和照片均已就位。本阶段做最终核对与收尾。

- [x] 1.1 核对 `src/data/profile.ts` 个人信息。
  - **标准**：name、role、about、details（Location / GitHub / Email）与 PRD 一致。
  - **验证**：阅读文件，逐字段比对 PRD Section 1 和 DESIGN.md 首页 Hero/About 描述。
- [x] 1.2 核对 `src/data/projects.ts` 全部 8 个作品。
  - **标准**：项目 3 个、文章 3 篇、摄影 2 组，每个作品 id、title、description、cover、tags、year、category、content 完整。摄影类有 `images[]`，其中《光遇》含一个 `videoUrl`。
  - **验证**：`grep "id:" src/data/projects.ts` 确认 8 个 id，逐一检查 category 和 images 字段。
- [x] 1.3 核对静态资源文件。
  - **标准**：`public/covers/` 下 8 张封面图存在，`public/photos/` 下两组摄影作品图片和视频存在。
  - **验证**：`ls public/covers/` 和 `ls public/photos/` 确认文件齐全。

## Phase 2：页面还原 — 原型转 React

> 参考：DESIGN.md Section 4（首页）、Section 5（详情页）、Section 6（登录页）、Section 7（管理页）。

- [x] 2.1 完善首页 `HomePage`：按分类分组展示作品。
  - **标准**：页面结构从上到下为 NavBar → Hero → About → Works（三组：项目/文章/摄影）→ Footer。NavBar 锚点 About / Works 可平滑滚动。卡片封面图路径为 `/covers/xxx.jpg`（对应 `public/covers/`），hover 上浮效果，点击跳转 `/projects/:id`。本任务不处理响应式适配。
  - **验证**：浏览器中首页展示 3 个项目卡片 + 3 篇文章卡片 + 2 个摄影卡片，分组标题"Projects / 项目""Articles / 文章""Photography / 摄影"可见。点击卡片跳转到正确详情页。
- [x] 2.2 完善 `ProjectDetailPage`：三种 category 差异化渲染。
  - **标准**：三种 category 的 `content[]` 统一逐段渲染为 `<p>`。摄影类 `content[]` 段落后渲染 `images[]` 图片网格（含视频项用 `<video controls>`）。NavBar 非首页仅显示"← Back"链接 + 品牌名（无 About/Works 锚点）。评论区此时为静态占位：只渲染 CommentForm 和空状态提示"还没有评论，来说点什么吧。"，不调用 API。
  - **验证**：分别访问 `/projects/article-ninan`、`/projects/project-ai`、`/projects/photo-sky`，确认三类的正文、图片网格（2~4 列自适应）、视频播放器渲染正确。评论区显示空状态提示，表单可见但不提交。
- [x] 2.3 完善 `AdminLoginPage`：登录表单 UI。
  - **标准**：居中卡片布局，含"管理员登录"标题、"请输入账号和密码"副标题、账号输入框、密码输入框（type="password"）、全宽登录按钮（#b8753e）、错误提示区（默认隐藏）。无注册入口。
  - **验证**：访问 `/admin/login`，页面结构与 `design/login.html` 一致，表单可输入。
- [x] 2.4 完善 `AdminCommentsPage`：管理界面 UI。
  - **标准**：顶部栏（标题 + Home 链接 + 退出按钮）、筛选栏（作品下拉 + "共 N 条"计数）、评论列表（每行：作品标签 + 昵称 + 时间 + 正文 + 删除按钮）。下拉数据源来自 `projects.ts`。
  - **验证**：访问 `/admin/comments`，页面结构与 `design/admin.html` 一致，下拉可展开 8 个作品名。

## Phase 3：评论功能 — 前后端打通

> 参考：DATA_MODEL.md Section 4-6、ARCHITECTURE.md Section 5.1-5.2。

- [x] 3.1 确认 CloudBase `comments` 集合已创建。
  - **标准**：CloudBase 控制台中存在 `comments` 集合。如尚未注册 CloudBase，先完成 `DEPLOY.md` 中的环境准备步骤（注册、创建环境、获取密钥）。
  - **验证**：CloudBase 控制台 → 数据库 → 集合列表，能看到 `comments`。
- [x] 3.2 实现 `GET /api/comments` 和 `POST /api/comments`。
  - **标准**：`GET` 按 `projectId` 查询，按 `createdAt` 降序返回。`POST` 校验 projectId/nickname/content，写入数据库，返回新创建的 Comment 对象。校验规则：projectId 不为空且匹配已有作品；nickname 1~20 字符；content 1~500 字符。
  - **验证**：用 curl 或浏览器 console 调用 `GET /api/comments?projectId=article-ninan` 返回空数组；`POST /api/comments` 发 JSON `{projectId, nickname, content}` 返回新评论；再次 GET 能看到刚才的评论排在最前面。
- [x] 3.3 前端对接评论读取。
  - **标准**：`ProjectDetailPage` 通过 `commentService.getComments(projectId)` 加载评论。加载中显示"加载中..."；加载失败显示"加载失败"+ 重试按钮；列表空显示"还没有评论，来说点什么吧。"。
  - **验证**：打开一个作品详情页，能看到已有评论（如果有），或看到空状态提示。
- [x] 3.4 前端对接评论提交。
  - **标准**：`CommentForm` 调用 `commentService.createComment()`。提交中按钮 disabled + "提交中..."；成功后 API 返回的 Comment 直接插入列表顶部，带 `is-new` 高亮动画（边框 #c4a97a，背景闪烁 2s）；表单清空；提交失败表单下方显示红色错误文字。
  - **验证**：在详情页填昵称和内容提交，评论立刻出现在列表顶部并闪高亮，表单清空。

## Phase 4：后台管理 — 登录与评论管理

> 参考：DATA_MODEL.md Section 6、ARCHITECTURE.md Section 5.3-5.5。

- [x] 4.1 实现 `POST /api/admin/login`。
  - **标准**：校验云函数环境变量 `ADMIN_USERNAME` / `ADMIN_PASSWORD`。成功返回 `{ token }`（HMAC-SHA256，24h 过期）；失败返回 `{ success: false, message: "账号或密码错误" }`。
  - **验证**：curl 用正确账号密码 POST 得到 token；用错误密码 POST 得到失败响应。
- [x] 4.2 前端对接管理员登录。
  - **标准**：`AdminLoginPage` 调用 `adminService.login()`。登录中按钮 disabled + "登录中..."；成功保存 token 到 localStorage 并跳转 `/admin/comments`；失败显示红色错误提示"账号或密码错误，请重试。"。
  - **验证**：浏览器访问 `/admin/login`，输入正确凭据跳转到管理页；错误凭据显示错误提示。
- [x] 4.3 实现 `GET /api/admin/comments` 和 `DELETE /api/admin/comments/:id`。
  - **标准**：两个接口均需 `Authorization: Bearer <token>` 校验，401 则拒绝。`GET` 返回全部评论（按 `createdAt` 降序）。`DELETE` 从数据库删除指定评论，返回成功。
  - **验证**：用有效 token 调用 GET 返回评论列表；用无效 token 返回 401。DELETE 后评论从列表消失。
- [x] 4.4a 前端对接评论管理（列表与筛选）。
  - **标准**：`AdminCommentsPage` 由 `AdminGuard` 包裹，无 token 重定向 `/admin/login`。筛选下拉选中作品 id → 仅显示该作品评论，"全部作品"显示全部。列表按 `createdAt` 降序。"共 N 条"计数随筛选变化。
  - **验证**：未登录访问 `/admin/comments` 自动跳转登录页。登录后筛选下拉切换作品能过滤评论、计数正确更新。退出登录清除 token 跳转首页。
- [x] 4.4b 前端对接评论管理（删除）。
  - **标准**：删除按钮 → 打开 Modal 二次确认（显示被删评论预览）→ 确认后调用 `DELETE /api/admin/comments/:id` → 成功则行直接移除，Toast"评论已删除"（2s 后消失）→ 计数更新。失败则 Toast 显示错误信息。
  - **验证**：点击删除 → Modal 弹出显示评论预览 → 点取消关闭 Modal → 点确认删除后评论行消失、Toast 出现、计数更新。

## Phase 5：验证与部署

- [x] 5.1 运行 `npm run lint`，确保无 ESLint 报错。
- [x] 5.2 运行 `npm run build`，确保 TypeScript 检查 + Vite 构建成功。
- [x] 5.3 按 `DEPLOY.md` 部署云函数到 CloudBase。
- [x] 5.4 部署前端静态页面。
- [x] 5.5 按 PRD Section 7 验收标准逐项检查：网站可打开、首页展示个人信息与分类作品、卡片点击进详情页、作品内容完整、提交评论 → 立刻展示（含高亮动画 + 成功提示条）、管理员登录、按作品筛选评论、查看评论时间、删除评论（含 Modal 二次确认 + Toast 反馈）。逐项记录通过/不通过。

## Phase 6：收尾

- [x] 6.1 配置 CloudBase 静态托管错误文档为 `index.html`，修复 SPA 子路由 404。
  - **标准**：控制台 → 静态网站托管 → 基础配置 → 错误文档 → 填 `index.html`。
  - **验证**：浏览器访问 `/projects/article-ninan`、`/admin/login` 不再 404。
