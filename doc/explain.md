---

## 2. explain.md（讲解内容）必须包含以下部分

### 🟦 A. React 核心概念讲解
- 使用的核心能力：通过函数组件与 props 组合 UI，`MediaGeneratorResultPane` 负责结果列表与实时生成卡片，`VideoPreviewCard` 专注单个视频卡片，`GenerateButton` 封装生成按钮的行为与样式，体现了“容器组件 + 展示组件”的分层。
- 使用的 Hooks：`useState` 管理 Feed 数据、加载状态与提示文案；`useEffect` 处理副作用（拉取 Feed、滚动监听、轮询任务结果）；`useLayoutEffect` 在浏览器完成布局后测量卡片高度，用于虚拟滚动；`useMemo` 对 fallback 列表、实时资产等派生数据做缓存；`useCallback` 稳定请求与计算函数，避免子组件不必要的重渲染；`useRef` 保存滚动容器、请求锁和高度缓存等跨渲染的可变值。
- 为什么需要这些 Hooks：媒体生成的过程包含异步请求与定时轮询，如果不通过 `useEffect` 隔离副作用，会导致多次重复请求；虚拟滚动需要访问真实 DOM 尺寸，因此用 `useLayoutEffect` 与 `ResizeObserver` 保证测量时机正确；请求锁 `isFetchingRef` 与游标 `nextCursorRef` 用 `useRef` 保存，避免把它们放入 state 后引发额外渲染。
- 组件渲染机制如何与本代码相关：当 `activeGeneration` 或 `remoteFeed` 更新时，React 会重新渲染 `MediaGeneratorResultPane`，内部通过 `mapTaskToAsset` / `mapGenerationToAsset` 把后端数据映射成统一的 `VideoGeneratorAsset`，再交给 `VideoPreviewCard` 渲染 `<video>`。只要 `fileUuid` 有变化，对应的 src 就会切换到新的 `/api/files/download/[uuid]`，渲染逻辑无需感知网关细节。
- 哪些地方体现最佳实践：统一在映射层处理“fileUuid → 文件下载 URL”的逻辑，而不是在组件中直接拼接网关地址；通过类型 `MediaTaskResult` 把 `fileUuid` 显式建模，并在 UI 层只依赖内部 API（`/api/files/download`）而非第三方 `downloadUrl`，降低耦合并提升安全性。

### 🟦 B. Next.js 核心概念讲解（若本次代码使用 Next.js）
- Server Components 与 Client Components 的划分与原因：`generate-button.tsx`、`controller.tsx`、`media-generator-result-pane.tsx` 顶部均声明 `'use client'`，这些组件需要使用 `useEffect`、DOM 事件、`window.requestAnimationFrame` 与 `<video>` 播放控制，因此必须是 Client Component；页面本身可以仍然是 Server Component，只把交互部分下沉到客户端组件。
- `"use client"` 的作用与使用场景：通过 `"use client"` 告诉 Next.js 该文件需要在浏览器中执行，支持 Hooks 和浏览器 API；这里用于轮询 `/api/media/result/{taskId}`、监听滚动、测量高度以及控制 `<video>` 播放。
- App Router 的路由机制：页面位于 `src/app` 下（如首页或 media studio 页面），通过引入 `MediaGeneratorWorkspace` 渲染三栏布局；与之配套的 API Route 位于 `src/app/api/media/*` 与 `src/app/api/files/*` 下，分别代理媒体任务与文件下载，前端统一通过相对路径 `/api/...` 访问。
- 数据获取策略：媒体生成与轮询通过客户端 `fetch` 调用 `/api/media/generate`、`/api/media/result/[taskId]`，历史 Feed 通过 `/api/media/feed` 获取，均使用 `cache: 'no-store'`，确保实时性；文件内容通过 `/api/files/download/[uuid]` 获取，由 API Route 转发到 `AI_GATEWAY_URL` 的公开下载接口。
- `next/link` 与 `next/image` 的核心用法：本次改动集中在 `<video>` 播放上，没有直接调整 `next/link` / `next/image`，但封面图仍然可以结合 `useVideoPoster` 生成海报，再通过 `<Image>` 或 `<video poster>` 展示，保持资源加载优化。
- 文件结构对数据流与组件行为的影响：`src/components/marketing/media-generator` 下集中放置所有生成相关组件与控制逻辑，`src/app/api/media` 与 `src/app/api/files` 下负责与网关交互。页面只关心“生成 + 结果显示”这两个大块，具体的数据流被封装在 Controller（Hook）与映射函数中，利于扩展更多媒体类型。

### 🟦 C. 代码逻辑拆解与架构说明
- 文件结构解释
  - `src/components/marketing/media-generator/generate-button.tsx`：封装生成按钮，接收 `onGenerate` 回调以及 `mediaType` / `modelId` / `prompt` / `config`，内部只关心点击时调用回调，不直接与 API 交互。
  - `src/components/marketing/media-generator/controller.tsx`：`useMediaGeneratorController` Hook 处理所有与媒体任务相关的逻辑：触发生成（`/api/media/generate`）、轮询结果（`/api/media/result/[taskId]`）、维护 `activeGeneration`、管理当前模型与配置。
  - `src/components/marketing/media-generator/types.ts`：集中定义类型，本次在 `MediaTaskResult` 中新增 `fileUuid?: string | null` 字段，使轮询接口返回的文件标识在类型层面可见，并通过 `VideoGenerationState` 传递到 UI。
  - `src/components/marketing/media-generator/media-generator-result-pane.tsx`：负责展示实时生成状态与历史 Feed，其中的 `mapTaskToAsset` / `mapGenerationToAsset` 是数据映射中枢，新增对 `fileUuid` 的处理并调用 `buildFileDownloadUrl` 生成内部下载地址。

- 每段关键代码的作用
  - `MediaTaskResult.fileUuid`：承载后端 TaskResultDto 中的 `fileUuid` 字段，轮询结果更新时会合并到 `activeGeneration` 中，供 UI 使用。
  - `buildFileDownloadUrl(fileUuid)`：将 `fileUuid` 转为 `/api/files/download/${encodeURIComponent(fileUuid)}`，这是前端获取多媒体数据的唯一入口，内部再由 API Route 负责拼接 `AI_GATEWAY_URL/api/public/files/download/...`。
  - `mapTaskToAsset(task: MediaFeedItem)`：从 `/api/media/feed` 返回的历史任务中读取 `fileUuid`，通过 `buildFileDownloadUrl` 计算 `src`，并仅在没有 `fileUuid` 时退回到 `task.onlineUrl`，彻底去掉 `downloadUrl` 参与 src 选择。
  - `mapGenerationToAsset(generation: VideoGenerationState)`：从轮询得到的当前任务状态中读取 `fileUuid`，同样优先通过 `buildFileDownloadUrl` 生成 `src`，保证右侧实时预览卡片与历史列表使用同一访问方式。

- 数据流与组件通信方式
  1. 用户在配置面板输入 prompt，点击 `GenerateButton`，组件调用从 Controller 传入的 `onGenerate`。
  2. `useMediaGeneratorController.handleGenerate` 请求 `/api/media/generate`，拿到 `taskId` 后在 `activeGeneration` 中存入 `{ taskId, status: 'pending', prompt, progress: 0 }`。
  3. 一个 `useEffect` 根据 `activeGeneration.taskId` 与 `status` 启动定时轮询 `/api/media/result/{taskId}`，每次将接口返回的 `MediaTaskResult`（包含 `fileUuid`）合并进 `activeGeneration`。
  4. `MediaGeneratorResultPane` 接收到最新的 `activeGeneration`，通过 `mapGenerationToAsset` 生成 `VideoGeneratorAsset`，`VideoPreviewCard` 使用 `fileUuid` 生成的内部下载 URL 作为 `<video src>`。
  5. 登录用户的历史任务由 `loadFeed` 调用 `/api/media/feed` 获取，`mapTaskToAsset` 同样借助 `fileUuid` 生成 src，构成统一的媒体访问路径。

- 可替代实现 vs 当前实现的优势
  - 替代实现：直接在前端使用轮询结果中的 `downloadUrl` 或网关原始 URL 作为 `<video src>`，虽然实现简单，但会暴露外部网关结构与权限边界，一旦网关域名或路径变动，需要在多个组件中批量修改。
  - 当前实现：前端只依赖 `fileUuid`，具体下载地址由 `/api/files/download/[uuid]` API Route 负责拼接与转发，任何网关变更都可以在一个地方收敛修改，前后端职责清晰，也更符合“通过内部 API 代理对接第三方服务”的架构惯例。

- 有哪些隐含的最佳实践？
  - 显式建模后端字段：在 TypeScript 类型中加入 `fileUuid`，避免在代码中出现大量 `"fileUuid" in x` 之类的弱类型判断。
  - 单一资源访问入口：无论是实时预览还是历史列表，都只通过 `/api/files/download/[uuid]` 访问文件，避免同时混用 `downloadUrl`/`onlineUrl` 导致行为不一致。
  - 渐进式兼容：`mapTaskToAsset` 仍保留 `task.onlineUrl` 作为最后兜底，兼容旧数据；但去掉了 `downloadUrl` 依赖，把未来的访问路径引导到文件系统。

### 🟦 D. 初学者学习重点总结
- 学会用类型（如 `MediaTaskResult`）统一描述后端返回的数据结构，再通过映射函数把它们转成 UI 友好的格式。
- 前端访问第三方存储/网关时，应优先通过自己的 API Route（如 `/api/files/download/[uuid]`），而不是在组件中直接写外部 URL。
- 利用 `useEffect` + 轮询模式可以实现“任务进度查询”，关键是要检测终态并停止轮询，避免浪费资源。
- `useRef` 不参与渲染，却可以用来存储请求锁、游标、DOM 引用，是处理滚动加载、虚拟列表时非常重要的工具。
- 把“实时生成”和“历史记录”统一成同一种 `VideoGeneratorAsset` 数据结构，可以让展示组件保持简洁、易维护。

---

## 3. AI 工作方式要求
- 用户只要请求“写代码”“生成组件”等内容，你自动进入教学模式  
- 主窗口只放代码，讲解全部进入 `explain.md`  
- 采用现代 React（函数组件 + Hooks）  
- Next.js 默认使用 App Router（13+）  
- 自动补全用户未明确但必要的工程化内容  
- 若有更佳写法，请主动说明并写在 `explain.md`  

---

## 4. 输出格式示例（你必须完全遵守）

### 主窗口（代码）示例：
````md
```tsx
// 这里是代码（仅代码）
```
````

