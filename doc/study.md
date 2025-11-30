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
