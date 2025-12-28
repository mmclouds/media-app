'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

export type ResolutionOption = 'standard' | 'high';

const resolutionOptions: { value: ResolutionOption; label: string }[] = [
  { value: 'standard', label: 'Standard' },
  { value: 'high', label: 'High' },
];

export function ModelVersionSwitcher({
  value,
  defaultValue,
  options,
  onChange,
}: {
  value?: string;
  defaultValue: string;
  options: ModelVersionOption[];
  onChange: (value: string) => void;
}) {
  const selectedValue = value ?? defaultValue ?? options[0]?.value ?? '';

  return (
    <TooltipProvider>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-white">Model Version</p>
      </div>
      <div className="space-y-2">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {options.map((option) => {
            const isActive = option.value === selectedValue;
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
  defaultValue,
  suffix,
  options,
  onChange,
}: {
  label: string;
  value?: number;
  defaultValue: number;
  options: number[];
  suffix?: string;
  onChange: (value: number) => void;
}) {
  const selectedValue =
    value ?? defaultValue ?? (options.length > 0 ? options[0] : undefined);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">{label} </div>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isChecked = option === selectedValue;
          return (
            <label
              key={option}
              className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-xs transition ${
                isChecked
                  ? 'border-white bg-white/10 text-white'
                  : 'border-white/20 bg-black/40 text-white/70 hover:border-white/40 hover:bg-white/5'
              }`}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={isChecked}
                onChange={() => onChange(option)}
              />
              <span className="font-medium">
                {option}
                {suffix}
              </span>
            </label>
          );
        })}
      </div>
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

export function AspectRatioField({
  label,
  value,
  defaultValue,
  options,
  onChange,
}: {
  label: string;
  value?: string;
  defaultValue: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  const selectedValue =
    value ?? defaultValue ?? (options.length > 0 ? options[0] : undefined);
  const getDimensions = (ratio: string) => {
    const normalized = ratio.includes(':') ? ratio : ratio.replace('x', ':');
    const parts = normalized.split(':').map((part) => Number(part));
    const w = Number.isFinite(parts[0]) && parts[0] > 0 ? parts[0] : 1;
    const h = Number.isFinite(parts[1]) && parts[1] > 0 ? parts[1] : w;
    const maxWidth = 34;
    const maxHeight = 34;
    const scale = Math.min(maxWidth / w, maxHeight / h);
    const width = Math.max(12, Math.min(maxWidth, w * scale));
    const height = Math.max(12, Math.min(maxHeight, h * scale));
    return { width, height };
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">{label} </div>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isChecked = option === selectedValue;
          const { width, height } = getDimensions(option);
          return (
            <label
              key={option}
              className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-xs transition ${
                isChecked
                  ? 'border-white bg-white/10 text-white'
                  : 'border-white/20 bg-black/40 text-white/70 hover:border-white/40 hover:bg-white/5'
              }`}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={isChecked}
                onChange={() => onChange(option)}
              />
              <span
                aria-hidden
                className="flex items-center justify-center overflow-hidden rounded-sm bg-white/10 ring-1 ring-white/20"
                style={{ width, height }}
              >
                <span className="h-full w-full border border-white/40" />
              </span>
              <span className="font-medium">{option}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export function CheckboxGroupField({
  title,
  value,
  defaultValue,
  options,
  onChange,
}: {
  title: string;
  value?: string;
  defaultValue: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  const selectedValue =
    value ?? defaultValue ?? (options.length > 0 ? options[0] : undefined);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">{title}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isChecked = option === selectedValue;
          return (
            <label
              key={option}
              className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-xs transition ${
                isChecked
                  ? 'border-white bg-white/10 text-white'
                  : 'border-white/20 bg-black/40 text-white/70 hover:border-white/40 hover:bg-white/5'
              }`}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={isChecked}
                onChange={() => onChange(option)}
              />
              <span className="font-medium">{option}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export function Resolution({
  label = 'Resolution',
  value,
  defaultValue = 'standard',
  onChange,
}: {
  label?: string;
  value?: ResolutionOption;
  defaultValue?: ResolutionOption;
  onChange: (value: ResolutionOption) => void;
}) {
  const selectedValue =
    value === 'standard' || value === 'high'
      ? value
      : (defaultValue ?? 'standard');

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">{label}</div>
      <div className="flex flex-wrap gap-2">
        {resolutionOptions.map((option) => {
          const isChecked = option.value === selectedValue;
          return (
            <label
              key={option.value}
              className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-xs transition ${
                isChecked
                  ? 'border-white bg-white/10 text-white'
                  : 'border-white/20 bg-black/40 text-white/70 hover:border-white/40 hover:bg-white/5'
              }`}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={isChecked}
                onChange={() => onChange(option.value)}
              />
              <span className="font-medium">{option.label}</span>
            </label>
          );
        })}
      </div>
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
