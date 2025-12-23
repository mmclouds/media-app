'use client';

import { useState } from 'react';
import { useAssetsManager } from '@/hooks/use-assets-manager';
import { AssetsHeader } from './assets-header';
import { AssetsTabBar } from './assets-tab-bar';
import { AssetsGrid } from './assets-grid';
import { EmptyState } from './empty-state';
import type { AssetsManagerProps } from './types';

export function AssetsManager({
  className,
  mode = 'dialog',
  onClose,
  defaultMediaType = 'VIDEO',
}: AssetsManagerProps) {
  const [selectedMediaType, setSelectedMediaType] = useState(defaultMediaType);
  const {
    assets,
    isLoading,
    hasMore,
    error,
    setMediaType,
    loadMore,
    refresh,
  } = useAssetsManager({
    initialMediaType: defaultMediaType,
  });

  const handleMediaTypeChange = (type: 'VIDEO' | 'IMAGE' | 'AUDIO') => {
    setSelectedMediaType(type);
    setMediaType(type);
  };

  return (
    <div className={`flex flex-col h-full min-h-0 ${className || ''}`}>
      <AssetsHeader mode={mode} onClose={onClose} className="mb-6" />

      <AssetsTabBar
        activeMediaType={selectedMediaType}
        onMediaTypeChange={handleMediaTypeChange}
        className="mb-6"
      />

      {error ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-6">
          <div className="h-2 w-2 rounded-full bg-red-500" />
          <span className="text-sm text-white/80">{error}</span>
          <button
            type="button"
            className="rounded-full border border-white/40 px-3 py-1 text-xs text-white transition hover:border-white/60"
            onClick={refresh}
          >
            Try again
          </button>
        </div>
      ) : assets.length === 0 && !isLoading ? (
        <EmptyState mediaType={selectedMediaType} />
      ) : (
        <AssetsGrid
          assets={assets}
          isLoading={isLoading}
          hasMore={hasMore}
          onLoadMore={loadMore}
        />
      )}
    </div>
  );
}
