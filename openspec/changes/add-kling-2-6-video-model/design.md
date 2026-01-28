## 上下文
Kling 2.6 需要在视频生成流程中提供文生视频与图生视频两种模式，并复用现有媒体生成架构（模型注册、配置表单、生成请求拼装、积分计算）。当前视频模型仅包含 Sora2 与 Veo3.1。

## 目标 / 非目标
- 目标：新增 Kling 2.6 视频模型入口、字段配置与请求映射；提供 sound 选择开关；配置 sound/duration 的积分价格。
- 非目标：调整 AI Gateway 协议、修改既有模型行为、变更 SEO/落地页内容。

## 决策
- 使用与 Sora2 相同的 tab 样式切换文生视频与图生视频，两种模式分别对应 `kling-2.6/text-to-video` 与 `kling-2.6/image-to-video`。
- 图生视频仅透传上传图片的 UUID 到 query `inputFileUuids`，不在请求体中发送 `input.image_urls`。
- 新增一个通用的 Switch 表单控件（媒体生成配置字段使用），用于 `input.sound` 的开关切换。

## 风险 / 权衡
- 不传 `input.image_urls` 可能限制后端调试字段，但可以与现有 inputFileUuids 规范保持一致。
- 新增开关组件增加维护面，但可复用于其他模型字段。

## 迁移计划
- 无数据迁移；新增模型与配置后直接上线。

## 待决问题
- 无。
