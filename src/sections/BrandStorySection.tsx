import React from 'react';
import { Flame, ShieldCheck, Clock, Sparkles, ChefHat } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BrandStorySection: React.FC = () => {
  const { setIsMenuModalOpen } = useApp();

  return (
    <section id="brand-story" className="w-full bg-[#14110f] text-white py-16 sm:py-24 border-t border-neutral-800/80 relative overflow-hidden">
      {/* Warm Ambient Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Top Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
          {/* Left Text (6 cols) */}
          <div className="lg:col-span-7 text-left space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-amber-500/30 text-amber-400 font-bold text-[10.5px] uppercase tracking-[0.2em]">
              <Sparkles className="w-3 h-3 text-amber-400" />
              THE TASTYBITES PHILOSOPHY
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.1]">
              Crafted With Passion.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500">
                Delivered With Care.
              </span>
            </h2>

            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed max-w-xl">
              At TastyBites, food is not merely sustenance — it is a joyful celebration of ingredients, heritage, and human connection. We believe every bite should taste as good as a meal prepared in an award-winning boutique kitchen.
            </p>

            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-xl">
              From our 450°C wood-fired hearths to our roaring cast-iron wok stations, our culinary masters prepare every dish fresh to order. No frozen shortcuts. No pre-cooked batches. Just honest, delicious food.
            </p>

            <div className="pt-2">
              <button
                onClick={() => setIsMenuModalOpen(true)}
                className="bg-[#e52e2e] hover:bg-[#cc2222] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-lg shadow-red-900/30 hover:shadow-red-600/40 cursor-pointer"
              >
                Explore Today&apos;s Fresh Menu
              </button>
            </div>
          </div>

          {/* Right Visual Collage (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-neutral-700/80 shadow-2xl bg-neutral-900 aspect-[4/3]">
              <img
                src="/Images/TastyBites Burger Cafe at Dusk.png"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/Images/TastyBites Burger Café at Dusk.png';
                }}
                alt="TastyBites Burger Café at Dusk"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Floating Badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-black/75 backdrop-blur-md p-3.5 rounded-2xl border border-neutral-700/70 text-left flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <ChefHat className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Master Kitchen Standards</h4>
                  <p className="text-[10.5px] text-neutral-300">Handcrafted by executive culinary artisans</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Pillar 1 */}
          <div className="bg-neutral-900/80 border border-neutral-800 p-6 rounded-2xl hover:border-amber-500/40 transition-all group">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mb-4 group-hover:scale-108 transition-transform">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Wood-Fired & Wok Charred</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Authentic high-heat cooking seals in natural moisture and infuses each recipe with signature smoky aromas that cannot be replicated.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-neutral-900/80 border border-neutral-800 p-6 rounded-2xl hover:border-emerald-500/40 transition-all group">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-108 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">100% Farm-Direct Sourcing</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Crisp hydroponic greens, cold-pressed artisanal oils, dairy churned within 24 hours, and ethically reared premium cuts.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-neutral-900/80 border border-neutral-800 p-6 rounded-2xl hover:border-red-500/40 transition-all group">
            <div className="w-11 h-11 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center mb-4 group-hover:scale-108 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Thermal Insulated Express</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Custom multi-layer thermal carriers ensure hot pizzas stay blisteringly crisp and cold artisanal beverages arrive refreshingly chilled.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
