import AlternatingMediaSection from '@/components/custom-blocks/alternating-media/alternating-media';
import FaqSection from '@/components/custom-blocks/faqs/faqs';
import HeroSection from '@/components/custom-blocks/hero/hero';
import StudioPromoSection from '@/components/custom-blocks/studio-promo/studio-promo';
import WorkflowStepsSection from '@/components/custom-blocks/workflow-steps/workflow-steps';
import Container from '@/components/layout/container';
import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { MediaGeneratorWorkspace } from '@/components/marketing/media-generator/media-generator-workspace';
import { StudioHashCleaner } from '@/components/marketing/media-studio/studio-hash-cleaner';
import { Button } from '@/components/ui/button';
import { constructMetadata } from '@/lib/metadata';
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
    namespace: 'ZImageStudioPage',
  });

  return constructMetadata({
    title: pt('title') + ' | ' + t('title'),
    description: pt('description'),
    locale,
    pathname: '/media-studio/z-image',
  });
}

export default async function ZImageStudioPage() {
  const t = await getTranslations('ZImageStudioPage');

  const highlightItems = [
    {
      title: t('highlights.items.item-1.title'),
      description: t('highlights.items.item-1.description'),
      image: {
        src: '/images/studio-examples/z-image/showcase_realistic.png',
        alt: 'Photorealistic showcase preview',
        priority: true,
      },
    },
    {
      title: t('highlights.items.item-2.title'),
      description: t('highlights.items.item-2.description'),
      image: {
        src: '/images/studio-examples/z-image/showcase_rendering.png',
        alt: 'Bilingual text rendering preview',
      },
    },
    {
      title: t('highlights.items.item-3.title'),
      description: t('highlights.items.item-3.description'),
      image: {
        src: '/images/studio-examples/z-image/reasoning.png',
        alt: 'Prompt enhancer reasoning preview',
      },
    },
  ];

  const workflowItems = [
    {
      title: t('workflow.items.item-1.title'),
      description: t('workflow.items.item-1.description'),
    },
    {
      title: t('workflow.items.item-2.title'),
      description: t('workflow.items.item-2.description'),
    },
    {
      title: t('workflow.items.item-3.title'),
      description: t('workflow.items.item-3.description'),
    },
    {
      title: t('workflow.items.item-4.title'),
      description: t('workflow.items.item-4.description'),
    },
  ];


  const faqItemKeys = [
    'faq.items.item-1',
    'faq.items.item-2',
    'faq.items.item-3',
    'faq.items.item-4',
    'faq.items.item-5',
  ] as const;
  const faqItems = faqItemKeys.map((itemKey, index) => ({
    id: `faq-${index + 1}`,
    question: t(`${itemKey}.question`),
    answer: t(`${itemKey}.answer`),
  }));
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <Navbar scroll={true} />
      <main className="bg-background text-foreground">
        <StudioHashCleaner />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
        <div className="mb-12 lg:mb-16">
          <HeroSection
            eyebrow={t('eyebrow')}
            title={t('hero.title')}
            description={t('hero.subtitle')}
            cta={t('hero.cta')}
            primaryLabel={t('hero.primaryCta')}
            secondaryLabel={t('hero.secondaryCta')}
            primaryHref="#studio"
            secondaryHref="#highlights"
          />
        </div>

        <section id="studio" className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsla(0,0%,90%,0.25),transparent_55%),radial-gradient(circle_at_top_right,hsla(0,0%,80%,0.2),transparent_60%)]"
          />
          <Container className="relative px-6 pb-16 pt-10 lg:pt-16">
            <div className="mx-auto max-w-3xl space-y-3 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                {t('studio.title')}
              </p>
              <h2 className="text-3xl font-semibold text-foreground">
                {t('studio.subtitle')}
              </h2>
              <p className="text-base text-muted-foreground">
                {t('studio.description')}
              </p>
            </div>
            <div className="mt-10 rounded-3xl border border-border/60 bg-muted/40 p-3 shadow-lg">
              <MediaGeneratorWorkspace
                className="h-[720px]"
                initialMediaType="image"
                preferredModelId="z-image"
              />
            </div>
            <div className="mt-6 flex justify-center">
              <Button
                asChild
                size="lg"
                className="cursor-pointer h-12 px-8 text-base md:h-14 md:px-10 md:text-lg"
              >
                <Link href="/media-studio">{t('immersiveStudio.label')}</Link>
              </Button>
            </div>
          </Container>
        </section>

        <AlternatingMediaSection
          id="highlights"
          subtitle={t('highlights.title')}
          items={highlightItems}
          className="[&_h2]:text-4xl [&_h2]:font-bold"
        />

        <WorkflowStepsSection
          id="workflow"
          subtitle={t('workflow.title')}
          description={t('workflow.description')}
          items={workflowItems}
          className="[&_h2]:text-4xl [&_h2]:font-bold"
        />

        <div className="[&_h2]:text-4xl [&_h2]:font-bold">
          <FaqSection
            title={t('faq.title')}
            subtitle={t('faq.description')}
            items={faqItems}
          />
        </div>

        <StudioPromoSection
          id="studio-promo"
          title={t('cta.title')}
          description={t('cta.description')}
          primaryLabel={t('cta.primaryCta')}
          secondaryLabel={t('cta.secondaryCta')}
          primaryHref="#studio"
          secondaryHref="/pricing"
        />

        <Footer />
      </main>
    </>
  );
}
