# My Site 部署说明

## 1. 前置条件

- 已创建 CloudBase 环境。
- 已创建 `comments` 集合。
- 已安装 CloudBase CLI：`npm install -g @cloudbase/cli`。
- 已登录 CloudBase CLI：`tcb login`。
- 已复制 `.env.example` 为 `.env.local` 并填写真实值。

## 2. 部署云函数

```bash
cd cloudfunctions
./deploy.sh
```

部署后，在 CloudBase 控制台给 `api` 云函数创建 HTTP 访问触发器：

```text
路径：/api
鉴权：免鉴权
路径透传：开启
```

## 3. 配置前端接口地址

把 HTTP 触发器地址写入 `.env.local`：

```text
VITE_API_BASE=https://你的触发器域名
```

## 4. 构建前端

```bash
npm run build
```

构建产物在 `dist/`。

## 5. 上线验证

- 首页能打开。
- 作品详情页能打开。
- 评论能提交并展示。
- 管理员能登录。
- 管理员能删除评论。
