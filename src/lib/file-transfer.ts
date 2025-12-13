type UploadApiResponse = {
  uuid?: string;
  storageType?: string;
  bucketName?: string;
  objectKey?: string;
  fileSize?: number;
  etag?: string;
  success?: boolean;
  message?: string;
  error?: string;
};

export type UploadedFileInfo = UploadApiResponse & {
  downloadUrl: string;
};

const normalizeBaseUrl = (apiBaseUrl?: string) => {
  if (!apiBaseUrl) {
    return '';
  }
  return apiBaseUrl.endsWith('/')
    ? apiBaseUrl.slice(0, -1)
    : apiBaseUrl;
};

const parseFilenameFromHeader = (contentDisposition?: string | null) => {
  if (!contentDisposition) {
    return undefined;
  }

  const match = /filename\*=UTF-8''([^;]+)/i.exec(contentDisposition);
  if (match?.[1]) {
    return decodeURIComponent(match[1]);
  }

  const fallbackMatch = /filename="?([^"]+)"?/i.exec(contentDisposition);
  return fallbackMatch?.[1];
};

const createApiUrl = (apiBaseUrl: string, path: string) =>
  `${apiBaseUrl}${path.startsWith('/') ? path : `/${path}`}`;

const UPLOAD_PROXY_PATH = '/api/files/upload';
const PUBLIC_DOWNLOAD_PROXY_PATH = '/api/files/download';

const defaultApiBaseUrl = () => '';

export type UploadFileOptions = {
  file: File | Blob;
  bucket: string;
  fileName?: string;
  apiBaseUrl?: string;
};

/**
 * 上传文件到指定 bucket，并返回完整的上传结果。
 */
export async function uploadFileToBucket({
  file,
  bucket,
  fileName,
  apiBaseUrl,
}: UploadFileOptions): Promise<UploadApiResponse> {
  if (!bucket) {
    throw new Error('Bucket is required for upload.');
  }

  const apiBase = normalizeBaseUrl(apiBaseUrl ?? defaultApiBaseUrl());
  const url = createApiUrl(apiBase, UPLOAD_PROXY_PATH);

  const formData = new FormData();
  formData.append('file', file);
  formData.append('bucket', bucket);
  if (fileName) {
    formData.append('fileName', fileName);
  }

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  const result = (await response.json().catch(() => null)) as UploadApiResponse | null;

  if (!response.ok || !result?.uuid) {
    const message =
      result?.message ??
      result?.error ??
      (response.statusText || 'Failed to upload file.');
    throw new Error(message);
  }

  return result;
}

export type BuildDownloadUrlParams = {
  uuid: string;
  tenantId: string;
  apiBaseUrl?: string;
};

/**
 * 构造公网下载链接，适配多环境。
 */
export const buildPublicFileDownloadUrl = ({
  uuid,
  tenantId,
  apiBaseUrl,
}: BuildDownloadUrlParams) => {
  const apiBase = normalizeBaseUrl(apiBaseUrl ?? defaultApiBaseUrl());
  const base = createApiUrl(
    apiBase,
    `${PUBLIC_DOWNLOAD_PROXY_PATH}/${encodeURIComponent(uuid)}`
  );
  const params = new URLSearchParams();
  params.set('tenantId', tenantId);
  return `${base}?${params.toString()}`;
};

export type DownloadFileParams = BuildDownloadUrlParams;

export type DownloadedFile = {
  blob: Blob;
  fileName?: string;
};

/**
 * 通过 uuid 下载文件，返回 Blob 便于预览或二次处理。
 */
export async function downloadFileByUuid({
  uuid,
  tenantId,
  apiBaseUrl,
}: DownloadFileParams): Promise<DownloadedFile> {
  if (!uuid) {
    throw new Error('File uuid is required for download.');
  }
  if (!tenantId) {
    throw new Error('TenantId is required for download.');
  }

  const url = buildPublicFileDownloadUrl({ uuid, tenantId, apiBaseUrl });
  const response = await fetch(url);

  if (!response.ok) {
    let message = 'Failed to download file.';
    try {
      const data = (await response.json()) as { message?: string };
      message = data.message ?? message;
    } catch {
      message = response.statusText || message;
    }
    throw new Error(message);
  }

  const blob = await response.blob();
  const fileName = parseFilenameFromHeader(response.headers.get('content-disposition'));
  return { blob, fileName };
}
