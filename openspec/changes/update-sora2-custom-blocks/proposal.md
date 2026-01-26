# 变更：Sora2 落地页使用 custom-blocks 组件

## 为什么
当前 Sora2 落地页各模块为页面内布局，复用性低。需要将除 studio 模块外的内容改为引用 `src/components/custom-blocks/` 组件，并直接在页面中提供中英文文案。

## 变更内容
- 将 `src/app/[locale]/(marketing)/(pages)/media-studio/sora2/page.tsx` 的各模块（除 studio 区域）改为使用 custom-blocks 组件。
- 在页面文件内内联中英文文案（`zh` 使用中文）。
- 允许必要时调整 `custom-blocks/hero` 以支持现有 hero 信息结构。
- 保持 SEO 元数据与 studio 模块不变。

## 影响
- 受影响规范：新增 `sora2-page`
- 受影响代码：`src/app/[locale]/(marketing)/(pages)/media-studio/sora2/page.tsx`，`src/components/custom-blocks/hero/hero.tsx`（如需）
