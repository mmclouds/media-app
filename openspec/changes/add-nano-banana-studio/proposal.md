# 变更：新增 Nano Banana Studio 页面

## 为什么
需要一个默认选中 nano-banana 的媒体生成入口，同时保留切换媒体类型与模型的能力。

## 变更内容
- 新增 `/media-studio/nano-banana` 页面，默认图片类型与 nano-banana 模型
- 更新 MediaGeneratorWorkspace 支持默认媒体类型与模型

## 影响
- 受影响规范：media-studio（新增）
- 受影响代码：
  - src/app/[locale]/(marketing)/(pages)/media-studio/nano-banana/page.tsx
  - src/components/marketing/media-generator/（新增组件）
