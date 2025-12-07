'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { useMemo } from 'react';
import { GenerateButton } from './generate-button';
import type {
  MediaGenerationPayload,
  MediaModelConfig,
  MediaModelDefinition,
  MediaType,
  VideoGeneratorHistory,
} from './types';

type MediaGeneratorConfigPanelProps = {
  mediaType: MediaType;
  models: MediaModelDefinition[];
  activeModelId?: string;
  modelConfigs: Record<string, MediaModelConfig>;
  onModelChange: (modelId: string) => void;
  onModelConfigChange: (modelId: string, config: MediaModelConfig) => void;
  prompt: string;
  onPromptChange: (value: string) => void;
  history: VideoGeneratorHistory;
  onGenerate: (payload: MediaGenerationPayload) => Promise<void> | void;
  isGenerating: boolean;
};

export function MediaGeneratorConfigPanel({
  mediaType,
  models,
  activeModelId,
  modelConfigs,
  onModelChange,
  onModelConfigChange,
  prompt,
  onPromptChange,
  history,
  onGenerate,
  isGenerating,
}: MediaGeneratorConfigPanelProps) {
  const activeModel =
    models.find((model) => model.id === activeModelId) ?? models[0];

  const activeConfig = activeModel
    ? (modelConfigs[activeModel.id] ?? activeModel.defaultConfig)
    : {};

  const recentPrompts = useMemo(
    () => [...history].slice(-3).reverse(),
    [history]
  );

  return (
    <section className="flex h-full w-[420px] flex-col border-r border-white/5 bg-black/80 text-white">
      <div className="flex h-14 items-center justify-between border-b border-white/5 px-5">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-white/40">
            Creator
          </p>
          <p className="text-sm font-semibold text-white">
            {mediaType.charAt(0).toUpperCase() + mediaType.slice(1)} generator
          </p>
        </div>
        {activeModel ? (
          <Badge className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
            {activeModel.label}
          </Badge>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-6 overflow-hidden px-5 py-6">
        <ModelSelector
          models={models}
          activeModelId={activeModel?.id}
          onChange={onModelChange}
        />

        <PromptEditor value={prompt} onChange={onPromptChange} />

        {activeModel ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-white">
                {activeModel.label} config
              </p>
              <p className="text-xs text-white/50">{activeModel.description}</p>
            </div>
            <activeModel.configComponent
              config={activeConfig}
              onChange={(nextConfig) =>
                onModelConfigChange(activeModel.id, nextConfig)
              }
            />
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 p-4 text-sm text-white/60">
            Models for {mediaType} are coming soon.
          </div>
        )}

        <div className="mt-auto space-y-4">
          <GenerateButton
            mediaType={mediaType}
            modelId={activeModel?.id ?? ''}
            prompt={prompt}
            config={activeConfig}
            onGenerate={onGenerate}
            disabled={isGenerating}
          />

          <PromptHistory prompts={recentPrompts} />
        </div>
      </div>
    </section>
  );
}

type ModelSelectorProps = {
  models: MediaModelDefinition[];
  activeModelId?: string;
  onChange: (modelId: string) => void;
};

function ModelSelector({
  models,
  activeModelId,
  onChange,
}: ModelSelectorProps) {
  if (!models.length) {
    return (
      <div className="rounded-2xl border border-dashed border-white/20 p-4 text-sm text-white/70">
        No models available for this media type yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
        Models
      </p>
      <div className="flex flex-col gap-3">
        {models.map((model) => (
          <button
            key={model.id}
            type="button"
            onClick={() => onChange(model.id)}
            className={cn(
              'flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition',
              activeModelId === model.id
                ? 'border-white/40 bg-white/10 text-white'
                : 'border-white/10 bg-black/50 text-white/60 hover:border-white/30 hover:text-white'
            )}
          >
            <div>
              <p className="text-sm font-semibold">{model.label}</p>
              <p className="text-xs text-white/50">{model.description}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-white/40" />
          </button>
        ))}
      </div>
    </div>
  );
}

function PromptEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-white">Prompt</p>
        <span className="text-xs text-white/40">Required</span>
      </div>
      <textarea
        className="h-40 w-full resize-none rounded-2xl border border-white/30 bg-black/60 p-4 text-sm text-white/80 outline-none transition focus:border-white/60"
        placeholder="Describe the scene, lighting, motion, and references you want to generate."
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

function PromptHistory({ prompts }: { prompts: string[] }) {
  if (!prompts.length) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 p-4 text-center text-xs text-white/50">
        Prompts you run will appear here for quick reuse.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
        Recent prompts
      </p>
      <div className="space-y-2">
        {prompts.map((entry, index) => (
          <div
            key={`${entry}-${index}`}
            className="rounded-xl border border-white/10 bg-black/40 p-3 text-xs text-white/70"
          >
            {entry}
          </div>
        ))}
      </div>
    </div>
  );
}
