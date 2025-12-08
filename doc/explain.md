---

## 2. explain.md（讲解内容）必须包含以下部分

### 🟦 A. React 核心概念讲解
- 组件：`SingleImageUploadField` 作为可复用的单图上传控件，通过 props 注入 bucket、tenantId 等参数实现通用化。
- State：使用 `useState` 管理上传中状态、错误提示与预览地址，保证 UI 与数据同步。
- Refs：`useRef` 保存 `<input type="file">` 引用，便于在上传后重置输入框。
- Effects：`useEffect` 清理 blob 预览并在外部 value 变化时重算预览链接，防止内存泄漏。
- Memo：`useMemo` 缓存租户 ID，避免每次渲染重复读取环境变量。
- 这些 Hook 共同确保组件在用户交互、异步上传、预览展示之间保持可预测渲染。

### 🟦 B. Next.js 核心概念讲解（若本次代码使用 Next.js）
- Client Components：`'use client'` 声明使组件可直接操作浏览器 API（`File`、`URL.createObjectURL`、`fetch`）。
- App Router：组件位于 `src/components`，通过路由页面组合，保持与 App Router 的服务器/客户端分层。
- 数据获取策略：上传/下载均走前端 `fetch` 调用后端 `/api` 路由，属于客户端请求，不参与 SSR/SSG。
- 文件结构影响：公共文件工具放在 `src/lib/file-transfer.ts`，路由内组件可共享上传/下载逻辑，减少重复封装。

### 🟦 C. 代码逻辑拆解与架构说明
- 文件结构：`src/lib/file-transfer.ts` 封装上传与下载 URL 构造；`single-image-upload-field.tsx` 调用封装并提供 UI；`src/app/api/files/*` 作为后端代理与网关交互。
- 上传逻辑：前端只调用 `/api/files/upload`，该路由会校验登录、补上 `X-API-Key` 并将当前 `userId` 作为 query 传给网关 `/api/files/upload`，`FormData` 自动补齐 bucket 默认值，成功后回传 uuid 等元数据并生成下载 URL。
- 下载对接：组件可接受 uuid 或现成 URL，若是 uuid 会固定使用环境变量 `NEXT_PUBLIC_TENANT_ID`（默认 `'0'`）构造 `/api/files/download/{uuid}?tenantId=...`；后端路由校验登录获取 `userId` 并在转发到网关下载接口时追加 `userId` query，保持同源与权限隔离。
- 状态与体验：上传中展示临时 blob 预览，结束后切换为真实下载链接；错误时回退原值并提示。
- 可复用性：`onUploaded` 回调传出 uuid、bucket 等元数据，便于其他业务绑定；工具函数独立可在其他组件直接调用。
- 环境配置：在 `env.example` 新增 `NEXT_PUBLIC_TENANT_ID`、`NEXT_PUBLIC_UPLOAD_BUCKET`，统一页面默认值，避免逐页传参。
- 网关对接准则：新增到 `AGENTS.md`，要求统一经本地 API 代理、校验会话后附 `X-API-Key` 转发网关，下载接口免 Key，路径和参数规范化并处理错误。

### 🟦 D. 初学者学习重点总结
- 如何用 `FormData` + `fetch` 实现 multipart 上传，并在错误时解析 JSON 提示。
- 使用 `URL.createObjectURL` 生成本地预览并在 `useEffect` 清理，避免内存泄漏。
- 结合租户 ID（从环境读取，默认 `'0'`）构造下载链接：`/api/files/download/{uuid}?tenantId=...`，路由再携带 `userId` 转发网关。
- 利用 props 将 bucket 参数化，默认从环境读取 `'0-image'`，租户通过环境变量统一控制，组件可在不同场景复用。
- 通过状态控制（上传中、错误）提升交互体验，同时保持 UI 文案英文、日志中文的风格约定。

---
