'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { BottomNav } from '@/components/shared/bottom-nav';
import { Button } from '@/components/ui/button';
import { Star, Mail, Facebook, Twitter, Instagram, Globe } from 'lucide-react';
import { BRAND_COLORS } from '@/lib/constants';

interface AuthorDetail {
  id: string;
  name: string;
  biography: string;
  photo?: string;
  email?: string;
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    website?: string;
  };
  bookCount: number;
  audiobookCount: number;
  books: Array<{
    id: string;
    title: string;
    coverImage: string;
    price: number;
    rating: number;
  }>;
  audiobooks: Array<{
    id: string;
    title: string;
    coverImage: string;
    narrator: string;
    price: number;
    rating: number;
  }>;
}

export default function AuthorDetailPage() {
  const params = useParams();
  const authorId = params.id as string;

  const [author, setAuthor] = useState<AuthorDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuthor = async () => {
      try {
        const response = await fetch(`/api/authors/${authorId}`);
        const data = await response.json();
        setAuthor(data);
      } catch (error) {
        console.error('[v0] Failed to load author:', error);
      } finally {
        setLoading(false);
      }
    };

    if (authorId) loadAuthor();
  }, [authorId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-dark mb-4">Author not found</h1>
            <Link href="/authors" className="text-green">Back to authors</Link>
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
        {/* Author Header */}
        <div className="grid gap-8 md:grid-cols-3 mb-12 pb-12 border-b">
          {/* Photo */}
          <div className="md:col-span-1">
            <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-200 shadow-elevation-3">
              {author.photo ? (
                <img
                  src={author.photo || "/placeholder.svg"}
                  alt={author.name}
                  className="w-full h-full object-cover"
                  width={400}
                  height={400}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray">
                  <div className="text-center">
                    <div className="text-6xl mb-2">👤</div>
                    <p>Author Profile</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold text-dark mb-4">{author.name}</h1>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray mb-1">Books</p>
                <p className="text-2xl font-bold text-dark">{author.bookCount}</p>
              </div>
              <div>
                <p className="text-sm text-gray mb-1">Audiobooks</p>
                <p className="text-2xl font-bold text-dark">{author.audiobookCount}</p>
              </div>
            </div>

            {/* Biography */}
            <p className="text-gray leading-relaxed mb-6">{author.biography}</p>

            {/* Social Links */}
            {author.socialLinks && (
              <div className="flex flex-wrap gap-3">
                {author.socialLinks.website && (
                  <a
                    href={author.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full hover:bg-light transition"
                  >
                    <Globe className="w-5 h-5" style={{ color: BRAND_COLORS.PRIMARY_GREEN }} />
                  </a>
                )}
                {author.socialLinks.twitter && (
                  <a
                    href={author.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full hover:bg-light transition"
                  >
                    <Twitter className="w-5 h-5" style={{ color: BRAND_COLORS.PRIMARY_GREEN }} />
                  </a>
                )}
                {author.socialLinks.facebook && (
                  <a
                    href={author.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full hover:bg-light transition"
                  >
                    <Facebook className="w-5 h-5" style={{ color: BRAND_COLORS.PRIMARY_GREEN }} />
                  </a>
                )}
                {author.socialLinks.instagram && (
                  <a
                    href={author.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full hover:bg-light transition"
                  >
                    <Instagram className="w-5 h-5" style={{ color: BRAND_COLORS.PRIMARY_GREEN }} />
                  </a>
                )}
                {author.email && (
                  <a
                    href={`mailto:${author.email}`}
                    className="p-2 rounded-full hover:bg-light transition"
                  >
                    <Mail className="w-5 h-5" style={{ color: BRAND_COLORS.PRIMARY_GREEN }} />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Books */}
        {author.books.length > 0 && (
          <section className="mb-12 pb-12 border-b">
            <h2 className="text-2xl font-bold text-dark mb-6">Books by {author.name}</h2>
            <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {author.books.map(book => (
                <Link
                  key={book.id}
                  href={`/books/${book.id}`}
                  className="group rounded-lg overflow-hidden shadow-elevation-2 hover:shadow-elevation-4 transition"
                >
                  <div className="h-64 bg-gray-200 overflow-hidden">
                    <img
                      src={book.coverImage || '/placeholder.svg'}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition"
                      width={200}
                      height={280}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-dark line-clamp-2 group-hover:text-green transition mb-2">
                      {book.title}
                    </h3>
                    <div className="flex items-center gap-1 mb-2">
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

        {/* Audiobooks */}
        {author.audiobooks.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-dark mb-6">Audiobooks by {author.name}</h2>
            <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {author.audiobooks.map(audiobook => (
                <Link
                  key={audiobook.id}
                  href={`/audiobooks/${audiobook.id}`}
                  className="group rounded-lg overflow-hidden shadow-elevation-2 hover:shadow-elevation-4 transition"
                >
                  <div className="h-64 bg-gray-200 overflow-hidden">
                    <img
                      src={audiobook.coverImage || '/placeholder.svg'}
                      alt={audiobook.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition"
                      width={200}
                      height={280}
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray mb-1">Narrated by {audiobook.narrator}</p>
                    <h3 className="font-semibold text-dark line-clamp-2 group-hover:text-green transition mb-2">
                      {audiobook.title}
                    </h3>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3"
                          fill={i < Math.round(audiobook.rating) ? BRAND_COLORS.PRIMARY_GREEN : '#e5e7eb'}
                          color={i < Math.round(audiobook.rating) ? BRAND_COLORS.PRIMARY_GREEN : '#e5e7eb'}
                        />
                      ))}
                    </div>
                    <p className="font-bold text-dark">${audiobook.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
