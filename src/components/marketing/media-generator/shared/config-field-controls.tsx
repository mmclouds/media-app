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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export type ModelVersionOption = {
  value: string;
  label: string;
  description?: string;
};

export function ModelVersionSwitcher({
  value,
  options,
  onChange,
}: {
  value: string;
  options: ModelVersionOption[];
  onChange: (value: string) => void;
}) {
  return (
    <TooltipProvider>
      <div className="space-y-2">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {options.map((option) => {
            const isActive = option.value === value;
            return (
              <Tooltip key={option.value}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className={`flex w-full flex-col items-start gap-1 rounded-xl border px-4 py-3 text-left transition ${
                      isActive
                        ? 'border-white bg-white/10 text-white shadow-lg shadow-white/10'
                        : 'border-white/15 bg-black/60 text-white/80 hover:border-white/30 hover:bg-white/5'
                    }`}
                    onClick={() => onChange(option.value)}
                  >
                    <span className="text-sm font-medium">{option.label}</span>
                    {option.description ? (
                      <span className="text-[11px] text-white/50">
                        Hover for model details
                      </span>
                    ) : null}
                  </button>
                </TooltipTrigger>
                {option.description ? (
                  <TooltipContent className="max-w-xs">
                    <p>{option.description}</p>
                  </TooltipContent>
                ) : null}
              </Tooltip>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
}

// 时长控件
export function SliderField({
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

export function SelectField({
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

export function ToggleField({
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
