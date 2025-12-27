'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

type GenerationProgressVisualProps = {
  className?: string;
};

const LOADING_MESSAGES = [
  'Generating video…',
  'Synthesizing frames…',
  'Rendering motion…',
  'Applying visual consistency…',
  'Optimizing temporal coherence…',
];

const MIN_MESSAGE_INTERVAL = 6000;
const MAX_MESSAGE_INTERVAL = 10000;
const LOOP_DURATION = 3.2;
const BREATH_DURATION = 4.2;

export function GenerationProgressVisual({
  className,
}: GenerationProgressVisualProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = useMemo(() => LOADING_MESSAGES, []);

  useEffect(() => {
    let timeout: number | undefined;

    const scheduleNext = () => {
      const interval =
        Math.random() * (MAX_MESSAGE_INTERVAL - MIN_MESSAGE_INTERVAL) +
        MIN_MESSAGE_INTERVAL;

      timeout = window.setTimeout(() => {
        setMessageIndex((prev) => (prev + 1) % messages.length);
        scheduleNext();
      }, interval);
    };

    scheduleNext();

    return () => {
      if (timeout) {
        window.clearTimeout(timeout);
      }
    };
  }, [messages.length]);

  const activeMessage = messages[messageIndex] ?? messages[0];

  return (
    <div
      className={`relative aspect-video w-full overflow-hidden rounded-none bg-[#0B0F1A] ${className ?? ''}`}
      role="status"
      aria-live="polite"
      aria-label="Generating video"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative flex items-center justify-center"
          animate={{ rotate: [0, 1.5, 0] }}
          transition={{ duration: BREATH_DURATION, ease: 'easeInOut', repeat: Infinity }}
        >
          <svg
            viewBox="0 0 200 120"
            className="h-36 w-[280px] drop-shadow-[0_0_22px_rgba(80,168,255,0.35)]"
            fill="none"
          >
            <defs>
              <linearGradient id="neonGradient" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#6EE7FF" />
                <stop offset="50%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#22D3EE" />
              </linearGradient>
            </defs>
            <motion.path
              d="M20 60c0-22.091 17.909-40 40-40s40 17.909 40 40-17.909 40-40 40S20 82.091 20 60Zm80 0c0-22.091 17.909-40 40-40s40 17.909 40 40-17.909 40-40 40-40-17.909-40-40Z"
              stroke="url(#neonGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ strokeDashoffset: 0, opacity: 0.8 }}
              animate={{
                strokeDashoffset: [0, -180, -360],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: LOOP_DURATION,
                ease: 'linear',
                repeat: Infinity,
              }}
              style={{ strokeDasharray: '160 60' }}
            />
            <motion.path
              d="M20 60c0-22.091 17.909-40 40-40s40 17.909 40 40-17.909 40-40 40S20 82.091 20 60Zm80 0c0-22.091 17.909-40 40-40s40 17.909 40 40-17.909 40-40 40-40-17.909-40-40Z"
              stroke="url(#neonGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.2}
              animate={{
                scale: [0.98, 1.02, 0.98],
                filter: [
                  'drop-shadow(0 0 18px rgba(110,231,255,0.35))',
                  'drop-shadow(0 0 24px rgba(139,92,246,0.45))',
                  'drop-shadow(0 0 18px rgba(110,231,255,0.35))',
                ],
              }}
              transition={{ duration: BREATH_DURATION, ease: 'easeInOut', repeat: Infinity }}
            />
          </svg>
        </motion.div>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex justify-center pb-6 text-white/80">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMessage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="rounded-full bg-white/5 px-4 py-2 text-sm backdrop-blur"
          >
            {activeMessage}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
