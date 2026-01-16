'use client';

import { cn } from '@/lib/utils';
import { Coins, Loader2 } from 'lucide-react';
import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
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
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'>;

export const GenerateButton = forwardRef<
  HTMLButtonElement,
  GenerateButtonProps
>(
  (
    {
      mediaType,
      modelId,
      prompt,
      config,
      onGenerate,
      disabled,
      label = 'Generate',
      creditEstimate,
      className,
      onClick,
      type,
      ...rest
    },
    ref
  ) => {
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
        ref={ref}
        type={type ?? 'button'}
        onClick={async (event) => {
          onClick?.(event);
          if (event.defaultPrevented || isDisabled) {
            return;
          }
          await handleGenerate();
        }}
        disabled={isDisabled}
        className={cn(
          'flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#64ff6a] to-[#3ddf88] text-sm font-semibold uppercase tracking-[0.2em] text-black shadow-[0_10px_30px_rgba(100,255,106,0.25)] transition hover:from-[#4ae052] hover:to-[#38d27f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#64ff6a]/40 focus-visible:ring-offset-0 disabled:bg-[#0b0d10] disabled:text-white/30 disabled:shadow-none disabled:border disabled:border-white/10 disabled:from-[#0b0d10] disabled:to-[#0b0d10]',
          className
        )}
        {...rest}
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
);

GenerateButton.displayName = 'GenerateButton';
