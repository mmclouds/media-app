import { NextResponse } from 'next/server';

const defaultTenantId = process.env.NEXT_PUBLIC_TENANT_ID || '0';
const defaultBucket = process.env.NEXT_PUBLIC_UPLOAD_BUCKET || '0-image';

export const normalizeGatewayBaseUrl = (baseUrl?: string) =>
  baseUrl?.endsWith('/') ? baseUrl.slice(0, -1) : (baseUrl ?? '');

export type GatewayConfig = {
  baseUrl: string;
  apiKey?: string;
  tenantId: string;
  bucket: string;
};

export type GatewayConfigResult =
  | { ok: true; config: GatewayConfig }
  | { ok: false; response: NextResponse };

export const getGatewayConfig = (
  options: { requireApiKey?: boolean } = {}
): GatewayConfigResult => {
  const baseUrl = process.env.AI_GATEWAY_URL;
  const apiKey = process.env.AI_GATEWAY_API_KEY;

  if (!baseUrl) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'AI gateway URL is not configured' },
        { status: 500 }
      ),
    };
  }

  if (options.requireApiKey !== false && !apiKey) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'AI gateway API key is not configured' },
        { status: 500 }
      ),
    };
  }

  return {
    ok: true,
    config: {
      baseUrl: normalizeGatewayBaseUrl(baseUrl),
      apiKey: apiKey ?? '',
      tenantId: defaultTenantId,
      bucket: defaultBucket,
    },
  };
};

export const createGatewayUrl = (
  baseUrl: string,
  path: string,
  searchParams?: URLSearchParams
) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const query = searchParams?.toString();

  return query
    ? `${baseUrl}${normalizedPath}?${query}`
    : `${baseUrl}${normalizedPath}`;
};

export const appendDefaultGatewayParams = (
  params: URLSearchParams,
  defaults: {
    userId?: string;
    tenantId?: string;
    bucket?: string;
  }
) => {
  if (defaults.userId && !params.has('userId')) {
    params.set('userId', defaults.userId);
  }

  if (defaults.tenantId && !params.has('tenantId')) {
    params.set('tenantId', defaults.tenantId);
  }

  if (defaults.bucket && !params.has('bucket')) {
    params.set('bucket', defaults.bucket);
  }

  return params;
};

export const createGatewayHeaders = (options: {
  apiKey?: string;
  contentType?: string;
  forwardAuthHeaders?: boolean;
  requestHeaders?: Headers;
  includeApiKey?: boolean;
}) => {
  const headers = new Headers();

  if (options.contentType) {
    headers.set('Content-Type', options.contentType);
  }

  if (options.includeApiKey !== false && options.apiKey) {
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
};

export type GatewayJsonParseResult<T> =
  | { ok: true; data: T; payload: unknown }
  | { ok: false; message: string; status: number; payload: unknown };

export const parseGatewayJson = async <T>(options: {
  response: Response;
  logLabel: string;
  defaultError: string;
  expectSuccess?: boolean;
}): Promise<GatewayJsonParseResult<T>> => {
  const payload = await options.response.json().catch(() => null);
  const expectSuccess = options.expectSuccess !== false;
  const success =
    options.response.ok &&
    (!expectSuccess ||
      Boolean((payload as { success?: unknown } | null)?.success));

  if (!success) {
    const message =
      (payload as { message?: string } | null)?.message ??
      `${options.defaultError} (${options.response.status})`;

    console.error(`${options.logLabel}:`, message, payload);

    return {
      ok: false,
      message,
      status: options.response.ok ? 502 : options.response.status,
      payload,
    };
  }

  return {
    ok: true,
    data: ((payload as { data?: T } | null)?.data ?? payload) as T,
    payload,
  };
};
