import { auth } from '@/lib/auth';
import { type NextRequest, NextResponse } from 'next/server';

const DEFAULT_MODEL_NAME = 'sora-2';
const DEFAULT_MODEL = 'sora-2';
const DEFAULT_MEDIA_TYPE = 'VIDEO';
const DEFAULT_SECONDS = 4;
const DEFAULT_SIZE = '1280x720';

const gatewayBaseUrl = process.env.AI_GATEWAY_URL;
const gatewayApiKey = process.env.AI_GATEWAY_API_KEY;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      {
        status: 401,
      }
    );
  }

  if (!gatewayBaseUrl) {
    return NextResponse.json(
      { error: 'AI gateway URL is not configured' },
      {
        status: 500,
      }
    );
  }

  if (!gatewayApiKey) {
    return NextResponse.json(
      { error: 'AI gateway API key is not configured' },
      {
        status: 500,
      }
    );
  }

  let payload: Record<string, unknown> | null = null;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch (error) {
    console.error('解析视频生成参数失败:', error);
    return NextResponse.json(
      { error: 'Invalid request body' },
      {
        status: 400,
      }
    );
  }

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
    return NextResponse.json(
      { error: 'Prompt is required' },
      {
        status: 400,
      }
    );
  }

  const searchParams = request.nextUrl.searchParams;
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

  const normalizedBaseUrl = gatewayBaseUrl.endsWith('/')
    ? gatewayBaseUrl.slice(0, -1)
    : gatewayBaseUrl;

  const outgoingParams = new URLSearchParams();
  outgoingParams.set('mediaType', outgoingMediaType);
  outgoingParams.set('modelName', resolvedModelName);
  outgoingParams.set('userId', userId);

  const targetUrl = `${normalizedBaseUrl}/api/v1/media/generate?${outgoingParams.toString()}`;

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': gatewayApiKey,
      },
      body: JSON.stringify(bodyPayload),
      cache: 'no-store',
    });

    const result = await response.json().catch(() => null);

    if (!response.ok || !result?.success || !result?.data) {
      const errorMessage =
        result?.message ?? `Failed to trigger media task (${response.status})`;

      console.error('触发视频生成失败:', errorMessage, result);

      return NextResponse.json(
        { error: errorMessage },
        {
          status: response.ok ? 502 : response.status,
        }
      );
    }

    return NextResponse.json({ taskId: result.data }, { status: 200 });
  } catch (error) {
    console.error('视频生成请求异常:', error);
    return NextResponse.json(
      { error: 'Failed to trigger media task' },
      {
        status: 500,
      }
    );
  }
}
