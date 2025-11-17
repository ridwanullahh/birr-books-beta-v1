import { NextResponse } from 'next/server';
import { getHomepageData } from '@/lib/homepage-service';

export async function GET() {
  try {
    const data = await getHomepageData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[v0] Homepage API error:', error);
    return NextResponse.json(
      { error: 'Failed to load homepage data' },
      { status: 500 }
    );
  }
}
