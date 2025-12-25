'use client';

import type { VideoGeneratorAsset } from '@/components/marketing/media-generator/types';

const DEFAULT_IMAGE = '/images/media/fengmian.jpg';

interface ImageCardProps {
  asset: VideoGeneratorAsset;
  cardRef: React.RefObject<HTMLDivElement>;
}

export function ImageCard({ asset, cardRef }: ImageCardProps) {
  const isError = isErrorStatus(asset.status);
  const isLoading = isInProgressStatus(asset.status);
  const modelLabel = asset.modelName ?? asset.tags[1] ?? '—';

  const resolvedSrc = (() => {
    if (isError) {
      return DEFAULT_IMAGE;
    }
    if (isLoading) {
      return DEFAULT_IMAGE;
    }
    return asset.src || DEFAULT_IMAGE;
  })();

  return (
    <article
      ref={cardRef}
      className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.02] to-black/40 shadow-lg"
    >
      <div className="relative bg-black aspect-square">
        <img
          src={resolvedSrc}
          alt={asset.prompt || asset.title}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        {isLoading && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          </div>
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
