import type { CalculateCreditsResult } from '@/custom/credits/pricing/types';
import { useEffect } from 'react';
import type { CreditEstimateState } from '../types';

type UseCreditEstimateOptions = {
  payload: unknown;
  onCreditEstimateChange?: (state: CreditEstimateState) => void;
};

type CreditsResponse = {
  success?: boolean;
  data?: CalculateCreditsResult;
  message?: string;
};

export function useCreditEstimate({
  payload,
  onCreditEstimateChange,
}: UseCreditEstimateOptions) {
  useEffect(() => {
    if (!onCreditEstimateChange) {
      return;
    }
    const controller = new AbortController();

    onCreditEstimateChange({
      result: null,
      error: null,
      loading: true,
    });

    const fetchCredits = async () => {
      try {
        const response = await fetch('/api/custom/credits/calculate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        let data: CreditsResponse = {};
        try {
          data = (await response.json()) as CreditsResponse;
        } catch {
          data = {};
        }

        if (!response.ok || data.success === false) {
          const message =
            typeof data.message === 'string' && data.message.trim().length > 0
              ? data.message
              : 'Failed to estimate credits';
          onCreditEstimateChange({
            result: null,
            error: message,
            loading: false,
          });
          return;
        }

        onCreditEstimateChange({
          result: data.data ?? null,
          error: null,
          loading: false,
        });
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }
        onCreditEstimateChange({
          result: null,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to estimate credits',
          loading: false,
        });
      }
    };

    void fetchCredits();

    return () => controller.abort();
  }, [payload, onCreditEstimateChange]);
}
