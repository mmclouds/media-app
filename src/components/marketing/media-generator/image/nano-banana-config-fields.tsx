'use client';

import {
  AspectRatioField,
  SelectField,
} from '../shared/config-field-controls';
import { MultiImageUploadField } from '../shared/multi-image-upload-field';
import { PromptEditor } from '../shared/prompt-editor';
import type { MediaModelConfigProps } from '../types';

const generationModes = [
  { value: 'text', label: 'Text to Image' },
  { value: 'image', label: 'Image to Image' },
];

const outputFormatOptions = ['png', 'jpeg'];
const imageSizeOptions = [
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

export function NanoBananaConfigFields({
  config,
  onChange,
  prompt,
  onPromptChange,
}: MediaModelConfigProps) {
  const defaultMode = generationModes[0]?.value ?? 'text';
  const mode = generationModes.some((option) => option.value === config.inputMode)
    ? (config.inputMode as string)
    : defaultMode;
  const defaultOutputFormat = outputFormatOptions[0] ?? 'png';
  const outputFormat = outputFormatOptions.includes(config.outputFormat as string)
    ? (config.outputFormat as string)
    : defaultOutputFormat;
  const sizeValue =
    typeof config.imageSize === 'string'
      ? config.imageSize.replace('x', ':')
      : undefined;
  const defaultImageSize = imageSizeOptions[0] ?? '1:1';
  const imageSize = imageSizeOptions.includes(sizeValue ?? '')
    ? (sizeValue as string)
    : defaultImageSize;
  const imageUrls = Array.isArray(config.imageUrls)
    ? (config.imageUrls.filter((item) => typeof item === 'string') as string[])
    : [];

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

      <PromptEditor value={prompt} onChange={onPromptChange} />
      <p className="text-xs text-white/50">Max 5000 characters.</p>

      <SelectField
        label="Output format"
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
        defaultValue={defaultImageSize}
        options={imageSizeOptions}
        onChange={(value) =>
          onChange({
            ...config,
            imageSize: value,
          })
        }
      />

      {mode === 'image' ? (
        <MultiImageUploadField
          label="Image input"
          value={imageUrls}
          onChange={(value) =>
            onChange({
              ...config,
              imageUrls: value.length > 0 ? value : undefined,
            })
          }
          helperText="Attach images when using Image to Image."
          maxSize={10 * 1024 * 1024}
          maxFiles={10}
        />
      ) : null}
    </div>
  );
}
