'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { buildPublicFileDownloadUrl } from '@/lib/file-transfer';
import { useEffect, useMemo, useState } from 'react';
import type { MediaFeedItem, MediaFeedResponse } from '../types';

type RemoteImagePickerItem = {
  fileUuid: string;
  downloadUrl: string;
  previewUrl: string;
  createdAt?: string;
};

type RemoteImagePickerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (item: RemoteImagePickerItem) => void;
  apiBaseUrl?: string;
  limit?: number;
};

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
  limit = 6,
}: RemoteImagePickerDialogProps) {
  const [items, setItems] = useState<RemoteImagePickerItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fallbackTenantId = useMemo(
    () => process.env.NEXT_PUBLIC_TENANT_ID || '0',
    []
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    const controller = new AbortController();
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          mediaTypes: 'IMAGE',
          limit: String(limit),
          sort: 'desc',
        });
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
          .filter((item) => typeof item.fileUuid === 'string')
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
            return {
              fileUuid: item.fileUuid as string,
              previewUrl,
              downloadUrl,
              createdAt: item.createdAt,
            };
          })
          .filter((item) => item.previewUrl.length > 0)
          .slice(0, limit);

        setItems(nextItems);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        const message =
          err instanceof Error ? err.message : 'Failed to load images.';
        console.error('加载远程图片失败', err);
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    load();

    return () => {
      controller.abort();
    };
  }, [open, apiBaseUrl, limit, fallbackTenantId]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: limit }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="h-24 rounded-xl border border-white/10 bg-white/5 animate-pulse"
            />
          ))}
        </div>
      );
    }

    if (error) {
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
      <div className="grid grid-cols-3 gap-3">
        {items.map((item) => (
          <button
            key={item.fileUuid}
            type="button"
            className="group relative overflow-hidden rounded-xl border border-white/10 bg-black/40 text-left transition hover:border-blue-400/60 hover:shadow-[0_0_0_1px_rgba(37,99,235,0.35),0_12px_30px_rgba(37,99,235,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
            onClick={() => {
              onSelect(item);
              onOpenChange(false);
            }}
          >
            <img
              src={item.previewUrl}
              alt="Remote image"
              className="h-24 w-full object-cover transition duration-200 group-hover:scale-[1.02]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 transition group-hover:opacity-100" />
            <div className="pointer-events-none absolute bottom-2 left-2 rounded-full border border-white/10 bg-black/70 px-2 py-1 text-[10px] font-semibold text-white/80 opacity-0 transition group-hover:opacity-100">
              Use
            </div>
          </button>
        ))}
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
          Latest 6 images from your workspace.
        </p>
        <div className="mt-4">{renderContent()}</div>
      </DialogContent>
    </Dialog>
  );
}
