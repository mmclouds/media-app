'use client';

import { useCallback, useRef } from 'react';

export type UseHoverPlaybackOptions = {
  resetOnLeave?: boolean;
};

export type UseHoverPlaybackResult = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
  handleMediaReady: () => void;
};

export function useHoverPlayback({
  resetOnLeave = false,
}: UseHoverPlaybackOptions = {}): UseHoverPlaybackResult {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isHoveringRef = useRef(false);

  const attemptPlay = useCallback(() => {
    const instance = videoRef.current;
    if (!instance) {
      return;
    }
    const playPromise = instance.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch((error) => {
        console.warn('视频悬停播放失败:', error);
      });
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    isHoveringRef.current = true;
    attemptPlay();
  }, [attemptPlay]);

  const handleMouseLeave = useCallback(() => {
    isHoveringRef.current = false;
    const instance = videoRef.current;
    if (!instance) {
      return;
    }
    instance.pause();
    if (resetOnLeave) {
      instance.currentTime = 0;
    }
  }, [resetOnLeave]);

  const handleMediaReady = useCallback(() => {
    if (isHoveringRef.current) {
      attemptPlay();
    }
  }, [attemptPlay]);

  return {
    videoRef,
    handleMouseEnter,
    handleMouseLeave,
    handleMediaReady,
  };
}
