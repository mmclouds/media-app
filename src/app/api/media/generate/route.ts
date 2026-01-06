import { consumeCredits, hasEnoughCredits } from '@/credits/credits';
import { calculateCredits } from '@/custom/credits/pricing';
import { auth } from '@/lib/auth';
import { type NextRequest, NextResponse } from 'next/server';

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
      },
    );
  }

  if (!gatewayBaseUrl) {
    return NextResponse.json(
      { error: 'AI gateway URL is not configured' },
      {
        status: 500,
      },
    );
  }

  if (!gatewayApiKey) {
    return NextResponse.json(
      { error: 'AI gateway API key is not configured' },
      {
        status: 500,
      },
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
      },
    );
  }

  if (!payload) {
    return NextResponse.json(
      { error: 'Request body is required' },
      {
        status: 400,
      },
    );
  }

  const {
    mediaType: bodyMediaType,
    modelName: bodyModelName,
    ...providerPayload
  } = payload;
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

  // 必需参数检查
  if (!prompt) {
    return NextResponse.json(
      { error: 'Prompt is required' },
      {
        status: 400,
      },
    );
  }

  const searchParams = request.nextUrl.searchParams;

  // 使用查询参数或 body 参数，无默认值
  const queryMediaType = searchParams.get('mediaType');
  const queryModelName = searchParams.get('modelName');

  // 媒体类型：优先使用查询参数，其次使用 body 参数
  const outgoingMediaType = queryMediaType?.trim() ||
    (typeof bodyMediaType === 'string' && bodyMediaType.trim().length > 0
      ? bodyMediaType.trim()
      : undefined);

  if (!outgoingMediaType) {
    return NextResponse.json(
      { error: 'mediaType is required' },
      {
        status: 400,
      },
    );
  }

  const supportedMediaTypes = ['VIDEO', 'IMAGE', 'AUDIO'];
  const normalizedMediaType = outgoingMediaType.toUpperCase();
  if (!supportedMediaTypes.includes(normalizedMediaType)) {
    return NextResponse.json(
      {
        error: `Invalid mediaType: ${outgoingMediaType}. Supported: ${supportedMediaTypes.join(', ')}`,
      },
      {
        status: 400,
      },
    );
  }

  // 模型名称：优先使用查询参数，其次使用 body 参数
  const outgoingModelName =
    queryModelName?.trim() ||
    (typeof bodyModelName === 'string' && bodyModelName.trim().length > 0
      ? bodyModelName.trim()
      : undefined);

  if (!outgoingModelName) {
    return NextResponse.json(
      { error: 'modelName is required' },
      {
        status: 400,
      },
    );
  }

  // 具体模型：使用 payload.model
  const resolvedModel =
    typeof providerPayload?.model === 'string' &&
    providerPayload.model.trim().length > 0
      ? providerPayload.model
      : undefined;

  if (!resolvedModel) {
    return NextResponse.json(
      { error: 'Missing required parameter: model' },
      {
        status: 400,
      },
    );
  }

  const creditResult = calculateCredits(payload);
  if (!creditResult) {
    return NextResponse.json(
      { error: 'No matching pricing rule found' },
      {
        status: 400,
      },
    );
  }

  const hasCredits = await hasEnoughCredits({
    userId,
    requiredCredits: creditResult.credits,
  });

  if (!hasCredits) {
    return NextResponse.json(
      { error: 'Insufficient credits. Please recharge your credits.' },
      {
        status: 402,
      },
    );
  }

  // 构建 bodyPayload，不做任何默认值填充
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
    : {
        model: resolvedModel,
        ...providerPayload,
        prompt,
      };

  const normalizedBaseUrl = gatewayBaseUrl.endsWith('/')
    ? gatewayBaseUrl.slice(0, -1)
    : gatewayBaseUrl;

  const outgoingParams = new URLSearchParams();
  outgoingParams.set('mediaType', normalizedMediaType);
  outgoingParams.set('modelName', outgoingModelName);
  outgoingParams.set('userId', userId);
  outgoingParams.set('creditsAmount', String(creditResult.credits));
  outgoingParams.set('creditsDescription', 'media generate');
  const fileUuids = searchParams
    .getAll('fileUuids')
    .filter((uuid) => uuid.trim().length > 0);
  fileUuids.forEach((uuid) => outgoingParams.append('fileUuids', uuid.trim()));

  const targetUrl = `${normalizedBaseUrl}/api/v1/media/generate?${outgoingParams.toString()}`;
  console.log("请求的参数是：",JSON.stringify(bodyPayload));
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
        },
      );
    }

    try {
      await consumeCredits({
        userId,
        amount: creditResult.credits,
        description: `media generate`,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.error(
        `扣减积分失败, userId: ${userId}, taskId: ${result.data}, error: ${errorMessage}`
      );
      return NextResponse.json(
        { error: 'Failed to consume credits', taskId: result.data },
        { status: 500 }
      );
    }

    return NextResponse.json({ taskId: result.data }, { status: 200 });
  } catch (error) {
    console.error('视频生成请求异常:', error);
    return NextResponse.json(
      { error: 'Failed to trigger media task' },
      {
        status: 500,
      },
    );
  }
}
