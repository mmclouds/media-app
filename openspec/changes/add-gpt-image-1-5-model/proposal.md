# 变更：新增 GPT Image 1.5 模型配置与字段

## 为什么
需要在图片生成中提供 GPT Image 1.5 的配置字段与计费规则，保持与现有 Sora2/Veo3 等模型一致的交互体验。

## 变更内容
- 新增 GPT Image 1.5 模型配置字段与请求体构建规范
- 新增 GPT Image 1.5 的积分计费规则
- 增量规范：gpt-image-1-5-model

## 影响
- 受影响规范：gpt-image-1-5-model
- 受影响代码：图片模型配置字段、MODEL_REGISTRY、积分价格配置
