'use client';

import { PromptEditor } from '../shared/prompt-editor';
import { SelectField, SliderField } from '../shared/config-field-controls';
import type { MediaModelConfigProps } from '../types';

const audioMoods = ['Ambient', 'Energetic', 'Dramatic', 'Chill'];

export function AudioCraftConfigFields({
  config,
  onChange,
  prompt,
  onPromptChange,
}: MediaModelConfigProps) {
  const duration = Number(config.duration ?? 8);
  const mood = (config.mood as string) ?? 'Ambient';

  return (
    <div className="space-y-4">
      <PromptEditor value={prompt} onChange={onPromptChange} />
      <SliderField
        label="Duration"
        value={duration}
        min={4}
        max={30}
        step={2}
        suffix="s"
        onChange={(value) =>
          onChange({
            ...config,
            duration: value,
          })
        }
      />
      <SelectField
        label="Mood"
        value={mood}
        options={audioMoods}
        onChange={(value) =>
          onChange({
            ...config,
            mood: value,
          })
        }
      />
    </div>
  );
}
