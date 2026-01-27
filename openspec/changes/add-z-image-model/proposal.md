# 变更：新增 z-image 图片模型配置

## 为什么
需要在图片生成模块中新增 z-image 模型的配置字段与计费规则，确保前端可配置并完成积分估算。

## 变更内容
- 新增 z-image 的 config-field 组件与请求组装逻辑（不包含 callBackUrl）。
- 在 MODEL_REGISTRY 中注册 z-image（id/modelName 为 `z-image`，使用指定描述）。
- 增加 z-image 的积分价格规则（priceUsd=0.004）。

## 影响
- 受影响规范：新增 `specs/z-image-model/spec.md`
- 受影响代码：
  - `src/components/marketing/media-generator/image/z-image-config-fields.tsx`
  - `src/components/marketing/media-generator/controller.tsx`
  - `src/custom/credits/pricing/config.ts`
  - 可能涉及 `src/components/marketing/media-generator/model-configs.tsx`（若需要导出）
