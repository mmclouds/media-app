'use client';

type VideoPosterOptions = {
  frameTime?: number;
  crossOrigin?: '' | 'anonymous' | 'use-credentials';
  timeoutMs?: number;
};

function assertClientEnvironment() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    throw new Error('captureVideoPoster 只能在浏览器环境中调用。');
  }
}

export async function captureVideoPoster(
  url: string,
  {
    frameTime = 0.1,
    crossOrigin = 'anonymous',
    timeoutMs = 10000,
  }: VideoPosterOptions = {}
): Promise<string> {
  assertClientEnvironment();

  if (!url) {
    throw new Error('captureVideoPoster 需要合法的视频 URL。');
  }

  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const cleanup = () => {
      video.removeEventListener('loadeddata', handleLoaded);
      video.removeEventListener('seeked', handleSeeked);
      video.removeEventListener('error', handleError);
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
      video.src = '';
    };

    const settle = (fn: () => void) => {
      if (settled) {
        return;
      }
      settled = true;
      cleanup();
      fn();
    };

    const handleError = (event?: Event | string | Error | null) => {
      settle(() => {
        const payload =
          event instanceof Event && video.error
            ? new Error(video.error.message)
            : event instanceof Error
              ? event
              : new Error('Failed to capture video thumbnail.');
        reject(payload);
      });
    };

    const captureCanvas = () => {
      try {
        const canvas = document.createElement('canvas');
        const width = video.videoWidth || 1;
        const height = video.videoHeight || 1;
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');
        if (!context) {
          throw new Error('当前环境不支持 Canvas 2D。');
        }
        context.drawImage(video, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/png');
        settle(() => resolve(dataUrl));
      } catch (error) {
        handleError(error instanceof Error ? error : null);
      }
    };

    const handleLoaded = () => {
      try {
        video.currentTime = Math.max(0, frameTime);
      } catch {
        captureCanvas();
      }
    };

    const handleSeeked = () => {
      captureCanvas();
    };

    let settled = false;
    const timeoutId =
      timeoutMs > 0
        ? window.setTimeout(() => {
            handleError(new Error('捕获视频首帧超时，请检查资源是否可访问。'));
          }, timeoutMs)
        : null;

    if (crossOrigin) {
      video.crossOrigin = crossOrigin;
    }
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    video.addEventListener('loadeddata', handleLoaded);
    video.addEventListener('seeked', handleSeeked);
    video.addEventListener('error', handleError);
    video.src = url;
    video.load();
  });
}

export type { VideoPosterOptions as CaptureVideoPosterOptions };
