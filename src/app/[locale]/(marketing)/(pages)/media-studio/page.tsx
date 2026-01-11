import { MediaGeneratorWorkspace } from '@/components/marketing/media-generator/media-generator-workspace';
import { constructMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import type { MediaType } from '@/components/marketing/media-generator/types';
import type { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';

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

export default async function MediaStudioPage() {
  const selection = await readMediaStudioSelection();

  return (
    <main className="h-[100dvh] w-full overflow-hidden bg-[#020202] text-white">
      <MediaGeneratorWorkspace
        className="h-full w-full max-h-[100dvh]"
        persistKey="media-studio-selection"
        initialMediaType={selection?.mediaType}
        preferredModelId={selection?.modelId}
      />
    </main>
  );
}
