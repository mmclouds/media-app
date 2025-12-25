import { auth } from '@/lib/auth';
import { type NextRequest, NextResponse } from 'next/server';

const gatewayBaseUrl = process.env.AI_GATEWAY_URL;
const gatewayApiKey = process.env.AI_GATEWAY_API_KEY;
const defaultBucket = process.env.NEXT_PUBLIC_UPLOAD_BUCKET || '0-image';

const normalizeBaseUrl = (base?: string) =>
  base?.endsWith('/') ? base.slice(0, -1) : (base ?? '');

export const dynamic = 'force-dynamic';

/**
 * 相应示例
 * {
    "uuid": "7a5835c3-ff6b-40ab-9f7a-6abf60ed62af",
    "storageType": "S3",
    "bucketName": "0-image",
    "objectKey": "7a5835c3-ff6b-40ab-9f7a-6abf60ed62af",
    "fileSize": 3389722,
    "etag": "\"f95e6279f329f456aae8e13fd3c5e0d3\"",
    "success": true
}
 * @param request 
 * @returns 
 */
export async function POST(request: NextRequest) {
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
  const userId = session.user.id;

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

  const normalizedBaseUrl = normalizeBaseUrl(gatewayBaseUrl);
  const uploadParams = new URLSearchParams();
  uploadParams.set('userId', userId);
  const targetUrl = `${normalizedBaseUrl}/api/files/upload?${uploadParams.toString()}`;

  try {
    const headers = new Headers();
    headers.set('X-API-Key', gatewayApiKey);

    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      headers.set('authorization', authHeader);
    }
    const cookie = request.headers.get('cookie');
    if (cookie) {
      headers.set('cookie', cookie);
    }

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers,
      body: formData,
      cache: 'no-store',
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      const message =
        (payload as { message?: string } | null)?.message ??
        `Failed to upload file (${response.status})`;
      console.error('网关文件上传失败', message, payload);
      return NextResponse.json({ error: message }, { status: response.status });
    }

    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    console.error('转发文件上传异常', error);
    return NextResponse.json(
      { error: 'Failed to upload file via gateway' },
      { status: 500 }
    );
  }
}
