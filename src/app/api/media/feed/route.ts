import { auth } from '@/lib/auth';
import { type NextRequest, NextResponse } from 'next/server';

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;
const DEFAULT_MEDIA_TYPES = 'VIDEO';
const DEFAULT_SORT = 'desc';

const gatewayBaseUrl = process.env.AI_GATEWAY_URL;
const gatewayApiKey = process.env.AI_GATEWAY_API_KEY;

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
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

  const requestUrl = new URL(request.url);
  const { searchParams } = requestUrl;

  const rawLimit = Number(searchParams.get('limit'));
  const limit = Number.isFinite(rawLimit)
    ? Math.min(Math.max(rawLimit, 1), MAX_LIMIT)
    : DEFAULT_LIMIT;

  const cursor = searchParams.get('cursor') ?? undefined;
  const sortParam = searchParams.get('sort')?.toLowerCase();
  const sort =
    sortParam === 'asc' || sortParam === 'desc' ? sortParam : DEFAULT_SORT;
  const mediaTypes = searchParams.get('mediaTypes') ?? DEFAULT_MEDIA_TYPES;
  const startTime = searchParams.get('startTime') ?? undefined;
  const endTime = searchParams.get('endTime') ?? undefined;

  const outgoingParams = new URLSearchParams();
  outgoingParams.set('userId', userId);
  outgoingParams.set('limit', String(limit));
  outgoingParams.set('sort', sort);
  outgoingParams.set('mediaTypes', mediaTypes);

  if (cursor) {
    outgoingParams.set('cursor', cursor);
  }

  if (startTime) {
    outgoingParams.set('startTime', startTime);
  }

  if (endTime) {
    outgoingParams.set('endTime', endTime);
  }

  const normalizedBaseUrl = gatewayBaseUrl.endsWith('/')
    ? gatewayBaseUrl.slice(0, -1)
    : gatewayBaseUrl;

  const targetUrl = `${normalizedBaseUrl}/api/v1/media/feed/cursor?${outgoingParams.toString()}`;

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
        payload?.message ?? `Failed to fetch media feed (${response.status})`;

      console.error('媒体 Feed 接口错误:', errorMessage, payload);

      return NextResponse.json(
        { error: errorMessage },
        {
          status: response.ok ? 502 : response.status,
        }
      );
    }

    return NextResponse.json(payload.data, { status: 200 });
  } catch (error) {
    console.error('媒体 Feed 请求异常:', error);
    return NextResponse.json(
      { error: 'Failed to fetch media feed' },
      {
        status: 500,
      }
    );
  }
}
