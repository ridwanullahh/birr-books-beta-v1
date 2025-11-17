import { NextRequest, NextResponse } from 'next/server';
import { searchBooks } from '@/lib/search-service';

export async function POST(request: NextRequest) {
  try {
    const filters = await request.json();
    const results = await searchBooks(filters);
    return NextResponse.json(results);
  } catch (error) {
    console.error('[v0] Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to search books' },
      { status: 500 }
    );
  }
}
