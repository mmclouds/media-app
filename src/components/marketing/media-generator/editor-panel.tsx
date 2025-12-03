'use client';

import { ChevronDown, Loader2, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import type { MediaGeneratorHistory, MediaModelPreset } from './types';

type EditorPanelProps = {
  onGenerate: (prompt: string) => Promise<void> | void;
  isGenerating: boolean;
  prompts: MediaGeneratorHistory;
  activeModel: MediaModelPreset;
};

const generatorTabs = ['Text to Video', 'Image to Video'] as const;
type GeneratorTab = (typeof generatorTabs)[number];

type TabConfig = {
  promptLabel: string;
  promptPlaceholder: string;
  quickSettings: string[];
};

const tabConfigs: Record<GeneratorTab, TabConfig> = {
  'Text to Video': {
    promptLabel: 'Prompt',
    promptPlaceholder:
      'Describe the cinematic scene, camera moves, and mood you want to create.',
    quickSettings: ['Professional', '7s', '1 Output'],
  },
  'Image to Video': {
    promptLabel: 'Prompt',
    promptPlaceholder:
      'Explain how the uploaded image should evolve, animate, or transform.',
    quickSettings: ['Professional', '7s', '1 Output'],
  },
};

export function MediaGeneratorEditorPanel({
  onGenerate,
  isGenerating,
  prompts,
  activeModel,
}: EditorPanelProps) {
  const [activeTab, setActiveTab] =
    useState<(typeof generatorTabs)[number]>('Text to Video');
  const [prompt, setPrompt] = useState(
    'swap [subject] from [@Image] for [subject] from [@Video]'
  );
  const isImageToVideo = activeTab === 'Image to Video';
  const activeConfig = tabConfigs[activeTab];

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
          {activeModel.label}
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

      <div className="flex flex-1 flex-col gap-6 px-5 py-6 overflow-hidden">
        {isImageToVideo ? (
          <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-4">
            <div>
              <p className="text-sm font-semibold">Upload Image</p>
              <p className="text-xs text-white/50">History · Stock Library</p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-white/10 bg-black/40">
              <RefreshCw className="h-4 w-4 text-white/70" />
            </div>
          </div>
        ) : null}

        <PromptEditor
          label={activeConfig.promptLabel}
          placeholder={activeConfig.promptPlaceholder}
          requiredNote="(Required)"
          value={prompt}
          onChange={setPrompt}
        />

        <div className="flex flex-1 flex-col gap-4">
          <div className="mt-auto space-y-3">
            <QuickSettingsBar options={activeConfig.quickSettings} />

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
          </div>
        </div>
      </div>
    </section>
  );
}

type PromptEditorProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  requiredNote?: string;
};

function PromptEditor({
  label,
  value,
  onChange,
  placeholder,
  requiredNote,
}: PromptEditorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between">
        <label className="text-sm font-semibold">
          {label}{' '}
          {requiredNote ? (
            <span className="text-xs font-normal text-white/40">
              {requiredNote}
            </span>
          ) : null}
        </label>
      </div>
      <textarea
        className="h-48 w-full resize-none rounded-2xl border border-white/30 bg-black/60 p-5 text-base text-white/80 outline-none transition focus:border-white/50"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

type QuickSettingsBarProps = {
  options: string[];
};

function QuickSettingsBar({ options }: QuickSettingsBarProps) {
  return (
    <div className="grid grid-cols-3 gap-3 text-xs font-semibold">
      {options.map((label) => (
        <button
          key={label}
          className="flex items-center justify-between rounded-xl border border-white/5 bg-black/60 px-3 py-2 text-white/80"
        >
          <span>{label}</span>
          <ChevronDown className="h-3 w-3 text-white/50" />
        </button>
      ))}
    </div>
  );
}
