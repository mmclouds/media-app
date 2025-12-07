---

## 2. explain.md（讲解内容）必须包含以下部分

### 🟦 A. React 核心概念讲解
- ModelVersionSwitcher、SliderField、AspectRatioField、SelectField、ToggleField 依旧是函数组件，靠 props 传入 value/onChange 维持单向数据流，避免本地状态分散。
- 本次未新增 useState/useEffect 等 Hook；TooltipProvider/TooltipTrigger 依赖 React 组合式渲染，在悬停时才展示描述内容。
- 渲染机制：父级变更 value 会重新渲染按钮，激活态通过 value 对比决定；Tooltip 悬停后渲染描述，常态保持精简界面。
- 最佳实践：描述延迟展示减少信息噪音，同时仍使用 options 内的描述字段，保证数据与视图一致。

### 🟦 B. Next.js 核心概念讲解（若本次代码使用 Next.js）
- 文件标记 "use client"，确保模型切换、Tooltip 等交互在浏览器端运行，上层页面仍可 SSR 提供首屏。
- 组件位于 App Router 的共享组件目录，下游页面直接引入，无需额外路由配置；目录结构决定 bundle 分割与复用范围。
- 本次无数据请求，依赖父级客户端状态驱动；SSR 提供初始 HTML，水合后 Tooltip/按钮交互才会生效。
- TooltipProvider 等客户端组件只能在 client 文件使用，符合 Server/Client 组件的分层约束。

### 🟦 C. 代码逻辑拆解与架构说明
- 文件结构：`src/components/marketing/media-generator/shared/config-field-controls.tsx` 负责模型版本切换与通用表单控件。
- ModelVersionSwitcher：遍历 options 渲染按钮，样式根据 value 是否匹配激活；模型描述改为按钮内部的灰色提示文案 “Hover for model details”，仅悬停时通过 TooltipContent 展示描述，常态无图标更简洁。
- TooltipProvider 包裹整个列表，TooltipTrigger 直接绑定在按钮上，点击仍受控切换版本，悬停触发 tooltip，提示入口与主交互合并且不增加额外视觉元素。
- SliderField 入参改为 options 数组，按给定离散值渲染 checkbox 风格的单选列表（如秒数、质量、帧率），点击即触发受控 onChange；AspectRatioField 用 options 数组渲染单选卡片并用小矩形可视化比例；SelectField、ToggleField 仍保持受控输入模式。
- 可替代实现：描述也可放入折叠或侧栏，但 Tooltip 占位最小、信息获取成本低；离散 options 比 min/max/step 更清晰，避免滑动误差，可视化比例通过在固定最大宽高内按比例缩放长方形（宽大缩小高、高大缩小宽）帮助用户直观看到画幅。

### 🟦 D. 初学者学习重点总结
- 受控组件：value/onChange 决定 UI 状态，避免内部私有状态导致不同步。
- "use client" 让 Tooltip 与按钮交互在客户端运行，同时保留 SSR 首屏。
- TooltipProvider/TooltipTrigger/TooltipContent 的组合方式与适用场景。
- 用描述字段驱动 UI，可轻松扩展新模型而不改逻辑；离散值用 options 数组驱动受控单选列表，保证选择精度；比例可视化的小矩形辅助匹配数字与画面感觉。

---
