---

## 2. explain.md（讲解内容）必须包含以下部分

### 🟦 A. React 核心概念讲解
- 组件与 props：`MediaGeneratorResultPane` 负责媒体列表展示，`VideoPreviewCard` 渲染单个卡片，通过 props 传递 `asset`、`isActive` 等数据，保持展示与数据解耦。
- 状态与副作用：`useState` 管理远端 Feed、加载态、提示信息等，`useEffect` 触发登录态变化后重置列表、滚动加载、轮询生成任务完成度并响应失败提示。
- 引用与回调：`useRef` 保存滚动容器、下一页游标、播放元素引用，避免重复渲染；`useCallback` 封装滚动监听、播放控制、取数函数，减少子组件重复绑定。
- 记忆化：`useMemo` 生成降级的演示数据与实时生成项，避免每次渲染重复计算。
- 渲染机制关联：状态变更后 React 触发重新渲染，依赖数组保证副作用只在必要时运行；通过 `key={asset.id}` 强制视频在数据变化时重建，确保新源加载。
- 最佳实践：明确的加载/错误分支、去抖滚动监听、使用可控状态与引用避免竞态，保持渲染纯净。

### 🟦 B. Next.js 核心概念讲解（若本次代码使用 Next.js）
- Server/Client 组件划分：文件首行 `"use client"` 标明这是 Client Component，可使用 Hooks 与浏览器 API；与后端交互放在 API Route 中分离。
- App Router：组件位于 `src/components` 供 `app` 目录页面引用，数据通过 `app/api` 下的 Route Handler（如 `/api/files/download/[uuid]`）获取，遵循段式路由规则。
- 数据获取策略：客户端 `fetch` 指定 `cache: 'no-store'` 拉取实时 Feed，避免缓存；下载文件改为走内部 API 以复用鉴权与网关代理。
- 链接与资源：媒体地址改为内部 `/api/files/download/${fileUuid}`，利用 Next.js 路由参数与 query 追加租户/用户信息，避免直接暴露网关 downloadUrl。
- 文件结构影响：路由逻辑集中在 `src/app/api/files/download/[uuid]/route.ts`，组件只依赖相对路径，方便复用并保持安全边界。

### 🟦 C. 代码逻辑拆解与架构说明
- 文件结构：`media-generator-result-pane.tsx` 负责渲染媒体结果列表与交互；底层网关代理逻辑在 `app/api/files/download/[uuid]/route.ts`，前端通过统一入口访问。
- 数据流：登录后调用 `/api/media/feed` 获取任务列表，`mapTaskToAsset` 规范化数据并生成展示资源 URL；滚动触底调用 `loadFeed` 追加数据，卡片根据状态决定视频源与海报。
- 关键改动：新增 `buildFileDownloadUrl`，当 Feed 返回 `fileUuid` 时拼接 `/api/files/download/${uuid}`，优先走自家 API 路由获取文件数据，避免直接使用第三方 `downloadUrl`；仍保留 `onlineUrl` 与兜底地址以兼容旧数据。
- 组件通信：父组件把资产数据传给 `VideoPreviewCard`，子组件通过回调控制悬停播放，不共享全局状态，降低耦合。
- 可替代实现与优势：可在 `loadFeed` 中直接转换 URL，但独立 helper 让来源清晰、可单测；内部 API 统一鉴权与网关转发，避免跨域与密钥暴露，是更安全的实现。
- 隐含最佳实践：优先使用后端代理的受控入口、合并去重远端数据、为错误与空态提供清晰提示。

### 🟦 D. 初学者学习重点总结
- 如何使用 `useState`/`useEffect`/`useMemo`/`useCallback` 管理列表数据、滚动加载与性能。
- 为什么客户端组件需要 `"use client"`，以及何时把外部访问放进 Next.js API Route。
- 构建安全的媒体访问路径：用 `fileUuid` 走内部 `/api/files/download/[uuid]`，避免直接暴露下载链接。
- 处理远端数据规范化：`mapTaskToAsset` 将后端字段转换成前端可用的展示对象并合并状态。
- 滚动监听与视频悬停播放的事件处理模式，如何用 `useRef` 管理 DOM。

---
