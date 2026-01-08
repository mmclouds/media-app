import Container from '@/components/layout/container';
import {
  AssetDetailTabs,
  type AssetDetailSection,
} from '@/components/assets-manager/asset-detail-tabs';
import { getSession } from '@/lib/server';
import { constructMetadata } from '@/lib/metadata';
import type { NextPageProps } from '@/types/next-page-props';
import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import { headers } from 'next/headers';
import type { ReactNode } from 'react';

export const dynamic = 'force-dynamic';

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; taskId?: string }>;
}): Promise<Metadata | undefined> {
  const { locale, taskId } = await params;
  return constructMetadata({
    title: 'Asset Details',
    description: 'View generated media details.',
    locale,
    pathname: taskId ? `/assets/${taskId}` : '/assets',
  });
}

export default async function AssetDetailPage(props: NextPageProps) {
  const params = await props.params;
  const taskIdParam = params?.taskId;
  const taskId =
    typeof taskIdParam === 'string'
      ? taskIdParam
      : Array.isArray(taskIdParam)
        ? taskIdParam[0]
        : undefined;

  const session = await getSession();

  if (!taskId) {
    return (
      <PageShell>
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-6 text-sm text-white/70">
          Asset not found
        </div>
      </PageShell>
    );
  }

  if (!session?.user?.id) {
    return (
      <PageShell>
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-6 text-sm text-white/70">
          Please sign in to view this asset.
        </div>
      </PageShell>
    );
  }

  const headersList = await headers();
  const assetDetail = await fetchAssetDetail(taskId, headersList);

  if (!assetDetail) {
    return (
      <PageShell>
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-6 text-sm text-white/70">
          Asset not found
        </div>
      </PageShell>
    );
  }

  const prompt =
    typeof assetDetail.prompt === 'string' && assetDetail.prompt.trim().length > 0
      ? assetDetail.prompt.trim()
      : undefined;
  const parsedParameters = parseParameters(assetDetail.parameters);
  const resolvedPrompt = prompt ?? parsedParameters?.prompt;
  const resolution = parsedParameters?.size;
  const duration =
    typeof parsedParameters?.seconds === 'number' && parsedParameters.seconds > 0
      ? `${parsedParameters.seconds}s`
      : undefined;
  const modelName =
    typeof assetDetail.modelName === 'string' && assetDetail.modelName.length > 0
      ? assetDetail.modelName
      : parsedParameters?.model;

  const mediaUrl = resolveMediaUrl(assetDetail);
  const coverUrl = resolveCoverUrl(assetDetail);
  const mediaType = inferMediaType(assetDetail, mediaUrl);

  const overviewItems = compactItems([
    { label: 'Status', value: formatValue(assetDetail.status) },
    { label: 'Description', value: formatValue(assetDetail.statusDescription) },
    { label: 'Media Type', value: mediaType },
    { label: 'Model', value: formatValue(modelName) },
    { label: 'Provider', value: formatValue(assetDetail.providerName) },
    { label: 'Resolution', value: formatValue(resolution) },
    { label: 'Duration', value: formatValue(duration) },
    { label: 'Progress', value: formatValue(formatProgress(assetDetail.progress)) },
    { label: 'Created At', value: formatDateTime(assetDetail.createdAt) },
    { label: 'Completed At', value: formatDateTime(assetDetail.completedAt) },
    { label: 'Execution Time', value: formatDuration(assetDetail.executionTimeMs) },
    { label: 'Retry Count', value: formatValue(assetDetail.retryCount) },
    { label: 'Error', value: formatValue(assetDetail.errorMessage) },
  ]);

  const fileDownloadUrl = buildFileDownloadUrl(assetDetail.fileUuid);
  const coverDownloadUrl = buildFileDownloadUrl(assetDetail.coverFileUuid);
  const fileItems = compactItems([
    { label: 'Media URL', value: mediaUrl, href: mediaUrl },
    { label: 'Download URL', value: formatValue(assetDetail.downloadUrl), href: assetDetail.downloadUrl ?? undefined },
    { label: 'Online URL', value: formatValue(assetDetail.onlineUrl), href: assetDetail.onlineUrl ?? undefined },
    { label: 'Temporary URL', value: formatValue(assetDetail.temporaryFileUrl), href: assetDetail.temporaryFileUrl ?? undefined },
    { label: 'File UUID', value: formatValue(assetDetail.fileUuid), href: fileDownloadUrl },
    { label: 'Cover URL', value: formatValue(coverUrl), href: coverUrl },
    { label: 'Cover File UUID', value: formatValue(assetDetail.coverFileUuid), href: coverDownloadUrl },
  ]);

  const metaItems = compactItems([
    { label: 'Task ID', value: formatValue(assetDetail.taskId ?? taskId) },
    { label: 'Tenant ID', value: formatValue(assetDetail.tenantId) },
    { label: 'User ID', value: formatValue(assetDetail.userId) },
    { label: 'Error Code', value: formatValue(assetDetail.errorCode) },
  ]);

  const parametersText = formatParameters(assetDetail.parameters);

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

  const titleText = resolvedPrompt ?? modelName ?? `Asset ${taskId}`;

  return (
    <PageShell>
      <div className="flex flex-col gap-2 mb-6">
        <p className="text-xs uppercase tracking-[0.25em] text-white/40">
          Asset Details
        </p>
        <h1 className="text-2xl font-semibold text-white">{titleText}</h1>
        <p className="text-sm text-white/60">ID: {taskId}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <div className="rounded-3xl border border-white/10 bg-black/40 p-4">
          {mediaUrl ? (
            <div className="flex flex-col gap-4">
              {mediaType === 'video' && (
                <video
                  controls
                  playsInline
                  poster={coverUrl ?? undefined}
                  className="w-full rounded-2xl bg-black object-cover"
                  src={mediaUrl}
                />
              )}

              {mediaType === 'image' && (
                <img
                  src={mediaUrl}
                  alt={resolvedPrompt ?? 'Generated image'}
                  className="w-full rounded-2xl bg-black object-contain"
                />
              )}

              {mediaType === 'audio' && (
                <div className="flex flex-col gap-3">
                  {coverUrl && (
                    <img
                      src={coverUrl}
                      alt="Audio cover"
                      className="w-full rounded-2xl bg-black object-cover"
                    />
                  )}
                  <audio controls className="w-full">
                    <source src={mediaUrl} />
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
          <AssetDetailTabs sections={sections} />
        </div>
      </div>
    </PageShell>
  );
}

async function fetchAssetDetail(taskId: string, headersList: Headers) {
  const host = headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') ?? 'http';
  if (!host) {
    return null;
  }

  const targetUrl = `${protocol}://${host}/api/media/result/${encodeURIComponent(
    taskId
  )}`;
  const forwardHeaders: Record<string, string> = {};
  const cookie = headersList.get('cookie');
  if (cookie) {
    forwardHeaders.cookie = cookie;
  }
  const authorization = headersList.get('authorization');
  if (authorization) {
    forwardHeaders.authorization = authorization;
  }

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: forwardHeaders,
      cache: 'no-store',
    });
    if (!response.ok) {
      return null;
    }
    const payload = (await response.json().catch(() => null)) as
      | AssetDetailResponse
      | null;
    return payload;
  } catch {
    return null;
  }
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

function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Container className="py-10">{children}</Container>
    </div>
  );
}
