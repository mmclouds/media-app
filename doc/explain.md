
---

## 2. explain.md（讲解内容）必须包含以下部分

### 🟦 A. React 核心概念讲解
- Workspace/ConfigPanel/ResultPane/菜单仍是函数组件，通过 props 保持单向数据流；新增 Veo3 页面复用现有组件而非重写逻辑。
- Hook：`useState` 管理媒体类型、模型配置、任务状态；`useEffect` 轮询任务并根据模型列表初始化选中项；`useMemo` 派生可用模型列表；`useCallback` 稳定触发生成的回调，避免子组件重复渲染。
- 新增 `preferredModelId` 支持：`useEffect` 在模型变更时优先选中匹配的模型（Veo3），锁定默认选择同时保持受控状态。
- 渲染机制：当 `preferredModelId` 或模型列表变化时仅更新选中的模型，不影响其他 UI；锁定的媒体类型防止菜单切换导致不必要重渲染。
- 最佳实践：通过 hook 参数化（锁定媒体类型 + 首选模型）来复用 UI 组合，避免为特定模型创建重复状态管理。

### 🟦 B. Next.js 核心概念讲解（若本次代码使用 Next.js）
- 新增的 `media-studio/veo3/page.tsx` 是 Server Component，负责拉取多语言元数据并输出 SSR 首屏；内部挂载 `'use client'` 的 Workspace 以启用交互。
- `generateMetadata` 运行在服务端，结合 `constructMetadata` 生成 SEO 友好的 title/description，路径固定为 `/media-studio/veo3`。
- App Router 路由：`src/app/[locale]/(marketing)/(pages)/media-studio/veo3/page.tsx` 自动映射到 `/[locale]/media-studio/veo3`，与现有 `/media-studio` 并存。
- 数据获取策略：页面本身无数据请求，客户端组件通过 fetch `/api/media/generate` 与 `/api/media/result/{taskId}`；SSR 仅处理元数据。
- 客户端组件声明 `"use client"`（在 Workspace 内），保证轮询与受控输入在浏览器执行，SSR 负责初始 HTML，水合后接管事件。

### 🟦 C. 代码逻辑拆解与架构说明
- 文件结构：新增页面 `media-studio/veo3/page.tsx`；`media-only-generator-workspace.tsx` 增加 `preferredModelId` 入参；`controller.tsx` 支持首选模型逻辑。
- 数据流：Server Page → 渲染 `MediaOnlyGeneratorWorkspace`（props: className + preferredModelId）→ hook `useMediaGeneratorController` 输出受控状态 → ConfigPanel/ResultPane 消费同一份模型/Prompt/任务状态 → fetch API 触发生成并轮询。
- 受控选择：`useEffect` 判断当前选中的模型是否存在；若没有则优先使用 `preferredModelId`，否则回退到列表首项，保证锁定 Veo3 的体验。
- 可替代实现：也可在页面层自写状态与表单；当前方案重用通用 Hook + Workspace，减少重复代码，并通过参数化实现定制。
- 隐含最佳实践：通过小型配置（锁定媒体类型、首选模型）扩展产品化场景，保持核心逻辑集中；Server/Page 与 Client/交互解耦，利于测试和复用。

### 🟦 D. 初学者学习重点总结
- 在 Hook 中添加可选参数（如首选模型）可复用逻辑又满足新需求。
- `useEffect` 可用于根据依赖初始化/纠正受控状态，确保下游组件总是有合法值。
- App Router 路由与目录结构一一对应，新增子目录即可创建新页面。
- Server Component 负责 SEO 元数据，客户端组件处理交互与网络请求。
- 通过 props 组合通用组件（Workspace）即可快速定制不同模型场景。

---
