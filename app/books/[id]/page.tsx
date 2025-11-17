'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { BottomNav } from '@/components/shared/bottom-nav';
import { BookGallery } from '@/components/books/book-gallery';
import { ReviewsSection } from '@/components/books/reviews-section';
import { PDFPreview } from '@/components/books/pdf-preview';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis
} from '@/components/ui/breadcrumb';
import { Heart, ShoppingCart, Share2, Download, BookOpen } from 'lucide-react';
import { BRAND_COLORS } from '@/lib/constants';

interface BookData {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  galleryImages: string[];
  price: number;
  salePrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  description: string;
  category: string;
  formats: string[];
  pages: number;
  language: string;
  publisher?: string;
  isbn?: string;
  availability: string;
}

export default function BookDetailPage() {
  const params = useParams();
  const bookId = params.id as string;
  
  const [book, setBook] = useState<BookData | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFormat, setSelectedFormat] = useState('PDF');

  useEffect(() => {
    const loadBook = async () => {
      try {
        const response = await fetch(`/api/books/${bookId}`);
        const data = await response.json();
        setBook(data);

        // Load reviews
        const reviewsRes = await fetch(`/api/books/${bookId}/reviews`);
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData.reviews);
      } catch (error) {
        console.error('[v0] Failed to load book:', error);
      } finally {
        setLoading(false);
      }
    };

    if (bookId) loadBook();
  }, [bookId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-dark mb-4">Book not found</h1>
            <Link href="/books" className="text-green">Back to books</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pb-16 md:pb-0 max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Books', href: '/books' },
            { label: book.category, href: `/category/${book.category}` },
            { label: book.title }
          ]}
        />

        {/* Book Header */}
        <div className="grid gap-8 md:grid-cols-3 my-8">
          {/* Gallery */}
          <div className="md:col-span-1">
            <BookGallery images={book.galleryImages} title={book.title} />
          </div>

          {/* Info */}
          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold text-dark mb-2">{book.title}</h1>
            <p className="text-xl text-gray mb-4">by {book.author}</p>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6 pb-4 border-b">
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" viewBox="0 0 20 20" fill={i < Math.round(book.rating) ? BRAND_COLORS.PRIMARY_GREEN : '#e5e7eb'}>
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray">({book.reviewCount} reviews)</span>
            </div>

            {/* Pricing */}
            <div className="mb-6 pb-4 border-b">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-3xl font-bold text-dark">${book.salePrice || book.price}</span>
                {book.salePrice && (
                  <>
                    <span className="text-lg text-gray line-through">${book.price}</span>
                    <span className="px-3 py-1 rounded text-white text-sm font-semibold" style={{ backgroundColor: BRAND_COLORS.PRIMARY_GREEN }}>
                      Save {book.discount}%
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray">Availability: {book.availability}</p>
            </div>

            {/* Format Selection */}
            <div className="mb-6 pb-4 border-b">
              <p className="font-semibold text-dark mb-3">Format:</p>
              <div className="flex flex-wrap gap-2">
                {book.formats.map(format => (
                  <button
                    key={format}
                    onClick={() => setSelectedFormat(format)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      selectedFormat === format
                        ? 'text-white'
                        : 'border-2'
                    }`}
                    style={{
                      backgroundColor: selectedFormat === format ? BRAND_COLORS.PRIMARY_GREEN : 'transparent',
                      borderColor: selectedFormat === format ? BRAND_COLORS.PRIMARY_GREEN : '#e5e7eb',
                      color: selectedFormat === format ? 'white' : BRAND_COLORS.PRIMARY_GREEN
                    }}
                  >
                    {format}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid gap-3 grid-cols-2 md:grid-cols-3 mb-6">
              <Button
                className="text-white flex items-center justify-center gap-2"
                style={{ backgroundColor: BRAND_COLORS.PRIMARY_GREEN }}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </Button>
              <Button
                variant="outline"
                className="flex items-center justify-center gap-2"
              >
                <Heart className="w-5 h-5" />
                <span>Wishlist</span>
              </Button>
              <Button
                variant="outline"
                className="flex items-center justify-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </Button>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-semibold text-dark mb-3">About this book</h3>
              <p className="text-gray leading-relaxed">{book.description}</p>
            </div>

            {/* Book Details */}
            <div className="grid gap-4 grid-cols-2 text-sm mb-6 p-4 rounded-lg" style={{ backgroundColor: BRAND_COLORS.MINTED_GLOW }}>
              <div>
                <p className="text-gray">Pages</p>
                <p className="font-semibold text-dark">{book.pages}</p>
              </div>
              <div>
                <p className="text-gray">Language</p>
                <p className="font-semibold text-dark">{book.language}</p>
              </div>
              {book.isbn && (
                <div>
                  <p className="text-gray">ISBN</p>
                  <p className="font-semibold text-dark">{book.isbn}</p>
                </div>
              )}
              {book.publisher && (
                <div>
                  <p className="text-gray">Publisher</p>
                  <p className="font-semibold text-dark">{book.publisher}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* PDF Preview */}
        <PDFPreview bookTitle={book.title} />

        {/* Reviews Section */}
        <ReviewsSection
          bookId={bookId}
          reviews={reviews}
          average={book.rating}
          distribution={{ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }}
          total={book.reviewCount}
        />

        {/* Related Books */}
        <section className="py-12 border-t">
          <h2 className="text-2xl font-bold text-dark mb-6">Similar Books</h2>
          <div className="grid gap-6 grid-cols-2 md:grid-cols-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="rounded-lg overflow-hidden shadow-elevation-2 hover:shadow-elevation-4 transition">
                <img src="/placeholder.svg?key=6iijz" alt="Book" className="w-full h-64 object-cover" />
                <div className="p-4">
                  <p className="font-semibold text-dark text-sm">Similar Book Title</p>
                  <p className="text-xs text-gray">Author Name</p>
                  <p className="font-bold text-dark mt-2">$19.99</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
