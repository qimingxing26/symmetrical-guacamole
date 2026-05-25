# My Site 设计文档

> 本文档描述页面结构、交互流程、视觉方向和状态处理，方便后续 AI 按设计写 React 代码。
> 功能需求见 PRD.md，本文档不重复。

## 1. 设计来源

| 原型文件 | 页面 | React 路由 |
|---|---|---|
| `design/index.html` | 首页 | `/` |
| `design/project-homepage.html` | 项目详情：个人主页 | `/projects/project-homepage` |
| `design/project-ai-xiaozhi.html` | 项目详情：ai小智 | `/projects/project-ai` |
| `design/project-smart-cup.html` | 项目详情：智能水杯 | `/projects/project-cup` |
| `design/project-ninan.html` | 文章详情：呢喃 | `/projects/article-ninan` |
| `design/project-taohua.html` | 文章详情：桃花灼灼，君知我 | `/projects/article-taohua` |
| `design/project-zhuiyi.html` | 文章详情：追忆 | `/projects/article-zhuiyi` |
| `design/project-photo-sky.html` | 摄影详情：光遇 | `/projects/photo-sky` |
| `design/project-photo-school.html` | 摄影详情：学校的风景 | `/projects/photo-school` |
| `design/login.html` | 管理员登录页 | `/admin/login` |
| `design/admin.html` | 评论管理页 | `/admin/comments` |

> 8 个详情页共享同一套页面组件 `ProjectDetailPage`，根据 `category` 字段差异化渲染内容区。

## 2. 视觉方向

### 色彩

| 用途 | 色值 |
|---|---|
| 页面背景 | `#faf8f5` |
| 正文文字 | `#2c2416` |
| 次要文字 | `#6b5e4a` / `#9a8b72` |
| 卡片背景 | `#ffffff` |
| 卡片边框 | `#ebe5d9` |
| 主按钮 / 强调色 | `#b8753e`（hover: `#9c6234`） |
| 标签背景 | `#f5efe4`，文字 `#8b6f47` |
| 危险按钮 / 错误色 | `#b55a5a`（hover: `#9a4848`） |
| 成功提示 | `#4a6741` |

### 字体

- 全文使用 `Source Serif 4`（衬线体），回退 `Georgia, serif`
- 根字号 `17px`，移动端 `15px`
- 标题 `font-weight: 600`，正文 `400`，引用 `300`

### 全局布局

- 所有页面包裹在 `page-shell` 中：`<NavBar />` + `<main>` + `<Footer />`
- 导航栏 sticky + 毛玻璃效果（`backdrop-filter: blur(10px)`）
- 非首页（详情页、登录页、管理页）NavBar 只保留 `← 返回` 链接 + 品牌名，不展示 About/Works 锚点
- 内容最大宽度 `760px`（首页 Works 区 `940px`），水平居中
- 卡片统一 `border-radius: 4px`，hover 时上浮 `-3px` + `box-shadow`

## 3. 页面与路由

| 页面 | 路由 | 组件 |
|---|---|---|
| 首页 | `/` | `HomePage` |
| 作品详情页 | `/projects/:id` | `ProjectDetailPage` |
| 管理员登录页 | `/admin/login` | `AdminLoginPage` |
| 评论管理页 | `/admin/comments` | `AdminCommentsPage`（由 `AdminGuard` 包裹） |

## 4. 首页交互 (`/`)

### 页面结构 (从上到下)

```
NavBar (sticky)
  ├─ 左侧: "MY SITE" 品牌名
  └─ 右侧: About / Works / Admin 锚点链接

Hero
  ├─ 座右铭（1.6rem, weight 300，左侧装饰引号 ::before）
  ├─ 分割线 (3rem × 1px，色 #d4c4ac)
  ├─ 姓名（1.25rem, weight 500）
  └─ 所在地（0.92rem, color #9a8b72）

About
  ├─ "ABOUT" 标签（小号大写，字间距 0.12em）
  ├─ 两段个人介绍（1.05rem, line-height 1.8）
  └─ GitHub + Email 链接（虚线底边，hover 变实线 + 变色）

Works（按分类分三组，每组有中英文标题）
  ├─ Projects / 项目 × 3 卡片
  ├─ Articles / 文章 × 3 卡片
  └─ Photography / 摄影 × 2 卡片

Footer
  └─ © 2026 黄启贺 · Admin 链接
```

### 作品卡片

- 整张卡片是 `<a>` 标签，点击跳转详情页
- 封面图 `aspect-ratio: 16/10`，`object-fit: cover`
- 有封面图时显示 `<img>`，无封面图时降级为渐变色 `<div>`
- 卡片内容区：标题（1rem, 600）+ 描述（0.85rem）+ 标签 + 年份

### 交互

- 导航锚点平滑滚动（`scroll-behavior: smooth`）
- 卡片 hover 上浮 `-3px` + 阴影加深
- 点击卡片 → 对应作品详情页

## 5. 作品详情页交互 (`/projects/:id`)

> 8 个作品共用一个组件 `ProjectDetailPage`，差异来自 `Project` 数据的 `category` 字段。

### 三种内容形态

| 类别 | `category` 值 | 内容区渲染方式 |
|---|---|---|
| 文章 | `"文章"` | `content[]` 逐段渲染为 `<p>`，无额外媒体区 |
| 摄影 | `"摄影"` | `content[]` 介绍段落后，`images[]` 渲染图片网格，含 `videoUrl` 的项渲染 `<video>` |
| 项目 | `"项目"` | `content[]` 逐段渲染，可混入 `<ul>` / `<pre>` 等结构 |

### 页面结构

```
NavBar
  └─ "← Back" 返回首页链接 + "My Site"

Article
  ├─ 标题（1.75rem, weight 600）
  ├─ 年份 + 标签列表
  ├─ 分割线
  ├─ 封面图（16:9, object-fit: cover）
  ├─ 正文区（根据 category 渲染）
  │   ├─ 文章类：content[] 逐段 <p>
  │   ├─ 摄影类：分组标题 + 图片网格 + 可选视频
  │   └─ 项目类：content[] 渲染为 <p>
  └─ （摄影类）视频项：<video controls> + 下方标签名

评论区
  ├─ "Comments (N 条评论)"
  ├─ 评论列表
  │   └─ 每条：昵称（weight 600）+ 时间（YYYY-MM-DD HH:mm）+ 正文
  └─ 评论表单
      ├─ 昵称 <input>（maxLength 20）
      ├─ 内容 <textarea>（maxLength 500）
      └─ 提交按钮（#b8753e）
```

### 图片网格（摄影类）

- `display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr))`
- 图片 `aspect-ratio: 4/3; object-fit: cover; border-radius: 4px`
- 子分组间用 `.photo-section-title` 分隔（`border-bottom: 1px solid #e8e0d5`）
- 视频占满网格单元，下方显示标签名（0.82rem, #6b5e4a, 居中）

### 评论区交互

**评论提交 — 直接展示：**
1. 访客填写昵称和内容 → 点击提交
2. 调用 `POST /api/comments` { projectId, nickname, content }
3. 成功后，用 API 返回的评论对象**直接插入列表顶部**，不重新 GET 全量列表
4. 新评论带 `is-new` 类：边框高亮 `#c4a97a` + 背景闪烁渐隐（2s 动画）
5. 表单内容清空

**评论列表默认排序：** 按 `createdAt` 降序（新评论在前）。后台管理页同样按此排序。

**状态处理：**
- 加载中：评论列表区显示居中文字"加载中..."
- 加载失败：评论列表区显示红色错误文字"加载失败" + "重试"按钮，点击重试重新请求 `GET /api/comments`
- 空列表：显示 `"还没有评论，来说点什么吧。"`（italic, 居中, `#b0a38c`）
- 提交中：按钮 disabled，文字改为"提交中..."
- 提交失败：表单下方显示红色错误文字

### 作品不存在

- 显示 `<h1>作品不存在</h1>` + `<Link to="/">返回首页</Link>`

## 6. 管理员登录页交互 (`/admin/login`)

### 页面结构

```
NavBar
  └─ "← Home" + "My Site"

居中卡片（max-width 380px，白色背景，阴影）
  ├─ 标题："管理员登录"
  ├─ 副标题："请输入账号和密码"
  ├─ 错误提示区（默认隐藏，加 .show 才显示）
  ├─ 账号输入框
  ├─ 密码输入框（type="password"）
  └─ 登录按钮（全宽，背景 #b8753e）

Footer
```

### 交互

- 点击登录 → `POST /api/admin/login` { username, password }
  - 成功：`localStorage.setItem('admin_token', token)` → `navigate('/admin/comments')`
  - 失败：显示错误提示（红色背景 `#fef2f2`，边框 `#ecc8c8`，文字"账号或密码错误，请重试。"）
- 错误提示默认隐藏，通过添加 `.show` 类显示
- 登录中：按钮 disabled + 文字"登录中..."
- **API 返回 401**：任何 API 调用返回 401 时，自动 `localStorage.removeItem('admin_token')` 并跳转 `/admin/login`

## 7. 评论管理页交互 (`/admin/comments`)

> **路由守卫**：`AdminGuard` 检查 `localStorage.getItem('admin_token')`，无 token 则 `<Navigate to="/admin/login" />`

### 后台功能范围

后台**只做两件事**：
1. 管理员登录
2. 评论管理（按作品筛选、查看时间、删除评论）

**不做**：评论编辑、用户管理、作品 CRUD、数据统计等。

### 页面结构

```
顶部栏（sticky）
  ├─ 标题："评论管理"
  ├─ Home 链接
  └─ 退出登录按钮（border 样式，hover 背景 #f5efe4）

筛选栏
  ├─ "筛选作品："标签
  ├─ <select> 下拉（"全部作品" + 8 个作品名）
  └─ "共 N 条评论"计数

评论列表
  └─ 每条评论行（flex 水平排列）
      ├─ 左侧信息区
      │   ├─ 作品名标签（#f5efe4 背景小胶囊）+ 昵称（weight 600）+ 时间（0.78rem, #b0a38c）
      │   └─ 评论正文
      └─ 右侧：删除按钮（红色边框 #e0cccc，红色文字 #b55a5a）

Toast（fixed 右上角，z-index 200）
  └─ 绿色背景 #4a6741，白色文字

删除确认弹窗（Modal，z-index 300）
  ├─ 半透明遮罩层（rgba(44,36,22,0.35)）
  ├─ 白色弹窗卡片（max-width 380px）
  │   ├─ 标题："确认删除"
  │   ├─ 说明："删除后将无法恢复，确定要删除这条评论吗？"
  │   ├─ 评论预览（左侧竖线强调框，背景 #fdf9f3）
  │   ├─ 取消按钮（边框样式）
  │   └─ 确认删除按钮（红色背景 #b55a5a，hover #9a4848）
```

### 交互

**筛选：**
- 筛选下拉数据源来自 `src/data/projects.ts`，`<option value={project.id}>` 用 `id` 作值、`title` 作显示名
- 下拉选择作品 id → 过滤列表仅显示该作品评论
- 选择"全部作品" → 显示所有评论

**删除流程（二次确认）：**
1. 点击"删除"按钮 → 打开 Modal
2. Modal 显示被删评论预览（昵称 + 内容）
3. 点击"取消"或点击遮罩层 → 关闭 Modal
4. 点击"确认删除" → 调用 `DELETE /api/admin/comments/:id`
   - 成功 → 评论行直接从 DOM 移除，flexbox 自动填补空位
   - Toast 弹出"评论已删除"（2s 后自动消失）
   - 计数更新
   - 失败 → Toast 显示错误信息

**退出登录：**
- `localStorage.removeItem('admin_token')`
- `navigate('/')`

**状态处理：**
- 评论列表空：居中 italic 文字"暂无评论"
- 加载中：骨架屏或 loading 指示器

### Toast 动画

- 入场：`translateY(-0.5rem)` → `translateY(0)`，0.3s ease-out
- 自动消失：2s 后移除 `.show` 类

## 8. 通用组件

| 组件 | 说明 |
|---|---|
| `NavBar` | 顶部导航，sticky 毛玻璃 |
| `Footer` | 页脚，Copyright + Home 链接 |
| `AdminGuard` | 路由守卫，检查 token，无则重定向登录页 |
| `ProjectCard` | 作品卡片，接收 `Project` prop，渲染封面+标题+描述+标签 |
| `CommentForm` | 评论表单，接收 `projectId`，提交成功后回调清空 |
| `CommentList` | 评论列表，接收 `Comment[]`，空列表显示空状态 |

## 9. 状态一览

| 页面 | 状态 | 处理 |
|---|---|---|
| 首页 | 正常 | 展示所有作品卡片 |
| 详情页 | 作品不存在（id 无匹配） | "作品不存在" + 返回首页链接 |
| 详情页 | 评论加载中 | 居中文字"加载中..." |
| 详情页 | 评论加载失败 | 红色文字"加载失败" + "重试"按钮 |
| 详情页 | 评论列表空 | "还没有评论，来说点什么吧。"（italic 置中） |
| 详情页 | 评论提交中 | 按钮 disabled "提交中..." |
| 详情页 | 评论提交成功 | API 返回的评论对象直接插入列表顶部 + is-new 高亮动画 |
| 详情页 | 评论提交失败 | 表单下方红色错误文字 |
| 登录页 | 待输入 | 表单正常 |
| 登录页 | 登录中 | 按钮 disabled "登录中..." |
| 登录页 | 登录失败 | 红色错误卡片 show |
| 管理页 | 未登录 | AdminGuard → 重定向 `/admin/login` |
| 管理页 | API 返回 401 | 清除 token → 跳转 `/admin/login` |
| 管理页 | 评论加载中 | 居中文字"加载中..." |
| 管理页 | 评论列表空 | "暂无评论"（italic 置中） |
| 管理页 | 删除确认中 | Modal 打开 |
| 管理页 | 删除成功 | 行直接从 DOM 移除 + Toast "评论已删除" |
| 管理页 | 删除失败 | Toast 显示错误信息 |

## 10. 响应式

- 断点 `max-width: 720px`
- 根字号缩至 `15px`
- 卡片网格 `repeat(3, 1fr)` → `1fr`（单列）
- 导航垂直排列
- 英雄区 padding 缩小
