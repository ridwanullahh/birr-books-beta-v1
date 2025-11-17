'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BRAND_COLORS } from '@/lib/constants';

const NAV_ITEMS = [
  { label: 'Home', href: '/', icon: 'home' },
  { label: 'Browse', href: '/books', icon: 'search' },
  { label: 'Library', href: '/library', icon: 'library' },
  { label: 'Cart', href: '/cart', icon: 'cart' },
  { label: 'Account', href: '/account', icon: 'user' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-gray-200 bg-white">
      <div className="flex h-16 items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-1 flex-1 h-full"
              style={{
                color: isActive ? BRAND_COLORS.PRIMARY_GREEN : '#6B7280',
                backgroundColor: isActive ? BRAND_COLORS.MINTED_GLOW : 'transparent',
              }}
            >
              <div className="text-xl">{item.label.charAt(0)}</div>
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
