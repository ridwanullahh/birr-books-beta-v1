'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { BottomNav } from '@/components/shared/bottom-nav';
import { Button } from '@/components/ui/button';
import { ShoppingCart, BookOpen, Star, Gift } from 'lucide-react';
import { BRAND_COLORS } from '@/lib/constants';

interface SeriesBook {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  seriesNumber: number;
  price: number;
  salePrice?: number;
  rating: number;
  format: string;
}

interface SeriesDetail {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  author: string;
  bookCount: number;
  totalPrice: number;
  bundlePrice: number;
  bundleDiscount: number;
  books: SeriesBook[];
}

export default function SeriesDetailPage() {
  const params = useParams();
  const seriesId = params.id as string;

  const [series, setSeries] = useState<SeriesDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBooks, setSelectedBooks] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadSeries = async () => {
      try {
        const response = await fetch(`/api/series/${seriesId}`);
        const data = await response.json();
        setSeries(data);
        // Select all books by default for bundle
        const allBookIds = new Set(data.books.map((b: SeriesBook) => b.id));
        setSelectedBooks(allBookIds);
      } catch (error) {
        console.error('[v0] Failed to load series:', error);
      } finally {
        setLoading(false);
      }
    };

    if (seriesId) loadSeries();
  }, [seriesId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!series) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-dark mb-4">Series not found</h1>
            <Link href="/series" className="text-green">Back to series</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const toggleBook = (bookId: string) => {
    const newSelected = new Set(selectedBooks);
    if (newSelected.has(bookId)) {
      newSelected.delete(bookId);
    } else {
      newSelected.add(bookId);
    }
    setSelectedBooks(newSelected);
  };

  const selectedTotal = series.books
    .filter(b => selectedBooks.has(b.id))
    .reduce((sum, b) => sum + (b.salePrice || b.price), 0);
  const selectedBundlePrice = selectedTotal * 0.85;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pb-16 md:pb-0 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="grid gap-8 md:grid-cols-3 mb-12">
          {/* Cover */}
          <div className="md:col-span-1">
            <img
              src={series.coverImage || '/placeholder.svg'}
              alt={series.name}
              className="w-full rounded-lg shadow-elevation-4"
              width={300}
              height={400}
            />
          </div>

          {/* Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-6 h-6" style={{ color: BRAND_COLORS.PRIMARY_GREEN }} />
              <span className="text-sm font-semibold text-green">SERIES</span>
            </div>

            <h1 className="text-4xl font-bold text-dark mb-2">{series.name}</h1>
            <p className="text-xl text-gray mb-6">by {series.author}</p>

            <p className="text-gray mb-8 leading-relaxed max-w-2xl">
              {series.description}
            </p>

            {/* Bundle Info */}
            <div
              className="p-6 rounded-lg mb-6"
              style={{ backgroundColor: BRAND_COLORS.MINTED_GLOW }}
            >
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray mb-1">Total Books</p>
                  <p className="text-2xl font-bold text-dark">{series.bookCount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray mb-1">Regular Price</p>
                  <p className="text-2xl font-bold text-dark">${series.totalPrice.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray mb-1">Bundle Price</p>
                  <div className="flex items-end gap-2">
                    <p className="text-2xl font-bold text-dark">${series.bundlePrice.toFixed(2)}</p>
                    <span
                      className="px-3 py-1 rounded text-white text-sm font-bold mb-1"
                      style={{ backgroundColor: BRAND_COLORS.PRIMARY_GREEN }}
                    >
                      Save {series.bundleDiscount}%
                    </span>
                  </div>
                </div>
              </div>

              <Button
                className="w-full text-white flex items-center justify-center gap-2 py-6"
                style={{ backgroundColor: BRAND_COLORS.PRIMARY_GREEN }}
              >
                <ShoppingCart className="w-5 h-5" />
                Add Complete Series to Cart - ${series.bundlePrice.toFixed(2)}
              </Button>
            </div>
          </div>
        </div>

        {/* Books in Series */}
        <section className="py-12 border-t">
          <h2 className="text-2xl font-bold text-dark mb-6">Books in This Series</h2>

          <div className="space-y-3 mb-8">
            {series.books.map(book => (
              <div
                key={book.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:shadow-elevation-2 transition"
              >
                <div className="flex items-center gap-4 flex-1">
                  <img
                    src={book.coverImage || '/placeholder.svg'}
                    alt={book.title}
                    className="w-16 h-24 object-cover rounded"
                    width={64}
                    height={96}
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray mb-1">Book {book.seriesNumber}</p>
                    <h3 className="font-semibold text-dark mb-1">{book.title}</h3>
                    <div className="flex items-center gap-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3"
                          fill={i < Math.round(book.rating) ? BRAND_COLORS.PRIMARY_GREEN : '#e5e7eb'}
                          color={i < Math.round(book.rating) ? BRAND_COLORS.PRIMARY_GREEN : '#e5e7eb'}
                        />
                      ))}
                      <span className="text-xs text-gray">{book.format}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right ml-4">
                  <p className="font-bold text-dark">
                    ${book.salePrice || book.price}
                  </p>
                  {book.salePrice && (
                    <p className="text-xs text-gray line-through">
                      ${book.price}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => toggleBook(book.id)}
                  className={`ml-4 px-4 py-2 rounded font-semibold transition ${
                    selectedBooks.has(book.id)
                      ? 'text-white'
                      : 'border-2'
                  }`}
                  style={{
                    backgroundColor: selectedBooks.has(book.id) ? BRAND_COLORS.PRIMARY_GREEN : 'transparent',
                    borderColor: selectedBooks.has(book.id) ? BRAND_COLORS.PRIMARY_GREEN : '#e5e7eb',
                    color: selectedBooks.has(book.id) ? 'white' : BRAND_COLORS.PRIMARY_GREEN
                  }}
                >
                  {selectedBooks.has(book.id) ? 'Selected' : 'Select'}
                </button>
              </div>
            ))}
          </div>

          {/* Custom Bundle */}
          {selectedBooks.size !== series.bookCount && (
            <div
              className="p-4 rounded-lg"
              style={{ backgroundColor: BRAND_COLORS.MINTED_GLOW }}
            >
              <p className="text-sm text-gray mb-3">
                You have selected {selectedBooks.size} of {series.bookCount} books
              </p>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray">Custom Bundle Price</p>
                  <p className="text-2xl font-bold text-dark">${selectedBundlePrice.toFixed(2)}</p>
                </div>
                <Button
                  className="text-white flex items-center gap-2"
                  style={{ backgroundColor: BRAND_COLORS.PRIMARY_GREEN }}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add Selected to Cart
                </Button>
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
