'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { BottomNav } from '@/components/shared/bottom-nav';
import { BreadcrumbNav } from '@/components/shared/breadcrumb-nav';
import { Button } from '@/components/ui/button';
import { Star, ChevronRight } from 'lucide-react';
import { BRAND_COLORS } from '@/lib/constants';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  bookCount: number;
  subcategories: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  featured: Array<{
    id: string;
    title: string;
    author: string;
    coverImage: string;
    price: number;
    rating: number;
  }>;
}

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.slug as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategory = async () => {
      try {
        const response = await fetch(`/api/categories/${categorySlug}`);
        const data = await response.json();
        setCategory(data);
      } catch (error) {
        console.error('[v0] Failed to load category:', error);
      } finally {
        setLoading(false);
      }
    };

    if (categorySlug) loadCategory();
  }, [categorySlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-dark mb-4">Category not found</h1>
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
        <BreadcrumbNav
          items={[
            { label: 'Home', href: '/' },
            { label: 'Books', href: '/books' },
            { label: category.name }
          ]}
        />

        {/* Category Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-dark mb-3">{category.name}</h1>
          <p className="text-lg text-gray mb-4 max-w-3xl">{category.description}</p>
          <p className="text-sm text-gray font-medium">{category.bookCount} books available</p>
        </div>

        {/* Subcategories */}
        {category.subcategories.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-dark mb-6">Browse Subcategories</h2>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {category.subcategories.map(sub => (
                <Link
                  key={sub.id}
                  href={`/category/${category.slug}/${sub.slug}`}
                  className="group p-4 rounded-lg border hover:border-green hover:shadow-elevation-2 transition"
                >
                  <h3 className="font-semibold text-dark group-hover:text-green transition mb-2">
                    {sub.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray group-hover:text-dark transition">
                    <span>Explore</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Featured Books */}
        {category.featured.length > 0 && (
          <section className="mb-12 pb-12 border-b">
            <h2 className="text-2xl font-bold text-dark mb-6">Featured in {category.name}</h2>
            <div className="grid gap-6 grid-cols-2 md:grid-cols-3">
              {category.featured.map(book => (
                <Link
                  key={book.id}
                  href={`/books/${book.id}`}
                  className="group rounded-lg overflow-hidden shadow-elevation-2 hover:shadow-elevation-4 transition"
                >
                  {/* Cover */}
                  <div className="relative h-64 bg-gray-200 overflow-hidden">
                    <img
                      src={book.coverImage || '/placeholder.svg'}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition"
                      width={200}
                      height={280}
                    />
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-dark line-clamp-2 group-hover:text-green transition mb-1">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray mb-3">{book.author}</p>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3"
                          fill={i < Math.round(book.rating) ? BRAND_COLORS.PRIMARY_GREEN : '#e5e7eb'}
                          color={i < Math.round(book.rating) ? BRAND_COLORS.PRIMARY_GREEN : '#e5e7eb'}
                        />
                      ))}
                    </div>

                    <p className="font-bold text-dark">${book.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* View All in Category */}
        <div className="text-center">
          <Button
            asChild
            className="text-white px-8 py-6"
            style={{ backgroundColor: BRAND_COLORS.PRIMARY_GREEN }}
          >
            <Link href={`/books?category=${category.slug}`}>
              Browse All {category.name} Books
            </Link>
          </Button>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
