import { MediaOnlyGeneratorWorkspace } from '@/components/marketing/media-generator/media-only-workspace';
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
    title: 'Media Studio | ' + t('title'),
    description:
      'Create immersive AI media with unified workflows for video, image, and audio generation plus multi-track editing.',
    locale,
    pathname: '/media-studio',
  });
}

export default async function MediaStudioPage() {
  return (
    <main className="h-screen w-full overflow-hidden bg-[#020202] text-white">
      <MediaOnlyGeneratorWorkspace className="h-full w-full" />
    </main>
  );
}
