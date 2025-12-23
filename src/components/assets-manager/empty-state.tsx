import { type MediaType } from './types';

interface EmptyStateProps {
  mediaType: MediaType;
  className?: string;
}

export function EmptyState({ mediaType, className }: EmptyStateProps) {
  const messages = {
    VIDEO: 'No videos yet',
    IMAGE: 'No images yet',
    AUDIO: 'No audio yet',
  };

  return (
    <div className={`flex flex-col items-center justify-center py-12 text-center ${className || ''}`}>
      <div className="h-12 w-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center mb-4">
        <div className="h-3 w-3 rounded-full bg-white/30" />
      </div>
      <p className="text-sm text-white/50">
        {messages[mediaType]}
      </p>
      <p className="text-xs text-white/30 mt-1">
        Start by generating some {mediaType.toLowerCase() === 'video' ? 'videos' : mediaType.toLowerCase() === 'image' ? 'images' : 'audio'}
      </p>
    </div>
  );
}