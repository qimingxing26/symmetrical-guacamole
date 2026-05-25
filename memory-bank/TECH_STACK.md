# My Site 技术栈规范

## 1. 技术栈结论

第一版采用：

```text
前端框架：Vite + React + TypeScript
路由：React Router
样式：普通 CSS
数据与接口：CloudBase 云数据库 + 单函数 Express 云函数 + HTTP 访问触发器
调用方式：标准 HTTP fetch
部署方式：前端静态构建 + CloudBase 云函数独立部署
```

## 2. 为什么这样选

- Vite 启动快，适合课堂。
- React 适合把原型拆成页面和组件。
- TypeScript 帮助明确数据结构。
- CloudBase 降低数据库和后端运维成本。
- 单函数 Express 方便统一管理接口。
- fetch 让前端用标准 HTTP 调用后端。

## 3. 目录约定

```text
src/pages       页面
src/components  组件
src/data        静态个人信息和作品数据
src/services    API 调用封装
src/types       TypeScript 类型
src/styles      全局样式
cloudfunctions/functions/api  单函数 Express API
memory-bank     项目上下文文档
```

## 4. 环境变量

前端：

```text
VITE_API_BASE=HTTP 触发器地址，本地开发可留空
```

云函数：

```text
ENV_ID=CloudBase 环境 ID
TENCENTCLOUD_SECRET_ID=腾讯云 SecretId
TENCENTCLOUD_SECRET_KEY=腾讯云 SecretKey
ADMIN_USERNAME=管理员账号
ADMIN_PASSWORD=管理员密码
ADMIN_TOKEN_SECRET=Token 签名密钥
```

## 5. 编码约束

- 页面组件不要直接写 fetch，接口调用放到 `src/services/`。
- 个人信息和作品信息第一版放在 `src/data/`。
- 评论数据必须通过云函数读写数据库。
- 管理员密码不能写到前端代码。
- 不做注册、多用户、评论审核、复杂 CMS。

## 6. 本地运行命令

第一阶段只启动前端：

```bash
npm run dev
```

进入评论和数据存储开发后，同时启动前端和本地 API：

```bash
npm run dev:full
```

云函数依赖由 `dev:full` 自动安装到 `cloudfunctions/functions/api/node_modules/`。
