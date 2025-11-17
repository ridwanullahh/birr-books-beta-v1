'use client';

import { useEffect, useState } from 'react';
import { sdk } from '@/lib/sdk';
import Link from 'next/link';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await sdk.get('orders');
        setOrders(data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark mb-8">Orders Management</h1>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-dark">Order ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-dark">Customer</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-dark">Total</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-dark">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-dark">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-dark">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-mono text-dark">{order.id.slice(0, 8)}</td>
                <td className="px-6 py-4 text-sm text-gray">{order.userId}</td>
                <td className="px-6 py-4 text-sm font-semibold text-dark">${order.total.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-primary hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
