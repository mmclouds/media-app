---

## 2. explain.md（讲解内容）必须包含以下部分

### 🟦 A. React 核心概念讲解
- 组件与状态：`useMediaGeneratorController` 通过 `useState` 管理模型类型、配置、历史记录与当前任务，保证生成按钮与 UI 状态同步。
- 记忆与派生：`useMemo` 缓存可用模型列表，避免每次渲染重新筛选；`useCallback` 包裹事件处理（切换媒体类型、生成任务），减少下层组件重复渲染。
- 副作用：`useEffect` 监听可用模型或任务状态，自动重置选中模型、轮询任务进度并清理定时器，体现渲染与副作用分离的最佳实践。
- 组件渲染机制：在按钮点击时先更新 `isSubmitting` 和历史记录，再发起异步请求，保证 UI 立即反馈且不会因为未完成的异步阻塞渲染。
- 最佳实践体现：参数计算抽到 `buildSoraRequestBody`，避免在 JSX 内内联复杂逻辑；统一去空格校验 `prompt`，防止空请求。

### 🟦 B. Next.js 核心概念讲解（若本次代码使用 Next.js）
- Server / Client 划分：生成控制器与按钮声明 `'use client'` 以便使用浏览器事件与状态；`src/app/api/media/generate/route.ts` 为 Server Route，负责鉴权与网关转发。
- `"use client"` 作用：允许使用 `useState`、`useEffect` 等 Hook 以及直接调用 `fetch` 发起客户端请求。
- App Router 机制：API 路由位于 `app/api`，通过 `NextRequest` / `NextResponse` 处理并返回 JSON，前端调用 `/api/media/generate` 保持同源。
- 数据获取策略：客户端请求命中自建 API，再由 API 以 `no-store` 转发到网关并返回任务 ID，避免 SSR 缓存；轮询任务接口同样禁用缓存。
- 文件结构影响：控制器集中在 `src/components/marketing/media-generator/controller.tsx` 处理请求与状态，API 代理位于 `src/app/api/media/generate/route.ts`，清晰划分前后端职责。

### 🟦 C. 代码逻辑拆解与架构说明
- 文件结构：`controller.tsx` 负责 UI 配置、参数组装与提交；`route.ts` 负责鉴权、参数校验并转发到网关。
- 参数组装：`buildSoraRequestBody` 根据 `inputMode`、`modelVersion`、`seconds`、`size` 计算 `model`（四种组合）、`aspect_ratio`（9:16→portrait，其余→landscape）、`n_frames`（秒数转字符串）、`size`（质量，默认 high）、`remove_watermark` 等，并在图转视频时附上上传后的图片 URL。
- 请求发送：前端仍调用 `/api/media/generate?mediaType=VIDEO&modelName=sora-2`，但 body 仅包含文档要求的 `model` 与 `input`，符合最新接口示例。
- 服务端代理：API 路由支持新旧两种形态，优先读取 `input.prompt` 校验必填，存在结构化 `input` 时不再补充默认 `seconds/size`，直接按客户端提供的 `model/input` 透传，并附带 `userId`、`X-API-Key`。
- 隐含最佳实践：默认配置与 UI 选项对齐（默认 10s、sora2、16:9、text 模式、高质量），避免展示与实际请求不一致；错误与日志使用中文，前台文案保持英文。

### 🟦 D. 初学者学习重点总结
- 如何用 `useCallback`/`useMemo` 管理生成流程，避免重复渲染。
- 参数映射技巧：UI 选择项（如 9:16）转成接口需要的 `aspect_ratio`（portrait），秒数转 `n_frames`。
- 前后端解耦：前端专注于组装 body，后端 API 校验 `prompt` 并统一添加鉴权头转发网关。
- 接口兼容性：同一 API 同时兼容平铺参数与结构化 `input`，便于逐步切换到新协议。
- 默认配置与 UI 同步的重要性，避免「看起来 10s 实际发了 4s」的潜在坑。

---
