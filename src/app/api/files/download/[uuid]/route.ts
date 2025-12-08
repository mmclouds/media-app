import { auth } from '@/lib/auth';
import { type NextRequest, NextResponse } from 'next/server';

const gatewayBaseUrl = process.env.AI_GATEWAY_URL;
const defaultTenantId = process.env.NEXT_PUBLIC_TENANT_ID || '0';

const normalizeBaseUrl = (base?: string) =>
  base?.endsWith('/') ? base.slice(0, -1) : base ?? '';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  const { uuid } = await params;

  if (!uuid) {
    return NextResponse.json({ error: 'File uuid is required' }, { status: 400 });
  }

  if (!gatewayBaseUrl) {
    return NextResponse.json(
      { error: 'AI gateway URL is not configured' },
      { status: 500 }
    );
  }

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      {
        status: 401,
      }
    );
  }

  const requestUrl = new URL(request.url);
  const tenantId = requestUrl.searchParams.get('tenantId') || defaultTenantId;
  const userId = session.user.id;

  const normalizedBaseUrl = normalizeBaseUrl(gatewayBaseUrl);
  const targetUrl = `${normalizedBaseUrl}/api/public/files/download/${encodeURIComponent(
    uuid
  )}?tenantId=${encodeURIComponent(tenantId)}&userId=${encodeURIComponent(userId)}`;

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      const message =
        (data as { message?: string } | null)?.message ??
        `Failed to download file (${response.status})`;
      console.error('网关文件下载失败', message, data);
      return NextResponse.json({ error: message }, { status: response.status });
    }

    const headers = new Headers();
    const contentType = response.headers.get('content-type');
    const contentLength = response.headers.get('content-length');
    const disposition = response.headers.get('content-disposition');

    if (contentType) headers.set('content-type', contentType);
    if (contentLength) headers.set('content-length', contentLength);
    if (disposition) headers.set('content-disposition', disposition);

    return new Response(response.body, {
      status: response.status,
      headers,
    });
  } catch (error) {
    console.error('转发文件下载异常', error);
    return NextResponse.json(
      { error: 'Failed to download file via gateway' },
      { status: 500 }
    );
  }
}
