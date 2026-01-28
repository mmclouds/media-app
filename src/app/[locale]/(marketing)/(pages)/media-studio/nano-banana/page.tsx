import { Navbar } from '@/components/layout/navbar';
import { MediaGeneratorWorkspace } from '@/components/marketing/media-generator/media-generator-workspace';
import { Button, buttonVariants } from '@/components/ui/button';
import { constructMetadata } from '@/lib/metadata';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata | undefined> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  const pt = await getTranslations({
    locale,
    namespace: 'NanoBananaStudioPage',
  });

  return constructMetadata({
    title: pt('title') + ' | ' + t('title'),
    description: pt('description'),
    locale,
    pathname: '/media-studio/nano-banana',
  });
}

export default async function NanoBananaStudioPage() {
  const t = await getTranslations('NanoBananaStudioPage');
  const heroTagKeys = [
    'hero.tags.tag-1',
    'hero.tags.tag-2',
    'hero.tags.tag-3',
  ] as const;
  const snapshotItemKeys = [
    'snapshot.items.item-1',
    'snapshot.items.item-2',
    'snapshot.items.item-3',
    'snapshot.items.item-4',
  ] as const;
  const workflowItemKeys = [
    'workflow.items.item-1',
    'workflow.items.item-2',
    'workflow.items.item-3',
    'workflow.items.item-4',
  ] as const;
  const useCaseKeys = [
    'useCases.items.item-1',
    'useCases.items.item-2',
    'useCases.items.item-3',
    'useCases.items.item-4',
    'useCases.items.item-5',
    'useCases.items.item-6',
  ] as const;
  const promptExampleKeys = [
    'promptTips.examples.item-1',
    'promptTips.examples.item-2',
    'promptTips.examples.item-3',
  ] as const;
  const faqItemKeys = [
    'faq.items.item-1',
    'faq.items.item-2',
    'faq.items.item-3',
    'faq.items.item-4',
    'faq.items.item-5',
  ] as const;

  return (
    <>
      <Navbar scroll={true} />
      <main className="min-h-screen w-full bg-[#020202] px-6 py-10 text-white">
        <div className="mx-auto w-full max-w-6xl space-y-10">
          <header className="space-y-4">
            <p className="text-xs uppercase tracking-[0.28em] text-white/40">
              {t('eyebrow')}
            </p>
            <h1 className="text-3xl font-semibold text-white md:text-4xl">
              {t('hero.title')}
            </h1>
            <p className="max-w-2xl text-sm text-white/60 md:text-base">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-wrap gap-2">
              {heroTagKeys.map((tagKey) => (
                <span
                  key={tagKey}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                >
                  {t(tagKey)}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="cursor-pointer">
                <a href="#studio">{t('hero.primaryCta')}</a>
              </Button>
              <Link
                href="/pricing"
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'lg' }),
                  'cursor-pointer border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white'
                )}
              >
                {t('hero.secondaryCta')}
              </Link>
            </div>
          </header>

          <section
            id="studio"
            className="scroll-mt-24 space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6"
          >
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-white md:text-2xl">
                {t('studio.title')}
              </h2>
              <p className="text-sm text-white/60 md:text-base">
                {t('studio.description')}
              </p>
            </div>
            <MediaGeneratorWorkspace
              className="h-[720px]"
              initialMediaType="image"
              preferredModelId="nano-banana"
            />
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.1fr_1.5fr]">
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-white">
                {t('snapshot.title')}
              </h2>
              <p className="text-sm text-white/60 md:text-base">
                {t('snapshot.description')}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {snapshotItemKeys.map((itemKey) => (
                <div
                  key={itemKey}
                  className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-4"
                >
                  <h3 className="text-base font-semibold text-white">
                    {t(`${itemKey}.title`)}
                  </h3>
                  <p className="mt-2 text-sm text-white/60">
                    {t(`${itemKey}.description`)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-white">
                {t('workflow.title')}
              </h2>
              <p className="text-sm text-white/60 md:text-base">
                {t('workflow.description')}
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {workflowItemKeys.map((itemKey, index) => (
                <div
                  key={itemKey}
                  className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-4"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                    {t('workflow.stepLabel', { index: index + 1 })}
                  </p>
                  <h3 className="mt-2 text-base font-semibold text-white">
                    {t(`${itemKey}.title`)}
                  </h3>
                  <p className="mt-2 text-sm text-white/60">
                    {t(`${itemKey}.description`)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-white">
                {t('useCases.title')}
              </h2>
              <p className="text-sm text-white/60 md:text-base">
                {t('useCases.description')}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {useCaseKeys.map((itemKey) => (
                <div
                  key={itemKey}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80"
                >
                  {t(itemKey)}
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.1fr_1.5fr]">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-white">
                {t('promptTips.title')}
              </h2>
              <p className="text-sm text-white/60 md:text-base">
                {t('promptTips.description')}
              </p>
              <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4 text-sm text-white/70">
                {t('promptTips.formula')}
              </div>
            </div>
            <div className="space-y-3">
              {promptExampleKeys.map((itemKey) => (
                <div
                  key={itemKey}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70"
                >
                  {t(itemKey)}
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-white">
                {t('faq.title')}
              </h2>
              <p className="text-sm text-white/60 md:text-base">
                {t('faq.description')}
              </p>
            </div>
            <dl className="space-y-4">
              {faqItemKeys.map((itemKey) => (
                <div
                  key={itemKey}
                  className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-4"
                >
                  <dt className="text-sm font-semibold text-white">
                    {t(`${itemKey}.question`)}
                  </dt>
                  <dd className="mt-2 text-sm text-white/60">
                    {t(`${itemKey}.answer`)}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#1b1b1b] via-[#111111] to-[#0a0a0a] p-8 text-center">
            <h2 className="text-2xl font-semibold text-white md:text-3xl">
              {t('cta.title')}
            </h2>
            <p className="mt-3 text-sm text-white/60 md:text-base">
              {t('cta.description')}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="cursor-pointer">
                <a href="#studio">{t('cta.primaryCta')}</a>
              </Button>
              <Link
                href="/pricing"
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'lg' }),
                  'cursor-pointer border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white'
                )}
              >
                {t('cta.secondaryCta')}
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
