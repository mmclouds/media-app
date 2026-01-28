## 新增需求
### 需求：Kling 2.6 模型入口与默认配置
系统必须在视频模型列表中新增 Kling 2.6 模型，并提供默认配置。

#### 场景：默认进入 Kling 2.6
- **当** 用户在视频模型列表中选择 Kling 2.6
- **那么** 系统展示 Kling 2.6 配置表单
- **并且** `model` 默认值为 `kling-2.6/text-to-video`
- **并且** `input.sound` 默认值为 `true`
- **并且** `input.duration` 默认值为 `5`

### 需求：MODEL_REGISTRY 注册信息
系统必须在 `MODEL_REGISTRY` 中注册 Kling 2.6 模型信息。

#### 场景：注册模型基本信息
- **当** 读取 Kling 2.6 的模型注册信息
- **那么** 展示 id 与 modelName 为 `kling-2.6`
- **并且** 描述为 `Kling 2.6 is Kling AI’s audio-visual generation model`
- **并且** provider 为 `Kling AI`

### 需求：生成模式切换与字段展示
系统必须提供文生视频与图生视频两种模式，并在不同模式下展示对应字段。

#### 场景：text-to-video 模式
- **当** `model` 为 `kling-2.6/text-to-video`
- **那么** 页面展示 prompt、sound 开关与 duration 选择
- **并且** 不展示图片上传字段与 aspect_ratio 字段

#### 场景：image-to-video 模式
- **当** `model` 为 `kling-2.6/image-to-video`
- **那么** 页面展示 prompt、图片上传、aspect_ratio、sound 开关与 duration 选择
- **并且** 图片上传字段为必填
- **并且** aspect_ratio 字段为必填

### 需求：prompt 与长度限制
系统必须限制 Kling 2.6 的 prompt 最大长度为 2500 字符。

#### 场景：输入超过最大长度
- **当** 用户输入 prompt 超过 2500 字符
- **那么** 系统必须阻止继续输入或给出超限提示

### 需求：图片上传与 UUID 透传
系统必须在图生视频模式使用多图上传组件，并仅透传图片 UUID。

#### 场景：上传图片并构建请求
- **当** 用户在图生视频模式上传图片
- **那么** 使用 `MultiImageUploadField` 组件收集图片
- **并且** 上传图片最多 5 张
- **并且** 只将图片 UUID 写入 query 的 `inputFileUuids`
- **并且** 请求体中不传 `input.image_urls`

### 需求：宽高比选项
系统必须为 Kling 2.6 图生视频提供指定的宽高比选择。

#### 场景：展示宽高比选项
- **当** 用户查看 aspect_ratio 选项
- **那么** 仅提供 `1:1`、`16:9`、`9:16`

### 需求：sound 开关
系统必须提供 sound 开关组件用于控制是否生成音频。

#### 场景：切换 sound
- **当** 用户切换 sound 开关
- **那么** `input.sound` 仅取 `true` 或 `false`（布尔值）

### 需求：duration 选择
系统必须提供时长选项 5s 与 10s。

#### 场景：选择时长
- **当** 用户选择时长
- **那么** `input.duration` 仅取 `5` 或 `10`（数值）

### 需求：请求字段映射
系统必须按指定字段名构建 Kling 2.6 的生成请求。

#### 场景：提交 Kling 2.6 生成请求
- **当** 用户提交 Kling 2.6 生成请求
- **那么** 请求体包含 `model`、`input.prompt`、`input.sound`、`input.duration`
- **并且** 当 `model` 为 `kling-2.6/image-to-video` 时额外包含 `input.aspect_ratio`
- **并且** 不传 `callBackUrl`

### 需求：Kling 2.6 模型计费
系统必须为 Kling 2.6 按 sound 与 duration 组合配置积分价格。

#### 场景：sound=false 且 duration=5s
- **当** 计算 `kling-2.6/image-to-video` 或 `kling-2.6/text-to-video` 的积分，参数为 `input.sound=false` 且 `input.duration=5`
- **那么** 返回积分为 56（$0.28）

#### 场景：sound=false 且 duration=10s
- **当** 计算 `kling-2.6/image-to-video` 或 `kling-2.6/text-to-video` 的积分，参数为 `input.sound=false` 且 `input.duration=10`
- **那么** 返回积分为 110（$0.55）

#### 场景：sound=true 且 duration=5s
- **当** 计算 `kling-2.6/image-to-video` 或 `kling-2.6/text-to-video` 的积分，参数为 `input.sound=true` 且 `input.duration=5`
- **那么** 返回积分为 110（$0.55）

#### 场景：sound=true 且 duration=10s
- **当** 计算 `kling-2.6/image-to-video` 或 `kling-2.6/text-to-video` 的积分，参数为 `input.sound=true` 且 `input.duration=10`
- **那么** 返回积分为 220（$1.10）

### 需求：参数组件映射
系统必须为 Kling 2.6 的参数指定对应的前端组件。

#### 场景：参数组件映射清单
- **当** 渲染 Kling 2.6 配置表单
- **那么** `model` 使用与 Sora2 相同的 tab 切换样式
- **并且** `prompt` 使用 `PromptEditor`
- **并且** `aspect_ratio` 使用 `AspectRatioField`
- **并且** 图片上传使用 `MultiImageUploadField`
- **并且** `input.sound` 使用新建的 `SwitchField`
- **并且** `input.duration` 使用 `CheckboxGroupField`
