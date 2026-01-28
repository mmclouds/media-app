'use client';

import type { VideoGeneratorAsset } from '@/components/marketing/media-generator/types';
import { useHoverPlayback } from '@/hooks/use-hover-playback';
import { useVideoPoster } from '@/hooks/use-video-poster';

const DEFAULT_POSTER = '/images/media/fengmian.jpg';
const FAILED_POSTER =
  'https://images.unsplash.com/photo-1527443224154-d1af1e991e5d?auto=format&fit=crop&w=1200&q=80';
const DEFAULT_ERROR_MESSAGE = 'Generation failed. Please try again.';

interface VideoCardProps {
  asset: VideoGeneratorAsset;
  cardRef: React.RefObject<HTMLDivElement | null>;
}

export function VideoCard({ asset, cardRef }: VideoCardProps) {
  const { videoRef, handleMouseEnter, handleMouseLeave, handleMediaReady } =
    useHoverPlayback();

  const shouldCapturePoster = !asset.poster && Boolean(asset.src);
  const { poster: autoPoster } = useVideoPoster(
    shouldCapturePoster ? asset.src : undefined
  );

  const isError = isErrorStatus(asset.status);
  const isLoading = isInProgressStatus(asset.status);
  const modelLabel = asset.modelName ?? asset.tags[1] ?? '—';
  const resolvedErrorMessage =
    typeof asset.errorMessage === 'string' &&
    asset.errorMessage.trim().length > 0
      ? asset.errorMessage
      : DEFAULT_ERROR_MESSAGE;

  const resolvedPoster = (() => {
    if (isError) {
      return FAILED_POSTER;
    }
    if (isLoading) {
      return DEFAULT_POSTER;
    }
    return asset.poster ?? autoPoster ?? DEFAULT_POSTER;
  })();

  const resolvedSrc = isError ? undefined : isLoading ? '' : asset.src || '';

  const handleVideoLoaded = () => {
    handleMediaReady();
  };

  return (
    <article
      ref={cardRef}
      className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.02] to-black/40 shadow-lg"
    >
      <div
        className="relative bg-black aspect-video"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {isError ? (
          <div className="relative w-full h-full overflow-hidden">
            ß
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 flex items-center justify-center px-4 text-center">
              <p
                role="alert"
                className="text-sm font-semibold leading-relaxed text-white"
              >
                {resolvedErrorMessage}
              </p>
            </div>
          </div>
        ) : (
          <video
            ref={videoRef}
            key={asset.id}
            src={resolvedSrc || undefined}
            crossOrigin="anonymous"
            loop
            playsInline
            poster={resolvedPoster}
            className="w-full h-full bg-black object-cover"
            onLoadedData={handleVideoLoaded}
          />
        )}
      </div>

      <div className="p-3 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-medium text-white/60 bg-white/5 px-2 py-1 rounded">
            {modelLabel}
          </span>
          <span className="text-[10px] text-white/40 ml-auto">
            {formatTime(asset.createdAt)}
          </span>
        </div>

        <p className="text-xs text-white/80 line-clamp-2">
          {asset.prompt || asset.title}
        </p>
      </div>
    </article>
  );
}

function isErrorStatus(status?: string | null) {
  const normalized = status?.toLowerCase();
  if (!normalized) {
    return false;
  }
  return normalized === 'failed' || normalized === 'timeout';
}

function isInProgressStatus(status?: string | null) {
  const normalized = status?.toLowerCase();
  if (!normalized) {
    return false;
  }
  return normalized === 'pending' || normalized === 'processing';
}

function formatTime(dateString?: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}
