'use client';

import { cn } from '@/lib/utils';
import { MediaGeneratorConfigPanel } from './media-generator-config-panel';
import { MEDIA_TYPE_OPTIONS, useMediaGeneratorController } from './controller';
import { demoVideoAssets } from './data';
import { MediaGeneratorResultPane } from './media-generator-result-pane';
import { MediaGeneratorMenu } from './media-generator-menu';

export function MediaGeneratorWorkspace({ className }: { className?: string }) {
  const {
    mediaType,
    setMediaType,
    mediaTypeOptions,
    availableModels,
    activeModelId,
    setActiveModelId,
    modelConfigs,
    onModelConfigChange,
    prompt,
    setPrompt,
    onGenerate,
    isGenerating,
    activeGeneration,
  } = useMediaGeneratorController();

  const asset = demoVideoAssets[0];

  const currentAsset = asset ?? {
    id: 'demo-video',
    title: 'AI Video',
    duration: '5s',
    resolution: '720p',
    src: '',
    tags: ['AI Video'],
  };

  return (
    <div
      className={cn(
        'flex h-full w-full max-h-screen min-h-0 overflow-hidden rounded-[36px] border border-white/10 bg-black text-white shadow-[0_40px_120px_rgba(0,0,0,0.45)]',
        className
      )}
    >
      <MediaGeneratorMenu
        options={mediaTypeOptions ?? MEDIA_TYPE_OPTIONS}
        value={mediaType}
        onChange={setMediaType}
      />
      <MediaGeneratorConfigPanel
        mediaType={mediaType}
        models={availableModels}
        activeModelId={activeModelId}
        modelConfigs={modelConfigs}
        onModelChange={setActiveModelId}
        onModelConfigChange={onModelConfigChange}
        prompt={prompt}
        onPromptChange={setPrompt}
        onGenerate={onGenerate}
        isGenerating={isGenerating}
      />
      <MediaGeneratorResultPane
        asset={currentAsset}
        loading={isGenerating}
        activeGeneration={activeGeneration}
      />
    </div>
  );
}
