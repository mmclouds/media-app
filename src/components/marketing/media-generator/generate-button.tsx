'use client';

import { Coins, Loader2 } from 'lucide-react';
import type { CreditEstimateState, MediaGenerationPayload } from './types';

type GenerateButtonProps = {
  mediaType: MediaGenerationPayload['mediaType'];
  modelId: string;
  prompt: string;
  config: MediaGenerationPayload['config'];
  onGenerate: (payload: MediaGenerationPayload) => Promise<void> | void;
  disabled?: boolean;
  label?: string;
  creditEstimate?: CreditEstimateState | null;
};

export function GenerateButton({
  mediaType,
  modelId,
  prompt,
  config,
  onGenerate,
  disabled,
  label = 'Generate',
  creditEstimate,
}: GenerateButtonProps) {
  const promptReady = Boolean(prompt.trim());
  const isDisabled = disabled || !promptReady;
  const showCredit = creditEstimate !== undefined;
  const isCreditLoading =
    showCredit && (creditEstimate === null || creditEstimate.loading);
  const creditValue =
    showCredit && !isCreditLoading && creditEstimate
      ? creditEstimate.error
        ? '--'
        : creditEstimate.result
          ? `${creditEstimate.result.credits}`
          : '--'
      : null;
  const creditIndicator = showCredit ? (
    <span className="inline-flex items-center gap-1">
      <Coins className="h-4 w-4" />
      {isCreditLoading ? (
        <span className="h-3 w-8 animate-pulse rounded bg-black/20" />
      ) : (
        <span>{creditValue}</span>
      )}
    </span>
  ) : null;
  const displayLabel = showCredit ? (
    <span className="inline-flex items-center gap-2">
      <span>{label}</span>
      <span className="h-4 w-px bg-black/20" aria-hidden="true" />
      <span className="inline-flex min-w-[64px] items-center justify-center">
        {creditIndicator}
      </span>
    </span>
  ) : (
    label
  );

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
        displayLabel
      )}
    </button>
  );
}
