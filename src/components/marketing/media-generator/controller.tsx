'use client';

import { Image as ImageIcon, Music, Video } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AudioCraftConfigFields } from './audio/audio-craft-config-fields';
import { NanoBananaConfigFields } from './image/nano-banana-config-fields';
import { StillImageConfigFields } from './image/still-image-config-fields';
import type {
  MediaGenerationPayload,
  MediaModelConfig,
  MediaModelDefinition,
  MediaTaskResult,
  MediaTaskStatus,
  MediaType,
  MediaTypeOption,
  VideoGenerationState,
} from './types';
import {
  SoraConfigFields,
  buildSoraRequestBody,
} from './video/sora-config-fields';
import { Veo3ConfigFields } from './video/veo3-config-fields';

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
        seconds: 10,
        modelVersion: 'sora2',
        size: '16:9',
        inputMode: 'text',
        quality: 'standard',
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
    {
      id: 'nano-banana',
      label: 'Nano Banana',
      description: 'Fast image creation with edit support',
      provider: 'Google',
      mediaType: 'image',
      modelName: 'nano-banana',
      model: 'google/nano-banana',
      defaultConfig: {
        inputMode: 'text',
        outputFormat: 'png',
        imageSize: '1:1',
      },
      configComponent: NanoBananaConfigFields,
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

const buildNanoBananaRequestBody = ({
  prompt,
  resolvedConfig,
}: {
  prompt: string;
  resolvedConfig: MediaModelConfig;
}) => {
  const inputMode = resolvedConfig.inputMode === 'image' ? 'image' : 'text';
  const outputFormat =
    typeof resolvedConfig.outputFormat === 'string'
      ? resolvedConfig.outputFormat.trim()
      : '';
  const imageSize =
    typeof resolvedConfig.imageSize === 'string'
      ? resolvedConfig.imageSize.trim()
      : '';
  const imageUrls = Array.isArray(resolvedConfig.imageUrls)
    ? resolvedConfig.imageUrls
        .filter((item) => typeof item === 'string')
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
    : [];

  const inputPayload: Record<string, unknown> = { prompt };

  if (outputFormat) {
    inputPayload.output_format = outputFormat;
  }

  if (imageSize) {
    inputPayload.image_size = imageSize;
  }

  if (inputMode === 'image' && imageUrls.length > 0) {
    inputPayload.image_urls = imageUrls;
  }

  return {
    model:
      inputMode === 'image' ? 'google/nano-banana-edit' : 'google/nano-banana',
    input: inputPayload,
  };
};

type UseMediaGeneratorOptions = {
  initialMediaType?: MediaType;
  lockedMediaType?: MediaType;
  preferredModelId?: string;
};

export function useMediaGeneratorController({
  initialMediaType,
  lockedMediaType,
  preferredModelId,
}: UseMediaGeneratorOptions = {}) {
  const resolvedInitial = lockedMediaType ?? initialMediaType ?? 'video';
  const [mediaType, setMediaTypeState] = useState<MediaType>(resolvedInitial);
  const [activeGeneration, setActiveGeneration] =
    useState<VideoGenerationState | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeModelId, setActiveModelId] = useState<string>('');
  const [modelConfigs, setModelConfigs] =
    useState<Record<string, MediaModelConfig>>(createInitialConfigs);
  const [prompt, setPrompt] = useState('');

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
      if (
        preferredModelId &&
        availableModels.some((model) => model.id === preferredModelId)
      ) {
        return preferredModelId;
      }
      return availableModels[0]?.id ?? '';
    });
  }, [availableModels, preferredModelId]);

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
      const configModelVersion =
        typeof resolvedConfig.modelVersion === 'string'
          ? resolvedConfig.modelVersion.trim()
          : '';
      const resolvedModelName = configModelVersion || definition.modelName;
      const fileUuids: string[] = [];

      setIsSubmitting(true);

      try {
        const isSora = definition.id === 'sora';
        const isNanoBanana = definition.id === 'nano-banana';
        const requestBody = isSora
          ? buildSoraRequestBody({
              prompt: trimmedPrompt,
              resolvedConfig,
              fileUuids,
            })
          : isNanoBanana
            ? buildNanoBananaRequestBody({
                prompt: trimmedPrompt,
                resolvedConfig,
              })
            : {
                mediaType: payload.mediaType.toUpperCase(),
                modelName: resolvedModelName,
                model: definition.model ?? definition.modelName,
                prompt: trimmedPrompt,
                ...resolvedConfig,
              };

      const queryParams = new URLSearchParams();
      queryParams.set('mediaType', payload.mediaType.toUpperCase());
      queryParams.set('modelName', resolvedModelName);
        Array.from(new Set(fileUuids)).forEach((uuid) => {
          queryParams.append('fileUuids', uuid);
        });

        const queryString = queryParams.toString();
        const endpoint = queryString
          ? `/api/media/generate?${queryString}`
          : '/api/media/generate';

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
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
          mediaType: payload.mediaType,
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
          mediaType: payload.mediaType,
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
    onGenerate: handleGenerate,
    isGenerating: isSubmitting,
    activeGeneration,
  };
}
