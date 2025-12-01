'use client';

import { useCurrentUser } from '@/hooks/use-current-user';
import { FolderOpen } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
const FEED_LIMIT = 6;

export function VideoGeneratorPreviewPanel({
  asset,
  loading,
  activeGeneration,
}: PreviewPanelProps) {
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
        setRemoteFeed([]);
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
          const existingIds = new Set(prev.map((entry) => entry.id));
          const appended = normalizedItems.filter(
            (entry) => !existingIds.has(entry.id)
          );
          return [...prev, ...appended];
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
    ? remoteFeed
    : fallbackFeed.slice(0, visibleCount);

  return (
    <section className="flex flex-1 flex-col bg-gradient-to-br from-[#050505] via-[#050505] to-[#0c0c0c] text-white">
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
          <button className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 text-white/80 transition hover:text-white">
            <FolderOpen className="h-4 w-4" />
            Assets
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 space-y-6 overflow-y-auto px-6 py-6"
      >
        {loading && (
          <div className="sticky top-0 z-10 mb-4 flex items-center gap-3 rounded-2xl border border-white/5 bg-black/70 px-4 py-3 text-xs text-white/70">
            <div className="h-2 w-2 animate-ping rounded-full bg-[#64ff6a]" />
            Rendering a new clip...
          </div>
        )}

        {activeGeneration ? (
          <GenerationStatusCard generation={activeGeneration} />
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
                className="rounded-full border border-white/40 px-3 py-1 text-white"
                onClick={() => loadFeed({ reset: true })}
              >
                Try again
              </button>
            )}
          </div>
        )}

        {visibleItems.map((item, index) => (
          <VideoPreviewCard
            key={item.id}
            asset={item}
            isActive={usingRemoteFeed ? index === 0 : item.id === asset.id}
          />
        ))}

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

function GenerationStatusCard({
  generation,
}: {
  generation: VideoGenerationState;
}) {
  const status = generation.status;
  const formattedStatus = formatLabel(status);
  const isRunning = status === 'pending' || status === 'processing';
  const isSuccess = status === 'completed';
  const isError = status === 'failed' || status === 'timeout';
  const rawProgress = typeof generation.progress === 'number'
    ? generation.progress
    : null;
  const progressWidth = Math.min(100, Math.max(8, rawProgress ?? 24));
  const videoSrc = generation.onlineUrl ?? generation.downloadUrl ?? '';
  const showVideo = isSuccess && videoSrc.length > 0;
  const statusDetail =
    generation.statusDescription ??
    (isRunning ? 'Waiting for the model to finish...' : '');
  const errorMessage =
    generation.errorMessage ??
    (status === 'timeout'
      ? 'The request timed out. Please try again.'
      : 'Generation failed. Please try again.');

  return (
    <article className="rounded-[32px] border border-white/10 bg-white/5 p-5">
      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-white/50">
        <span>Live generation</span>
        <span
          className={
            isSuccess
              ? 'text-[#64ff6a]'
              : isError
                ? 'text-rose-300'
                : 'text-white'
          }
        >
          {formattedStatus}
        </span>
      </div>
      <p className="mt-4 text-lg font-semibold leading-tight text-white">
        {generation.prompt}
      </p>

      {isRunning ? (
        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-white/60">
            <span>{statusDetail}</span>
            {rawProgress !== null ? (
              <span className="text-white">{Math.round(rawProgress)}%</span>
            ) : null}
          </div>
          <div className="h-2 rounded-full bg-white/10">
            <div
              className="h-2 rounded-full bg-[#64ff6a]"
              style={{ width: `${progressWidth}%` }}
            />
          </div>
        </div>
      ) : isSuccess ? (
        showVideo ? (
          <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-black">
            <video
              key={generation.taskId}
              src={videoSrc}
              controls
              autoPlay
              loop
              playsInline
              poster={generation.onlineUrl ? undefined : DEFAULT_POSTER}
              className="aspect-video w-full object-cover"
            />
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white/70">
            Video is ready, but the URL is missing. Check the media feed for the final clip.
          </div>
        )
      ) : (
        <div className="mt-5 rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-100">
          {errorMessage}
        </div>
      )}
    </article>
  );
}

function Tab({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <button
      className={`rounded-md px-3 py-1 ${
        active ? 'bg-white/10 text-white' : 'text-white/60'
      }`}
    >
      {label}
    </button>
  );
}

function VideoPreviewCard({
  asset,
  isActive = false,
}: {
  asset: VideoGeneratorAsset;
  isActive?: boolean;
}) {
  return (
    <article className="overflow-hidden rounded-[32px] border border-white/5 bg-gradient-to-b from-white/[0.04] to-black/70 shadow-2xl shadow-black/40">
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
      <div className="bg-black">
        <video
          key={asset.id}
          src={asset.src || DEFAULT_VIDEO_SRC}
          controls
          loop
          playsInline
          poster={asset.poster ?? DEFAULT_POSTER}
          className="aspect-video w-full bg-black object-cover"
        />
      </div>
    </article>
  );
}

function mapTaskToAsset(task: MediaFeedItem): VideoGeneratorAsset | null {
  if (!task.uuid && !task.taskId) {
    return null;
  }

  const parsed = parseParameters(task.parameters);
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
    src: task.onlineUrl ?? task.downloadUrl ?? DEFAULT_VIDEO_SRC,
    poster: task.onlineUrl ? undefined : DEFAULT_POSTER,
    tags,
    status: task.status,
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
