'use server';

import { SDK } from './sdk';

export interface BookDetail {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  publisher?: string;
  isbn?: string;
  publicationDate?: Date;
  language: string;
  coverImage: string;
  galleryImages: string[];
  price: number;
  salePrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  description: string;
  shortDescription: string;
  tableOfContents?: string;
  formats: string[];
  category: string;
  subcategory?: string;
  pages: number;
  fileSize?: string;
  availability: string;
  stock: number;
  series?: {
    name: string;
    number: number;
  };
}

export interface Review {
  id: string;
  bookId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  content: string;
  date: Date;
  helpful: number;
  verified: boolean;
}

export async function getBookDetails(bookId: string): Promise<BookDetail | null> {
  const sdk = SDK.getInstance();

  try {
    const book = await sdk.query('books', {
      where: { _id: bookId }
    });

    if (!book || book.length === 0) return null;

    const bookData = book[0];

    return {
      id: bookData._id,
      title: bookData.title,
      subtitle: bookData.subtitle,
      author: bookData.author,
      publisher: bookData.publisher,
      isbn: bookData.isbn,
      publicationDate: bookData.publicationDate,
      language: bookData.language,
      coverImage: bookData.coverImage,
      galleryImages: bookData.galleryImages || [bookData.coverImage],
      price: bookData.price,
      salePrice: bookData.salePrice,
      discount: bookData.salePrice ? Math.round(((bookData.price - bookData.salePrice) / bookData.price) * 100) : undefined,
      rating: bookData.rating || 0,
      reviewCount: bookData.reviewCount || 0,
      description: bookData.description,
      shortDescription: bookData.shortDescription,
      tableOfContents: bookData.tableOfContents,
      formats: bookData.formats || ['PDF'],
      category: bookData.category,
      subcategory: bookData.subcategory,
      pages: bookData.pages || 0,
      fileSize: bookData.fileSize,
      availability: bookData.stock > 0 ? 'in-stock' : 'out-of-stock',
      stock: bookData.stock,
      series: bookData.series
    };
  } catch (error) {
    console.error('[v0] Failed to get book details:', error);
    return null;
  }
}

export async function getBookReviews(bookId: string, page = 1, limit = 10): Promise<{
  reviews: Review[];
  total: number;
  average: number;
  distribution: Record<number, number>;
}> {
  const sdk = SDK.getInstance();

  try {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      sdk.query('reviews', {
        where: { bookId, approved: true },
        orderBy: { date: 'desc', helpful: 'desc' },
        skip,
        limit
      }),
      sdk.count('reviews', { where: { bookId, approved: true } })
    ]);

    // Calculate distribution
    const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    const allReviews = await sdk.query('reviews', {
      where: { bookId, approved: true },
      select: ['rating']
    });

    allReviews.forEach((r: any) => {
      distribution[r.rating]++;
    });

    const average = allReviews.length > 0
      ? (allReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / allReviews.length)
      : 0;

    return {
      reviews: reviews.map((r: any) => ({
        id: r._id,
        bookId: r.bookId,
        userId: r.userId,
        userName: r.userName,
        userAvatar: r.userAvatar,
        rating: r.rating,
        title: r.title,
        content: r.content,
        date: new Date(r.date),
        helpful: r.helpful || 0,
        verified: r.verified || false
      })),
      total,
      average,
      distribution
    };
  } catch (error) {
    console.error('[v0] Failed to get reviews:', error);
    return { reviews: [], total: 0, average: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
  }
}

export async function submitBookReview(
  bookId: string,
  userId: string,
  review: { title: string; content: string; rating: number }
): Promise<{ success: boolean; message: string }> {
  const sdk = SDK.getInstance();

  try {
    // Check if user already reviewed
    const existing = await sdk.query('reviews', {
      where: { bookId, userId }
    });

    if (existing.length > 0) {
      return { success: false, message: 'You have already reviewed this book' };
    }

    // Create review
    await sdk.create('reviews', {
      bookId,
      userId,
      userName: 'User', // Should come from user profile
      rating: review.rating,
      title: review.title,
      content: review.content,
      date: new Date(),
      approved: false, // Needs admin approval
      helpful: 0
    });

    return { success: true, message: 'Review submitted successfully' };
  } catch (error) {
    console.error('[v0] Failed to submit review:', error);
    return { success: false, message: 'Failed to submit review' };
  }
}

export async function getRelatedBooks(bookId: string, category: string, limit = 4): Promise<BookDetail[]> {
  const sdk = SDK.getInstance();

  try {
    const books = await sdk.query('books', {
      where: {
        category,
        _id: { $ne: bookId },
        active: true
      },
      limit,
      orderBy: { rating: 'desc' }
    });

    return books.map((b: any) => ({
      id: b._id,
      title: b.title,
      author: b.author,
      coverImage: b.coverImage,
      price: b.price,
      salePrice: b.salePrice,
      rating: b.rating || 0,
      reviewCount: b.reviewCount || 0,
      discount: b.salePrice ? Math.round(((b.price - b.salePrice) / b.price) * 100) : undefined,
      description: b.description,
      shortDescription: b.shortDescription,
      formats: b.formats || ['PDF'],
      language: b.language,
      category: b.category,
      pages: b.pages || 0,
      availability: b.stock > 0 ? 'in-stock' : 'out-of-stock',
      stock: b.stock,
      galleryImages: [b.coverImage],
      publisher: b.publisher
    }));
  } catch (error) {
    console.error('[v0] Failed to get related books:', error);
    return [];
  }
}
