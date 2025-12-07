'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import type { MediaModelConfig, MediaModelConfigProps } from './types';

const VEo3Presets = ['Hyperreal', 'Stylized', 'Action', 'Dreamscape'];
const soraCamera = ['Cinematic', 'Handheld', 'Studio', 'Drone'];
const soraRatios = ['1280x720', '1920x1080', '1080x1080'];
const stillRatios = ['1:1', '3:4', '16:9'];
const audioMoods = ['Ambient', 'Energetic', 'Dramatic', 'Chill'];

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

export function Veo3ConfigFields({ config, onChange }: MediaModelConfigProps) {
  const preset = (config.preset as string) ?? 'Hyperreal';
  const fps = Number(config.fps ?? 24);
  const hasSound = Boolean(config.includeAudio ?? true);

  return (
    <div className="space-y-4">
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
        min={12}
        max={60}
        step={6}
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

export function StillImageConfigFields({
  config,
  onChange,
}: MediaModelConfigProps) {
  const ratio = (config.aspectRatio as string) ?? '1:1';
  const quality = Number(config.quality ?? 75);

  return (
    <div className="space-y-4">
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

export function AudioCraftConfigFields({
  config,
  onChange,
}: MediaModelConfigProps) {
  const duration = Number(config.duration ?? 8);
  const mood = (config.mood as string) ?? 'Ambient';

  return (
    <div className="space-y-4">
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

function SliderField({
  label,
  value,
  min,
  max,
  step,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs text-white/70">
        {label}{' '}
        <span className="text-white/40">
          {value}
          {suffix}
        </span>
      </Label>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([next]) => onChange(next)}
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs text-white/70">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-10 rounded-xl border-white/20 bg-black/60 text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/20 bg-black/60 px-4 py-2 text-sm text-white/80">
      {label}
      <input
        type="checkbox"
        className="h-4 w-4 accent-white"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  );
}
