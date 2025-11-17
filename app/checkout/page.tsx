'use client';

import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { BottomNav } from '@/components/shared/bottom-nav';
import { useAuth } from '@/hooks/use-auth';
import { useState, useEffect } from 'react';
import { redirect } from 'next/navigation';
import { BRAND_COLORS } from '@/lib/constants';
import { OrderService } from '@/lib/order-service';
import { CartService } from '@/lib/cart-service';

export default function CheckoutPage() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState<any>(null);
  const [formData, setFormData] = useState({
    email: user?.email || '',
    name: user?.name || '',
    address: '',
    city: '',
    country: '',
    paymentMethod: 'card',
  });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!user) {
      redirect('/auth/login');
    } else {
      const fetchCart = async () => {
        const userCart = await CartService.getCart(user.id);
        setCart(userCart);
      };
      fetchCart();
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    // Process order
    if (!user) return;
    setProcessing(true);

    try {
      await OrderService.createOrder(user.id, formData.paymentMethod, {
        street: formData.address,
        city: formData.city,
        country: formData.country,
      });
      
      redirect('/order-confirmation');
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Error processing order');
    } finally {
      setProcessing(false);
    }
  };

  if (!user || !cart) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pb-16 md:pb-0">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <h1 className="text-3xl font-bold text-dark mb-8">Checkout</h1>

          {/* Step Indicator */}
          <div className="mb-8 flex gap-4">
            {[1, 2, 3].map(s => (
              <div
                key={s}
                className={`flex-1 p-4 text-center rounded-lg font-semibold transition ${
                  step === s
                    ? 'text-white'
                    : 'bg-light text-gray'
                }`}
                style={{ backgroundColor: step === s ? BRAND_COLORS.PRIMARY_GREEN : 'transparent' }}
              >
                Step {s}
              </div>
            ))}
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Form */}
            <form onSubmit={handleSubmit} className="md:col-span-2 space-y-6">
              {step === 1 && (
                <div className="rounded-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-dark mb-4">Contact Information</h2>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 mb-4"
                  />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  />
                </div>
              )}

              {step === 2 && (
                <div className="rounded-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-dark mb-4">Shipping Address</h2>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Street Address"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 mb-4"
                  />
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 mb-4"
                  />
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="Country"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  />
                </div>
              )}

              {step === 3 && (
                <div className="rounded-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-dark mb-4">Payment Method</h2>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  >
                    <option value="card">Credit/Debit Card</option>
                    <option value="paypal">PayPal</option>
                    <option value="bank">Bank Transfer</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={processing}
                className="w-full rounded-lg py-3 font-semibold text-white transition hover:shadow-lg disabled:opacity-50"
                style={{ backgroundColor: BRAND_COLORS.PRIMARY_GREEN }}
              >
                {processing ? 'Processing...' : step === 3 ? 'Complete Order' : 'Next Step'}
              </button>
            </form>

            {/* Order Summary */}
            <div className="rounded-lg bg-light p-6 shadow-elevation-2 h-fit">
              <h2 className="font-bold text-dark mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                {cart.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>Item {idx + 1}</span>
                    <span>${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-300 pt-4">
                <div className="flex justify-between font-bold text-dark">
                  <span>Total:</span>
                  <span className="text-2xl text-primary">${cart.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
