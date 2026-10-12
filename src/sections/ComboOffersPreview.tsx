import React from 'react';
import { Sparkles, ArrowRight, ShoppingBag, Check, Star } from 'lucide-react';
import { COMBO_OFFERS, comboToProduct, type ComboOffer } from '../data/combos';
import { useApp } from '../context/AppContext';

interface ComboOffersPreviewProps {
  onExploreAllCombos: () => void;
}

export const ComboOffersPreview: React.FC<ComboOffersPreviewProps> = ({
  onExploreAllCombos,
}) => {
  const { addToCart, showToast } = useApp();

  // Preview 4 compact cards on homepage
  const previewCombos = COMBO_OFFERS.slice(0, 4);

  const handleAddCombo = (combo: ComboOffer) => {
    const productItem = comboToProduct(combo);
    addToCart(productItem, 1);
    showToast(`🎉 ${combo.name} added to cart! (Saved ₹${combo.savings})`, 'success');
  };

  return (
    <section id="combo-offers-section" className="w-full bg-[#f8f9fa] py-14 sm:py-18 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-10 text-left">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-900 font-bold text-[10.5px] uppercase tracking-[0.2em] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#e52e2e]" />
              CHEF-CURATED BUNDLES
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral-900 tracking-tight">
              Special Combo Offers
            </h2>
            <p className="text-neutral-500 text-xs sm:text-sm mt-1">
              Your favourites, thoughtfully combined.
            </p>
          </div>

          <button
            onClick={onExploreAllCombos}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-neutral-900 hover:text-[#e52e2e] transition-colors cursor-pointer group"
          >
            <span>Explore All Combos</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 4 Cards Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-left">
          {previewCombos.map((combo) => (
            <div
              key={combo.id}
              className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Image */}
                <div className="relative aspect-[16/11] overflow-hidden bg-neutral-900">
                  <img
                    src={combo.image}
                    alt={combo.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="bg-amber-500 text-neutral-950 font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {combo.badge}
                    </span>
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    <span className="bg-[#e52e2e] text-white font-extrabold text-[9.5px] px-2 py-0.5 rounded-full shadow-xs">
                      SAVE ₹{combo.savings}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4">
                  <div className="flex items-center gap-1 text-[10.5px] font-bold text-amber-600 mb-1">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>{combo.rating}</span>
                  </div>

                  <h3 className="font-bold text-xs sm:text-sm text-neutral-900 leading-snug line-clamp-1 group-hover:text-amber-600 transition-colors">
                    {combo.name}
                  </h3>
                  <p className="text-[11px] text-neutral-500 mt-1 line-clamp-2">
                    {combo.description}
                  </p>

                  {/* Included Items Checklist */}
                  <div className="mt-3 pt-3 border-t border-neutral-100">
                    <ul className="space-y-1 text-[11px] text-neutral-600">
                      {combo.items.slice(0, 2).map((item, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 truncate">
                          <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="truncate">{item}</span>
                        </li>
                      ))}
                      {combo.items.length > 2 && (
                        <li className="text-[10px] text-neutral-400 pl-4.5 italic">
                          + {combo.items.length - 2} more item
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="p-4 pt-0">
                <div className="flex items-baseline justify-between mb-3 pt-2.5 border-t border-neutral-100">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-black text-[#e52e2e] font-mono">
                      ₹{combo.comboPrice}
                    </span>
                    <span className="text-xs text-neutral-400 line-through font-mono">
                      ₹{combo.regularPrice}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                    -₹{combo.savings}
                  </span>
                </div>

                <button
                  onClick={() => handleAddCombo(combo)}
                  className="w-full bg-[#14110f] hover:bg-[#e52e2e] text-white font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add Combo</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
