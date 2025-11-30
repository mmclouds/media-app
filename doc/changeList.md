# Change List

## 2025-11-27
- 新增 Kling Demo 风格的营销组件（Sidebar、EditorPanel、PreviewPanel、Workspace），实现可循环示例视频与提示历史交互。
- 更新 `src/app/[locale]/(marketing)/(pages)/video-generator/page.tsx`，使用新的工作台组件并加入页面文案结构。
- 调整视频生成页面布局，采用全屏铺满与 Flex 布局，让工作台占据剩余视窗高度。

## 2025-11-28
- 优化视频生成页面全屏渲染：`page.tsx` 将主区域锁定为 `100vh` 并隐藏页面滚动，`VideoGeneratorWorkspace` 同步使用 `h-full`/`max-h-screen`，确保左侧工作区填满视窗且仅右侧内容容器保留滚动。
- 精简视频生成编辑器页签：移除 `Multi Elements` 相关 tab 与切换逻辑，仅保留 `Text to Video` 与 `Image to Video`，界面更加聚焦主流程。
- 区分两种生成模式的编辑内容：仅在 `Image to Video` 中展示 “Upload Image” 区域，`Text to Video` 页签则完全去除该模块，避免重复信息。
- 删除冗余的 “Upload Video to Edit” 模块，并显著增大 Prompt 文本框的高度与字号，让撰写提示成为核心焦点。
- 将 “Generate” 按钮移动至面板最底部，鼓励先完成提示与设置后再触发生成。
- 进一步固定左侧编辑面板：移除竖向滚动区域，改用 `flex` 布局让历史提示与按钮区撑满剩余高度，按钮始终贴底且不再出现滚动条。
- 调整快速设置按钮位置，使 `Professional / 7s / 1 Output` 区域与 `Generate` 紧挨放置于底部操作区。
- 追加底部布局优化：历史提示区与设置/按钮区分层，利用 `mt-auto` 将设置与 `Generate` 贴底，确保按钮始终位于面板最下方且设置紧邻其上。
- 将 Prompt 与 Quick Settings 抽象为组件（`PromptEditor`、`QuickSettingsBar`），并通过 tab 配置在 Text/Image 两个模式中复用，便于后续扩展差异化内容。
- Prompt 文本区域默认使用更明显的边框高亮（`border-white/30`），聚焦状态进一步增强，提升输入引导性。

## 2025-11-29
- 修复 `video-generator` 页面 `generateMetadata` 中 `constructMetadata` 的参数类型错误，改用 `locale` 与 `pathname` 生成 canonical 链接，解决 `canonicalUrl` 未被识别导致的构建失败。
- 重新排版 `AGENTS.md`，采用分节要点与更新后的 metadata 示例，提升可读性并避免示例代码类型冲突。
