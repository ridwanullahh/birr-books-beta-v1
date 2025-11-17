import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth-service';
import { BirrError } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    const token = await AuthService.verifyEmail(email, otp);

    return NextResponse.json(
      {
        success: true,
        token,
        message: 'Email verified successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[API] Email verification error:', error);

    if (error instanceof BirrError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Verification failed' },
      { status: 500 }
    );
  }
}
