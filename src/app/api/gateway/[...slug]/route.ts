import { normalizeGatewayBaseUrl } from '@/lib/ai-gateway/client';
import { auth } from '@/lib/auth';
import { type NextRequest, NextResponse } from 'next/server';

const defaultTenantId = process.env.NEXT_PUBLIC_TENANT_ID || '0';
const defaultBucket = process.env.NEXT_PUBLIC_UPLOAD_BUCKET || '0-image';

type GatewayRoute =
  | { kind: 'media-generate' }
  | { kind: 'media-feed' }
  | { kind: 'media-result'; taskId: string }
  | { kind: 'files-upload' }
  | { kind: 'files-download'; uuid: string };

export const dynamic = 'force-dynamic';

const gatewayBaseUrl = normalizeGatewayBaseUrl(process.env.AI_GATEWAY_URL);
const gatewayApiKey = process.env.AI_GATEWAY_API_KEY;

export async function GET(
  request: NextRequest,
  context: { params: { slug?: string[] } }
) {
  return handleGatewayRequest(request, context);
}

export async function POST(
  request: NextRequest,
  context: { params: { slug?: string[] } }
) {
  return handleGatewayRequest(request, context);
}

export async function handleGatewayRequest(
  request: NextRequest,
  context: { params: { slug?: string[] } }
) {
  if (!gatewayBaseUrl) {
    return NextResponse.json(
      { error: 'AI gateway URL is not configured' },
      { status: 500 }
    );
  }

  if (!gatewayApiKey) {
    return NextResponse.json(
      { error: 'AI gateway API key is not configured' },
      { status: 500 }
    );
  }

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const route = matchRoute(context.params.slug ?? []);

  if (!route) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    switch (route.kind) {
      case 'media-generate':
        return handleMediaGenerate(request, userId);
      case 'media-feed':
        return handleMediaFeed(request, userId);
      case 'media-result':
        return handleMediaResult(request, route.taskId);
      case 'files-upload':
        return handleFilesUpload(request, userId);
      case 'files-download':
        return handleFilesDownload(request, userId, route.uuid);
      default:
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('网关代理异常:', error);
    return NextResponse.json(
      { error: 'Gateway proxy failed' },
      { status: 500 }
    );
  }
}

function matchRoute(slug: string[]): GatewayRoute | null {
  const [first, second, third] = slug;

  if (first === 'media' && second === 'generate') {
    return { kind: 'media-generate' };
  }

  if (first === 'media' && second === 'feed') {
    return { kind: 'media-feed' };
  }

  if (first === 'media' && second === 'result' && third) {
    return { kind: 'media-result', taskId: third };
  }

  if (first === 'files' && second === 'upload') {
    return { kind: 'files-upload' };
  }

  if (first === 'files' && second === 'download' && third) {
    return { kind: 'files-download', uuid: third };
  }

  return null;
}

async function handleMediaGenerate(request: NextRequest, userId: string) {
  const DEFAULT_MODEL_NAME = 'sora-2';
  const DEFAULT_MODEL = 'sora-2';
  const DEFAULT_MEDIA_TYPE = 'VIDEO';
  const DEFAULT_SECONDS = 4;
  const DEFAULT_SIZE = '1280x720';

  let payload: Record<string, unknown> | null = null;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch (error) {
    console.error('解析视频生成参数失败:', error);
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }

  const searchParams = new URLSearchParams(request.nextUrl.searchParams);
  const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value);

  const {
    mediaType: bodyMediaType,
    modelName: bodyModelName,
    ...providerPayload
  } = payload ?? {};
  const providerInput = isRecord(providerPayload?.input)
    ? (providerPayload.input as Record<string, unknown>)
    : null;
  const inputPrompt =
    providerInput && typeof providerInput.prompt === 'string'
      ? providerInput.prompt.trim()
      : '';
  const prompt =
    inputPrompt ||
    (typeof providerPayload?.prompt === 'string'
      ? providerPayload.prompt.trim()
      : '');

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
  }

  const queryMediaType = searchParams.get('mediaType') ?? undefined;
  const queryModelName = searchParams.get('modelName') ?? undefined;

  const rawMediaType =
    typeof bodyMediaType === 'string' && bodyMediaType.trim().length > 0
      ? bodyMediaType.trim()
      : undefined;
  const mediaTypeCandidate =
    queryMediaType?.trim() ?? rawMediaType ?? DEFAULT_MEDIA_TYPE;

  const supportedMediaTypes = ['VIDEO', 'IMAGE', 'AUDIO'];
  const normalizedMediaType = mediaTypeCandidate.toUpperCase();
  const outgoingMediaType = supportedMediaTypes.includes(normalizedMediaType)
    ? normalizedMediaType
    : DEFAULT_MEDIA_TYPE;

  const rawModelName =
    typeof bodyModelName === 'string' && bodyModelName.trim().length > 0
      ? bodyModelName.trim()
      : undefined;
  const resolvedModelName =
    (queryModelName?.trim() ?? rawModelName ?? DEFAULT_MODEL_NAME) ||
    DEFAULT_MODEL_NAME;

  const resolvedModel =
    typeof providerPayload?.model === 'string' &&
    providerPayload.model.trim().length > 0
      ? providerPayload.model
      : DEFAULT_MODEL;
  const bodyPayload = providerInput
    ? {
        ...providerPayload,
        input: {
          ...providerInput,
          prompt:
            typeof providerInput.prompt === 'string' &&
            providerInput.prompt.trim().length > 0
              ? providerInput.prompt.trim()
              : prompt,
        },
        model: resolvedModel,
      }
    : ({
        model: resolvedModel,
        seconds: DEFAULT_SECONDS,
        size: DEFAULT_SIZE,
        ...providerPayload,
        prompt,
      } satisfies Record<string, unknown>);

  searchParams.set('userId', userId);
  searchParams.set('mediaType', outgoingMediaType);
  searchParams.set('modelName', resolvedModelName);
  const fileUuids = searchParams
    .getAll('fileUuids')
    .filter((uuid) => uuid.trim().length > 0);
  searchParams.delete('fileUuids');
  fileUuids.forEach((uuid) => searchParams.append('fileUuids', uuid.trim()));

  const targetUrl = buildUrl('/api/v1/media/generate', searchParams);

  const response = await fetch(targetUrl, {
    method: 'POST',
    headers: buildHeaders({
      apiKey: gatewayApiKey,
      contentType: 'application/json',
    }),
    body: JSON.stringify(bodyPayload),
    cache: 'no-store',
  });

  return forwardResponse(response);
}

async function handleMediaFeed(request: NextRequest, userId: string) {
  const DEFAULT_LIMIT = 10;
  const MAX_LIMIT = 100;
  const DEFAULT_MEDIA_TYPES = 'VIDEO';
  const DEFAULT_SORT = 'desc';

  const searchParams = new URLSearchParams(request.nextUrl.searchParams);
  const rawLimit = Number(searchParams.get('limit'));
  const limit = Number.isFinite(rawLimit)
    ? Math.min(Math.max(rawLimit, 1), MAX_LIMIT)
    : DEFAULT_LIMIT;

  const sortParam = searchParams.get('sort')?.toLowerCase();
  const sort =
    sortParam === 'asc' || sortParam === 'desc' ? sortParam : DEFAULT_SORT;
  const mediaTypes = searchParams.get('mediaTypes') ?? DEFAULT_MEDIA_TYPES;

  searchParams.set('userId', userId);
  searchParams.set('limit', String(limit));
  searchParams.set('sort', sort);
  searchParams.set('mediaTypes', mediaTypes);

  const targetUrl = buildUrl('/api/v1/media/feed/cursor', searchParams);

  const response = await fetch(targetUrl, {
    headers: buildHeaders({
      apiKey: gatewayApiKey,
      contentType: 'application/json',
    }),
    cache: 'no-store',
  });

  return forwardResponse(response);
}

async function handleMediaResult(request: NextRequest, taskId: string) {
  const targetUrl = `${gatewayBaseUrl}/api/v1/media/result/${encodeURIComponent(
    taskId
  )}`;

  const response = await fetch(targetUrl, {
    headers: buildHeaders({
      apiKey: gatewayApiKey,
      contentType: 'application/json',
    }),
    cache: 'no-store',
  });

  return forwardResponse(response);
}

async function handleFilesUpload(request: NextRequest, userId: string) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch (error) {
    console.error('解析上传表单失败', error);
    return NextResponse.json(
      { error: 'Invalid upload form data' },
      { status: 400 }
    );
  }

  const bucketValue = formData.get('bucket');
  if (!bucketValue || typeof bucketValue !== 'string' || !bucketValue.trim()) {
    formData.set('bucket', defaultBucket);
  }

  const searchParams = new URLSearchParams(request.nextUrl.searchParams);
  searchParams.set('userId', userId);

  const targetUrl = buildUrl('/api/files/upload', searchParams);

  const response = await fetch(targetUrl, {
    method: 'POST',
    headers: buildHeaders({
      apiKey: gatewayApiKey,
      forwardAuthHeaders: true,
      requestHeaders: request.headers,
    }),
    body: formData,
    cache: 'no-store',
  });

  return forwardResponse(response);
}

async function handleFilesDownload(
  request: NextRequest,
  userId: string,
  uuid: string
) {
  const searchParams = new URLSearchParams(request.nextUrl.searchParams);
  const tenantId = searchParams.get('tenantId') || defaultTenantId;

  searchParams.set('tenantId', tenantId);
  searchParams.set('userId', userId);

  const targetUrl = buildUrl(
    `/api/public/files/download/${encodeURIComponent(uuid)}`,
    searchParams
  );

  const response = await fetch(targetUrl, {
    method: 'GET',
    cache: 'no-store',
  });

  return forwardResponse(response);
}

function buildHeaders(options: {
  apiKey?: string;
  contentType?: string;
  forwardAuthHeaders?: boolean;
  requestHeaders?: Headers;
}) {
  const headers = new Headers();

  if (options.contentType) {
    headers.set('Content-Type', options.contentType);
  }

  if (options.apiKey) {
    headers.set('X-API-Key', options.apiKey);
  }

  if (options.forwardAuthHeaders && options.requestHeaders) {
    const authHeader = options.requestHeaders.get('authorization');
    const cookie = options.requestHeaders.get('cookie');

    if (authHeader) {
      headers.set('authorization', authHeader);
    }

    if (cookie) {
      headers.set('cookie', cookie);
    }
  }

  return headers;
}

function buildUrl(path: string, searchParams?: URLSearchParams) {
  if (searchParams && searchParams.size > 0) {
    return `${gatewayBaseUrl}${path}?${searchParams.toString()}`;
  }

  return `${gatewayBaseUrl}${path}`;
}

async function forwardResponse(response: Response) {
  const headers = new Headers(response.headers);
  return new Response(response.body, {
    status: response.status,
    headers,
  });
}
