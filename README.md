# my-site-starter

这是第三阶段综合项目实战的学生脚手架。目标是完成一个带评论功能的个人主页系统。

## 你要做出的系统

```text
个人主页展示
-> 作品详情展示
-> 访客评论
-> 评论写入数据库
-> 管理员登录
-> 后台删除评论
-> 部署上线
```

## 第一次运行

```bash
npm install
cp .env.example .env.local
npm run dev
```

浏览器打开终端里显示的 Vite 地址。

第一课只需要运行前端，所以默认 `npm run dev` 不会启动 CloudBase 云函数。

进入评论和数据存储阶段后，再使用：

```bash
npm run dev:full
```

这个命令会同时启动本地 Express API 和 Vite 前端。

## 项目结构

```text
memory-bank/  项目上下文文档
src/          前端代码
cloudfunctions/functions/api/  CloudBase 单函数 API
design/       原型文件
```

## 开发方法

1. 先完善 `memory-bank/PRD.md`。
2. 再生成原型并完善 `memory-bank/DESIGN.md`。
3. 阅读 `TECH_STACK.md`、`DATA_MODEL.md`、`ARCHITECTURE.md`。
4. 按 `TASKS.md` 每次只完成一个任务。
5. 每完成一步更新 `PROGRESS.md`。

## 让 AI 完善文档时

脚手架里的文档既是模板，也是项目规则。不要只让 AI 填 `TODO`。

推荐提示词：

```text
请阅读整个文档，不要只修改 TODO。
请补全 TODO，并检查已有内容是否和我的项目一致。
一致的保留，不一致的修改。
不要增加课堂范围之外的新功能。
修改后说明你改了什么、为什么改。
```

判断原则：

- `TODO` 是必须优先补全的内容。
- 已有内容如果符合你的项目，就保留。
- 已有内容如果和你的 PRD、原型或课堂边界不一致，就修改。
- 技术、架构、数据模型类文档通常不需要大改，除非你的需求或原型已经改变了范围。

## 注意

这个脚手架故意没有完成评论和后台管理的核心逻辑。你需要在后续任务中逐步实现它们。
