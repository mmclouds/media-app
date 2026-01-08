# 变更：资产详情页面

## 为什么
资产管理目前只有列表弹窗，缺少单独的详情页面，用户无法查看完整的生成细节与媒体信息。

## 变更内容
- 新增资产详情页面路由，支持图片、视频、音频的统一详情展示。
- 资产列表卡片提供进入详情页面的入口（不修改现有弹窗样式）。
- 详情页保持 SSR/SEO，展示可用数据并按 Tab 分组，缺失字段不显示。
- 复用现有 `/api/media/result/[taskId]` 查询详情数据，不新增后端网关接口。

## 影响
- 受影响规范：`openspec/specs/assets-manager/spec.md`
- 受影响代码：`src/app/[locale]/(marketing)/(pages)`、`src/components/assets-manager/*`、`src/hooks/use-assets-manager.ts`
