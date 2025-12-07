'use client';

type PromptEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export function PromptEditor({ value, onChange }: PromptEditorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-white">Prompt</p>
      </div>
      <textarea
        className="h-40 w-full resize-none rounded-2xl border border-white/30 bg-black/60 p-4 text-sm text-white/80 outline-none transition focus:border-white/60"
        placeholder="Please describe your ideas."
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
