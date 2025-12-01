export type VideoGeneratorAsset = {
  id: string;
  title: string;
  duration: string;
  resolution: string;
  src: string;
  poster?: string;
  tags: string[];
  status?: string;
  createdAt?: string;
  errorMessage?: string | null;
};

export type VideoGeneratorHistory = string[];

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
  providerName?: string | null;
  createdAt?: string | null;
  completedAt?: string | null;
  errorMessage?: string | null;
  progress?: number | null;
};

export type VideoGenerationState = MediaTaskResult & {
  prompt: string;
};

export type MediaFeedItem = {
  uuid: string;
  taskId: string;
  tenantId?: string;
  userId?: string;
  mediaType?: string;
  modelName?: string;
  parameters?: string | null;
  providerName?: string | null;
  status?: string;
  onlineUrl?: string | null;
  downloadUrl?: string | null;
  fileUuid?: string | null;
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
