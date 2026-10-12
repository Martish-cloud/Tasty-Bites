import React, { useState, useMemo } from 'react';
import {
  Star,
  ShieldCheck,
  MessageSquarePlus,
  ArrowLeft,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import {
  getDBReviews,
  getAverageRating,
  getRatingDistribution,
  type Review,
} from '../services/db';
import { WriteReviewModal } from '../components/WriteReviewModal';

interface AllReviewsPageProps {
  onBackToHome: () => void;
}

export const AllReviewsPage: React.FC<AllReviewsPageProps> = ({ onBackToHome }) => {
  const [reviews, setReviews] = useState<Review[]>(() => getDBReviews());
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | number>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'lowest'>('recent');

  const { average, count } = getAverageRating();
  const distribution = getRatingDistribution();

  const handleReviewAdded = (newReview: Review) => {
    setReviews([newReview, ...reviews]);
  };

  const filteredReviews = useMemo(() => {
    let list = [...reviews];
    if (selectedFilter !== 'all') {
      list = list.filter((r) => Math.round(r.rating) === selectedFilter);
    }
    if (sortBy === 'recent') {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'highest') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'lowest') {
      list.sort((a, b) => a.rating - b.rating);
    }
    return list;
  }, [reviews, selectedFilter, sortBy]);

  return (
    <div className="w-full bg-[#f8f9fa] text-neutral-900 min-h-screen py-10 sm:py-14 animate-in fade-in duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Back Link */}
        <div className="mb-6 text-left">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-neutral-950 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to TastyBites Home</span>
          </button>
        </div>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10 pb-8 border-b border-neutral-200 text-left">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-[10.5px] uppercase tracking-[0.2em] mb-2">
              <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
              AUTHENTIC CUSTOMER TESTIMONIALS
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-neutral-900 tracking-tight">
              Customer Reviews & Ratings
            </h1>
            <p className="text-neutral-500 text-xs sm:text-sm mt-1 max-w-xl">
              Browse transparent feedback from foodies across all our hubs. Every review is recorded in our verified feedback system.
            </p>
          </div>

          <button
            onClick={() => setIsWriteModalOpen(true)}
            className="bg-[#e52e2e] hover:bg-[#cc2222] text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-all shadow-md shadow-red-900/20 flex items-center gap-2 cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Top Summary Card with Rating Distribution */}
        <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-8 shadow-xs mb-10 text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Score box */}
            <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-neutral-200 pb-6 lg:pb-0 lg:pr-8 text-center sm:text-left">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                OVERALL RATING
              </span>
              <div className="flex items-baseline justify-center sm:justify-start gap-2">
                <span className="text-5xl sm:text-6xl font-black text-neutral-900 tracking-tight">
                  {average}
                </span>
                <span className="text-neutral-400 text-lg font-bold">/ 5.0</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-1 my-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-5 h-5 ${
                      s <= Math.round(average)
                        ? 'text-amber-500 fill-amber-500'
                        : 'text-neutral-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-neutral-500">
                Calculated from <strong>{count} verified reviews</strong>
              </p>
            </div>

            {/* Distribution bars */}
            <div className="lg:col-span-8 space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => {
                const num = distribution[stars] || 0;
                const pct = count > 0 ? Math.round((num / count) * 100) : 0;
                return (
                  <div key={stars} className="flex items-center gap-3 text-xs">
                    <span className="w-12 font-bold text-neutral-700 flex items-center gap-1 shrink-0">
                      <span>{stars}</span>
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    </span>
                    <div className="flex-1 h-2.5 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-14 text-right text-neutral-400 font-mono text-[11px]">
                      {num} ({pct}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Filter and Sort Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl border border-neutral-200/80 text-left">
          {/* Star Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold text-neutral-500 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {(['all', 5, 4, 3, 2, 1] as const).map((filterVal) => (
              <button
                key={filterVal}
                onClick={() => setSelectedFilter(filterVal)}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedFilter === filterVal
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                }`}
              >
                {filterVal === 'all' ? 'All Reviews' : `${filterVal} Stars`}
              </button>
            ))}
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-neutral-500 font-bold">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-1.5 font-semibold text-neutral-800 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
            </select>
          </div>
        </div>

        {/* Reviews Grid */}
        {filteredReviews.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200 space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-xl">
              ⭐
            </div>
            <h3 className="text-base font-bold text-neutral-800">No reviews found matching this filter</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Be the first to share your thoughts on this rating!
            </p>
            <button
              onClick={() => setSelectedFilter('all')}
              className="mt-2 text-xs font-bold text-amber-600 hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
            {filteredReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-amber-400/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={rev.avatar}
                        alt={rev.name}
                        className="w-11 h-11 rounded-full object-cover border border-neutral-200 shrink-0"
                        loading="lazy"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-neutral-900">
                          {rev.name}
                        </h4>
                        <div className="flex items-center gap-1 mt-0.5">
                          {rev.isVerifiedPurchase ? (
                            <span className="inline-flex items-center gap-0.5 text-[9.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                              <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
                              Verified Order
                            </span>
                          ) : rev.isSample ? (
                            <span className="text-[9.5px] font-medium text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded">
                              Demo Review
                            </span>
                          ) : (
                            <span className="text-[9.5px] text-neutral-400">Customer</span>
                          )}
                          <span className="text-[10px] text-neutral-400">• {rev.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-lg text-xs font-bold font-mono">
                      {rev.rating}.0★
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-0.5 mb-2.5">
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
                  </div>

                  {/* Content */}
                  <p className="text-xs text-neutral-600 leading-relaxed italic">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                {rev.orderNumber && (
                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-[10px] text-neutral-400">
                    <span>Order Ref: <strong className="font-mono text-neutral-700">{rev.orderNumber}</strong></span>
                    <span className="text-emerald-600 flex items-center gap-0.5 font-bold">
                      <CheckCircle2 className="w-3 h-3" /> Authenticated
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Write Review Form Modal */}
      <WriteReviewModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        onReviewSubmitted={handleReviewAdded}
      />
    </div>
  );
};
