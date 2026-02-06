import { MediaGeneratorWorkspace } from '@/components/marketing/media-generator/media-generator-workspace';
import type { MediaType } from '@/components/marketing/media-generator/types';
import { constructMetadata } from '@/lib/metadata';
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
      'Media Studio lets you create immersive AI media with unified workflows for video, image, and audio generation plus multi-track editing.',
    locale,
    pathname: '/media-studio',
  });
}

export default async function MediaStudioPage() {
  const selection = await readMediaStudioSelection();

  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#0B0D10] text-white antialiased [background-image:radial-gradient(80%_60%_at_20%_0%,rgba(59,130,246,0.25),rgba(2,2,2,0)),radial-gradient(60%_50%_at_80%_10%,rgba(249,115,22,0.18),rgba(2,2,2,0)),linear-gradient(180deg,rgba(15,23,42,0.6),rgba(2,2,2,0.9))]">
      <h1 className="sr-only">Media Studio</h1>
      <MediaGeneratorWorkspace
        className="h-full w-full max-h-screen"
        persistKey="media-studio-selection"
        initialMediaType={selection?.mediaType}
        preferredModelId={selection?.modelId}
      />
    </main>
  );
}
