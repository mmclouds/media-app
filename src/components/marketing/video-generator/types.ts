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
