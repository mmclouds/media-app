import { consumeCredits } from '@/credits/credits';
import { NextResponse } from 'next/server';

// Basic authentication middleware
function validateBasicAuth(request: Request): boolean {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false;
  }

  // Extract credentials from Authorization header
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString(
    'utf-8'
  );
  const [username, password] = credentials.split(':');

  // Validate against environment variables
  const expectedUsername = process.env.CRON_JOBS_USERNAME;
  const expectedPassword = process.env.CRON_JOBS_PASSWORD;

  if (!expectedUsername || !expectedPassword) {
    console.error(
      'Basic auth credentials not configured in environment variables'
    );
    return false;
  }

  return username === expectedUsername && password === expectedPassword;
}

/**
 * 消费用户积分
 * GET /api/custom/credits/consume?userId=xxx&amount=10&description=xxx
 */
export async function GET(request: Request) {
  // Validate basic authentication
  if (!validateBasicAuth(request)) {
    console.error('consume credits unauthorized');
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

  // Parse query parameters
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const amountStr = searchParams.get('amount');
  const description = searchParams.get('description');

  // Validate required parameters
  if (!userId) {
    return NextResponse.json(
      {
        successFlag: false,
        message: 'Missing required parameter: userId',
      },
      { status: 400 }
    );
  }

  if (!amountStr) {
    return NextResponse.json(
      {
        successFlag: false,
        message: 'Missing required parameter: amount',
      },
      { status: 400 }
    );
  }

  const amount = Number(amountStr);
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
      `route: consume credits start, userId: ${userId}, amount: ${amount}, description: ${description}`
    );

    await consumeCredits({
      userId,
      amount,
      description,
    });

    console.log(
      `route: consume credits success, userId: ${userId}, amount: ${amount}`
    );

    return NextResponse.json({
      successFlag: true,
      message: 'Credits consumed successfully',
      userId,
      amount,
      description,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error(
      `route: consume credits failed, userId: ${userId}, error: ${errorMessage}`
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
