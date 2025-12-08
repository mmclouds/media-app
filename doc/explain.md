---

## 2. explain.md（讲解内容）必须包含以下部分

### 🟦 A. React 核心概念讲解
- 使用函数组件 `MediaGeneratorWorkspace`/`MediaGeneratorConfigPanel` 组合 props 驱动的 UI；配置数据与回调均由父级控制，组件本身只负责展示与触发事件。
- 无本地 state，但利用派生值（当前模型、配置、历史）确保渲染安全；当 props 变化时 React 触发重新渲染，滚动区域自动适配新高度。
- 通过事件回调 `onModelConfigChange`、`onPromptChange` 等向上报告用户输入，保持单一数据源，符合受控组件最佳实践；通过 `min-h-0` 允许子项在 Flex 布局内正确收缩，配合 `overflow-y-auto` 才能触发局部滚动。

### 🟦 B. Next.js 核心概念讲解（若本次代码使用 Next.js）
- 文件顶部 `"use client"` 明确组件运行在客户端，便于响应滚动和交互；与 App Router 的服务器页面组合时由 SSR 输出初始结构，水合后获得滚动能力。
- 组件位于 `src/components/marketing/media-generator/`，与路由解耦，页面 `media-studio/page.tsx` 直接引入，符合 Next.js 按目录分块的惯例；页面主容器和 Marketing layout 的 `<main>` 增加 `min-h-0` 防止 Flex 拉伸导致根节点溢出。
- 此处无数据获取逻辑，依赖父级传入的模型列表与配置，SSR 仅负责静态 HTML，客户端负责交互。

### 🟦 C. 代码逻辑拆解与架构说明
- 文件结构：`MediaGeneratorWorkspace` 负责三栏布局，子组件分别负责菜单、配置、结果；本次修改针对 `media-generator-config-panel.tsx`、`media-generator-result-pane.tsx` 与布局 `marketing/layout.tsx` 的滚动约束，并将 `media-studio/page.tsx` 主容器改为 `fixed inset-0` 锁定视口。
- 顶部栏固定展示当前媒体类型和模型下拉；主体改为 `overflow-y-auto` 的滚动容器，并在父层添加 `min-h-0`，确保 Flex 子项能收缩而不推高整个页面。
- 结果面板同样补充 `min-h-0`，保证自身内部滚动而不挤占外层高度；根容器添加 `min-h-0` 避免 max-height 与 h-screen 组合时产生额外溢出。
- 底部操作区（生成按钮与历史）保持在滚动容器之后，通过额外间距与主体分隔，易于访问。
- 数据流：父级持有 `mediaType`、`models`、`prompt` 等状态；子组件根据 active 模型渲染配置组件，并把变更通过回调写回父级。
- 这样分层的好处是滚动行为只作用于配置列或结果列，页面其它区域（菜单、结果预览）不抖动，兼顾体验与布局稳定。
- 滚动体验：配置列与结果列的滚动区域增加 `scrollbar-width: none` 和 WebKit 隐藏规则，保持可滚动但不显示滚动条。

### 🟦 D. 初学者学习重点总结
- 客户端组件需声明 `"use client"`，才能使用浏览器交互（滚动、事件）。
- 受控数据流：父级保管状态，子组件只负责渲染和回调。
- 局部滚动：在特定容器上使用 `overflow-y-auto`，限制滚动影响范围。
- Flex 布局加 `min-h-0` 才能让子项收缩并触发内部滚动，避免顶层溢出。
- 布局分层：顶部栏固定、主体可滚、底部操作分段，提升可用性。
- 隐藏滚动条：使用 `scrollbar-width: none`、`-ms-overflow-style: none` 与 `::-webkit-scrollbar` 隐藏条但保留滚动。

---
