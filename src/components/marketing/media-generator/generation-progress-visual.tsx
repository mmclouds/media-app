'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

type GenerationProgressVisualProps = {
  className?: string;
};

const STATUS_MESSAGES = [
  'Generating video...',
  'Synthesizing frames...',
  'Rendering motion...',
  'Applying visual consistency...',
  'Optimizing temporal coherence...',
  'Calibrating neural weights...',
  'Interpolating keyframes...',
  'Polishing lighting maps...',
];

const TEXT_ROTATION = 7000;
const FADE_DURATION = 500;

export function GenerationProgressVisual({
  className,
}: GenerationProgressVisualProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const timeouts = new Set<number>();
    const interval = window.setInterval(() => {
      setOpacity(0);
      const timeout = window.setTimeout(() => {
        setMessageIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
        setOpacity(1);
        timeouts.delete(timeout);
      }, FADE_DURATION);
      timeouts.add(timeout);
    }, TEXT_ROTATION);

    return () => {
      window.clearInterval(interval);
      timeouts.forEach((timeout) => window.clearTimeout(timeout));
    };
  }, []);

  const activeMessage = STATUS_MESSAGES[messageIndex] ?? STATUS_MESSAGES[0];

  return (
    <div
      className={cn(
        'relative aspect-video w-full overflow-hidden rounded-none bg-[#050607]',
        className,
      )}
      role="status"
      aria-live="polite"
      aria-label="Generating video"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          <div className="progress-float relative flex h-24 w-48 items-center justify-center sm:h-28 sm:w-56 md:h-32 md:w-64">
            <svg
              viewBox="0 0 200 100"
              className="progress-breathe h-full w-full"
              style={{ overflow: 'visible' }}
            >
              <defs>
                <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00E5FF" />
                  <stop offset="50%" stopColor="#A855F7" />
                  <stop offset="100%" stopColor="#00E5FF" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <path
                d="M 50,50 C 50,20 80,20 100,50 C 120,80 150,80 150,50 C 150,20 120,20 100,50 C 80,80 50,80 50,50"
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M 50,50 C 50,20 80,20 100,50 C 120,80 150,80 150,50 C 150,20 120,20 100,50 C 80,80 50,80 50,50"
                fill="none"
                stroke="url(#neonGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                filter="url(#glow)"
                className="progress-draw"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 w-full px-4 sm:bottom-10">
        <p
          className="text-center font-mono text-[11px] uppercase tracking-[0.3em] text-slate-400 transition-opacity duration-1000 ease-in-out"
          style={{ opacity }}
        >
          {activeMessage}
        </p>
      </div>

      <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(120%_120%_at_50%_20%,rgba(255,255,255,0.08),rgba(0,0,0,0.7))]" />
      <div className="pointer-events-none absolute inset-0 opacity-5 [background-image:linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] [background-size:100%_2px,3px_100%]" />

      <style jsx>{`
        @keyframes progress-draw {
          0% {
            stroke-dashoffset: 1000;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        @keyframes progress-breathe {
          0%,
          100% {
            filter: drop-shadow(0 0 8px rgba(0, 229, 255, 0.4)) brightness(1);
          }
          50% {
            filter: drop-shadow(0 0 20px rgba(168, 85, 247, 0.7))
              brightness(1.3);
          }
        }
        @keyframes progress-float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-5px) rotate(1deg);
          }
        }
        .progress-draw {
          stroke-dasharray: 500;
          animation: progress-draw 6s linear infinite;
        }
        .progress-breathe {
          animation: progress-breathe 4s ease-in-out infinite;
        }
        .progress-float {
          animation: progress-float 5s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .progress-draw,
          .progress-breathe,
          .progress-float {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
