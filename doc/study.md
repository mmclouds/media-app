# 布局对齐：VideoGeneratorWorkspace
- 首页 `HeroSection` 使用 `mx-auto max-w-7xl px-6` 宽度容器；为了让 `VideoGeneratorWorkspace` 视觉宽度与 header 一致，需要在首页使用同样的容器包裹组件，再让内部继续 `w-full` 以占满容器。
- 在独立的 Video Generator 页面中，仍然把 `VideoGeneratorWorkspace` 直接放在 `w-full` 的 `main` 内，保证它占满全屏，方便展示全宽体验。

