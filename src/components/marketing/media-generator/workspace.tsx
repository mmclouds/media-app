'use client';

import { cn } from '@/lib/utils';
import { useCallback, useEffect, useState } from 'react';
import { demoMediaAssets, soraVideoPreset } from './data';
import { MediaGeneratorEditorPanel } from './editor-panel';
import { MediaGeneratorPreviewPanel } from './preview-panel';
import { MediaGeneratorSidebar } from './sidebar';
import type {
  MediaGenerationState,
  MediaGeneratorHistory,
  MediaTaskResult,
  MediaTaskStatus,
} from './types';

const DEFAULT_GENERATION_PARAMS = soraVideoPreset.defaults;

const POLLING_INTERVAL_MS = 5000;
const FINAL_STATUSES: MediaTaskStatus[] = ['completed', 'failed', 'timeout'];

const clampProgress = (value: unknown): number | null => {
  const numeric =
    typeof value === 'number'
      ? value
      : typeof value === 'string'
        ? Number(value)
        : null;

  if (numeric === null || !Number.isFinite(numeric)) {
    return null;
  }

  return Math.min(100, Math.max(0, numeric));
};

const hasReachedTerminalState = (status?: MediaTaskStatus) =>
  status ? FINAL_STATUSES.includes(status) : false;

export function MediaGeneratorWorkspace({ className }: { className?: string }) {
  const [history, setHistory] = useState<MediaGeneratorHistory>([]);
  const [activeGeneration, setActiveGeneration] =
    useState<MediaGenerationState | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const asset = demoMediaAssets[0];

  const isPollingActive = Boolean(
    activeGeneration?.status && !hasReachedTerminalState(activeGeneration.status)
  );
  const isGenerating = isSubmitting || isPollingActive;

  const handleGenerate = useCallback(async (rawPrompt: string) => {
    const prompt = rawPrompt.trim();
    if (!prompt) {
      return;
    }

    setIsSubmitting(true);
    setHistory((prev) => {
      const next = [...prev, prompt];
      return next.slice(-5);
    });

    try {
      const queryParams = new URLSearchParams();
      if (DEFAULT_GENERATION_PARAMS.mediaType) {
        queryParams.set('mediaType', DEFAULT_GENERATION_PARAMS.mediaType);
      }
      if (DEFAULT_GENERATION_PARAMS.modelName) {
        queryParams.set('modelName', DEFAULT_GENERATION_PARAMS.modelName);
      }

      const queryString = queryParams.toString();
      const endpoint = queryString
        ? `/api/media/generate?${queryString}`
        : '/api/media/generate';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...DEFAULT_GENERATION_PARAMS,
          prompt,
        }),
      });

      const result = (await response.json().catch(() => null)) as
        | { taskId?: string; error?: string; message?: string }
        | null;

      if (!response.ok || !result?.taskId) {
        const errorMessage =
          result?.error ?? result?.message ?? 'Failed to start generation.';
        throw new Error(errorMessage);
      }

      setActiveGeneration({
        taskId: result.taskId,
        status: 'pending',
        prompt,
        progress: 0,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to start generation.';
      console.error('触发视频生成失败:', error);
      setActiveGeneration({
        taskId: `local-${Date.now()}`,
        status: 'failed',
        prompt,
        progress: 0,
        errorMessage: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  useEffect(() => {
    const taskId = activeGeneration?.taskId;
    const status = activeGeneration?.status;

    if (!taskId || !status || hasReachedTerminalState(status)) {
      return undefined;
    }

    let cancelled = false;

    const pollTask = async () => {
      try {
        const response = await fetch(`/api/media/result/${taskId}`, {
          method: 'GET',
          cache: 'no-store',
        });

        const payload = (await response.json().catch(() => null)) as
          | MediaTaskResult
          | { error?: string }
          | null;

        if (cancelled) {
          return;
        }

        if (
          !response.ok ||
          !payload ||
          typeof payload !== 'object' ||
          Array.isArray(payload) ||
          !('taskId' in payload)
        ) {
          const message =
            (payload as { error?: string })?.error ??
            'Unable to fetch generation task.';
          throw new Error(message);
        }

        const data = payload as MediaTaskResult;

        setActiveGeneration((prev) => {
          if (!prev || prev.taskId !== taskId) {
            return prev;
          }

          return {
            ...prev,
            ...data,
            progress:
              data.progress !== undefined
                ? clampProgress(data.progress)
                : prev.progress ?? null,
          } satisfies MediaGenerationState;
        });
      } catch (error) {
        if (cancelled) {
          return;
        }
        const message =
          error instanceof Error
            ? error.message
            : 'Failed to poll generation task.';
        console.error('轮询媒体任务失败:', error);
        setActiveGeneration((prev) =>
          prev && prev.taskId === taskId
            ? {
                ...prev,
                errorMessage: message,
              }
            : prev
        );
      }
    };

    void pollTask();
    const intervalId = setInterval(pollTask, POLLING_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [activeGeneration?.status, activeGeneration?.taskId]);

  const currentAsset = asset ?? {
    id: 'demo-video',
    title: 'AI Video',
    duration: '5s',
    resolution: '720p',
    src: '',
    tags: ['AI Video'],
  };

  return (
    <div
      className={cn(
        'flex h-full w-full max-h-screen overflow-hidden rounded-[36px] border border-white/10 bg-black text-white shadow-[0_40px_120px_rgba(0,0,0,0.45)]',
        className
      )}
    >
      <MediaGeneratorSidebar />
      <MediaGeneratorEditorPanel
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
        prompts={history}
        activeModel={soraVideoPreset}
      />
      <MediaGeneratorPreviewPanel
        asset={currentAsset}
        loading={isGenerating}
        activeGeneration={activeGeneration}
      />
    </div>
  );
}
