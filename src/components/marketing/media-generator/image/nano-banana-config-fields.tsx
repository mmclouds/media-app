'use client';

import {
  AspectRatioField,
  CheckboxGroupField,
} from '../shared/config-field-controls';
import { MultiImageUploadField } from '../shared/multi-image-upload-field';
import { PromptEditor } from '../shared/prompt-editor';
import { useCreditEstimate } from '../shared/use-credit-estimate';
import type { MediaModelConfig, MediaModelConfigProps } from '../types';
import { useMemo } from 'react';

const generationModes = [
  { value: 'text', label: 'Text to Image' },
  { value: 'image', label: 'Image to Image' },
];

const outputFormatOptions = ['png', 'jpeg'];
const imageSizeOptions = [
  'auto',
  '1:1',
  '9:16',
  '16:9',
  '3:4',
  '4:3',
  '3:2',
  '2:3',
  '5:4',
  '4:5',
  '21:9',
];

export const buildNanoBananaRequestBody = ({
  prompt,
  resolvedConfig,
  fileUuids,
}: {
  prompt: string;
  resolvedConfig: MediaModelConfig;
  fileUuids?: string[];
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
  const imageUuids = Array.isArray(resolvedConfig.imageUuids)
    ? resolvedConfig.imageUuids
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

  if (inputMode === 'image' && fileUuids && imageUuids.length > 0) {
    imageUuids.forEach((uuid) => fileUuids.push(uuid));
  }

  return {
    model:
      inputMode === 'image' ? 'google/nano-banana-edit' : 'google/nano-banana',
    input: inputPayload,
  };
};

export function NanoBananaConfigFields({
  config,
  onChange,
  prompt,
  onPromptChange,
  onCreditEstimateChange,
}: MediaModelConfigProps) {
  const mode =
    typeof config.inputMode === 'string' ? config.inputMode : '';
  const outputFormat =
    typeof config.outputFormat === 'string' ? config.outputFormat : '';
  const sizeValue =
    typeof config.imageSize === 'string'
      ? config.imageSize.replace('x', ':')
      : '';
  const imageSize = sizeValue;
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
      buildNanoBananaRequestBody({
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
              className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition ${isActive
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
              imageUuids: nextImageUuids.length > 0 ? nextImageUuids : undefined,
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
              imageUuids: nextImageUuids.length > 0 ? nextImageUuids : undefined,
            });
          }}
          helperText="Attach images when using Image to Image."
          maxSize={10 * 1024 * 1024}
          maxFiles={10}
        />
      ) : null}
      <PromptEditor value={prompt} onChange={onPromptChange} />
      <p className="text-xs text-white/50">Max 5000 characters.</p>

      <CheckboxGroupField
        title="Output format"
        value={outputFormat}
        options={outputFormatOptions}
        onChange={(value) =>
          onChange({
            ...config,
            outputFormat: value,
          })
        }
      />

      <AspectRatioField
        label="Image size"
        value={imageSize}
        options={imageSizeOptions}
        onChange={(value) =>
          onChange({
            ...config,
            imageSize: value,
          })
        }
      />


    </div>
  );
}
