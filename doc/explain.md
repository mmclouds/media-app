
---

## 2. explain.md（讲解内容）必须包含以下部分

### 🟦 A. React 核心概念讲解
- 组件/props/state：`SoraConfigFields` 作为纯函数组件，完全依赖父级传入的 `config`、`prompt` 与回调，保持受控模式，避免内部额外 state 带来的同步问题。
- Hooks 使用：本文件无需额外 Hooks，通过直接使用 props 计算衍生值（时长、比例、模型版本），让数据源保持单一，减少渲染分支。
- 使用原因：受控组件让父级控制器可以集中管理不同模型的配置状态，便于在切换模型时复用或重置配置。
- 渲染机制关联：当父级更新 `config` 或 `prompt` 时，组件重新计算默认值与选中态，UI 始终与外部状态一致，避免局部缓存导致的失真。
- 最佳实践：表单选项均来源于常量或 props，避免魔法值；输入模式切换时显式更新 `config`，确保数据流透明。

### 🟦 B. Next.js 核心概念讲解（若本次代码使用 Next.js）
- Server vs Client：文件顶部 `"use client"` 明确这是客户端组件，允许使用事件与浏览器 API；请求构建逻辑也在客户端完成，随后走 App Router 的内部 API。
- App Router：`useMediaGeneratorController` 运行在客户端页面中，通过 fetch 调用 `/api/media/generate` 路由，由服务器段再转发到网关，前端无需直接暴露外部域名与密钥。
- 数据策略：生成请求在客户端发起，未使用 SSR/SSG/ISR；API 端点默认 `cache: 'no-store'`，确保实时获取生成任务状态。
- 结构影响：Sora 专属的参数构建逻辑移动到 `video/sora-config-fields.tsx`，同目录聚合 UI 与组装规则，更符合 App Router 下“按路由/域分组”的组织方式。

### 🟦 C. 代码逻辑拆解与架构说明
- 文件结构：`controller.tsx` 负责模型注册、状态管理与生成调度；`video/sora-config-fields.tsx` 负责 Sora 配置 UI，并新增 `buildSoraRequestBody` 专门构建请求体。
- 关键改动：`buildSoraRequestBody` 从控制器迁移到 Sora 配置文件，逻辑保持不变（根据输入模式、模型版本、时长、比例与画质确定具体模型和入参，并在需要时收集 `inputImageUuid` 至 `fileUuids`）。
- 数据流：用户在配置面板更新字段 → `config` 通过 props 回到控制器 → 点击生成时控制器合并默认配置与当前配置 → 调用新导出的 `buildSoraRequestBody` 获取请求体，同时复用同一个 `fileUuids` 数组供查询参数追加。
- 可替代实现 vs 优势：也可把构建逻辑放在独立 util，但放在 Sora 文件让模型专属规则与表单选项同处一处，更易维护和对照 UI；控制器只做分发，不需要关心各模型细节。
- 隐含最佳实践：跨文件复用通过命名导出完成，避免循环依赖；保持请求构建纯函数风格，便于测试和未来扩展。

### 🟦 D. 初学者学习重点总结
- 受控组件如何依赖 props 而非内部 state，以便由上层统一管理配置。
- 将特定模型的请求构建逻辑放回其领域文件，减少跨模型的条件分支。
- `"use client"` 的作用：使配置组件与请求构建可以直接响应用户交互并发起 fetch。
- 通过在构建请求时收集 `fileUuids`，在 query 中附带文件关联信息，保证后端任务能找到上传文件。

---
