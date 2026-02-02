# Media Studio 五个模型：站内实现与权威信息（临时整理）

> 生成时间：2026-02-01

## 1) 站内当前实现（从代码梳理）

位置：`src/components/marketing/media-generator/controller.tsx`

### 通用（MediaGeneratorWorkspace）
- 三种媒体类型：video / image / audio
- 统一工作流：选择媒体类型 → 选择模型 → 配置参数 → 输入 prompt → 生成 → 轮询任务状态（异步）→ 展示结果
- 结果展示组件：`MediaGeneratorResultPane`（轮询间隔 5s）
- 可选：展示预估积分（supportsCreditEstimate=true 时使用）

### GPT Image 1.5（modelId: `gpt-image-1.5`）
- 媒体类型：image
- UI 配置：Text to Image / Image to Image 两种模式
- 可上传多张参考图（Image to Image 时）
- 参数：`aspectRatio`（1:1 / 2:3 / 3:2）、`quality`（medium/high）
- 请求体：
  - text→image: `model: gpt-image/1.5-text-to-image`
  - image→image: `model: gpt-image/1.5-image-to-image` + fileUuids

### Z-Image（modelId: `z-image`）
- 媒体类型：image
- 参数：`aspectRatio`（1:1 / 4:3 / 3:4 / 16:9 / 9:16）
- 不支持上传参考图（当前 UI/请求体中没有 image input）
- 请求体：`model: z-image`, `input: { prompt, aspect_ratio }`

### Nano Banana Pro（modelId: `nano-banana-pro`）
- 媒体类型：image
- 可上传 1~8 张图片（可选）
- 参数：`outputFormat`（png/jpg）、`resolution`（1K/2K/4K）、`aspectRatio`（多比例 + auto）
- 请求体：`model: nano-banana-pro`, `input: { prompt, output_format, resolution, aspect_ratio }` + fileUuids

### Kling 2.6（modelId: `kling-2.6`）
- 媒体类型：video
- 模式：text-to-video / image-to-video
- image-to-video 可上传 1~5 张图片
- 参数：`duration`（5/10 秒）、`sound`（是否带声音）、`aspect_ratio`（仅 image-to-video 时）
- 请求体：
  - `model: kling-2.6/text-to-video` 或 `kling-2.6/image-to-video`

### Suno（modelId: `suno`）
- 媒体类型：audio
- 参数：`title`、`style`、`negativeTags`（以及默认 config 里的 customMode / instrumental 等）
- 请求体：走通用分支（`model: V5`，附带 prompt + config 字段）

---

## 3) 权威/官网信息（用于写文案）

### OpenAI（GPT Image）
- OpenAI Docs: Images and vision：https://platform.openai.com/docs/guides/images
- OpenAI Cookbook（含示例 prompt 与 notebook 输出）：https://developers.openai.com/cookbook/examples/generate_images_with_gpt_image

### Tongyi-MAI / Alibaba（Z-Image）
- 官方项目主页（blog，含大量示例图）：https://tongyi-mai.github.io/Z-Image-blog/
- GitHub（技术信息/变体说明）：https://github.com/Tongyi-MAI/Z-Image

### Kling AI（Kling 2.6）
- Kling API 官方文档（含模型列表与参数）：https://klingapi.com/docs
  - 页面 meta 里提供的示例图（og:image）：https://klingapi.com/images/examples/banner-image.png

### Suno（Suno v5）
- Suno 官方站点：https://suno.com/
  - 页面 meta 里提供的预览图（og:image）：https://cdn-o.suno.com/meta-preview.jpg
- Suno Help（v5 介绍）：https://help.suno.com/en/articles/8105153

### Nano Banana Pro
- 目前未检索到与 “Nano Banana Pro” 完全同名且可确认的官方技术文档页面（如果你能提供官方链接/品牌归属，我可以把文案改为更严格的官方口径）。

