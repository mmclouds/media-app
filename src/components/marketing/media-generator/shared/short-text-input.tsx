'use client';

import { Input } from '@/components/ui/input';

type ShortTextInputProps = {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  helperText?: string;
  maxLength?: number;
};

export function ShortTextInput({
  value,
  onChange,
  label,
  placeholder,
  helperText,
  maxLength,
}: ShortTextInputProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-white">{label}</p>
      </div>
      <Input
        className="h-11 rounded-2xl border-white/20 bg-[#0b0d10] px-4 text-sm text-white/80 placeholder:text-white/40 shadow-inner shadow-black/40 transition focus-visible:border-white/50 focus-visible:ring-2 focus-visible:ring-[#64ff6a]/30"
        placeholder={placeholder}
        value={value}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
      />
      {helperText ? (
        <p className="text-xs text-white/50">{helperText}</p>
      ) : null}
    </div>
  );
}
