# suno-audio-model Specification

## Purpose
TBD - created by archiving change add-suno-audio-model. Update Purpose after archive.
## 需求
### 需求：SUNO V5 模型参数
系统必须支持 SUNO V5 音频生成请求参数传入与校验。

#### 场景：提交 SUNO V5 生成请求
- **当** 用户选择 SUNO V5 音频模型
- **那么** 请求体包含 `customMode=true` 与 `instrumental=false`
- **并且** 请求体包含 `model=V5`
- **并且** `prompt` 必填，最大 5000 字符
- **并且** `style` 必填，最大 1000 字符
- **并且** `title` 必填，最大 80 字符
- **并且** 可选 `negativeTags` 用于避免特定风格

### 需求：前端字段展示
系统必须在音频生成页面展示 SUNO V5 的字段输入项与提示。

#### 场景：展示 SUNO V5 字段
- **当** 用户选择 SUNO V5 模型
- **那么** 页面展示 `prompt`、`style`、`title`、`negativeTags` 输入项
- **并且** `style` 输入提示示例使用英文（如 Jazz、Classical、Electronic、Pop、Rock、Hip-hop）

### 需求：参数组件映射
系统必须为 SUNO V5 的参数指定对应前端组件实现。

#### 场景：参数组件映射清单
- **当** 渲染 SUNO V5 配置表单
- **那么** `prompt` 与 `style` 使用可配置标题/占位的 `PromptEditor`
- **并且** `title` 使用新的短文本输入组件
- **并且** `negativeTags` 使用可配置标题/占位的 `PromptEditor`

### 需求：SUNO V5 模型计费
系统必须为 SUNO V5 模型配置固定积分价格。

#### 场景：查询计费
- **当** 计算 `suno-v5` 的积分
- **那么** 返回积分为 12

