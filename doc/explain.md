---

## 2. explain.md（讲解内容）必须包含以下部分

### 🟦 A. React 核心概念讲解
- 使用了函数组件搭配 props 驱动渲染，不依赖本地 state，便于父级统一收集配置。
- 通过 `'use client'` 将表单组件声明为客户端组件，使事件处理（选择、滑杆、开关）生效。
- 公共表单控件（`SliderField`、`SelectField`、`ToggleField`）抽成独立组件，体现复用与解耦的最佳实践。
- 组件渲染完全由 props 控制，父级传入 config/onChange 后即可无副作用地展示当前值，符合 React 单向数据流。

### 🟦 B. Next.js 核心概念讲解（若本次代码使用 Next.js）
- App Router 下，带有 `'use client'` 的文件会编译为 Client Component，确保浏览器端交互正常；这些表单组件需要事件处理，因此保持客户端属性。
- 虽未修改路由文件，但组件拆分后依旧可在现有页面直接按新路径引用，符合 Next.js 基于文件路径的模块组织习惯。

### 🟦 C. 代码逻辑拆解与架构说明
- 文件结构：新增 `shared/config-field-controls.tsx` 存放通用表单控件；`video/config-fields.tsx` 管理 Sora/Veo3 配置，`image/config-fields.tsx` 管理 Still 配置，`audio/config-fields.tsx` 管理 AudioCraft 配置；`model-configs.tsx` 仅做聚合导出。
- 每个模型组件负责解析自身默认值与选项，并在字段变化时调用父级的 `onChange` 回传最新 config，保持模型内聚。
- 公共控件统一样式与交互，避免不同模型重复写 label/select/slider 逻辑，同时确保 UI 一致性。
- 相比集中在单文件，新结构按媒体类型分组，扩展新模型时只需在对应目录新增组件，降低耦合与维护成本。

### 🟦 D. 初学者学习重点总结
- 理解 `'use client'` 决定组件的运行环境，表单/事件处理必须在客户端组件中。
- 单向数据流：表单值来源于 props，变化通过回调上报，父级维护真实状态。
- 组件抽象：提取通用表单控件，减少重复代码并保证风格一致。
- 目录分层：按业务领域（video/image/audio）拆文件，方便定位与扩展。

---
