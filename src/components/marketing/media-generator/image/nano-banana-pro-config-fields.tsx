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

const outputFormatOptions = ['png', 'jpg'];
const resolutionOptions = ['1K', '2K', '4K'];
const aspectRatioOptions = [
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
  'auto',
];

export const buildNanoBananaProRequestBody = ({
  prompt,
  resolvedConfig,
  fileUuids,
}: {
  prompt: string;
  resolvedConfig: MediaModelConfig;
  fileUuids?: string[];
}) => {
  const outputFormat =
    typeof resolvedConfig.outputFormat === 'string'
      ? resolvedConfig.outputFormat.trim()
      : '';
  const resolution =
    typeof resolvedConfig.resolution === 'string'
      ? resolvedConfig.resolution.trim()
      : '';
  const aspectRatio =
    typeof resolvedConfig.aspectRatio === 'string'
      ? resolvedConfig.aspectRatio.trim()
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

  if (resolution) {
    inputPayload.resolution = resolution;
  }

  if (aspectRatio) {
    inputPayload.aspect_ratio = aspectRatio;
  }

  if (fileUuids && imageUuids.length > 0) {
    imageUuids.forEach((uuid) => fileUuids.push(uuid));
  }

  return {
    model: 'google/nano-banana-pro',
    input: inputPayload,
  };
};

export function NanoBananaProConfigFields({
  config,
  onChange,
  prompt,
  onPromptChange,
  onCreditEstimateChange,
}: MediaModelConfigProps) {
  const outputFormat =
    typeof config.outputFormat === 'string' ? config.outputFormat : '';
  const resolution =
    typeof config.resolution === 'string' ? config.resolution : '';
  const aspectRatio =
    typeof config.aspectRatio === 'string' ? config.aspectRatio : '';
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
      buildNanoBananaProRequestBody({
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
        helperText="Optional. Add up to 8 images."
        maxSize={30 * 1024 * 1024}
        maxFiles={8}
      />

      <PromptEditor value={prompt} onChange={onPromptChange} />
      <p className="text-xs text-white/50">Max 10000 characters.</p>

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

      <CheckboxGroupField
        title="Resolution"
        value={resolution}
        options={resolutionOptions}
        onChange={(value) =>
          onChange({
            ...config,
            resolution: value,
          })
        }
      />

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
    </div>
  );
}
