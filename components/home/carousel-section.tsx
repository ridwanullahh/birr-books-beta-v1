'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BRAND_COLORS } from '@/lib/constants';

interface CarouselItem {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
}

interface CarouselSectionProps {
  title: string;
  items: CarouselItem[];
  autoPlay?: boolean;
}

export function CarouselSection({
  title,
  items = [],
  autoPlay = true
}: CarouselSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);

  useEffect(() => {
    if (!isAutoPlaying || items.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % items.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, items.length]);

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev - 1 + items.length) % items.length);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % items.length);
    setIsAutoPlaying(false);
  };

  if (items.length === 0) return null;

  const currentItem = items[currentIndex];

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      <h2 className="text-2xl font-bold text-dark mb-6">{title}</h2>
      
      <div className="relative overflow-hidden rounded-lg shadow-elevation-3">
        {/* Carousel Image */}
        <div className="relative h-64 md:h-96 bg-gray-200">
          <img
            src={currentItem.image || "/placeholder.svg"}
            alt={currentItem.title}
            className="w-full h-full object-cover"
            width={800}
            height={400}
          />
          
          {/* Overlay Content */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
            <div className="p-6 md:p-8 text-white">
              <h3 className="text-2xl md:text-4xl font-bold mb-2">{currentItem.title}</h3>
              {currentItem.subtitle && (
                <p className="text-lg mb-4 opacity-90">{currentItem.subtitle}</p>
              )}
              {currentItem.link && (
                <Link
                  href={currentItem.link}
                  className="inline-block px-6 py-2 rounded font-semibold transition hover:scale-105"
                  style={{ backgroundColor: BRAND_COLORS.PRIMARY_GREEN }}
                >
                  Learn More
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white transition"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5 text-dark" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white transition"
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5 text-dark" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setIsAutoPlaying(false);
              }}
              className={`h-2 rounded-full transition ${
                index === currentIndex ? 'w-6' : 'w-2'
              }`}
              style={{
                backgroundColor: index === currentIndex ? BRAND_COLORS.PRIMARY_GREEN : 'rgba(255,255,255,0.5)'
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
