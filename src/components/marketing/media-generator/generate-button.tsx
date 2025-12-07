'use client';

import { Loader2 } from 'lucide-react';
import type { MediaGenerationPayload } from './types';

type GenerateButtonProps = {
  mediaType: MediaGenerationPayload['mediaType'];
  modelId: string;
  prompt: string;
  config: MediaGenerationPayload['config'];
  onGenerate: (payload: MediaGenerationPayload) => Promise<void> | void;
  disabled?: boolean;
  label?: string;
};

export function GenerateButton({
  mediaType,
  modelId,
  prompt,
  config,
  onGenerate,
  disabled,
  label = 'Generate',
}: GenerateButtonProps) {
  const promptReady = Boolean(prompt.trim());
  const isDisabled = disabled || !promptReady;

  const handleGenerate = async () => {
    if (isDisabled) {
      return;
    }
    await onGenerate({
      mediaType,
      modelId,
      prompt,
      config,
    });
  };

  return (
    <button
      type="button"
      onClick={handleGenerate}
      disabled={isDisabled}
      className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#64ff6a] text-sm font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-[#4ae052] disabled:bg-white/10 disabled:text-white/40"
    >
      {disabled ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Generating
        </>
      ) : (
        label
      )}
    </button>
  );
}
