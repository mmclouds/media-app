## 新增需求
### 需求：nano-banana 模型参数支持
系统必须支持 nano-banana 模型在不同生成模式下的参数传入与校验。

#### 场景：文本生成图片
- **当** 用户选择 text to image 模式
- **那么** 请求载荷使用模型 `google/nano-banana`
- **并且** 包含 `input.prompt`
- **并且** `input.prompt` 最大长度为 5000 字符
- **并且** 可选 `input.output_format` 值为 `png` 或 `jpeg`
- **并且** 可选 `input.image_size` 值为 `1:1`、`9:16`、`16:9`、`3:4`、`4:3`、`3:2`、`2:3`、`5:4`、`4:5`、`21:9`、`auto`

#### 场景：图片编辑
- **当** 用户选择 image to image 模式
- **那么** 请求载荷使用模型 `google/nano-banana-edit`
- **并且** 包含 `input.prompt`
- **并且** 可选 `input.image_urls` 作为图片数组
- **并且** `input.image_urls` 最大数量为 10
- **并且** 单张图片最大大小为 10MB

### 需求：nano-banana 模型计费
系统必须为 nano-banana 与 nano-banana-edit 模型配置积分价格。

#### 场景：查询计费
- **当** 计算 `google/nano-banana` 或 `google/nano-banana-edit` 的积分
- **那么** 返回积分为 4

### 需求：页面展示与字段联动
系统必须在图片生成页面展示 nano-banana 模型与其参数字段，并在不同生成模式下展示对应输入项。

#### 场景：展示 text to image 字段
- **当** 用户选择 text to image 模式
- **那么** 页面展示 prompt、output_format、image_size 输入项

#### 场景：展示 image to image 字段
- **当** 用户选择 image to image 模式
- **那么** 页面展示 prompt、output_format、image_size 与多图上传输入项

### 需求：参数组件映射
系统必须为 nano-banana 的参数指定对应的前端组件实现，若没有现成组件则新增。

#### 场景：参数组件映射清单
- **当** 渲染 nano-banana 的配置表单
- **那么** `model` 参数由“生成模式切换组件”控制（需新增，可参考 `src/components/marketing/media-generator/video/sora-config-fields.tsx` 的模式按钮样式）
- **并且** `input.prompt` 使用 `PromptEditor`（`src/components/marketing/media-generator/shared/prompt-editor.tsx`）
- **并且** `input.image_urls` 使用新建的多图上传组件（需新增，参考 `src/components/marketing/media-generator/shared/single-image-upload-field.tsx`）
- **并且** `input.output_format` 使用 `SelectField`（`src/components/marketing/media-generator/shared/config-field-controls.tsx`）
- **并且** `input.image_size` 使用 `AspectRatioField`（`src/components/marketing/media-generator/shared/config-field-controls.tsx`）

### 需求：多图上传组件
系统必须提供独立的多图上传组件以支持 nano-banana-edit 模型的图片输入。

#### 场景：配置上传限制
- **当** 初始化多图上传组件
- **那么** 必须支持传入单文件大小限制与最大文件数量限制

#### 场景：超过限制处理
- **当** 用户选择的文件数量或大小超过限制
- **那么** 组件阻止上传并显示英文提示
