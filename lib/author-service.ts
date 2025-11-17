'use server';

import { SDK } from './sdk';

export interface Author {
  id: string;
  name: string;
  biography: string;
  photo?: string;
  email?: string;
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    website?: string;
  };
  bookCount: number;
  audiobookCount: number;
  books: Array<{
    id: string;
    title: string;
    coverImage: string;
    price: number;
    rating: number;
  }>;
  audiobooks: Array<{
    id: string;
    title: string;
    coverImage: string;
    narrator: string;
    price: number;
    rating: number;
  }>;
}

export interface Narrator {
  id: string;
  name: string;
  biography: string;
  photo?: string;
  email?: string;
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  audiobookCount: number;
  audiobooks: Array<{
    id: string;
    title: string;
    author: string;
    coverImage: string;
    price: number;
    rating: number;
  }>;
}

export async function getAuthorDetails(authorId: string): Promise<Author | null> {
  const sdk = SDK.getInstance();

  try {
    const authors = await sdk.query('authors', {
      where: { _id: authorId }
    });

    if (!authors || authors.length === 0) return null;

    const author = authors[0];

    const [books, audiobooks] = await Promise.all([
      sdk.query('books', {
        where: { authorId },
        limit: 12,
        orderBy: { rating: 'desc' }
      }),
      sdk.query('audiobooks', {
        where: { authorId },
        limit: 12,
        orderBy: { rating: 'desc' }
      })
    ]);

    return {
      id: author._id,
      name: author.name,
      biography: author.biography,
      photo: author.photo,
      email: author.email,
      socialLinks: author.socialLinks,
      bookCount: await sdk.count('books', { where: { authorId } }),
      audiobookCount: await sdk.count('audiobooks', { where: { authorId } }),
      books: books.map((b: any) => ({
        id: b._id,
        title: b.title,
        coverImage: b.coverImage,
        price: b.price,
        rating: b.rating || 0
      })),
      audiobooks: audiobooks.map((a: any) => ({
        id: a._id,
        title: a.title,
        coverImage: a.coverImage,
        narrator: a.narrator,
        price: a.price,
        rating: a.rating || 0
      }))
    };
  } catch (error) {
    console.error('[v0] Failed to get author:', error);
    return null;
  }
}

export async function getNarratorDetails(narratorId: string): Promise<Narrator | null> {
  const sdk = SDK.getInstance();

  try {
    const narrators = await sdk.query('narrators', {
      where: { _id: narratorId }
    });

    if (!narrators || narrators.length === 0) return null;

    const narrator = narrators[0];

    const audiobooks = await sdk.query('audiobooks', {
      where: { narratorId },
      limit: 12,
      orderBy: { rating: 'desc' }
    });

    return {
      id: narrator._id,
      name: narrator.name,
      biography: narrator.biography,
      photo: narrator.photo,
      email: narrator.email,
      socialLinks: narrator.socialLinks,
      audiobookCount: audiobooks.length,
      audiobooks: audiobooks.map((a: any) => ({
        id: a._id,
        title: a.title,
        author: a.author,
        coverImage: a.coverImage,
        price: a.price,
        rating: a.rating || 0
      }))
    };
  } catch (error) {
    console.error('[v0] Failed to get narrator:', error);
    return null;
  }
}

export async function getAuthorsList(page = 1, limit = 12): Promise<{
  authors: Array<{ id: string; name: string; photo?: string; bookCount: number }>;
  total: number;
  pages: number;
}> {
  const sdk = SDK.getInstance();

  try {
    const skip = (page - 1) * limit;
    const [authors, total] = await Promise.all([
      sdk.query('authors', {
        skip,
        limit,
        orderBy: { bookCount: 'desc' }
      }),
      sdk.count('authors')
    ]);

    const withCounts = await Promise.all(
      authors.map(async (a: any) => ({
        id: a._id,
        name: a.name,
        photo: a.photo,
        bookCount: await sdk.count('books', { where: { authorId: a._id } })
      }))
    );

    return {
      authors: withCounts,
      total,
      pages: Math.ceil(total / limit)
    };
  } catch (error) {
    console.error('[v0] Failed to get authors list:', error);
    return { authors: [], total: 0, pages: 0 };
  }
}
