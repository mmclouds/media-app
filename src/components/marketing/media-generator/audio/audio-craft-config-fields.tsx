'use client';

import { SelectField, SliderField } from '../shared/config-field-controls';
import { PromptEditor } from '../shared/prompt-editor';
import type { MediaModelConfigProps } from '../types';

const audioMoods = ['Ambient', 'Energetic', 'Dramatic', 'Chill'];

export function AudioCraftConfigFields({
  config,
  onChange,
  prompt,
  onPromptChange,
}: MediaModelConfigProps) {
  const defaultDuration = 8;
  const duration = Number(config.duration ?? defaultDuration);
  const mood = (config.mood as string) ?? 'Ambient';
  const durationOptions = [4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30];

  return (
    <div className="space-y-4">
      <PromptEditor value={prompt} onChange={onPromptChange} />
      <SliderField
        label="Duration"
        value={duration}
        defaultValue={defaultDuration}
        options={durationOptions}
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
