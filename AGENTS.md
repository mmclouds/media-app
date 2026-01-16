<!-- OPENSPEC:START -->
# OpenSpec 使用说明

这些说明适用于在此项目中工作的AI助手。

## 语言偏好设置

**默认使用中文**：除非明确说明使用英文，否则所有输出都应使用中文，包括：
- 文档内容
- 代码注释
- 提交信息
- 规范说明

## 工作流程

当请求满足以下条件时，始终打开`@/openspec/AGENTS.md`：
- 提及规划或提案（如提案、规范、变更、计划等词语）
- 引入新功能、重大变更、架构变更或大型性能/安全工作时
- 听起来不明确，需要在编码前了解权威规范时

使用`@/openspec/AGENTS.md`了解：
- 如何创建和应用变更提案
- 规范格式和约定
- 项目结构和指南

保持此托管块，以便'openspec-cn update'可以刷新说明。

<!-- OPENSPEC:END -->

# 仓库指南

## 项目结构与模块组织
- `src/app`：路由与服务器操作集中于此，面向 locale 的页面通过 `[locale]` 目录组织。
- `src/components`：复用 UI（如 `ui/`、`magicui/`、`tailark/`）及各业务域组件。
- `src/lib` / `src/ai`：分别放置共享逻辑与 AI 工作流。
- `src/db`：维护 Drizzle 的 schema 与迁移。
- `src/mail` 与 `src/analytics`：前者存放事务邮件，后者集成分析服务。
- `public/`、`scripts/`、`content/`：依序用于静态资源、运维脚本、营销与文档内容。

## 构建、测试与开发命令
- `pnpm install` 安装依赖，`pnpm dev` 启动 Next.js 本地开发。
- `pnpm build` 产出优化构建，`pnpm start` 在生产模式运行。
- `pnpm lint` / `pnpm format` 分别触发 Biome 检查与格式化。
- Drizzle 工具链：`pnpm db:generate` 生成 SQL，`pnpm db:migrate` 应用本地变更，`pnpm db:push` 同步远端。
- 辅助脚本：`pnpm email` 预览邮件，`pnpm list-users`、`pnpm fix-payments` 等执行日常维护。

## 编码风格与命名约定
- Biome（`biome.json`）要求：两空格缩进、单引号、ES5 拖尾逗号、强制分号。
- 文件/函数命名：模块为 kebab-case，hooks 以 `use-` 开头，工具函数使用具名导出。
- Tailwind tokens 统一维护在 `src/styles`，避免魔法值散落。
- 仅服务器可用的逻辑放在包含 `"use server"` 的文件中，禁止引入客户端 hooks。

## 测试指南
- 目前无自动化测试，需通过 `pnpm dev`、lint 以及围绕认证/计费/AI 的人工 QA。
- 新增测试运行器时，将 `.test.ts(x)` 或 `.spec.ts(x)` 与功能共存，并在 PR 中记录命令与结果。
- 涉及数据改动需在 `src/db/migrations` 提供对应 fixtures。

## Commit 与 Pull Request 指南
- 遵循 Conventional Commit（如 `feat:`、`fix:`、`chore:`），确保范围清晰并在正文引用 issue ID。
- 环境变量变动需同步 `env.example`。
- PR 必须包含摘要、测试记录、UI 变更截图及配置/文档说明；全部检查通过后再请求评审。
- 若存在破坏性改动需提前说明。

## 配置与密钥
- 运行命令前先将 `env.example` 复制为 `.env`。
- 生产凭据托管于 Vercel/Cloudflare，严禁入库。
- `opennextjs-cloudflare`、`wrangler` 等使用范围受限的 API Key。
- `src/ai` 中的服务商密钥需定期轮换，合并前清理调试日志。

## AI Gateway 对接准则  
- 统一走本地 API 代理：客户端/服务端都调用 `/api/files/*`、`/api/media/*` 等内部路由，再由路由转发至网关，避免跨域与暴露密钥。
- 环境变量：必须配置 `AI_GATEWAY_URL`、`AI_GATEWAY_API_KEY`，存储相关默认值使用 `NEXT_PUBLIC_TENANT_ID`（默认 `0`）、`NEXT_PUBLIC_UPLOAD_BUCKET`（默认 `0-image`）。
- 鉴权：参考 `src/app/api/media/feed/route.ts`、`src/app/api/files/upload/route.ts`，进入路由先校验 `auth.api.getSession`，未登录返回 401。
- 请求头：转发受保护接口时附带 `X-API-Key`，上传接口还透传 `authorization`、`cookie`；公网下载接口不带 `X-API-Key`。
- URL 规范：转发前用 `AI_GATEWAY_URL` 去尾斜杠，再拼具体路径与查询参数（如 `mediaType`、`userId`、`tenantId`）；上传/下载均将当前 `userId` 追加在 query。
- 表单与数据：上传用 `FormData`，后端代理补齐缺失的 bucket，其他 JSON 请求遵守 `Content-Type: application/json`。
- 错误处理：解析网关返回的 JSON `message`/`success` 字段，失败时返回 5xx/502，并记录 `console.error`。

# 个人偏好

## 重要（以下内容，不要改动）
- 在用到 `export const runtime = 'edge';` 的地方保持 edge 环境。
- SSR 渲染页面不可更改，确保 SEO 友好。
- 不要修改落地页及 example 页面相关的 SEO 属性。
- 不要改动通用的组件代码，便于后期升级。
- 使用skills:ui-ux-pro-max去设计修改页面。 
## codex 的使用规则
- 回答一律使用中文。
- 需要前台展示的内容统一使用英文（如 toast/title），代码注释与日志使用中文。



# 项目介绍
本项目主要实现的是多媒体内容生成,引用最先进的大模型能力，支持图片、视频、音频生成。具体架构和组件设计参考文件 `doc/项目结构拆分.md`。网站域名是：vlook.ai.

# 框架特性

## 创建新页面-基于组件的页面
1. 在 `src/app/[locale]/(marketing)/(pages)` 新建目录（如 `pricing`）。
2. 添加 `page.tsx` 并导出自定义页面组件。
3. 示例：

```tsx
import { Button } from '@/components/ui/button';
import { constructMetadata } from '@/lib/metadata';
import type { NextPageProps } from '@/types/next-page-props';
import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata | undefined> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  const pt = await getTranslations({ locale, namespace: 'PricingPage' });
  return constructMetadata({
    title: pt('title') + ' | ' + t('title'),
    description: pt('description'),
    locale,
    pathname: '/pricing',
  });
}

export default async function PricingPage(props: NextPageProps) {
  const params = await props.params;
  const locale = params?.locale as Locale;
  const t = await getTranslations('PricingPage');
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-4">
        <h1 className="text-center text-3xl font-bold tracking-tight">
          {t('title')}
        </h1>
        <p className="text-center text-lg text-muted-foreground">
          {t('subtitle')}
        </p>
      </div>
      {/* Your custom pricing components */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Pricing cards go here */}
      </div>
      <div className="text-center mt-12">
        <Button size="lg">{t('cta')}</Button>
      </div>
    </div>
  );
}
```

---

# 技术栈最佳实践

> 以下最佳实践整合自 `.cursor/rules/` 目录下的规则文件。

## Next.js 最佳实践

> 参考：[`.cursor/rules/nextjs-best-practices.mdc`](.cursor/rules/nextjs-best-practices.mdc)

- 使用 Next.js 15 的 Server Actions 提升性能和安全性
- 实现 `error.tsx` 和 `not-found.tsx` 做好错误处理
- 使用 `next-safe-action` 做安全的表单提交和 API 调用
- 客户端组件使用 `"use client"` 指令优化 SSR
- 使用 `next-themes` 管理主题和暗色模式

### Server Components vs Client Components

```tsx
// Server Component（默认）- 无需声明
export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}

// Client Component - 需要 "use client"
'use client';
export default function InteractiveComponent() {
  const [state, setState] = useState();
  // 可以使用 hooks、事件处理等
}
```

## React 最佳实践

> 参考：[`.cursor/rules/react-best-practices.mdc`](.cursor/rules/react-best-practices.mdc)

- 使用函数组件 + Hooks，不使用 class 组件
- 复杂状态使用 Zustand 管理
- 利用 React 19 的 `use` hook 做数据获取和 Suspense 集成
- 使用 TypeScript 做 props 类型校验
- 使用 `useCallback` 和 `useMemo` 优化性能
- 使用 `react-hook-form` 处理表单

### Hooks 使用规范

```tsx
// useState - 本地状态
const [count, setCount] = useState(0);

// useEffect - 副作用（如轮询）
useEffect(() => {
  const interval = setInterval(pollTask, 3000);
  return () => clearInterval(interval); // 清理
}, [taskId]);

// useMemo - 缓存计算结果
const filteredModels = useMemo(
  () => models.filter(m => m.type === mediaType),
  [models, mediaType]
);

// useCallback - 稳定函数引用
const handleGenerate = useCallback(() => {
  // 生成逻辑
}, [prompt, model]);
```

## TypeScript 最佳实践

> 参考：[`.cursor/rules/typescript-best-practices.mdc`](.cursor/rules/typescript-best-practices.mdc)

- 启用 `tsconfig.json` 中的 strict 模式
- 对象形状用 `interface`，联合/交叉类型用 `type`
- 尽量利用类型推断，减少冗余注解
- 使用泛型实现可复用组件和函数
- 使用类型守卫和断言做运行时类型检查
- 终端命令使用 `pnpm` 作为包管理器

```typescript
// Interface - 对象形状
interface User {
  id: string;
  name: string;
  email: string;
}

// Type - 联合类型
type MediaType = 'image' | 'video' | 'audio';

// 泛型示例
function getFirst<T>(items: T[]): T | undefined {
  return items[0];
}

// 类型守卫
function isUser(obj: unknown): obj is User {
  return typeof obj === 'object' && obj !== null && 'id' in obj;
}
```

## Tailwind CSS 最佳实践

> 参考：[`.cursor/rules/tailwindcss-best-practices.mdc`](.cursor/rules/tailwindcss-best-practices.mdc)

- 采用 utility-first 方式快速开发
- 使用内置断点实现响应式设计
- 使用 `@apply` 创建自定义工具类
- 使用 JIT 模式优化性能和包大小
- 使用 `tailwind-merge` 高效合并和覆盖 class
- 使用 `tailwindcss-animate` 实现动画

```tsx
// 响应式设计
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// 暗色模式
<div className="bg-white dark:bg-gray-900">

// 状态变体
<button className="hover:bg-blue-600 focus:ring-2">
```

## Radix UI 最佳实践

> 参考：[`.cursor/rules/radix-ui-best-practices.mdc`](.cursor/rules/radix-ui-best-practices.mdc)

- 使用 Radix UI 原语构建自定义、无障碍的组件
- 使用组合模式创建复杂可复用的 UI 元素
- 实现 ARIA 属性和键盘导航确保无障碍
- 使用内置状态管理处理复杂组件
- 使用 `asChild` prop 实现更灵活的定制

```tsx
import * as Dialog from '@radix-ui/react-dialog';

// asChild 用法
<Dialog.Trigger asChild>
  <Button>Open Dialog</Button>
</Dialog.Trigger>
```

## Drizzle ORM 最佳实践

> 参考：[`.cursor/rules/drizzle-orm-best-practices.mdc`](.cursor/rules/drizzle-orm-best-practices.mdc)、[`.cursor/rules/database-state-management.mdc`](.cursor/rules/database-state-management.mdc)

- 使用类型安全的 query builder
- 通过 Drizzle Kit 管理迁移
- 使用 relation 系统定义和查询关系
- 复杂操作使用事务 API

### Schema 定义示例

```typescript
// src/db/schema.ts
import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow(),
  isActive: boolean('is_active').default(true),
});
```

### 数据库命令

```bash
pnpm db:generate  # Schema 变更后生成迁移
pnpm db:migrate   # 应用迁移到数据库
pnpm db:push      # 开发时直接推送（谨慎使用）
pnpm db:studio    # 可视化管理
```

## Zustand 状态管理最佳实践

> 参考：[`.cursor/rules/zustand-best-practices.mdc`](.cursor/rules/zustand-best-practices.mdc)、[`.cursor/rules/database-state-management.mdc`](.cursor/rules/database-state-management.mdc)

- 使用 `create` 函数定义 store
- 使用 `persist` 中间件持久化状态
- 使用 `useStore` hook 访问状态
- 使用 `immer` 中间件简化不可变更新
- Store 定义放在 `src/stores/` 目录
- 保持 store 模块化和聚焦

```typescript
// src/stores/media-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MediaState {
  prompt: string;
  setPrompt: (prompt: string) => void;
}

export const useMediaStore = create<MediaState>()(
  persist(
    (set) => ({
      prompt: '',
      setPrompt: (prompt) => set({ prompt }),
    }),
    { name: 'media-storage' }
  )
);
```

## React Hook Form 最佳实践

> 参考：[`.cursor/rules/react-hook-form-best-practices.mdc`](.cursor/rules/react-hook-form-best-practices.mdc)

- 使用 `useForm` hook 管理表单状态
- 配合 Zod + `@hookform/resolvers` 做类型安全校验
- 使用 `Controller` 集成自定义输入组件
- 使用 `useFormContext` 跨组件共享表单状态

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

function LoginForm() {
  const form = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register('email')} />
      <input {...form.register('password')} type="password" />
    </form>
  );
}
```

## Zod 校验最佳实践

> 参考：[`.cursor/rules/zod-best-practices.mdc`](.cursor/rules/zod-best-practices.mdc)

- 定义清晰可复用的校验 schema
- 利用 Zod 类型推断与 TypeScript 集成
- 使用 `refine` 方法实现自定义校验规则
- 配合 `react-hook-form` 做表单校验

```typescript
import { z } from 'zod';

// 定义 schema
const userSchema = z.object({
  name: z.string().min(2, '名称至少2个字符'),
  email: z.string().email('邮箱格式不正确'),
  age: z.number().min(0).max(150).optional(),
});

// 类型推断
type User = z.infer<typeof userSchema>;

// 自定义校验
const passwordSchema = z.string().refine(
  (val) => /[A-Z]/.test(val) && /[0-9]/.test(val),
  '密码必须包含大写字母和数字'
);
```

## Stripe 支付集成最佳实践

> 参考：[`.cursor/rules/stripe-best-practices.mdc`](.cursor/rules/stripe-best-practices.mdc)

- 客户端使用 `@stripe/stripe-js`
- 实现支付流程的错误处理和用户反馈
- 使用 Stripe Elements 做安全、可定制的支付输入
- 使用 Webhooks 做实时支付状态更新
- 遵循 Stripe 的 PCI 合规和安全最佳实践

## Vercel AI SDK 最佳实践

> 参考：[`.cursor/rules/ai-sdk-best-practices.mdc`](.cursor/rules/ai-sdk-best-practices.mdc)

- 使用 `createClient` 初始化 OpenAI 客户端
- 实现错误处理和速率限制
- 长任务使用流式响应提升用户体验
- 使用 `ai` 包轻松集成 React 组件
- 遵循 OpenAI 的负责任 AI 使用和数据隐私指南

## date-fns 日期处理最佳实践

> 参考：[`.cursor/rules/date-fns-best-practices.mdc`](.cursor/rules/date-fns-best-practices.mdc)

- 使用 `format` 函数统一日期格式化
- 使用 `utcToZonedTime` 处理时区
- 使用 `intervalToDuration` 计算时间差
- 使用 `isWithinInterval` 做日期范围检查

---

# 数据流与状态管理

> 参考：[`.cursor/rules/database-state-management.mdc`](.cursor/rules/database-state-management.mdc)

## 数据流层次

```
1. Server Components     → 服务端数据获取
2. Zustand Stores        → 客户端状态
3. React Hook Form       → 表单状态
4. Server Actions        → API 调用
5. Drizzle ORM          → 数据库操作
6. AWS S3               → 文件存储
7. Error Handling       → 各层错误处理
8. Type Safety          → 全链路类型安全
9. Zod Validation       → 运行时校验
10. Caching Strategies  → 缓存策略
```

---

# UI 组件规范

> 参考：[`.cursor/rules/ui-components.mdc`](.cursor/rules/ui-components.mdc)

## 组件设计原则

- 遵循原子设计原则
- 使用 Radix UI 原语
- 实现无障碍访问
- 使用 Tailwind CSS 样式
- 保持命名一致性
- 组件功能聚焦
- 实现错误状态
- 处理加载状态
- 使用 TypeScript 类型

## UI 库清单

| 库 | 用途 |
|---|---|
| Radix UI | UI 原语 |
| Tailwind CSS | 样式 |
| Framer Motion | 动画 |
| React Hook Form | 表单 |
| Zod | 校验 |
| Lucide React | 图标 |
| Tabler Icons | 额外图标 |
| Sonner | Toast 通知 |
| Vaul | 抽屉组件 |
| Embla Carousel | 轮播组件 |

## 无障碍要求

- 使用语义化 HTML
- 实现 ARIA 标签
- 支持键盘导航
- 支持屏幕阅读器
- 确保颜色对比度
- 实现焦点管理
- 支持减少动画偏好
- 遵循 WCAG 指南

---

# 规则文件索引

所有 `.cursor/rules/` 目录下的规则文件：

| 文件 | 说明 |
|------|------|
| [`ai-sdk-best-practices.mdc`](.cursor/rules/ai-sdk-best-practices.mdc) | Vercel AI SDK 最佳实践 |
| [`database-state-management.mdc`](.cursor/rules/database-state-management.mdc) | 数据库与状态管理指南 |
| [`date-fns-best-practices.mdc`](.cursor/rules/date-fns-best-practices.mdc) | date-fns 日期处理最佳实践 |
| [`development-workflow.mdc`](.cursor/rules/development-workflow.mdc) | 开发工作流指南 |
| [`drizzle-orm-best-practices.mdc`](.cursor/rules/drizzle-orm-best-practices.mdc) | Drizzle ORM 最佳实践 |
| [`nextjs-best-practices.mdc`](.cursor/rules/nextjs-best-practices.mdc) | Next.js 最佳实践 |
| [`project-structure.mdc`](.cursor/rules/project-structure.mdc) | 项目结构指南 |
| [`radix-ui-best-practices.mdc`](.cursor/rules/radix-ui-best-practices.mdc) | Radix UI 最佳实践 |
| [`react-best-practices.mdc`](.cursor/rules/react-best-practices.mdc) | React 最佳实践 |
| [`react-hook-form-best-practices.mdc`](.cursor/rules/react-hook-form-best-practices.mdc) | React Hook Form 最佳实践 |
| [`stripe-best-practices.mdc`](.cursor/rules/stripe-best-practices.mdc) | Stripe 支付集成最佳实践 |
| [`tailwindcss-best-practices.mdc`](.cursor/rules/tailwindcss-best-practices.mdc) | Tailwind CSS 最佳实践 |
| [`typescript-best-practices.mdc`](.cursor/rules/typescript-best-practices.mdc) | TypeScript 最佳实践 |
| [`ui-components.mdc`](.cursor/rules/ui-components.mdc) | UI 组件规范 |
| [`zod-best-practices.mdc`](.cursor/rules/zod-best-practices.mdc) | Zod 校验最佳实践 |
| [`zustand-best-practices.mdc`](.cursor/rules/zustand-best-practices.mdc) | Zustand 状态管理最佳实践 |

---

# 相关文档

- [`doc/项目结构拆分.md`](doc/项目结构拆分.md) - 多媒体生成组件架构
- [`CLAUDE.md`](CLAUDE.md) - Claude Code 专用指南
- [`openspec/AGENTS.md`](openspec/AGENTS.md) - 变更提案规范
