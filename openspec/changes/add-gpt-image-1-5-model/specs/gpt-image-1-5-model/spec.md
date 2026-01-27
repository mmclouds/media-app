## 新增需求
### 需求：GPT Image 1.5 模型参数支持
系统必须支持 GPT Image 1.5 图片模型的参数传入与校验。

#### 场景：文本生成图片
- **当** 用户选择 text-to-image 模式
- **那么** 请求载荷使用模型 gpt-image/1.5-text-to-image
- **并且** 包含 input.prompt
- **并且** input.prompt 最大长度为 3000 字符
- **并且** input.aspect_ratio 值为 1:1、2:3、3:2
- **并且** input.quality 值为 medium 或 high

#### 场景：图片生成图片
- **当** 用户选择 image-to-image 模式
- **那么** 请求载荷使用模型 gpt-image/1.5-image-to-image
- **并且** 包含 input.prompt
- **并且** input.prompt 最大长度为 3000 字符
- **并且** input.aspect_ratio 值为 1:1、2:3、3:2
- **并且** input.quality 值为 medium 或 high
- **并且** 必须提供 input.input_urls
- **并且** input.input_urls 最大数量为 16
- **并且** 单张图片最大大小为 10MB

### 需求：请求体与上传参数
系统必须在请求网关时将图片上传 UUID 追加到 inputFileUuids 查询参数中，并且不在请求体中发送 input.input_urls。

#### 场景：上传文件 UUID 透传
- **当** 用户上传图片并提交 image-to-image 请求
- **那么** 使用 inputFileUuids 透传上传的 uuid 列表
- **并且** 请求体不包含 input.input_urls

### 需求：页面展示与字段联动
系统必须在图片生成页面展示 GPT Image 1.5 模型与其参数字段，并在不同模式下展示对应输入项。

#### 场景：展示 text-to-image 字段
- **当** 用户选择 text-to-image 模式
- **那么** 页面展示 prompt、aspect_ratio、quality 输入项

#### 场景：展示 image-to-image 字段
- **当** 用户选择 image-to-image 模式
- **那么** 页面展示 prompt、aspect_ratio、quality 与多图上传输入项

### 需求：参数组件映射
系统必须为 GPT Image 1.5 的参数指定对应前端组件实现。

#### 场景：参数组件映射清单
- **当** 渲染 GPT Image 1.5 配置表单
- **那么** model 参数使用分段切换组件（样式参考 sora2 模式按钮）
- **并且** input.prompt 使用 PromptEditor
- **并且** input.aspect_ratio 使用 AspectRatioField
- **并且** input.quality 使用 CheckboxGroupField
- **并且** input.input_urls 使用 MultiImageUploadField

### 需求：模型注册信息
系统必须在 MODEL_REGISTRY 中注册 GPT Image 1.5 模型信息。

#### 场景：模型展示
- **当** 用户查看图片模型列表
- **那么** 展示 id 与 modelName 为 gpt-image-1.5
- **并且** 展示名称为 GPT Image 1.5
- **并且** 描述为 GPT Image 1.5 is OpenAIs flagship image generation model
- **并且** provider 为 OpenAI

### 需求：模型计费
系统必须为 GPT Image 1.5 模型配置积分价格。

#### 场景：查询计费（medium）
- **当** 计算 gpt-image/1.5-text-to-image 或 gpt-image/1.5-image-to-image 的积分
- **并且** input.quality 为 medium
- **那么** 返回积分为 4

#### 场景：查询计费（high）
- **当** 计算 gpt-image/1.5-text-to-image 或 gpt-image/1.5-image-to-image 的积分
- **并且** input.quality 为 high
- **那么** 返回积分为 22
