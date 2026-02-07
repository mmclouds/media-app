import { CapabilitiesCardsSection } from '@/components/custom-blocks/capabilities-cards/capabilities-cards';
import FaqSection from '@/components/custom-blocks/faqs/faqs';
import HeroSection from '@/components/custom-blocks/hero/hero';
import StudioPromoSection from '@/components/custom-blocks/studio-promo/studio-promo';
import WorkflowStepsSection from '@/components/custom-blocks/workflow-steps/workflow-steps';
import ImageToMediaShowcase from '@/components/cutomer/image-to-media-showcase';
import type { ImageToMediaExample } from '@/components/cutomer/image-to-media-showcase';
import MediaPromptShowcase from '@/components/cutomer/media-prompt-showcase';
import type { MediaPromptExample } from '@/components/cutomer/media-prompt-showcase';
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
    namespace: 'GptImage15StudioPage',
  });

  return constructMetadata({
    title: pt('title') + ' | ' + t('title'),
    description: pt('description'),
    locale,
    pathname: '/media-studio/gpt-image-1-5',
  });
}

export default async function GptImage15StudioPage() {
  const t = await getTranslations('GptImage15StudioPage');

  const capabilityItems = [
    {
      title: t('snapshot.items.item-1.title'),
      description: t('snapshot.items.item-1.description'),
    },
    {
      title: t('snapshot.items.item-2.title'),
      description: t('snapshot.items.item-2.description'),
    },
    {
      title: t('snapshot.items.item-3.title'),
      description: t('snapshot.items.item-3.description'),
    },
    {
      title: t('snapshot.items.item-4.title'),
      description: t('snapshot.items.item-4.description'),
    },
    {
      title: t('snapshot.items.item-5.title'),
      description: t('snapshot.items.item-5.description'),
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

  const referenceExampleItems: ImageToMediaExample[] = [
    {
      title: t('examples.items.item-1.title'),
      description: t('examples.items.item-1.description'),
      prompt: t('examples.items.item-1.prompt'),
      inputImages: [
        'https://images.ctfassets.net/kftzwdyauwt9/5cwVlwaPmq2DToD9aownyp/e96fe76cb42c7494970aa2228e0601e8/chatgpt-images-example-1-input-2.png?w=256&q=90&fm=webp',
        'https://images.ctfassets.net/kftzwdyauwt9/3ItRm2R52GpUvn4o98aTE1/7a0679e3821ba3c4833d1f81baacd03b/chatgpt-images-example-1-input-1.png?w=256&q=90&fm=webp',
        'https://images.ctfassets.net/kftzwdyauwt9/6u6hRASp14bolVMdGkRsjz/f507cedcf291a87708155c7e37649d66/chatgpt-images-example-1-input-3.png?w=256&q=90&fm=webp',
      ],
      output:
        'https://images.ctfassets.net/kftzwdyauwt9/3p5PZNWvpu3Ok2c42uyVBC/4bc40d7dfa085b24319dc9c145f52414/chatgpt-images-example-1-output-1.png?w=828&q=90&fm=webp',
    },
    {
      title: t('examples.items.item-2.title'),
      description: t('examples.items.item-2.description'),
      prompt: t('examples.items.item-2.prompt'),
      inputImages: [
        'https://images.ctfassets.net/kftzwdyauwt9/4oFLXvcd0Vav1Fe48Ozq13/1ae87cae6ac3ef8b0ad82cdf72b7d5bf/sama.png?w=256&q=90&fm=webp',
      ],
      output:
        'https://images.ctfassets.net/kftzwdyauwt9/1U1FGWLDM7kU1PDnIHJYYi/5c29eacf9e9aecb58a6541228fc371a5/chatgpt-images-example-3-output-10.png?w=640&q=90&fm=webp',
    },
    {
      title: t('examples.items.item-3.title'),
      description: t('examples.items.item-3.description'),
      prompt: t('examples.items.item-3.prompt'),
      inputImages: [
        'https://images.ctfassets.net/kftzwdyauwt9/4oFLXvcd0Vav1Fe48Ozq13/1ae87cae6ac3ef8b0ad82cdf72b7d5bf/sama.png?w=256&q=90&fm=webp',
      ],
      output:
        'https://images.ctfassets.net/kftzwdyauwt9/5E7lWlQcXfCm5awAjPY1wU/ff629b44d5cc902edbfe5e73ba046850/chatgpt-images-example-3-output-9.png?w=640&q=90&fm=webp',
    },
  ];

  const promptExampleItems: MediaPromptExample[] = [
    {
      title: t('examples.items.item-4.title'),
      description: t('examples.items.item-4.description'),
      prompts: [t('examples.items.item-4.prompt')],
      output:
        'https://images.ctfassets.net/kftzwdyauwt9/5oMdYDrJ0rnoqcaSPEUWjN/e248e4e693e25e53f18cd9098fbf68a4/chatgpt-images-instruction-following-new.png?w=640&q=90&fm=webp',
    },
    {
      title: t('examples.items.item-5.title'),
      description: t('examples.items.item-5.description'),
      prompts: [t('examples.items.item-5.prompt')],
      output:
        'https://images.ctfassets.net/kftzwdyauwt9/4HNQQQAV3fy7AGI8iSXvkD/06314d3aee5fed93f0ed6d701abf542d/fibonacci1.png?w=828&q=90&fm=webp',
    },
    {
      title: t('examples.items.item-6.title'),
      description: t('examples.items.item-6.description'),
      prompts: [t('examples.items.item-6.prompt')],
      output:
        'https://images.ctfassets.net/kftzwdyauwt9/3DoDfZK3NJkTRfPoDyFST/886db80876a70561a50a277809e87b70/gpt5.2.png?w=640&q=90&fm=webp',
    },
    {
      title: t('examples.items.item-7.title'),
      description: t('examples.items.item-7.description'),
      prompts: [t('examples.items.item-7.prompt')],
      output:
        'https://images.ctfassets.net/kftzwdyauwt9/61MZEpV2QadEsiVho5qUMs/a3d65485561efea74bb2722f7cf18df9/chatgpt-images-quality-1.png?w=640&q=90&fm=webp',
    },
    {
      title: t('examples.items.item-8.title'),
      description: t('examples.items.item-8.description'),
      prompts: [t('examples.items.item-8.prompt')],
      output:
        'https://images.ctfassets.net/kftzwdyauwt9/2bIYfVd1EvdlOVYHFkQe3M/c1f7f2a64a76aac43d26305b8989ba9e/chatgpt-images-quality-7.png?w=640&q=90&fm=webp',
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
                preferredModelId="gpt-image-1.5"
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

        <CapabilitiesCardsSection
          id="highlights"
          eyebrow={t('snapshot.eyebrow')}
          title={t('snapshot.title')}
          description={t('snapshot.description')}
          items={capabilityItems}
          getCardLabel={(index) => t('snapshot.cardLabel', { index })}
          brandLabel={t('snapshot.brandLabel')}
        />

        <WorkflowStepsSection
          id="workflow"
          subtitle={t('workflow.title')}
          description={t('workflow.description')}
          items={workflowItems}
          className="[&_h2]:text-4xl [&_h2]:font-bold"
        />

        <ImageToMediaShowcase
          id="examples"
          title={t('examples.referenceTitle')}
          subtitle={t('examples.referenceSubtitle')}
          inputLabel={t('examples.inputLabel')}
          outputLabel={t('examples.outputLabel')}
          items={referenceExampleItems}
        />

        <MediaPromptShowcase
          title={t('examples.promptTitle')}
          subtitle={t('examples.promptSubtitle')}
          items={promptExampleItems}
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
