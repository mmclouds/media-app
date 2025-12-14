---

## 2. explain.md（讲解内容）必须包含以下部分

### 🟦 A. React 核心概念讲解
- 使用的核心能力：通过函数组件与 props 组合 UI，`MediaGeneratorResultPane` 负责结果列表与实时生成卡片，`VideoPreviewCard` 专注单个视频卡片展示，并在内部根据状态选择不同的封面图（失败、加载中、正常/默认），体现了“数据映射 + 展示组件”的分层。
- 使用的 Hooks：`useState` 管理 Feed 数据、加载状态与提示文案；`useEffect` 处理副作用（拉取 Feed、滚动监听、轮询任务结果，以及封面生成错误日志）；`useLayoutEffect` 在浏览器完成布局后测量卡片高度，用于虚拟滚动；`useMemo` 对 fallback 列表、实时资产等派生数据做缓存；`useCallback` 稳定请求与计算函数，避免子组件不必要的重渲染；`useRef` 保存滚动容器、请求锁和高度缓存等跨渲染的可变值。
- 为什么需要这些 Hooks：媒体生成的过程包含异步请求与定时轮询，如果不通过 `useEffect` 隔离副作用，会导致多次重复请求；虚拟滚动需要访问真实 DOM 尺寸，因此用 `useLayoutEffect` 与 `ResizeObserver` 保证测量时机正确；请求锁 `isFetchingRef` 与游标 `nextCursorRef` 用 `useRef` 保存，避免把它们放入 state 后引发额外渲染；封面图通过自定义 Hook `useVideoPoster` 截取视频帧并缓存结果。
- 组件渲染机制如何与本代码相关：当 `activeGeneration`、`remoteFeed` 或 `asset` 内容更新时，React 会重新渲染 `MediaGeneratorResultPane` 与 `VideoPreviewCard`，后者根据 `asset.status`、`asset.poster`、`capturedPoster` 以及 `DEFAULT_POSTER` 计算最终封面。即使后端没有返回封面或海报截取失败，组件也能稳定回退到 `public/images/media/fengmian.jpg`，避免出现空白图或损坏占位。
- 哪些地方体现最佳实践：通过常量 `DEFAULT_POSTER` 统一管理默认封面路径，而不是在多个 JSX 位置硬编码图片地址；`resolvedPoster` 的计算逻辑清晰区分失败、加载中和正常态，并把兜底逻辑（默认封面）集中处理，后续如果要替换默认封面资源只需改一个常量即可。

### 🟦 B. Next.js 核心概念讲解（若本次代码使用 Next.js）
- Server Components 与 Client Components 的划分与原因：`media-generator-result-pane.tsx` 顶部声明 `'use client'`，因为其中使用了多个 Hooks、DOM 事件、`ResizeObserver` 以及 `<video>` 播放控制，这些都只能在客户端环境运行；页面本身可以继续作为 Server Component，只把交互和播放逻辑封装在 Client Component 中。
- `"use client"` 的作用与使用场景：通过 `"use client"` 告诉 Next.js 该文件需要在浏览器中执行，支持 Hooks 和浏览器 API；这里不仅负责轮询、滚动与虚拟列表，还负责根据视频源和封面状态切换 `poster`，包括这次新增的默认封面兜底逻辑。
- App Router 的路由机制：页面位于 `src/app` 下，通过组合 `MediaGeneratorResultPane` 等组件构成完整工作区；与之配套的 API Route 位于 `src/app/api/media/*` 与 `src/app/api/files/*` 下，分别代理媒体任务与文件下载，组件始终通过相对路径 `/api/...` 与后端交互。
- 数据获取策略：生成任务与历史 Feed 都在客户端通过 `fetch` 调用 API Route，并使用 `cache: 'no-store'` 保证实时性；视频文件内容在 API Route 内部再转发到网关。默认封面图片则直接放在 `public/images/media/fengmian.jpg`，由 Next.js 以静态资源形式提供，避免增加额外的接口调用。
- `next/link` 与 `next/image` 的核心用法：本次改动针对 `<video poster>` 属性，属于原生媒体标签的用法；如果未来希望进一步优化图片加载，可以将默认封面替换为 `next/image` 渲染的海报组件，但当前实现已经满足静态资源缓存和快速加载的需求。
- 文件结构对数据流与组件行为的影响：默认封面路径被提取到 `media-generator-result-pane.tsx` 顶部的常量 `DEFAULT_POSTER`，与 `DEFAULT_VIDEO_SRC`、`LOADING_POSTER` 等配置放在一起，方便集中查看与维护，符合该目录中“组件 + 配置常量”并存的组织方式。

### 🟦 C. 代码逻辑拆解与架构说明
- 文件结构解释
- 文件结构解释
  - `src/components/marketing/media-generator/media-generator-result-pane.tsx`：负责展示实时生成状态与历史 Feed，其中顶部集中定义了视频相关的常量，包括 `DEFAULT_VIDEO_SRC`、`LOADING_VIDEO_SRC`、`LOADING_POSTER`、`FAILED_POSTER` 以及本次改动的 `DEFAULT_POSTER`。
  - `VideoPreviewCard`：单个视频卡片组件，根据传入的 `VideoGeneratorAsset` 以及当前状态决定视频源、封面、标签和播放控制逻辑，是默认封面逻辑真正生效的地方。

- 每段关键代码的作用
  - `const DEFAULT_POSTER = '/images/media/fengmian.jpg';`：指定全局默认封面路径，对应物理文件位于 `public/images/media/fengmian.jpg`，Next.js 会自动将其暴露为静态资源。
  - `const resolvedPoster = (() => { ... })();`：根据错误态、加载态和正常态依次选择封面：错误时使用 `FAILED_POSTER`，加载中使用 `LOADING_POSTER`，正常情况下优先使用 `asset.poster`，其次是 `capturedPoster`（由 `useVideoPoster` 截帧生成），最后兜底使用 `DEFAULT_POSTER`。
  - `poster={resolvedPoster}`：将经过多级兜底后的封面赋给 `<video>` 的 `poster` 属性，保证无论是否从视频中成功截帧或者后端是否提供封面字段，UI 始终有一张合理的封面可以展示。

- 数据流与组件通信方式
  1. 上层控制逻辑将 `VideoGeneratorAsset` 传递给 `VideoPreviewCard`，其中可能包含 `asset.poster`（来自后端或映射函数）。
  2. `VideoPreviewCard` 根据 `asset.src` 决定是否触发 `useVideoPoster` 截帧，以获取 `capturedPoster`。
  3. 在渲染阶段，组件通过 `resolvedPoster` 将 `asset.poster`、`capturedPoster` 与 `DEFAULT_POSTER` 组合成一个最终封面地址。
  4. 用户在列表中看到的视频卡片，无论是否成功截帧或后端是否提供封面，都至少会显示 `public/images/media/fengmian.jpg` 作为兜底封面。

- 可替代实现 vs 当前实现的优势
  - 替代实现：在 JSX 中每次都写死 `poster={asset.poster || '/images/media/fengmian.jpg'}`，分散在多个组件或分支逻辑中，对后续维护默认封面不友好。
  - 当前实现：通过单一常量 `DEFAULT_POSTER` 控制默认封面路径，并在一个集中计算函数 `resolvedPoster` 中统一兜底，任何默认封面策略的调整（更换图片、引入多主题封面等）都可以从这个点扩展。

- 有哪些隐含的最佳实践？
  - 使用公共静态资源作为兜底封面，避免在视频封面没生成或网络抖动时出现黑屏或浏览器默认灰背景。
  - 将“状态 → 封面”的映射封装在一个纯函数（自执行函数）中，保证渲染函数主体更易读。
  - 避免重复写硬编码路径，通过常量统一管理公共资源地址。

### 🟦 D. 初学者学习重点总结
- 理解 `<video poster>` 的作用：在视频未播放或尚未加载完成时展示封面图，改善视觉体验。
- 学会使用 `public` 目录提供静态资源，并通过 `/images/...` 这样的路径在组件中引用。
- 使用常量统一管理公共资源路径（如默认封面），避免在 JSX 中到处硬编码字符串。
- 通过简单的优先级策略（`asset.poster` → `capturedPoster` → `DEFAULT_POSTER`）实现健壮的兜底逻辑。
- 将状态判断与 UI 渲染解耦（`resolvedPoster` 先算好，JSX 只负责展示），可以让组件逻辑更清晰、易维护。

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
