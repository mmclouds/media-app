# 布局对齐：VideoGeneratorWorkspace
- 首页 `HeroSection` 使用 `mx-auto max-w-7xl px-6` 宽度容器；为了让 `VideoGeneratorWorkspace` 视觉宽度与 header 一致，需要在首页使用同样的容器包裹组件，再让内部继续 `w-full` 以占满容器。
- 在独立的 Video Generator 页面中，仍然把 `VideoGeneratorWorkspace` 直接放在 `w-full` 的 `main` 内，保证它占满全屏，方便展示全宽体验。

# Preview Panel 流式预览
- Preview 区域直接渲染视频流：用 `useMemo` 组装当前 asset + demo 列表，再复制几遍制造可滚动的 feed。
- `useState` 只渲染部分 feed，`useRef` 捕获滚动容器，`scrollTop + clientHeight` 接近底部时增加 `visibleCount`，模拟向下滑动懒加载的交互。
- 视频参数（标题、分辨率、时长、标签）放在 `VideoPreviewCard` 顶部，这样用户未播放前即可快速浏览关键信息。

# Cursor Feed 接入
- API 通过 `/api/media/feed` 代理 `AI_GATEWAY_URL/api/v1/media/feed/cursor`，后端用 `auth.api.getSession` 取登录用户 ID，并在请求头注入 `X-API-Key`（`AI_GATEWAY_API_KEY`）。
- 前端在 `VideoGeneratorPreviewPanel` 中使用 `useCurrentUser` 判断是否登录，已登录时触发 `loadFeed({ reset: true })`，并用 `nextCursorRef`/`hasMoreRef` 管理游标翻页。
- 滚动监听沿用原懒加载逻辑：远端 Feed 时调用 `loadFeed()` 自动拉下一批；未登录或接口失败则继续展示 demo 列表，通过 banner 告知“Sign in / Try again”。
- `mapTaskToAsset` 会解析接口的 `parameters` 字段，将 prompt/size/seconds 转成 UI 所需的 `title`、`resolution`、`duration`，并在缺少视频 URL 时降级到本地 demo 视频，保证播放器始终可播。

# Video Generation Trigger & Polling
- 新增 `/api/media/generate` 与 `/api/media/result/[taskId]` 两个 API Route，通过 Better Auth session 注入 `userId`，并统一使用 `AI_GATEWAY_URL` + `AI_GATEWAY_API_KEY` 代理后台的 `/api/v1/media/generate` 与 `/api/v1/media/result/{taskId}`，前者校验 prompt、补齐默认 `model / seconds / size` 后原样透传 body，后者校验返回的 `success` 字段，只输出 `TaskResultDto`。
- `VideoGeneratorWorkspace` 现在驱动真实生成：`handleGenerate` POST `/api/media/generate`，获得 `taskId` 后将状态保存到 `activeGeneration`，并以 `setInterval` 每 5s 调用 `/api/media/result/{taskId}` 更新 `status / progress / video URL`，终态（completed/failed/timeout）会自动停止轮询。
- 因 AI 网关要求 query 也带参数，前端会在请求 `/api/media/generate` 时附加 `mediaType` 与 `modelName`，API Route 也会优先读取 query，再回退 body/default，保证 curl/浏览器两种调用方式都能触发同一套配置。
- 为避免 UI 卡死另起 `isSubmitting`，Button 禁用条件 = `isSubmitting || activeGeneration` 仍在运行；轮询阶段若 API 抛错，会把错误提示写进 `activeGeneration.errorMessage`，方便预览区展示。
- Preview 区新增 “Live generation” 卡片（`GenerationStatusCard`）：pending/processing 时展示进度条与描述，completed 直接播放返回的 `onlineUrl/downloadUrl` 视频，failed/timeout 显示错误提示，满足“在右侧生成视频加载区域 + 成功即展示视频”的交互需求。

# Video Poster Capture
- 浏览器允许前端用 `<video>` + `<canvas>` 抓取任意帧：先创建隐藏的 `video` 元素，`preload="metadata"` 并 `crossOrigin="anonymous"`，待 `loadeddata` 事件触发后把 `video.currentTime` 设置为想截取的秒数，再在 `seeked` 事件里用 `canvas.drawImage(video, 0, 0)` 把该帧绘制到画布。
- 把 `canvas.toDataURL('image/png')` 得到的 Base64 字符串缓存到 state，即可在 `<video poster={thumb} />` 或 `<Image src={thumb} />` 中复用；注意远端视频必须正确返回 `Access-Control-Allow-Origin`，否则 Canvas 会被标记为 tainted，无法导出数据。
- 在 React 中通常使用 `useRef` 保存 video/canvas 元素，`useEffect` 里挂载事件并触发 `video.load()`，最后在 `return () => {}` 中清理事件监听，避免内存泄漏。
- 封装成工具：`src/lib/video-poster.ts` 暴露 `captureVideoPoster(url, { frameTime, crossOrigin, timeoutMs })`，只能在浏览器端调用；`src/hooks/use-video-poster.ts` 基于该工具提供 `poster/loading/error/capture/reset`，默认自动截取第一帧，可直接在客户端组件里消费。
- 预览面板 `VideoPreviewCard` 会在 `asset.poster` 缺失时自动用 `useVideoPoster(asset.src)` 捕获第一帧，得到的 Base64 会回填到 `<video poster>`，这样远端 Feed / demo 视频都能显示专属封面。

# Hover Playback
- 为了“移入自动播放、移出自动暂停”，可以定义 `useHoverPlayback` 自定义 hook：内部用 `useRef<HTMLVideoElement>` 绑定到 `<video>`，在 `onMouseEnter` 时调用 `video.play()`，`onMouseLeave` 时执行 `video.pause()`，必要时可将 `resetOnLeave` 设为 `true` 在离开后重置时间轴。
- `GenerationStatusCard` 与 `VideoPreviewCard` 均通过该 hook 绑定事件，把事件处理器挂到包裹视频的容器上，这样整个视频区域都能触发播放/暂停，同时 `play()` 返回 Promise 时用 `.catch` 捕获潜在错误（例如浏览器阻止自动播放），避免报错打断交互。
- 为了处理“鼠标进入时视频尚未加载完成”的场景，hook 使用 `isHoveringRef` 记录当前 hover 状态，并把 `handleMediaReady` 绑定到 `<video onLoadedData>`，只要首帧准备好且仍在 hover，就再调用 `play()`，这样无需额外点击即可恢复自动播放。
