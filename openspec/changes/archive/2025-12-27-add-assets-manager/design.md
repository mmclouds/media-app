## 上下文

用户在 `MediaGeneratorResultPane` 组件中已有一个 Assets 按钮，当前无功能。需要实现一个资产管理功能，展示用户所有的多媒体生成历史。

**核心设计原则：**
- **接口复用**：完全复用现有 `/api/media/feed` 接口，不新增后台 API
- **组件化设计**：核心逻辑与容器分离，便于后续从弹窗迁移到独立页面

**约束条件：**
- 不修改模板基础组件（`src/components/ui/*`）
- 复用现有 `/api/media/feed` 接口及 AI Gateway 接口
- 保持与现有 `MediaFeedItem` 类型兼容
- 大量数据需要性能优化

**利益相关者：**
- 用户：需要浏览和管理历史生成内容
- AI Gateway：提供后端数据服务（已有接口）

## 目标 / 非目标

**目标：**
- 实现资产管理组件，支持按媒体类型（视频/图片/音频）筛选
- 虚拟滚动优化，支持展示大量数据
- 游标分页加载更多数据（复用 feed/cursor 接口）
- 媒体预览（图片懒加载、视频悬停播放）
- **组件化设计**，支持弹窗和独立页面两种使用方式

**非目标：**
- 资产编辑功能（裁剪、滤镜等）
- 批量操作
- 资产分享功能
- 资产标签/收藏管理（本期暂不实现）
- 新增后台 API 接口

## 决策

### 决策 1：复用现有 `/api/media/feed` 接口
**原因**：现有接口已完整支持所需功能：
- 支持 `mediaTypes` 参数：`VIDEO` | `IMAGE` | `AUDIO`
- 支持游标分页：`cursor` + `limit`
- 支持排序：`sort=desc|asc`
- 后端 AI Gateway 已实现：`/api/v1/media/feed/cursor`

**好处**：
- 零后端开发成本
- 接口稳定，经过验证
- 统一数据格式

### 决策 2：核心组件与容器分离
**原因**：用户明确表示后续需要将资产管理设置为独立页面，因此设计时需要：
- `AssetsManager` 作为核心展示组件，不依赖任何容器
- `AssetsManagerDialog` 作为弹窗包装，仅负责弹窗控制
- 后续可直接在页面中使用 `<AssetsManager />`

### 决策 3：使用 Dialog 弹窗作为初期展示形式
**原因**：保持用户在生成工作区的上下文，避免页面跳转打断工作流。

### 决策 4：复用现有虚拟滚动逻辑
**原因**：`media-generator-result-pane.tsx` 已有 `useVirtualFeed` 实现，可以提取复用，减少代码重复。

### 决策 5：采用网格布局展示资产
**原因**：网格布局更适合图片/视频缩略图展示，信息密度更高。

**考虑的替代方案：**
- 新建独立 `/api/media/assets` 接口：增加维护成本，功能与 feed 接口重复 ❌
- 使用 TanStack Virtual：引入新依赖，现有自定义实现已满足需求 ❌

## 架构设计

### 组件化结构

```
src/components/assets-manager/
├── index.ts                    # 导出入口
├── assets-manager.tsx          # 核心组件（可复用于弹窗/页面）
├── assets-manager-dialog.tsx   # 弹窗包装组件
├── assets-header.tsx           # 标题栏（关闭按钮仅在弹窗模式显示）
├── assets-tab-bar.tsx          # 媒体类型切换标签
├── assets-grid.tsx             # 虚拟滚动网格
├── asset-card.tsx              # 单个资产卡片
│   ├── video-card.tsx          # 视频卡片（悬停播放）
│   ├── image-card.tsx          # 图片卡片（懒加载）
│   └── audio-card.tsx          # 音频卡片
├── empty-state.tsx             # 空状态提示
└── types.ts                    # 类型定义
```

### 组件层次

```
页面使用（后续）:
─────────────────────────────────
Page (/dashboard/assets)
└── AssetsManager (核心组件)
    ├── AssetsHeader (无关闭按钮)
    ├── AssetsTabBar
    ├── AssetsGrid
    │   └── AssetCard (多个)
    └── EmptyState (条件显示)

弹窗使用（当前）:
─────────────────────────────────
AssetsManagerDialog (弹窗容器)
└── AssetsManager (核心组件)
    ├── AssetsHeader (有关闭按钮)
    ├── AssetsTabBar
    ├── AssetsGrid
    │   └── AssetCard (多个)
    └── EmptyState (条件显示)
```

### 组件 Props 设计

```typescript
// 核心组件 - 可复用于弹窗或页面
interface AssetsManagerProps {
  className?: string;
  // 容器模式：dialog（弹窗）或 page（页面）
  mode?: 'dialog' | 'page';
  // 弹窗模式时的关闭回调
  onClose?: () => void;
  // 默认选中的媒体类型
  defaultMediaType?: 'VIDEO' | 'IMAGE' | 'AUDIO';
}

// 弹窗包装组件
interface AssetsManagerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
}
```

### 数据流

```
useAssetsManager hook (数据管理)
├── state: mediaType ('VIDEO' | 'IMAGE' | 'AUDIO')
├── state: assets (MediaFeedItem[])
├── state: cursor (string | null)
├── state: hasMore (boolean)
├── state: isLoading (boolean)
├── state: error (Error | null)
├── action: setMediaType (重置并加载)
├── action: loadMore (加载更多)
└── action: refresh (刷新列表)

数据获取:
GET /api/media/feed?mediaTypes=VIDEO&limit=20&cursor=xxx
    ↓
AI Gateway: GET /api/v1/media/feed/cursor?userId=xxx&mediaTypes=VIDEO&limit=20&cursor=xxx
    ↓
Response: { content: MediaFeedItem[], hasMore: boolean, nextCursor: string | null }
```

### API 设计（复用现有接口）

#### 前端代理接口（已存在）

```
GET /api/media/feed
  ?mediaTypes=VIDEO|IMAGE|AUDIO
  &limit=20
  &cursor=<base64>
  &sort=desc

响应格式:
{
  "content": MediaFeedItem[],
  "hasMore": boolean,
  "nextCursor": string | null
}
```

#### AI Gateway 后端接口（已存在）

```
GET /api/v1/media/feed/cursor
  ?userId=<userId>
  &mediaTypes=VIDEO|IMAGE|AUDIO
  &limit=20
  &cursor=<base64>
  &sort=desc
```

**已支持的 mediaTypes 值：**
- `VIDEO` - 视频资产
- `IMAGE` - 图片资产（需确认 Gateway 支持）
- `AUDIO` - 音频资产（需确认 Gateway 支持）

### 性能优化策略

1. **虚拟滚动**
   - 仅渲染可视区域 + overscan 缓冲区的卡片
   - 复用 `useVirtualFeed` 逻辑，适配网格布局

2. **图片懒加载**
   - 使用 `loading="lazy"` 原生懒加载
   - 缩略图使用小尺寸预览图（如有）

3. **视频预览优化**
   - 默认显示封面图，悬停时才加载视频
   - 视频 `preload="none"` 避免预加载

4. **请求优化**
   - 切换媒体类型时重置列表并加载
   - 滚动触底时加载更多（防抖）
   - 请求中状态防止重复请求

## 后续扩展：独立页面

当需要将资产管理设置为独立页面时，只需：

```tsx
// src/app/[locale]/(dashboard)/assets/page.tsx
import { AssetsManager } from '@/components/assets-manager';

export default function AssetsPage() {
  return (
    <div className="container py-6">
      <AssetsManager mode="page" />
    </div>
  );
}
```

无需修改核心组件逻辑，仅需：
1. 创建页面路由
2. 引入 `AssetsManager` 组件
3. 设置 `mode="page"` 隐藏关闭按钮

## 风险 / 权衡

| 风险 | 缓解措施 |
|------|---------|
| AI Gateway 不支持 IMAGE/AUDIO 类型 | 先确认 Gateway 支持情况，必要时仅展示 VIDEO |
| 大量图片导致内存占用高 | 虚拟滚动 + 图片懒加载 |
| 弹窗内容过多影响体验 | 限制单次加载数量，分页加载 |

## 迁移计划

1. 实现组件化架构的前端组件
2. 确认 AI Gateway 支持 IMAGE/AUDIO mediaTypes
3. 集成测试
4. 上线弹窗版本
5. （后续）根据需要添加独立页面路由

## 待决问题

1. AI Gateway 是否已支持 `mediaTypes=IMAGE` 和 `mediaTypes=AUDIO`？
2. 是否需要支持删除资产功能？如需要，Gateway 需提供 DELETE 接口
3. 是否需要支持资产收藏/标记功能？（建议后期迭代）
