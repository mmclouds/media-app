---

## 2. explain.md（讲解内容）必须包含以下部分

### 🟦 A. React 核心概念讲解
- 使用函数组件按模型拆分（Sora/Veo3），各自只依赖 props，保持单向数据流，父级集中持有配置。
- `'use client'` 让表单组件在浏览器端运行，才能响应选择、滑杆、开关事件。
- 公共表单控件（`SliderField`、`SelectField`、`ToggleField`）抽象成独立组件，体现复用和解耦；模型组件只关注业务选项与默认值。
- 组件渲染无内部 state，完全由传入的 `config` 驱动，减少重复渲染逻辑与副作用。

### 🟦 B. Next.js 核心概念讲解（若本次代码使用 Next.js）
- 这些表单属于 App Router 下的 Client Components，`'use client'` 触发客户端编译，使事件处理生效。
- 拆分后路径仍遵循 App Router 的模块化惯例：功能组件放在 `src/components/...`，页面可直接按路径导入，不影响路由行为。

### 🟦 C. 代码逻辑拆解与架构说明
- 文件结构：`video/sora-config-fields.tsx` 与 `video/veo3-config-fields.tsx` 分别承载各自模型；`image/config-fields.tsx`、`audio/config-fields.tsx` 按媒体类型分组；`shared/config-field-controls.tsx` 存放通用控件；`model-configs.tsx` 仅做聚合导出。
- 每个模型组件负责解析默认值（如秒数、分辨率、预设、是否包含音频），并在字段变化时通过 `onChange` 回传，父级即可统一存储 `{ modelId: config }`。
- 公共控件封装了视觉与交互样式，避免不同模型重复写 Label/Select/Slider/Toggle，保持 UI 一致性。
- 相比集中在单文件的实现，按模型拆分降低耦合，新增模型只需复制一份表单文件并在注册表里引用即可。

### 🟦 D. 初学者学习重点总结
- 理解 `'use client'` 作用：需要事件交互的组件必须是 Client Component。
- 单向数据流：表单值来自 props，变更通过回调上报，由父级管理真实状态。
- 组件抽象：通用控件应提取复用，业务组件只关注选项与默认值。
- 目录分层：按媒体类型和模型拆文件，方便定位与扩展，同时保持导出聚合文件简化外部引用。

---
