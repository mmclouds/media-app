import type { NextRequest } from 'next/server';

export { dynamic } from '@/app/api/gateway/[...slug]/route';
import { handleGatewayRequest } from '@/app/api/gateway/[...slug]/route';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ taskId?: string }> }
) {
  const params = await context.params;
  return handleGatewayRequest(request, {
    params: { slug: ['media', 'result', params.taskId ?? ''] },
  });
}
