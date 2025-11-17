'use server';

import { SDK } from './sdk';
import { CacheManager } from './cache-manager';

interface FeaturedBook {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  price: number;
  salePrice?: number;
  rating: number;
  reviewCount: number;
  discount?: number;
}

interface DealProduct {
  id: string;
  title: string;
  coverImage: string;
  originalPrice: number;
  dealPrice: number;
  discountPercentage: number;
  expiresAt: Date;
}

interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  content: string;
  bookTitle: string;
}

interface HomepageData {
  featured: FeaturedBook[];
  newArrivals: FeaturedBook[];
  bestsellers: FeaturedBook[];
  todaysDeals: DealProduct[];
  testimonials: Testimonial[];
  stats: {
    booksAvailable: number;
    happyReaders: number;
    hoursLearned: number;
  };
  categories: Array<{
    name: string;
    slug: string;
    count: number;
    icon: string;
  }>;
}

export async function getHomepageData(): Promise<HomepageData> {
  const sdk = SDK.getInstance();
  const cache = CacheManager.getInstance();

  // Try cache first
  const cached = cache.get('homepage-data');
  if (cached) return cached as HomepageData;

  try {
    const [featured, newArrivals, bestsellers, deals, testimonials, categories] = await Promise.all([
      sdk.query('books', {
        where: { featured: true },
        limit: 8,
        orderBy: { createdAt: 'desc' }
      }),
      sdk.query('books', {
        limit: 8,
        orderBy: { createdAt: 'desc' }
      }),
      sdk.query('books', {
        orderBy: { salesCount: 'desc' },
        limit: 8
      }),
      sdk.query('deals', {
        where: { active: true, expiresAt: { $gt: new Date() } },
        limit: 6,
        orderBy: { discount: 'desc' }
      }),
      sdk.query('testimonials', {
        limit: 5,
        orderBy: { rating: 'desc', date: 'desc' }
      }),
      sdk.query('categories', {
        limit: 12,
        orderBy: { order: 'asc' }
      })
    ]);

    const stats = {
      booksAvailable: await sdk.count('books'),
      happyReaders: await sdk.count('users', { where: { purchaseCount: { $gt: 0 } } }),
      hoursLearned: 12500 // This could be calculated from user listening/reading stats
    };

    const data: HomepageData = {
      featured: formatBooks(featured),
      newArrivals: formatBooks(newArrivals),
      bestsellers: formatBooks(bestsellers),
      todaysDeals: formatDeals(deals),
      testimonials: testimonials as Testimonial[],
      stats,
      categories: formatCategories(categories)
    };

    // Cache for 1 hour
    cache.set('homepage-data', data, 3600);
    return data;
  } catch (error) {
    console.error('[v0] Homepage data fetch error:', error);
    throw error;
  }
}

function formatBooks(books: any[]): FeaturedBook[] {
  return books.map(book => ({
    id: book._id,
    title: book.title,
    author: book.author,
    coverImage: book.coverImage,
    price: book.price,
    salePrice: book.salePrice,
    rating: book.rating || 0,
    reviewCount: book.reviewCount || 0,
    discount: book.salePrice ? Math.round(((book.price - book.salePrice) / book.price) * 100) : undefined
  }));
}

function formatDeals(deals: any[]): DealProduct[] {
  return deals.map(deal => ({
    id: deal._id,
    title: deal.title,
    coverImage: deal.coverImage,
    originalPrice: deal.originalPrice,
    dealPrice: deal.dealPrice,
    discountPercentage: deal.discount,
    expiresAt: new Date(deal.expiresAt)
  }));
}

function formatCategories(categories: any[]) {
  return categories.map(cat => ({
    name: cat.name,
    slug: cat.slug,
    count: cat.bookCount || 0,
    icon: cat.icon || 'book'
  }));
}
