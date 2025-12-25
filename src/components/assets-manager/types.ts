import type { VideoGeneratorAsset } from '@/components/marketing/media-generator/types';

export type MediaType = 'VIDEO' | 'IMAGE' | 'AUDIO';

export interface AssetsManagerProps {
  className?: string;
  mode?: 'dialog' | 'page';
  onClose?: () => void;
  defaultMediaType?: MediaType;
}

export interface AssetsManagerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export interface AssetCardProps {
  asset: VideoGeneratorAsset;
  onHeightChange?: (height: number) => void;
}
