# 布局对齐：VideoGeneratorWorkspace
- 首页 `HeroSection` 使用 `mx-auto max-w-7xl px-6` 宽度容器；为了让 `VideoGeneratorWorkspace` 视觉宽度与 header 一致，需要在首页使用同样的容器包裹组件，再让内部继续 `w-full` 以占满容器。
- 在独立的 Media Studio 页面中，仍然把 `VideoGeneratorWorkspace` 直接放在 `w-full` 的 `main` 内，保证它占满全屏，方便展示全宽体验。

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

# Media Studio 页面定位
- `src/app/[locale]/(marketing)/(pages)/media-studio/page.tsx` 依旧导出 `generateMetadata`，但把 `title` 与 `description` 更新为 “Media Studio” 语境，用一句话说明页面会同时承载视频/图片/音频等生成工作流。
- Next.js 的 `constructMetadata` 会自动合并 locale、pathname 等字段，所以只要替换标题/描述即可完成 SEO 文案切换，SSR 渲染与 edge runtime 不需额外配置。
- 默认导出的组件更名为 `MediaStudioPage`，虽然名称不会影响路由，但有助于在 React DevTools 中一眼识别该页面已经延展为统一的多媒体生成入口。
- 将路由文件夹从 `video-generator` 重命名为 `media-studio`，同时把 `constructMetadata` 的 `pathname` 改为 `/media-studio`，这样 URL slug 与新定位保持一致，`MarketingLayout` 里按路径隐藏 footer 的逻辑也随之更新。

# Media Generator 模块化
- 生成体验拆成 Menu / Config / Result 三个组件：`MediaGeneratorMenu` 只负责媒体类型切换，`MediaGeneratorConfigPanel` 负责 prompt + 模型配置渲染，`MediaGeneratorResultPane` 专注展示生成状态/历史；`GenerateButton` 也独立封装，统一处理禁用/loading UI。
- 每个模型都有独立表单组件（如 `SoraConfigFields`、`Veo3ConfigFields`、`StillImageConfigFields`、`AudioCraftConfigFields`），收集的 `MediaModelConfig` 会回传至父级，方便后续扩展不同模型参数。
- 新增 `useMediaGeneratorController` hook，把 prompt/state/轮询/生成请求全部封装，返回 `mediaType`、`availableModels`、`onGenerate` 等回调；`VideoGeneratorWorkspace` 与 `MediaOnlyGeneratorWorkspace` 共同复用该 hook，实现“主页面三栏 + 子页面双栏”两套布局。
- 子页 `media-studio` 现直接渲染三栏版 `MediaGeneratorWorkspace`（含菜单/配置/结果）；如需精简为两栏，可改用 `MediaOnlyGeneratorWorkspace` 或在布局中隐藏菜单。

# 提交 fb76ce7（组件化）拆解要点
- `useMediaGeneratorController` 统一处理 prompt、模型、生成请求、轮询、历史记录等状态，然后把 `mediaType/options/models/onGenerate/activeGeneration` 一次性送给 `VideoGeneratorWorkspace` 与 `MediaOnlyGeneratorWorkspace`。这样入口页面只关心布局，不再直接写复杂的 `useEffect` 逻辑。
- `MediaGeneratorMenu`、`MediaGeneratorConfigPanel`、`MediaGeneratorResultPane` 之间通过 props 传递数据：菜单只上报媒体类型；配置面板根据 `models` 渲染模型切换、prompt 输入以及模型表单；结果面板纯展示当前生成状态 + feed。业务拆成“选择-配置-展示”三栏，方便将任意栏落在不同页面。
- 模型表单组件通过 `configComponent` 注入（`model-configs.tsx`），每个模型都自包含默认值和字段，父级只保存 `{ [modelId]: config }`。新增模型时只要在 `MODEL_REGISTRY` 中注册定义+表单组件即可。
- `GenerateButton` 把“禁用状态 + 提交参数 + 英文文案”统一封装，外部只要传入 `mediaType + modelId + prompt + config` 即可触发 `onGenerate`，从而保证各页面生成按钮行为一致。
- `MediaGeneratorResultPane` 同时处理“实时生成状态卡片”“登录用户真实 feed”“游客 demo feed”，滚动懒加载以及 hover 自动播放都封装在组件内部，对上层暴露的 props 只有 `asset/loading/activeGeneration`。

# Media Generator ConfigFields 拆分
- 按媒体类型拆分配置表单：视频模型表单放在 `src/components/marketing/media-generator/video/*-config-fields.tsx`，图片表单在 `.../image/still-image-config-fields.tsx`，音频表单在 `.../audio/audio-craft-config-fields.tsx`，保持路径语义化。
- 公共的选择/滑杆/开关字段封装在 `shared/config-field-controls.tsx`，不同模型只负责填充选项与默认值，减少重复渲染逻辑。
- video 组内模型（Sora/Veo3）进一步独立文件：`video/sora-config-fields.tsx`、`video/veo3-config-fields.tsx`，按模型组织逻辑，便于增删改单个模型配置而不影响同组其他模型。

# Model 下拉选择重构
- 使用 shadcn 的 `Select` 组件集中处理模型切换，`value/onValueChange` 与父级 `activeModelId` 绑定，保持受控组件模式。
- 当未指定 `activeModelId` 时回退到模型列表的第一项，避免初始渲染无选中状态导致交互失效。
- 在下拉项中同时展示模型名称与描述，让用户无需额外列表即可快速理解差异，减少重复选择入口。

# Model 下拉信息简化
- 下拉选项仅显示模型名称，隐藏描述，避免重复信息干扰选择；选中后保持受控状态与父级同步。

# Model 下拉信息简化
- 下拉选项同时展示模型名称与描述，但通过 `textValue` 将选中态展示限定为名称，既提供选择参考又保持触发器简洁。

# Model 下拉显示优化
- 触发器手动渲染选中模型的 label，并将 `SelectValue` 隐藏处理，保证收起后只显示名称；下拉项仍包含名称与描述供选择参考。

# Model 下拉显示优化
- 下拉项改用 Radix 原生 Item：`ItemText` 只写名称，描述放在 `aria-hidden` 的段落里，确保触发器和选中值只展示 label。

# Model 下拉显示优化
- 去掉默认 `SelectValue`，触发器直接渲染选中模型名称并设置 `aria-label`；下拉项继续显示名称+描述，但描述标记为 `aria-hidden`，避免选中后重复显示。

# PromptEditor 抽取
- 将 Prompt 输入区域移至 `src/components/marketing/media-generator/shared/prompt-editor.tsx`，保留 `'use client'`，通过受控 textarea 让父级管理 value/onChange，方便在多媒体生成的不同页面复用一致的输入体验；同时由各模型的 `*-config-fields.tsx` 组件内部直接渲染该输入框，让配置区域自包含 prompt 编辑能力。
