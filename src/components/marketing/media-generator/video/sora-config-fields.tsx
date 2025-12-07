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
  const seconds = Number(config.seconds ?? 4);
  const size = (config.size as string) ?? '1280x720';
  const camera = (config.cameraStyle as string) ?? 'Cinematic';
  const modelVersion = (config.modelVersion as string) ?? 'sora-1.1';
  const durationOptions = [10,15];
  const ratioOptions = ['16:9','9:16'];;

  return (
    <div className="space-y-4">
      <ModelVersionSwitcher
        value={modelVersion}
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
