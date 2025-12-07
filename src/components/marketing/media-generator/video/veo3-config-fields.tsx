'use client';

import { PromptEditor } from '../shared/prompt-editor';
import {
  SelectField,
  SliderField,
  ToggleField,
} from '../shared/config-field-controls';
import type { MediaModelConfigProps } from '../types';

const VEo3Presets = ['Hyperreal', 'Stylized', 'Action', 'Dreamscape'];

export function Veo3ConfigFields({
  config,
  onChange,
  prompt,
  onPromptChange,
}: MediaModelConfigProps) {
  const preset = (config.preset as string) ?? 'Hyperreal';
  const defaultFps = 24;
  const fps = Number(config.fps ?? defaultFps);
  const hasSound = Boolean(config.includeAudio ?? true);
  const fpsOptions = [12, 18, 24, 30, 36, 42, 48, 54, 60];

  return (
    <div className="space-y-4">
      <PromptEditor value={prompt} onChange={onPromptChange} />
      <SelectField
        label="Preset"
        value={preset}
        options={VEo3Presets}
        onChange={(value) =>
          onChange({
            ...config,
            preset: value,
          })
        }
      />
      <SliderField
        label="Frame rate"
        value={fps}
        defaultValue={defaultFps}
        options={fpsOptions}
        suffix="fps"
        onChange={(value) =>
          onChange({
            ...config,
            fps: value,
          })
        }
      />
      <ToggleField
        label="Include audio bed"
        checked={hasSound}
        onChange={(checked) =>
          onChange({
            ...config,
            includeAudio: checked,
          })
        }
      />
    </div>
  );
}
