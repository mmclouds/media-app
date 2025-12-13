---

## 2. explain.md（讲解内容）必须包含以下部分

### 🟦 A. React 核心概念讲解
- 组件与状态：`useMediaGeneratorController` 用多组 `useState` 管理媒体类型、模型选择、配置、提示词与当前生成任务，`MediaGeneratorConfigPanel` 自身保持无状态、直接消费上层数据。
- 记忆与派生：`useMemo` 根据当前媒体类型筛选可用模型列表，避免重复计算；`useCallback` 包裹生成请求逻辑，使依赖稳定、减少子组件重复渲染。
- 副作用：`useEffect` 在模型列表变化时重置选中模型，并在生成任务活跃时轮询结果接口，同时在返回函数中清理定时器，确保无内存泄漏。
- 渲染与反馈：点击生成按钮后立即更新提交状态与 `activeGeneration`，React 先渲染最新状态再等待网络请求，实现即时 UI 反馈。
- 最佳实践体现：配置表单通过 `configComponent` 注入，保持容器组件简洁；请求体组装抽离到纯函数，便于维护与测试；此次移除历史面板与背景色调整，保持单一职责并优化对比度。

### 🟦 B. Next.js 核心概念讲解（若本次代码使用 Next.js）
- Server 与 Client 划分：配置面板与工作区声明 `'use client'`，以便使用 Hook 与事件；生成 API 路由放在 `app/api/media` 目录，由服务器执行鉴权与转发。
- `"use client"` 的作用：允许在前端使用 `useState`、`useEffect` 等 Hook、绑定按钮事件并发起 `fetch`，与默认 Server Components 区分。
- App Router 路由机制：页面与 API 均在 `app` 目录下，API 通过 `app/api/*` 提供同源接口，前端直接调用避免跨域。
- 数据获取策略：生成与轮询均在客户端 `fetch`，结果请求设置 `cache: 'no-store'` 避免缓存；页面级渲染仍可保持 SSR 以满足 SEO。
- 文件结构影响：营销生成器相关组件集中在 `src/components/marketing/media-generator`，API 代理独立于组件，前后端职责清晰。

### 🟦 C. 代码逻辑拆解与架构说明
- 文件结构：`media-generator-config-panel.tsx` 负责模型选择与配置渲染；`controller.tsx` 管理状态、请求与轮询；工作区组件组合菜单/配置/结果三栏。
- 背景与视觉：配置面板根节点背景改为 `bg-neutral-950`，在纯黑基础上增加微弱灰度，提升层次与可读性，与整体暗色调保持一致。
- 核心流程：用户选择媒体类型与模型 → 配置组件渲染对应表单并收集 `prompt`/`config` → 生成按钮调用 `handleGenerate` 组装请求体并触发 `/api/media/generate` → 返回 `taskId` 后轮询结果接口更新状态。
- 数据流与通信：控制器通过 props 将状态与回调下发，配置面板调用 `onModelChange`、`onModelConfigChange`、`onPromptChange` 更新上层，结果面板消费 `activeGeneration` 展示进度。
- 可替代实现 vs 当前实现：历史记录功能被移除，配置面板聚焦当前表单与提交；如需恢复历史，可在控制器层添加独立存储或服务端记录，避免 UI 臃肿。
- 隐含最佳实践：容器组件保持瘦身，复杂逻辑集中到控制器；色彩变更使用 Tailwind 预设色值，避免散落魔法值并符合设计约束。

### 🟦 D. 初学者学习重点总结
- 何时使用 `'use client'`：需要 Hook 与交互时声明，服务端逻辑放在 API 路由。
- 使用 `useMemo`/`useCallback` 保持依赖稳定，减少无谓渲染。
- 副作用清理：轮询或订阅类逻辑必须在 `useEffect` 返回函数中清理。
- 组件职责单一：配置面板只负责表单与提交，其他状态与请求由控制器承担，便于增删功能（如本次移除历史）。
- 设计与实现一致：背景颜色通过 Tailwind 变量调整，保证视觉需求与代码实现一致。

---
