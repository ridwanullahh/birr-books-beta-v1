import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth-service';
import { BirrError } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const result = await AuthService.login(email, password);

    if (result.otpRequired) {
      return NextResponse.json(
        {
          success: true,
          otpRequired: true,
          message: 'OTP sent to your email. Please verify.',
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        token: result.token,
        message: 'Login successful',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[API] Login error:', error);

    if (error instanceof BirrError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}
