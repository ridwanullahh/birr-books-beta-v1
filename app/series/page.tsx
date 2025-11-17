'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { BottomNav } from '@/components/shared/bottom-nav';
import { Button } from '@/components/ui/button';
import { ShoppingCart, BookOpen } from 'lucide-react';
import { BRAND_COLORS } from '@/lib/constants';

interface SeriesSummary {
  id: string;
  name: string;
  author: string;
  coverImage: string;
  bookCount: number;
  totalPrice: number;
  bundlePrice: number;
  bundleDiscount: number;
}

export default function SeriesPage() {
  const [seriesList, setSeriesList] = useState<SeriesSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);

  useEffect(() => {
    const loadSeries = async () => {
      try {
        const response = await fetch(`/api/series?page=${currentPage}`);
        const data = await response.json();
        setSeriesList(data.series);
        setTotal(data.total);
        setPages(data.pages);
      } catch (error) {
        console.error('[v0] Failed to load series:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSeries();
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pb-16 md:pb-0 max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-dark mb-2">Book Series</h1>
          <p className="text-lg text-gray">Discover complete series collections at special bundle prices</p>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : seriesList.length > 0 ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {seriesList.map(series => (
                <Link
                  key={series.id}
                  href={`/series/${series.id}`}
                  className="group rounded-lg overflow-hidden shadow-elevation-2 hover:shadow-elevation-4 transition bg-white"
                >
                  {/* Cover */}
                  <div className="relative h-64 bg-gray-200 overflow-hidden">
                    <img
                      src={series.coverImage || '/placeholder.svg'}
                      alt={series.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition"
                      width={300}
                      height={400}
                    />
                    <div
                      className="absolute top-4 right-4 rounded px-3 py-1 text-white text-sm font-semibold flex items-center gap-1"
                      style={{ backgroundColor: BRAND_COLORS.PRIMARY_GREEN }}
                    >
                      <BookOpen className="w-4 h-4" />
                      {series.bookCount} Books
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-dark line-clamp-2 group-hover:text-green transition">
                      {series.name}
                    </h3>
                    <p className="text-sm text-gray mb-3">{series.author}</p>

                    {/* Pricing */}
                    <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: BRAND_COLORS.MINTED_GLOW }}>
                      <p className="text-xs text-gray mb-1">Bundle Price</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-dark">
                          ${series.bundlePrice.toFixed(2)}
                        </span>
                        <span className="text-xs text-gray line-through">
                          ${series.totalPrice.toFixed(2)}
                        </span>
                        <span
                          className="ml-auto px-2 py-1 rounded text-xs font-bold text-white"
                          style={{ backgroundColor: BRAND_COLORS.PRIMARY_GREEN }}
                        >
                          Save {series.bundleDiscount}%
                        </span>
                      </div>
                    </div>

                    <Button
                      className="w-full text-white flex items-center justify-center gap-2"
                      style={{ backgroundColor: BRAND_COLORS.PRIMARY_GREEN }}
                      onClick={e => {
                        e.preventDefault();
                        console.log('[v0] Add series to cart:', series.id);
                      }}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add Bundle
                    </Button>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-8 pb-4">
              <Button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                variant="outline"
              >
                Previous
              </Button>
              <span className="px-4 py-2">{currentPage} of {pages}</span>
              <Button
                onClick={() => setCurrentPage(Math.min(pages, currentPage + 1))}
                disabled={currentPage === pages}
                className="text-white"
                style={{ backgroundColor: BRAND_COLORS.PRIMARY_GREEN }}
              >
                Next
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray mb-4">No series found</p>
            <Link href="/books" className="text-green">Browse books instead</Link>
          </div>
        )}
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
