'use client';

import { useCurrentUser } from '@/hooks/use-current-user';
import { useVideoPoster } from '@/hooks/use-video-poster';
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
import { demoVideoAssets } from './data';
import type {
  MediaFeedItem,
  MediaFeedResponse,
  VideoGenerationState,
  VideoGeneratorAsset,
} from './types';

type PreviewPanelProps = {
  asset: VideoGeneratorAsset;
  loading: boolean;
  activeGeneration?: VideoGenerationState | null;
};

const DEFAULT_VIDEO_SRC = demoVideoAssets[0]?.src ?? '';
const DEFAULT_POSTER = demoVideoAssets[0]?.poster;
const LOADING_VIDEO_SRC = demoVideoAssets[1]?.src ?? DEFAULT_VIDEO_SRC;
const LOADING_POSTER = demoVideoAssets[1]?.poster ?? DEFAULT_POSTER;
const FAILED_POSTER =
  'https://images.unsplash.com/photo-1527443224154-d1af1e991e5d?auto=format&fit=crop&w=1200&q=80';
const FEED_LIMIT = 6;
const POLL_INTERVAL_MS = 5000;
const ESTIMATED_CARD_HEIGHT = 520;
const VIRTUAL_OVERSCAN_PX = 800;

type VirtualRange = {
  start: number;
  end: number;
};

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

  const fallbackFeed = useMemo(() => {
    const uniqueAssets = [
      asset,
      ...demoVideoAssets.filter((item) => item.id !== asset.id),
    ];

    return Array.from({ length: 3 })
      .flatMap((_, loopIndex) =>
        uniqueAssets.map((item, index) => {
          if (loopIndex === 0) {
            return item;
          }
          return {
            ...item,
            id: `${item.id}-loop-${loopIndex}-${index}`,
          };
        })
      )
      .slice(0, 9);
  }, [asset]);

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
            return normalizedItems;
          }
          const merged = [...prev];
          const indexMap = new Map(prev.map((item, index) => [item.id, index]));

          normalizedItems.forEach((entry) => {
            const existingIndex = indexMap.get(entry.id);
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

  const liveAsset = useMemo(
    () => (activeGeneration ? mapGenerationToAsset(activeGeneration) : null),
    [activeGeneration]
  );

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
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 text-white/80 transition hover:text-white"
          >
            <FolderOpen className="h-4 w-4" />
            Assets
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 space-y-6 overflow-y-auto px-6 py-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {liveAsset ? (
          <VideoPreviewCard asset={liveAsset} isActive />
        ) : null}

        {!isLoggedIn && (
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/80">
            <div className="h-2 w-2 rounded-full bg-[#64ff6a]" />
            Sign in to view your recent renders. Showing demo feed.
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

function useVirtualFeed({
  items,
  scrollRef,
  estimatedItemHeight = ESTIMATED_CARD_HEIGHT,
  overscan = VIRTUAL_OVERSCAN_PX,
  enabled = true,
}: {
  items: VideoGeneratorAsset[];
  scrollRef: RefObject<HTMLDivElement | null>;
  estimatedItemHeight?: number;
  overscan?: number;
  enabled?: boolean;
}) {
  const heightsRef = useRef<Map<string, number>>(new Map());
  const [offsets, setOffsets] = useState<number[]>([0]);
  const [totalHeight, setTotalHeight] = useState(0);
  const [range, setRange] = useState<VirtualRange>(() => ({
    start: 0,
    end: items.length ? items.length - 1 : -1,
  }));

  const recomputeOffsets = useCallback(() => {
    const nextOffsets: number[] = [0];
    let running = 0;
    items.forEach((item) => {
      const height = heightsRef.current.get(item.id) ?? estimatedItemHeight;
      running += height;
      nextOffsets.push(running);
    });
    setOffsets(nextOffsets);
    setTotalHeight(running);
    const lastIndex = items.length - 1;
    setRange((prev) => {
      if (lastIndex < 0) {
        return { start: 0, end: -1 };
      }
      const start = Math.max(0, Math.min(prev.start, lastIndex));
      const end = Math.max(start, Math.min(prev.end, lastIndex));
      return { start, end };
    });
    return nextOffsets;
  }, [estimatedItemHeight, items]);

  useEffect(() => {
    if (!enabled) {
      setOffsets([0]);
      setTotalHeight(0);
      setRange({ start: 0, end: items.length ? items.length - 1 : -1 });
      return;
    }
    recomputeOffsets();
  }, [items, enabled, recomputeOffsets]);

  const updateRange = useCallback(() => {
    if (!enabled) {
      return;
    }
    const container = scrollRef.current;
    if (!container || !offsets.length) {
      return;
    }
    const viewportHeight = container.clientHeight || 0;
    const scrollTop = container.scrollTop || 0;
    const lastIndex = items.length - 1;
    if (lastIndex < 0) {
      setRange({ start: 0, end: -1 });
      return;
    }
    const startIndex = findOffsetIndex(
      offsets,
      Math.max(0, scrollTop - overscan)
    );
    const endIndex = findOffsetIndex(
      offsets,
      scrollTop + viewportHeight + overscan
    );
    setRange({
      start: startIndex,
      end: Math.min(endIndex, lastIndex),
    });
  }, [enabled, items.length, offsets, overscan, scrollRef]);

  useEffect(() => {
    updateRange();
  }, [updateRange]);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }
    const container = scrollRef.current;
    if (!container) {
      return undefined;
    }
    const handler = () => {
      updateRange();
    };
    container.addEventListener('scroll', handler);
    return () => {
      container.removeEventListener('scroll', handler);
    };
  }, [enabled, scrollRef, updateRange]);

  const registerHeight = useCallback(
    (id: string, height: number) => {
      if (!enabled || !height) {
        return;
      }
      const prev = heightsRef.current.get(id);
      if (prev === height) {
        return;
      }
      heightsRef.current.set(id, height);
      recomputeOffsets();
    },
    [enabled, recomputeOffsets]
  );

  if (!enabled) {
    return {
      range: {
        start: 0,
        end: items.length ? items.length - 1 : -1,
      },
      topSpacer: 0,
      bottomSpacer: 0,
      registerHeight: () => undefined,
    };
  }

  const topSpacer = offsets[range.start] ?? 0;
  const bottomSpacer =
    totalHeight - (offsets[range.end + 1] ?? totalHeight ?? 0);

  return {
    range,
    topSpacer,
    bottomSpacer: Math.max(0, bottomSpacer),
    registerHeight,
  };
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
  const { poster: capturedPoster, error: posterError } = useVideoPoster(
    shouldCapturePoster ? asset.src : undefined,
    { auto: shouldCapturePoster, frameTime: 0.15 }
  );

  useEffect(() => {
    if (posterError) {
      console.warn('生成视频封面失败:', posterError);
    }
  }, [asset.id, posterError]);

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

  const resolvedPoster = (() => {
    if (isError) {
      return FAILED_POSTER;
    }
    if (isLoading) {
      return LOADING_POSTER;
    }
    return asset.poster ?? capturedPoster ?? DEFAULT_POSTER;
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
          <span className="text-white/60">{asset.resolution}</span>
          <span className="text-white/60">{asset.duration}</span>
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
        <p className="text-2xl font-semibold tracking-tight text-white">
          {asset.title}
        </p>
        <p className="text-sm text-white/60">{asset.tags.join(' · ')}</p>
        <div className="flex flex-wrap gap-2 text-xs">
          {asset.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 px-3 py-1 text-white/70"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div
        className="bg-black"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {isError ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-none">
            <img
              src={resolvedPoster}
              alt="Generation failed"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ) : (
          <video
            ref={videoRef}
            key={asset.id}
            src={resolvedSrc}
            controls
            loop
            playsInline
            poster={resolvedPoster}
            className="aspect-video w-full bg-black object-cover"
            onLoadedData={handleMediaReady}
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
  const parsed = parseParameters(task.parameters);
  const normalizedStatus = normalizeStatus(task.status);
  const prompt = typeof parsed?.prompt === 'string' ? parsed.prompt : undefined;
  const seconds =
    typeof parsed?.seconds === 'number' && parsed.seconds > 0
      ? `${parsed.seconds}s`
      : '—';
  const resolution =
    typeof parsed?.size === 'string' && parsed.size.length > 0
      ? parsed.size
      : '—';

  const tags = buildTags(task, parsed);

  return {
    id: task.uuid ?? task.taskId ?? crypto.randomUUID(),
    title: prompt ?? `Task ${task.taskId ?? task.uuid}`,
    duration: seconds,
    resolution,
    src:
      fileDownloadUrl ??
      task.onlineUrl ??
      task.downloadUrl ??
      DEFAULT_VIDEO_SRC,
    poster:
      task.onlineUrl || fileDownloadUrl || task.downloadUrl
        ? undefined
        : DEFAULT_POSTER,
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
    return JSON.parse(parameters) as {
      prompt?: string;
      size?: string;
      seconds?: number;
      model?: string;
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
  return {
    id:
      generation.taskId ??
      generation.onlineUrl ??
      generation.downloadUrl ??
      generation.prompt,
    title: generation.prompt || 'Live generation',
    duration: '—',
    resolution: '—',
    src: generation.onlineUrl ?? generation.downloadUrl ?? DEFAULT_VIDEO_SRC,
    poster: generation.onlineUrl ? undefined : DEFAULT_POSTER,
    tags,
    status: normalizedStatus,
    createdAt: generation.createdAt ?? undefined,
    errorMessage: generation.errorMessage,
  };
}

function useHoverPlayback({
  resetOnLeave = false,
}: { resetOnLeave?: boolean } = {}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isHoveringRef = useRef(false);

  const attemptPlay = useCallback(() => {
    const instance = videoRef.current;
    if (!instance) {
      return;
    }
    const playPromise = instance.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch((error) => {
        console.warn('视频悬停播放失败:', error);
      });
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    isHoveringRef.current = true;
    attemptPlay();
  }, [attemptPlay]);

  const handleMouseLeave = useCallback(() => {
    isHoveringRef.current = false;
    const instance = videoRef.current;
    if (!instance) {
      return;
    }
    instance.pause();
    if (resetOnLeave) {
      instance.currentTime = 0;
    }
  }, [resetOnLeave]);

  const handleMediaReady = useCallback(() => {
    if (isHoveringRef.current) {
      attemptPlay();
    }
  }, [attemptPlay]);

  return {
    videoRef,
    handleMouseEnter,
    handleMouseLeave,
    handleMediaReady,
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
