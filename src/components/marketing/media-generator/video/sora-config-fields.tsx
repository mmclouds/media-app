'use client';

import { PromptEditor } from '../shared/prompt-editor';
import {
  AspectRatioField,
  ModelVersionSwitcher,
  SelectField,
  SliderField,
} from '../shared/config-field-controls';
import type { MediaModelConfigProps } from '../types';


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
  }
];

export function SoraConfigFields({
  config,
  onChange,
  prompt,
  onPromptChange,
}: MediaModelConfigProps) {
  const durationOptions = [10, 15];
  const ratioOptions = ['16:9', '9:16'];
  const defaultDuration = durationOptions[0];
  const defaultRatio = ratioOptions[0];
  const defaultModelVersion = soraVersions[0]?.value ?? '';
  const seconds = durationOptions.includes(Number(config.seconds))
    ? Number(config.seconds)
    : undefined;
  const sizeValue = typeof config.size === 'string'
    ? config.size.replace('x', ':')
    : undefined;
  const size = ratioOptions.includes(sizeValue ?? '') ? sizeValue : undefined;
  const camera = (config.cameraStyle as string) ?? 'Cinematic';
  const configModelVersion = config.modelVersion as string | undefined;
  const modelVersion = soraVersions.some((option) => option.value === configModelVersion)
    ? configModelVersion
    : undefined;

  return (
    <div className="space-y-4">
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
