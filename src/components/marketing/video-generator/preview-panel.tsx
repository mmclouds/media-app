'use client';

import { FolderOpen } from 'lucide-react';
import type { VideoGeneratorAsset } from './types';

type PreviewPanelProps = {
  asset: VideoGeneratorAsset;
  loading: boolean;
};

export function VideoGeneratorPreviewPanel({
  asset,
  loading,
}: PreviewPanelProps) {
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

      <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
        {loading ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-sm text-white/60">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-[#64ff6a]" />
            Creating your masterpiece...
          </div>
        ) : (
          <>
            <div className="rounded-[28px] border border-white/5 bg-black/50 p-4 shadow-2xl shadow-black/40">
              <div className="overflow-hidden rounded-2xl border border-white/5 bg-black/60">
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

              <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-sm text-white/70">
                <div>
                  <p className="text-base font-semibold text-white">
                    {asset.title}
                  </p>
                  <p className="text-xs text-white/50">
                    {asset.resolution} · {asset.duration}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {asset.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
              <div className="rounded-2xl border border-white/5 bg-black/40 p-4">
                <div className="flex items-center justify-between text-sm text-white/70">
                  <p className="font-semibold text-white">Timeline</p>
                  <span className="text-xs text-white/50">
                    Sync comments enabled
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  {[1, 2, 3].map((shot) => (
                    <div
                      key={shot}
                      className="flex items-center justify-between rounded-2xl border border-white/5 bg-black/60 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xs text-white/60">
                          Shot {shot}
                        </div>
                        <div className="space-y-1 text-xs text-white/60">
                          <p className="text-white">Camera {shot}</p>
                          <p>Notes and frame annotations</p>
                        </div>
                      </div>
                      <button className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                        Jump
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/5 bg-black/40 p-4">
                <p className="text-sm font-semibold text-white">
                  Output settings
                </p>
                <div className="mt-4 space-y-3 text-xs text-white/60">
                  <Setting label="Camera move" value="Orbit ease" />
                  <Setting label="Sound FX" value="Enabled" />
                  <Setting label="Style" value="Cinematic" />
                </div>
                <button className="mt-6 w-full rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white/80 transition hover:text-white">
                  Export draft
                </button>
              </div>
            </div>
          </>
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

function Setting({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-black/50 p-3">
      <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">
        {label}
      </p>
      <p className="mt-1 text-sm text-white">{value}</p>
    </div>
  );
}
