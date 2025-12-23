'use client';

import { useCurrentUser } from '@/hooks/use-current-user';
import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  MediaFeedItem,
  MediaFeedResponse,
  VideoGeneratorAsset,
} from '@/components/marketing/media-generator/types';

const DEFAULT_LIMIT = 20;

export type MediaType = 'VIDEO' | 'IMAGE' | 'AUDIO';

export type UseAssetsManagerResult = {
  mediaType: MediaType;
  assets: VideoGeneratorAsset[];
  isLoading: boolean;
  hasMore: boolean;
  error: string | null;
  setMediaType: (type: MediaType) => void;
  loadMore: () => void;
  refresh: () => void;
};

export function useAssetsManager({
  initialMediaType = 'VIDEO',
  limit = DEFAULT_LIMIT,
}: {
  initialMediaType?: MediaType;
  limit?: number;
} = {}): UseAssetsManagerResult {
  const user = useCurrentUser();
  const isLoggedIn = !!user?.id;

  const [mediaType, setMediaType] = useState<MediaType>(initialMediaType);
  const [assets, setAssets] = useState<VideoGeneratorAsset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const nextCursorRef = useRef<string | null>(null);
  const hasMoreRef = useRef(true);
  const isFetchingRef = useRef(false);

  const mapTaskToAsset = useCallback(
    (task: MediaFeedItem): VideoGeneratorAsset | null => {
      if (!task.uuid && !task.taskId) {
        return null;
      }

      const fileDownloadUrl = buildFileDownloadUrl(task.fileUuid);
      const mediaUrl =
        task.temporaryFileUrl ??
        fileDownloadUrl ??
        task.onlineUrl ??
        '';
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
        title: prompt ?? `Task ${task.taskId ?? task.uuid}`,
        duration: seconds,
        resolution,
        modelName,
        prompt,
        src: mediaUrl,
        poster: mediaUrl ? undefined : '/images/media/fengmian.jpg',
        tags,
        status: normalizedStatus,
        createdAt: task.createdAt,
        errorMessage: task.errorMessage,
      };
    },
    []
  );

  const loadAssets = useCallback(
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
      setIsLoading(true);
      setError(null);

      if (reset) {
        nextCursorRef.current = null;
        hasMoreRef.current = true;
      }

      const params = new URLSearchParams({
        limit: limit.toString(),
        sort: 'desc',
        mediaTypes: mediaType,
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
            'Unable to load media assets.';
          throw new Error(errorMessage);
        }

        const data = result as MediaFeedResponse;
        const normalizedItems = (data.content ?? [])
          .map((task) => mapTaskToAsset(task))
          .filter((item): item is VideoGeneratorAsset => Boolean(item));

        setAssets((prev) => {
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
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to load your assets.';
        console.error('加载媒体资产失败:', err);
        setError(message);
        nextCursorRef.current = null;
        hasMoreRef.current = false;
        setHasMore(false);
      } finally {
        isFetchingRef.current = false;
        setIsLoading(false);
      }
    },
    [isLoggedIn, limit, mediaType, mapTaskToAsset]
  );

  const setMediaTypeAndLoad = useCallback(
    (type: MediaType) => {
      setMediaType(type);
      nextCursorRef.current = null;
      hasMoreRef.current = true;
      setAssets([]);
      setError(null);
    },
    []
  );

  const loadMore = useCallback(() => {
    loadAssets({ reset: false });
  }, [loadAssets]);

  const refresh = useCallback(() => {
    loadAssets({ reset: true });
  }, [loadAssets]);

  // 初始加载
  useEffect(() => {
    loadAssets({ reset: true });
  }, [loadAssets]);

  // 监听 mediaType 变化
  useEffect(() => {
    if (isLoggedIn) {
      loadAssets({ reset: true });
    } else {
      setAssets([]);
      setError(null);
      nextCursorRef.current = null;
      hasMoreRef.current = true;
      setHasMore(true);
    }
  }, [mediaType, isLoggedIn, loadAssets]);

  return {
    mediaType,
    assets,
    isLoading,
    hasMore,
    error,
    setMediaType: setMediaTypeAndLoad,
    loadMore,
    refresh,
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

function buildFileDownloadUrl(fileUuid?: string | null) {
  if (!fileUuid) {
    return undefined;
  }
  return `/api/files/download/${encodeURIComponent(fileUuid)}`;
}