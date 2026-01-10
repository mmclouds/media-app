'use client';

import { AssetsManagerDialog } from '@/components/assets-manager/assets-manager-dialog';
import { AudioPlayer } from '@/components/shared/audio-player';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useHoverPlayback } from '@/hooks/use-hover-playback';
import { useVideoPoster } from '@/hooks/use-video-poster';
import { useVirtualFeed } from '@/hooks/use-virtual-feed';
import { Download, FolderOpen } from 'lucide-react';
import type { RefObject } from 'react';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type {
  MediaFeedItem,
  MediaFeedResponse,
  MediaType,
  VideoGenerationState,
  VideoGeneratorAsset,
} from './types';
import { GenerationProgressVisual } from './generation-progress-visual';

type PreviewPanelProps = {
  asset?: VideoGeneratorAsset | null;
  loading: boolean;
  activeGeneration?: VideoGenerationState | null;
  onFeedRefreshed?: () => void;
};

const DEFAULT_VIDEO_SRC = '';
const DEFAULT_POSTER = '/images/media/fengmian.jpg';
const LOADING_VIDEO_SRC = '';
const LOADING_POSTER = DEFAULT_POSTER;
const DEFAULT_ERROR_MESSAGE = 'Generation failed. Please try again.';
const FEED_LIMIT = 6;
const ESTIMATED_CARD_HEIGHT = 520;
const VIRTUAL_OVERSCAN_PX = 800;

type FeedFilter = 'all' | MediaType;

const FEED_TABS: Array<{ id: FeedFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'image', label: 'Images' },
  { id: 'video', label: 'Videos' },
  { id: 'audio', label: 'Audio' },
];

export function MediaGeneratorResultPane({
  asset,
  loading,
  activeGeneration,
  onFeedRefreshed,
}: PreviewPanelProps) {
  void loading;
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const nextCursorRef = useRef<string | null>(null);
  const hasMoreRef = useRef(true);
  const isFetchingRef = useRef(false);

  const [remoteFeed, setRemoteFeed] = useState<VideoGeneratorAsset[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [feedNotice, setFeedNotice] = useState<{
    message: string;
    allowRetry?: boolean;
  } | null>(null);
  const [feedFilter, setFeedFilter] = useState<FeedFilter>('all');

  const user = useCurrentUser();
  const isLoggedIn = !!user?.id;

  const liveAsset = useMemo(
    () => (activeGeneration ? mapGenerationToAsset(activeGeneration) : null),
    [activeGeneration]
  );
  const liveAssetRef = useRef<VideoGeneratorAsset | null>(null);

  useEffect(() => {
    liveAssetRef.current = liveAsset;
  }, [liveAsset]);

  const localItems = useMemo(() => {
    if (liveAsset) {
      return [liveAsset];
    }
    if (asset) {
      return [asset];
    }
    return [];
  }, [asset, liveAsset]);

  const usingRemoteFeed = isLoggedIn && remoteFeed.length > 0;
  const {
    range: virtualRange,
    topSpacer,
    bottomSpacer,
    registerHeight: registerVirtualHeight,
  } = useVirtualFeed({
    items: remoteFeed,
    scrollRef,
    estimatedItemHeight: ESTIMATED_CARD_HEIGHT,
    overscan: VIRTUAL_OVERSCAN_PX,
    enabled: usingRemoteFeed && remoteFeed.length > 12,
  });

  const loadFeed = useCallback(
    async ({ reset = false }: { reset?: boolean } = {}) => {
      if (!isLoggedIn) {
        return;
      }

      if (isFetchingRef.current) {
        return;
      }

      if (!reset && !hasMoreRef.current) {
        return;
      }

      isFetchingRef.current = true;
      setIsFetching(true);
      setFeedNotice(null);

      if (reset) {
        nextCursorRef.current = null;
        hasMoreRef.current = true;
      }

      const params = new URLSearchParams({
        limit: FEED_LIMIT.toString(),
        sort: 'desc',
      });

      if (feedFilter !== 'all') {
        params.set('mediaTypes', feedFilter.toUpperCase());
      }

      if (!reset && nextCursorRef.current) {
        params.set('cursor', nextCursorRef.current);
      }

      try {
        const response = await fetch(`/api/media/feed?${params.toString()}`, {
          method: 'GET',
          cache: 'no-store',
        });
        const result = (await response.json().catch(() => null)) as
          | MediaFeedResponse
          | { error?: string; message?: string }
          | null;

        if (!response.ok || !result) {
          const errorMessage =
            (result as { error?: string; message?: string })?.error ??
            (result as { error?: string; message?: string })?.message ??
            'Unable to load media feed.';
          throw new Error(errorMessage);
        }

        const data = result as MediaFeedResponse;
        const normalizedItems = (data.content ?? [])
          .map((task) => mapTaskToAsset(task))
          .filter((item): item is VideoGeneratorAsset => Boolean(item));

        setRemoteFeed((prev) => {
          if (reset) {
            return mergeLiveAsset(normalizedItems, liveAssetRef.current);
          }
          const merged = [...prev];
          const indexMap = new Map(prev.map((item, index) => [item.id, index]));
          const taskIdMap = new Map<string, number>();
          const fileUuidMap = new Map<string, number>();

          prev.forEach((item, index) => {
            if (item.taskId) {
              taskIdMap.set(item.taskId, index);
            }
            if (item.fileUuid) {
              fileUuidMap.set(item.fileUuid, index);
            }
          });

          normalizedItems.forEach((entry) => {
            const existingIndex =
              indexMap.get(entry.id) ??
              (entry.taskId ? taskIdMap.get(entry.taskId) : undefined) ??
              (entry.fileUuid ? fileUuidMap.get(entry.fileUuid) : undefined);
            if (typeof existingIndex === 'number') {
              merged[existingIndex] = { ...merged[existingIndex], ...entry };
            } else {
              merged.push(entry);
            }
          });

          return merged;
        });

        const nextCursor = data.nextCursor ?? null;
        const more = Boolean(data.hasMore) && Boolean(nextCursor);
        nextCursorRef.current = nextCursor;
        hasMoreRef.current = more;
        setHasMore(more);

        if (!normalizedItems.length && !more) {
          setFeedNotice({
            message: 'No renders yet. Start by generating your first video.',
          });
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to load your feed.';
        console.error('加载媒体 Feed 失败:', error);
        setFeedNotice({
          message,
          allowRetry: true,
        });
        nextCursorRef.current = null;
        hasMoreRef.current = false;
        setHasMore(false);
      } finally {
        isFetchingRef.current = false;
        setIsFetching(false);
      }
    },
    [feedFilter, isLoggedIn]
  );

  useEffect(() => {
    if (isLoggedIn) {
      setFeedNotice(null);
      setRemoteFeed([]);
      nextCursorRef.current = null;
      hasMoreRef.current = true;
      setHasMore(true);
      void loadFeed({ reset: true });
    } else {
      setRemoteFeed([]);
      setFeedNotice(null);
      nextCursorRef.current = null;
      hasMoreRef.current = true;
      setHasMore(true);
    }
  }, [isLoggedIn, loadFeed]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !usingRemoteFeed) {
      return undefined;
    }

    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const { scrollTop, clientHeight, scrollHeight } = container;
        if (scrollTop + clientHeight >= scrollHeight - 240) {
          void loadFeed();
        }
        ticking = false;
      });
    };

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [loadFeed, usingRemoteFeed]);

  const visibleItems = usingRemoteFeed
    ? remoteFeed.slice(
      virtualRange.start,
      Math.min(virtualRange.end + 1, remoteFeed.length)
    )
    : localItems;

  useEffect(() => {
    if (!isLoggedIn || !liveAsset) {
      return;
    }

    setRemoteFeed((prev) => {
      const existingIndex = findMatchingAssetIndex(prev, liveAsset);
      if (existingIndex === -1) {
        return [liveAsset, ...prev];
      }

      const merged = [...prev];
      merged[existingIndex] = { ...merged[existingIndex], ...liveAsset };
      return merged;
    });
  }, [isLoggedIn, liveAsset]);

  useEffect(() => {
    const activeTaskId = activeGeneration?.taskId;
    if (!isLoggedIn || !activeTaskId) {
      return;
    }
    void loadFeed({ reset: true }).then(() => {
      onFeedRefreshed?.();
    });
  }, [activeGeneration?.taskId, isLoggedIn, loadFeed, onFeedRefreshed]);

  return (
    <section className="flex flex-1 min-h-0 flex-col bg-gradient-to-br from-[#050505] via-[#050505] to-[#0c0c0c] text-white">
      <div className="flex h-14 items-center justify-between border-b border-white/5 px-0">
        <div className="flex gap-1 rounded-lg bg-white/5 p-1 text-xs font-semibold">
          {FEED_TABS.map((tab) => (
            <Tab
              key={tab.id}
              label={tab.label}
              active={feedFilter === tab.id}
              onClick={() => setFeedFilter(tab.id)}
            />
          ))}
        </div>
        <div className="flex items-center gap-4 text-xs">
          <AssetsButton />
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 space-y-0 overflow-y-auto px-0 pb-6 pt-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {!isLoggedIn && (
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/80">
            <div className="h-2 w-2 rounded-full bg-[#64ff6a]" />
            Sign in to view your recent renders.
          </div>
        )}

        {feedNotice && (
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/80">
            <div className="h-2 w-2 rounded-full bg-[#64ff6a]" />
            <span>{feedNotice.message}</span>
            {feedNotice.allowRetry && (
              <button
                type="button"
                className="rounded-full border border-white/40 px-3 py-1 text-white"
                onClick={() => loadFeed({ reset: true })}
              >
                Try again
              </button>
            )}
          </div>
        )}

        {usingRemoteFeed ? (
          <>
            {topSpacer > 0 ? (
              <div style={{ height: topSpacer }} aria-hidden />
            ) : null}
            {visibleItems.map((item, index) => {
              const absoluteIndex = virtualRange.start + index;
              return (
                <VideoPreviewCard
                  key={item.id}
                  asset={item}
                  isActive={absoluteIndex === 0}
                  onHeightChange={(height) =>
                    registerVirtualHeight(item.id, height)
                  }
                />
              );
            })}
            {bottomSpacer > 0 ? (
              <div style={{ height: bottomSpacer }} aria-hidden />
            ) : null}
          </>
        ) : (
          visibleItems.map((item, index) => (
            <VideoPreviewCard
              key={item.id}
              asset={item}
              isActive={index === 0}
            />
          ))
        )}

        {usingRemoteFeed && (
          <>
            {isFetching && (
              <div className="flex items-center justify-center gap-2 py-8 text-xs text-white/60">
                <div className="h-2 w-2 animate-pulse rounded-full bg-[#64ff6a]" />
                Loading your feed...
              </div>
            )}
            {!hasMore && remoteFeed.length > 0 && (
              <div className="py-8 text-center text-xs text-white/40">
                You reached the end of this feed.
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function Tab({
  label,
  active = false,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-md px-3 py-1 ${active ? 'bg-white/10 text-white' : 'text-white/60'
        }`}
    >
      {label}
    </button>
  );
}

function AssetsButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 text-white/80 transition hover:text-white"
      >
        <FolderOpen className="h-4 w-4" />
        Assets
      </button>
      <AssetsManagerDialog open={open} onOpenChange={setOpen} />
    </>
  );
}

function VideoPreviewCard({
  asset,
  isActive = false,
  onHeightChange,
}: {
  asset: VideoGeneratorAsset;
  isActive?: boolean;
  onHeightChange?: (height: number) => void;
}) {
  const { videoRef, handleMouseEnter, handleMouseLeave, handleMediaReady } =
    useHoverPlayback();
  const cardRef = useRef<HTMLDivElement | null>(null);
  const resolvedMediaType = asset.mediaType ?? 'video';
  const isVideo = resolvedMediaType === 'video';
  const isImage = resolvedMediaType === 'image';
  const isAudio = resolvedMediaType === 'audio';
  const shouldCapturePoster = isVideo && !asset.poster && Boolean(asset.src);
  const { poster: autoPoster } = useVideoPoster(
    shouldCapturePoster ? asset.src : undefined
  );
  const mediaLabel = formatLabel(resolvedMediaType) ?? asset.tags[0] ?? 'Video';

  const handleVideoLoaded = useCallback(() => {
    handleMediaReady();
  }, [handleMediaReady]);

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

  const isError = isErrorStatus(asset.status);
  const isLoading = isInProgressStatus(asset.status);
  const modelLabel = asset.modelName ?? asset.tags[1] ?? '—';
  const displayPrompt = asset.prompt ?? asset.title;
  const resolvedErrorMessage =
    typeof asset.errorMessage === 'string' && asset.errorMessage.trim().length > 0
      ? asset.errorMessage
      : DEFAULT_ERROR_MESSAGE;

  const resolvedPoster = (() => {
    if (isLoading) {
      return LOADING_POSTER;
    }
    return asset.poster ?? autoPoster ?? DEFAULT_POSTER;
  })();

  const resolvedSrc = isError
    ? undefined
    : isLoading
      ? LOADING_VIDEO_SRC
      : asset.src || DEFAULT_VIDEO_SRC;
  const resolvedImageSrc =
    isError || isLoading ? DEFAULT_POSTER : asset.src || DEFAULT_POSTER;
  const resolvedAudioSrc =
    isError || isLoading ? undefined : asset.src || undefined;
  const statusLabel = formatLabel(asset.status);
  const audioSources =
    isAudio && Array.isArray(asset.audioSources) && asset.audioSources.length > 0
      ? asset.audioSources
      : resolvedAudioSrc
        ? [resolvedAudioSrc]
        : [];
  const audioCovers =
    isAudio && Array.isArray(asset.audioCovers) ? asset.audioCovers : [];
  const audioTracks = isAudio
    ? audioSources.map((source, index) => ({
      src: source,
      cover: audioCovers[index] ?? audioCovers[0],
    }))
    : [];

  return (
    <article
      ref={cardRef}
      className="overflow-hidden shadow-2xl shadow-black/40"
    >
      <div className="space-y-3 px-6 py-5">
        <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-white/40">
          <span className="rounded-full border border-white/10 px-3 py-1 text-white">
            {mediaLabel}
          </span>
          <span className="text-white/60">{modelLabel}</span>
          {isActive ? (
            <span className="ml-auto rounded-full px-3 py-1 text-[#64ff6a]">
              Latest
            </span>
          ) : null}
          {statusLabel ? (
            <span className="rounded-full border border-white/10 px-3 py-1 text-white/70">
              {statusLabel}
            </span>
          ) : null}
        </div>
        <p className="text-sm font-medium leading-relaxed text-white/80">
          {displayPrompt}
        </p>
      </div>
      <div
        className="bg-black"
        onMouseEnter={isVideo ? handleMouseEnter : undefined}
        onMouseLeave={isVideo ? handleMouseLeave : undefined}
      >
        <div className="px-6">
          {isError ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-none bg-neutral-900">
              <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
                <p
                  role="alert"
                  className="text-sm font-semibold leading-relaxed text-white"
                >
                  {resolvedErrorMessage}
                </p>
              </div>
            </div>
          ) : isLoading ? (
            <GenerationProgressVisual />
          ) : isImage ? (
            <div className="relative flex aspect-video w-full items-center justify-center rounded-lg bg-neutral-900">
              <img
                src={resolvedImageSrc}
                alt={displayPrompt || 'Generated image'}
                className="max-h-full max-w-full object-contain"
              />
              <a
                href={resolvedImageSrc}
                download
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg bg-black/60 text-white backdrop-blur-sm transition-all hover:bg-black/80 hover:scale-110"
                title="Download image"
              >
                <Download className="h-4 w-4" />
              </a>
            </div>
          ) : isAudio ? (
            <div className="rounded-lg bg-neutral-900 px-4 py-4">
              {audioTracks.length > 0 ? (
                <div className="grid grid-cols-1 place-items-center gap-4 sm:grid-cols-2">
                  {audioTracks.map((track, index) => (
                    <AudioPlayer
                      key={`${asset.id}-audio-${index}`}
                      audioUrl={track.src}
                      coverUrl={track.cover}
                      size="compact"
                      className="w-full max-w-[320px]"
                    />
                  ))}
                </div>
              ) : (
                <div className="flex h-16 items-center justify-center rounded-xl bg-white/5 text-xs text-white/60">
                  Audio unavailable
                </div>
              )}
            </div>
          ) : (
            <video
              ref={videoRef}
              key={asset.id}
              src={resolvedSrc || undefined}
              crossOrigin="anonymous"
              controls
              loop
              playsInline
              poster={resolvedPoster}
              className="aspect-video w-full bg-transparent object-cover"
              onLoadedData={handleVideoLoaded}
            >
              <track
                kind="captions"
                label="Captions"
                src="/captions/placeholder.vtt"
                default
              />
            </video>
          )}
        </div>
      </div>
    </article>
  );
}

function findOffsetIndex(offsets: number[], value: number) {
  if (offsets.length <= 1) {
    return 0;
  }
  let low = 0;
  let high = offsets.length - 2;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const start = offsets[mid];
    const end = offsets[mid + 1];
    if (value < start) {
      high = mid - 1;
    } else if (value >= end) {
      low = mid + 1;
    } else {
      return mid;
    }
  }
  return Math.max(0, Math.min(low, offsets.length - 2));
}

function splitCommaValues(value?: string | null) {
  if (!value) {
    return [];
  }
  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function buildTaskMetadata(task: MediaFeedItem) {
  const parsed = parseParameters(task.parameters);
  const normalizedStatus = normalizeStatus(task.status);
  const prompt =
    typeof task.prompt === 'string' && task.prompt.length > 0
      ? task.prompt
      : typeof parsed?.prompt === 'string' && parsed.prompt.length > 0
        ? parsed.prompt
        : undefined;
  const seconds =
    typeof parsed?.seconds === 'number' && parsed.seconds > 0
      ? `${parsed.seconds}s`
      : '—';
  const resolution =
    typeof parsed?.size === 'string' && parsed.size.length > 0
      ? parsed.size
      : '—';
  const tags = buildTags(task, parsed);
  const modelName =
    typeof task.modelName === 'string' && task.modelName.length > 0
      ? task.modelName
      : typeof parsed?.model === 'string' && parsed.model.length > 0
        ? parsed.model
        : undefined;

  return {
    normalizedStatus,
    prompt,
    seconds,
    resolution,
    tags,
    modelName,
  };
}

function resolveAudioSources(task: MediaFeedItem) {
  const temporaryUrls = splitCommaValues(task.temporaryFileUrl);
  if (temporaryUrls.length > 0) {
    return temporaryUrls;
  }

  const downloadUrls = splitCommaValues(task.downloadUrl);
  if (downloadUrls.length > 0) {
    return downloadUrls;
  }

  const onlineUrls = splitCommaValues(task.onlineUrl);
  if (onlineUrls.length > 0) {
    return onlineUrls;
  }

  const fileUuids = splitCommaValues(task.fileUuid);
  if (fileUuids.length > 0) {
    return fileUuids
      .map((uuid) => buildFileDownloadUrl(uuid))
      .filter((url): url is string => Boolean(url));
  }

  return [];
}

function resolveAudioCovers(task: MediaFeedItem) {
  const coverUrls = splitCommaValues(task.temporaryCoverFileUrl);
  if (coverUrls.length > 0) {
    return coverUrls;
  }

  const coverUuids = splitCommaValues(task.coverFileUuid);
  if (coverUuids.length > 0) {
    return coverUuids
      .map((uuid) => buildFileDownloadUrl(uuid))
      .filter((url): url is string => Boolean(url));
  }

  return [];
}

function resolveGenerationAudioSources(generation: VideoGenerationState) {
  const temporaryUrls = splitCommaValues(generation.temporaryFileUrl);
  if (temporaryUrls.length > 0) {
    return temporaryUrls;
  }

  const downloadUrls = splitCommaValues(generation.downloadUrl);
  if (downloadUrls.length > 0) {
    return downloadUrls;
  }

  const onlineUrls = splitCommaValues(generation.onlineUrl);
  if (onlineUrls.length > 0) {
    return onlineUrls;
  }

  const fileUuids = splitCommaValues(generation.fileUuid);
  if (fileUuids.length > 0) {
    return fileUuids
      .map((uuid) => buildFileDownloadUrl(uuid))
      .filter((url): url is string => Boolean(url));
  }

  return [];
}

function mapTaskToAsset(task: MediaFeedItem): VideoGeneratorAsset | null {
  if (!task.uuid && !task.taskId) {
    return null;
  }

  const fileDownloadUrl = buildFileDownloadUrl(task.fileUuid);
  const mediaType = normalizeMediaType(task.mediaType);

  if (mediaType === 'audio') {
    const { normalizedStatus, prompt, seconds, resolution, tags, modelName } =
      buildTaskMetadata(task);
    const sources = resolveAudioSources(task);
    const covers = resolveAudioCovers(task);
    const resolvedSources = sources.length > 0 ? sources : [DEFAULT_VIDEO_SRC];

    return {
      id: task.uuid ?? task.taskId ?? crypto.randomUUID(),
      taskId: task.taskId,
      fileUuid: task.fileUuid ?? null,
      mediaType,
      title: prompt ?? `Task ${task.taskId ?? task.uuid}`,
      duration: seconds,
      resolution,
      modelName,
      prompt,
      src: resolvedSources[0] || DEFAULT_VIDEO_SRC,
      poster: covers[0] ?? undefined,
      audioSources: resolvedSources,
      audioCovers: covers,
      tags,
      status: normalizedStatus,
      createdAt: task.createdAt,
      errorMessage: task.errorMessage,
    };
  }

  const { normalizedStatus, prompt, seconds, resolution, tags, modelName } =
    buildTaskMetadata(task);
  const mediaUrl =
    task.temporaryFileUrl ??
    fileDownloadUrl ??
    task.onlineUrl ??
    DEFAULT_VIDEO_SRC;

  return {
    id: task.uuid ?? task.taskId ?? crypto.randomUUID(),
    taskId: task.taskId,
    fileUuid: task.fileUuid ?? null,
    mediaType,
    title: prompt ?? `Task ${task.taskId ?? task.uuid}`,
    duration: seconds,
    resolution,
    modelName,
    prompt,
    src: mediaUrl,
    poster: mediaUrl ? undefined : DEFAULT_POSTER,
    tags,
    status: normalizedStatus,
    createdAt: task.createdAt,
    errorMessage: task.errorMessage,
  };
}

function parseParameters(parameters?: string | null) {
  if (!parameters) {
    return null;
  }

  try {
    const raw = JSON.parse(parameters) as {
      prompt?: string;
      size?: string;
      seconds?: number;
      model?: string;
      input?: {
        prompt?: string;
        size?: string;
        seconds?: number;
        model?: string;
      };
    };

    const merged = {
      ...raw,
      ...(raw.input ?? {}),
    };

    return {
      prompt: merged.prompt,
      size: merged.size,
      seconds: merged.seconds,
      model: merged.model,
    };
  } catch (error) {
    console.warn('解析视频参数失败:', error);
    return null;
  }
}

function buildTags(
  task: MediaFeedItem,
  parsed: ReturnType<typeof parseParameters>
) {
  const tags = [
    formatLabel(task.mediaType ?? 'Video'),
    task.modelName,
    parsed?.size,
    formatLabel(task.status),
  ].filter(Boolean) as string[];

  if (!tags.length) {
    return ['AI Video'];
  }
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

function mapGenerationToAsset(
  generation: VideoGenerationState
): VideoGeneratorAsset {
  const normalizedStatus = normalizeStatus(generation.status);
  const tags = buildGenerationTags(normalizedStatus);
  const fileDownloadUrl = buildFileDownloadUrl(generation.fileUuid);
  const mediaUrl =
    generation.temporaryFileUrl ??
    fileDownloadUrl ??
    generation.onlineUrl ??
    DEFAULT_VIDEO_SRC;
  const isAudio = generation.mediaType === 'audio';
  const audioSources = isAudio ? resolveGenerationAudioSources(generation) : [];
  const resolvedAudioSources =
    audioSources.length > 0 ? audioSources : [mediaUrl];

  return {
    id:
      generation.taskId ??
      generation.onlineUrl ??
      generation.downloadUrl ??
      generation.prompt,
    taskId: generation.taskId,
    fileUuid: generation.fileUuid ?? null,
    mediaType: generation.mediaType,
    title: generation.prompt || 'Live generation',
    duration: '—',
    resolution: '—',
    prompt: generation.prompt,
    src: isAudio ? resolvedAudioSources[0] || mediaUrl : mediaUrl,
    poster: mediaUrl ? undefined : DEFAULT_POSTER,
    audioSources: isAudio ? resolvedAudioSources : undefined,
    tags,
    status: normalizedStatus,
    createdAt: generation.createdAt ?? undefined,
    errorMessage: generation.errorMessage,
  };
}

function isInProgressStatus(status?: string | null) {
  const normalized = normalizeStatus(status);
  if (!normalized) {
    return false;
  }
  return normalized === 'pending' || normalized === 'in_progress';
}

function isErrorStatus(status?: string | null) {
  const normalized = normalizeStatus(status);
  if (!normalized) {
    return false;
  }
  return normalized === 'failed';
}

function normalizeStatus(status?: string | null) {
  if (!status) {
    return undefined;
  }
  return status.toLowerCase();
}

function normalizeMediaType(mediaType?: string | null): MediaType | undefined {
  if (!mediaType) {
    return undefined;
  }
  const normalized = mediaType.toLowerCase();
  if (normalized === 'video' || normalized === 'image' || normalized === 'audio') {
    return normalized;
  }
  return undefined;
}

function buildGenerationTags(status?: string | null) {
  const label = formatLabel(status ?? 'video');
  return ['Video', label ?? 'AI Video'].filter(Boolean) as string[];
}

function buildFileDownloadUrl(fileUuid?: string | null) {
  if (!fileUuid) {
    return undefined;
  }
  return `/api/files/download/${encodeURIComponent(fileUuid)}`;
}

function findMatchingAssetIndex(
  items: VideoGeneratorAsset[],
  target: VideoGeneratorAsset
) {
  if (target.taskId) {
    const taskIndex = items.findIndex(
      (item) => item.taskId === target.taskId || item.id === target.taskId
    );
    if (taskIndex !== -1) {
      return taskIndex;
    }
  }

  if (target.fileUuid) {
    const fileIndex = items.findIndex(
      (item) => item.fileUuid === target.fileUuid
    );
    if (fileIndex !== -1) {
      return fileIndex;
    }
  }

  return items.findIndex((item) => item.id === target.id);
}

function mergeLiveAsset(
  items: VideoGeneratorAsset[],
  liveAsset: VideoGeneratorAsset | null
) {
  if (!liveAsset) {
    return items;
  }

  const existingIndex = findMatchingAssetIndex(items, liveAsset);
  if (existingIndex === -1) {
    return [liveAsset, ...items];
  }

  const merged = [...items];
  merged[existingIndex] = { ...merged[existingIndex], ...liveAsset };
  return merged;
}
