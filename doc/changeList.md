# Change List

## 2025-11-27
- 新增 Kling Demo 风格的营销组件（Sidebar、EditorPanel、PreviewPanel、Workspace），实现可循环示例视频与提示历史交互。
- 更新 `src/app/[locale]/(marketing)/(pages)/video-generator/page.tsx`，使用新的工作台组件并加入页面文案结构。
- 调整视频生成页面布局，采用全屏铺满与 Flex 布局，让工作台占据剩余视窗高度。

## 2025-11-28
- 优化视频生成页面全屏渲染：`page.tsx` 将主区域锁定为 `100vh` 并隐藏页面滚动，`VideoGeneratorWorkspace` 同步使用 `h-full`/`max-h-screen`，确保左侧工作区填满视窗且仅右侧内容容器保留滚动。
- 精简视频生成编辑器页签：移除 `Multi Elements` 相关 tab 与切换逻辑，仅保留 `Text to Video` 与 `Image to Video`，界面更加聚焦主流程。
