'use client';

import { useLayoutEffect, useMemo, useRef } from 'react';
import { AudioCard } from './audio-card';
import { ImageCard } from './image-card';
import type { AssetCardProps } from './types';
import { VideoCard } from './video-card';

export function AssetCard({
  asset,
  onHeightChange,
  onOpenDetail,
}: AssetCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const canOpenDetail = useMemo(
    () => Boolean(asset.taskId && onOpenDetail),
    [asset.taskId, onOpenDetail]
  );

  useLayoutEffect(() => {
    if (!cardRef.current || !onHeightChange) {
      return;
    }
    const measure = () => {
      const rect = cardRef.current?.getBoundingClientRect();
      if (rect) {
        onHeightChange(rect.height);
      }
    };
    measure();
    const observer = new ResizeObserver(() => {
      measure();
    });
    observer.observe(cardRef.current);
    return () => {
      observer.disconnect();
    };
  }, [onHeightChange]);

  // Determine card type based on asset
  const mediaType = asset.tags[0]?.toLowerCase() || 'video';

  if (mediaType === 'video') {
    return renderWithLink(<VideoCard asset={asset} cardRef={cardRef} />);
  }

  if (mediaType === 'image') {
    return renderWithLink(<ImageCard asset={asset} cardRef={cardRef} />);
  }

  if (mediaType === 'audio') {
    return renderWithLink(<AudioCard asset={asset} cardRef={cardRef} />);
  }

  // Default to video card
  return renderWithLink(<VideoCard asset={asset} cardRef={cardRef} />);

  function renderWithLink(content: React.ReactElement) {
    if (!asset.taskId || !canOpenDetail) {
      return content;
    }
    return (
      <button
        type="button"
        onClick={() => onOpenDetail?.(asset)}
        className="block w-full rounded-2xl p-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        aria-label="View details"
      >
        {content}
      </button>
    );
  }
}
