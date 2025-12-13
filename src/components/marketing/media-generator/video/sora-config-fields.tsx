'use client';

import { PromptEditor } from '../shared/prompt-editor';
import {
  AspectRatioField,
  ModelVersionSwitcher,
  SliderField,
} from '../shared/config-field-controls';
import { SingleImageUploadField } from '../shared/single-image-upload-field';
import type { MediaModelConfig, MediaModelConfigProps } from '../types';

const generationModes = [
  {
    value: 'text',
    label: 'Text to Video',
  },
  {
    value: 'image',
    label: 'Image to Video',
  },
];

const soraVersions = [
  {
    value: 'sora2',
    label: 'sora2',
    description: 'Faster drafts for short clips.',
  },
  {
    value: 'sora2-pro',
    label: 'sora2-pro',
    description: 'Sharper visuals with steadier motion.',
  },
];

export const buildSoraRequestBody = ({
  prompt,
  resolvedConfig,
  fileUuids,
}: {
  prompt: string;
  resolvedConfig: MediaModelConfig;
  fileUuids: string[];
}) => {
  const inputMode = resolvedConfig.inputMode === 'image' ? 'image' : 'text';
  const modelVersion =
    resolvedConfig.modelVersion === 'sora2-pro' ? 'sora2-pro' : 'sora2';
  const sizeValue =
    typeof resolvedConfig.size === 'string'
      ? resolvedConfig.size.toLowerCase()
      : '';
  const aspectRatio =
    sizeValue === '9:16' || sizeValue === '9x16'
      ? 'portrait'
      : sizeValue === 'portrait'
        ? 'portrait'
        : 'landscape';
  const frames =
    typeof resolvedConfig.seconds === 'number'
      ? resolvedConfig.seconds
      : Number(resolvedConfig.seconds);
  const nFrames =
    Number.isFinite(frames) && frames > 0
      ? frames
      : Number(resolvedConfig.seconds) || 15;
  const quality =
    typeof resolvedConfig.quality === 'string' ? resolvedConfig.quality : 'high';

  const model =
    modelVersion === 'sora2-pro'
      ? inputMode === 'image'
        ? 'sora-2-pro-image-to-video'
        : 'sora-2-pro-text-to-video'
      : inputMode === 'image'
        ? 'sora-2-image-to-video'
        : 'sora-2-text-to-video';

  const inputPayload: Record<string, unknown> = {
    prompt,
    aspect_ratio: aspectRatio,
    n_frames: `${nFrames}`,
    size: quality,
    remove_watermark: true,
  };

  if (inputMode === 'image') {
    const rawUuid =
      typeof resolvedConfig.inputImageUuid === 'string'
        ? resolvedConfig.inputImageUuid.trim()
        : '';

    if (rawUuid) {
      fileUuids.push(rawUuid);
    }
  }

  return {
    model,
    input: inputPayload,
  };
};

export function SoraConfigFields({
  config,
  onChange,
  prompt,
  onPromptChange,
}: MediaModelConfigProps) {
  const imageUploadBucket =
    process.env.NEXT_PUBLIC_UPLOAD_BUCKET ?? '0-image';
  const durationOptions = [10, 15];
  const ratioOptions = ['16:9', '9:16'];
  const defaultDuration = durationOptions[0];
  const defaultRatio = ratioOptions[0];
  const defaultModelVersion = soraVersions[0]?.value ?? '';
  const seconds = durationOptions.includes(Number(config.seconds))
    ? Number(config.seconds)
    : undefined;
  const mode = generationModes.some((option) => option.value === config.inputMode)
    ? (config.inputMode as string)
    : generationModes[0]?.value;
  const sizeValue = typeof config.size === 'string'
    ? config.size.replace('x', ':')
    : undefined;
  const size = ratioOptions.includes(sizeValue ?? '') ? sizeValue : undefined;
  const inputImage =
    typeof config.inputImage === 'string' ? (config.inputImage as string) : null;
  const configModelVersion = config.modelVersion as string | undefined;
  const modelVersion = soraVersions.some((option) => option.value === configModelVersion)
    ? configModelVersion
    : undefined;

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
      <ModelVersionSwitcher
        value={modelVersion}
        defaultValue={defaultModelVersion}
        options={soraVersions}
        onChange={(value) =>
          onChange({
            ...config,
            modelVersion: value,
          })
        }
      />

      {mode === 'image' ? (
        <SingleImageUploadField
          label="Image input"
          bucket={imageUploadBucket}
          value={inputImage}
          onChange={(value) =>
            onChange({
              ...config,
              inputImage: value ?? undefined,
            })
          }
          onUploaded={(file) =>
            onChange({
              ...config,
              inputImage: file.downloadUrl,
              inputImageUuid: file.uuid,
            })
          }
          helperText="Attach an image when using Image to Video."
          maxSize={10 * 1024 * 1024}
        />
      ) : null}

      <PromptEditor value={prompt} onChange={onPromptChange} />


      <SliderField
        label="Video Length"
        value={seconds}
        defaultValue={defaultDuration}
        options={durationOptions}
        suffix="s"
        onChange={(value) =>
          onChange({
            ...config,
            seconds: value,
          })
        }
      />
      <AspectRatioField
        label="Aspect Ratio"
        value={size}
        defaultValue={defaultRatio}
        options={ratioOptions}
        onChange={(value) =>
          onChange({
            ...config,
            size: value,
          })
        }
      />
    </div>
  );
}
