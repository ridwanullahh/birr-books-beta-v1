import { NextRequest, NextResponse } from 'next/server';
import { getSeriesDetails } from '@/lib/series-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const series = await getSeriesDetails(params.id);

    if (!series) {
      return NextResponse.json(
        { error: 'Series not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(series);
  } catch (error) {
    console.error('[v0] Series API error:', error);
    return NextResponse.json(
      { error: 'Failed to load series' },
      { status: 500 }
    );
  }
}
