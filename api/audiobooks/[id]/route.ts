import { NextRequest, NextResponse } from 'next/server';
import { getAudiobookDetails } from '@/lib/audiobook-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const audiobook = await getAudiobookDetails(params.id);

    if (!audiobook) {
      return NextResponse.json(
        { error: 'Audiobook not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(audiobook);
  } catch (error) {
    console.error('[v0] Audiobook API error:', error);
    return NextResponse.json(
      { error: 'Failed to load audiobook' },
      { status: 500 }
    );
  }
}
