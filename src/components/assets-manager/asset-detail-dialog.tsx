'use client';

import type { VideoGeneratorAsset } from '@/components/marketing/media-generator/types';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useEffect, useMemo, useState } from 'react';
import {
  AssetDetailTabs,
  type AssetDetailSection,
} from './asset-detail-tabs';

type AssetDetailResponse = {
  taskId?: string | null;
  mediaType?: string | null;
  status?: string | null;
  statusDescription?: string | null;
  onlineUrl?: string | null;
  downloadUrl?: string | null;
  temporaryFileUrl?: string | null;
  fileUuid?: string | null;
  coverFileUuid?: string | null;
  temporaryCoverFileUrl?: string | null;
  providerName?: string | null;
  createdAt?: string | null;
  completedAt?: string | null;
  errorMessage?: string | null;
  progress?: number | null;
  prompt?: string | null;
  modelName?: string | null;
  parameters?: string | Record<string, unknown> | null;
  retryCount?: number | null;
  executionTimeMs?: number | null;
  tenantId?: string | null;
  userId?: string | null;
  errorCode?: string | null;
};

interface AssetDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset?: VideoGeneratorAsset | null;
}

export function AssetDetailDialog({
  open,
  onOpenChange,
  asset,
}: AssetDetailDialogProps) {
  const user = useCurrentUser();
  const isLoggedIn = Boolean(user?.id);
  const taskId = asset?.taskId;

  const [detail, setDetail] = useState<AssetDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setDetail(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    if (!taskId) {
      setDetail(null);
      setError('Asset not found.');
      setIsLoading(false);
      return;
    }

    if (!isLoggedIn) {
      setDetail(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(
          `/api/media/result/${encodeURIComponent(taskId)}`,
          {
            method: 'GET',
            cache: 'no-store',
            signal: controller.signal,
          }
        );
        if (!response.ok) {
          setDetail(null);
          setError(
            response.status === 404 ? 'Asset not found.' : 'Unable to load asset.'
          );
          return;
        }
        const payload = (await response.json().catch(() => null)) as
          | AssetDetailResponse
          | null;
        if (!payload) {
          setDetail(null);
          setError('Asset not found.');
          return;
        }
        setDetail(payload);
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          return;
        }
        console.error('加载资产详情失败:', err);
        setDetail(null);
        setError('Unable to load asset.');
      } finally {
        setIsLoading(false);
      }
    };

    load();
    return () => {
      controller.abort();
    };
  }, [open, taskId, isLoggedIn]);

  const detailData = useMemo(() => {
    if (!detail) {
      return null;
    }

    const prompt =
      typeof detail.prompt === 'string' && detail.prompt.trim().length > 0
        ? detail.prompt.trim()
        : undefined;
    const parsedParameters = parseParameters(detail.parameters);
    const resolvedPrompt = prompt ?? parsedParameters?.prompt;
    const resolution = parsedParameters?.size;
    const duration =
      typeof parsedParameters?.seconds === 'number' && parsedParameters.seconds > 0
        ? `${parsedParameters.seconds}s`
        : undefined;
    const modelName =
      typeof detail.modelName === 'string' && detail.modelName.length > 0
        ? detail.modelName
        : parsedParameters?.model;

    const mediaUrl = resolveMediaUrl(detail);
    const coverUrl = resolveCoverUrl(detail);
    const mediaType = inferMediaType(detail, mediaUrl);

    const overviewItems = compactItems([
      { label: 'Status', value: formatValue(detail.status) },
      { label: 'Description', value: formatValue(detail.statusDescription) },
      { label: 'Media Type', value: mediaType },
      { label: 'Model', value: formatValue(modelName) },
      { label: 'Provider', value: formatValue(detail.providerName) },
      { label: 'Resolution', value: formatValue(resolution) },
      { label: 'Duration', value: formatValue(duration) },
      { label: 'Progress', value: formatValue(formatProgress(detail.progress)) },
      { label: 'Created At', value: formatDateTime(detail.createdAt) },
      { label: 'Completed At', value: formatDateTime(detail.completedAt) },
      { label: 'Execution Time', value: formatDuration(detail.executionTimeMs) },
      { label: 'Retry Count', value: formatValue(detail.retryCount) },
      { label: 'Error', value: formatValue(detail.errorMessage) },
    ]);

    const fileDownloadUrl = buildFileDownloadUrl(detail.fileUuid);
    const coverDownloadUrl = buildFileDownloadUrl(detail.coverFileUuid);
    const fileItems = compactItems([
      { label: 'Media URL', value: mediaUrl, href: mediaUrl },
      {
        label: 'Download URL',
        value: formatValue(detail.downloadUrl),
        href: detail.downloadUrl ?? undefined,
      },
      {
        label: 'Online URL',
        value: formatValue(detail.onlineUrl),
        href: detail.onlineUrl ?? undefined,
      },
      {
        label: 'Temporary URL',
        value: formatValue(detail.temporaryFileUrl),
        href: detail.temporaryFileUrl ?? undefined,
      },
      { label: 'File UUID', value: formatValue(detail.fileUuid), href: fileDownloadUrl },
      { label: 'Cover URL', value: formatValue(coverUrl), href: coverUrl },
      {
        label: 'Cover File UUID',
        value: formatValue(detail.coverFileUuid),
        href: coverDownloadUrl,
      },
    ]);

    const metaItems = compactItems([
      { label: 'Task ID', value: formatValue(detail.taskId ?? taskId) },
      { label: 'Tenant ID', value: formatValue(detail.tenantId) },
      { label: 'User ID', value: formatValue(detail.userId) },
      { label: 'Error Code', value: formatValue(detail.errorCode) },
    ]);

    const parametersText = formatParameters(detail.parameters);

    const sections: AssetDetailSection[] = [
      {
        id: 'overview',
        label: 'Overview',
        items: overviewItems,
      },
      {
        id: 'prompt',
        label: 'Prompt',
        text: resolvedPrompt,
      },
      {
        id: 'parameters',
        label: 'Parameters',
        code: parametersText ?? undefined,
      },
      {
        id: 'files',
        label: 'Files',
        items: fileItems,
      },
      {
        id: 'meta',
        label: 'Meta',
        items: metaItems,
      },
    ];

    const titleText =
      resolvedPrompt ??
      modelName ??
      asset?.prompt ??
      asset?.title ??
      (taskId ? `Asset ${taskId}` : 'Asset Details');

    return {
      sections,
      mediaType,
      mediaUrl,
      coverUrl,
      resolvedPrompt,
      titleText,
      resolvedTaskId: detail.taskId ?? taskId,
    };
  }, [detail, asset?.prompt, asset?.title, taskId]);

  const showSignIn = open && !isLoggedIn;
  const showNotFound = open && !showSignIn && !taskId;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[min(96vw,1200px)] max-w-6xl max-h-[90vh] overflow-hidden bg-[#0a0a0a] border border-white/10 text-white"
      >
        <DialogTitle className="sr-only">Asset Details</DialogTitle>
        <div className="flex h-full min-h-0 flex-col gap-6">
          {showSignIn && (
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-6 text-sm text-white/70">
              Please sign in to view this asset.
            </div>
          )}

          {showNotFound && (
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-6 text-sm text-white/70">
              Asset not found.
            </div>
          )}

          {!showSignIn && !showNotFound && isLoading && (
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-6 text-sm text-white/70">
              <div className="h-2 w-2 animate-pulse rounded-full bg-[#64ff6a]" />
              Loading asset details...
            </div>
          )}

          {!showSignIn && !showNotFound && error && !isLoading && (
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-6 text-sm text-white/70">
              {error}
            </div>
          )}

          {!showSignIn && !showNotFound && detailData && !isLoading && !error && (
            <div className="flex h-full min-h-0 flex-col gap-6 overflow-y-auto pr-1">
              <div className="flex flex-col gap-2">
                <p className="text-xs uppercase tracking-[0.25em] text-white/40">
                  Asset Details
                </p>
                <h2 className="text-2xl font-semibold text-white">
                  {detailData.titleText}
                </h2>
                {detailData.resolvedTaskId && (
                  <p className="text-sm text-white/60">
                    ID: {detailData.resolvedTaskId}
                  </p>
                )}
              </div>

              <div className="grid gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
                <div className="rounded-3xl border border-white/10 bg-black/40 p-4">
                  {detailData.mediaUrl ? (
                    <div className="flex flex-col gap-4">
                      {detailData.mediaType === 'video' && (
                        <video
                          controls
                          playsInline
                          poster={detailData.coverUrl ?? undefined}
                          className="w-full rounded-2xl bg-black object-cover"
                          src={detailData.mediaUrl}
                        />
                      )}

                      {detailData.mediaType === 'image' && (
                        <img
                          src={detailData.mediaUrl}
                          alt={detailData.resolvedPrompt ?? 'Generated image'}
                          className="w-full rounded-2xl bg-black object-contain"
                        />
                      )}

                      {detailData.mediaType === 'audio' && (
                        <div className="flex flex-col gap-3">
                          {detailData.coverUrl && (
                            <img
                              src={detailData.coverUrl}
                              alt="Audio cover"
                              className="w-full rounded-2xl bg-black object-cover"
                            />
                          )}
                          <audio controls className="w-full">
                            <source src={detailData.mediaUrl} />
                          </audio>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sm text-white/60">
                      Preview unavailable.
                    </div>
                  )}
                </div>

                <div className="rounded-3xl border border-white/10 bg-black/40 p-4">
                  <AssetDetailTabs sections={detailData.sections} />
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function resolveMediaUrl(detail: AssetDetailResponse) {
  return (
    detail.temporaryFileUrl ??
    detail.downloadUrl ??
    detail.onlineUrl ??
    buildFileDownloadUrl(detail.fileUuid) ??
    undefined
  );
}

function resolveCoverUrl(detail: AssetDetailResponse) {
  return (
    detail.temporaryCoverFileUrl ??
    buildFileDownloadUrl(detail.coverFileUuid) ??
    undefined
  );
}

function buildFileDownloadUrl(fileUuid?: string | null) {
  if (!fileUuid) {
    return undefined;
  }
  return `/api/files/download/${encodeURIComponent(fileUuid)}`;
}

function inferMediaType(detail: AssetDetailResponse, mediaUrl?: string) {
  const rawType = detail.mediaType?.toLowerCase();
  if (rawType === 'video' || rawType === 'image' || rawType === 'audio') {
    return rawType;
  }

  if (mediaUrl) {
    const lower = mediaUrl.toLowerCase();
    if (lower.match(/\.(mp3|wav|m4a|aac|flac)(\?|$)/)) {
      return 'audio';
    }
    if (lower.match(/\.(mp4|mov|webm|mkv)(\?|$)/)) {
      return 'video';
    }
  }
  return 'image';
}

function parseParameters(raw?: string | Record<string, unknown> | null) {
  if (!raw) {
    return null;
  }
  if (typeof raw === 'object') {
    return normalizeParameters(raw);
  }
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      return normalizeParameters(parsed);
    } catch {
      return null;
    }
  }
  return null;
}

function normalizeParameters(raw: Record<string, unknown>) {
  const merged = {
    ...raw,
    ...(typeof raw.input === 'object' && raw.input ? (raw.input as Record<string, unknown>) : {}),
  };
  return {
    prompt: typeof merged.prompt === 'string' ? merged.prompt : undefined,
    size: typeof merged.size === 'string' ? merged.size : undefined,
    seconds: typeof merged.seconds === 'number' ? merged.seconds : undefined,
    model: typeof merged.model === 'string' ? merged.model : undefined,
  };
}

function formatParameters(raw?: string | Record<string, unknown> | null) {
  if (!raw) {
    return null;
  }
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      return JSON.stringify(parsed, null, 2);
    } catch {
      return raw;
    }
  }
  return JSON.stringify(raw, null, 2);
}

function compactItems(items: Array<{ label: string; value?: string; href?: string }>) {
  return items
    .filter(hasValue)
    .map((item) => ({ ...item, value: item.value.trim() }));
}

function hasValue(
  item: {
    label: string;
    value?: string;
    href?: string;
  }
): item is { label: string; value: string; href?: string } {
  return typeof item.value === 'string' && item.value.trim().length > 0;
}

function formatValue(value: unknown) {
  if (value === null || value === undefined) {
    return undefined;
  }
  if (typeof value === 'string') {
    return value.trim();
  }
  if (typeof value === 'number') {
    return Number.isFinite(value) ? String(value) : undefined;
  }
  return String(value);
}

function formatDateTime(value?: string | null) {
  if (!value) {
    return undefined;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function formatDuration(value?: number | null) {
  if (!value || !Number.isFinite(value)) {
    return undefined;
  }
  return `${Math.round(value)} ms`;
}

function formatProgress(value?: number | null) {
  if (value === null || value === undefined) {
    return undefined;
  }
  if (!Number.isFinite(value)) {
    return undefined;
  }
  return `${Math.round(value * 100)}%`;
}
