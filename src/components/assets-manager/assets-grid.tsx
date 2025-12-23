'use client';

import { useRef, useCallback } from 'react';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useVirtualFeed } from '@/hooks/use-virtual-feed';
import { AssetCard } from './asset-card';
import type { VideoGeneratorAsset } from '@/components/marketing/media-generator/types';

interface AssetsGridProps {
  assets: VideoGeneratorAsset[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  className?: string;
}

const ESTIMATED_CARD_HEIGHT = 320;

export function AssetsGrid({
  assets,
  isLoading,
  hasMore,
  onLoadMore,
  className,
}: AssetsGridProps) {
  const user = useCurrentUser();
  const isLoggedIn = !!user?.id;
  const gridRef = useRef<HTMLDivElement | null>(null);

  const {
    range,
    topSpacer,
    bottomSpacer,
    registerHeight,
  } = useVirtualFeed({
    items: assets,
    scrollRef: gridRef,
    estimatedItemHeight: ESTIMATED_CARD_HEIGHT,
    enabled: assets.length > 12,
  });

  const visibleAssets = assets.length > 12
    ? assets.slice(range.start, Math.min(range.end + 1, assets.length))
    : assets;

  const handleScroll = useCallback(() => {
    if (isLoading || !hasMore || !gridRef.current) return;

    const { scrollTop, clientHeight, scrollHeight } = gridRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 240) {
      onLoadMore();
    }
  }, [isLoading, hasMore, onLoadMore]);

  return (
    <div
      ref={gridRef}
      onScroll={handleScroll}
      className={`flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${className || ''}`}
    >
      <div className="grid grid-cols-2 gap-4 px-1">
        {assets.length > 12 && topSpacer > 0 ? (
          <div style={{ height: topSpacer }} aria-hidden className="col-span-full" />
        ) : null}

        {visibleAssets.map((asset, index) => {
          const absoluteIndex = assets.length > 12 ? range.start + index : index;
          return (
            <AssetCard
              key={asset.id}
              asset={asset}
              onHeightChange={assets.length > 12 ?
                (height) => registerHeight(asset.id, height) :
                undefined
              }
            />
          );
        })}

        {assets.length > 12 && bottomSpacer > 0 ? (
          <div style={{ height: bottomSpacer }} aria-hidden className="col-span-full" />
        ) : null}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center gap-2 py-8 text-xs text-white/60">
          <div className="h-2 w-2 animate-pulse rounded-full bg-[#64ff6a]" />
          Loading your assets...
        </div>
      )}

      {!hasMore && assets.length > 0 && (
        <div className="py-8 text-center text-xs text-white/40">
          You reached the end of this feed.
        </div>
      )}

      {!isLoggedIn && (
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/80 mb-4">
          <div className="h-2 w-2 rounded-full bg-[#64ff6a]" />
          Sign in to view your assets.
        </div>
      )}
    </div>
  );
}