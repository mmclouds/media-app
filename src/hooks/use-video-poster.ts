'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  captureVideoPoster,
  type CaptureVideoPosterOptions,
} from '@/lib/video-poster';

type UseVideoPosterOptions = CaptureVideoPosterOptions & {
  auto?: boolean;
};

type UseVideoPosterResult = {
  poster: string | null;
  loading: boolean;
  error: Error | null;
  capture: () => Promise<void>;
  reset: () => void;
};

export function useVideoPoster(
  src?: string | null,
  {
    auto = true,
    frameTime,
    crossOrigin,
    timeoutMs,
  }: UseVideoPosterOptions = {}
): UseVideoPosterResult {
  const [poster, setPoster] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const requestId = useRef(0);

  const safeSrc = useMemo(() => src?.trim() ?? '', [src]);
  const captureOptions = useMemo(
    () => ({ frameTime, crossOrigin, timeoutMs }),
    [crossOrigin, frameTime, timeoutMs]
  );

  const reset = useCallback(() => {
    setPoster(null);
    setError(null);
    setLoading(false);
    requestId.current += 1;
  }, []);

  const capture = useCallback(async () => {
    if (!safeSrc) {
      reset();
      return;
    }

    const currentRequest = requestId.current + 1;
    requestId.current = currentRequest;
    setLoading(true);
    setError(null);

    try {
      const dataUrl = await captureVideoPoster(safeSrc, captureOptions);
      if (requestId.current === currentRequest) {
        setPoster(dataUrl);
      }
    } catch (err) {
      if (requestId.current === currentRequest) {
        setPoster(null);
        setError(
          err instanceof Error
            ? err
            : new Error('Failed to capture video thumbnail.')
        );
      }
    } finally {
      if (requestId.current === currentRequest) {
        setLoading(false);
      }
    }
  }, [captureOptions, reset, safeSrc]);

  useEffect(() => {
    if (auto && safeSrc) {
      void capture();
      return;
    }
    if (!safeSrc) {
      reset();
    }
  }, [auto, capture, reset, safeSrc]);

  return {
    poster,
    loading,
    error,
    capture,
    reset,
  };
}
