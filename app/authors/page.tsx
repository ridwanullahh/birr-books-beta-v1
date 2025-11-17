'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { BottomNav } from '@/components/shared/bottom-nav';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import { BRAND_COLORS } from '@/lib/constants';

interface AuthorSummary {
  id: string;
  name: string;
  photo?: string;
  bookCount: number;
}

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<AuthorSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);

  useEffect(() => {
    const loadAuthors = async () => {
      try {
        const response = await fetch(`/api/authors?page=${currentPage}`);
        const data = await response.json();
        setAuthors(data.authors);
        setTotal(data.total);
        setPages(data.pages);
      } catch (error) {
        console.error('[v0] Failed to load authors:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAuthors();
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pb-16 md:pb-0 max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-dark mb-2">Islamic Authors</h1>
          <p className="text-lg text-gray">Explore works from renowned Islamic scholars and authors</p>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : authors.length > 0 ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {authors.map(author => (
                <Link
                  key={author.id}
                  href={`/authors/${author.id}`}
                  className="group rounded-lg overflow-hidden shadow-elevation-2 hover:shadow-elevation-4 transition bg-white p-6"
                >
                  {/* Author Photo */}
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
                    {author.photo ? (
                      <img
                        src={author.photo || "/placeholder.svg"}
                        alt={author.name}
                        className="w-full h-full object-cover"
                        width={96}
                        height={96}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray">
                        <BookOpen className="w-12 h-12" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <h3 className="font-semibold text-dark text-center line-clamp-2 group-hover:text-green transition mb-2">
                    {author.name}
                  </h3>
                  <p className="text-sm text-gray text-center">{author.bookCount} Books</p>

                  {/* CTA */}
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-center text-green font-semibold group-hover:text-dark transition">
                      View Works →
                    </p>
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
            <p className="text-gray mb-4">No authors found</p>
            <Link href="/books" className="text-green">Browse books</Link>
          </div>
        )}
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
