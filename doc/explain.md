---

## 2. explain.md（讲解内容）必须包含以下部分

### 🟦 A. React 核心概念讲解
- `SoraConfigFields` 依旧是函数组件，由父级传入的 `config`、`prompt` 和回调控制所有渲染与交互，没有本地状态，保持受控模式。
- 新增的页签使用派生的 `mode`（根据 `config.inputMode` 与预设 `generationModes` 校验）决定激活态，点击按钮触发 `onChange` 回传新配置，保证单一数据源。
- 其他控件（PromptEditor、SliderField、AspectRatioField、ModelVersionSwitcher）依赖 props 渲染，父级状态变化会直接驱动重新渲染与样式切换，体现 React 的数据驱动视图。
- 通过对 `config` 的合法性检查（如 options.includes），在渲染前兜底默认值，避免出现未选中或错误态，这是一种健壮性最佳实践。

### 🟦 B. Next.js 核心概念讲解（若本次代码使用 Next.js）
- 顶部的 `"use client"` 让组件在 App Router 下成为客户端组件，才能处理按钮点击与 textarea 输入事件；同时可嵌入到服务器渲染的页面里实现水合后交互。
- 组件位于 `src/components/marketing/...`，路由层只需引用即可复用，不涉及 page/layout 等段位的改动，文件结构清晰区分了交互层与路由层。
- 无服务端数据获取逻辑，初始 HTML 由 SSR 输出，水合后根据 props 中的默认值决定激活的页签与表单选项，符合 Next.js 客户端组件的渲染流程。
- 使用的所有子控件也依赖客户端能力（事件、受控输入），因此必须保持在客户端文件中，避免在 Server Component 中引入浏览器 API。

### 🟦 C. 代码逻辑拆解与架构说明
- 文件结构：`src/components/marketing/media-generator/video/sora-config-fields.tsx` 负责 Sora 视频模型的配置表单，本次在最上方加入模式页签。
- 生成模式：`generationModes` 定义了 Text/Image 两个模式，渲染为横向按钮组；`mode` 从 `config.inputMode` 合法值推导，否则回落到首个选项。
- 交互：点击某个页签会调用 `onChange` 更新 `inputMode`，与其他字段（modelVersion、seconds、size）的更新逻辑保持一致，便于将模式信息一并提交后端。
- UI 与数据流：页签位于表单顶部，后续控件（模型版本、Prompt、长度、比例）保持原顺序，父组件集中管理配置状态，避免在子组件内部分散状态。

### 🟦 D. 初学者学习重点总结
- 受控组件模式：所有输入都从 props 读取、通过回调写回，保持单一数据源。
- 合法值校验与兜底：在使用配置前用 options 校验并回落到默认，避免无效 UI 状态。
- 客户端组件声明：交互式组件需在文件顶部声明 `"use client"`，App Router 下尤为重要。
- 预设数据驱动 UI：用常量数组定义页签/选项，再基于它们生成按钮，方便扩展与维护。

---
