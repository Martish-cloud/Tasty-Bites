import React, { useState } from 'react';
import { X, Star, CheckCircle2, ShieldCheck, User } from 'lucide-react';
import { createDBReview, type Review } from '../services/db';
import { useApp } from '../context/AppContext';

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted?: (newReview: Review) => void;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
];

export const WriteReviewModal: React.FC<WriteReviewModalProps> = ({
  isOpen,
  onClose,
  onReviewSubmitted,
}) => {
  const { showToast, currentUser } = useApp();

  const [name, setName] = useState(currentUser?.name || '');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_PRESETS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please provide your name', 'error');
      return;
    }
    if (comment.trim().length < 10) {
      showToast('Review must be at least 10 characters long', 'error');
      return;
    }

    setIsSubmitting(true);
    const result = createDBReview({
      name,
      rating,
      comment,
      avatar: selectedAvatar,
      orderNumber: orderNumber.trim() || undefined,
    });
    setIsSubmitting(false);

    if (result.success && result.review) {
      showToast(
        result.review.isVerifiedPurchase
          ? '🎉 Thank you! Your verified purchase review is now live.'
          : '🎉 Thank you! Your review has been published.',
        'success'
      );
      if (onReviewSubmitted) {
        onReviewSubmitted(result.review);
      }
      setComment('');
      setOrderNumber('');
      onClose();
    } else {
      showToast(result.error || 'Failed to submit review.', 'error');
    }
  };

  const activeStarCount = hoverRating ?? rating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10 text-left animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#14110f] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-[10px] uppercase tracking-wider mb-2 border border-amber-500/30">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            CUSTOMER FEEDBACK
          </div>
          <h3 className="text-xl font-bold text-white">Share Your Dining Experience</h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Your honest rating helps fellow food lovers and guides our master kitchen.
          </p>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4.5">
          {/* Star Rating Selector */}
          <div>
            <label className="text-xs font-bold text-neutral-800 block mb-1.5">
              Overall Rating ({activeStarCount} of 5 Stars)
            </label>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-neutral-50 border border-neutral-200 px-3 py-2 rounded-xl">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    onClick={() => setRating(star)}
                    className="p-1 cursor-pointer transition-transform hover:scale-120 focus:outline-none"
                    aria-label={`Rate ${star} stars out of 5`}
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        star <= activeStarCount
                          ? 'text-amber-500 fill-amber-500'
                          : 'text-neutral-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-neutral-700 bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1.5 rounded-lg">
                {activeStarCount === 5
                  ? 'Excellent 🌟'
                  : activeStarCount === 4
                  ? 'Very Good 👍'
                  : activeStarCount === 3
                  ? 'Average 👌'
                  : activeStarCount === 2
                  ? 'Needs Work 😕'
                  : 'Disappointed 👎'}
              </span>
            </div>
          </div>

          {/* Name Input */}
          <div>
            <label className="text-xs font-bold text-neutral-800 block mb-1">
              Your Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <User className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-500 bg-neutral-50"
              />
            </div>
          </div>

          {/* Review Text */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-neutral-800">
                Your Review <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10.5px] text-neutral-400">
                {comment.length} / 500 characters
              </span>
            </div>
            <textarea
              required
              rows={3}
              maxLength={500}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What made your dish special? How was the food temperature, flavour, and delivery?"
              className="w-full text-xs p-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-500 bg-neutral-50 resize-none leading-relaxed"
            />
          </div>

          {/* Optional Order Verification */}
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <label className="text-xs font-bold text-neutral-800">
                Order ID for Verified Badge (Optional)
              </label>
            </div>
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="e.g. TB-842910 (grants Verified Purchase badge)"
              className="w-full text-xs px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-500 bg-neutral-50 font-mono"
            />
            <span className="text-[10px] text-neutral-400 mt-0.5 block">
              If your order ID matches our database, a green Verified Purchase badge will be awarded.
            </span>
          </div>

          {/* Avatar Preset Selection */}
          <div>
            <label className="text-xs font-bold text-neutral-800 block mb-1.5">
              Select Avatar
            </label>
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
              {AVATAR_PRESETS.map((av, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedAvatar(av)}
                  className={`relative rounded-full transition-all shrink-0 cursor-pointer ${
                    selectedAvatar === av
                      ? 'ring-2 ring-amber-500 ring-offset-2 scale-105'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={av}
                    alt={`Avatar ${idx + 1}`}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  {selectedAvatar === av && (
                    <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-500 text-neutral-950 rounded-full flex items-center justify-center text-[8px] font-bold">
                      ✓
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs py-3 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-2/3 bg-[#e52e2e] hover:bg-[#cc2222] text-white font-bold text-xs py-3 rounded-xl shadow-md transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Publishing...' : 'Submit Review'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
