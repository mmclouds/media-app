# Media Generator 组件化设计方案

## 设计目标
- 统一命名为“Media Generator”，视频只是 `mediaType` 之一（video/image/audio），未来可扩展更多类型。
- 保持“菜单 / 模型与配置 / 预览”三栏的现有交互，但允许在子页内只嵌入“模型与配置 + 预览”区域。
- 以“媒体类型 + 模型”维度扩展子页，例如“视频 + veo3”、“图片 + sora”，支持设置默认媒体类型和默认模型。
- 生成按钮逻辑通用化，触发同一套多媒体生成接口，并驱动右侧预览区域。
- 预览区域在未生成前展示默认占位媒资，生成后仅展示最新结果（不保留滚动列表）。
- 模型配置高度解耦，按模型拆分为独立组件，便于后续增减模型或调整表单。

## 组件拆分
### 顶层壳组件
- **`MediaGeneratorShell`**：完整三栏布局，包含左侧菜单切换（video/image/audio 等），用于独立页面。接受 `initialMediaType` 与 `initialModel`，内部将其传递给工作区。
- **`MediaGeneratorEmbed`**：子页专用容器，仅渲染“模型与配置 + 预览”两栏，隐藏菜单。支持透传默认媒体类型、默认模型、默认占位媒资（视频/图片/音频封面）。

### 工作区与上下文
- **`MediaGeneratorWorkspace`**：承载表单、按钮与预览的核心区域，不关心外层壳的存在。通过 `props` 或 `MediaGeneratorProvider` 读取/更新以下状态：`mediaType`、`model`、`prompt`、`generationResult`、`isGenerating`。
- **`MediaGeneratorProvider`**：集中管理状态与动作（切换媒体类型、选择模型、提交生成、重置结果等），提供 Context 供子组件消费，避免层层 props 传递。

### 生成触发
- **`GenerateAction` 组件**：封装通用按钮逻辑，接受 `buildPayload(state) => RequestBody` 与 `onResult` 回调，内部统一处理：
  - 读取当前上下文（媒体类型、模型、参数），拼装请求；
  - 调用 `/api/media/generate` 与 `/api/media/result/{taskId}` 轮询；
  - 将状态写回 Context（`isGenerating`、`progress`、`result`）。
- 该组件可在不同媒体类型/模型下复用，只需传入各模型的参数映射规则。

### 模型配置区
- **模型级组件**：按模型命名，形如 `SoraConfigPanel`、`Veo3ConfigPanel`、`FluxConfigPanel`。每个组件负责：
  - 渲染特定模型所需的输入字段；
  - 通过 Context 更新通用的参数结构（如 `state.params`）；
  - 提供 `mapToRequest` 函数给 `GenerateAction`，将 UI 参数转成接口体。
- **模型选择器**：`ModelSwitcher` 维护模型列表与默认值，切换时挂载对应的模型配置组件，并按 `mediaType` 过滤不兼容模型。

### 预览区
- **`GenerationPreview`**：读取 Context 中的最新生成结果；未生成时展示 `defaultAsset`（传入占位视频/图片/音频波形或封面）；生成后只渲染当前结果，不保留历史列表。
- 支持媒体类型切换：视频使用 `<video>`，图片使用 `<Image>`，音频搭配波形或封面，均复用同一容器与加载态。

## 子页嵌入策略
- 子页（如“视频 + veo3”）直接引入 `MediaGeneratorEmbed`，传入 `initialMediaType="video"`、`initialModel="veo3"`、`defaultAsset={veo3DemoVideo}`。
- 页面层只负责文案与容器布局，生成与预览完全复用工作区逻辑，确保后续新增子页无需重复实现按钮或轮询。

## 路由与配置
- 保持主入口 `/media-generator` 使用 `MediaGeneratorShell`，同时可在 `/(pages)/media/[type]/[model]` 等新路由中复用 `MediaGeneratorEmbed`。
- 模型枚举与默认值集中存放在 `src/components/marketing/media-generator/config.ts`（或类似目录），子页与 Provider 共用，避免魔法字符串。

## 数据流与接口对接
- Context 统一暴露 `state` 与 `actions`：
  - `state`: `{ mediaType, model, params, result, progress, isGenerating }`
  - `actions`: `{ setMediaType, setModel, updateParams, submitGeneration, resetResult }`
- `GenerateAction` 通过 `submitGeneration` 发起请求；轮询结果写入 `result`，触发 `GenerationPreview` 更新。
- 默认占位媒资通过 `defaultAsset` 传入 Provider 或 Preview，便于不同子页展示定制封面或示例媒资。

## 扩展性考量
- 模型新增：只需提供新的模型配置组件 + 请求映射函数，加入模型列表即可。
- 媒体类型新增：在模型列表中标记支持的媒体类型，`ModelSwitcher` 自动过滤不兼容项，`GenerationPreview` 通过 `mediaType` 切换渲染。
- 交互一致性：生成逻辑与预览逻辑集中在 Provider + GenerateAction，菜单与子页容器只是不同的布局层，降低耦合。
