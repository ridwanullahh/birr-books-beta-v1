'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface BookGalleryProps {
  images: string[];
  title: string;
}

export function BookGallery({ images = [], title }: BookGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const displayImages = images.length > 0 ? images : ['/placeholder.svg?key=6iijz'];

  const goToPrevious = () => {
    setSelectedIndex(prev => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const goToNext = () => {
    setSelectedIndex(prev => (prev + 1) % displayImages.length);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-[3/4]">
        <img
          src={displayImages[selectedIndex] || "/placeholder.svg"}
          alt={title}
          className={`w-full h-full object-cover cursor-zoom-in transition ${
            isZoomed ? 'scale-150' : 'scale-100'
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
          width={400}
          height={500}
        />

        {/* Navigation Arrows */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white transition"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white transition"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Zoom Icon */}
        <button
          onClick={() => setIsZoomed(!isZoomed)}
          className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white transition"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`flex-shrink-0 w-16 h-20 rounded border-2 transition ${
                index === selectedIndex
                  ? 'border-green'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
              style={{
                borderColor: index === selectedIndex ? '#05B34D' : '#e5e7eb'
              }}
            >
              <img
                src={image || "/placeholder.svg"}
                alt={`${title} view ${index + 1}`}
                className="w-full h-full object-cover rounded"
                width={64}
                height={80}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
