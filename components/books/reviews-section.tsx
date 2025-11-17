'use client';

import { useState } from 'react';
import { Star, ThumbsUp, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { BRAND_COLORS } from '@/lib/constants';

interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  content: string;
  date: Date;
  helpful: number;
  verified: boolean;
}

interface ReviewsSectionProps {
  bookId: string;
  reviews: Review[];
  average: number;
  distribution: Record<number, number>;
  total: number;
  onSubmitReview?: (review: any) => Promise<void>;
}

export function ReviewsSection({
  bookId,
  reviews = [],
  average = 0,
  distribution = {},
  total = 0,
  onSubmitReview
}: ReviewsSectionProps) {
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await onSubmitReview?.({
        rating,
        title,
        content
      });

      setTitle('');
      setContent('');
      setRating(5);
      setShowWriteReview(false);
    } catch (error) {
      console.error('[v0] Failed to submit review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-12 border-t">
      <h2 className="text-2xl font-bold text-dark mb-8">Customer Reviews</h2>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Rating Summary */}
        <div className="md:col-span-1 p-6 rounded-lg" style={{ backgroundColor: BRAND_COLORS.MINTED_GLOW }}>
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-dark">{average.toFixed(1)}</div>
            <div className="flex justify-center gap-1 my-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4"
                  fill={i < Math.round(average) ? BRAND_COLORS.PRIMARY_GREEN : '#e5e7eb'}
                  color={i < Math.round(average) ? BRAND_COLORS.PRIMARY_GREEN : '#e5e7eb'}
                />
              ))}
            </div>
            <p className="text-sm text-gray">{total} reviews</p>
          </div>

          {/* Distribution Bars */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(rating => {
              const count = distribution[rating] || 0;
              const percent = total > 0 ? (count / total) * 100 : 0;
              return (
                <div key={rating} className="flex items-center gap-2 text-sm">
                  <span className="text-gray w-8">{rating}★</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded overflow-hidden">
                    <div
                      className="h-full transition"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: BRAND_COLORS.PRIMARY_GREEN
                      }}
                    />
                  </div>
                  <span className="text-gray w-10">{count}</span>
                </div>
              );
            })}
          </div>

          <Button
            onClick={() => setShowWriteReview(!showWriteReview)}
            className="w-full mt-6 text-white"
            style={{ backgroundColor: BRAND_COLORS.PRIMARY_GREEN }}
          >
            Write a Review
          </Button>
        </div>

        {/* Reviews List */}
        <div className="md:col-span-2">
          {showWriteReview && (
            <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-lg">
              <h3 className="font-semibold text-dark mb-4">Write Your Review</h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-dark mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRating(r)}
                      className="p-1 transition"
                    >
                      <Star
                        className="w-6 h-6"
                        fill={r <= rating ? BRAND_COLORS.PRIMARY_GREEN : '#e5e7eb'}
                        color={r <= rating ? BRAND_COLORS.PRIMARY_GREEN : '#e5e7eb'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <input
                type="text"
                placeholder="Review title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded mb-3"
              />

              <Textarea
                placeholder="Share your thoughts about this book..."
                value={content}
                onChange={e => setContent(e.target.value)}
                required
                rows={4}
                className="mb-3"
              />

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="text-white"
                  style={{ backgroundColor: BRAND_COLORS.PRIMARY_GREEN }}
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowWriteReview(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {/* Individual Reviews */}
          <div className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map(review => (
                <div key={review.id} className="p-4 border rounded-lg hover:shadow-elevation-2 transition">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {review.userAvatar && (
                        <img
                          src={review.userAvatar || "/placeholder.svg"}
                          alt={review.userName}
                          className="w-10 h-10 rounded-full object-cover"
                          width={40}
                          height={40}
                        />
                      )}
                      <div>
                        <p className="font-semibold text-dark">{review.userName}</p>
                        <p className="text-xs text-gray">
                          {new Date(review.date).toLocaleDateString()}
                          {review.verified && ' • Verified Purchase'}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3"
                          fill={i < review.rating ? BRAND_COLORS.PRIMARY_GREEN : '#e5e7eb'}
                          color={i < review.rating ? BRAND_COLORS.PRIMARY_GREEN : '#e5e7eb'}
                        />
                      ))}
                    </div>
                  </div>

                  <h4 className="font-semibold text-dark mb-2">{review.title}</h4>
                  <p className="text-gray mb-3">{review.content}</p>

                  <button className="flex items-center gap-2 text-sm text-gray hover:text-dark transition">
                    <ThumbsUp className="w-4 h-4" />
                    Helpful ({review.helpful})
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray text-center py-8">No reviews yet. Be the first!</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
