import { NextRequest, NextResponse } from 'next/server';
import { SDK } from '@/lib/sdk';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email address' },
        { status: 400 }
      );
    }

    const sdk = SDK.getInstance();

    // Check if already subscribed
    const existing = await sdk.query('newsletter_subscribers', {
      where: { email }
    });

    if (existing.length > 0) {
      return NextResponse.json(
        { message: 'Email already subscribed' },
        { status: 400 }
      );
    }

    // Add to newsletter
    await sdk.create('newsletter_subscribers', {
      email,
      subscribedAt: new Date(),
      status: 'active'
    });

    // Send welcome email
    // TODO: Integrate with email service

    return NextResponse.json(
      { message: 'Successfully subscribed to newsletter' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Newsletter subscribe error:', error);
    return NextResponse.json(
      { message: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}
