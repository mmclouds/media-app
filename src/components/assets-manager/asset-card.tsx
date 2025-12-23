'use client';

import { useLayoutEffect, useRef } from 'react';
import { useHoverPlayback } from '@/hooks/use-hover-playback';
import type { AssetCardProps } from './types';
import { VideoCard } from './video-card';
import { ImageCard } from './image-card';
import { AudioCard } from './audio-card';

export function AssetCard({ asset, onHeightChange }: AssetCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);

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
    return <VideoCard asset={asset} cardRef={cardRef} />;
  }

  if (mediaType === 'image') {
    return <ImageCard asset={asset} cardRef={cardRef} />;
  }

  if (mediaType === 'audio') {
    return <AudioCard asset={asset} cardRef={cardRef} />;
  }

  // Default to video card
  return <VideoCard asset={asset} cardRef={cardRef} />;
}