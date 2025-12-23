# 项目 上下文

## 目的
多媒体内容生成 SaaS 应用，基于 MkSaaS 付费模板开发。提供 AI 驱动的图片、视频、音频等多媒体内容生成服务，支持多种 AI 模型（OpenAI、Replicate、FAL、Fireworks 等），集成订阅制与积分制付费系统。

## 技术栈

### 核心框架
- **Next.js 15** - App Router、Server Components、Server Actions
- **React 19** - 函数组件 + Hooks
- **TypeScript 5.8** - 严格类型检查

### 数据层
- **PostgreSQL** - 主数据库
- **Drizzle ORM** - 类型安全的 ORM 与迁移管理

### 认证与支付
- **Better Auth** - 认证系统（邮箱/密码 + Google OAuth）
- **Stripe** - 订阅与一次性支付

### AI 集成
- **Vercel AI SDK** - 统一 AI 接口
- **多供应商支持** - OpenAI、Replicate、FAL、Fireworks、DeepSeek、Google、OpenRouter

### UI 与样式
- **Radix UI** - 无样式组件库
- **TailwindCSS 4** - 原子化 CSS
- **Motion** - 动画库

### 状态与数据获取
- **Zustand** - 客户端状态管理
- **TanStack Query** - 服务端状态与缓存
- **nuqs** - URL 查询参数状态

### 其他
- **next-intl** - 国际化（中/英）
- **Fumadocs** - 文档系统
- **Resend** - 邮件服务
- **S3** - 文件存储
- **Biome** - 代码格式化与 Lint

## 项目约定

### 代码风格
- **格式化**：两空格缩进、单引号、ES5 拖尾逗号、强制分号（Biome 配置）
- **文件命名**：模块 kebab-case，hooks 以 `use-` 开头
- **导出方式**：工具函数使用具名导出
- **服务端代码**：包含 `"use server"` 的文件禁止引入客户端 hooks
- **客户端组件**：需要浏览器 API 或 hooks 的组件使用 `"use client"`
- **Tailwind tokens**：统一维护在 `src/styles`，避免魔法值

### 架构模式
- **App Router**：页面在 `src/app/[locale]/` 目录下按功能组织
- **Server Actions**：API 操作集中在 `src/actions/`
- **组件分层**：
  - `src/components/ui/` - 基础 UI 组件（来自模板，**勿修改**）
  - `src/components/marketing/` - 业务组件
  - `src/components/magicui/`、`tailark/` - 模板组件（**勿修改**）
- **Hooks 驱动**：业务逻辑集中在自定义 hooks，组件保持 UI 职责
- **单向数据流**：Hook state → 子组件 props → 事件回调
- **媒体生成架构**：
  - `MediaGeneratorWorkspace` - 三栏布局（菜单/配置/结果）
  - `MediaOnlyGeneratorWorkspace` - 双栏布局（配置/结果）
  - `useMediaGeneratorController` - 共享核心逻辑

### 测试策略
- 目前无自动化测试
- 通过 `pnpm dev`、`pnpm lint` 验证
- 新增测试文件使用 `.test.ts(x)` 或 `.spec.ts(x)` 后缀
- 数据库变动需在 `src/db/migrations` 提供迁移

### Git工作流
- **分支**：`main`（生产）、`dev`（开发）
- **Commit 规范**：Conventional Commit（`feat:`、`fix:`、`chore:`）
- **PR 要求**：摘要、测试记录、UI 截图、配置说明
- **环境变量**：变动需同步 `env.example`

## 领域上下文

### 媒体生成流程
1. 用户选择媒体类型（图片/视频/音频）
2. 选择 AI 模型并配置参数
3. 提交生成任务，获取 taskId
4. 客户端轮询 `/api/media/result/{taskId}` 获取结果
5. 结果展示在 ResultPane，支持下载

### 积分系统
- 免费用户：每月 50 积分
- Pro 用户：每月 1000 积分
- 积分包：按需购买，有过期时间
- 生成消耗：按模型和参数扣减积分

### AI Gateway 对接
- 统一走本地 API 代理：`/api/files/*`、`/api/media/*`
- 环境变量：`AI_GATEWAY_URL`、`AI_GATEWAY_API_KEY`
- 鉴权：路由先校验 `auth.api.getSession`

## 重要约束

### 勿修改（模板代码，便于升级）
- `src/components/ui/*.tsx` - 基础 UI 组件
- `src/components/magicui/*.tsx` - 魔法 UI 组件
- `src/components/tailark/*.tsx` - Tailark 组件
- `src/db/` - 数据库 schema（Biome 已忽略）
- `src/payment/types.ts`、`src/credits/types.ts` - 类型定义
- 落地页及 example 页面的 SEO 属性
- 使用 `export const runtime = 'edge'` 的文件保持 edge 环境
- SSR 渲染页面不可更改，确保 SEO 友好

### 语言偏好
- **代码注释、日志**：中文
- **前台展示内容**（toast、title）：英文
- **文档、提交信息**：中文

## 外部依赖

### AI 服务
- **AI Gateway** - 统一 AI 接口网关（`AI_GATEWAY_URL`）
- **OpenAI** - GPT、DALL-E
- **Replicate** - Stable Diffusion 等开源模型
- **FAL** - 快速推理服务
- **Fireworks** - 高性能模型托管

### 基础服务
- **PostgreSQL** - 数据库（`DATABASE_URL`）
- **Stripe** - 支付处理（`STRIPE_SECRET_KEY`）
- **Resend** - 邮件发送（`RESEND_API_KEY`）
- **S3 兼容存储** - 文件存储（`NEXT_PUBLIC_UPLOAD_BUCKET`）
- **Google OAuth** - 社交登录

### 可选服务
- **Cloudflare** - 部署平台（`opennextjs-cloudflare`）
- **Vercel** - 备选部署
- **PostHog** - 用户行为分析
- **Crisp** - 在线客服
