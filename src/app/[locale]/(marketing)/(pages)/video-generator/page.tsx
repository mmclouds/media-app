import { VideoGeneratorWorkspace } from '@/components/marketing/video-generator/workspace';
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
    title: 'Video Generator | ' + t('title'),
    description:
      'Experience a cinematic AI video workflow with text-to-video, image-to-video, and multi-element editing.',
    locale,
    pathname: '/video-generator',
  });
}

export default async function VideoGeneratorPage() {
  return (
    <main className="h-screen w-full overflow-hidden bg-[#020202] text-white">
      <VideoGeneratorWorkspace className="h-full w-full" />
    </main>
  );
}
