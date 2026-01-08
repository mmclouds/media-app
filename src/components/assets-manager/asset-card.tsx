'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLayoutEffect, useMemo, useRef } from 'react';
import { AudioCard } from './audio-card';
import { ImageCard } from './image-card';
import type { AssetCardProps } from './types';
import { VideoCard } from './video-card';

export function AssetCard({ asset, onHeightChange }: AssetCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const params = useParams();
  const locale = useMemo(() => {
    const rawLocale = params?.locale;
    if (typeof rawLocale === 'string') {
      return rawLocale;
    }
    if (Array.isArray(rawLocale) && rawLocale.length > 0) {
      return rawLocale[0];
    }
    return 'en';
  }, [params]);

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
    if (!asset.taskId) {
      return content;
    }
    return (
      <Link
        href={`/${locale}/assets/${asset.taskId}`}
        className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        aria-label="View details"
      >
        {content}
      </Link>
    );
  }
}
