'use client';

import { PromptEditor } from '../shared/prompt-editor';
import { SelectField, SliderField } from '../shared/config-field-controls';
import type { MediaModelConfigProps } from '../types';

const stillRatios = ['1:1', '3:4', '16:9'];

export function StillImageConfigFields({
  config,
  onChange,
  prompt,
  onPromptChange,
}: MediaModelConfigProps) {
  const ratio = (config.aspectRatio as string) ?? '1:1';
  const quality = Number(config.quality ?? 75);

  return (
    <div className="space-y-4">
      <PromptEditor value={prompt} onChange={onPromptChange} />
      <SelectField
        label="Aspect ratio"
        value={ratio}
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
        min={50}
        max={100}
        step={5}
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
