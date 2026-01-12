## 新增需求
### 需求：Veo 3.1 模型入口与默认配置
系统必须在视频模型列表中新增 Veo 3.1 模型，并提供默认配置。

#### 场景：默认进入 Veo 3.1
- **当** 用户在视频模型列表中选择 Veo 3.1
- **那么** 系统展示 Veo 3.1 配置表单
- **并且** `generationType` 默认值为 `TEXT_2_VIDEO`
- **并且** 模型版本默认值为 `veo3_fast`
- **并且** `aspectRatio` 默认值为 `16:9`

### 需求：Veo 3.1 模型版本切换
系统必须使用模型版本组件展示 Veo 3.1 的 Fast 与 Quality 选项。

#### 场景：展示模型版本选项
- **当** 用户查看 Veo 3.1 的模型版本选择
- **那么** 选项包含 `veo3.1 Fast`（value 为 `veo3_fast`）
- **并且** 选项包含 `veo3.1 Quality`（value 为 `veo3`）

### 需求：生成模式切换与字段展示
系统必须提供三种生成模式，并在不同模式下展示对应字段。

#### 场景：TEXT_2_VIDEO 模式
- **当** `generationType` 为 `TEXT_2_VIDEO`
- **那么** 页面仅展示 prompt、模型版本与宽高比字段
- **并且** 不展示图片上传字段

#### 场景：FIRST_AND_LAST_FRAMES_2_VIDEO 模式
- **当** `generationType` 为 `FIRST_AND_LAST_FRAMES_2_VIDEO`
- **那么** 页面展示 prompt、模型版本、宽高比与首尾帧双图上传组件
- **并且** 首尾帧双图上传组件仅允许上传 1-2 张图片

#### 场景：REFERENCE_2_VIDEO 模式
- **当** `generationType` 为 `REFERENCE_2_VIDEO`
- **那么** 页面展示 prompt、模型版本、宽高比与多图上传组件
- **并且** 多图上传组件要求 1-3 张参考图

### 需求：首尾帧双图上传组件
系统必须提供一个独立的首尾帧双图上传组件，固定展示两个上传槽位。

#### 场景：上传首尾帧图片
- **当** 用户分别在 First frame / Last frame 槽位上传图片
- **那么** 组件仅接受最多 2 张图片并保持顺序
- **并且** 上传成功后可返回下载地址与 UUID
- **并且** 上传失败时显示英文提示

### 需求：宽高比选项
系统必须为 Veo 3.1 提供指定的宽高比选择。

#### 场景：展示宽高比选项
- **当** 用户查看宽高比选项
- **那么** 仅提供 `16:9`、`9:16`、`auto`
- **并且** 默认选中 `16:9`
- **并且** 提示 "Only 16:9 supports 1080P."

### 需求：参考图模式限制
系统必须限制参考图模式的模型版本与宽高比。

#### 场景：锁定参考图模式的配置
- **当** `generationType` 为 `REFERENCE_2_VIDEO`
- **那么** `model` 必须锁定为 `veo3_fast`
- **并且** `aspectRatio` 必须锁定为 `16:9`

### 需求：请求字段映射
系统必须按指定字段名构建 Veo 3.1 的生成请求。

#### 场景：提交 Veo 3.1 生成请求
- **当** 用户提交 Veo 3.1 生成请求
- **那么** 请求体包含 `generationType`、`model`、`prompt`、`aspectRatio`
- **并且** `model` 仅为 `veo3_fast` 或 `veo3`
- **并且** 当需要图片输入时提交 `imageUrls` 数组
- **并且** `imageUrls` 的 UUID 需写入顶层 `inputFileUuids` 数组
- **并且** `enableFallback` 固定传 `true`
- **并且** 不传 `watermark`、`enableTranslation`、`seeds`、`callBackUrl`

### 需求：Veo 3.1 模型计费
系统必须为 veo3_fast 与 veo3 配置固定积分价格。

#### 场景：查询 veo3_fast 计费
- **当** 计算 `veo3_fast` 的积分
- **那么** 返回积分为 60（$0.30）

#### 场景：查询 veo3 计费
- **当** 计算 `veo3` 的积分
- **那么** 返回积分为 250（$1.25）

### 需求：参数组件映射
系统必须为 Veo 3.1 的参数指定对应的前端组件。

#### 场景：参数组件映射清单
- **当** 渲染 Veo 3.1 配置表单
- **那么** `generationType` 使用与 Sora2 相同的 tab 切换样式
- **并且** 模型版本使用 `ModelVersionSwitcher`
- **并且** `prompt` 使用 `PromptEditor`
- **并且** `aspectRatio` 使用 `AspectRatioField`
- **并且** 首尾帧使用新建的双图上传组件
- **并且** 参考图使用 `MultiImageUploadField`
