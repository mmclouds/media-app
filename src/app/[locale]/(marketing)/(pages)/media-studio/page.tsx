import CallToActionSection from '@/components/blocks/calltoaction/calltoaction';
import FaqSection from '@/components/blocks/faqs/faqs';
import FeaturesSection from '@/components/blocks/features/features';
import Features3Section from '@/components/blocks/features/features3';
import HeroSection from '@/components/blocks/hero/hero';
import Integration3Section from '@/components/blocks/integration/integration3';
import MediaShowcaseSection from '@/components/blocks/media-showcase/media-showcase';
import PricingSection from '@/components/blocks/pricing/pricing';
import CrispChat from '@/components/layout/crisp-chat';
import { MediaGeneratorWorkspace } from '@/components/marketing/media-generator/media-generator-workspace';
import type { MediaType } from '@/components/marketing/media-generator/types';
import { NewsletterCard } from '@/components/newsletter/newsletter-card';
import { constructMetadata } from '@/lib/metadata';
import { getSession } from '@/lib/server';
import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { cookies } from 'next/headers';

const MEDIA_STUDIO_SELECTION_COOKIE = 'media-studio-selection';
const MEDIA_TYPES: MediaType[] = ['video', 'image', 'audio'];

const readMediaStudioSelection = async () => {
  const cookieStore = await cookies();
  const rawValue = cookieStore.get(MEDIA_STUDIO_SELECTION_COOKIE)?.value;
  if (!rawValue) {
    return null;
  }
  try {
    const decoded = decodeURIComponent(rawValue);
    const parsed = JSON.parse(decoded) as {
      mediaType?: MediaType;
      modelId?: string;
    };
    if (!parsed?.mediaType || !MEDIA_TYPES.includes(parsed.mediaType)) {
      return null;
    }
    return {
      mediaType: parsed.mediaType,
      modelId: typeof parsed.modelId === 'string' ? parsed.modelId : undefined,
    };
  } catch {
    return null;
  }
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata | undefined> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return constructMetadata({
    title: 'Media Studio | ' + t('title'),
    description:
      'Create immersive AI media with unified workflows for video, image, and audio generation plus multi-track editing.',
    locale,
    pathname: '/media-studio',
  });
}

export default async function MediaStudioPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const session = await getSession();
  const isLoggedIn = Boolean(session?.user);
  const selection = await readMediaStudioSelection();
  const faq = await getTranslations({ locale, namespace: 'HomePage.faqs' });
  const faqItems = Object.values(
    (faq.raw as (key: string) => unknown)('items') as Record<
      string,
      { question: string; answer: string }
    >
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

  if (isLoggedIn) {
    return (
      <main className="relative h-screen w-full overflow-hidden bg-[#0B0D10] text-white antialiased [background-image:radial-gradient(80%_60%_at_20%_0%,rgba(59,130,246,0.25),rgba(2,2,2,0)),radial-gradient(60%_50%_at_80%_10%,rgba(249,115,22,0.18),rgba(2,2,2,0)),linear-gradient(180deg,rgba(15,23,42,0.6),rgba(2,2,2,0.9))]">
        <MediaGeneratorWorkspace
          className="h-full w-full max-h-screen"
          persistKey="media-studio-selection"
          initialMediaType={selection?.mediaType}
          preferredModelId={selection?.modelId}
        />
      </main>
    );
  }

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden overflow-y-auto">
      <section className="relative h-screen w-full overflow-hidden">
        <MediaGeneratorWorkspace
          className="h-full w-full max-h-screen"
          persistKey="media-studio-selection"
          initialMediaType={selection?.mediaType}
          preferredModelId={selection?.modelId}
        />
      </section>
      <div className="relative isolate flex flex-col">
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD needed for SEO.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <HeroSection />
        <Integration3Section />
        <FeaturesSection />
        <Features3Section />
        <MediaShowcaseSection />
        <PricingSection />
        <FaqSection />
        <CallToActionSection />
        <NewsletterCard />
        <CrispChat />
      </div>
    </main>
  );
}
