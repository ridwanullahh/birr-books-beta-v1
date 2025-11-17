import Link from 'next/link';
import { BRAND_COLORS } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="bg-dark text-white">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div
                className="h-8 w-8 rounded-lg"
                style={{ backgroundColor: BRAND_COLORS.PRIMARY_GREEN }}
              />
              <span className="text-lg font-bold">Birr Books</span>
            </div>
            <p className="text-sm text-gray-300">
              Authentic Islamic knowledge in your language
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-semibold">Store</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/books" className="hover:text-primary">
                  Books
                </Link>
              </li>
              <li>
                <Link href="/audiobooks" className="hover:text-primary">
                  Audiobooks
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-primary">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 font-semibold">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/faq" className="hover:text-primary">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-4 font-semibold">Newsletter</h3>
            <p className="mb-4 text-sm">Subscribe for updates</p>
            <input
              type="email"
              placeholder="Your email"
              className="w-full rounded px-3 py-2 text-sm text-dark"
            />
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm text-gray-300">
          <p>&copy; 2025 Birr Books. All rights reserved. Bismillah Ar-Rahman Ar-Roheem</p>
        </div>
      </div>
    </footer>
  );
}
