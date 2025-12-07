'use client';

import { cn } from '@/lib/utils';
import { MediaGeneratorConfigPanel } from './config-panel';
import { useMediaGeneratorController } from './controller';
import { demoVideoAssets } from './data';
import { MediaGeneratorResultPane } from './preview-panel';

// 双栏布局：固定媒体类型为视频，复用通用配置/结果面板
export function MediaOnlyGeneratorWorkspace({
  className,
}: {
  className?: string;
}) {
  const {
    mediaType,
    availableModels,
    activeModelId,
    setActiveModelId,
    modelConfigs,
    onModelConfigChange,
    prompt,
    setPrompt,
    history,
    onGenerate,
    isGenerating,
    activeGeneration,
  } = useMediaGeneratorController({ lockedMediaType: 'video' });

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
        'flex h-full w-full max-h-screen overflow-hidden rounded-[36px] border border-white/10 bg-black text-white shadow-[0_40px_120px_rgba(0,0,0,0.45)]',
        className
      )}
    >
      <MediaGeneratorConfigPanel
        mediaType={mediaType}
        models={availableModels}
        activeModelId={activeModelId}
        modelConfigs={modelConfigs}
        onModelChange={setActiveModelId}
        onModelConfigChange={onModelConfigChange}
        prompt={prompt}
        onPromptChange={setPrompt}
        history={history}
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
