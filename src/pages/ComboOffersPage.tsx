import React from 'react';
import {
  Sparkles,
  ArrowLeft,
  ShoppingBag,
  Check,
  Star,
  Clock,
  Users,
} from 'lucide-react';
import { COMBO_OFFERS, comboToProduct, type ComboOffer } from '../data/combos';
import { useApp } from '../context/AppContext';

interface ComboOffersPageProps {
  onBackToHome: () => void;
}

export const ComboOffersPage: React.FC<ComboOffersPageProps> = ({ onBackToHome }) => {
  const { addToCart, showToast } = useApp();

  const handleAddCombo = (combo: ComboOffer) => {
    const productItem = comboToProduct(combo);
    addToCart(productItem, 1);
    showToast(`🎉 ${combo.name} added to cart! (Saved ₹${combo.savings})`, 'success');
  };

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
        <div className="mb-12 pb-8 border-b border-neutral-200 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-[10.5px] uppercase tracking-[0.2em] mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            CURATED VALUE FEASTS
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-neutral-900 tracking-tight">
            Tasty Bites Combo Offers
          </h1>
          <p className="text-neutral-500 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
            More flavour, more variety, and better value. Find your favourite food combinations in one place. Handcrafted with fresh artisanal ingredients.
          </p>
        </div>

        {/* 6 Combos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 text-left">
          {COMBO_OFFERS.map((combo) => (
            <div
              key={combo.id}
              className="bg-white border border-neutral-200/90 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                {/* Image Container with Badges */}
                <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900">
                  <img
                    src={combo.image}
                    alt={combo.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    {combo.badge && (
                      <span className="bg-amber-500 text-neutral-950 font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        {combo.badge}
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="bg-[#e52e2e] text-white font-extrabold text-[10.5px] px-2.5 py-1 rounded-full shadow-md">
                      SAVE ₹{combo.savings}
                    </span>
                  </div>

                  {/* Bottom Image Stats */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px] font-semibold">
                    <span className="flex items-center gap-1 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md">
                      <Clock className="w-3 h-3 text-amber-400" />
                      {combo.deliveryTime}
                    </span>
                    <span className="flex items-center gap-1 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md">
                      <Users className="w-3 h-3 text-amber-400" />
                      {combo.serves}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 mb-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{combo.rating}</span>
                    <span className="text-neutral-400 font-normal">({combo.reviews} reviews)</span>
                  </div>

                  <h3 className="text-lg font-black text-neutral-900 tracking-tight leading-snug group-hover:text-amber-600 transition-colors">
                    {combo.name}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                    {combo.description}
                  </p>

                  {/* Included Items Checklist */}
                  <div className="mt-4 pt-4 border-t border-neutral-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                      Included in this Combo:
                    </span>
                    <ul className="space-y-1.5 text-xs text-neutral-700">
                      {combo.items.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] shrink-0 font-bold">
                            <Check className="w-2.5 h-2.5" />
                          </span>
                          <span className="font-medium">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Bottom Price & Add to Cart Action */}
              <div className="p-6 pt-0">
                <div className="flex items-center justify-between mb-4 pt-4 border-t border-neutral-100">
                  <div>
                    <span className="text-[10px] text-neutral-400 block">Combo Price</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-[#e52e2e] font-mono">
                        ₹{combo.comboPrice}
                      </span>
                      <span className="text-xs text-neutral-400 line-through font-mono">
                        ₹{combo.regularPrice}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                    Save ₹{combo.savings}
                  </span>
                </div>

                <button
                  onClick={() => handleAddCombo(combo)}
                  className="w-full bg-[#14110f] hover:bg-[#e52e2e] text-white font-bold text-xs sm:text-sm py-3 rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer group/btn"
                >
                  <ShoppingBag className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                  <span>Add Combo to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
