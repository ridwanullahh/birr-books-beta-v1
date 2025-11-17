'use client';

import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { BottomNav } from '@/components/shared/bottom-nav';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { sdk } from '@/lib/sdk';

interface LibraryItem {
  id: string;
  bookTitle: string;
  bookCover: string;
  progress: number;
  format: string;
}

export default function LibraryPage() {
  const { user, loading } = useAuth();
  const [library, setLibrary] = useState<LibraryItem[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      redirect('/auth/login');
    }
  }, [user, loading]);

  useEffect(() => {
    if (user) {
      const fetchLibrary = async () => {
        try {
          const items = await sdk.get('library');
          const userLibrary = items.filter((item: any) => item.userId === user.id);
          setLibrary(userLibrary);
        } catch (error) {
          console.error('Failed to fetch library:', error);
        } finally {
          setFetching(false);
        }
      };

      fetchLibrary();
    }
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pb-16 md:pb-0">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <h1 className="text-3xl font-bold text-dark mb-8">My Library</h1>

          {fetching ? (
            <div className="text-center text-gray">Loading your library...</div>
          ) : library.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray mb-4">You don't have any books yet</p>
              <a href="/books" className="inline-block rounded-lg bg-primary px-6 py-2 text-white hover:bg-primary/90">
                Browse Books
              </a>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
              {library.map((item) => (
                <div key={item.id} className="rounded-lg overflow-hidden shadow-elevation-2 hover:shadow-elevation-3 transition">
                  <div className="h-64 bg-gray-200" />
                  <div className="p-4">
                    <h3 className="font-semibold text-dark truncate">{item.bookTitle}</h3>
                    <p className="text-xs text-gray mt-1">{item.format}</p>
                    <div className="mt-4 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray mt-1">{item.progress}% complete</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
