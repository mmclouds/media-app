import type { MediaModelConfig } from '../types';

export const buildNanoBananaRequestBody = ({
  prompt,
  resolvedConfig,
}: {
  prompt: string;
  resolvedConfig: MediaModelConfig;
}) => {
  const inputMode = resolvedConfig.inputMode === 'image' ? 'image' : 'text';
  const outputFormat =
    typeof resolvedConfig.outputFormat === 'string'
      ? resolvedConfig.outputFormat.trim()
      : '';
  const imageSize =
    typeof resolvedConfig.imageSize === 'string'
      ? resolvedConfig.imageSize.trim()
      : '';
  const imageUrls = Array.isArray(resolvedConfig.imageUrls)
    ? resolvedConfig.imageUrls
        .filter((item) => typeof item === 'string')
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
    : [];

  const inputPayload: Record<string, unknown> = { prompt };

  if (outputFormat) {
    inputPayload.output_format = outputFormat;
  }

  if (imageSize) {
    inputPayload.image_size = imageSize;
  }

  if (inputMode === 'image' && imageUrls.length > 0) {
    inputPayload.image_urls = imageUrls;
  }

  return {
    model:
      inputMode === 'image' ? 'google/nano-banana-edit' : 'google/nano-banana',
    input: inputPayload,
  };
};
