'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { BRAND_COLORS } from '@/lib/constants';

interface Book {
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

interface FeaturedBooksProps {
  title: string;
  books: Book[];
  viewAll?: string;
}

export function FeaturedBooks({
  title,
  books = [],
  viewAll = '/books'
}: FeaturedBooksProps) {
  if (books.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-dark">{title}</h2>
        <Link
          href={viewAll}
          className="text-sm font-semibold transition"
          style={{ color: BRAND_COLORS.PRIMARY_GREEN }}
        >
          View All →
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
        {books.map(book => (
          <Link
            key={book.id}
            href={`/books/${book.id}`}
            className="group rounded-lg overflow-hidden shadow-elevation-2 hover:shadow-elevation-4 transition duration-300 bg-white"
          >
            {/* Book Cover */}
            <div className="relative h-64 bg-gray-200 overflow-hidden">
              <img
                src={book.coverImage || "/placeholder.svg"}
                alt={book.title}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                width={200}
                height={280}
              />
              
              {/* Discount Badge */}
              {book.discount && (
                <div
                  className="absolute top-2 right-2 rounded px-2 py-1 text-xs font-bold text-white"
                  style={{ backgroundColor: BRAND_COLORS.PRIMARY_GREEN }}
                >
                  -{book.discount}%
                </div>
              )}

              {/* Wishlist Button */}
              <button
                className="absolute top-2 left-2 p-2 rounded-full bg-white hover:bg-gray-100 transition shadow-md opacity-0 group-hover:opacity-100"
                onClick={e => {
                  e.preventDefault();
                  console.log('[v0] Add to wishlist:', book.id);
                }}
              >
                <Heart className="w-5 h-5" style={{ color: BRAND_COLORS.PRIMARY_GREEN }} />
              </button>
            </div>

            {/* Book Info */}
            <div className="p-4">
              <h3 className="font-semibold text-dark line-clamp-2 group-hover:text-green transition">
                {book.title}
              </h3>
              <p className="text-sm text-gray mt-1">{book.author}</p>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1">
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

              {/* Price */}
              <div className="flex items-center gap-2 mt-3 mb-3">
                {book.salePrice ? (
                  <>
                    <span className="font-bold text-dark">${book.salePrice.toFixed(2)}</span>
                    <span className="text-sm text-gray line-through">${book.price.toFixed(2)}</span>
                  </>
                ) : (
                  <span className="font-bold text-dark">${book.price.toFixed(2)}</span>
                )}
              </div>

              {/* Add to Cart */}
              <button
                className="w-full py-2 rounded font-semibold text-white transition hover:scale-105 flex items-center justify-center gap-2"
                style={{ backgroundColor: BRAND_COLORS.PRIMARY_GREEN }}
                onClick={e => {
                  e.preventDefault();
                  console.log('[v0] Add to cart:', book.id);
                }}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
