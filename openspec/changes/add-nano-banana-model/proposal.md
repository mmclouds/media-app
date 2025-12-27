# 变更：接入 nano-banana 图片模型并新增多图上传组件

## 为什么
- 现有图片生成流程缺少 google/nano-banana 与 google/nano-banana-edit 模型支持。
- 需要支持编辑模型的多图上传能力并在页面展示相应字段。

## 变更内容
- 增加 nano-banana 与 nano-banana-edit 模型参数、请求映射与页面展示。
- 新增多图上传组件，支持文件大小与数量限制。
- 更新积分计费配置以覆盖新模型。

## 影响
- 受影响规范：nano-banana-model（新增）
- 受影响代码：模型配置、积分配置、图片生成页面与上传组件
