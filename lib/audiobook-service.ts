'use server';

import { SDK } from './sdk';

export interface Audiobook {
  id: string;
  title: string;
  author: string;
  narrator: string;
  coverImage: string;
  price: number;
  salePrice?: number;
  rating: number;
  reviewCount: number;
  duration: number; // minutes
  description: string;
  chapters: Array<{
    id: string;
    title: string;
    duration: number; // minutes
    fileUrl: string;
  }>;
  previewDuration?: number; // minutes
  previewUrl?: string;
}

export async function getAudiobookDetails(audiobookId: string): Promise<Audiobook | null> {
  const sdk = SDK.getInstance();

  try {
    const audiobooks = await sdk.query('audiobooks', {
      where: { _id: audiobookId }
    });

    if (!audiobooks || audiobooks.length === 0) return null;

    const audiobook = audiobooks[0];

    return {
      id: audiobook._id,
      title: audiobook.title,
      author: audiobook.author,
      narrator: audiobook.narrator,
      coverImage: audiobook.coverImage,
      price: audiobook.price,
      salePrice: audiobook.salePrice,
      rating: audiobook.rating || 0,
      reviewCount: audiobook.reviewCount || 0,
      duration: audiobook.duration,
      description: audiobook.description,
      chapters: audiobook.chapters || [],
      previewDuration: 3, // 3 minutes
      previewUrl: audiobook.previewUrl
    };
  } catch (error) {
    console.error('[v0] Failed to get audiobook:', error);
    return null;
  }
}
