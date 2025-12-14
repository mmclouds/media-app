---

## 2. explain.md（讲解内容）必须包含以下部分

### 🟦 A. React 核心概念讲解
- 组件/props/state：`MediaGeneratorResultPane` 通过 props 接收 `asset`、`loading`、`activeGeneration`，内部用 `useState` 维护远端 Feed（`remoteFeed`）、分页信息和提示，体现组件内局部状态管理。
- Hooks 使用：`useEffect` 监听登录状态与滚动事件触发加载；`useMemo` 生成兜底数据与直播任务资产；`useRef` 保存滚动容器与分页游标，避免重复请求；`useCallback` 包裹异步加载与悬停播放回调，保证引用稳定。
- 为什么需要这些 Hooks：`useRef` 持久化 cursor/flag 防止重复 fetch；`useCallback`/`useMemo` 避免在依赖变更前重复创建函数/数据；`useEffect` 协调副作用（滚动监听、登录切换重置数据）。
- 渲染机制关联：状态/props 变化触发组件重新渲染，`useMemo` 的缓存减少不必要的重新计算；`key={item.id}` 确保列表渲染稳定。
- 最佳实践体现：分页去重合并逻辑放在 `setRemoteFeed` 回调中，保证基于最新 state；悬停播放用 `useHoverPlayback` 隔离副作用逻辑，易于复用与测试。

### 🟦 B. Next.js 核心概念讲解（若本次代码使用 Next.js）
- Server/Client Components：文件顶端 `"use client"` 声明为客户端组件，允许使用状态与事件（滚动、hover 播放）；与 Server Components 分离，避免在服务端执行浏览器 API。
- `"use client"` 作用：开启客户端渲染能力，否则 `useState`/`useEffect` 等无法使用。
- App Router 机制：组件位于 `src/components` 被 `app` 路由页面引入；滚动分页与数据请求在客户端完成，复用 App Router 的 `fetch` 接口。
- 数据获取策略：feed 通过客户端 `fetch('/api/media/feed?...')`，使用 `cache: 'no-store'` 强制走实时数据；分页用 cursor 控制，避免 SSR 缓存干扰。
- next/link 与 next/image：本段未用，但保持视频与图片直接使用原生标签以支持动态源。
- 文件结构影响：组件独立于页面路由，方便在任意路由下插入；分页状态和 UI 封装在同一文件，降低跨文件数据耦合。

### 🟦 C. 代码逻辑拆解与架构说明
- 文件结构：`media-generator-result-pane.tsx` 封装媒体结果面板，内部包含分页加载、播放卡片与工具函数；`useHoverPlayback`/`mapTaskToAsset` 等帮助函数在同文件提供局部逻辑。
- 主要代码作用：`loadFeed` 负责向 `/api/media/feed` 请求数据并标准化；`setRemoteFeed` 合并新旧数据；滚动监听在容器触底时触发下一页；`VideoPreviewCard` 渲染每条视频并处理悬停播放/封面。
- 数据流与通信：`loadFeed` 更新 `remoteFeed`，`visibleItems` 依据登录态选择远端/本地演示数据，最终传给 `VideoPreviewCard`。`activeGeneration` 变化触发刷新，保证最新任务显示在顶部。
- 可替代实现 vs 当前优势：合并逻辑采用“保持已有顺序 + 追加新数据 + 覆盖已存在项”方案，避免旧逻辑将新页数据插入顶部导致视觉跳变；相比简单 concat，还能更新已存在任务的最新状态。
- 隐含最佳实践：分页游标通过 `useRef` 避免重复渲染；错误处理提供可重试提示；视频封面缺失时尝试自动捕获 poster 并记录错误日志。

### 🟦 D. 初学者学习重点总结
- 理解客户端组件需加 `"use client"`，才能使用状态/副作用。
- 分页加载要在合并逻辑中保持原有顺序，并处理去重/覆盖。
- `useRef` 适合保存游标/布尔标记，避免无意义重渲染。
- `useCallback`/`useMemo` 可稳定函数与衍生数据，减少依赖触发。
- 列表渲染时使用稳定的 `key`，保证 UI 更新可预期。

---
