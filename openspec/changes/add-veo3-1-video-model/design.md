## 上下文
Veo 3.1 需要在视频生成流程中提供三种生成模式，并复用现有媒体生成架构（模型注册、配置表单、生成请求拼装、积分计算）。现有实现仅包含 Sora2、Nano Banana、Suno 等模型。

## 目标 / 非目标
- 目标：新增 Veo 3.1 视频模型入口、字段配置与请求映射；提供首尾帧双图上传组件；配置 veo3_fast / veo3 的积分价格；按要求锁定参考图模式限制。
- 非目标：调整 AI Gateway 传输协议、修改既有模型行为、变更 SEO/落地页内容。

## 决策
- 使用新的 Veo 3.1 配置组件，沿用 Sora2 的 tab 切换样式与现有字段控件（ModelVersionSwitcher、PromptEditor、AspectRatioField）。
- 新增双图上传组件（固定 First/Last 槽位），参考图模式复用 MultiImageUploadField，并限制数量。
- 生成请求体写入 `generationType`、`model`、`prompt`、`imageUrls`、`aspectRatio`、`enableFallback`；上传得到的 UUID 写入顶层 `inputFileUuids`，并继续通过 query `fileUuids` 透传以兼容现有网关流程。
- 当 `generationType=REFERENCE_2_VIDEO` 时锁定 `model=veo3_fast` 与 `aspectRatio=16:9`，避免不支持的组合。

## 风险 / 权衡
- `inputFileUuids` 与 query `fileUuids` 同时存在可能冗余，但能保证网关与模型字段同时可用。
- 锁定参考图模式的模型与宽高比会降低可选性，但符合现有能力限制。

## 迁移计划
- 无数据迁移；新增模型与配置后直接上线。

## 待决问题
- 无。
