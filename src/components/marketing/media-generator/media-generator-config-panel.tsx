'use client';

import {
  Select,
  SelectContent,
  SelectTrigger,
} from '@/components/ui/select';
import * as SelectPrimitive from '@radix-ui/react-select';
import { CheckIcon } from 'lucide-react';
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
        <ModelDropdown
          models={models}
          activeModelId={activeModel?.id}
          onChange={onModelChange}
        />
      </div>

      <div className="flex flex-1 flex-col gap-6 overflow-hidden px-5 py-6">
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
              prompt={prompt}
              onPromptChange={onPromptChange}
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

type ModelSelectProps = {
  models: MediaModelDefinition[];
  activeModelId?: string;
  onChange: (modelId: string) => void;
};

function ModelDropdown({
  models,
  activeModelId,
  onChange,
}: ModelSelectProps) {
  if (!models.length) {
    return null;
  }

  const selectedModel =
    models.find((model) => model.id === activeModelId) ?? models[0];

  return (
    <Select value={selectedModel?.id} onValueChange={onChange}>
      <SelectTrigger
        className="w-[220px] rounded-full border-white/20 bg-white/5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white focus:ring-0 focus:ring-offset-0"
        aria-label={selectedModel?.label ?? 'Select model'}
      >
        <span className="truncate">
          {selectedModel?.label ?? 'Select model'}
        </span>
      </SelectTrigger>
      <SelectContent className="w-[240px] border-white/10 bg-black/90 text-white">
        {models.map((model) => (
          <SelectPrimitive.Item
            key={model.id}
            value={model.id}
            textValue={model.label}
            className="relative flex w-full cursor-default select-none items-start gap-2 rounded-md px-3 py-3 text-left text-sm outline-none transition data-[highlighted]:bg-white/10 data-[state=checked]:bg-white/10"
          >
            <span className="absolute right-3 top-1/2 -translate-y-1/2">
              <SelectPrimitive.ItemIndicator>
                <CheckIcon className="h-4 w-4 text-white" />
              </SelectPrimitive.ItemIndicator>
            </span>
            <div className="space-y-1 pr-6">
              <SelectPrimitive.ItemText asChild>
                <p className="font-semibold leading-tight">{model.label}</p>
              </SelectPrimitive.ItemText>
              <p
                className="text-xs font-normal text-white/60"
                aria-hidden="true"
              >
                {model.description}
              </p>
            </div>
          </SelectPrimitive.Item>
        ))}
      </SelectContent>
    </Select>
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
