## 新增需求
### 需求：Nano Banana Pro 模型参数支持
系统必须支持 Nano Banana Pro 图片模型的参数传入与校验。

#### 场景：提交图片生成请求
- **当** 用户选择 Nano Banana Pro 模型生成图片
- **那么** 请求载荷使用模型 `google/nano-banana-pro`
- **并且** 必须包含 `input.prompt`
- **并且** `input.prompt` 最大长度为 10000 字符
- **并且** 可选 `input.output_format` 仅允许 `png` 或 `jpg`
- **并且** 可选 `input.resolution` 仅允许 `1K`、`2K`、`4K`
- **并且** 可选 `input.aspect_ratio` 仅允许 `1:1`、`9:16`、`16:9`、`3:4`、`4:3`、`3:2`、`2:3`、`5:4`、`4:5`、`21:9`、`auto`

### 需求：图片输入上传限制
系统必须支持 Nano Banana Pro 的多图输入，并遵循上传限制。

#### 场景：配置上传限制
- **当** 渲染 Nano Banana Pro 的图片输入组件
- **那么** 单张图片最大大小为 30MB
- **并且** 最大上传数量为 8

### 需求：请求体与上传参数
系统必须在请求网关时仅透传上传 UUID，并且不向请求体传递图片输入列表。

#### 场景：上传文件 UUID 透传
- **当** 用户上传图片并提交 Nano Banana Pro 请求
- **那么** 使用 `inputFileUuids` 查询参数透传上传的 uuid 列表
- **并且** 请求体不包含 `input.image_input`
- **并且** 请求体不包含 `input.image_urls`

### 需求：页面展示与字段规则
系统必须在图片生成页面展示 Nano Banana Pro 的字段，并遵循展示约束。

#### 场景：展示模型字段
- **当** 用户选择 Nano Banana Pro 模型
- **那么** 页面展示 prompt、image_input、output_format、resolution、aspect_ratio 字段
- **并且** `callBackUrl` 不展示且不参与参数提交

### 需求：参数组件映射
系统必须为 Nano Banana Pro 的参数指定对应前端组件实现。

#### 场景：参数组件映射清单
- **当** 渲染 Nano Banana Pro 配置表单
- **那么** `input.prompt` 使用 `PromptEditor`
- **并且** `input.image_input` 使用 `MultiImageUploadField`
- **并且** `input.output_format` 使用 `CheckboxGroupField`
- **并且** `input.resolution` 使用 `CheckboxGroupField`
- **并且** `input.aspect_ratio` 使用 `Aspect Ratio` 组件

### 需求：模型注册信息
系统必须在 MODEL_REGISTRY 中注册 Nano Banana Pro 模型信息。

#### 场景：模型展示
- **当** 用户查看图片模型列表
- **那么** 展示 id 与 modelName 为 `nano-banana-pro`
- **并且** 展示名称为 `Nano Banana Pro`
- **并且** 描述为 `Google DeepMind’s Nano Banana Pro delivers sharper 2K imagery, intelligent 4K scaling`
- **并且** provider 为 `Google`

### 需求：模型计费
系统必须为 Nano Banana Pro 模型配置积分价格，并根据分辨率返回积分。

#### 场景：查询计费（1K/2K）
- **当** 计算 Nano Banana Pro 的积分
- **并且** `input.resolution` 为 `1K` 或 `2K`
- **那么** 返回积分为 18

#### 场景：查询计费（4K）
- **当** 计算 Nano Banana Pro 的积分
- **并且** `input.resolution` 为 `4K`
- **那么** 返回积分为 24
