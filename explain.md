## 2. explain.md（讲解内容）必须包含以下部分

### 🟦 A. React 核心概念讲解
- **组件拆分**：`MediaGeneratorWorkspace`（三栏，含菜单/配置/结果）与 `MediaOnlyGeneratorWorkspace`（双栏，去掉菜单）共享同一套逻辑。逻辑集中在 Hook，组件保持 UI 职责。
- **核心 Hooks**：两个 Workspace 都调用 `useMediaGeneratorController`（三栏不锁媒体类型，双栏通过 `lockedMediaType: 'video'` 固定类型），利用 `useState` 存状态、`useEffect` 轮询、`useMemo` 选模型、`useCallback` 固定回调。
- **必要性**：受控 state 让 prompt、模型配置、按钮禁用保持同步；`useEffect` 轮询任务并清理 interval；`useMemo` 避免模型列表每次重建；`useCallback` 稳定传给子组件的函数引用，减少不必要渲染。
- **渲染关联**：Workspace 只在依赖的 Hook state 变化时局部刷新；`MediaGeneratorSection` 是静态组件，没有额外渲染负担。
- **最佳实践**：通过 props 将 Hook 状态下发到 ConfigPanel 与 ResultPane，保持单向数据流；按需选择三栏或双栏布局，避免重复逻辑。

### 🟦 B. Next.js 核心概念讲解
- **Server / Client 划分**：`MediaGeneratorWorkspace` / `MediaOnlyGeneratorWorkspace` 以 `'use client'` 开头，运行在浏览器。
- **"use client"**：让组件可以使用 `useEffect` 轮询 `/api/media/result/{taskId}` 和 DOM 事件（滚动、视频 hover）。
- **App Router**：`media-studio/page.tsx` 现在引入三栏版 `MediaGeneratorWorkspace`。
- **数据策略**：两个 Workspace 通过客户端 fetch `/api/media/generate`、`/api/media/result`、`/api/media/feed`。
- **结构影响**：交互组件位于 `components/marketing/media-generator`，可按需选择三栏/双栏变体。

### 🟦 C. 代码逻辑拆解与架构说明
- **骨架**：`workspace.tsx`（三栏）与 `media-only-workspace.tsx`（双栏）都组合 `MediaGeneratorConfigPanel` + `MediaGeneratorResultPane`，并从 `useMediaGeneratorController` 获取数据流。
- **关键逻辑**：三栏版允许切换媒体类型；双栏版通过 `lockedMediaType: 'video'` 固定媒体类型，避免渲染菜单；两者共享 `availableModels/activeGeneration/onGenerate` 等输出。
- **数据流**：工作区：Hook state → ConfigPanel 受控输入 → `GenerateButton` 发请求 → ResultPane 根据 `activeGeneration` / feed 展示。
- **替代方案对比**：可以在页面直接堆 `ConfigPanel + ResultPane`，但封成 Workspace 复用更方便；如需纯展示可另写静态组件而不引入业务逻辑。
- **最佳实践**：工作区保持单向数据流与 Hook 隔离，按需选择三栏/双栏以满足不同页面布局。

### 🟦 D. 初学者学习重点总结
- React 业务应拆分为“数据控制 Hook + 纯展示组件”，复杂状态统一在 Hook 中管理。
- 使用 `useEffect` 轮询时要判断终态并在 cleanup 中 `clearInterval`，否则会出现 zombie 请求。
- 将模型配置映射为 `configComponent` 可以消除巨型 `switch`，新增模型只需注册元数据。
- 通过 props 传递 `onChange`/`onGenerate` 回调实现单向数据流，避免子组件私自管理共享状态。
- Next.js App Router 页面保持 Server Component，交互部分下沉到 `'use client'` 组件；API Routes 供客户端 fetch。
- `useRef + addEventListener` 管理滚动/视频事件时，记得在 `useEffect` 中添加/清理监听，保证性能与内存安全。
