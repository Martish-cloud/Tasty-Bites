import { X, Tag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PROMO_CODES } from '../data/products';

export const OffersModal: React.FC = () => {
  const { isOffersModalOpen, setIsOffersModalOpen, applyPromo, setIsCartOpen } = useApp();


  if (!isOffersModalOpen) return null;

  const handleApplyOffer = (code: string) => {
    applyPromo(code);
    setIsOffersModalOpen(false);
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={() => setIsOffersModalOpen(false)}
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10 text-left animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-amber-500 text-neutral-950">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <Tag className="w-5 h-5 text-neutral-950" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight text-neutral-950">
                Exclusive Deals & Offers
              </h3>
              <p className="text-xs font-semibold text-neutral-900">
                Save big on every TastyBites order!
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsOffersModalOpen(false)}
            className="w-8 h-8 rounded-full bg-black/10 text-neutral-900 hover:bg-black/20 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Coupons list */}
        <div className="p-5 space-y-3">
          {PROMO_CODES.map((promo) => (
            <div
              key={promo.code}
              className="border-2 border-dashed border-amber-300 rounded-2xl p-4 bg-amber-50/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-amber-400 transition"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-amber-400 text-neutral-950 font-black text-xs px-2.5 py-1 rounded-md uppercase tracking-wider">
                    {promo.code}
                  </span>
                  {promo.discountPercentage && (
                    <span className="text-xs font-extrabold text-red-600">
                      {promo.discountPercentage}% OFF
                    </span>
                  )}
                  {promo.discountAmount && (
                    <span className="text-xs font-extrabold text-emerald-600">
                      ₹{promo.discountAmount} FLAT OFF
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-600 mt-1.5 font-medium leading-relaxed">
                  {promo.description}
                </p>
                <span className="text-[10px] text-neutral-400 block mt-1">
                  Valid on orders above ₹{promo.minOrder}
                </span>
              </div>

              <button
                onClick={() => handleApplyOffer(promo.code)}
                className="bg-[#e52e2e] hover:bg-[#cc2222] text-white font-bold text-xs px-4 py-2 rounded-xl shrink-0 shadow-xs hover:shadow-md transition cursor-pointer"
              >
                Apply Coupon
              </button>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-100 text-center text-xs text-neutral-500">
          Coupons cannot be stacked. Highest applicable discount will be applied.
        </div>
      </div>
    </div>
  );
};
