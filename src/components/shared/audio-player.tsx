'use client';

import { cn } from '@/lib/utils';
import { Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type AudioPlayerProps = {
  audioUrl: string;
  coverUrl?: string | null;
  defaultCoverUrl?: string;
  size?: 'default' | 'compact';
  className?: string;
};

const DEFAULT_COVER_URL =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="Default audio cover">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#9fe8ff"/>
          <stop offset="100%" stop-color="#6f6bff"/>
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="32" fill="url(#bg)"/>
      <circle cx="256" cy="256" r="190" fill="#0d0f12"/>
      <circle cx="256" cy="256" r="150" fill="#14181d"/>
      <circle cx="256" cy="256" r="60" fill="#1a222a"/>
      <circle cx="256" cy="256" r="24" fill="#7ae3ff"/>
      <g fill="#3b4a5a">
        <rect x="238" y="222" width="8" height="28" rx="4"/>
        <rect x="252" y="206" width="8" height="44" rx="4"/>
        <rect x="266" y="214" width="8" height="36" rx="4"/>
      </g>
    </svg>`
  );

export function AudioPlayer({
  audioUrl,
  coverUrl,
  defaultCoverUrl,
  size = 'default',
  className,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [coverError, setCoverError] = useState(false);

  const resolvedAudioUrl = audioUrl?.trim();
  const fallbackCoverUrl = defaultCoverUrl?.trim() || DEFAULT_COVER_URL;
  const resolvedCoverUrl =
    !coverError && coverUrl?.trim() ? coverUrl.trim() : fallbackCoverUrl;

  const isCompact = size === 'compact';

  const progressRatio = duration > 0 ? Math.min(currentTime / duration, 1) : 0;

  useEffect(() => {
    setIsPlaying(false);
    setDuration(0);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [resolvedAudioUrl]);

  useEffect(() => {
    setCoverError(false);
  }, [coverUrl, defaultCoverUrl]);

  const handleToggle = () => {
    if (!audioRef.current || !resolvedAudioUrl) {
      return;
    }
    if (isPlaying) {
      audioRef.current.pause();
      return;
    }
    void audioRef.current.play().catch(() => {
      setIsPlaying(false);
    });
  };

  const handleSeek = (value: number) => {
    if (!audioRef.current || !Number.isFinite(duration) || duration <= 0) {
      return;
    }
    const nextTime = Math.min(Math.max(value, 0), duration);
    audioRef.current.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  return (
    <div
      className={cn(
        'flex flex-col rounded-3xl bg-[#222326] text-white shadow-xl',
        isCompact ? 'gap-3 p-3' : 'gap-4 p-4',
        className
      )}
    >
      <div className="aspect-square w-full overflow-hidden rounded-2xl bg-black/40">
        <img
          src={resolvedCoverUrl}
          alt="Audio cover"
          className="h-full w-full object-cover"
          onError={() => setCoverError(true)}
        />
      </div>

      <div className={cn('flex items-center', isCompact ? 'gap-3' : 'gap-4')}>
        <button
          type="button"
          onClick={handleToggle}
          disabled={!resolvedAudioUrl}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          className={cn(
            'flex shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 disabled:cursor-not-allowed disabled:opacity-50',
            isCompact ? 'h-9 w-9' : 'h-11 w-11'
          )}
        >
          {isPlaying ? (
            <Pause className={cn(isCompact ? 'h-4 w-4' : 'h-5 w-5')} />
          ) : (
            <Play className={cn('ml-0.5', isCompact ? 'h-4 w-4' : 'h-5 w-5')} />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="relative">
            <div
              className={cn(
                'h-2 w-full overflow-hidden rounded-full bg-white/10',
                isCompact ? 'h-2' : 'h-3'
              )}
            >
              <div
                className="h-full rounded-full bg-[#64ff6a] transition-[width] duration-150"
                style={{ width: `${Math.round(progressRatio * 100)}%` }}
              />
            </div>
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.01}
              value={currentTime}
              onChange={(event) => handleSeek(Number(event.target.value))}
              aria-label="Seek"
              disabled={!resolvedAudioUrl || duration <= 0}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-white/60">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={resolvedAudioUrl}
        preload="metadata"
        onLoadedMetadata={(event) => {
          const nextDuration = Number.isFinite(event.currentTarget.duration)
            ? event.currentTarget.duration
            : 0;
          setDuration(nextDuration);
        }}
        onTimeUpdate={(event) => {
          setCurrentTime(event.currentTarget.currentTime);
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onError={() => {
          setIsPlaying(false);
          setDuration(0);
          setCurrentTime(0);
        }}
        className="hidden"
      />
    </div>
  );
}

function formatTime(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return '0:00';
  }
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
