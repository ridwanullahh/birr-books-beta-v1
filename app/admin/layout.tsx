'use client';

import { useAuth } from '@/hooks/use-auth';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { BRAND_COLORS } from '@/lib/constants';

const ADMIN_MENU = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Books', href: '/admin/books' },
  { label: 'Authors', href: '/admin/authors' },
  { label: 'Orders', href: '/admin/orders' },
  { label: 'Blog', href: '/admin/blog' },
  { label: 'Users', href: '/admin/users' },
  { label: 'Settings', href: '/admin/settings' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.role !== 'admin') {
      redirect('/');
    }
  }, [user]);

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-dark text-white">
        <div className="p-6">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg" style={{ backgroundColor: BRAND_COLORS.PRIMARY_GREEN }} />
            <span className="font-bold">Birr Admin</span>
          </Link>
        </div>

        <nav className="space-y-2 px-4">
          {ADMIN_MENU.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-4 py-2 hover:bg-gray-700 transition"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-8">{children}</main>
    </div>
  );
}
