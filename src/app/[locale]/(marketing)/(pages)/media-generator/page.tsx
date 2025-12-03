import { MediaGeneratorWorkspace } from '@/components/marketing/media-generator/workspace';
import { constructMetadata } from '@/lib/metadata';
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
    title: 'Media Generator | ' + t('title'),
    description:
      'Experiment with AI-generated media across video, image, and audio workflows with flexible model presets.',
    locale,
    pathname: '/media-generator',
  });
}

export default async function MediaGeneratorPage() {
  return (
    <main className="h-screen w-full overflow-hidden bg-[#020202] text-white">
      <MediaGeneratorWorkspace className="h-full w-full" />
    </main>
  );
}
