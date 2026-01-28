import type { CalculateCreditsResult } from '@/custom/credits/pricing/types';
import type { LucideIcon } from 'lucide-react';
import type { ComponentType } from 'react';

export type VideoGeneratorAsset = {
  id: string;
  taskId?: string;
  fileUuid?: string | null;
  mediaType?: MediaType;
  title: string;
  duration: string;
  resolution: string;
  modelName?: string;
  prompt?: string;
  src: string;
  poster?: string;
  audioSources?: string[];
  audioCovers?: string[];
  tags: string[];
  status?: string;
  createdAt?: string;
  errorMessage?: string | null;
};

export type MediaType = 'video' | 'audio' | 'image';

export type MediaTypeOption = {
  id: MediaType;
  label: string;
  icon: LucideIcon;
};

export type CreditEstimateState = {
  result: CalculateCreditsResult | null;
  error: string | null;
  loading: boolean;
};

export type MediaModelConfig = Record<
  string,
  string | number | boolean | null | undefined | string[]
>;

export type MediaModelConfigProps = {
  config: MediaModelConfig;
  onChange: (config: MediaModelConfig) => void;
  prompt: string;
  onPromptChange: (value: string) => void;
  onCreditEstimateChange?: (state: CreditEstimateState) => void;
};

export type MediaModelDefinition = {
  id: string;
  label: string;
  description: string;
  provider?: string;
  mediaType: MediaType;
  modelName: string;
  model?: string;
  defaultConfig: MediaModelConfig;
  configComponent: ComponentType<MediaModelConfigProps>;
  supportsCreditEstimate?: boolean;
};

export type MediaTaskStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'timeout';

export type MediaTaskResult = {
  taskId: string;
  status: MediaTaskStatus;
  statusDescription?: string | null;
  onlineUrl?: string | null;
  downloadUrl?: string | null;
  temporaryFileUrl?: string | null;
  fileUuid?: string | null;
  coverFileUuid?: string | null;
  temporaryCoverFileUrl?: string | null;
  providerName?: string | null;
  createdAt?: string | null;
  completedAt?: string | null;
  errorMessage?: string | null;
  progress?: number | null;
};

export type VideoGenerationState = MediaTaskResult & {
  prompt: string;
  mediaType?: MediaType;
};

export type MediaGenerationPayload = {
  mediaType: MediaType;
  modelId: string;
  prompt: string;
  config: MediaModelConfig;
};

export type MediaFeedItem = {
  uuid: string;
  taskId: string;
  tenantId?: string;
  userId?: string;
  mediaType?: string;
  modelName?: string;
  prompt?: string | null;
  parameters?: string | null;
  providerName?: string | null;
  status?: string;
  onlineUrl?: string | null;
  downloadUrl?: string | null;
  fileUuid?: string | null;
  coverFileUuid?: string | null;
  temporaryFileUrl?: string | null;
  temporaryCoverFileUrl?: string | null;
  errorMessage?: string | null;
  errorCode?: string | null;
  retryCount?: number;
  executionTimeMs?: number | null;
  createdAt?: string;
  updatedAt?: string;
};

export type MediaFeedResponse = {
  content?: MediaFeedItem[];
  limit?: number;
  hasMore?: boolean;
  nextCursor?: string | null;
};
