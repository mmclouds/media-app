import { VideoGeneratorWorkspace } from '@/components/marketing/video-generator/workspace';
import { constructMetadata } from '@/lib/metadata';
import { getUrlWithLocale } from '@/lib/urls/urls';
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
    canonicalUrl: getUrlWithLocale('/video-generator', locale),
  });
}

export default async function VideoGeneratorPage() {
  return (
    <main className="min-h-screen bg-[#020202] pb-24 pt-16 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <div className="space-y-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.5em] text-white/60">
            Video intelligence
          </p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Multi-modal AI video generation, demo ready
          </h1>
          <p className="mx-auto max-w-2xl text-base text-white/70 sm:text-lg">
            Swap subjects across footage, blend stills with animation, and
            preview motion in real time. This interactive workspace mirrors the
            production tooling we are shipping for enterprise creators.
          </p>
        </div>

        <VideoGeneratorWorkspace />
      </div>
    </main>
  );
}
