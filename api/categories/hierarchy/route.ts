import { NextResponse } from 'next/server';
import { getCategoryHierarchy } from '@/lib/category-service';

export async function GET() {
  try {
    const hierarchy = await getCategoryHierarchy();
    return NextResponse.json(hierarchy);
  } catch (error) {
    console.error('[v0] Category hierarchy API error:', error);
    return NextResponse.json(
      { error: 'Failed to load categories' },
      { status: 500 }
    );
  }
}
