import { NextRequest, NextResponse } from 'next/server';
import { getAuthorDetails } from '@/lib/author-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const author = await getAuthorDetails(params.id);

    if (!author) {
      return NextResponse.json(
        { error: 'Author not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(author);
  } catch (error) {
    console.error('[v0] Author API error:', error);
    return NextResponse.json(
      { error: 'Failed to load author' },
      { status: 500 }
    );
  }
}
