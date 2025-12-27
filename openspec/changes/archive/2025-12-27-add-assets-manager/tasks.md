## 1. 前置确认
- [ ] 1.1 确认 AI Gateway 是否支持 `mediaTypes=IMAGE` 和 `mediaTypes=AUDIO` 参数
- [ ] 1.2 确认是否需要删除资产功能（如需要，Gateway 需提供 DELETE 接口）

## 2. 公共逻辑提取

### 2.1 提取复用 Hooks
- [ ] 2.1.1 将 `useVirtualFeed` hook 从 `media-generator-result-pane.tsx` 提取到独立文件 `src/hooks/use-virtual-feed.ts`
- [ ] 2.1.2 将 `useHoverPlayback` hook 提取到独立文件 `src/hooks/use-hover-playback.ts`
- [ ] 2.1.3 确保原组件正常工作（回归测试）

## 3. 核心数据层实现

### 3.1 创建数据管理 Hook
- [ ] 3.1.1 创建 `useAssetsManager` hook (`src/hooks/use-assets-manager.ts`)
  - 资产列表状态管理
  - 分页加载逻辑（**复用 `/api/media/feed` 接口**）
  - 媒体类型切换逻辑
  - 错误处理和重试

### 3.2 接口复用说明
> **重要**：本功能不新增任何后台接口，完全复用现有接口：
> - 前端代理：`GET /api/media/feed?mediaTypes=VIDEO|IMAGE|AUDIO&limit=20&cursor=xxx`
> - 后端 Gateway：`GET /api/v1/media/feed/cursor`

## 4. 组件化架构实现

### 4.1 创建组件目录结构
- [ ] 4.1.1 创建 `src/components/assets-manager/` 目录
- [ ] 4.1.2 创建 `src/components/assets-manager/index.ts` 导出入口
- [ ] 4.1.3 创建 `src/components/assets-manager/types.ts` 类型定义

### 4.2 实现核心组件（可复用于弹窗/页面）
- [ ] 4.2.1 实现 `AssetsManager` 核心组件 (`assets-manager.tsx`)
  - 接收 `mode` 属性区分弹窗/页面模式
  - 接收 `onClose` 回调用于弹窗关闭
  - 组合子组件完成完整功能
- [ ] 4.2.2 实现 `AssetsHeader` 标题栏组件 (`assets-header.tsx`)
  - 标题显示
  - 关闭按钮（仅在 `mode='dialog'` 时显示）
- [ ] 4.2.3 实现 `AssetsTabBar` 媒体类型切换组件 (`assets-tab-bar.tsx`)
  - Videos / Images / Audio 三个标签
  - 默认选中 Videos
- [ ] 4.2.4 实现 `AssetsGrid` 网格布局组件 (`assets-grid.tsx`)
  - 响应式网格（2-4列）
  - 集成虚拟滚动
  - 加载更多触发器
- [ ] 4.2.5 实现 `EmptyState` 空状态组件 (`empty-state.tsx`)
  - 根据媒体类型显示不同提示

### 4.3 实现资产卡片组件
- [ ] 4.3.1 实现 `AssetCard` 基础卡片组件 (`asset-card.tsx`)
  - 根据资产类型分发到具体卡片
- [ ] 4.3.2 实现 `VideoCard` 视频卡片 (`video-card.tsx`)
  - 封面图展示
  - 悬停播放预览
  - 模型名、时间信息
- [ ] 4.3.3 实现 `ImageCard` 图片卡片 (`image-card.tsx`)
  - 缩略图展示
  - 懒加载优化
  - 模型名、时间信息
- [ ] 4.3.4 实现 `AudioCard` 音频卡片 (`audio-card.tsx`)
  - 图标/波形图
  - 时长显示
  - 模型名、时间信息

### 4.4 实现弹窗包装组件
- [ ] 4.4.1 实现 `AssetsManagerDialog` 弹窗组件 (`assets-manager-dialog.tsx`)
  - 使用 Radix Dialog 组件
  - 内部使用 `AssetsManager` 核心组件
  - 实现弹窗打开/关闭逻辑

### 4.5 实现状态 UI
- [ ] 4.5.1 实现加载状态 UI（骨架屏或 Spinner）
- [ ] 4.5.2 实现错误状态和重试逻辑

## 5. 集成到 ResultPane

### 5.1 修改 Assets 按钮
- [ ] 5.1.1 修改 `media-generator-result-pane.tsx` 中的 Assets 按钮
  - 添加 `onClick` 事件打开弹窗
  - 引入 `AssetsManagerDialog` 组件
- [ ] 5.1.2 添加弹窗状态管理 (`useState<boolean>`)

## 6. 验证测试

### 6.1 功能测试
- [ ] 6.1.1 手动测试：打开/关闭弹窗
- [ ] 6.1.2 手动测试：切换媒体类型
- [ ] 6.1.3 手动测试：滚动加载更多
- [ ] 6.1.4 手动测试：空状态显示
- [ ] 6.1.5 手动测试：错误状态和重试
- [ ] 6.1.6 手动测试：未登录状态

### 6.2 性能测试
- [ ] 6.2.1 手动测试：虚拟滚动性能（50+ 资产）
- [ ] 6.2.2 手动测试：切换媒体类型时列表重置

## 7. 后续扩展（暂不实施）

### 7.1 独立页面（需要时再实施）
- [ ] 7.1.1 创建 `/dashboard/assets` 页面路由
- [ ] 7.1.2 页面中使用 `<AssetsManager mode="page" />`
- [ ] 7.1.3 添加页面导航入口

## 依赖关系

```
1.x 前置确认 ──────────────────────────────────────┐
                                                    ↓
2.x 公共逻辑提取 ───→ 3.x 数据层实现 ───→ 4.2~4.5 组件实现 ───→ 5.x 集成 ───→ 6.x 测试
                                    ↗
              4.1 目录结构 ─────────┘
```

- 1.x 可与其他任务并行进行
- 2.x 完成后才能开始 4.2~4.5
- 3.x 可与 4.1 并行进行
- 4.2~4.5 依赖 2.x、3.x、4.1 完成
- 5.x 依赖 4.x 完成
- 6.x 依赖 5.x 完成
- 7.x 为后续扩展，按需实施
