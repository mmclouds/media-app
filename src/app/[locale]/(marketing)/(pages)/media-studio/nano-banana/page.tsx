import { MediaGeneratorWorkspaceWithDefaults } from '@/components/marketing/media-generator/media-generator-workspace-with-defaults';
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
    title: 'Nano Banana Studio | ' + t('title'),
    description:
      'Generate images with Nano Banana defaults and keep the full model switcher at hand.',
    locale,
    pathname: '/media-studio/nano-banana',
  });
}

export default async function NanoBananaStudioPage() {
  return (
    <main className="min-h-screen w-full bg-[#020202] px-6 py-10 text-white">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.28em] text-white/40">
            Image model
          </p>
          <h1 className="text-3xl font-semibold text-white">
            Nano Banana Studio
          </h1>
          <p className="text-sm text-white/60">
            Start with Nano Banana defaults while keeping every model switch
            within reach.
          </p>
        </header>

        <MediaGeneratorWorkspaceWithDefaults
          className="h-[720px]"
          initialMediaType="image"
          preferredModelId="nano-banana"
        />
      </div>
    </main>
  );
}
