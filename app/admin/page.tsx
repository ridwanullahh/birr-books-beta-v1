'use client';

import { useEffect, useState } from 'react';
import { sdk } from '@/lib/sdk';
import { BRAND_COLORS } from '@/lib/constants';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const books = await sdk.get('books');
        const orders = await sdk.get('orders');
        const users = await sdk.get('users');

        const totalRevenue = orders.reduce((sum: number, order: any) => sum + order.total, 0);

        setStats({
          totalBooks: books.length,
          totalOrders: orders.length,
          totalRevenue,
          totalUsers: users.length,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark mb-8">Admin Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-lg p-6 shadow-md" style={{ backgroundColor: BRAND_COLORS.MINTED_GLOW }}>
          <p className="text-sm text-gray mb-2">Total Books</p>
          <p className="text-3xl font-bold text-primary">{stats.totalBooks}</p>
        </div>
        <div className="rounded-lg p-6 shadow-md" style={{ backgroundColor: BRAND_COLORS.MINTED_GLOW }}>
          <p className="text-sm text-gray mb-2">Total Orders</p>
          <p className="text-3xl font-bold text-primary">{stats.totalOrders}</p>
        </div>
        <div className="rounded-lg p-6 shadow-md" style={{ backgroundColor: BRAND_COLORS.MINTED_GLOW }}>
          <p className="text-sm text-gray mb-2">Total Revenue</p>
          <p className="text-3xl font-bold text-primary">${stats.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="rounded-lg p-6 shadow-md" style={{ backgroundColor: BRAND_COLORS.MINTED_GLOW }}>
          <p className="text-sm text-gray mb-2">Total Users</p>
          <p className="text-3xl font-bold text-primary">{stats.totalUsers}</p>
        </div>
      </div>
    </div>
  );
}
