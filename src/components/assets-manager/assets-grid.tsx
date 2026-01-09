'use client';

import type { VideoGeneratorAsset } from '@/components/marketing/media-generator/types';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useVirtualFeed } from '@/hooks/use-virtual-feed';
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AssetCard } from './asset-card';

interface AssetsGridProps {
  assets: VideoGeneratorAsset[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onOpenDetail?: (asset: VideoGeneratorAsset) => void;
  className?: string;
}

const COLUMN_BREAKPOINTS = [
  { minWidth: 1280, columns: 6 },
  { minWidth: 1024, columns: 5 },
  { minWidth: 896, columns: 4 },
  { minWidth: 640, columns: 3 },
  { minWidth: 0, columns: 2 },
];
const ROW_GAP_PX = 12;
const ESTIMATED_META_HEIGHT = 88;
const VIRTUAL_OVERSCAN_PX = 800;
const VIRTUALIZE_AFTER_ROWS = 8;

type AssetRow = {
  id: string;
  items: VideoGeneratorAsset[];
};

export function AssetsGrid({
  assets,
  isLoading,
  hasMore,
  onLoadMore,
  onOpenDetail,
  className,
}: AssetsGridProps) {
  const user = useCurrentUser();
  const isLoggedIn = !!user?.id;
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useLayoutEffect(() => {
    if (!gridRef.current) {
      return;
    }
    const element = gridRef.current;
    const updateWidth = () => {
      setContainerWidth(element.clientWidth);
    };
    updateWidth();
    const observer = new ResizeObserver(() => {
      updateWidth();
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, []);

  const columns = useMemo(() => {
    const match = COLUMN_BREAKPOINTS.find(
      (item) => containerWidth >= item.minWidth
    );
    return match ? match.columns : 2;
  }, [containerWidth]);

  const rows = useMemo<AssetRow[]>(() => {
    if (!assets.length) {
      return [];
    }
    const nextRows: AssetRow[] = [];
    for (let index = 0; index < assets.length; index += columns) {
      const slice = assets.slice(index, index + columns);
      const idSeed = slice[0]?.id ?? `${index}`;
      nextRows.push({
        id: `row-${index}-${idSeed}`,
        items: slice,
      });
    }
    return nextRows;
  }, [assets, columns]);

  const estimatedRowHeight = useMemo(() => {
    if (!containerWidth || columns <= 0) {
      return 320;
    }
    const totalGap = ROW_GAP_PX * Math.max(0, columns - 1);
    const cardWidth = (containerWidth - totalGap) / columns;
    return Math.round(cardWidth + ESTIMATED_META_HEIGHT + ROW_GAP_PX);
  }, [containerWidth, columns]);

  const { range, topSpacer, bottomSpacer, registerHeight } = useVirtualFeed({
    items: rows,
    scrollRef: gridRef,
    estimatedItemHeight: estimatedRowHeight,
    overscan: VIRTUAL_OVERSCAN_PX,
    enabled: rows.length > VIRTUALIZE_AFTER_ROWS,
  });

  const visibleRows =
    rows.length > VIRTUALIZE_AFTER_ROWS
      ? rows.slice(range.start, Math.min(range.end + 1, rows.length))
      : rows;

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
      <div className="px-0">
        {rows.length > VIRTUALIZE_AFTER_ROWS && topSpacer > 0 ? (
          <div style={{ height: topSpacer }} aria-hidden />
        ) : null}

        {visibleRows.map((row) => (
          <AssetsRow
            key={row.id}
            row={row}
            columns={columns}
            onOpenDetail={onOpenDetail}
            onHeightChange={
              rows.length > VIRTUALIZE_AFTER_ROWS
                ? (height) => registerHeight(row.id, height)
                : undefined
            }
          />
        ))}

        {rows.length > VIRTUALIZE_AFTER_ROWS && bottomSpacer > 0 ? (
          <div style={{ height: bottomSpacer }} aria-hidden />
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

function AssetsRow({
  row,
  columns,
  onHeightChange,
  onOpenDetail,
}: {
  row: AssetRow;
  columns: number;
  onHeightChange?: (height: number) => void;
  onOpenDetail?: (asset: VideoGeneratorAsset) => void;
}) {
  const rowRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!rowRef.current || !onHeightChange) {
      return;
    }
    const measure = () => {
      const rect = rowRef.current?.getBoundingClientRect();
      if (rect) {
        onHeightChange(rect.height);
      }
    };
    measure();
    const observer = new ResizeObserver(() => {
      measure();
    });
    observer.observe(rowRef.current);
    return () => {
      observer.disconnect();
    };
  }, [onHeightChange]);

  return (
    <div
      ref={rowRef}
      className="grid gap-3 pb-3"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {row.items.map((asset) => (
        <AssetCard
          key={asset.id}
          asset={asset}
          onOpenDetail={onOpenDetail}
        />
      ))}
    </div>
  );
}
