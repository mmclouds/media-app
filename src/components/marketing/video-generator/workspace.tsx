'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { demoVideoAssets } from './data';
import { VideoGeneratorEditorPanel } from './editor-panel';
import { VideoGeneratorPreviewPanel } from './preview-panel';
import { VideoGeneratorSidebar } from './sidebar';

export function VideoGeneratorWorkspace({ className }: { className?: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const asset = demoVideoAssets[activeIndex % demoVideoAssets.length];

  const handleGenerate = async (prompt: string) => {
    setIsGenerating(true);
    setHistory((prev) => {
      const next = [...prev, prompt];
      return next.slice(-5);
    });
    await new Promise((resolve) => setTimeout(resolve, 1600));
    setActiveIndex((prev) => (prev + 1) % demoVideoAssets.length);
    setIsGenerating(false);
  };

  return (
    <div
      className={cn(
        'flex h-full w-full max-h-screen overflow-hidden rounded-[36px] border border-white/10 bg-black text-white shadow-[0_40px_120px_rgba(0,0,0,0.45)]',
        className
      )}
    >
      <VideoGeneratorSidebar />
      <VideoGeneratorEditorPanel
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
        prompts={history}
      />
      <VideoGeneratorPreviewPanel asset={asset} loading={isGenerating} />
    </div>
  );
}
