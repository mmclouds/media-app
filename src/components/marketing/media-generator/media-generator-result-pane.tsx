'use client';

import { AssetsManagerDialog } from '@/components/assets-manager/assets-manager-dialog';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useHoverPlayback } from '@/hooks/use-hover-playback';
import { useVideoPoster } from '@/hooks/use-video-poster';
import { useVirtualFeed } from '@/hooks/use-virtual-feed';
import { FolderOpen } from 'lucide-react';
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
  VideoGenerationState,
  VideoGeneratorAsset,
} from './types';
import { GenerationProgressVisual } from './generation-progress-visual';

type PreviewPanelProps = {
  asset: VideoGeneratorAsset;
  loading: boolean;
  activeGeneration?: VideoGenerationState | null;
};

const DEFAULT_VIDEO_SRC = '';
const DEFAULT_POSTER = '/images/media/fengmian.jpg';
const LOADING_VIDEO_SRC = '';
const LOADING_POSTER = DEFAULT_POSTER;
const FAILED_POSTER =
  'https://images.unsplash.com/photo-1527443224154-d1af1e991e5d?auto=format&fit=crop&w=1200&q=80';
const DEFAULT_ERROR_MESSAGE = 'Generation failed. Please try again.';
const FEED_LIMIT = 6;
const POLL_INTERVAL_MS = 5000;
const ESTIMATED_CARD_HEIGHT = 520;
const VIRTUAL_OVERSCAN_PX = 800;

export function MediaGeneratorResultPane({
  asset,
  loading,
  activeGeneration,
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

  const fallbackFeed = useMemo(() => {
    const baseAsset = liveAsset ?? asset;
    if (!baseAsset) {
      return [];
    }
    return Array.from({ length: 3 }).flatMap((_, loopIndex) =>
      [baseAsset].map((item, index) => {
        if (loopIndex === 0 && index === 0) {
          return item;
        }
        return {
          ...item,
          id: `${item.id}-placeholder-${loopIndex}-${index}`,
        };
      })
    );
  }, [asset, liveAsset]);

  const fallbackLength = fallbackFeed.length;
  const [visibleCount, setVisibleCount] = useState(() =>
    Math.min(2, fallbackLength || 1)
  );

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

  useEffect(() => {
    if (!usingRemoteFeed) {
      setVisibleCount(Math.min(2, fallbackLength || 1));
    }
  }, [fallbackLength, usingRemoteFeed]);

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
    [isLoggedIn]
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
    if (!container) {
      return undefined;
    }

    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const { scrollTop, clientHeight, scrollHeight } = container;
        if (scrollTop + clientHeight >= scrollHeight - 240) {
          if (usingRemoteFeed) {
            void loadFeed();
          } else {
            setVisibleCount((prev) =>
              prev >= fallbackLength ? prev : prev + 1
            );
          }
        }
        ticking = false;
      });
    };

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [fallbackLength, loadFeed, usingRemoteFeed]);

  const visibleItems = usingRemoteFeed
    ? remoteFeed.slice(
      virtualRange.start,
      Math.min(virtualRange.end + 1, remoteFeed.length)
    )
    : fallbackFeed.slice(0, visibleCount);

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
    void loadFeed({ reset: true });
  }, [activeGeneration?.taskId, isLoggedIn, loadFeed]);

  return (
    <section className="flex flex-1 min-h-0 flex-col bg-gradient-to-br from-[#050505] via-[#050505] to-[#0c0c0c] text-white">
      <div className="flex h-14 items-center justify-between border-b border-white/5 px-6">
        <div className="flex gap-1 rounded-lg bg-white/5 p-1 text-xs font-semibold">
          <Tab label="All" active />
          <Tab label="Images" />
          <Tab label="Videos" />
          <Tab label="Audio" />
        </div>
        <div className="flex items-center gap-4 text-xs">
          <label className="flex items-center gap-2 text-white/70">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-white/20 bg-transparent text-[#64ff6a]"
            />
            Favorites
          </label>
          <AssetsButton />
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 space-y-6 overflow-y-auto px-6 py-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
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
          visibleItems.map((item) => (
            <VideoPreviewCard
              key={item.id}
              asset={item}
              isActive={item.id === asset.id}
            />
          ))
        )}

        {usingRemoteFeed ? (
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
        ) : visibleCount < fallbackLength ? (
          <div className="flex items-center justify-center gap-2 py-8 text-xs uppercase tracking-[0.2em] text-white/40">
            <div className="h-2 w-2 animate-pulse rounded-full bg-[#64ff6a]" />
            Keep scrolling to load more videos
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-white/40">
            You reached the end of this feed.
          </div>
        )}
      </div>
    </section>
  );
}

function Tab({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <button
      type="button"
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
  const shouldCapturePoster = !asset.poster && Boolean(asset.src);
  const { poster: autoPoster } = useVideoPoster(
    shouldCapturePoster ? asset.src : undefined
  );

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
    if (isError) {
      return FAILED_POSTER;
    }
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
  const statusLabel = formatLabel(asset.status);

  return (
    <article
      ref={cardRef}
      className="overflow-hidden rounded-[32px] border border-white/5 bg-gradient-to-b from-white/[0.04] to-black/70 shadow-2xl shadow-black/40"
    >
      <div className="space-y-3 border-b border-white/5 px-6 py-5">
        <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-white/40">
          <span className="rounded-full border border-white/10 px-3 py-1 text-white">
            Video
          </span>
          <span className="text-white/60">{modelLabel}</span>
          {isActive ? (
            <span className="ml-auto rounded-full bg-[#64ff6a]/20 px-3 py-1 text-[#64ff6a]">
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
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {isError ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-none bg-black">
            {/* <img
              src={resolvedPoster}
              alt="Generation failed"
              className="h-full w-full object-cover opacity-60"
            /> */}
            <div className="absolute inset-0 bg-black/60" />
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
            className="aspect-video w-full bg-black object-cover"
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

function mapTaskToAsset(task: MediaFeedItem): VideoGeneratorAsset | null {
  if (!task.uuid && !task.taskId) {
    return null;
  }

  const fileDownloadUrl = buildFileDownloadUrl(task.fileUuid);
  const mediaUrl =
    task.temporaryFileUrl ??
    fileDownloadUrl ??
    task.onlineUrl ??
    DEFAULT_VIDEO_SRC;
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
    id: task.uuid ?? task.taskId ?? crypto.randomUUID(),
    taskId: task.taskId,
    fileUuid: task.fileUuid ?? null,
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

  return {
    id:
      generation.taskId ??
      generation.onlineUrl ??
      generation.downloadUrl ??
      generation.prompt,
    taskId: generation.taskId,
    fileUuid: generation.fileUuid ?? null,
    title: generation.prompt || 'Live generation',
    duration: '—',
    resolution: '—',
    prompt: generation.prompt,
    src: mediaUrl,
    poster: mediaUrl ? undefined : DEFAULT_POSTER,
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
  return normalized === 'pending' || normalized === 'processing';
}

function isErrorStatus(status?: string | null) {
  const normalized = normalizeStatus(status);
  if (!normalized) {
    return false;
  }
  return normalized === 'failed' || normalized === 'timeout';
}

function normalizeStatus(status?: string | null) {
  if (!status) {
    return undefined;
  }
  const normalized = status.toLowerCase();
  if (normalized === 'succeeded' || normalized === 'success') {
    return 'completed';
  }
  return normalized;
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
