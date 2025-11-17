'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { BottomNav } from '@/components/shared/bottom-nav';
import { AudioPlayer } from '@/components/audiobooks/audio-player';
import { ReviewsSection } from '@/components/books/reviews-section';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Share2, Download, Headphones } from 'lucide-react';
import { BRAND_COLORS } from '@/lib/constants';

interface AudiobookData {
  id: string;
  title: string;
  author: string;
  narrator: string;
  coverImage: string;
  price: number;
  salePrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  duration: number;
  description: string;
  chapters: Array<{
    id: string;
    title: string;
    duration: number;
    fileUrl: string;
  }>;
  category: string;
}

export default function AudiobookDetailPage() {
  const params = useParams();
  const audiobookId = params.id as string;

  const [audiobook, setAudiobook] = useState<AudiobookData | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const loadAudiobook = async () => {
      try {
        const response = await fetch(`/api/audiobooks/${audiobookId}`);
        const data = await response.json();
        setAudiobook(data);

        // Load reviews
        const reviewsRes = await fetch(`/api/audiobooks/${audiobookId}/reviews`);
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData.reviews);
      } catch (error) {
        console.error('[v0] Failed to load audiobook:', error);
      } finally {
        setLoading(false);
      }
    };

    if (audiobookId) loadAudiobook();
  }, [audiobookId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!audiobook) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-dark mb-4">Audiobook not found</h1>
            <Link href="/audiobooks" className="text-green">Back to audiobooks</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pb-16 md:pb-0 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="grid gap-8 md:grid-cols-3 my-8">
          {/* Cover & Player */}
          <div className="md:col-span-1">
            <AudioPlayer
              chapters={audiobook.chapters}
              bookTitle={audiobook.title}
              narrator={audiobook.narrator}
              bookCover={audiobook.coverImage}
            />
          </div>

          {/* Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <Headphones className="w-6 h-6" style={{ color: BRAND_COLORS.PRIMARY_GREEN }} />
              <span className="text-sm font-semibold text-green">AUDIOBOOK</span>
            </div>

            <h1 className="text-4xl font-bold text-dark mb-2">{audiobook.title}</h1>
            <p className="text-xl text-gray mb-1">by {audiobook.author}</p>
            <p className="text-lg text-gray mb-6">Narrated by {audiobook.narrator}</p>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6 pb-4 border-b">
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" viewBox="0 0 20 20" fill={i < Math.round(audiobook.rating) ? BRAND_COLORS.PRIMARY_GREEN : '#e5e7eb'}>
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray">({audiobook.reviewCount} reviews)</span>
            </div>

            {/* Duration & Format */}
            <div className="grid grid-cols-2 gap-4 mb-6 pb-4 border-b">
              <div>
                <p className="text-sm text-gray">Total Duration</p>
                <p className="font-semibold text-dark">{formatDuration(audiobook.duration)}</p>
              </div>
              <div>
                <p className="text-sm text-gray">Chapters</p>
                <p className="font-semibold text-dark">{audiobook.chapters.length}</p>
              </div>
            </div>

            {/* Pricing */}
            <div className="mb-6 pb-4 border-b">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-3xl font-bold text-dark">${audiobook.salePrice || audiobook.price}</span>
                {audiobook.salePrice && (
                  <>
                    <span className="text-lg text-gray line-through">${audiobook.price}</span>
                    <span className="px-3 py-1 rounded text-white text-sm font-semibold" style={{ backgroundColor: BRAND_COLORS.PRIMARY_GREEN }}>
                      Save {audiobook.discount}%
                    </span>
                  </>
                )}
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
                <Download className="w-5 h-5" />
                <span>Download</span>
              </Button>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-dark mb-3">About this audiobook</h3>
              <p className="text-gray leading-relaxed">{audiobook.description}</p>
            </div>
          </div>
        </div>

        {/* Chapters */}
        <section className="py-12 border-t">
          <h2 className="text-2xl font-bold text-dark mb-6">Chapters ({audiobook.chapters.length})</h2>
          <div className="space-y-2">
            {audiobook.chapters.map((chapter, index) => (
              <div
                key={chapter.id}
                className="flex items-center justify-between p-4 rounded-lg border hover:shadow-elevation-2 transition"
              >
                <div className="flex items-center gap-4 flex-1">
                  <span className="font-semibold text-gray w-8">{index + 1}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-dark">{chapter.title}</p>
                    <p className="text-sm text-gray">
                      {Math.floor(chapter.duration / 60)}m {chapter.duration % 60}s
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-white"
                  style={{ backgroundColor: BRAND_COLORS.PRIMARY_GREEN }}
                >
                  Play
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews */}
        <ReviewsSection
          bookId={audiobookId}
          reviews={reviews}
          average={audiobook.rating}
          distribution={{ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }}
          total={audiobook.reviewCount}
        />
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
