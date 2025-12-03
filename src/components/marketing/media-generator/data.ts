import type { MediaGeneratorAsset, MediaModelPreset } from './types';

export const soraVideoPreset: MediaModelPreset = {
  id: 'video-sora',
  label: 'Sora Video 2',
  mediaType: 'VIDEO',
  modelName: 'sora-2',
  defaults: {
    mediaType: 'VIDEO',
    modelName: 'sora-2',
    model: 'sora-2',
    seconds: 6,
    size: '1280x720',
  },
};

export const demoMediaAssets: MediaGeneratorAsset[] = [
  {
    id: 'aurora-overdrive',
    title: 'Aurora Overdrive',
    duration: '8s',
    resolution: '1080p',
    src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    poster:
      'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1200&q=80',
    tags: ['Camera rail', 'Night city', 'Racing vibe'],
  },
  {
    id: 'desert-dreamer',
    title: 'Desert Dreamer',
    duration: '6s',
    resolution: '4K',
    src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    poster:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    tags: ['Golden hour', 'Travel', 'Dust particles'],
  },
  {
    id: 'tidal-motion',
    title: 'Tidal Motion',
    duration: '10s',
    resolution: '720p',
    src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    poster:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    tags: ['Slow motion', 'Aerial', 'Water flow'],
  },
];
