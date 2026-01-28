'use client';

import { useMemo } from 'react';
import {
  AspectRatioField,
  CheckboxGroupField,
} from '../shared/config-field-controls';
import { MultiImageUploadField } from '../shared/multi-image-upload-field';
import { PromptEditor } from '../shared/prompt-editor';
import { useCreditEstimate } from '../shared/use-credit-estimate';
import type { MediaModelConfig, MediaModelConfigProps } from '../types';

const generationModes = [
  { value: 'text', label: 'Text to Image' },
  { value: 'image', label: 'Image to Image' },
];

const aspectRatioOptions = ['1:1', '2:3', '3:2'];
const qualityOptions = ['medium', 'high'];

export const buildGptImageRequestBody = ({
  prompt,
  resolvedConfig,
  fileUuids,
}: {
  prompt: string;
  resolvedConfig: MediaModelConfig;
  fileUuids?: string[];
}) => {
  const inputMode = resolvedConfig.inputMode === 'image' ? 'image' : 'text';
  const aspectRatio =
    typeof resolvedConfig.aspectRatio === 'string'
      ? resolvedConfig.aspectRatio.trim()
      : '';
  const quality =
    typeof resolvedConfig.quality === 'string'
      ? resolvedConfig.quality.trim()
      : '';
  const imageUuids = Array.isArray(resolvedConfig.imageUuids)
    ? resolvedConfig.imageUuids
        .filter((item) => typeof item === 'string')
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
    : [];

  const inputPayload: Record<string, unknown> = { prompt };

  if (aspectRatio) {
    inputPayload.aspect_ratio = aspectRatio;
  }

  if (quality) {
    inputPayload.quality = quality;
  }

  if (inputMode === 'image' && fileUuids && imageUuids.length > 0) {
    imageUuids.forEach((uuid) => fileUuids.push(uuid));
  }

  return {
    model:
      inputMode === 'image'
        ? 'gpt-image/1.5-image-to-image'
        : 'gpt-image/1.5-text-to-image',
    input: inputPayload,
  };
};

export function GptImageConfigFields({
  config,
  onChange,
  prompt,
  onPromptChange,
  onCreditEstimateChange,
}: MediaModelConfigProps) {
  const mode = typeof config.inputMode === 'string' ? config.inputMode : '';
  const aspectRatio =
    typeof config.aspectRatio === 'string' ? config.aspectRatio : '';
  const quality = typeof config.quality === 'string' ? config.quality : '';
  const imageUrls = Array.isArray(config.imageUrls)
    ? config.imageUrls
        .filter((item): item is string => typeof item === 'string')
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
    : [];
  const imageUuids = Array.isArray(config.imageUuids)
    ? config.imageUuids
        .filter((item): item is string => typeof item === 'string')
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
    : [];

  const creditEstimatePayload = useMemo(
    () =>
      buildGptImageRequestBody({
        prompt: prompt || '',
        resolvedConfig: config,
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
        {generationModes.map((option) => {
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
                  inputMode: option.value,
                })
              }
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {mode === 'image' ? (
        <MultiImageUploadField
          label="Image input"
          value={imageUrls}
          onChange={(value) => {
            const nextImageUrls = value
              .filter((item): item is string => typeof item === 'string')
              .map((item) => item.trim())
              .filter((item) => item.length > 0);
            const urlToUuid = new Map<string, string>();
            imageUrls.forEach((url, index) => {
              const uuid = imageUuids[index];
              if (uuid && uuid.trim().length > 0) {
                urlToUuid.set(url, uuid.trim());
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
              .filter(
                (url): url is string =>
                  typeof url === 'string' && url.trim().length > 0
              );
            const uploadedUuids = files
              .map((file) => file.uuid)
              .filter(
                (uuid): uuid is string =>
                  typeof uuid === 'string' && uuid.trim().length > 0
              );
            const nextImageUrls = [...imageUrls, ...uploadedUrls];
            const nextImageUuids = [...imageUuids, ...uploadedUuids];
            onChange({
              ...config,
              imageUrls: nextImageUrls.length > 0 ? nextImageUrls : undefined,
              imageUuids:
                nextImageUuids.length > 0 ? nextImageUuids : undefined,
            });
          }}
          helperText="Attach images when using Image to Image."
          maxSize={10 * 1024 * 1024}
          maxFiles={16}
        />
      ) : null}

      <PromptEditor value={prompt} onChange={onPromptChange} />
      <p className="text-xs text-white/50">Max 3000 characters.</p>

      <AspectRatioField
        label="Aspect Ratio"
        value={aspectRatio}
        options={aspectRatioOptions}
        onChange={(value) =>
          onChange({
            ...config,
            aspectRatio: value,
          })
        }
      />

      <CheckboxGroupField
        title="Quality"
        value={quality}
        options={qualityOptions}
        onChange={(value) =>
          onChange({
            ...config,
            quality: value,
          })
        }
      />
    </div>
  );
}
