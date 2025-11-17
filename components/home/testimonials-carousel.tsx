'use client';

import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { BRAND_COLORS } from '@/lib/constants';

interface Testimonial {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  content: string;
  bookTitle: string;
}

interface TestimonialsCarouselProps {
  testimonials?: Testimonial[];
}

export function TestimonialsCarousel({ testimonials = [] }: TestimonialsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const defaultTestimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Ahmed Hassan',
      rating: 5,
      content: 'This platform has transformed my understanding of Islamic knowledge. The books and audiobooks are authentic and well-curated.',
      bookTitle: 'Quran Tafseer Collection'
    },
    {
      id: '2',
      name: 'Fatima Ahmed',
      rating: 5,
      content: 'Great collection of Islamic books in multiple languages. The reading interface is smooth and the audiobook player is excellent.',
      bookTitle: 'Islamic History Series'
    },
    {
      id: '3',
      name: 'Mohammed Ali',
      rating: 5,
      content: 'Perfect platform for learning. I love the ability to read and listen at my own pace. Highly recommended for all Muslims.',
      bookTitle: 'Fiqh Fundamentals'
    }
  ];

  const display = testimonials.length > 0 ? testimonials : defaultTestimonials;

  if (display.length === 0) return null;

  const currentTestimony = display[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev - 1 + display.length) % display.length);
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % display.length);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
      <h2 className="text-2xl font-bold text-dark mb-8 text-center">What Our Readers Say</h2>

      <div className="relative bg-white rounded-lg shadow-elevation-3 p-8 md:p-12">
        {/* Testimonial Content */}
        <div className="text-center">
          {currentTestimony.avatar && (
            <img
              src={currentTestimony.avatar || "/placeholder.svg"}
              alt={currentTestimony.name}
              className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
              width={64}
              height={64}
            />
          )}

          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-5 h-5"
                fill={i < currentTestimony.rating ? BRAND_COLORS.PRIMARY_GREEN : '#e5e7eb'}
                color={i < currentTestimony.rating ? BRAND_COLORS.PRIMARY_GREEN : '#e5e7eb'}
              />
            ))}
          </div>

          <p className="text-lg text-gray mb-4 italic max-w-2xl mx-auto">
            "{currentTestimony.content}"
          </p>

          <p className="font-semibold text-dark">{currentTestimony.name}</p>
          <p className="text-sm text-gray">{currentTestimony.bookTitle}</p>
        </div>

        {/* Navigation */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-light transition"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-5 h-5" style={{ color: BRAND_COLORS.PRIMARY_GREEN }} />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-light transition"
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-5 h-5" style={{ color: BRAND_COLORS.PRIMARY_GREEN }} />
        </button>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {display.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className="h-2 rounded-full transition"
              style={{
                width: index === currentIndex ? '24px' : '8px',
                backgroundColor: index === currentIndex ? BRAND_COLORS.PRIMARY_GREEN : '#e5e7eb'
              }}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
