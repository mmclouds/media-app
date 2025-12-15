---

## 2. explain.md（讲解内容）必须包含以下部分

### 🟦 A. React 核心概念讲解
- 本次改动主要围绕 `MediaGeneratorResultPane` 以及内部的 `VideoPreviewCard` 等函数组件展开，这些组件通过 props 接收 `asset`、`loading`、`activeGeneration` 等数据，符合 React 单向数据流的设计。
- 组件内部的核心 state 包括：
  - `remoteFeed`：保存从 `/api/media/feed` 获取到的远端媒体任务列表。
  - `hasMore`、`isFetching`、`feedNotice`：分别控制分页状态、加载状态与错误/提示信息。
  - `visibleCount`：在未登录或无远端数据时，控制占位视频卡片的展示数量。
- 使用到的 Hooks 及其职责：
  - `useState`：管理远端列表、分页状态、提示文案等 UI 状态，一旦状态变化会触发组件重新渲染。
  - `useRef`：`scrollRef`、`nextCursorRef`、`hasMoreRef`、`isFetchingRef`、`cardRef`、`videoRef` 持久化保存 DOM 节点和不会触发重渲染的可变数据（例如分页游标、是否正在请求等）。
  - `useEffect`：在登录状态变化、滚动事件、任务状态变化时执行副作用，例如拉取 Feed、监听滚动触底加载更多、轮询任务结果。
  - `useLayoutEffect`：在布局阶段测量卡片高度，并回传给虚拟列表逻辑，保证高度计算与 DOM 更新同步，避免滚动抖动。
  - `useCallback`：封装 `loadFeed`、`recomputeOffsets`、`updateRange`、`handleMouseEnter`、`handleMouseLeave` 等函数，使其在依赖不变时保持引用稳定，减少无谓的重新绑定。
  - `useMemo`：用于计算 `fallbackFeed`、`liveAsset` 等派生数据，避免在每次渲染中重复做相同的计算。
- 为什么需要这些 Hooks？
  - 远端数据拉取、滚动监听、任务轮询都是标准的副作用场景，必须用 `useEffect`/`useLayoutEffect` 搭配 `useState` 才能在数据变化时正确更新 UI。
  - 滚动容器、视频节点、分页游标等属于“可变但不会影响渲染”的信息，用 `useRef` 存储可以减少不必要的重渲染。
  - 虚拟列表与鼠标悬停播放逻辑都依赖事件监听，如果不使用 `useCallback` 固定引用，每次渲染都重新绑定监听器会带来性能和行为上的问题。
- 组件渲染机制与本次修改的关系：
  - 通过 `mapTaskToAsset`，Feed 接口返回的 `MediaFeedItem` 会被转换为 `VideoGeneratorAsset`，其中 `asset.src` 现在优先使用 `temporaryFileUrl`。
  - `VideoPreviewCard` 中 `<video>` 组件只关心 `asset.src`，因此只要适配层修改为使用 `temporaryFileUrl`，渲染层就会自动改为通过临时 URL 加载视频资源。
  - `resolvedSrc` 根据任务状态选择实际播放地址：在非错误、非加载状态下就是 `asset.src`，从而完成“状态 → 数据 → UI”的整条渲染链路。
- 体现的 React 最佳实践：
  - 把“后端数据结构与字段差异”隔离在纯函数 `mapTaskToAsset` / `mapGenerationToAsset` 中，UI 组件只使用统一的 `VideoGeneratorAsset`，大幅降低耦合度。
  - 虚拟滚动与悬停播放逻辑封装为 Hook/辅助函数，保持组件本身聚焦于展示，便于后续维护和测试。
  - 通过明确的状态切分（加载中、错误、已完成）控制 `<video>` 的 src/poster，更容易处理各种边界情况。

### 🟦 B. Next.js 核心概念讲解（若本次代码使用 Next.js）
- 本次改动没有触及页面级 `route.ts` 或 `page.tsx` 文件，但仍处于 Next.js App Router 体系之中。
- Server Components 与 Client Components：
  - `src/components/marketing/media-generator/media-generator-result-pane.tsx` 顶部声明了 `'use client';`，说明它是 Client Component，可以在浏览器中执行、使用所有 React Hooks 并监听用户交互。
  - 上层页面（例如 `src/app/[locale]/(marketing)/.../page.tsx`）通常为 Server Component，负责 SSR 和 SEO，再通过 props 把必要数据传递给此 Client Component。
- `"use client"` 的作用与使用场景：
  - 让组件在客户端渲染，支持 `useState`、`useEffect` 等 Hook，能够访问 DOM、处理滚动、控制 `<video>` 播放等浏览器能力。
  - 像媒体生成器这样包含滚动虚拟化、轮询、悬停播放等复杂交互的模块，必须实现为 Client Component。
- 数据获取策略与本次改动：
  - `/api/media/feed`、`/api/media/result/[taskId]` 是运行在服务器（Edge/Node）上的 API Route，它们负责从 AI Gateway 拉取数据，并通过 JSON 形式返回。
  - 结果面板组件在客户端通过 `fetch('/api/media/feed')`、`fetch('/api/media/result/[taskId]')` 获取数据，属于客户端数据拉取（CSR）模式，并显式设置了 `cache: 'no-store'` 来保证实时性。
  - 我们本次只调整了前端映射逻辑（如何选择视频加载 URL），没有改变 SSR/SSG/ISR 策略，因此不会影响页面 SEO 或服务器渲染行为。
- 文件结构对数据流与组件行为的影响：
  - `src/app/api/media/feed/route.ts`：负责鉴权、拼接查询参数、调用 AI Gateway 的 `/api/v1/media/feed/cursor` 接口并把 `payload.data` 返回给前端。
  - `src/app/api/media/result/[taskId]/route.ts`：负责查询单条任务结果，返回数据结构与 Feed 中单条记录基本一致。
  - `src/components/marketing/media-generator/types.ts`：用 TypeScript 明确了 `MediaFeedItem`、`MediaTaskResult`、`VideoGeneratorAsset` 等类型，是前端数据流的“契约”。
  - `src/components/marketing/media-generator/media-generator-result-pane.tsx`：在这里统一把后端数据映射为 `VideoGeneratorAsset`，并驱动 `<video>` 播放。

### 🟦 C. 代码逻辑拆解与架构说明

- 文件结构解释
  - `src/components/marketing/media-generator/types.ts`：定义媒体生成任务与 Feed 列表相关的类型。
  - `src/components/marketing/media-generator/media-generator-result-pane.tsx`：右侧结果面板，包含虚拟滚动、卡片展示、视频播放与数据映射逻辑。
- 本次关键改动一：类型层增加临时文件 URL
  - 在 `MediaTaskResult` 中新增字段（用于轮询结果接口 `/api/media/result/[taskId]`）：
    ```ts
    temporaryFileUrl?: string | null;
    ```
  - 在 `MediaFeedItem` 中同样新增字段（用于 Feed 接口 `/api/media/feed`）：
    ```ts
    temporaryFileUrl?: string | null;
    ```
  - 好处是：无论是历史任务（Feed）还是实时任务结果（Result API），只要后端返回了 `temporaryFileUrl`，前端就可以统一处理。
- 本次关键改动二：Feed 映射逻辑优先使用 `temporaryFileUrl`
  - 修改前（简化示意）：
    ```ts
    const fileDownloadUrl = buildFileDownloadUrl(task.fileUuid);
    return {
      ...
      src: fileDownloadUrl ?? task.onlineUrl ?? DEFAULT_VIDEO_SRC,
      poster: task.onlineUrl || fileDownloadUrl ? undefined : DEFAULT_POSTER,
    };
    ```
  - 修改后：
    ```ts
    const fileDownloadUrl = buildFileDownloadUrl(task.fileUuid);
    const mediaUrl =
      task.temporaryFileUrl ??
      fileDownloadUrl ??
      task.onlineUrl ??
      DEFAULT_VIDEO_SRC;

    return {
      ...
      src: mediaUrl,
      poster: mediaUrl ? undefined : DEFAULT_POSTER,
    };
    ```
  - 含义与效果：
    - 第一优先：使用 Feed 报文中的 `temporaryFileUrl`（满足“在加载视频时从 temporaryFileUrl 加载”的需求）。
    - 第二优先：如果没有临时地址，则使用本地文件下载地址 `/api/files/download/{fileUuid}`。
    - 第三优先：再次退回到 `onlineUrl`。
    - 都没有时，使用空字符串 `DEFAULT_VIDEO_SRC`，并显示默认封面 `DEFAULT_POSTER`。
    - `poster: mediaUrl ? undefined : DEFAULT_POSTER` 能让拥有真实视频 URL 的卡片通过 `useVideoPoster` 自动截帧生成封面，而没有 URL 的卡片则使用静态默认封面。
- 本次关键改动三：实时生成结果映射同样使用统一优先级
  - 在 `mapGenerationToAsset` 中也采用了相同的 URL 优先级逻辑：
    ```ts
    const fileDownloadUrl = buildFileDownloadUrl(generation.fileUuid);
    const mediaUrl =
      generation.temporaryFileUrl ??
      fileDownloadUrl ??
      generation.onlineUrl ??
      DEFAULT_VIDEO_SRC;

    return {
      ...
      src: mediaUrl,
      poster: mediaUrl ? undefined : DEFAULT_POSTER,
    };
    ```
  - 这样当 `/api/media/result/[taskId]` 也返回 `temporaryFileUrl` 时，右侧“实时生成卡片”与下方历史 Feed 的播放行为保持一致：都优先用临时 URL。
- 数据流与组件通信方式（结合本次需求）
  - AI Gateway 经由 `/api/media/feed` 返回数据，其中单条记录包含 `temporaryFileUrl`。
  - 前端结果面板通过 `loadFeed` 调用该接口，得到 `MediaFeedResponse`，并将其中的 `MediaFeedItem` 通过 `mapTaskToAsset` 转换为 `VideoGeneratorAsset`。
  - `VideoPreviewCard` 接收 `asset`，内部 `<video src={resolvedSrc} ...>` 实际使用的就是 `asset.src`，因此会优先使用 `temporaryFileUrl`。
  - 若后端同时在结果接口中返回 `temporaryFileUrl`，`mapGenerationToAsset` 也会按照同样的优先级处理，保证实时预览与历史列表行为一致。
- 可替代实现 vs 当前实现的优势
  - 可选方案一：在 `VideoPreviewCard` 中直接判断 `asset.temporaryFileUrl`、`asset.onlineUrl` 等后端字段。缺点是 UI 组件耦合到后端模型，后续接口变更会影响所有使用该组件的地方。
  - 可选方案二：在 `/api/media/feed` 的 `route.ts` 中就把 `temporaryFileUrl` 重命名为一个固定字段再返回前端。缺点是后端 API 的“数据透传”能力变弱。
  - 当前方案：通过前端适配层集中处理 URL 优先级，用 `VideoGeneratorAsset` 做统一抽象，UI 只依赖这个抽象，是更清晰、可维护性更高的设计。
- 隐含的最佳实践
  - 类型先行：先在 `types.ts` 中为新字段补齐类型，再在映射逻辑中使用，避免“后端返回了但 TS 不知道”的情况。
  - 使用“优先级链”来设计资源加载策略（temporary → download → online → default），能够减少未来排错成本。
  - 保持 UI 组件尽量“后端无感”，所有与接口字段名相关的逻辑尽量集中在少数几个适配函数中。

### 🟦 D. 初学者学习重点总结
- 理解如何根据后端接口变更（新增 `temporaryFileUrl`）去更新前端类型定义，并保持类型与实际数据一致。
- 学会通过“适配层”（如 `mapTaskToAsset`、`mapGenerationToAsset`）把后端结构转换成前端统一的展示模型，让 UI 组件远离底层字段细节。
- 掌握设计资源加载优先级的思路：当同时存在临时 URL、本地下载 URL、在线 URL 时，如何决定播放顺序以获得最佳体验。
- 理解 React 渲染链路：接口返回 → 类型定义 → 适配函数计算 `asset.src` → 组件通过 props 接收 → `<video>` 播放，链路中任一环节出错都会导致视频无法加载。
- 熟悉 `useRef`、`useEffect` 等 Hook 在处理滚动监听、任务轮询和视频播放中的典型用法，为后续实现更复杂交互打基础。
- 养成“组件与接口解耦”的习惯：UI 优先使用抽象好的 `VideoGeneratorAsset`，而不是直接引用 `temporaryFileUrl`、`onlineUrl` 等后端字段名。

---

## 3. AI 工作方式要求补充说明
- 本次回答已按要求：主对话窗口仅给出简要结论，详细教学与架构拆解全部集中在本文件中。
- 代码仍采用现代 React 函数组件与 Hooks，兼容 Next.js App Router 的使用方式。
- 若后端未来继续调整媒体资源字段（例如新增其他临时地址或 CDN 地址），只需在 `types.ts` 与 `mapTaskToAsset` / `mapGenerationToAsset` 中更新 URL 优先级即可，其余组件无需改动。 
