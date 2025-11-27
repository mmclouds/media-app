'use client';

import { useState } from 'react';
import { ChevronDown, Film, Loader2, RefreshCw } from 'lucide-react';
import type { VideoGeneratorHistory } from './types';

type EditorPanelProps = {
  onGenerate: (prompt: string) => Promise<void> | void;
  isGenerating: boolean;
  prompts: VideoGeneratorHistory;
};

const generatorTabs = [
  'Text to Video',
  'Image to Video',
  'Multi Elements',
] as const;
const workflowTabs = ['Swap', 'Add', 'Delete'] as const;

export function VideoGeneratorEditorPanel({
  onGenerate,
  isGenerating,
  prompts,
}: EditorPanelProps) {
  const [activeTab, setActiveTab] =
    useState<(typeof generatorTabs)[number]>('Multi Elements');
  const [activeWorkflow, setActiveWorkflow] =
    useState<(typeof workflowTabs)[number]>('Swap');
  const [prompt, setPrompt] = useState(
    'swap [subject] from [@Image] for [subject] from [@Video]'
  );

  const handleGenerate = async () => {
    await onGenerate(prompt);
  };

  const recentPrompts = [...prompts].slice(-3).reverse();

  return (
    <section className="flex h-full w-[420px] flex-col border-r border-white/5 bg-black/80 text-white">
      <div className="flex h-14 items-center justify-between border-b border-white/5 px-5">
        <h2 className="text-sm font-semibold uppercase tracking-[0.32em] text-white/60">
          Creator
        </h2>
        <button className="flex items-center gap-2 rounded-md border border-white/5 bg-white/5 px-3 py-1.5 text-xs text-white/80">
          VIDEO 3.1
          <ChevronDown className="h-3 w-3" />
        </button>
      </div>

      <div className="border-b border-transparent px-5 pt-6">
        <div className="flex gap-5 text-sm font-medium">
          {generatorTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-white/60 transition hover:text-white ${
                activeTab === tab ? 'text-white' : ''
              }`}
            >
              {tab}
              {activeTab === tab ? (
                <span className="mt-2 block h-0.5 rounded-full bg-white" />
              ) : null}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-5 py-6">
        {activeTab === 'Multi Elements' ? (
          <div className="flex rounded-2xl bg-white/5 p-1">
            {workflowTabs.map((workflow) => (
              <button
                key={workflow}
                className={`flex-1 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                  workflow === activeWorkflow
                    ? 'bg-white text-black shadow'
                    : 'text-white/60'
                }`}
                onClick={() => setActiveWorkflow(workflow)}
              >
                {workflow}
              </button>
            ))}
          </div>
        ) : null}

        <div className="space-y-4 rounded-2xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent p-4">
          <div>
            <p className="text-sm font-semibold">Upload Video to Edit</p>
            <p className="mt-1 text-xs text-white/50">
              Drop MOV/MP4 files (10s, 1080p) or choose from history.
            </p>
          </div>
          <div className="relative h-40 rounded-xl border border-white/5 bg-black/40">
            <div className="absolute inset-0 rounded-xl border border-dashed border-white/10" />
            <div className="absolute left-4 top-4 space-y-2 text-xs text-white/60">
              <p>Edit single shots or multi-camera compositions.</p>
              <p className="opacity-70">Supports transparency passes.</p>
            </div>
            <div className="absolute bottom-4 left-4 flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-white/40">
              <Film className="h-4 w-4" />
              Import footage
            </div>
            <div className="absolute right-4 top-4 h-24 w-32 overflow-hidden rounded-lg border border-white/5">
              <img
                src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=60"
                alt=""
                className="h-full w-full object-cover opacity-60"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-4">
          <div>
            <p className="text-sm font-semibold">Upload Image</p>
            <p className="text-xs text-white/50">History · Stock Library</p>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-white/10 bg-black/40">
            <RefreshCw className="h-4 w-4 text-white/70" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-end justify-between">
            <label className="text-sm font-semibold">
              Prompt <span className="text-xs font-normal text-white/40">(Required)</span>
            </label>
            <span className="text-[11px] uppercase tracking-[0.24em] text-white/40">
              {activeWorkflow}
            </span>
          </div>
          <textarea
            className="h-32 w-full resize-none rounded-2xl border border-white/5 bg-black/60 p-4 text-sm text-white/80 outline-none transition focus:border-white/30"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
          />
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs font-semibold">
          {['Professional', '7s', '1 Output'].map((label, index) => (
            <button
              key={label}
              className="flex items-center justify-between rounded-xl border border-white/5 bg-black/60 px-3 py-2 text-white/80"
            >
              <span>{label}</span>
              <ChevronDown className="h-3 w-3 text-white/50" />
            </button>
          ))}
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#64ff6a] text-sm font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-[#4ae052] disabled:bg-white/10 disabled:text-white/40"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating
            </>
          ) : (
            'Generate'
          )}
        </button>

        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">
            Recent prompts
          </p>
          {recentPrompts.length ? (
            <ul className="space-y-2 text-xs text-white/70">
              {recentPrompts.map((item, index) => (
                <li
                  key={`${item}-${index}`}
                  className="rounded-xl border border-white/5 bg-black/50 p-3 font-mono"
                >
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-white/40">
              Prompts you generate will show up here.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
