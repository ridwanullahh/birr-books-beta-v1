'use server';

import { SDK } from './sdk';

interface SearchFilters {
  query?: string;
  category?: string;
  author?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  language?: string;
  format?: string;
  availability?: string;
  sort?: 'newest' | 'price-asc' | 'price-desc' | 'popular' | 'rating' | 'a-z';
  page?: number;
  limit?: number;
}

interface SearchResult {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  price: number;
  salePrice?: number;
  rating: number;
  reviewCount: number;
  format: string;
  availability: string;
  discount?: number;
}

export async function searchBooks(filters: SearchFilters): Promise<{
  results: SearchResult[];
  total: number;
  page: number;
  pages: number;
}> {
  const sdk = SDK.getInstance();
  const limit = filters.limit || 12;
  const page = filters.page || 1;
  const skip = (page - 1) * limit;

  try {
    // Build query
    const whereClause: any = { type: 'book', active: true };

    if (filters.query) {
      whereClause.$or = [
        { title: { $regex: filters.query, $options: 'i' } },
        { description: { $regex: filters.query, $options: 'i' } },
        { author: { $regex: filters.query, $options: 'i' } }
      ];
    }

    if (filters.category) whereClause.category = filters.category;
    if (filters.author) whereClause.author = filters.author;
    if (filters.language) whereClause.language = filters.language;
    if (filters.format) whereClause.formats = { $in: [filters.format] };
    if (filters.rating) whereClause.rating = { $gte: filters.rating };

    if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
      whereClause.price = {};
      if (filters.priceMin !== undefined) whereClause.price.$gte = filters.priceMin;
      if (filters.priceMax !== undefined) whereClause.price.$lte = filters.priceMax;
    }

    if (filters.availability === 'in-stock') {
      whereClause.stock = { $gt: 0 };
    } else if (filters.availability === 'out-of-stock') {
      whereClause.stock = 0;
    }

    // Build sort
    let orderBy: any = { createdAt: 'desc' };
    if (filters.sort === 'price-asc') orderBy = { price: 'asc' };
    else if (filters.sort === 'price-desc') orderBy = { price: 'desc' };
    else if (filters.sort === 'popular') orderBy = { salesCount: 'desc' };
    else if (filters.sort === 'rating') orderBy = { rating: 'desc' };
    else if (filters.sort === 'a-z') orderBy = { title: 'asc' };

    // Execute query
    const [books, total] = await Promise.all([
      sdk.query('books', {
        where: whereClause,
        orderBy,
        skip,
        limit
      }),
      sdk.count('books', { where: whereClause })
    ]);

    const results: SearchResult[] = books.map((book: any) => ({
      id: book._id,
      title: book.title,
      author: book.author,
      coverImage: book.coverImage,
      price: book.price,
      salePrice: book.salePrice,
      rating: book.rating || 0,
      reviewCount: book.reviewCount || 0,
      format: book.formats?.[0] || 'PDF',
      availability: book.stock > 0 ? 'in-stock' : 'out-of-stock',
      discount: book.salePrice ? Math.round(((book.price - book.salePrice) / book.price) * 100) : undefined
    }));

    return {
      results,
      total,
      page,
      pages: Math.ceil(total / limit)
    };
  } catch (error) {
    console.error('[v0] Search error:', error);
    throw error;
  }
}

export async function getSearchSuggestions(query: string): Promise<string[]> {
  const sdk = SDK.getInstance();

  try {
    const books = await sdk.query('books', {
      where: {
        title: { $regex: query, $options: 'i' },
        active: true
      },
      limit: 5
    });

    return books.map((book: any) => book.title);
  } catch (error) {
    console.error('[v0] Suggestions error:', error);
    return [];
  }
}

export async function getFiltersOptions() {
  const sdk = SDK.getInstance();

  try {
    const [categories, authors, languages, formats] = await Promise.all([
      sdk.query('categories', { select: ['name', 'slug'] }),
      sdk.query('books', {
        select: ['author'],
        distinct: true
      }),
      sdk.query('books', {
        select: ['language'],
        distinct: true
      }),
      sdk.query('books', {
        select: ['formats'],
        distinct: true
      })
    ]);

    return {
      categories: categories.map((c: any) => ({ name: c.name, value: c.slug })),
      authors: authors.filter(Boolean).map((a: any) => ({ name: a, value: a })),
      languages: languages.filter(Boolean),
      formats: formats.filter(Boolean)
    };
  } catch (error) {
    console.error('[v0] Filters error:', error);
    return {
      categories: [],
      authors: [],
      languages: [],
      formats: []
    };
  }
}
