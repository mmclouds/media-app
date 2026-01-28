# 变更：新增 Nano Banana Pro 图片模型

## 为什么
- 现有模型列表缺少 Nano Banana Pro，需要支持新的高分辨率图片模型能力与计费。

## 变更内容
- 新增 Nano Banana Pro 模型注册信息（id/modelName/描述/供应商等）。
- 新增 Nano Banana Pro 参数规范与前端字段展示映射。
- 新增 Nano Banana Pro 请求体与上传参数规则（仅透传 inputFileUuids）。
- 新增 Nano Banana Pro 计费规则（按分辨率分档）。

## 影响
- 受影响规范：nano-banana-pro-model
- 受影响代码：图片模型注册、图片模型配置表单、媒体生成请求构建、积分配置
