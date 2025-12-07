import { MediaOnlyGeneratorWorkspace } from '@/components/marketing/media-generator/media-only-generator-workspace';
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
    title: 'Veo 3 Studio | ' + t('title'),
    description:
      'Generate Veo 3 videos with pre-tuned defaults and a focused video-only workspace.',
    locale,
    pathname: '/media-studio/veo3',
  });
}

export default async function Veo3StudioPage() {
  return (
    <main className="min-h-screen w-full bg-[#020202] px-6 py-10 text-white">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.28em] text-white/40">
            Video model
          </p>
          <h1 className="text-3xl font-semibold text-white">Veo 3 Studio</h1>
          <p className="text-sm text-white/60">
            Start with the Veo 3 preset locked to video for faster iteration.
          </p>
        </header>

        <MediaOnlyGeneratorWorkspace
          className="h-[720px]"
          preferredModelId="veo3"
        />
      </div>
    </main>
  );
}
