# My Site AI 执行规则

本项目是教学用个人主页评论系统。AI 写代码前必须先读取上下文文档，不允许只根据一句话直接生成代码。

## 必读文档

- `memory-bank/PRD.md`
- `memory-bank/DESIGN.md`
- `memory-bank/TECH_STACK.md`
- `memory-bank/DATA_MODEL.md`
- `memory-bank/ARCHITECTURE.md`
- `memory-bank/TASKS.md`
- 部署相关任务阅读 `memory-bank/DEPLOY.md`

## 执行规则

- 每次只执行 `TASKS.md` 中的一个编号任务。
- 不要顺手实现后续任务。
- 不要实现 `TASKS.md` 之外的功能。
- 如果任务不合理，先修改文档，再写代码。
- 页面和交互对齐 `DESIGN.md`。
- 数据字段、接口入参出参、校验规则对齐 `DATA_MODEL.md`。
- 文件职责、模块边界和数据流对齐 `ARCHITECTURE.md`。

## 文档修改规则

当任务是完善 `memory-bank/` 中的文档时：

- 必须阅读目标文档全文，不要只搜索 `TODO`。
- 优先补全所有 `TODO`。
- 如果已有内容和当前 `PRD.md`、原型或课堂项目边界不一致，必须同步修改非 `TODO` 内容。
- 如果已有内容是通用规则，且没有和当前项目冲突，应该保留。
- 不要擅自新增课堂范围之外的功能。
- 修改完成后说明补全了哪些 `TODO`、修改了哪些非 `TODO` 内容，以及为什么修改。

## 完成规则

每完成一个任务后：

- 更新 `memory-bank/PROGRESS.md`。
- 如果改动架构，同步更新 `memory-bank/ARCHITECTURE.md`。
- 如果改动数据字段或接口，同步更新 `memory-bank/DATA_MODEL.md`。
- 回复中说明修改了哪些文件、如何验证、是否还有未完成项。

## 禁止事项

- 不要删除 `design/` 和 `memory-bank/`。
- 不要把管理员密码或 token 密钥写入前端代码。
- 不要提交 `.env` 或 `.env.local`。
- 不要让前端直接操作数据库，必须通过云函数。
- 不要把接口调用散落在页面组件里，统一通过 `src/services/` 封装。
