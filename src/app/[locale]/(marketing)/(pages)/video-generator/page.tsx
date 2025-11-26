import { VideoGeneratorSection } from '@/components/marketing/video-generator-section';
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

  return constructMetadata({
    title: 'Video Generator | ' + t('title'),
    description:
      'Create immersive video stories with our upcoming AI-powered video generator.',
    canonicalUrl: getUrlWithLocale('/video-generator', locale),
  });
}

export default async function VideoGeneratorPage(props: NextPageProps) {
  const params = await props.params;
  const locale = params?.locale as Locale | undefined;

  return (
    <VideoGeneratorSection locale={locale} />
  );
}
