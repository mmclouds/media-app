'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { buildPublicFileDownloadUrl } from '@/lib/file-transfer';
import type { MediaFeedItem, MediaFeedResponse } from '../types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useVirtualFeed } from '@/hooks/use-virtual-feed';

type RemoteImagePickerItem = {
  id: string;
  fileUuid: string;
  downloadUrl: string;
  previewUrl: string;
  createdAt?: string;
  status?: string;
  isReady: boolean;
};

type RemoteImagePickerRow = {
  id: string;
  items: RemoteImagePickerItem[];
};

type RemoteImagePickerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (item: RemoteImagePickerItem) => void;
  apiBaseUrl?: string;
  limit?: number;
};

const COLUMN_COUNT = 3;
const ROW_GAP_PX = 12;
const ESTIMATED_ROW_HEIGHT = 96 + ROW_GAP_PX;
const VIRTUAL_OVERSCAN_PX = 360;
const VIRTUALIZE_AFTER_ROWS = 6;

const resolvePreviewUrl = (
  item: MediaFeedItem,
  fallbackTenantId: string,
  apiBaseUrl?: string
) => {
  if (item.temporaryFileUrl) {
    return item.temporaryFileUrl;
  }
  if (item.downloadUrl) {
    return item.downloadUrl;
  }
  if (item.onlineUrl) {
    return item.onlineUrl;
  }
  if (item.fileUuid) {
    return buildPublicFileDownloadUrl({
      uuid: item.fileUuid,
      tenantId: fallbackTenantId,
      apiBaseUrl,
    });
  }
  return '';
};

const resolveDownloadUrl = (
  item: MediaFeedItem,
  fallbackTenantId: string,
  apiBaseUrl?: string
) => {
  if (item.fileUuid) {
    return buildPublicFileDownloadUrl({
      uuid: item.fileUuid,
      tenantId: fallbackTenantId,
      apiBaseUrl,
    });
  }
  return item.downloadUrl ?? item.onlineUrl ?? item.temporaryFileUrl ?? '';
};

export function RemoteImagePickerDialog({
  open,
  onOpenChange,
  onSelect,
  apiBaseUrl,
  limit = 9,
}: RemoteImagePickerDialogProps) {
  const [items, setItems] = useState<RemoteImagePickerItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const loadingRef = useRef(false);
  const openedRef = useRef(false);
  const fallbackTenantId = useMemo(
    () => process.env.NEXT_PUBLIC_TENANT_ID || '0',
    []
  );

  const loadImages = useCallback(
    async (options?: { cursor?: string | null; replace?: boolean }) => {
      if (loadingRef.current) {
        return;
      }
      loadingRef.current = true;
      setIsLoading(true);
      setError(null);
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const params = new URLSearchParams({
          mediaTypes: 'IMAGE',
          limit: String(limit),
          sort: 'desc',
        });
        if (options?.cursor) {
          params.set('cursor', options.cursor);
        }
        const response = await fetch(`/api/media/feed?${params.toString()}`, {
          method: 'GET',
          cache: 'no-store',
          signal: controller.signal,
        });
        const result = (await response.json().catch(() => null)) as
          | MediaFeedResponse
          | { error?: string; message?: string }
          | null;

        if (!response.ok || !result) {
          const message =
            (result as { error?: string; message?: string })?.error ??
            (result as { error?: string; message?: string })?.message ??
            'Failed to load images.';
          throw new Error(message);
        }

        const data = result as MediaFeedResponse;
        const nextItems = (data.content ?? [])
          .map((item) => {
            const previewUrl = resolvePreviewUrl(
              item,
              fallbackTenantId,
              apiBaseUrl
            );
            const downloadUrl = resolveDownloadUrl(
              item,
              fallbackTenantId,
              apiBaseUrl
            );
            const fileUuid =
              typeof item.fileUuid === 'string'
                ? item.fileUuid
                : typeof item.coverFileUuid === 'string'
                  ? item.coverFileUuid
                  : '';
            const id =
              fileUuid ||
              item.uuid ||
              downloadUrl ||
              previewUrl ||
              `${Date.now()}-${Math.random()}`;
            const isReady = previewUrl.length > 0;
            return {
              id,
              fileUuid,
              previewUrl,
              downloadUrl,
              createdAt: item.createdAt,
              status: item.status,
              isReady,
            };
          });

        setItems((prev) => {
          const baseItems = options?.replace ? [] : prev;
          const merged = new Map<string, RemoteImagePickerItem>();
          baseItems.forEach((item) => merged.set(item.id, item));
          nextItems.forEach((item) => merged.set(item.id, item));
          return Array.from(merged.values());
        });
        setCursor(data.nextCursor ?? null);
        setHasMore(Boolean(data.hasMore ?? data.nextCursor));
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        const message =
          err instanceof Error ? err.message : 'Failed to load images.';
        console.error('加载远程图片失败', err);
        setError(message);
      } finally {
        loadingRef.current = false;
        setIsLoading(false);
      }
    },
    [apiBaseUrl, fallbackTenantId, limit]
  );

  useEffect(() => {
    if (!open) {
      abortRef.current?.abort();
      openedRef.current = false;
      return;
    }
    if (openedRef.current) {
      return;
    }
    openedRef.current = true;
    setItems([]);
    setCursor(null);
    setHasMore(true);
    setError(null);
    loadImages({ replace: true });
  }, [open, loadImages]);

  useEffect(() => {
    if (!open || isLoading || !hasMore) {
      return;
    }
    const container = scrollRef.current;
    if (!container) {
      return;
    }
    const { scrollHeight, clientHeight } = container;
    if (scrollHeight <= clientHeight + 4) {
      loadImages({ cursor });
    }
  }, [open, isLoading, hasMore, items.length, cursor, loadImages]);

  const rows = useMemo<RemoteImagePickerRow[]>(() => {
    if (!items.length) {
      return [];
    }
    const nextRows: RemoteImagePickerRow[] = [];
    for (let index = 0; index < items.length; index += COLUMN_COUNT) {
      const slice = items.slice(index, index + COLUMN_COUNT);
      const idSeed = slice[0]?.id ?? `${index}`;
      nextRows.push({
        id: `row-${index}-${idSeed}`,
        items: slice,
      });
    }
    return nextRows;
  }, [items]);

  const { range, topSpacer, bottomSpacer, registerHeight } = useVirtualFeed({
    items: rows,
    scrollRef,
    estimatedItemHeight: ESTIMATED_ROW_HEIGHT,
    overscan: VIRTUAL_OVERSCAN_PX,
    enabled: rows.length > VIRTUALIZE_AFTER_ROWS,
  });

  const visibleRows =
    rows.length > VIRTUALIZE_AFTER_ROWS
      ? rows.slice(range.start, Math.min(range.end + 1, rows.length))
      : rows;

  const handleScroll = useCallback(() => {
    if (isLoading || !hasMore || !scrollRef.current) {
      return;
    }
    const { scrollTop, clientHeight, scrollHeight } = scrollRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 180) {
      loadImages({ cursor });
    }
  }, [cursor, hasMore, isLoading, loadImages]);

  const renderContent = () => {
    if (isLoading && items.length === 0) {
      return (
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: Math.min(limit, 9) }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="h-24 rounded-xl border border-white/10 bg-white/5 animate-pulse"
            />
          ))}
        </div>
      );
    }

    if (error && items.length === 0) {
      return (
        <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-xs text-rose-200">
          {error}
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center text-sm text-white/70">
          No recent images yet.
        </div>
      );
    }

    return (
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="max-h-[420px] overflow-y-auto pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {error && items.length > 0 && (
          <div className="mb-3 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-200">
            {error}
          </div>
        )}
        {rows.length > VIRTUALIZE_AFTER_ROWS && topSpacer > 0 ? (
          <div style={{ height: topSpacer }} aria-hidden />
        ) : null}

        {visibleRows.map((row) => (
          <RemoteImagePickerRow
            key={row.id}
            row={row}
            onSelect={onSelect}
            onOpenChange={onOpenChange}
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

        {isLoading && items.length > 0 && (
          <div className="flex items-center justify-center gap-2 py-6 text-xs text-white/60">
            <div className="h-2 w-2 animate-pulse rounded-full bg-blue-400" />
            Loading more images...
          </div>
        )}

        {!hasMore && items.length > 0 && (
          <div className="py-6 text-center text-xs text-white/40">
            You reached the end of this feed.
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-3xl rounded-2xl border border-white/10 bg-[#0b0b0d] p-6 text-white shadow-[0_20px_60px_rgba(0,0,0,0.55)]"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <DialogTitle className="text-lg font-semibold text-white">
          Choose from library
        </DialogTitle>
        <p className="mt-1 text-xs text-white/60">
          Scroll to load more images from your workspace.
        </p>
        <p className="mt-1 text-[11px] text-white/45">
          Only completed images are selectable.
        </p>
        <div className="mt-4">{renderContent()}</div>
      </DialogContent>
    </Dialog>
  );
}

function RemoteImagePickerRow({
  row,
  onSelect,
  onOpenChange,
  onHeightChange,
}: {
  row: RemoteImagePickerRow;
  onSelect: (item: RemoteImagePickerItem) => void;
  onOpenChange: (open: boolean) => void;
  onHeightChange?: (height: number) => void;
}) {
  const rowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
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
      style={{ gridTemplateColumns: `repeat(${COLUMN_COUNT}, minmax(0, 1fr))` }}
    >
      {row.items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`group relative overflow-hidden rounded-xl border border-white/10 bg-black/40 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 ${item.isReady
              ? 'hover:border-blue-400/60 hover:shadow-[0_0_0_1px_rgba(37,99,235,0.35),0_12px_30px_rgba(37,99,235,0.25)]'
              : 'cursor-not-allowed opacity-70'
            }`}
          onClick={() => {
            if (!item.isReady) {
              return;
            }
            onSelect(item);
            onOpenChange(false);
          }}
          disabled={!item.isReady}
          aria-disabled={!item.isReady}
        >
          {item.isReady ? (
            <img
              src={item.previewUrl}
              alt="Remote image"
              loading="lazy"
              decoding="async"
              className="h-24 w-full object-cover transition duration-200 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-24 w-full flex-col items-center justify-center gap-1 bg-white/5 text-[11px] text-white/60">
              <span className="h-2 w-2 animate-pulse rounded-full bg-white/50" />
              {item.status === 'IN_PROGRESS' ? 'Generating' : 'Unavailable'}
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 transition group-hover:opacity-100" />
          <div className="pointer-events-none absolute bottom-2 left-2 rounded-full border border-white/10 bg-black/70 px-2 py-1 text-[10px] font-semibold text-white/80 opacity-0 transition group-hover:opacity-100">
            Use
          </div>
        </button>
      ))}
    </div>
  );
}
