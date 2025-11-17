'use client';

import Link from 'next/link';
import { BRAND_COLORS } from '@/lib/constants';

interface HeroSectionProps {
  featured?: Array<{
    id: string;
    title: string;
    subtitle?: string;
    coverImage: string;
  }>;
}

export function HeroSection({ featured }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-light via-white to-white px-4 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-balance text-4xl font-bold text-dark md:text-6xl leading-tight">
              Islamic Knowledge at Your Fingertips
            </h1>
            <p className="mt-6 text-balance text-lg text-gray">
              Explore authentic Islamic books, audiobooks, and educational content in multiple languages. Learn from trusted scholars and authors.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row justify-center md:justify-start">
              <Link
                href="/books"
                className="rounded-lg px-8 py-3 font-semibold text-white transition hover:shadow-lg hover:scale-105 active:scale-95"
                style={{ backgroundColor: BRAND_COLORS.PRIMARY_GREEN }}
              >
                Browse Books
              </Link>
              <Link
                href="/audiobooks"
                className="rounded-lg px-8 py-3 font-semibold border-2 transition hover:shadow-lg"
                style={{ borderColor: BRAND_COLORS.PRIMARY_GREEN, color: BRAND_COLORS.PRIMARY_GREEN }}
              >
                Listen Now
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="hidden md:flex justify-center">
            <img
              src="/islamic-books-collection.jpg"
              alt="Islamic Books Collection"
              className="rounded-lg shadow-elevation-4"
              width={300}
              height={400}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
