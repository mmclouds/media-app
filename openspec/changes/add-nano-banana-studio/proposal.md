# 变更：新增 Nano Banana Studio 页面

## 为什么
需要一个默认选中 nano-banana 的媒体生成入口，同时保留切换媒体类型与模型的能力。

## 变更内容
- 新增 `/media-studio/nano-banana` 页面，默认图片类型与 nano-banana 模型
- 新增带默认媒体类型/模型的工作区组件，避免改动现有通用组件

## 影响
- 受影响规范：media-studio（新增）
- 受影响代码：
  - src/app/[locale]/(marketing)/(pages)/media-studio/nano-banana/page.tsx
  - src/components/marketing/media-generator/（新增组件）
