import { refundCredits } from '@/credits/credits';
import { NextResponse } from 'next/server';

// Basic 认证校验
function validateBasicAuth(request: Request): boolean {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false;
  }

  // 从 Authorization 头解析凭据
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString(
    'utf-8'
  );
  const [username, password] = credentials.split(':');

  // 校验环境变量中的凭据
  const expectedUsername = process.env.CRON_JOBS_USERNAME;
  const expectedPassword = process.env.CRON_JOBS_PASSWORD;

  if (!expectedUsername || !expectedPassword) {
    console.error('Basic 认证凭据未在环境变量中配置');
    return false;
  }

  return username === expectedUsername && password === expectedPassword;
}

/**
 * 返还用户积分
 * POST /api/custom/credits/refund
 * Body: { userId: string, amount: number, description: string }
 */
export async function POST(request: Request) {
  // 校验 Basic 认证
  if (!validateBasicAuth(request)) {
    console.error('返还积分未授权');
    return new NextResponse(
      JSON.stringify({
        successFlag: false,
        message: 'Unauthorized',
      }),
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'WWW-Authenticate': 'Basic realm="Secure Area"',
        },
      }
    );
  }

  // 解析请求体
  let body: { userId?: string; amount?: number; description?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        successFlag: false,
        message: 'Invalid JSON body',
      },
      { status: 400 }
    );
  }

  const { userId, amount, description } = body;

  // 校验必填参数
  if (!userId) {
    return NextResponse.json(
      {
        successFlag: false,
        message: 'Missing required parameter: userId',
      },
      { status: 400 }
    );
  }

  if (amount === undefined || amount === null) {
    return NextResponse.json(
      {
        successFlag: false,
        message: 'Missing required parameter: amount',
      },
      { status: 400 }
    );
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json(
      {
        successFlag: false,
        message: 'Invalid amount: must be a positive number',
      },
      { status: 400 }
    );
  }

  if (!description) {
    return NextResponse.json(
      {
        successFlag: false,
        message: 'Missing required parameter: description',
      },
      { status: 400 }
    );
  }

  try {
    console.log(
      `route: 开始返还积分, userId: ${userId}, amount: ${amount}, description: ${description}`
    );

    await refundCredits({
      userId,
      amount,
      description,
    });

    console.log(`route: 返还积分成功, userId: ${userId}, amount: ${amount}`);

    return NextResponse.json({
      successFlag: true,
      message: 'Credits refunded successfully',
      userId,
      amount,
      description,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error(
      `route: 返还积分失败, userId: ${userId}, error: ${errorMessage}`
    );

    return NextResponse.json(
      {
        successFlag: false,
        message: errorMessage,
        userId,
        amount,
        description,
      },
      { status: 400 }
    );
  }
}
