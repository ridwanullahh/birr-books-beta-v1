import { NextRequest, NextResponse } from 'next/server';
import { getAuthorsList } from '@/lib/author-service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 12;

    const result = await getAuthorsList(page, limit);
    return NextResponse.json(result);
  } catch (error) {
    console.error('[v0] Authors list API error:', error);
    return NextResponse.json(
      { error: 'Failed to load authors' },
      { status: 500 }
    );
  }
}
