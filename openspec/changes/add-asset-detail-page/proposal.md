# 变更：资产详情弹框

## 为什么
资产详情已实现为独立页面，但页面跳转会打断用户在资产列表中的浏览上下文，需要改为弹框形式以便快速查看与返回。

## 变更内容
- 资产详情改为弹框展示，点击资产卡片详情入口后在资产管理弹窗内打开详情弹框，不再跳转详情页面。
- 详情弹框支持图片、视频、音频的统一详情展示，展示可用数据并按 Tab 分组，缺失字段不显示。
- 复用现有 `/api/media/result/[taskId]` 查询详情数据，不新增后端网关接口。

## 影响
- 受影响规范：`openspec/specs/assets-manager/spec.md`
- 受影响代码：`src/components/assets-manager/*`、`src/hooks/use-assets-manager.ts`
