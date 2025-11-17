'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  return (
    <nav className="flex items-center gap-2 text-sm mb-8 overflow-x-auto pb-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2 flex-shrink-0">
          {index > 0 && <ChevronRight className="w-4 h-4 text-gray flex-shrink-0" />}
          {item.href ? (
            <Link href={item.href} className="text-green hover:underline">
              {item.label}
            </Link>
          ) : (
            <span className="text-dark font-semibold">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
