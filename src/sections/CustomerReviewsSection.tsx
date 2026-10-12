import React, { useState } from 'react';
import { Star, ShieldCheck, MessageSquarePlus, ArrowRight, Quote } from 'lucide-react';
import { getDBReviews, getAverageRating, type Review } from '../services/db';
import { WriteReviewModal } from '../components/WriteReviewModal';

interface CustomerReviewsSectionProps {
  onViewAllReviews: () => void;
}

export const CustomerReviewsSection: React.FC<CustomerReviewsSectionProps> = ({
  onViewAllReviews,
}) => {
  const [reviews, setReviews] = useState<Review[]>(() => getDBReviews());
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  const { average, count } = getAverageRating();
  // Display initial 4-5 cards
  const displayReviews = reviews.slice(0, 4);

  const handleReviewAdded = (newReview: Review) => {
    setReviews([newReview, ...reviews]);
  };

  return (
    <section id="customer-reviews" className="w-full bg-[#fbfbfb] text-neutral-900 py-16 sm:py-20 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12 text-left">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-[10.5px] uppercase tracking-[0.2em] mb-2.5">
              <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
              CUSTOMER REVIEWS & TESTIMONIALS
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral-900 tracking-tight">
              What Our Customers Say
            </h2>
            <p className="text-neutral-500 text-xs sm:text-sm mt-1.5 leading-relaxed">
              Real feedback from people who enjoy Tasty Bites. Discover their experiences with our food, quality, and service.
            </p>
          </div>

          {/* Right Header Summary Stats & Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white border border-neutral-200 shadow-xs px-3.5 py-2 rounded-2xl flex items-center gap-3 text-left">
              <div className="text-xl sm:text-2xl font-black text-neutral-900 leading-none">
                {average}
              </div>
              <div>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3 h-3 ${
                        s <= Math.round(average)
                          ? 'text-amber-500 fill-amber-500'
                          : 'text-neutral-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-neutral-500 font-medium">
                  Based on {count} reviews
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsWriteModalOpen(true)}
              className="bg-[#14110f] hover:bg-neutral-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <MessageSquarePlus className="w-3.5 h-3.5 text-amber-400" />
              <span>Write a Review</span>
            </button>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 text-left">
          {displayReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-amber-400/40 transition-all flex flex-col justify-between relative group"
            >
              <div>
                {/* Top: Customer Profile & Stars */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.avatar}
                      alt={rev.name}
                      className="w-11 h-11 rounded-full object-cover border border-neutral-200 shrink-0"
                      loading="lazy"
                    />
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-neutral-900 line-clamp-1">
                        {rev.name}
                      </h4>
                      <div className="flex items-center gap-1 mt-0.5">
                        {rev.isVerifiedPurchase && (
                          <span className="inline-flex items-center gap-0.5 text-[9.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                            <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
                            Verified
                          </span>
                        )}
                        <span className="text-[10px] text-neutral-400">
                          {rev.isVerifiedPurchase ? '• ' : ''}{rev.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Quote className="w-4 h-4 text-neutral-300 group-hover:text-amber-400 transition-colors shrink-0" />
                </div>

                {/* Star Rating */}
                <div className="flex items-center gap-1 mb-2.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= rev.rating
                          ? 'text-amber-500 fill-amber-500'
                          : 'text-neutral-200'
                      }`}
                    />
                  ))}
                  <span className="text-[11px] font-bold text-neutral-700 ml-1">
                    {rev.rating}.0
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-xs text-neutral-600 leading-relaxed italic">
                  {rev.comment}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Navigation to Dedicated All Reviews */}
        <div className="mt-10 text-center flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onViewAllReviews}
            className="inline-flex items-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl border border-amber-300/80 transition-all cursor-pointer shadow-xs group"
          >
            <span>View All {count} Customer Reviews</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Write Review Form Modal */}
      <WriteReviewModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        onReviewSubmitted={handleReviewAdded}
      />
    </section>
  );
};
