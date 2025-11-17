'use client';

import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { BottomNav } from '@/components/shared/bottom-nav';
import { HeroSection } from '@/components/home/hero-section';
import { StoriesBar } from '@/components/home/stories-bar';
import { CarouselSection } from '@/components/home/carousel-section';
import { FeaturedBooks } from '@/components/home/featured-books';
import { StatsSection } from '@/components/home/stats-section';
import { TestimonialsCarousel } from '@/components/home/testimonials-carousel';
import { NewsletterSection } from '@/components/home/newsletter-section';
import { useEffect, useState } from 'react';

interface HomepageData {
  featured: any[];
  newArrivals: any[];
  bestsellers: any[];
  todaysDeals: any[];
  testimonials: any[];
  stats: {
    booksAvailable: number;
    happyReaders: number;
    hoursLearned: number;
  };
}

export default function Home() {
  const [data, setData] = useState<HomepageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch homepage data
    fetch('/api/homepage')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('[v0] Failed to load homepage:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pb-16 md:pb-0">
        {/* Hero Section */}
        <HeroSection featured={data?.featured} />

        {/* Stories Bar - Instagram-style promotional stories */}
        <StoriesBar />

        {/* Featured Books Carousel */}
        {data?.featured && data.featured.length > 0 && (
          <CarouselSection
            title="Featured This Week"
            items={data.featured.map(book => ({
              id: book.id,
              title: book.title,
              subtitle: `by ${book.author}`,
              image: book.coverImage,
              link: `/books/${book.id}`
            }))}
          />
        )}

        {/* New Arrivals Section */}
        {data?.newArrivals && data.newArrivals.length > 0 && (
          <FeaturedBooks
            title="New Arrivals"
            books={data.newArrivals}
            viewAll="/books?sort=newest"
          />
        )}

        {/* Today's Deals Section */}
        {data?.todaysDeals && data.todaysDeals.length > 0 && (
          <FeaturedBooks
            title="Today's Deals"
            books={data.todaysDeals.map(deal => ({
              id: deal.id,
              title: deal.title,
              author: 'Author',
              coverImage: deal.coverImage,
              price: deal.originalPrice,
              salePrice: deal.dealPrice,
              discount: deal.discountPercentage,
              rating: 4.5,
              reviewCount: 100
            }))}
            viewAll="/books?filter=deals"
          />
        )}

        {/* Stats Section */}
        {data?.stats && (
          <StatsSection
            stats={[
              { value: data.stats.booksAvailable, label: 'Books Available' },
              { value: data.stats.happyReaders, label: 'Happy Readers' },
              { value: data.stats.hoursLearned, label: 'Hours Learned' }
            ]}
          />
        )}

        {/* Featured Series Section */}
        {data?.bestsellers && data.bestsellers.length > 0 && (
          <FeaturedBooks
            title="Bestsellers"
            books={data.bestsellers}
            viewAll="/books?sort=bestselling"
          />
        )}

        {/* Testimonials Section */}
        {data?.testimonials && data.testimonials.length > 0 && (
          <TestimonialsCarousel testimonials={data.testimonials} />
        )}

        {/* Newsletter Subscription */}
        <NewsletterSection />
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
