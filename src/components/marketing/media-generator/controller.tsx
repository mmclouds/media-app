'use client';

import { Image as ImageIcon, Music, Video } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AudioCraftConfigFields } from './audio/config-fields';
import { StillImageConfigFields } from './image/config-fields';
import { SoraConfigFields } from './video/sora-config-fields';
import { Veo3ConfigFields } from './video/veo3-config-fields';
import type {
  MediaGenerationPayload,
  MediaModelConfig,
  MediaModelDefinition,
  MediaTaskResult,
  MediaTaskStatus,
  MediaType,
  MediaTypeOption,
  VideoGenerationState,
  VideoGeneratorHistory,
} from './types';

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

export const MEDIA_TYPE_OPTIONS: MediaTypeOption[] = [
  { id: 'video', label: 'Videos', icon: Video },
  { id: 'image', label: 'Images', icon: ImageIcon },
  { id: 'audio', label: 'Audio', icon: Music },
];

export const MODEL_REGISTRY: Record<MediaType, MediaModelDefinition[]> = {
  video: [
    {
      id: 'sora',
      label: 'Sora 2',
      description: 'Cinematic 4s shots up to 1080p',
      provider: 'OpenAI',
      mediaType: 'video',
      modelName: 'sora-2',
      model: 'sora-2',
      defaultConfig: {
        seconds: 4,
        size: '1280x720',
        cameraStyle: 'Cinematic',
      },
      configComponent: SoraConfigFields,
    },
    {
      id: 'veo3',
      label: 'Veo 3',
      description: 'Long-form video with stylized presets',
      provider: 'Google DeepMind',
      mediaType: 'video',
      modelName: 'veo-3',
      model: 'veo-3',
      defaultConfig: {
        seconds: 6,
        fps: 24,
        preset: 'Hyperreal',
        includeAudio: true,
      },
      configComponent: Veo3ConfigFields,
    },
  ],
  image: [
    {
      id: 'still',
      label: 'Still Studio',
      description: 'High fidelity diffusion for hero frames',
      provider: 'VisionArc',
      mediaType: 'image',
      modelName: 'still-pro',
      model: 'still-pro',
      defaultConfig: {
        aspectRatio: '1:1',
        quality: 80,
      },
      configComponent: StillImageConfigFields,
    },
  ],
  audio: [
    {
      id: 'audiocraft',
      label: 'AudioCraft Studio',
      description: 'Generate ambient loops and sonic cues',
      provider: 'Meta',
      mediaType: 'audio',
      modelName: 'audiocraft-v1',
      model: 'audiocraft-v1',
      defaultConfig: {
        duration: 8,
        mood: 'Ambient',
      },
      configComponent: AudioCraftConfigFields,
    },
  ],
};

const createInitialConfigs = (): Record<string, MediaModelConfig> => {
  const entries: Array<[string, MediaModelConfig]> = [];
  Object.values(MODEL_REGISTRY).forEach((models) => {
    models.forEach((model) => {
      entries.push([model.id, { ...model.defaultConfig }]);
    });
  });
  return Object.fromEntries(entries);
};

type UseMediaGeneratorOptions = {
  initialMediaType?: MediaType;
  lockedMediaType?: MediaType;
};

export function useMediaGeneratorController({
  initialMediaType,
  lockedMediaType,
}: UseMediaGeneratorOptions = {}) {
  const resolvedInitial = lockedMediaType ?? initialMediaType ?? 'video';
  const [mediaType, setMediaTypeState] = useState<MediaType>(resolvedInitial);
  const [history, setHistory] = useState<VideoGeneratorHistory>([]);
  const [activeGeneration, setActiveGeneration] =
    useState<VideoGenerationState | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeModelId, setActiveModelId] = useState<string>('');
  const [modelConfigs, setModelConfigs] =
    useState<Record<string, MediaModelConfig>>(createInitialConfigs);
  const [prompt, setPrompt] = useState(
    'swap [subject] from [@Image] for [subject] from [@Video]'
  );

  const effectiveMediaType = lockedMediaType ?? mediaType;

  const availableModels = useMemo(
    () => MODEL_REGISTRY[effectiveMediaType] ?? [],
    [effectiveMediaType]
  );

  useEffect(() => {
    if (!availableModels.length) {
      setActiveModelId('');
      return;
    }
    setActiveModelId((prev) => {
      if (prev && availableModels.some((model) => model.id === prev)) {
        return prev;
      }
      return availableModels[0]?.id ?? '';
    });
  }, [availableModels]);

  const setMediaType = useCallback(
    (nextType: MediaType) => {
      if (lockedMediaType) {
        return;
      }
      setMediaTypeState(nextType);
    },
    [lockedMediaType]
  );

  const handleModelConfigChange = (modelId: string, config: MediaModelConfig) =>
    setModelConfigs((prev) => ({
      ...prev,
      [modelId]: { ...config },
    }));

  const handleGenerate = useCallback(
    async (payload: MediaGenerationPayload) => {
      const trimmedPrompt = payload.prompt.trim();
      if (!trimmedPrompt) {
        return;
      }

      const candidateModels =
        MODEL_REGISTRY[payload.mediaType] ?? availableModels;
      const definition =
        candidateModels.find((model) => model.id === payload.modelId) ??
        candidateModels[0];

      if (!definition) {
        return;
      }

      const resolvedConfig = {
        ...definition.defaultConfig,
        ...payload.config,
      };

      setIsSubmitting(true);
      setHistory((prev) => {
        const next = [...prev, trimmedPrompt];
        return next.slice(-5);
      });

      try {
        const queryParams = new URLSearchParams();
        queryParams.set('mediaType', payload.mediaType.toUpperCase());
        queryParams.set('modelName', definition.modelName);

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
            mediaType: payload.mediaType.toUpperCase(),
            modelName: definition.modelName,
            model: definition.model ?? definition.modelName,
            prompt: trimmedPrompt,
            ...resolvedConfig,
          }),
        });

        const result = (await response.json().catch(() => null)) as {
          taskId?: string;
          error?: string;
          message?: string;
        } | null;

        if (!response.ok || !result?.taskId) {
          const errorMessage =
            result?.error ?? result?.message ?? 'Failed to start generation.';
          throw new Error(errorMessage);
        }

        setActiveGeneration({
          taskId: result.taskId,
          status: 'pending',
          prompt: trimmedPrompt,
          progress: 0,
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Failed to start generation.';
        console.error('触发媒体生成失败:', error);
        setActiveGeneration({
          taskId: `local-${Date.now()}`,
          status: 'failed',
          prompt: trimmedPrompt,
          progress: 0,
          errorMessage: message,
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [availableModels]
  );

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
                : (prev.progress ?? null),
          } satisfies VideoGenerationState;
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

  return {
    mediaType: effectiveMediaType,
    setMediaType,
    mediaTypeOptions: MEDIA_TYPE_OPTIONS,
    availableModels,
    activeModelId,
    setActiveModelId,
    modelConfigs,
    onModelConfigChange: handleModelConfigChange,
    prompt,
    setPrompt,
    history,
    onGenerate: handleGenerate,
    isGenerating:
      isSubmitting ||
      Boolean(
        activeGeneration?.status &&
          !hasReachedTerminalState(activeGeneration.status)
      ),
    activeGeneration,
  };
}
