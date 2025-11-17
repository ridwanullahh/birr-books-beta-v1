import { NextRequest, NextResponse } from 'next/server';
import { getBookDetails } from '@/lib/book-detail-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const book = await getBookDetails(params.id);
    
    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(book);
  } catch (error) {
    console.error('[v0] Book detail API error:', error);
    return NextResponse.json(
      { error: 'Failed to load book' },
      { status: 500 }
    );
  }
}
