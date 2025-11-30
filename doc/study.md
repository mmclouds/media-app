# 布局对齐：VideoGeneratorWorkspace
- 首页 `HeroSection` 使用 `mx-auto max-w-7xl px-6` 宽度容器；为了让 `VideoGeneratorWorkspace` 视觉宽度与 header 一致，需要在首页使用同样的容器包裹组件，再让内部继续 `w-full` 以占满容器。
- 在独立的 Video Generator 页面中，仍然把 `VideoGeneratorWorkspace` 直接放在 `w-full` 的 `main` 内，保证它占满全屏，方便展示全宽体验。

# Preview Panel 流式预览
- Preview 区域直接渲染视频流：用 `useMemo` 组装当前 asset + demo 列表，再复制几遍制造可滚动的 feed。
- `useState` 只渲染部分 feed，`useRef` 捕获滚动容器，`scrollTop + clientHeight` 接近底部时增加 `visibleCount`，模拟向下滑动懒加载的交互。
- 视频参数（标题、分辨率、时长、标签）放在 `VideoPreviewCard` 顶部，这样用户未播放前即可快速浏览关键信息。
