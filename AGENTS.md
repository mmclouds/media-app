# 仓库指南

## 项目结构与模块组织
路由与服务器操作位于 `src/app`（面向 locale 的页面使用 `[locale]`）。可复用的 UI 在 `src/components`，包括 `ui/`、`magicui/`、`tailark/` 等库以及各业务域文件夹。共享逻辑与 AI 工作流分别放在 `src/lib` 与 `src/ai`，而 Drizzle 的 schema 与迁移文件位于 `src/db`。将事务邮件放入 `src/mail`，分析服务商放在 `src/analytics`，静态资源放在 `public/`，运维脚本放在 `scripts/`，营销与文档内容放在 `content/`。

## 构建、测试与开发命令
使用 `pnpm install` 安装依赖，运行 `pnpm dev` 启动本地 Next.js 服务器。通过 `pnpm build` 生成优化后的构建，再用 `pnpm start` 提供服务。`pnpm lint` 触发 Biome 检查，`pnpm format` 负责统一格式。数据库流程依赖 Drizzle：`pnpm db:generate` 根据 schema 输出 SQL，`pnpm db:migrate` 应用本地变更，`pnpm db:push` 同步至远端。辅助工具包括用于邮件预览的 `pnpm email`，以及 `pnpm list-users`、`pnpm fix-payments` 等脚本。

## 编码风格与命名约定
Biome（`biome.json`）要求两空格缩进、单引号、ES5 样式的拖尾逗号，并强制使用分号。模块文件名偏好 kebab-case（如 `dashboard-sidebar.tsx`），hook 以 `use-` 开头（如 `use-session.ts`），工具函数默认使用具名导出。Tailwind 工具类位于 `src/styles`，需在此扩展 tokens，避免四处散落魔法值。仅服务器可用的代码要放在包含 `"use server"` 的文件中，且不要在这些模块中引入客户端 hook。

## 测试指南
包脚本中没有自动化测试，因此需通过 `pnpm dev`、lint 以及围绕认证、计费与 AI 流程的手动 QA 来验证修改。新增测试运行器时，将测试文件与功能放在一起，使用 `.test.ts(x)` 或 `.spec.ts(x)` 后缀，并在 PR 中记录运行命令。当评审需要数据改动时，记得在 `src/db/migrations` 中补充相应的 fixtures。

## Commit 与 Pull Request 指南
遵循日志中使用的 Conventional Commit 规范（如 `feat:`、`fix:`、`chore:`）。保持每次提交的范围明确，在提交正文中引用 issue ID，并在环境变量变化时更新 `env.example`。PR 应包含简明摘要、测试记录（命令与结果）、UI 变更截图，以及文档或配置调整的说明。所有检查通过后再请求评审，若有破坏性变更需尽早说明。

## 配置与密钥
在运行命令前，将 `env.example` 复制为 `.env`。生产凭据通过部署提供商（Vercel、Cloudflare）托管，严禁提交到仓库。为 `opennextjs-cloudflare` 或 `wrangler` 使用范围受限的 API Key，并在 `src/ai` 中轮换与服务商相关的密钥；合并前清理所有临时调试日志。

# 个人偏好

## 重要（以下内容，不要改动）
- 在用到export const runtime = 'edge';的地方，一定不要修改，保持edge环境。
- 在ssr渲染的地方，一定不要修改，保持ssr渲染，保持seo友好。
- 不要修改和落地页，example页面相关的seo属性。

## codex的使用规则
- 在回答问题的时候，使用中文
- 在需要前台展示的内容，统一使用英文，如toast、title等内容。涉及到代码注释和日志打印的时候，统一使用中文。
- 当我提示你需要更新知识库的时候，将一些通用技术点、难点、易错点、通用方案等内容写入到doc/study.md的文件中，更新知识库。注意：我不提示你更新，则不要自动更新读取！！
- 每一次对话，任务完成后，将一些业务逻辑上的改动，功能的实现，bug的修复等内容，整理一下，写入到doc/changeList.md中，记录系统开发更新日志。

# 项目摘要
本项目是用来实现一个Ai视频生成的网站。包含图生视频，文生视频。要求SEO友好。 

# 框架特性
## 创建新页面-基于组件的页面
在 src/app/[locale]/(marketing)/(pages) 中创建一个新目录（例如， pricing ）
添加一个 page.tsx 文件，用于导出您的自定义页面组件。
自定义页面组件示例：

```
import { Button } from '@/components/ui/button';
import { constructMetadata } from '@/lib/metadata';
import { getUrlWithLocale } from '@/lib/urls/urls';
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
    canonicalUrl: getUrlWithLocale('/pricing', locale),
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