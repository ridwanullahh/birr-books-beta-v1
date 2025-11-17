'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BRAND_COLORS } from '@/lib/constants';

interface Story {
  id: string;
  title: string;
  image: string;
  link: string;
  viewed?: boolean;
}

interface StoriesBarProps {
  stories?: Story[];
}

export function StoriesBar({ stories = [] }: StoriesBarProps) {
  const [viewed, setViewed] = useState<Set<string>>(new Set());

  const defaultStories: Story[] = [
    {
      id: '1',
      title: 'New Release',
      image: '/new-book.jpg',
      link: '/books?sort=newest'
    },
    {
      id: '2',
      title: 'Best Sellers',
      image: '/bestseller.jpg',
      link: '/books?sort=bestselling'
    },
    {
      id: '3',
      title: 'Audio Books',
      image: '/audiobook-scene.png',
      link: '/audiobooks'
    },
    {
      id: '4',
      title: 'Series',
      image: '/book-series.jpg',
      link: '/series'
    }
  ];

  const storiesToShow = stories.length > 0 ? stories : defaultStories;

  return (
    <section className="relative overflow-x-auto bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {storiesToShow.map(story => (
            <Link
              key={story.id}
              href={story.link}
              className="flex-shrink-0 rounded-full overflow-hidden relative cursor-pointer hover:opacity-80 transition"
              onClick={() => setViewed(prev => new Set(prev).add(story.id))}
            >
              <div
                className={`w-24 h-24 border-4 flex items-center justify-center ${
                  viewed.has(story.id) ? 'border-gray-400' : 'border-green'
                }`}
                style={{
                  borderColor: viewed.has(story.id) ? '#9CA3AF' : BRAND_COLORS.PRIMARY_GREEN
                }}
              >
                <img
                  src={story.image || "/placeholder.svg"}
                  alt={story.title}
                  className="w-full h-full object-cover"
                  width={96}
                  height={96}
                />
              </div>
              <span className="text-xs font-medium text-center text-dark mt-2 block truncate w-24">
                {story.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
