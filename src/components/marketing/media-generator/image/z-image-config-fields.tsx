'use client';

import { AspectRatioField } from '../shared/config-field-controls';
import { PromptEditor } from '../shared/prompt-editor';
import { useCreditEstimate } from '../shared/use-credit-estimate';
import type { MediaModelConfig, MediaModelConfigProps } from '../types';
import { useMemo } from 'react';

const aspectRatioOptions = ['1:1', '4:3', '3:4', '16:9', '9:16'];

export const buildZImageRequestBody = ({
  prompt,
  resolvedConfig,
}: {
  prompt: string;
  resolvedConfig: MediaModelConfig;
}) => {
  const aspectRatio =
    typeof resolvedConfig.aspectRatio === 'string'
      ? resolvedConfig.aspectRatio.trim()
      : '';

  const inputPayload: Record<string, unknown> = { prompt };

  if (aspectRatio) {
    inputPayload.aspect_ratio = aspectRatio;
  }

  return {
    model: 'z-image',
    input: inputPayload,
  };
};

export function ZImageConfigFields({
  config,
  onChange,
  prompt,
  onPromptChange,
  onCreditEstimateChange,
}: MediaModelConfigProps) {
  const aspectRatio =
    typeof config.aspectRatio === 'string' ? config.aspectRatio : '';

  const creditEstimatePayload = useMemo(
    () =>
      buildZImageRequestBody({
        prompt: prompt || '',
        resolvedConfig: config,
      }),
    [config, prompt]
  );

  useCreditEstimate({
    payload: creditEstimatePayload,
    onCreditEstimateChange,
  });

  return (
    <div className="space-y-4">
      <PromptEditor
        value={prompt}
        onChange={onPromptChange}
        maxLength={1000}
        helperText="Max 1000 characters."
      />

      <AspectRatioField
        label="Aspect Ratio"
        value={aspectRatio}
        options={aspectRatioOptions}
        onChange={(value) =>
          onChange({
            ...config,
            aspectRatio: value,
          })
        }
      />
    </div>
  );
}
