# z-image-model 规范增量

## 新增需求
### 需求：Z-Image 模型参数与请求
系统必须支持 z-image 图片模型的参数映射与请求载荷构建。

#### 场景：提交文本生成图片
- **当** 用户选择 z-image 模型并提交生成
- **那么** 请求载荷的 `model` 为 `z-image`
- **并且** `input.prompt` 为必填
- **并且** `input.prompt` 最大长度为 1000 字符
- **并且** `input.aspect_ratio` 为必填
- **并且** `input.aspect_ratio` 仅允许 `1:1`、`4:3`、`3:4`、`16:9`、`9:16`

### 需求：Z-Image 模型注册
系统必须在 `MODEL_REGISTRY` 中注册 z-image 模型信息。

#### 场景：模型注册信息
- **当** 读取图片模型列表
- **那么** 存在 id 为 `z-image` 的模型
- **并且** `modelName` 为 `z-image`
- **并且** `description` 为 `Z-Image is Tongyi-MAIs efficient image generation model`
- **并且** 默认 `input.aspect_ratio` 为 `1:1`

### 需求：Z-Image 配置表单
系统必须在图片生成页面展示 z-image 的配置字段。

#### 场景：展示配置字段
- **当** 用户选择 z-image 模型
- **那么** 页面展示 `prompt` 与 `aspect_ratio` 输入项

### 需求：Z-Image 参数组件映射
系统必须为 z-image 的参数指定前端组件实现。

#### 场景：参数组件映射清单
- **当** 渲染 z-image 的配置表单
- **那么** `input.prompt` 使用 `PromptEditor`（`src/components/marketing/media-generator/shared/prompt-editor.tsx`）
- **并且** `input.prompt` 的 `maxLength` 为 1000
- **并且** `input.aspect_ratio` 使用 `AspectRatioField`（`src/components/marketing/media-generator/shared/config-field-controls.tsx`）

### 需求：Z-Image 模型计费
系统必须为 z-image 配置固定积分价格。

#### 场景：查询计费
- **当** 计算 `z-image` 的积分
- **那么** 使用 `priceUsd=0.004`
- **并且** 在全局汇率为 200 时返回积分为 1
