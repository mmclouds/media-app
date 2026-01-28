'use client';

import { useCurrentUser } from '@/hooks/use-current-user';
import { Image as ImageIcon, Music, Video } from 'lucide-react';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { toast } from 'sonner';
import { SunoConfigFields } from './audio/suno-config-fields';
import {
  GptImageConfigFields,
  buildGptImageRequestBody,
} from './image/gpt-image-1-5-config-fields';
import {
  NanoBananaConfigFields,
  buildNanoBananaRequestBody,
} from './image/nano-banana-config-fields';
import {
  NanoBananaProConfigFields,
  buildNanoBananaProRequestBody,
} from './image/nano-banana-pro-config-fields';
import {
  ZImageConfigFields,
  buildZImageRequestBody,
} from './image/z-image-config-fields';

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
  KlingConfigFields,
  buildKlingRequestBody,
} from './video/kling-config-fields';
import {
  SoraConfigFields,
  buildSoraRequestBody,
} from './video/sora-config-fields';
import {
  Veo3ConfigFields,
  buildVeo3RequestBody,
} from './video/veo3-config-fields';

const POLLING_INTERVAL_MS = 5000;
const FINAL_STATUSES: MediaTaskStatus[] = ['completed', 'failed', 'timeout'];

const readPersistedSelection = (key: string) => {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as {
      mediaType?: MediaType;
      modelId?: string;
    };
    return parsed;
  } catch (error) {
    console.error('读取媒体工作区缓存失败:', error);
    return null;
  }
};

const writePersistedSelection = (
  key: string,
  selection: { mediaType: MediaType; modelId: string }
) => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    const serialized = JSON.stringify(selection);
    window.localStorage.setItem(key, serialized);
    document.cookie = `${key}=${encodeURIComponent(
      serialized
    )}; Path=/; Max-Age=2592000; SameSite=Lax`;
  } catch (error) {
    console.error('写入媒体工作区缓存失败:', error);
  }
};

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
      description: 'Realistic world & audio simulation',
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
      supportsCreditEstimate: true,
    },
    {
      id: 'veo3',
      label: 'Veo 3.1',
      description: 'Cinematic motion with crisp detail',
      provider: 'Google',
      mediaType: 'video',
      modelName: 'veo3.1',
      model: 'veo3.1',
      defaultConfig: {
        generationType: 'TEXT_2_VIDEO',
        modelVersion: 'veo3_fast',
        aspectRatio: '16:9',
      },
      configComponent: Veo3ConfigFields,
      supportsCreditEstimate: true,
    },
    {
      id: 'kling-2.6',
      label: 'Kling 2.6',
      description: 'Kling 2.6 is Kling AI’s audio-visual generation model',
      provider: 'Kling AI',
      mediaType: 'video',
      modelName: 'kling-2.6',
      model: 'kling-2.6',
      defaultConfig: {
        model: 'kling-2.6/text-to-video',
        aspect_ratio: '1:1',
        sound: true,
        duration: 5,
      },
      configComponent: KlingConfigFields,
      supportsCreditEstimate: true,
    },
  ],
  image: [
    {
      id: 'gpt-image-1.5',
      label: 'GPT Image 1.5',
      description: 'GPT Image 1.5 is OpenAIs flagship image generation model',
      provider: 'OpenAI',
      mediaType: 'image',
      modelName: 'gpt-image-1.5',
      model: 'gpt-image-1.5',
      defaultConfig: {
        inputMode: 'text',
        aspectRatio: '1:1',
        quality: 'medium',
      },
      configComponent: GptImageConfigFields,
      supportsCreditEstimate: true,
    },
    {
      id: 'nano-banana',
      label: 'Nano Banana',
      description: 'Ultra-high character consistency',
      provider: 'Google',
      mediaType: 'image',
      modelName: 'nano-banana',
      model: 'google/nano-banana',
      defaultConfig: {
        inputMode: 'text',
        outputFormat: 'png',
        imageSize: 'auto',
      },
      configComponent: NanoBananaConfigFields,
      supportsCreditEstimate: true,
    },
    {
      id: 'nano-banana-pro',
      label: 'Nano Banana Pro',
      description:
        "Google DeepMind's Nano Banana Pro delivers sharper 2K imagery, intelligent 4K scaling",
      provider: 'Google',
      mediaType: 'image',
      modelName: 'nano-banana-pro',
      model: 'google/nano-banana-pro',
      defaultConfig: {
        outputFormat: 'png',
        resolution: '2K',
        aspectRatio: 'auto',
      },
      configComponent: NanoBananaProConfigFields,
      supportsCreditEstimate: true,
    },
    {
      id: 'z-image',
      label: 'Z-Image',
      description: 'Z-Image is Tongyi-MAIs efficient image generation model',
      provider: 'Tongyi-MAI',
      mediaType: 'image',
      modelName: 'z-image',
      model: 'z-image',
      defaultConfig: {
        aspectRatio: '1:1',
      },
      configComponent: ZImageConfigFields,
      supportsCreditEstimate: true,
    },
  ],
  audio: [
    {
      id: 'suno',
      label: 'suno',
      description: 'Lush vocals and detailed musical texture',
      provider: 'suno',
      mediaType: 'audio',
      modelName: 'suno',
      model: 'V5',
      defaultConfig: {
        customMode: true,
        instrumental: false,
        style: '',
        title: '',
        negativeTags: '',
      },
      configComponent: SunoConfigFields,
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
  preferredModelId?: string;
  persistKey?: string;
};

export function useMediaGeneratorController({
  initialMediaType,
  lockedMediaType,
  preferredModelId,
  persistKey,
}: UseMediaGeneratorOptions = {}) {
  const resolvedInitial = lockedMediaType ?? initialMediaType ?? 'video';
  const initialModels = MODEL_REGISTRY[resolvedInitial] ?? [];
  const initialModelId =
    preferredModelId &&
    initialModels.some((model) => model.id === preferredModelId)
      ? preferredModelId
      : (initialModels[0]?.id ?? '');
  const [mediaType, setMediaTypeState] = useState<MediaType>(resolvedInitial);
  const [activeGeneration, setActiveGeneration] =
    useState<VideoGenerationState | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);
  const [activeModelId, setActiveModelId] = useState<string>(initialModelId);
  const [modelConfigs, setModelConfigs] =
    useState<Record<string, MediaModelConfig>>(createInitialConfigs);
  const [prompt, setPrompt] = useState('');
  const [restoredModelId, setRestoredModelId] = useState<string | null>(null);
  const hasRestoredRef = useRef(false);
  const currentUser = useCurrentUser();
  const finishGeneration = useCallback(() => {
    isSubmittingRef.current = false;
    setIsSubmitting(false);
  }, []);

  const effectiveMediaType = lockedMediaType ?? mediaType;

  const availableModels = useMemo(
    () => MODEL_REGISTRY[effectiveMediaType] ?? [],
    [effectiveMediaType]
  );

  useLayoutEffect(() => {
    if (!persistKey || hasRestoredRef.current) {
      return;
    }

    const restored = readPersistedSelection(persistKey);
    hasRestoredRef.current = true;

    if (!restored) {
      return;
    }

    if (!lockedMediaType && !initialMediaType && restored.mediaType) {
      setMediaTypeState(restored.mediaType);
    }

    if (!preferredModelId && restored.modelId) {
      setRestoredModelId(restored.modelId);
    }
  }, [persistKey, lockedMediaType, initialMediaType, preferredModelId]);

  useEffect(() => {
    if (!availableModels.length) {
      setActiveModelId('');
      return;
    }
    setActiveModelId((prev) => {
      if (
        restoredModelId &&
        availableModels.some((model) => model.id === restoredModelId)
      ) {
        return restoredModelId;
      }
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
  }, [availableModels, preferredModelId, restoredModelId]);

  useEffect(() => {
    if (!restoredModelId || !activeModelId) {
      return;
    }
    setRestoredModelId(null);
  }, [restoredModelId, activeModelId]);

  useEffect(() => {
    if (!persistKey || !activeModelId) {
      return;
    }

    if (!availableModels.some((model) => model.id === activeModelId)) {
      return;
    }

    writePersistedSelection(persistKey, {
      mediaType: effectiveMediaType,
      modelId: activeModelId,
    });
  }, [persistKey, activeModelId, effectiveMediaType, availableModels]);

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
      if (!currentUser) {
        return;
      }
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

      if (isSubmittingRef.current) {
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
      let resolvedModelName = configModelVersion || definition.modelName;
      const fileUuids: string[] = [];
      const rawGenerationType =
        typeof resolvedConfig.generationType === 'string'
          ? resolvedConfig.generationType.trim()
          : '';

      isSubmittingRef.current = true;
      setIsSubmitting(true);

      try {
        const isSora = definition.id === 'sora';
        const isNanoBanana = definition.id === 'nano-banana';
        const isNanoBananaPro = definition.id === 'nano-banana-pro';
        const isVeo3 = definition.id === 'veo3';
        const isKling = definition.id === 'kling-2.6';
        const isGptImage = definition.id === 'gpt-image-1.5';
        const isZImage = definition.id === 'z-image';
        if (isVeo3 && (definition.model ?? definition.modelName)) {
          resolvedModelName = definition.model ?? definition.modelName;
        }
        const requestBody = (
          isSora
            ? buildSoraRequestBody({
                prompt: trimmedPrompt,
                resolvedConfig,
                fileUuids,
              })
            : isNanoBanana
              ? buildNanoBananaRequestBody({
                  prompt: trimmedPrompt,
                  resolvedConfig,
                  fileUuids,
                })
              : isNanoBananaPro
                ? buildNanoBananaProRequestBody({
                    prompt: trimmedPrompt,
                    resolvedConfig,
                    fileUuids,
                  })
                : isVeo3
                  ? buildVeo3RequestBody({
                      prompt: trimmedPrompt,
                      resolvedConfig,
                      fileUuids,
                    })
                  : isKling
                    ? buildKlingRequestBody({
                        prompt: trimmedPrompt,
                        resolvedConfig,
                        fileUuids,
                      })
                    : isGptImage
                      ? buildGptImageRequestBody({
                          prompt: trimmedPrompt,
                          resolvedConfig,
                          fileUuids,
                        })
                      : isZImage
                        ? buildZImageRequestBody({
                            prompt: trimmedPrompt,
                            resolvedConfig,
                          })
                        : {
                            mediaType: payload.mediaType.toUpperCase(),
                            modelName: resolvedModelName,
                            model: definition.model ?? definition.modelName,
                            prompt: trimmedPrompt,
                            ...resolvedConfig,
                          }
        ) as Record<string, unknown>;

        if (isVeo3) {
          const generationType =
            typeof requestBody.generationType === 'string'
              ? requestBody.generationType
              : rawGenerationType;
          const imageUrls = Array.isArray(requestBody.imageUrls)
            ? requestBody.imageUrls.filter(
                (item): item is string =>
                  typeof item === 'string' && item.trim().length > 0
              )
            : [];

          if (
            (generationType === 'REFERENCE_2_VIDEO' ||
              generationType === 'FIRST_AND_LAST_FRAMES_2_VIDEO') &&
            imageUrls.length === 0
          ) {
            toast.error(
              generationType === 'REFERENCE_2_VIDEO'
                ? 'Add at least 1 reference image.'
                : 'Add at least 1 frame image.'
            );
            isSubmittingRef.current = false;
            setIsSubmitting(false);
            return;
          }
        }
        if (isGptImage) {
          const inputMode =
            typeof resolvedConfig.inputMode === 'string'
              ? resolvedConfig.inputMode.trim()
              : '';
          if (inputMode === 'image' && fileUuids.length === 0) {
            toast.error('Add at least 1 input image.');
            isSubmittingRef.current = false;
            setIsSubmitting(false);
            return;
          }
        }
        if (isKling) {
          const mode =
            typeof resolvedConfig.model === 'string'
              ? resolvedConfig.model.trim()
              : '';
          if (mode === 'kling-2.6/image-to-video' && fileUuids.length === 0) {
            toast.error('Add at least 1 input image.');
            isSubmittingRef.current = false;
            setIsSubmitting(false);
            return;
          }
        }

        const queryParams = new URLSearchParams();
        queryParams.set('mediaType', payload.mediaType.toUpperCase());
        queryParams.set('modelName', resolvedModelName);
        const uuidParamName = isNanoBananaPro
          ? 'inputFileUuids'
          : isKling
            ? 'inputFileUuids'
            : 'fileUuids';
        Array.from(new Set(fileUuids)).forEach((uuid) => {
          queryParams.append(uuidParamName, uuid);
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
          source?: 'gateway' | 'local';
        } | null;

        if (!response.ok || !result?.taskId) {
          const errorMessage =
            result?.error ?? result?.message ?? 'Failed to start generation.';
          const isGatewayError = result?.source === 'gateway';

          if (!isGatewayError) {
            toast.error(errorMessage);
          }

          if (response.status === 402 && !isGatewayError) {
            isSubmittingRef.current = false;
            setIsSubmitting(false);
            return;
          }
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
      }
    },
    [availableModels, currentUser]
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
    finishGeneration,
  };
}
