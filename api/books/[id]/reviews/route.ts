import { NextRequest, NextResponse } from 'next/server';
import { getBookReviews } from '@/lib/book-detail-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;

    const result = await getBookReviews(params.id, page, limit);
    return NextResponse.json(result);
  } catch (error) {
    console.error('[v0] Reviews API error:', error);
    return NextResponse.json(
      { error: 'Failed to load reviews' },
      { status: 500 }
    );
  }
}
