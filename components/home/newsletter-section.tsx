'use client';

import { useState } from 'react';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { BRAND_COLORS } from '@/lib/constants';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        setStatus('success');
        setMessage('Thank you for subscribing!');
        setEmail('');
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        const data = await response.json();
        setStatus('error');
        setMessage(data.message || 'Something went wrong');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Failed to subscribe. Please try again.');
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
      <div
        className="rounded-lg p-8 md:p-12 text-center text-white shadow-elevation-3"
        style={{ backgroundColor: BRAND_COLORS.PRIMARY_GREEN }}
      >
        <div className="flex justify-center mb-4">
          <Mail className="w-8 h-8" />
        </div>

        <h2 className="text-2xl md:text-3xl font-bold mb-3">Stay Updated</h2>
        <p className="text-white/90 mb-6 max-w-2xl mx-auto">
          Get the latest books, audiobooks, and Islamic knowledge delivered to your inbox weekly.
        </p>

        <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="flex-1 px-4 py-3 rounded-lg focus:outline-none"
            disabled={status === 'loading'}
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-lg font-semibold transition hover:scale-105 active:scale-95 disabled:opacity-50"
            style={{ backgroundColor: BRAND_COLORS.ACCENT_GOLD, color: BRAND_COLORS.DARK }}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>

        {/* Status Message */}
        {status === 'success' && (
          <div className="mt-4 flex items-center justify-center gap-2 text-white">
            <CheckCircle className="w-5 h-5" />
            <span>{message}</span>
          </div>
        )}
        {status === 'error' && (
          <div className="mt-4 flex items-center justify-center gap-2 text-red-200">
            <AlertCircle className="w-5 h-5" />
            <span>{message}</span>
          </div>
        )}
      </div>
    </section>
  );
}
