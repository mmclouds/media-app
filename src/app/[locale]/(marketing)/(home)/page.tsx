import CallToActionSection from '@/components/blocks/calltoaction/calltoaction';
import FaqSection from '@/components/blocks/faqs/faqs';
import FeaturesSection from '@/components/blocks/features/features';
import Features2Section from '@/components/blocks/features/features2';
import Features3Section from '@/components/blocks/features/features3';
import HeroSection from '@/components/blocks/hero/hero';
import Integration3Section from '@/components/blocks/integration/integration3';
import Integration2Section from '@/components/blocks/integration/integration2';
import LogoCloud from '@/components/blocks/logo-cloud/logo-cloud';
import PricingSection from '@/components/blocks/pricing/pricing';
import StatsSection from '@/components/blocks/stats/stats';
import TestimonialsSection from '@/components/blocks/testimonials/testimonials';
import MediaShowcaseSection from '@/components/blocks/media-showcase/media-showcase';
import CrispChat from '@/components/layout/crisp-chat';
import { MediaGeneratorWorkspace } from '@/components/marketing/media-generator/media-generator-workspace';
import { NewsletterCard } from '@/components/newsletter/newsletter-card';
import { constructMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';

/**
 * https://next-intl.dev/docs/environments/actions-metadata-route-handlers#metadata-api
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata | undefined> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  const ht = await getTranslations({ locale, namespace: 'HomePage' });

  return constructMetadata({
    title: ht('meta.title') || t('title'),
    description: ht('meta.description') || t('description'),
    locale,
    pathname: '/',
  });
}

interface HomePageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function HomePage(props: HomePageProps) {
  const { locale } = await props.params;
  const faq = await getTranslations({ locale, namespace: 'HomePage.faqs' });
  const faqItems = Object.values(
    faq.raw('items') as Record<string, { question: string; answer: string }>
  );

  const faqJsonLd = {
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
      <div className="flex flex-col">
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD needed for SEO.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        {/* <div className="relative z-50 w-full">
          <MediaGeneratorWorkspace className="h-full w-full" />
        </div> */}
        <HeroSection />

        {/* <LogoCloud /> */}

        {/* <StatsSection /> */}

        {/* <IntegrationSection /> */}
        <Integration3Section />

        <FeaturesSection />

        {/* <Features2Section /> */}

        <Features3Section />

        <MediaShowcaseSection />

        {/* <Integration2Section /> */}

        <PricingSection />

        <FaqSection />

        <CallToActionSection />

        {/* <TestimonialsSection /> */}

        <NewsletterCard />

        <CrispChat />


      </div>
    </>
  );
}
