'use client';

import { useMemo } from 'react';
import {
  AspectRatioField,
  ModelVersionSwitcher,
} from '../shared/config-field-controls';
import { MultiImageUploadField } from '../shared/multi-image-upload-field';
import { PromptEditor } from '../shared/prompt-editor';
import { TwoFrameImageUploadField } from '../shared/two-frame-image-upload-field';
import { useCreditEstimate } from '../shared/use-credit-estimate';
import type { MediaModelConfig, MediaModelConfigProps } from '../types';

const generationTypes = [
  { value: 'TEXT_2_VIDEO', label: 'Text to Video' },
  { value: 'FIRST_AND_LAST_FRAMES_2_VIDEO', label: 'First & Last Frames' },
  { value: 'REFERENCE_2_VIDEO', label: 'Reference to Video' },
];

const modelVersions = [
  {
    value: 'veo3_fast',
    label: 'veo3.1 Fast',
    description: 'Faster turnaround with solid quality.',
  },
  {
    value: 'veo3',
    label: 'veo3.1 Quality',
    description: 'Higher fidelity with more detail.',
  },
];

const aspectRatioOptions = ['16:9', '9:16', 'auto'];

const normalizeStringValue = (value: unknown) =>
  typeof value === 'string' ? value.trim() : '';

const resolveModelVersion = (value: string) =>
  value === 'veo3' || value === 'veo3_fast' ? value : 'veo3_fast';

const resolveGenerationType = (value: string) =>
  generationTypes.some((option) => option.value === value)
    ? value
    : 'TEXT_2_VIDEO';

const resolveAspectRatio = (value: string) => {
  const normalized = value.replace('x', ':');
  return aspectRatioOptions.includes(normalized) ? normalized : '16:9';
};

const trimStringArray = (value: unknown) =>
  Array.isArray(value)
    ? value
        .filter((item): item is string => typeof item === 'string')
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
    : [];

export const buildVeo3RequestBody = ({
  prompt,
  resolvedConfig,
  fileUuids,
}: {
  prompt: string;
  resolvedConfig: MediaModelConfig;
  fileUuids?: string[];
}) => {
  const rawGenerationType = normalizeStringValue(resolvedConfig.generationType);
  const generationType = resolveGenerationType(rawGenerationType);
  const rawModelVersion = normalizeStringValue(resolvedConfig.modelVersion);
  const rawAspectRatio = normalizeStringValue(resolvedConfig.aspectRatio);
  const aspectRatio = resolveAspectRatio(rawAspectRatio);
  const isReferenceMode = generationType === 'REFERENCE_2_VIDEO';
  const resolvedModel = isReferenceMode
    ? 'veo3_fast'
    : resolveModelVersion(rawModelVersion);
  const resolvedAspectRatio = isReferenceMode ? '16:9' : aspectRatio;

  let imageUrls: string[] = [];
  let inputFileUuids: string[] = [];

  if (generationType === 'REFERENCE_2_VIDEO') {
    const referenceUrls = trimStringArray(resolvedConfig.imageUrls).slice(0, 3);
    const referenceUuids = trimStringArray(resolvedConfig.imageUuids);
    imageUrls = referenceUrls;
    inputFileUuids = referenceUrls
      .map((_, index) => referenceUuids[index])
      .filter(
        (uuid): uuid is string => typeof uuid === 'string' && uuid.length > 0
      );
  }

  if (generationType === 'FIRST_AND_LAST_FRAMES_2_VIDEO') {
    const firstUrl = normalizeStringValue(resolvedConfig.firstFrameUrl);
    const lastUrl = normalizeStringValue(resolvedConfig.lastFrameUrl);
    const firstUuid = normalizeStringValue(resolvedConfig.firstFrameUuid);
    const lastUuid = normalizeStringValue(resolvedConfig.lastFrameUuid);

    if (firstUrl) {
      imageUrls.push(firstUrl);
      if (firstUuid) {
        inputFileUuids.push(firstUuid);
      }
    }

    if (lastUrl) {
      imageUrls.push(lastUrl);
      if (lastUuid) {
        inputFileUuids.push(lastUuid);
      }
    }
  }

  if (fileUuids && inputFileUuids.length > 0) {
    inputFileUuids.forEach((uuid) => {
      if (uuid.trim().length > 0) {
        fileUuids.push(uuid.trim());
      }
    });
  }

  const payload: Record<string, unknown> = {
    generationType,
    model: resolvedModel,
    prompt,
    aspectRatio: resolvedAspectRatio,
  };

  if (imageUrls.length > 0) {
    payload.imageUrls = imageUrls;
  }

  if (inputFileUuids.length > 0) {
    payload.inputFileUuids = inputFileUuids;
  }

  return payload;
};

export function Veo3ConfigFields({
  config,
  onChange,
  prompt,
  onPromptChange,
  onCreditEstimateChange,
}: MediaModelConfigProps) {
  const generationType = resolveGenerationType(
    normalizeStringValue(config.generationType)
  );
  const isReferenceMode = generationType === 'REFERENCE_2_VIDEO';
  const modelVersion = resolveModelVersion(
    normalizeStringValue(config.modelVersion)
  );
  const aspectRatio = resolveAspectRatio(
    normalizeStringValue(config.aspectRatio)
  );
  const resolvedModelVersion = isReferenceMode ? 'veo3_fast' : modelVersion;
  const resolvedAspectRatio = isReferenceMode ? '16:9' : aspectRatio;

  const referenceImageUrls = trimStringArray(config.imageUrls);
  const referenceImageUuids = trimStringArray(config.imageUuids);
  const firstFrameUrl = normalizeStringValue(config.firstFrameUrl) || null;
  const lastFrameUrl = normalizeStringValue(config.lastFrameUrl) || null;

  const creditEstimatePayload = useMemo(
    () => ({
      model: resolvedModelVersion,
    }),
    [resolvedModelVersion]
  );

  useCreditEstimate({
    payload: creditEstimatePayload,
    onCreditEstimateChange,
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-2 rounded-2xl border border-white/15 bg-black/60 p-1">
        {generationTypes.map((option) => {
          const isActive = option.value === generationType;
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
                  generationType: option.value,
                  modelVersion:
                    option.value === 'REFERENCE_2_VIDEO'
                      ? 'veo3_fast'
                      : modelVersion,
                  aspectRatio:
                    option.value === 'REFERENCE_2_VIDEO'
                      ? '16:9'
                      : resolvedAspectRatio,
                })
              }
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <ModelVersionSwitcher
        value={resolvedModelVersion}
        options={modelVersions}
        onChange={(value) => {
          if (isReferenceMode) {
            return;
          }
          onChange({
            ...config,
            modelVersion: value,
          });
        }}
      />

      {isReferenceMode ? (
        <p className="text-xs text-white/50">
          Reference mode is locked to veo3.1 Fast and 16:9.
        </p>
      ) : null}

      {generationType === 'FIRST_AND_LAST_FRAMES_2_VIDEO' ? (
        <TwoFrameImageUploadField
          label="Frame inputs"
          firstValue={firstFrameUrl}
          lastValue={lastFrameUrl}
          onChange={({ first, last }) => {
            const nextConfig = { ...config };
            if (first !== undefined) {
              nextConfig.firstFrameUrl = first || undefined;
              if (!first) {
                nextConfig.firstFrameUuid = undefined;
              }
            }
            if (last !== undefined) {
              nextConfig.lastFrameUrl = last || undefined;
              if (!last) {
                nextConfig.lastFrameUuid = undefined;
              }
            }
            onChange(nextConfig);
          }}
          onUploaded={({ slot, file }) => {
            onChange({
              ...config,
              firstFrameUrl:
                slot === 'first'
                  ? file.downloadUrl
                  : (firstFrameUrl ?? undefined),
              lastFrameUrl:
                slot === 'last'
                  ? file.downloadUrl
                  : (lastFrameUrl ?? undefined),
              firstFrameUuid:
                slot === 'first' ? file.uuid : config.firstFrameUuid,
              lastFrameUuid: slot === 'last' ? file.uuid : config.lastFrameUuid,
            });
          }}
          helperText="Upload 1-2 frames to guide motion."
          maxSize={10 * 1024 * 1024}
        />
      ) : null}

      {generationType === 'REFERENCE_2_VIDEO' ? (
        <MultiImageUploadField
          label="Reference images"
          value={referenceImageUrls}
          onChange={(value) => {
            const nextImageUrls = trimStringArray(value).slice(0, 3);
            const urlToUuid = new Map<string, string>();
            referenceImageUrls.forEach((url, index) => {
              const uuid = referenceImageUuids[index];
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
            const nextImageUrls = [
              ...referenceImageUrls,
              ...uploadedUrls,
            ].slice(0, 3);
            const nextImageUuids = [
              ...referenceImageUuids,
              ...uploadedUuids,
            ].slice(0, 3);
            onChange({
              ...config,
              imageUrls: nextImageUrls.length > 0 ? nextImageUrls : undefined,
              imageUuids:
                nextImageUuids.length > 0 ? nextImageUuids : undefined,
            });
          }}
          helperText="Add 1-3 reference images."
          maxSize={10 * 1024 * 1024}
          maxFiles={3}
        />
      ) : null}

      <PromptEditor value={prompt} onChange={onPromptChange} />

      <AspectRatioField
        label="Aspect Ratio"
        value={resolvedAspectRatio}
        options={aspectRatioOptions}
        onChange={(value) => {
          if (isReferenceMode) {
            return;
          }
          onChange({
            ...config,
            aspectRatio: value,
          });
        }}
      />
      <p className="text-xs text-white/50">Only 16:9 supports 1080P.</p>
    </div>
  );
}
