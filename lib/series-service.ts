'use server';

import { SDK } from './sdk';

export interface Series {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  authorId: string;
  author: string;
  bookCount: number;
  totalPrice: number;
  bundlePrice: number;
  bundleDiscount: number;
  books: Array<{
    id: string;
    title: string;
    author: string;
    coverImage: string;
    seriesNumber: number;
    price: number;
    salePrice?: number;
    rating: number;
    format: string;
  }>;
}

export async function getSeriesDetails(seriesId: string): Promise<Series | null> {
  const sdk = SDK.getInstance();

  try {
    const series = await sdk.query('series', {
      where: { _id: seriesId }
    });

    if (!series || series.length === 0) return null;

    const seriesData = series[0];
    
    // Get books in series
    const books = await sdk.query('books', {
      where: { seriesId },
      orderBy: { seriesNumber: 'asc' }
    });

    const totalPrice = books.reduce((sum: number, b: any) => sum + (b.salePrice || b.price), 0);
    const bundlePrice = totalPrice * 0.85; // 15% bundle discount
    const bundleDiscount = Math.round(((totalPrice - bundlePrice) / totalPrice) * 100);

    return {
      id: seriesData._id,
      name: seriesData.name,
      description: seriesData.description,
      coverImage: seriesData.coverImage,
      authorId: seriesData.authorId,
      author: seriesData.author,
      bookCount: books.length,
      totalPrice,
      bundlePrice,
      bundleDiscount,
      books: books.map((b: any) => ({
        id: b._id,
        title: b.title,
        author: b.author,
        coverImage: b.coverImage,
        seriesNumber: b.seriesNumber,
        price: b.price,
        salePrice: b.salePrice,
        rating: b.rating || 0,
        format: b.formats?.[0] || 'PDF'
      }))
    };
  } catch (error) {
    console.error('[v0] Failed to get series:', error);
    return null;
  }
}

export async function getSeriesList(page = 1, limit = 12): Promise<{
  series: Series[];
  total: number;
  pages: number;
}> {
  const sdk = SDK.getInstance();

  try {
    const skip = (page - 1) * limit;
    const [series, total] = await Promise.all([
      sdk.query('series', {
        skip,
        limit,
        orderBy: { createdAt: 'desc' }
      }),
      sdk.count('series')
    ]);

    const seriesWithBooks = await Promise.all(
      series.map(async (s: any) => {
        const books = await sdk.query('books', {
          where: { seriesId: s._id },
          orderBy: { seriesNumber: 'asc' }
        });

        const totalPrice = books.reduce((sum: number, b: any) => sum + (b.salePrice || b.price), 0);
        const bundlePrice = totalPrice * 0.85;

        return {
          id: s._id,
          name: s.name,
          description: s.description,
          coverImage: s.coverImage,
          authorId: s.authorId,
          author: s.author,
          bookCount: books.length,
          totalPrice,
          bundlePrice,
          bundleDiscount: Math.round(((totalPrice - bundlePrice) / totalPrice) * 100),
          books: books.slice(0, 3)
        };
      })
    );

    return {
      series: seriesWithBooks,
      total,
      pages: Math.ceil(total / limit)
    };
  } catch (error) {
    console.error('[v0] Failed to get series list:', error);
    return { series: [], total: 0, pages: 0 };
  }
}
