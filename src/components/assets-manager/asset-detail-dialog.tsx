'use client';

import type { VideoGeneratorAsset } from '@/components/marketing/media-generator/types';
import { AudioPlayer } from '@/components/shared/audio-player';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useEffect, useMemo, useState } from 'react';

type AssetDetailResponse = {
  taskId?: string | null;
  mediaType?: string | null;
  status?: string | null;
  statusDescription?: string | null;
  onlineUrl?: string | null;
  downloadUrl?: string | null;
  temporaryFileUrl?: string | null;
  temporaryInputFileUrl?: string | null;
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
            response.status === 404
              ? 'Asset not found.'
              : 'Unable to load asset.'
          );
          return;
        }
        const payload = (await response
          .json()
          .catch(() => null)) as AssetDetailResponse | null;
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
    const resolvedPrompt =
      prompt ?? parsedParameters?.prompt ?? asset?.prompt ?? asset?.title;
    const resolution = parsedParameters?.size;
    const modelName =
      typeof detail.modelName === 'string' && detail.modelName.length > 0
        ? detail.modelName
        : typeof parsedParameters?.model === 'string' &&
            parsedParameters.model.length > 0
          ? parsedParameters.model
          : typeof asset?.modelName === 'string' && asset.modelName.length > 0
            ? asset.modelName
            : typeof asset?.tags?.[1] === 'string' && asset.tags[1].length > 0
              ? asset.tags[1]
              : undefined;

    const mediaUrl = resolveMediaUrl(detail);
    const coverUrl = resolveCoverUrl(detail);
    const mediaType = inferMediaType(detail, mediaUrl);
    const audioUrls = mediaType === 'audio' ? resolveAudioUrls(detail) : [];
    const audioCoverUrls =
      mediaType === 'audio' ? resolveAudioCoverUrls(detail) : [];
    const resolvedMediaUrl =
      mediaType === 'audio' ? (audioUrls[0] ?? mediaUrl) : mediaUrl;
    const resolvedCoverUrl =
      mediaType === 'audio' ? (audioCoverUrls[0] ?? coverUrl) : coverUrl;
    const tags = buildDetailTags({
      assetTags: asset?.tags,
      mediaType,
      modelName,
      resolution,
      status: detail.status,
    });
    const sourceImageUrls = resolveInputImageUrls(detail);

    return {
      mediaType,
      mediaUrl: resolvedMediaUrl,
      coverUrl: resolvedCoverUrl,
      audioUrls,
      audioCoverUrls,
      modelName,
      tags,
      sourceImageUrls,
      resolvedPrompt,
    };
  }, [detail, asset?.modelName, asset?.prompt, asset?.tags, asset?.title]);

  const showSignIn = open && !isLoggedIn;
  const showNotFound = open && !showSignIn && !taskId;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[min(86vh,calc(92vw*9/16))] w-[min(92vw,calc(86vh*16/9))] !max-w-none overflow-hidden bg-[#0a0a0a] border border-white/10 text-white">
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

          {!showSignIn &&
            !showNotFound &&
            detailData &&
            !isLoading &&
            !error && (
              <div className="flex h-full min-h-0 flex-col gap-6">
                <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)]">
                  <div className="flex min-h-0 flex-col rounded-3xl bg-black/40 p-4">
                    {detailData.mediaUrl ? (
                      <div
                        className={`flex min-h-0 flex-1 flex-col rounded-2xl bg-black/60 p-3 ${
                          detailData.mediaType === 'audio'
                            ? 'items-center justify-start overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'
                            : 'items-center justify-center'
                        }`}
                      >
                        {detailData.mediaType === 'video' && (
                          <>
                            {/* biome-ignore lint/a11y/useMediaCaption: 详情预览暂无字幕文件。 */}
                            <video
                              controls
                              playsInline
                              poster={detailData.coverUrl ?? undefined}
                              className="h-full w-full rounded-2xl bg-black object-contain"
                              src={detailData.mediaUrl}
                            />
                          </>
                        )}

                        {detailData.mediaType === 'image' && (
                          <img
                            src={detailData.mediaUrl}
                            alt={detailData.resolvedPrompt ?? 'Generated image'}
                            className="h-full w-full rounded-2xl bg-black object-contain"
                          />
                        )}

                        {detailData.mediaType === 'audio' && (
                          <div className="grid w-full max-w-[720px] grid-cols-1 gap-4 sm:grid-cols-2 place-items-center my-auto">
                            {detailData.audioUrls.length > 0 ? (
                              detailData.audioUrls.map((url, index) => {
                                const cover =
                                  detailData.audioCoverUrls[index] ??
                                  detailData.audioCoverUrls[0];
                                return (
                                  <AudioPlayer
                                    key={`${url}-${index}`}
                                    audioUrl={url}
                                    coverUrl={cover}
                                    size="compact"
                                    className="w-full max-w-[320px]"
                                  />
                                );
                              })
                            ) : (
                              <div className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-white/60 sm:col-span-2">
                                Preview unavailable.
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex min-h-[320px] items-center justify-center rounded-2xl bg-white/5 text-sm text-white/60">
                        Preview unavailable.
                      </div>
                    )}
                  </div>

                  <div className="flex min-h-0 flex-col rounded-3xl bg-black/40 p-5">
                    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                      <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                          Model
                        </p>
                        <div className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-white/80">
                          {detailData.modelName ? (
                            detailData.modelName
                          ) : (
                            <span className="text-white/60">
                              No model available.
                            </span>
                          )}
                        </div>
                      </div>

                      {detailData.sourceImageUrls.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                            Source Image
                          </p>
                          <div className="rounded-2xl bg-black/60 p-3">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                              {detailData.sourceImageUrls.map((url, index) => (
                                <img
                                  key={`${url}-${index}`}
                                  src={url}
                                  alt={`Source ${index + 1}`}
                                  className="w-full max-h-48 rounded-xl bg-black object-contain"
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                          Prompt
                        </p>
                        <div className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-white/80">
                          {detailData.resolvedPrompt ? (
                            <p className="whitespace-pre-line">
                              {detailData.resolvedPrompt}
                            </p>
                          ) : (
                            <p className="text-white/60">
                              No prompt available.
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                          Tags
                        </p>
                        <div className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-white/80">
                          {detailData.tags.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {detailData.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-white/60">
                              No tags available.
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
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
  const temporaryUrls = splitCommaValues(detail.temporaryFileUrl);
  if (temporaryUrls.length > 0) {
    return temporaryUrls[0];
  }

  const downloadUrls = splitCommaValues(detail.downloadUrl);
  if (downloadUrls.length > 0) {
    return downloadUrls[0];
  }

  const onlineUrls = splitCommaValues(detail.onlineUrl);
  if (onlineUrls.length > 0) {
    return onlineUrls[0];
  }

  const fileUuids = splitCommaValues(detail.fileUuid);
  if (fileUuids.length > 0) {
    return buildFileDownloadUrl(fileUuids[0]);
  }

  return undefined;
}

function resolveCoverUrl(detail: AssetDetailResponse) {
  const temporaryUrls = splitCommaValues(detail.temporaryCoverFileUrl);
  if (temporaryUrls.length > 0) {
    return temporaryUrls[0];
  }

  const coverUuids = splitCommaValues(detail.coverFileUuid);
  if (coverUuids.length > 0) {
    return buildFileDownloadUrl(coverUuids[0]);
  }

  return undefined;
}

function resolveInputImageUrls(detail: AssetDetailResponse) {
  return splitCommaValues(detail.temporaryInputFileUrl);
}

function resolveAudioUrls(detail: AssetDetailResponse) {
  const temporaryUrls = splitCommaValues(detail.temporaryFileUrl);
  if (temporaryUrls.length > 0) {
    return temporaryUrls;
  }

  const downloadUrls = splitCommaValues(detail.downloadUrl);
  if (downloadUrls.length > 0) {
    return downloadUrls;
  }

  const onlineUrls = splitCommaValues(detail.onlineUrl);
  if (onlineUrls.length > 0) {
    return onlineUrls;
  }

  const fileUuids = splitCommaValues(detail.fileUuid);
  if (fileUuids.length > 0) {
    return fileUuids
      .map((uuid) => buildFileDownloadUrl(uuid))
      .filter((url): url is string => Boolean(url));
  }

  return [];
}

function resolveAudioCoverUrls(detail: AssetDetailResponse) {
  const temporaryUrls = splitCommaValues(detail.temporaryCoverFileUrl);
  if (temporaryUrls.length > 0) {
    return temporaryUrls;
  }

  const coverUuids = splitCommaValues(detail.coverFileUuid);
  if (coverUuids.length > 0) {
    return coverUuids
      .map((uuid) => buildFileDownloadUrl(uuid))
      .filter((url): url is string => Boolean(url));
  }

  return [];
}

function buildFileDownloadUrl(fileUuid?: string | null) {
  if (!fileUuid) {
    return undefined;
  }
  return `/api/files/download/${encodeURIComponent(fileUuid)}`;
}

function splitCommaValues(value?: string | null) {
  if (!value) {
    return [];
  }
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function inferMediaType(
  detail: AssetDetailResponse,
  mediaUrl?: string
): 'video' | 'image' | 'audio' {
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
    ...(typeof raw.input === 'object' && raw.input
      ? (raw.input as Record<string, unknown>)
      : {}),
  };
  return {
    prompt: typeof merged.prompt === 'string' ? merged.prompt : undefined,
    size: typeof merged.size === 'string' ? merged.size : undefined,
    seconds: typeof merged.seconds === 'number' ? merged.seconds : undefined,
    model: typeof merged.model === 'string' ? merged.model : undefined,
  };
}

type DetailTagOptions = {
  assetTags?: string[] | null;
  mediaType?: string | null;
  modelName?: string;
  resolution?: string;
  status?: string | null;
};

function buildDetailTags({
  assetTags,
  mediaType,
  modelName,
  resolution,
  status,
}: DetailTagOptions) {
  const normalizedAssetTags = Array.isArray(assetTags)
    ? assetTags.map((tag) => tag.trim()).filter(Boolean)
    : [];

  if (normalizedAssetTags.length > 0) {
    return Array.from(new Set(normalizedAssetTags));
  }

  const tags = [
    formatLabel(mediaType),
    modelName,
    resolution,
    formatLabel(status),
  ].filter(Boolean) as string[];

  return Array.from(new Set(tags));
}

function formatLabel(label?: string | null) {
  if (!label) {
    return undefined;
  }

  return label
    .toLowerCase()
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(' ');
}
