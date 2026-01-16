'use client';

type PromptEditorProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
  maxLength?: number;
};

export function PromptEditor({
  value,
  onChange,
  label = 'Prompt',
  placeholder = 'Please describe your ideas.',
  helperText,
  maxLength,
}: PromptEditorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-white">{label}</p>
      </div>
      <textarea
        className="h-40 w-full resize-none rounded-2xl border border-white/20 bg-[#0b0d10] p-4 text-sm text-white/80 shadow-inner shadow-black/40 outline-none transition focus:border-white/50 focus:ring-2 focus:ring-[#64ff6a]/30"
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
