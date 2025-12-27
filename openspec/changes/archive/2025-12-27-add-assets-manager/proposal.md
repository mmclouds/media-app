# 变更：添加资产管理功能

## 为什么
用户需要集中查看和管理已生成的所有多媒体资产（视频、图片、音频），当前的 Assets 按钮仅是占位符，没有实际功能。资产管理功能可以提升用户体验，方便用户浏览历史生成内容。

## 变更内容
- 实现资产管理功能，采用**高度组件化设计**，支持弹窗和独立页面两种展示形式
- **复用现有 `/api/media/feed` 接口**（游标分页），无需新增后台接口
- 核心功能：
  - 默认展示视频数据，可切换图片/音频
  - 虚拟滚动优化大量数据展示性能
  - 游标分页加载（复用 feed/cursor 接口）
  - 媒体预览（图片懒加载、视频悬停播放）
  - 删除资产功能（可选，需 Gateway 支持）

## 设计原则

### 接口复用
- **不新增 API 接口**，完全复用 `GET /api/media/feed` 接口
- 通过 `mediaTypes` 参数切换：`VIDEO` | `IMAGE` | `AUDIO`
- 后端 AI Gateway 已支持该接口：`/api/v1/media/feed/cursor`

### 组件化架构
- 核心展示逻辑封装为**独立组件** `AssetsManager`，不依赖弹窗容器
- 弹窗形式 `AssetsManagerDialog` 仅作为包装层
- 后续可直接将 `AssetsManager` 用于独立页面 `/assets` 或 `/dashboard/assets`

## 影响
- 受影响规范：新增 `assets-manager` 功能规范
- 受影响代码：
  - `src/components/marketing/media-generator/media-generator-result-pane.tsx` (修改：添加弹窗触发)
  - `src/components/assets-manager/` (新增：组件目录)
    - `assets-manager.tsx` - 核心展示组件（可复用于弹窗/页面）
    - `assets-manager-dialog.tsx` - 弹窗包装组件
    - `assets-grid.tsx` - 网格布局组件
    - `asset-card.tsx` - 资产卡片组件
  - `src/hooks/use-assets-manager.ts` (新增：数据管理 hook)
- **无需新增 API**：复用现有 `/api/media/feed` 接口
