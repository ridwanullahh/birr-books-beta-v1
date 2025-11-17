import { NextRequest, NextResponse } from 'next/server';
import { getCategoryDetails } from '@/lib/category-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const category = await getCategoryDetails(params.slug);

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('[v0] Category API error:', error);
    return NextResponse.json(
      { error: 'Failed to load category' },
      { status: 500 }
    );
  }
}
