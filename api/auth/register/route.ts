import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth-service';
import { ValidationError, BirrError } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    const user = await AuthService.register(email, password, name);

    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful. Please verify your email.',
        user,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[API] Registration error:', error);

    if (error instanceof ValidationError || error instanceof BirrError) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Registration failed' },
      { status: 500 }
    );
  }
}
