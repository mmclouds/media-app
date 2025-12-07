## 2. explain.md（讲解内容）必须包含以下部分

### 🟦 A. React 核心概念讲解
- **组件拆分**：`MediaGeneratorMenu`（src/components/marketing/video-generator/sidebar.tsx）只管媒体类型选择；`MediaGeneratorConfigPanel`（config-panel.tsx）负责模型切换、prompt 输入、表单渲染；`MediaGeneratorResultPane`（preview-panel.tsx）专注状态卡片与 Feed。职责单一，数据从父级下行。
- **核心 Hooks**：`useMediaGeneratorController`（controller.tsx）用 `useState` 管 prompt/模型/历史/轮询状态，用 `useMemo` 过滤当前媒体可用模型，用 `useEffect` 处理模型切换与轮询，用 `useCallback` 固定回调引用，用 `useRef`+`useEffect` 在 ResultPane 里做滚动监听与悬停播放。
- **必要性**：`useState` 保证输入受控与按钮禁用；`useMemo` 避免每次渲染重建模型列表；`useEffect` 触发异步请求并在返回函数里清理 interval/事件；`useCallback` 避免子组件因新函数而 rerender；`useRef` 保存 DOM 引用，防止重复查询。
- **渲染关联**：只有依赖某段 state 的组件会被 diff 到，例如 prompt 更新只影响输入与按钮；`activeGeneration` 变动只让 ResultPane 更新卡片，Menu 不受影响，符合 React 按依赖粒度刷新的机制。
- **最佳实践**：所有交互组件声明 `'use client'`；回调里使用“防卸载”标志避免异步落在卸载组件；按钮封装成 `GenerateButton` 复用，减少重复逻辑。

### 🟦 B. Next.js 核心概念讲解
- **Server / Client 划分**：`src/app/[locale]/(marketing)/(pages)/media-studio/page.tsx` 是 Server Component（SSR + `generateMetadata`），交互区拆到 `'use client'` 组件（Workspace/Menu/Config/Result）里执行浏览器逻辑。
- **"use client"**：在交互组件顶部声明，允许使用 `useEffect`/DOM API/浏览器 fetch。
- **App Router**：路径 `[locale]/(marketing)/(pages)/media-studio/page.tsx`，软分组不影响 URL；`generateMetadata` 输出 title/description/pathname，Next.js 自动合并 SEO。
- **数据策略**：页面不直接取数，客户端用 fetch 调 `/api/media/*`；API Route `/api/media/generate` 处理请求体和 query；ResultPane 取 `/api/media/feed` 与 `/api/media/result/{taskId}`，均 `cache: 'no-store'` 保证实时性。
- **结构影响**：UI 模块集中在 `components/marketing/video-generator`，页面只引入 Workspace；静态字幕放在 `public/captions/placeholder.vtt`，API 路由在 `src/app/api`，符合 Next.js 约定式目录。

### 🟦 C. 代码逻辑拆解与架构说明
- **骨架**：`controller.tsx`（状态 Hook）→ `workspace.tsx` / `video-only-workspace.tsx`（组合布局）→ `config-panel.tsx`、`sidebar.tsx`、`preview-panel.tsx`、`generate-button.tsx`、`model-configs.tsx`（UI）→ `types.ts`、`data.ts`（类型与示例）→ API `/api/media/generate`、静态字幕 `public/captions/placeholder.vtt`。
- **关键模块**：`MODEL_REGISTRY` + `createInitialConfigs` 定义模型与默认配置；`useMediaGeneratorController` 管理媒体类型、模型、prompt、历史、轮询；ConfigPanel 动态渲染 `configComponent` 并触发 `GenerateButton`；ResultPane 负责 feed/状态卡片/悬停播放；Workspace 选择三栏或两栏布局。
- **数据流**：Hook 将 `mediaType/models/prompt/history/onGenerate/activeGeneration` 下发；Menu 调 `setMediaType` 影响模型；ConfigPanel 回传 prompt 与 config；GenerateButton 调用 `onGenerate` 发请求；ResultPane 读 `activeGeneration` 展示实时状态并渲染 feed，单向数据流清晰。
- **替代方案对比**：集中到单组件会耦合，现方案通过 Hook + 组件拆分便于复用与测试；模型表单注册式比巨大 `switch` 更易扩展；轮询若用 React Query/SWR 可减少手写代码，但当前轻量实现无额外依赖。
- **最佳实践**：fetch 包裹 try/catch 并呈现错误；state 更新前检查 `taskId`/`existingIds` 防竞态；`useEffect` 清理 interval/事件；UI 组件保持一致的语义与样式。

### 🟦 D. 初学者学习重点总结
- React 业务应拆分为“数据控制 Hook + 纯展示组件”，复杂状态统一在 Hook 中管理。
- 使用 `useEffect` 轮询时要判断终态并在 cleanup 中 `clearInterval`，否则会出现 zombie 请求。
- 将模型配置映射为 `configComponent` 可以消除巨型 `switch`，新增模型只需注册元数据。
- 通过 props 传递 `onChange`/`onGenerate` 回调实现单向数据流，避免子组件私自管理共享状态。
- Next.js App Router 页面保持 Server Component，交互部分下沉到 `'use client'` 组件；API Routes 供客户端 fetch。
- `useRef + addEventListener` 管理滚动/视频事件时，记得在 `useEffect` 中添加/清理监听，保证性能与内存安全。

---
