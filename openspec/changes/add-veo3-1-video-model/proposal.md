# 变更：新增 Veo 3.1 视频模型

## 为什么
Veo 3.1 需要提供新的视频生成入口与计费能力，覆盖文本、首尾帧、参考图三种生成模式，保持与现有 Sora2 配置体验一致。

## 变更内容
- 新增 Veo 3.1 视频模型（veo3_fast / veo3）与三种 generationType 模式切换。
- 新增首尾帧双图上传组件，参考图模式复用多图上传组件。
- 按字段要求映射请求参数（generationType、model、prompt、imageUrls、inputFileUuids、aspectRatio、enableFallback）。
- 配置 Veo 3.1 的积分价格（veo3_fast / veo3）。
- 将 Veo 3.1 加入通用视频模型列表入口。

## 影响
- 受影响规范：新增 `specs/veo3-video-model/spec.md`
- 受影响代码：`src/components/marketing/media-generator/controller.tsx`、`src/components/marketing/media-generator/video/`、`src/components/marketing/media-generator/shared/`、`src/custom/credits/pricing/config.ts`
