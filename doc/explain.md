---

## 2. explain.md（讲解内容）必须包含以下部分

### 🟦 A. React 核心概念讲解
- 本次改动涉及的组件包括：`MediaGeneratorWorkspace`、`MediaOnlyGeneratorWorkspace`、`MediaGeneratorResultPane` 等，它们都是函数组件，通过 props 接收外部数据（例如 `asset`、`loading`、`activeGeneration`），符合 React “自上而下数据流”的设计。
- 组件中大量使用 props（如 `className`、`preferredModelId`、`asset`），用于父组件向子组件传递配置与数据，这种单向数据流让组件更易于复用和测试。
- 使用的 state 主要集中在结果面板 `MediaGeneratorResultPane` 内部，例如 `remoteFeed`、`hasMore`、`isFetching`、`feedNotice` 等，用来管理“远端媒体 Feed、加载状态和提示信息”等 UI 状态。
- React Hooks 使用情况：
  - `useState`：管理远端列表、加载状态、提示文案、可见条目数量等，将 UI 状态与组件生命周期绑定。
  - `useRef`：`scrollRef`、`nextCursorRef`、`hasMoreRef`、`isFetchingRef`、`cardRef` 用来持久化 DOM 引用和一些不会触发重渲染的状态（如滚动容器、分页游标、虚拟列表高度映射等）。
  - `useEffect`：在依赖变化时执行副作用，例如首次加载用户 Feed、监听滚动容器滚动、在登录状态变化时重置 Feed 等。
  - `useLayoutEffect`：在布局阶段测量卡片高度并回传给虚拟列表逻辑，保证高度计算与 DOM 更新同步，减少视觉抖动。
  - `useCallback`：封装 `loadFeed`、虚拟列表中的 `recomputeOffsets`、`updateRange` 等函数，避免在依赖不变时生成新的函数引用，减少子组件和监听器重复绑定。
  - `useMemo`：用在 `fallbackFeed` 和 `liveAsset` 等派生数据上，根据输入数据计算出要展示的列表或当前活动 Asset，避免不必要的重复计算。
- Hooks 的必要性：
  - 远端 Feed 拉取、分页滚动、虚拟列表高度测量等都属于副作用和可变状态，必须用 `useState` + `useEffect`/`useLayoutEffect` 来管理，否则很难跟踪数据变化并触发视图更新。
  - `useRef` 用于保存不可序列化或不希望触发渲染的对象（例如 DOM 节点、游标、布尔标记），能显著降低渲染次数。
  - `useCallback` / `useMemo` 结合虚拟列表、`VideoPreviewCard` 等组件，可以减少不必要的子组件重渲染，是性能优化的常见最佳实践。
- 组件渲染机制与本代码的关系：
  - 当 `remoteFeed`、`fallbackFeed` 或 `activeGeneration` 变化时，React 会触发对应组件重新渲染，从而更新媒体列表或顶部实时预览卡片。
  - 通过 `usingRemoteFeed` 这个布尔值，渲染逻辑在“远端真实数据”和“本地占位数据”间进行分支，确保在不同登录/数据状态下 UI 渲染结果稳定。
  - 虚拟滚动逻辑根据滚动位置动态计算 `visibleItems`，只渲染可见范围内的卡片，提升大列表渲染性能。
- 体现的 React 最佳实践：
  - 清晰的状态划分：用户登录状态、远端 Feed、占位 Feed、滚动虚拟化、错误提示分离在不同的 state 与派生变量中。
  - 使用 Hooks 封装复杂行为：虚拟列表逻辑封装在 `useVirtualFeed` 内部，通过参数和回调解耦具体页面。
  - 使用自定义 Hooks `useCurrentUser`、`useVideoPoster` 简化通用逻辑，让组件只关注“展示层”。
  - props 设计简洁：`MediaGeneratorResultPane` 只依赖 `asset`、`loading` 与 `activeGeneration`，上层组件可以自由组合。

### 🟦 B. Next.js 核心概念讲解（若本次代码使用 Next.js）
- 本次改动主要集中在 `src/components/marketing/media-generator/` 下的 UI 组件，这些组件会被 App Router 下的页面引用，本身作为 Client Components 使用。
- Server Components 与 Client Components：
  - 带有 `'use client';` 的文件（如 `media-generator-workspace.tsx`、`media-only-generator-workspace.tsx`、`media-generator-result-pane.tsx`）全部是 Client Components，允许使用浏览器相关 API、事件处理和 Hooks。
  - 上层的页面文件（`page.tsx`）可以是 Server Component，将数据和配置通过 props 下发这些 Client Components，从而实现“服务端渲染 + 客户端交互”的组合。
- `"use client"` 的作用与使用场景：
  - 明确告诉 Next.js 该组件需要在浏览器端执行，因此可以使用 `useState`、`useEffect` 等 Hook。
  - 像媒体生成器这类需要滚动监听、虚拟化渲染、用户交互（点击按钮、hover 播放视频）的模块，都必须作为 Client Component。
- App Router 路由机制简要：
  - 实际页面路由位于 `src/app/[locale]/(marketing)/...` 目录，这里修改的工作区组件会被这些页面引用。
  - App Router 通过文件结构控制路由（`page.tsx`）、布局（`layout.tsx`）、加载状态（`loading.tsx`）、错误边界（`error.tsx`），本次改动未改变此结构，仅调整页面内部 UI 逻辑。
- 数据获取策略与缓存：
  - `MediaGeneratorResultPane` 使用浏览器端 `fetch('/api/media/feed?...')` 拉取用户生成的媒体数据，该调用在客户端执行，等价于 CSR（客户端数据获取）。
  - 请求中显式设置 `cache: 'no-store'`，避免缓存，确保用户看到最新的生成结果，这与 App Router 的服务端缓存策略互补。
  - 分页参数通过 `URLSearchParams` 构造，遵循统一的 API 约定，便于与后端 `/api/media/feed` 路由对接。
- 资源与文件结构的影响：
  - 将媒体生成 UI 拆分为 `Workspace`、`ConfigPanel`、`ResultPane` 等组件，使页面功能模块化，便于复用（如 `MediaOnlyGeneratorWorkspace` 固定媒体类型为视频）。
  - 本次移除 `demoVideoAssets` 之后，静态 demo 视频资源不再与组件耦合，减少静态外链依赖，利于迁移到真实生产环境。

### 🟦 C. 代码逻辑拆解与架构说明
- 文件结构说明：
  - `src/components/marketing/media-generator/media-generator-workspace.tsx`：完整媒体生成器工作区（多媒体类型），负责组合菜单、配置面板和结果面板。
  - `src/components/marketing/media-generator/media-only-generator-workspace.tsx`：仅视频模式的工作区，锁定 `mediaType` 为 `'video'`，供特定场景复用。
  - `src/components/marketing/media-generator/media-generator-result-pane.tsx`：结果展示面板，负责展示实时生成结果、用户历史 Feed、滚动虚拟化等。
  - `src/components/marketing/media-generator/data.ts`：原本存放 `demoVideoAssets` 静态 demo 视频，本次改动后不再导出内容，仅保留空模块导出以避免误用。
- 每段代码的主要作用：
  - `MediaGeneratorWorkspace`：
    - 使用 `useMediaGeneratorController` 获取媒体类型、模型列表、文案 prompt、生成状态等核心业务数据。
    - 取消对 `demoVideoAssets` 的依赖，直接构造一个简洁的 `currentAsset` 占位对象（`id: 'demo-video'` 等），用于在无真实生成结果时提供基础信息。
    - 将 `currentAsset` 传递给 `MediaGeneratorResultPane`，保持布局结构不变。
  - `MediaOnlyGeneratorWorkspace`：
    - 通过 `useMediaGeneratorController({ lockedMediaType: 'video' })` 固定媒体类型为视频。
    - 同样去掉 `demoVideoAssets`，改为本地构造 `currentAsset` 占位对象，保证在仅视频模式下也不会再引用 demo 资源。
  - `MediaGeneratorResultPane`：
    - 移除对 `demoVideoAssets` 的引用，不再依赖外部 GCP 示例视频 URL。
    - 将 `DEFAULT_VIDEO_SRC` 和 `LOADING_VIDEO_SRC` 置为空字符串，`DEFAULT_POSTER` 和 `LOADING_POSTER` 使用本地封面 `/images/media/fengmian.jpg` 作为默认图片来源。
    - `fallbackFeed` 逻辑改为基于传入的 `asset` 构造占位列表：以当前 `asset` 为基础，复制多份并修改 `id` 为 `...-placeholder-...`，用于未登录或无远端数据时的占位展示，不再引入额外 demo 视频内容。
    - 登录提示文案从 `Showing demo feed.` 改为单纯的 `Sign in to view your recent renders.`，语义回归到“请登录查看自己的渲染记录”，避免暗示 demo feed。
    - 其余逻辑（远端 Feed 拉取、滚动加载、虚拟列表、视频封面生成）保持不变，继续为真实用户数据服务。
- 数据流与组件通信方式：
  - 顶层页面将配置/上下文传递给工作区组件（如默认模型、className 等）。
  - 工作区组件通过控制器 Hook `useMediaGeneratorController` 管理业务状态，再把 `mediaType`、`models`、`prompt` 等 props 传递给配置面板和结果面板。
  - 结果面板内部再基于 props + 自身 state（远端 Feed、fallbackFeed）做组合，最终通过 `VideoPreviewCard` 等子组件完成具体渲染。
  - 移除 `demoVideoAssets` 之后，所有展示数据要么来自外部 props，要么来自真实的 API 返回，减少“硬编码假数据”的耦合。
- 可替代实现 vs 当前实现的优势：
  - 替代实现 1：完全移除 fallback 占位列表，未登录或无数据时只显示空状态。优点是逻辑更简单，缺点是视觉上不够饱满，Demo/营销场景下体验偏“空白”。
  - 替代实现 2：将 demo 数据迁移到配置或 CMS，由后端注入。优点是可配置，缺点是增加后端负担，而且与真实用户数据混在一起容易混淆。
  - 当前实现：去掉具体 demo 视频内容及硬编码 URL，仅保留基于当前 `asset` 的占位克隆，既保证 UI 结构与虚拟列表逻辑完整，又不引入外部 demo 视频资源，更符合生产环境的安全与合规要求。
- 隐含的最佳实践：
  - 避免在组件内硬编码外部 demo 媒体资源（特别是视频 URL），减少对第三方存储和不受控内容的依赖。
  - 将“真实数据逻辑（远端 Feed）”和“占位 UI（fallbackFeed）”清晰区分，便于后续替换或扩展。
  - 通过简化 `data.ts`，用空导出明确表达“不要再从这里取 demo 数据”，降低未来误用风险。

### 🟦 D. 初学者学习重点总结
- 理解 React 函数组件与 props 的关系：父组件通过 props 向子组件传递数据和回调，保持单向数据流。
- 熟练掌握 Hooks：`useState` 管理组件内部状态，`useEffect` 处理副作用，`useRef` 保存 DOM 引用和不会触发重渲染的值，`useMemo`/`useCallback` 做性能优化。
- 学会区分真实数据与 demo/占位数据：生产环境中应尽量减少硬编码 demo 资源，尤其是外部媒体文件。
- 掌握 Next.js Client Components 的使用场景：涉及交互、滚动监听、虚拟列表、浏览器端请求等逻辑时，需要在 `'use client'` 组件中实现。
- 理解 API 调用与前端组件的配合：通过调用 `/api/media/feed` 获取用户生成记录，再经过适配函数转为展示用的 `VideoGeneratorAsset`。
- 关注文件结构与职责划分：工作区组件（Workspace）、配置面板（ConfigPanel）、结果面板（ResultPane）职责清晰，有利于维护和扩展。
- 学会安全和合规思维：移除硬编码 demo 视频、避免依赖不受控外部内容，是正式产品上线前常见且必要的一步。

---

## 3. AI 工作方式要求补充说明
- 本次改动已遵守指引：主对话窗口只输出代码及必要的简要说明，详细教学内容集中在本文件中。
- 组件继续采用现代 React（函数组件 + Hooks），并与 Next.js App Router 兼容，方便后续在页面中直接引用。
- 若未来需要再次加入演示内容，建议通过受控的配置或后端接口注入，而不是在前端硬编码 demo 媒体数组。 

