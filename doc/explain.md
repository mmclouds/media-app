---

## 2. explain.md（讲解内容）必须包含以下部分

### 🟦 A. React 核心概念讲解
- 组件：`MediaGeneratorResultPane` 与 `VideoPreviewCard` 依赖 props 控制展示，利用状态与副作用协调远端数据与 UI。
- 组件更新：用统一的 `VideoPreviewCard` 展示进行中/失败/完成状态，去掉顶部独立进度条，保持框架一致。
- Hooks：使用 `useState` 维护远端 feed、加载提示、可见数量；`useEffect` 处理登录变化、滚动监听、轮询拉取；`useMemo` 生成 fallback feed、实时任务资产以及是否需要轮询的判定；`useCallback` 稳定化拉取函数与视频悬停播放回调；`useRef` 保存滚动容器、游标、定时器以及视频实例。
- 需要这些 Hooks：`useEffect` 让登录/生成任务/滚动触发数据请求与事件清理；`useCallback` 防止函数重建导致多余副作用；`useMemo` 规避重复计算；`useRef` 保存跨渲染的 cursor/interval 和视频 DOM；`useState` 驱动 UI 更新。
- 渲染机制：状态变化会重新渲染列表，从 API 返回的新状态合并到已有 feed，使视频卡片实时更新；依赖数组控制副作用触发频率。
- 最佳实践：将轮询、滚动加载、状态合并封装为纯函数/Hook 组合；在数据映射时先归一化状态，避免大小写差异；使用 `void loadFeed` 明确异步调用不关心返回值。

### 🟦 B. Next.js 核心概念讲解（若本次代码使用 Next.js）
- Server/Client：文件顶端 `"use client"`，明确该组件在客户端渲染，依赖浏览器事件与 `fetch`。
- `"use client"` 作用：允许使用浏览器 API、状态与副作用；与 Server Component 分层保持数据流清晰。
- App Router：组件位于 `src/app` 体系下的营销模块，作为页面子组件由路由树渲染；路由分段与布局未更改。
- 数据获取策略：客户端 `fetch` 配合 `cache: 'no-store'` 拉取 `/api/media/feed`，通过轮询更新，未使用 SSG/ISR。
- next/link 与 next/image：当前未涉及，视频使用 `<video>` 与 `<img>` 直接渲染。
- 文件结构影响：结果面板独立封装，方便在不同 workspace 中复用，同时内部自管滚动与轮询，不影响上层路由逻辑。

### 🟦 C. 代码逻辑拆解与架构说明
- 文件结构：`media-generator-result-pane.tsx` 集中处理 feed 拉取、滚动加载、状态卡片与视频预览展示。
- 每段代码作用：`loadFeed` 负责分页请求并合并状态（不再轮询，只在登录、生成任务开始、滚动时触发）；多处 `useEffect` 分别响应登录变化、滚动触底、生成任务开始；`VideoPreviewCard` 根据状态选择正常视频、loading 循环视频或失败占位图。
- 数据流与通信：父组件传入 `activeGeneration`/`loading` 与当前 asset；组件内部根据登录与 feed 数据决定展示，滚动与轮询更新 `remoteFeed`，UI 由状态驱动。
- 可替代实现：可用 SWR/React Query 统一管理轮询与缓存，但当前手写逻辑减少依赖、可细化轮询条件；可用 IntersectionObserver 替代滚动监听，但现有实现更直接。
- 隐含最佳实践：状态归一化 (`normalizeStatus`) 避免大小写问题；轮询仅在可见未完成任务时开启，降低请求压力；合并远端数据时保留已有顺序并更新旧项。

### 🟦 D. 初学者学习重点总结
- 如何用 `useEffect` + `useRef` 管理滚动监听与轮询定时器的绑定/清理。
- 远端分页数据合并策略：以最新结果为优先并保持去重，避免重复请求。
- 根据状态切换媒体展示占位（正常/加载/失败）的一致 UI 结构，实时任务也复用同一组件。
- 在客户端组件中使用 `fetch` 配合 `cache: 'no-store'` 获取最新数据。

---
