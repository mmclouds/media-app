---

## 2. explain.md（讲解内容）必须包含以下部分

### 🟦 A. React 核心概念讲解
- 使用的核心能力：函数组件拆分（`MediaGeneratorResultPane` 列表容器 + `VideoPreviewCard` 卡片），通过 props 传入 `asset`/`loading`/`activeGeneration`，在卡片中根据 `asset` 的派生数据渲染 UI。
- 使用的 Hooks：`useState` 管理 Feed 与 UI 状态，`useEffect`/`useLayoutEffect` 处理副作用（请求、滚动监听、测量高度），`useMemo` 进行派生数据缓存（fallback feed、live asset），`useCallback` 稳定函数引用（拉取、虚拟滚动更新），`useRef` 保存跨渲染可变值（DOM、游标、请求锁）。
- 为什么需要这些 Hooks：列表滚动与分页属于副作用；虚拟滚动需要依赖高度缓存与二分查找；`useRef` 避免因状态变更导致重复请求；`useMemo`/`useCallback` 降低不必要的重复计算与重渲染。
- 渲染机制关联：当 `remoteFeed` 或 `activeGeneration` 更新时触发重渲染；卡片内部通过 `modelLabel`、`statusLabel` 等“派生值”决定展示内容，不需要额外 state。
- 最佳实践体现：把“展示字段”从 `tags` 的位置索引中解耦出来（新增 `modelName` 字段），避免 `asset.tags[n]` 因过滤空值/顺序变化而导致 UI 显示错误。

### 🟦 B. Next.js 核心概念讲解（若本次代码使用 Next.js）
- Client Components：文件顶部 `\"use client\"`，允许使用 `useEffect`、DOM 事件、`ResizeObserver` 等浏览器能力。
- 数据获取策略：客户端 `fetch('/api/media/feed')` 通过内部 API 拉取；设置 `cache: 'no-store'` 确保每次拿到最新任务列表。
- 目录组织：组件在 `src/components/marketing/...`，可被 App Router 下的页面/布局复用；数据映射与展示逻辑内聚在同一模块，便于迭代 UI。

### 🟦 C. 代码逻辑拆解与架构说明
- 当前 tags 的计算来源：`mapTaskToAsset()` 内部调用 `buildTags(task, parsed)`。
- `buildTags()` 的顺序与含义（并会 `filter(Boolean)` 去空）：  
  1) `formatLabel(task.mediaType ?? 'Video')`（媒体类型）  
  2) `task.modelName`（模型名称）  
  3) `parsed?.size`（尺寸/分辨率配置）  
  4) `formatLabel(task.status)`（状态）  
  最后用 `Array.from(new Set(tags))` 去重并保持相对顺序。
- 为什么 `asset.tags[2]` 不适合显示模型名：在上述顺序中，模型名理论上在索引 1；并且 `filter(Boolean)` 会导致索引在缺字段时整体左移，使用下标会让 UI 变得不稳定。
- 本次改动（解决“在某个位置展示模型名称”）：  
  - 在 `VideoGeneratorAsset` 增加可选字段 `modelName?: string`。  
  - 在 `mapTaskToAsset()` 里优先从 `task.modelName` 获取；如果没有，再从解析参数的 `parsed.model` 兜底。  
  - 在 `VideoPreviewCard()` 里不再渲染 `asset.tags[2]`，改为渲染 `modelLabel = asset.modelName ?? asset.tags[1] ?? '—'`，从而稳定显示模型名称。
- 可替代实现 vs 当前实现：也可以直接把 `asset.tags[2]` 改为 `asset.tags[1]`；但新增 `modelName` 更稳健（不受 tags 顺序/缺字段影响），也更符合“展示字段显式建模”的实践。

### 🟦 D. 初学者学习重点总结
- 避免用“数组下标”表达业务含义，优先用显式字段（例如 `modelName`）。
- 通过数据映射层（`mapTaskToAsset`）把后端字段规范化，前端组件只关心展示模型。
- `filter(Boolean)`/去重等操作会影响数组索引，使用时要格外小心。

---

## 3. AI 工作方式要求
- 用户只要请求“写代码”“生成组件”等内容，你自动进入教学模式
- 主窗口只放代码，讲解全部进入 `explain.md`
- 采用现代 React（函数组件 + Hooks）
- Next.js 默认使用 App Router（13+）
- 自动补全用户未明确但必要的工程化内容
- 若有更佳写法，请主动说明并写在 `explain.md`

---

## 4. 输出格式示例（你必须完全遵守）

### 主窗口（代码）示例：
````md
```tsx
// 这里是代码（仅代码）
```
````
