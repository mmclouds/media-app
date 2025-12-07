---

## 2. explain.md（讲解内容）必须包含以下部分

### 🟦 A. React 核心概念讲解
- `MediaGeneratorConfigPanel` 是客户端函数组件，交互事件通过 props 传递，保持单向数据流。
- `useMemo` 从历史记录派生最近三条 prompt，避免每次渲染重新切片。
- 模型下拉为受控组件：触发器直接渲染选中模型 label（并加 `aria-label`），不再依赖默认显示逻辑，确保收起时只展示名称；下拉项用 Radix `ItemText` 仅含 label，描述独立存在且被选中后不会带到触发器。
- 组件内部无本地 state，渲染完全由外部状态驱动。
- 职责分离：头部切换模型，主体编辑 prompt 与配置，底部触发生成与回看历史。

### 🟦 B. Next.js 核心概念讲解（若本次代码使用 Next.js）
- `'use client'` 让组件在浏览器端运行，支持下拉和输入交互；App Router 会先 SSR 再水合。
- 组件位于 `src/components` 供各路由复用，符合 Next.js 文件即模块的组织方式。
- 数据获取留给上层路由/容器，组件只负责展示与交互，便于按需加载。

### 🟦 C. 代码逻辑拆解与架构说明
- 文件：`src/components/marketing/media-generator/media-generator-config-panel.tsx`。
- 头部模型选择：触发器只渲染当前 label（并设置 `aria-label`），下拉项使用 Radix Item，勾选指示来自 `ItemIndicator`，描述设为 `aria-hidden`，因此选中后不会出现在触发器内。
- 列表式模型选择入口已移除，配置区仍按 `activeModel` 渲染对应表单并上报配置。
- Prompt 编辑、生成按钮、历史记录沿用原有逻辑，无行为变更。

### 🟦 D. 初学者学习重点总结
- 受控组件：`Select` 值由父级管理，事件只上报变化。
- 自定义显示：当默认 `SelectValue` 会带来多余文本时，可手动渲染触发器内容并使用 `aria-label` 保障可访问性。
- `'use client'` 是交互组件的前提。
- `useMemo` 适合从 props 派生轻量数据。

---
