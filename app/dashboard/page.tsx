'use client';

import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { BottomNav } from '@/components/shared/bottom-nav';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { BRAND_COLORS } from '@/lib/constants';
import { sdk } from '@/lib/sdk';

export default function DashboardPage() {
  const { user, token, loading } = useAuth();
  const [stats, setStats] = useState({ purchases: 0, spent: 0, wishlist: 0 });

  useEffect(() => {
    if (!loading && !user) {
      redirect('/auth/login');
    }
  }, [user, loading]);

  useEffect(() => {
    if (user) {
      const fetchStats = async () => {
        try {
          const orders = await sdk.get('orders');
          const wishlist = await sdk.get('wishlist');
          const userOrders = orders.filter((o: any) => o.userId === user.id);
          const userWishlist = wishlist.find((w: any) => w.userId === user.id);

          setStats({
            purchases: userOrders.length,
            spent: userOrders.reduce((sum: number, o: any) => sum + o.total, 0),
            wishlist: userWishlist?.items?.length || 0,
          });
        } catch (error) {
          console.error('Failed to fetch stats:', error);
        }
      };

      fetchStats();
    }
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pb-16 md:pb-0">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <h1 className="text-3xl font-bold text-dark mb-8">Welcome, {user.name}!</h1>

          {/* Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-3 mb-8">
            <div className="rounded-lg p-6 shadow-elevation-2" style={{ backgroundColor: BRAND_COLORS.MINTED_GLOW }}>
              <p className="text-sm text-gray mb-2">Total Purchases</p>
              <p className="text-3xl font-bold text-primary">{stats.purchases}</p>
            </div>
            <div className="rounded-lg p-6 shadow-elevation-2" style={{ backgroundColor: BRAND_COLORS.MINTED_GLOW }}>
              <p className="text-sm text-gray mb-2">Total Spent</p>
              <p className="text-3xl font-bold text-primary">${stats.spent.toFixed(2)}</p>
            </div>
            <div className="rounded-lg p-6 shadow-elevation-2" style={{ backgroundColor: BRAND_COLORS.MINTED_GLOW }}>
              <p className="text-sm text-gray mb-2">Wishlist Items</p>
              <p className="text-3xl font-bold text-primary">{stats.wishlist}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-4 sm:grid-cols-3">
            <a
              href="/library"
              className="rounded-lg p-6 text-center shadow-elevation-2 hover:shadow-elevation-3 transition"
              style={{ backgroundColor: BRAND_COLORS.MINTED_GLOW }}
            >
              <h3 className="font-semibold text-dark">My Library</h3>
              <p className="text-sm text-gray mt-2">View your books and audiobooks</p>
            </a>
            <a
              href="/orders"
              className="rounded-lg p-6 text-center shadow-elevation-2 hover:shadow-elevation-3 transition"
              style={{ backgroundColor: BRAND_COLORS.MINTED_GLOW }}
            >
              <h3 className="font-semibold text-dark">My Orders</h3>
              <p className="text-sm text-gray mt-2">Track your purchases</p>
            </a>
            <a
              href="/settings"
              className="rounded-lg p-6 text-center shadow-elevation-2 hover:shadow-elevation-3 transition"
              style={{ backgroundColor: BRAND_COLORS.MINTED_GLOW }}
            >
              <h3 className="font-semibold text-dark">Settings</h3>
              <p className="text-sm text-gray mt-2">Manage your account</p>
            </a>
          </div>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
