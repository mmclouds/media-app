## 2. explain.md（讲解内容）必须包含以下部分

### 🟦 A. React 核心概念讲解
- **组件拆分**：`MediaOnlyGeneratorWorkspace`（src/components/marketing/media-generator/media-only-workspace.tsx）用来在页面上快速放置“配置 + 结果”双栏；`MediaGeneratorSection`（src/components/marketing/media-generator-section.tsx，原营销示例组件）是静态示意块。两者都保持 UI 职责，实际生成逻辑由 Hook 提供。
- **核心 Hooks**：`MediaOnlyGeneratorWorkspace` 调用 `useMediaGeneratorController({ lockedMediaType: 'video' })`，利用 `useState` 存状态、`useEffect` 轮询、`useMemo` 选模型、`useCallback` 固定回调；`MediaGeneratorSection` 主要是纯展示，无业务 Hook。
- **必要性**：受控 state 让 prompt、模型配置、按钮禁用保持同步；`useEffect` 轮询任务并清理 interval；`useMemo` 避免模型列表每次重建；`useCallback` 稳定传给子组件的函数引用，减少不必要渲染。
- **渲染关联**：`MediaOnlyGeneratorWorkspace` 只有在 Hook 的 state 变化时局部刷新；`MediaGeneratorSection` 是静态组件，没有额外渲染负担。
- **最佳实践**：`MediaOnlyGeneratorWorkspace` 用 props 将 Hook 状态下发到 `MediaGeneratorConfigPanel` 与 `MediaGeneratorResultPane`，保持单向数据流；营销段落维持静态文案与卡片，便于随时替换为真实交互组件。

### 🟦 B. Next.js 核心概念讲解
- **Server / Client 划分**：`MediaOnlyGeneratorWorkspace` 以 `'use client'` 开头，运行在浏览器；`media-generator-section.tsx` 也是客户端组件但无数据请求，可直接嵌入 Server 页面。
- **"use client"**：让组件可以使用 `useEffect` 轮询 `/api/media/result/{taskId}` 和 DOM 事件（滚动、视频 hover）。
- **App Router**：工作区组件被 `src/app/[locale]/(marketing)/(pages)/media-studio/page.tsx` 引入，用于营销路由；`media-generator-section.tsx` 可以插入其他 App Router 页面作为静态区块。
- **数据策略**：`MediaOnlyGeneratorWorkspace` 通过客户端 fetch `/api/media/generate`、`/api/media/result`、`/api/media/feed`；`media-generator-section.tsx` 不发请求，仅展示占位内容。
- **结构影响**：交互组件现位于 `components/marketing/media-generator`；营销示意组件名也可改为 media 前缀以符合多媒体定位。

### 🟦 C. 代码逻辑拆解与架构说明
- **骨架**：`media-only-workspace.tsx` 直接组合 `MediaGeneratorConfigPanel` + `MediaGeneratorResultPane`，并从 `useMediaGeneratorController` 获取数据流；`media-generator-section.tsx` 构成纯 UI 卡片与按钮，用于宣传/示意。
- **关键逻辑**：`media-only-workspace.tsx` 通过 `lockedMediaType: 'video'` 固定媒体类型，避免渲染菜单；仍沿用 Hook 的 `availableModels/activeGeneration/onGenerate` 等输出。营销组件仅渲染静态 Card、Badge、Button，作为未来接入真实交互的占位。
- **数据流**：工作区：Hook state → ConfigPanel 受控输入 → `GenerateButton` 发请求 → ResultPane 根据 `activeGeneration` / feed 展示；营销区：无数据流，只有 props（locale 等）决定文案。
- **替代方案对比**：可以在页面直接堆 `ConfigPanel + ResultPane`，但封成 `MediaOnlyGeneratorWorkspace` 复用更方便；营销示意如果直接引用真实组件会引入不必要的 API 调用，因此保持静态版更安全。
- **最佳实践**：工作区保持单向数据流与 Hook 隔离；营销区用轻量组件减少客户端开销，不耦合真实生成逻辑。

### 🟦 D. 初学者学习重点总结
- React 业务应拆分为“数据控制 Hook + 纯展示组件”，复杂状态统一在 Hook 中管理。
- 使用 `useEffect` 轮询时要判断终态并在 cleanup 中 `clearInterval`，否则会出现 zombie 请求。
- 将模型配置映射为 `configComponent` 可以消除巨型 `switch`，新增模型只需注册元数据。
- 通过 props 传递 `onChange`/`onGenerate` 回调实现单向数据流，避免子组件私自管理共享状态。
- Next.js App Router 页面保持 Server Component，交互部分下沉到 `'use client'` 组件；API Routes 供客户端 fetch。
- `useRef + addEventListener` 管理滚动/视频事件时，记得在 `useEffect` 中添加/清理监听，保证性能与内存安全。

---
