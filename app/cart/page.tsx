'use client';

import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { BottomNav } from '@/components/shared/bottom-nav';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { BRAND_COLORS } from '@/lib/constants';
import { CartService } from '@/lib/cart-service';

interface CartItem {
  bookId: string;
  quantity: number;
  price: number;
}

export default function CartPage() {
  const { user, token } = useAuth();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      redirect('/auth/login');
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const fetchCart = async () => {
        try {
          const userCart = await CartService.getCart(user.id);
          setCart(userCart);
        } catch (error) {
          console.error('Failed to fetch cart:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchCart();
    }
  }, [user]);

  const handleRemove = async (bookId: string) => {
    if (!user) return;
    try {
      const updated = await CartService.removeFromCart(user.id, bookId);
      setCart(updated);
    } catch (error) {
      console.error('Failed to remove from cart:', error);
    }
  };

  const handleCheckout = () => {
    redirect('/checkout');
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pb-16 md:pb-0">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <h1 className="text-3xl font-bold text-dark mb-8">Shopping Cart</h1>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Cart Items */}
            <div className="md:col-span-2">
              {!cart || cart.items.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray mb-4">Your cart is empty</p>
                  <a href="/books" className="inline-block rounded-lg bg-primary px-6 py-2 text-white hover:bg-primary/90">
                    Continue Shopping
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.items.map((item: CartItem, index: number) => (
                    <div key={index} className="rounded-lg border border-gray-200 p-4 flex justify-between items-center">
                      <div className="flex-1">
                        <h3 className="font-semibold text-dark">Book</h3>
                        <p className="text-sm text-gray">Quantity: {item.quantity}</p>
                        <p className="text-lg font-bold text-primary mt-2">${item.price}</p>
                      </div>
                      <button
                        onClick={() => handleRemove(item.bookId)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Order Summary */}
            {cart && cart.items.length > 0 && (
              <div className="rounded-lg bg-light p-6 shadow-elevation-2 h-fit">
                <h2 className="font-bold text-dark mb-4">Order Summary</h2>
                <div className="space-y-3 border-b border-gray-300 pb-4 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${(cart.total + cart.discountAmount).toFixed(2)}</span>
                  </div>
                  {cart.discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount:</span>
                      <span>-${cart.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>Shipping:</span>
                    <span>$0.00</span>
                  </div>
                </div>
                <div className="flex justify-between mb-6">
                  <span className="font-bold text-dark">Total:</span>
                  <span className="text-2xl font-bold text-primary">${cart.total.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full rounded-lg py-3 font-semibold text-white transition hover:shadow-lg"
                  style={{ backgroundColor: BRAND_COLORS.PRIMARY_GREEN }}
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
