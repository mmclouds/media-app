import { useAssetsManager } from '@/hooks/use-assets-manager';
import type { MediaType } from './types';

interface AssetsTabBarProps {
  activeMediaType: MediaType;
  onMediaTypeChange: (type: MediaType) => void;
  className?: string;
}

export function AssetsTabBar({
  activeMediaType,
  onMediaTypeChange,
  className,
}: AssetsTabBarProps) {
  const tabs: Array<{ value: MediaType; label: string }> = [
    { value: 'VIDEO', label: 'Videos' },
    { value: 'IMAGE', label: 'Images' },
    { value: 'AUDIO', label: 'Audio' },
  ];

  return (
    <div className={`flex gap-1 rounded-lg bg-white/5 p-1 text-xs font-semibold ${className || ''}`}>
      {tabs.map(tab => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onMediaTypeChange(tab.value)}
          className={`rounded-md px-3 py-1 transition ${
            activeMediaType === tab.value
              ? 'bg-white/10 text-white'
              : 'text-white/60 hover:text-white'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}