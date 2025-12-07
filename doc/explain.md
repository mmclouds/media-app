
## 2. explain.md（讲解内容）必须包含以下部分

### 🟦 A. React 核心概念讲解
- `MediaGeneratorConfigPanel`、各模型的 ConfigFields 以及共享的 `PromptEditor` 均为函数组件，交互数据通过 props 传入再上报，保持单向数据流。
- `useMemo` 继续从历史记录派生最近三条 prompt，避免每次渲染都重新切片。
- `PromptEditor` 是受控 textarea（`value`/`onChange`），现在由各模型配置组件内直接渲染，父级仍集中管理状态。
- 模型下拉是受控组件，`onValueChange` 仅上报模型 id，由父级决定选中项。
- 拆分并下放 Prompt 输入到 ConfigFields，组件职责更清晰：面板负责布局与选择，字段组件负责具体输入。

### 🟦 B. Next.js 核心概念讲解（若本次代码使用 Next.js）
- `'use client'` 覆盖配置面板和各配置字段组件（含 PromptEditor），保证选择器、输入框等交互在浏览器端运行；SSR 负责首屏渲染，水合后接管事件。
- 组件存放在 `src/components/marketing/media-generator` 及其 `shared` 子目录，便于 App Router 页面按需引用。
- 数据获取与提交逻辑仍由上层容器/页面处理，组件只承担展示与事件上报，简化水合与路由层职责。

### 🟦 C. 代码逻辑拆解与架构说明
- 文件结构：`media-generator-config-panel.tsx` 负责头部模型选择、生成按钮与历史；`shared/prompt-editor.tsx` 定义通用 Prompt 输入；各模型的 `*-config-fields.tsx` 现内置 Prompt 编辑器 + 模型专属字段。
- 数据流：父级（controller/workspace）提供 `prompt`、`onPromptChange`、`modelConfigs`；配置面板将 prompt 及回调转交给具体模型 ConfigFields，后者在内部渲染 `PromptEditor` 并上报配置变更；生成按钮继续消费同一份 prompt/config。
- 复用与解耦：Prompt 组件依旧共享，但真正的渲染位置在各模型配置中，可灵活调整布局而不触及面板。
- 最佳实践：受控表单、职责内聚（模型配置自带所需输入）、派生数据用 `useMemo`，让状态集中且可预测。

### 🟦 D. 初学者学习重点总结
- 受控组件：Prompt textarea、Select 均由父级状态驱动。
- 组件拆分与下放：共享 Prompt 组件 + 各模型自行渲染，减少面板臃肿。
- `useMemo` 适合派生最近历史等轻量数据。
- `'use client'` 是交互组件在 App Router 中运行的基础。

---
