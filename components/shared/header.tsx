'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { BRAND_COLORS } from '@/lib/constants';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-elevation-2">
      <div className="mx-auto max-w-7xl px-4 py-4">
        {/* Desktop Navigation */}
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div
              className="h-8 w-8 rounded-lg"
              style={{ backgroundColor: BRAND_COLORS.PRIMARY_GREEN }}
            />
            <span className="text-xl font-bold text-dark">Birr Books</span>
          </Link>

          {/* Search Bar */}
          <div className="hidden flex-1 mx-8 md:flex">
            <input
              type="text"
              placeholder="Search books, authors..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/cart"
              className="relative rounded-lg p-2 hover:bg-light transition"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                0
              </span>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="text-sm text-gray hover:text-dark">
                  {user?.name}
                </Link>
                <button
                  onClick={logout}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login" className="text-sm text-gray hover:text-dark">
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        <div className="mt-4 md:hidden">
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Mobile Navigation - Add implementation */}
    </header>
  );
}
