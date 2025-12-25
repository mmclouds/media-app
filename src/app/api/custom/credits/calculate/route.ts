import { calculateCredits } from '@/custom/credits/pricing';
import { NextResponse } from 'next/server';

/**
 * 积分计算接口
 * POST /api/custom/credits/calculate
 *
 * 入参与 /api/media/generate 保持一致，直接透传请求体
 */
export async function POST(request: Request) {
  // 解析请求体
  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: 'Invalid JSON body',
      },
      { status: 400 }
    );
  }

  // 检查 model 参数
  if (typeof payload.model !== 'string' || payload.model.trim().length === 0) {
    return NextResponse.json(
      {
        success: false,
        message: 'Missing required parameter: model',
      },
      { status: 400 }
    );
  }

  // 计算积分
  const result = calculateCredits(payload);

  if (!result) {
    return NextResponse.json(
      {
        success: false,
        message: 'No matching pricing rule found',
      },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    data: result,
  });
}
