---

## 2. explain.md（讲解内容）必须包含以下部分

### 🟦 A. React 核心概念讲解
- 组件与状态：`useMediaGeneratorController` 通过多组 `useState` 维护媒体类型、模型选择、配置、提示词与当前生成任务，配置面板自身保持无状态，单纯消费上层数据。
- 记忆与派生：`useMemo` 将当前媒体类型映射到可用模型列表，避免每次渲染都重新筛选；`useCallback` 封装生成提交逻辑，使依赖稳定、减少子组件重复渲染。
- 副作用：`useEffect` 在模型列表变化时重置当前模型，并在生成任务进行中轮询 `/api/media/result`，在组件卸载或任务结束时清理定时器，体现副作用隔离的最佳实践。
- 渲染与响应：生成按钮点击后立即设置提交状态并更新 `activeGeneration`，React 首先渲染最新状态，再异步等待网络请求，保证界面快速反馈。
- 最佳实践体现：配置体使用独立 `configComponent`，避免大组件臃肿；Sora 请求体构建提取到专用函数，逻辑集中且易于维护。

### 🟦 B. Next.js 核心概念讲解（若本次代码使用 Next.js）
- Server Components 与 Client Components：配置面板与工作区声明 `'use client'` 以使用 Hook 与事件；API 路由位于 `app/api`，天然是 Server 代码，负责鉴权与转发。
- `"use client"` 的作用：允许在前端使用 `useState`/`useEffect` 等 Hook、监听按钮点击并发起 `fetch`，与默认的 Server Components 区隔。
- App Router 路由机制：页面与 API 均位于 `app` 目录，API 路由通过 `app/api/media/...` 提供同源接口，前端直接调用，无需跨域。
- 数据获取策略：生成请求与轮询结果均在客户端以 `fetch` 发起，结果接口使用 `cache: 'no-store'` 避免缓存；页面仍可保留默认 SSR 以满足 SEO。
- 文件结构影响：营销生成器相关逻辑集中在 `src/components/marketing/media-generator`，组件拆分后路由层只需引入对应工作区组件即可复用。

### 🟦 C. 代码逻辑拆解与架构说明
- 文件结构：`media-generator-config-panel.tsx` 负责模型切换与配置渲染；`controller.tsx` 管理状态、构建请求并轮询任务；`media-generator-workspace.tsx` / `media-only-generator-workspace.tsx` 组合菜单、配置与结果三栏。
- 核心流程：用户选择媒体类型与模型 → 配置面板通过 `configComponent` 渲染表单并收集 `prompt/config` → 生成按钮触发 `handleGenerate`，构建请求体并调用 `/api/media/generate` → 将返回的 `taskId` 存入 `activeGeneration`，轮询结果接口更新状态。
- 数据流与通信：控制器通过 props 向各栏位下发状态与回调，配置面板调用 `onModelChange`、`onModelConfigChange`、`onPromptChange` 更新上游状态；结果面板消费 `activeGeneration` 展示进度。
- 可替代实现 vs 当前实现：相比在配置面板内维护本地历史，本次直接移除 PromptHistory，减少无用状态与渲染；如需历史，可在控制器层新增独立持久化逻辑或服务端记录，避免与配置 UI 耦合。
- 隐含最佳实践：去除无需求功能保持组件单一职责；请求参数通过纯函数构建，便于未来为不同模型扩展；轮询逻辑集中在控制器，避免分散在多个组件。

### 🟦 D. 初学者学习重点总结
- 何时使用 `'use client'`：需要 Hook 与事件处理时声明，Server 代码仍放在 API 路由。
- `useMemo`/`useCallback` 保持依赖稳定，减少组件重复渲染。
- 副作用清理：轮询或订阅类逻辑必须在 `useEffect` 返回函数中清理。
- 拆分职责：表单配置、控制器、结果展示分层，便于增减功能（如本次去掉 PromptHistory）时改动局部。
- 构建请求体时将复杂分支抽成纯函数，减少 JSX 复杂度、提高可测试性。

---
