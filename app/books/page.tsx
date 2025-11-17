'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { BottomNav } from '@/components/shared/bottom-nav';
import { FilterSidebar } from '@/components/books/filter-sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Star, Filter, LayoutGrid, List, Search, Heart, ShoppingCart } from 'lucide-react';
import { BRAND_COLORS } from '@/lib/constants';

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

export default function BooksPage() {
  const searchParams = useSearchParams();
  const [books, setBooks] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);

  const loadBooks = async (filters: any = {}) => {
    setLoading(true);
    try {
      const response = await fetch('/api/books/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          sort: sortBy,
          page: currentPage,
          limit: 12,
          ...filters
        })
      });

      const data = await response.json();
      setBooks(data.results);
      setTotal(data.total);
      setPages(data.pages);
    } catch (error) {
      console.error('[v0] Failed to load books:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, [searchQuery, sortBy, currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadBooks();
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pb-16 md:pb-0 max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              placeholder="Search books, authors, topics..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button
              type="submit"
              className="text-white"
              style={{ backgroundColor: BRAND_COLORS.PRIMARY_GREEN }}
            >
              <Search className="w-4 h-4" />
            </Button>
          </form>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filter */}
          <FilterSidebar
            isOpen={filterOpen}
            onClose={() => setFilterOpen(false)}
            onFilterChange={loadBooks}
          />

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="md:hidden p-2 hover:bg-light rounded-lg"
                >
                  <Filter className="w-5 h-5" />
                </button>
                <span className="text-sm text-gray">{total} results</span>
              </div>

              <div className="flex items-center gap-4">
                {/* View Mode Toggle */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-light' : ''}`}
                  >
                    <LayoutGrid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-light' : ''}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={e => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="a-z">A - Z</option>
                </select>
              </div>
            </div>

            {/* Books Grid/List */}
            {loading ? (
              <div className="text-center py-12">Loading...</div>
            ) : books.length > 0 ? (
              <>
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                      : 'space-y-4'
                  }
                >
                  {books.map(book => (
                    <Link
                      key={book.id}
                      href={`/books/${book.id}`}
                      className={
                        viewMode === 'grid'
                          ? 'group rounded-lg overflow-hidden shadow-elevation-2 hover:shadow-elevation-4 transition'
                          : 'flex gap-4 p-4 border rounded-lg hover:shadow-elevation-2 transition'
                      }
                    >
                      {/* Cover Image */}
                      <div
                        className={
                          viewMode === 'grid'
                            ? 'relative h-64 bg-gray-200 overflow-hidden'
                            : 'relative h-32 w-24 bg-gray-200 rounded flex-shrink-0'
                        }
                      >
                        <img
                          src={book.coverImage || '/placeholder.svg'}
                          alt={book.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition"
                          width={200}
                          height={280}
                        />
                        {book.discount && (
                          <div
                            className="absolute top-2 right-2 rounded px-2 py-1 text-xs font-bold text-white"
                            style={{ backgroundColor: BRAND_COLORS.PRIMARY_GREEN }}
                          >
                            -{book.discount}%
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className={viewMode === 'list' ? 'flex-1' : ''}>
                        <h3 className="font-semibold text-dark truncate">{book.title}</h3>
                        <p className="text-sm text-gray">{book.author}</p>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mt-2">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-4 h-4"
                                fill={i < Math.round(book.rating) ? BRAND_COLORS.PRIMARY_GREEN : '#e5e7eb'}
                                color={i < Math.round(book.rating) ? BRAND_COLORS.PRIMARY_GREEN : '#e5e7eb'}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray">({book.reviewCount})</span>
                        </div>

                        {/* Price & Buttons */}
                        <div className={viewMode === 'list' ? 'flex items-center justify-between mt-2' : ''}>
                          <div className="mt-3">
                            {book.salePrice ? (
                              <>
                                <span className="font-bold text-dark">${book.salePrice}</span>
                                <span className="ml-2 text-sm text-gray line-through">${book.price}</span>
                              </>
                            ) : (
                              <span className="font-bold text-dark">${book.price}</span>
                            )}
                          </div>

                          {viewMode === 'list' && (
                            <div className="flex gap-2">
                              <button
                                onClick={e => {
                                  e.preventDefault();
                                  console.log('[v0] Wishlist:', book.id);
                                }}
                                className="p-2 hover:bg-light rounded-lg transition"
                              >
                                <Heart className="w-5 h-5" style={{ color: BRAND_COLORS.PRIMARY_GREEN }} />
                              </button>
                              <button
                                onClick={e => {
                                  e.preventDefault();
                                  console.log('[v0] Add to cart:', book.id);
                                }}
                                className="p-2 rounded-lg transition text-white"
                                style={{ backgroundColor: BRAND_COLORS.PRIMARY_GREEN }}
                              >
                                <ShoppingCart className="w-5 h-5" />
                              </button>
                            </div>
                          )}
                        </div>
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
                <p className="text-gray mb-4">No books found</p>
                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setSortBy('newest');
                  }}
                  className="text-white"
                  style={{ backgroundColor: BRAND_COLORS.PRIMARY_GREEN }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
