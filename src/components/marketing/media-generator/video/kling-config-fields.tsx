'use client';

import { useMemo } from 'react';
import {
  AspectRatioField,
  CheckboxGroupField,
  SwitchField,
} from '../shared/config-field-controls';
import { MultiImageUploadField } from '../shared/multi-image-upload-field';
import { PromptEditor } from '../shared/prompt-editor';
import { useCreditEstimate } from '../shared/use-credit-estimate';
import type { MediaModelConfig, MediaModelConfigProps } from '../types';

const klingModes = [
  { value: 'kling-2.6/text-to-video', label: 'text-to-video' },
  { value: 'kling-2.6/image-to-video', label: 'image-to-video' },
];

const aspectRatioOptions = ['1:1', '16:9', '9:16'];
const durationOptions = ['5', '10'];

const normalizeStringValue = (value: unknown) =>
  typeof value === 'string' ? value.trim() : '';

const normalizeStringArray = (value: unknown) =>
  Array.isArray(value)
    ? value
        .filter((item): item is string => typeof item === 'string')
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
    : [];

const resolveMode = (value: string) =>
  klingModes.some((mode) => mode.value === value)
    ? value
    : 'kling-2.6/text-to-video';

const resolveAspectRatio = (value: string) =>
  aspectRatioOptions.includes(value) ? value : '1:1';

const resolveDuration = (value: unknown) => {
  const numeric =
    typeof value === 'number'
      ? value
      : typeof value === 'string'
        ? Number(value)
        : Number.NaN;
  return numeric === 10 ? 10 : 5;
};

export const buildKlingRequestBody = ({
  prompt,
  resolvedConfig,
  fileUuids,
}: {
  prompt: string;
  resolvedConfig: MediaModelConfig;
  fileUuids?: string[];
}) => {
  const model = resolveMode(normalizeStringValue(resolvedConfig.model));
  const duration = resolveDuration(resolvedConfig.duration);
  const sound =
    typeof resolvedConfig.sound === 'boolean' ? resolvedConfig.sound : true;
  const aspectRatio = resolveAspectRatio(
    normalizeStringValue(resolvedConfig.aspect_ratio)
  );

  if (model === 'kling-2.6/image-to-video' && fileUuids) {
    const imageUuids = normalizeStringArray(resolvedConfig.imageUuids);
    imageUuids.forEach((uuid) => {
      if (uuid.length > 0) {
        fileUuids.push(uuid);
      }
    });
  }

  const input: Record<string, unknown> = {
    prompt,
    duration,
    sound,
  };

  if (model === 'kling-2.6/image-to-video') {
    input.aspect_ratio = aspectRatio;
  }

  return {
    model,
    input,
  };
};

export function KlingConfigFields({
  config,
  onChange,
  prompt,
  onPromptChange,
  onCreditEstimateChange,
}: MediaModelConfigProps) {
  const imageUploadBucket = process.env.NEXT_PUBLIC_UPLOAD_BUCKET ?? '0-image';
  const mode = resolveMode(normalizeStringValue(config.model));
  const isImageMode = mode === 'kling-2.6/image-to-video';
  const aspectRatio = resolveAspectRatio(
    normalizeStringValue(config.aspect_ratio)
  );
  const duration = resolveDuration(config.duration);
  const durationValue = String(duration);
  const sound = typeof config.sound === 'boolean' ? config.sound : true;

  const imageUrls = normalizeStringArray(config.imageUrls);
  const imageUuids = normalizeStringArray(config.imageUuids);

  const creditEstimatePayload = useMemo(
    () =>
      buildKlingRequestBody({
        prompt: prompt || '',
        resolvedConfig: config,
        fileUuids: [],
      }),
    [config]
  );

  useCreditEstimate({
    payload: creditEstimatePayload,
    onCreditEstimateChange,
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-2 rounded-2xl border border-white/15 bg-black/60 p-1">
        {klingModes.map((option) => {
          const isActive = option.value === mode;
          return (
            <button
              key={option.value}
              type="button"
              className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                isActive
                  ? 'bg-white/10 text-white shadow-lg shadow-white/10'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
              onClick={() =>
                onChange({
                  ...config,
                  model: option.value,
                })
              }
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {isImageMode ? (
        <MultiImageUploadField
          label="Image inputs"
          bucket={imageUploadBucket}
          value={imageUrls}
          onChange={(value) => {
            const nextImageUrls = normalizeStringArray(value).slice(0, 5);
            const urlToUuid = new Map<string, string>();
            imageUrls.forEach((url, index) => {
              const uuid = imageUuids[index];
              if (uuid) {
                urlToUuid.set(url, uuid);
              }
            });
            const nextImageUuids = nextImageUrls
              .map((url) => urlToUuid.get(url))
              .filter(
                (uuid): uuid is string =>
                  typeof uuid === 'string' && uuid.trim().length > 0
              );
            onChange({
              ...config,
              imageUrls: nextImageUrls.length > 0 ? nextImageUrls : undefined,
              imageUuids:
                nextImageUuids.length > 0 ? nextImageUuids : undefined,
            });
          }}
          onUploaded={(files) => {
            const uploadedUrls = files
              .map((file) => file.downloadUrl)
              .filter((url): url is string => typeof url === 'string' && url);
            const uploadedUuids = files
              .map((file) => file.uuid)
              .filter(
                (uuid): uuid is string => typeof uuid === 'string' && uuid
              );
            const nextImageUrls = [...imageUrls, ...uploadedUrls].slice(0, 5);
            const nextImageUuids = [...imageUuids, ...uploadedUuids].slice(
              0,
              5
            );
            onChange({
              ...config,
              imageUrls: nextImageUrls.length > 0 ? nextImageUrls : undefined,
              imageUuids:
                nextImageUuids.length > 0 ? nextImageUuids : undefined,
            });
          }}
          helperText="Upload 1-5 images for Image to Video."
          maxFiles={5}
          maxSize={10 * 1024 * 1024}
        />
      ) : null}

      <PromptEditor
        value={prompt}
        onChange={onPromptChange}
        maxLength={2500}
        helperText="Max 2500 characters."
      />

      {isImageMode ? (
        <AspectRatioField
          label="Aspect Ratio"
          value={aspectRatio}
          options={aspectRatioOptions}
          onChange={(value) =>
            onChange({
              ...config,
              aspect_ratio: value,
            })
          }
        />
      ) : null}

      <SwitchField
        label="Include sound"
        checked={sound}
        onChange={(value) =>
          onChange({
            ...config,
            sound: value,
          })
        }
      />

      <CheckboxGroupField
        title="Duration (seconds)"
        value={durationValue}
        options={durationOptions}
        onChange={(value) =>
          onChange({
            ...config,
            duration: Number(value),
          })
        }
      />
    </div>
  );
}
