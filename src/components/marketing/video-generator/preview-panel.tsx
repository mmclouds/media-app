'use client';

import { FolderOpen } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { demoVideoAssets } from './data';
import type { VideoGeneratorAsset } from './types';

type PreviewPanelProps = {
  asset: VideoGeneratorAsset;
  loading: boolean;
};

export function VideoGeneratorPreviewPanel({
  asset,
  loading,
}: PreviewPanelProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const feedItems = useMemo(() => {
    const uniqueAssets = [
      asset,
      ...demoVideoAssets.filter((item) => item.id !== asset.id),
    ];

    return Array.from({ length: 3 })
      .flatMap((_, loopIndex) =>
        uniqueAssets.map((item, index) => {
          if (loopIndex === 0) {
            return item;
          }
          return {
            ...item,
            id: `${item.id}-loop-${loopIndex}-${index}`,
          };
        })
      )
      .slice(0, 9);
  }, [asset]);

  const feedLength = feedItems.length;
  const [visibleCount, setVisibleCount] = useState(() =>
    Math.min(2, feedLength || 1)
  );

  useEffect(() => {
    setVisibleCount(Math.min(2, feedLength || 1));
  }, [feedLength]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) {
      return undefined;
    }

    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const { scrollTop, clientHeight, scrollHeight } = container;
        if (scrollTop + clientHeight >= scrollHeight - 240) {
          setVisibleCount((prev) =>
            prev >= feedLength ? prev : prev + 1
          );
        }
        ticking = false;
      });
    };

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [feedLength]);

  const visibleItems = feedItems.slice(0, visibleCount);

  return (
    <section className="flex flex-1 flex-col bg-gradient-to-br from-[#050505] via-[#050505] to-[#0c0c0c] text-white">
      <div className="flex h-14 items-center justify-between border-b border-white/5 px-6">
        <div className="flex gap-1 rounded-lg bg-white/5 p-1 text-xs font-semibold">
          <Tab label="All" active />
          <Tab label="Images" />
          <Tab label="Videos" />
          <Tab label="Audio" />
        </div>
        <div className="flex items-center gap-4 text-xs">
          <label className="flex items-center gap-2 text-white/70">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-white/20 bg-transparent text-[#64ff6a]"
            />
            Favorites
          </label>
          <button className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 text-white/80 transition hover:text-white">
            <FolderOpen className="h-4 w-4" />
            Assets
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 space-y-6 overflow-y-auto px-6 py-6"
      >
        {loading && (
          <div className="sticky top-0 z-10 mb-4 flex items-center gap-3 rounded-2xl border border-white/5 bg-black/70 px-4 py-3 text-xs text-white/70">
            <div className="h-2 w-2 animate-ping rounded-full bg-[#64ff6a]" />
            Rendering a new clip...
          </div>
        )}

        {visibleItems.map((item) => (
          <VideoPreviewCard
            key={item.id}
            asset={item}
            isActive={item.id === asset.id}
          />
        ))}

        {visibleCount < feedLength ? (
          <div className="flex items-center justify-center gap-2 py-8 text-xs uppercase tracking-[0.2em] text-white/40">
            <div className="h-2 w-2 animate-pulse rounded-full bg-[#64ff6a]" />
            Keep scrolling to load more videos
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-white/40">
            You reached the end of this feed.
          </div>
        )}
      </div>
    </section>
  );
}

function Tab({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <button
      className={`rounded-md px-3 py-1 ${
        active ? 'bg-white/10 text-white' : 'text-white/60'
      }`}
    >
      {label}
    </button>
  );
}

function VideoPreviewCard({
  asset,
  isActive = false,
}: {
  asset: VideoGeneratorAsset;
  isActive?: boolean;
}) {
  return (
    <article className="overflow-hidden rounded-[32px] border border-white/5 bg-gradient-to-b from-white/[0.04] to-black/70 shadow-2xl shadow-black/40">
      <div className="space-y-3 border-b border-white/5 px-6 py-5">
        <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-white/40">
          <span className="rounded-full border border-white/10 px-3 py-1 text-white">
            Video
          </span>
          <span className="text-white/60">{asset.resolution}</span>
          <span className="text-white/60">{asset.duration}</span>
          {isActive ? (
            <span className="ml-auto rounded-full bg-[#64ff6a]/20 px-3 py-1 text-[#64ff6a]">
              Latest
            </span>
          ) : null}
        </div>
        <p className="text-2xl font-semibold tracking-tight text-white">
          {asset.title}
        </p>
        <p className="text-sm text-white/60">
          {asset.tags.join(' · ')}
        </p>
        <div className="flex flex-wrap gap-2 text-xs">
          {asset.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 px-3 py-1 text-white/70"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="bg-black">
        <video
          key={asset.id}
          src={asset.src}
          controls
          loop
          playsInline
          poster={asset.poster}
          className="aspect-video w-full bg-black object-cover"
        />
      </div>
    </article>
  );
}
