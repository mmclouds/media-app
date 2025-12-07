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

# 个人偏好

## 重要（以下内容，不要改动）
- 在用到 `export const runtime = 'edge';` 的地方保持 edge 环境。
- SSR 渲染页面不可更改，确保 SEO 友好。
- 不要修改落地页及 example 页面相关的 SEO 属性。

## codex 的使用规则
- 回答一律使用中文。
- 需要前台展示的内容统一使用英文（如 toast/title），代码注释与日志使用中文。

## 讲解代码
每次任务，输出包含两个内容。代码修改、讲解输出。
### ② 讲解输出：写入独立 Markdown 文件 `doc/explain.md`
代码输出完后，必须 **自动创建或覆盖** 一个 `doc/explain.md` 文件，格式如下：
```
---

## 2. explain.md（讲解内容）必须包含以下部分

### 🟦 A. React 核心概念讲解
- 使用了哪些 React 核心能力（组件、props、state）
- 使用了哪些 Hooks（useState、useEffect、useMemo、useCallback…）
- 为什么需要这些 Hooks？
- 组件渲染机制如何与本代码相关？
- 哪些地方体现最佳实践？

### 🟦 B. Next.js 核心概念讲解（若本次代码使用 Next.js）
- Server Components 与 Client Components 的划分与原因
- `"use client"` 的作用与使用场景
- App Router 的路由机制（page/layout/loading/error/route segment）
- 数据获取策略：SSR / SSG / ISR / fetch 缓存与 revalidate
- next/link 与 next/image 的核心用法
- 文件结构对数据流与组件行为的影响

### 🟦 C. 代码逻辑拆解与架构说明
- 文件结构解释
- 每段代码的作用
- 数据流与组件通信方式
- 可替代实现 vs 当前实现的优势
- 有哪些隐含的最佳实践？

### 🟦 D. 初学者学习重点总结
用列表形式输出本次生成代码所涉及的关键知识点。

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

# 项目介绍
本项目主要实现的是多媒体内容生成。具体架构和组件设计参考文件 `doc/项目结构拆分.md`

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
