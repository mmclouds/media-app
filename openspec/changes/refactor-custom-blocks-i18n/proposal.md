# 变更：抽离 Home blocks 为可复用自定义组件

## 为什么
当前 Home blocks 组件直接在组件内部使用多语言文案，导致无法在多个页面复用。需要抽离为可复用组件，并由调用方传入文案与节点。

## 变更内容
- 在 `src/components/custom-blocks/` 新建与 Home blocks 对应的自定义组件副本。
- 自定义组件移除 `next-intl` 依赖，改为扁平 props 接收文案与 `ReactNode`。
- 保持 `src/components/blocks/` 及 Home 页面不做任何修改。

## 影响
- 受影响规范：新增 `custom-blocks`
- 受影响代码：`src/components/custom-blocks/*`（新增）
