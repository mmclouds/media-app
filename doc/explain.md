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
- 标签计算：`mapTaskToAsset()` 内部调用 `buildTags(task, parsed)`：
  - 顺序：`mediaType` → `modelName` → `size` → `status`，中间通过 `filter(Boolean)` 去空，再用 `Array.from(new Set(tags))` 去重。
  - 不再依赖某个固定下标表示模型名，而是通过显式字段 `modelName` 暴露给组件。
- 提示词展示改动：
  - 在 `VideoGeneratorAsset` 中新增 `prompt?: string` 字段，用于保存“任务提示词”。
  - 在 `mapTaskToAsset()` 中，从解析参数得到 `prompt`，既作为 `title` 的优先来源，也单独挂到 `prompt` 字段上。
  - 在 `mapGenerationToAsset()` 中，将实时生成的 `generation.prompt` 同时赋值给 `title` 与 `prompt`，保持一致性。
  - 在 `VideoPreviewCard()` 中新增 `displayPrompt = asset.prompt ?? asset.title`，并用该值替代原来的 `asset.title`，实现“始终展示提示词”。
  - 同时将该段文字样式从 `text-2xl font-semibold` 调整为 `text-sm font-medium leading-relaxed text-white/80`，减小字号、弱化视觉权重，更符合“提示词说明”的定位。
- 可替代实现 vs 当前实现：
  - 替代方案：直接用 `asset.title` 渲染并只改字体，但当 `title` 落回到 `Task xxx` 这种占位值时，就不是真正的提示词。
  - 当前方案：显式建模 `prompt` 字段，页面上始终优先展示真实 prompt，同时保留 `title` 做兜底与其他组件复用，更可维护。

### 🟦 D. 初学者学习重点总结
- 避免用“数组下标”表达业务含义，优先用显式字段（例如 `modelName`、`prompt`）。
- 通过数据映射层（`mapTaskToAsset`/`mapGenerationToAsset`）把后端字段规范化，再交给展示组件渲染。
- 文本展示与业务字段解耦：`title` 可以是人类可读概览，而 `prompt` 保留为真实提示词。
- 利用 Tailwind 调整字号与颜色，让视觉层级更清晰（如用 `text-sm` + `text-white/80` 表示次要信息）。

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
