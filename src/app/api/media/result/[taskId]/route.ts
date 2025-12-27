import { auth } from '@/lib/auth';
import { type NextRequest, NextResponse } from 'next/server';

const gatewayBaseUrl = process.env.AI_GATEWAY_URL;
const gatewayApiKey = process.env.AI_GATEWAY_API_KEY;

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ taskId?: string }> }
) {
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

  const params = await context.params;
  const taskId = params?.taskId;

  if (!taskId) {
    return NextResponse.json(
      { error: 'Task ID is required' },
      {
        status: 400,
      }
    );
  }

  const normalizedBaseUrl = gatewayBaseUrl.endsWith('/')
    ? gatewayBaseUrl.slice(0, -1)
    : gatewayBaseUrl;

  const targetUrl = `${normalizedBaseUrl}/api/v1/media/result/${encodeURIComponent(
    taskId
  )}`;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': gatewayApiKey,
      },
      cache: 'no-store',
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok || !payload?.success) {
      const errorMessage =
        payload?.message ?? `Failed to fetch media task (${response.status})`;

      console.error('查询媒体任务失败:', errorMessage, payload);

      return NextResponse.json(
        { error: errorMessage },
        {
          status: response.ok ? 502 : response.status,
        }
      );
    }
    console.log("原始响应报文是：",payload.data)
    return NextResponse.json(payload.data ?? null, { status: 200 });
  } catch (error) {
    console.error('媒体任务查询异常:', error);
    return NextResponse.json(
      { error: 'Failed to fetch task result' },
      {
        status: 500,
      }
    );
  }
}
