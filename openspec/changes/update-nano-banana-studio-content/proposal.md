# 变更：扩展 Nano Banana Studio 内页内容与 SEO 叙述

## 为什么
当前 Nano Banana Studio 页面信息量较少，难以覆盖模型能力、使用场景与搜索意图。需要补充结构化内容以提升 SEO 友好度与营销转化，同时与站点现有多语言机制保持一致。

## 变更内容
- 增加面向搜索与用户理解的内容区块（模型概览、能力亮点、适用场景、工作流、FAQ、CTA），强化营销转化导向。
- 保持页面为内页，不触及落地页与示例页的 SEO 约束。
- 文案与标题通过现有多语言机制提供（参考落地页国际化实现），避免硬编码。
- 保留 `MediaGeneratorWorkspace` 作为核心交互区域。

## 影响
- 受影响规范：`nano-banana-model`
- 受影响代码：`src/app/[locale]/(marketing)/(pages)/media-studio/nano-banana/page.tsx`
