import type { NextRequest } from 'next/server';

export { dynamic } from '@/app/api/gateway/[...slug]/route';
import { handleGatewayRequest } from '@/app/api/gateway/[...slug]/route';

export const GET = (request: NextRequest) =>
  handleGatewayRequest(request, { params: { slug: ['media', 'feed'] } });
