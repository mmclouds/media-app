# 变更：Media Studio 选择缓存

## 为什么
用户在 Media Studio 选择媒体类型与模型后刷新页面会丢失选择，影响连续使用体验。

## 变更内容
- 在 `/media-studio` 页面缓存用户选择的媒体类型与模型
- 刷新页面后恢复上次选择

## 影响
- 受影响规范：media-studio（新增）
- 受影响代码：
  - src/components/marketing/media-generator/media-generator-workspace.tsx
  - src/components/marketing/media-generator/controller.tsx
  - src/app/[locale]/(marketing)/(pages)/media-studio/page.tsx
