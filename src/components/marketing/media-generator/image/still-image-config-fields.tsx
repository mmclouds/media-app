'use client';

import {
  AspectRatioField,
  SelectField,
  SliderField,
} from '../shared/config-field-controls';
import { PromptEditor } from '../shared/prompt-editor';
import type { MediaModelConfigProps } from '../types';

const stillRatios = ['1:1', '3:4', '16:9'];

export function StillImageConfigFields({
  config,
  onChange,
  prompt,
  onPromptChange,
}: MediaModelConfigProps) {
  const defaultRatio = '1:1';
  const ratio = (config.aspectRatio as string) ?? defaultRatio;
  const defaultQuality = 75;
  const quality = Number(config.quality ?? defaultQuality);
  const qualityOptions = [50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];

  return (
    <div className="space-y-4">
      <PromptEditor value={prompt} onChange={onPromptChange} />
      <AspectRatioField
        label="Aspect ratio"
        value={ratio}
        defaultValue={defaultRatio}
        options={stillRatios}
        onChange={(value) =>
          onChange({
            ...config,
            aspectRatio: value,
          })
        }
      />
      <SliderField
        label="Quality"
        value={quality}
        defaultValue={defaultQuality}
        options={qualityOptions}
        suffix="%"
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
