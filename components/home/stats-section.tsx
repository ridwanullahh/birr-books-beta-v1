'use client';

import { useEffect, useState } from 'react';
import { BRAND_COLORS } from '@/lib/constants';

interface StatItem {
  value: number | string;
  label: string;
  icon?: string;
}

interface StatsSectionProps {
  stats: StatItem[];
}

export function StatsSection({ stats = [] }: StatsSectionProps) {
  const [animatedStats, setAnimatedStats] = useState<(number | string)[]>([]);

  useEffect(() => {
    if (stats.length === 0) return;

    const timers = stats.map((stat, index) => {
      if (typeof stat.value === 'number') {
        let current = 0;
        const target = stat.value;
        const increment = Math.ceil(target / 50);
        
        const interval = setInterval(() => {
          current = Math.min(current + increment, target);
          setAnimatedStats(prev => {
            const next = [...prev];
            next[index] = current;
            return next;
          });
          
          if (current >= target) clearInterval(interval);
        }, 20);

        return interval;
      }
      return null;
    });

    return () => {
      timers.forEach(timer => {
        if (timer) clearInterval(timer);
      });
    };
  }, [stats]);

  const defaultStats: StatItem[] = [
    { value: 5000, label: 'Books Available', icon: 'book' },
    { value: 50000, label: 'Happy Readers', icon: 'users' },
    { value: 100000, label: 'Hours Learned', icon: 'clock' }
  ];

  const displayStats = stats.length > 0 ? stats : defaultStats;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
      <div className="grid gap-6 sm:grid-cols-3">
        {displayStats.map((stat, index) => (
          <div
            key={index}
            className="rounded-lg p-6 text-center shadow-elevation-2"
            style={{ backgroundColor: BRAND_COLORS.MINTED_GLOW }}
          >
            <div
              className="text-3xl md:text-4xl font-bold mb-2"
              style={{ color: BRAND_COLORS.PRIMARY_GREEN }}
            >
              {animatedStats[index] !== undefined ? animatedStats[index] : stat.value}
              {typeof stat.value === 'number' && stat.label.includes('Hours') && '+'}
            </div>
            <p className="text-dark font-medium">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
