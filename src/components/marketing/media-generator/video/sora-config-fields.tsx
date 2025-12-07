'use client';

import { SelectField, SliderField } from '../shared/config-field-controls';
import type { MediaModelConfigProps } from '../types';

const soraCamera = ['Cinematic', 'Handheld', 'Studio', 'Drone'];
const soraRatios = ['1280x720', '1920x1080', '1080x1080'];

export function SoraConfigFields({ config, onChange }: MediaModelConfigProps) {
  const seconds = Number(config.seconds ?? 4);
  const size = (config.size as string) ?? '1280x720';
  const camera = (config.cameraStyle as string) ?? 'Cinematic';

  return (
    <div className="space-y-4">
      <SliderField
        label="Duration"
        value={seconds}
        min={2}
        max={10}
        step={1}
        suffix="s"
        onChange={(value) =>
          onChange({
            ...config,
            seconds: value,
          })
        }
      />
      <SelectField
        label="Resolution"
        value={size}
        options={soraRatios}
        onChange={(value) =>
          onChange({
            ...config,
            size: value,
          })
        }
      />
      <SelectField
        label="Camera style"
        value={camera}
        options={soraCamera}
        onChange={(value) =>
          onChange({
            ...config,
            cameraStyle: value,
          })
        }
      />
    </div>
  );
}
