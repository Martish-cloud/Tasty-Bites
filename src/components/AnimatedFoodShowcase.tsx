import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { ProductCard } from './ProductCard';
import { useApp } from '../context/AppContext';

export const AnimatedFoodShowcase: React.FC = () => {
  const { setIsMenuModalOpen } = useApp();

  // Curate 4 distinct sets of 8 products (32 total unique dishes)
  // Row 1: Burgers & Starters (Left to Right)
  const row1Products = [
    PRODUCTS.find((p) => p.id === 'classic-burger')!,
    PRODUCTS.find((p) => p.id === 'smoky-bbq-burger')!,
    PRODUCTS.find((p) => p.id === 'truffle-mushroom-burger')!,
    PRODUCTS.find((p) => p.id === 'crispy-paneer-burger')!,
    PRODUCTS.find((p) => p.id === 'chicken-wings')!,
    PRODUCTS.find((p) => p.id === 'grilled-chicken')!,
    PRODUCTS.find((p) => p.id === 'chicken-caesar-salad')!,
    PRODUCTS.find((p) => p.id === 'mediterranean-greek-salad')!,
  ].filter(Boolean);

  // Row 2: Pizzas & Pastas (Right to Left)
  const row2Products = [
    PRODUCTS.find((p) => p.id === 'margherita-pizza')!,
    PRODUCTS.find((p) => p.id === 'pepperoni-overload-pizza')!,
    PRODUCTS.find((p) => p.id === 'farmhouse-supreme-pizza')!,
    PRODUCTS.find((p) => p.id === 'smoky-bbq-chicken-pizza')!,
    PRODUCTS.find((p) => p.id === 'pasta-alfredo')!,
    PRODUCTS.find((p) => p.id === 'truffle-tagliatelle')!,
    PRODUCTS.find((p) => p.id === 'avocado-quinoa-bowl')!,
    PRODUCTS.find((p) => p.id === 'steamed-dim-sums')!,
  ].filter(Boolean);

  // Row 3: Indian Biryanis & Curries & Asian (Left to Right)
  const row3Products = [
    PRODUCTS.find((p) => p.id === 'chicken-dum-biryani')!,
    PRODUCTS.find((p) => p.id === 'veg-biryani')!,
    PRODUCTS.find((p) => p.id === 'paneer-butter-masala')!,
    PRODUCTS.find((p) => p.id === 'dal-makhani-combo')!,
    PRODUCTS.find((p) => p.id === 'tandoori-soya-chaap')!,
    PRODUCTS.find((p) => p.id === 'schezwan-fried-rice')!,
    PRODUCTS.find((p) => p.id === 'chilli-garlic-noodles')!,
    PRODUCTS.find((p) => p.id === 'kung-pao-chicken')!,
  ].filter(Boolean);

  // Row 4: Desserts & Handcrafted Beverages (Right to Left)
  const row4Products = [
    PRODUCTS.find((p) => p.id === 'molten-chocolate-lava')!,
    PRODUCTS.find((p) => p.id === 'blueberry-cheesecake')!,
    PRODUCTS.find((p) => p.id === 'churros-con-chocolate')!,
    PRODUCTS.find((p) => p.id === 'tiramisu-classico')!,
    PRODUCTS.find((p) => p.id === 'mango-velvet-smoothie')!,
    PRODUCTS.find((p) => p.id === 'berry-hibiscus-brew')!,
    PRODUCTS.find((p) => p.id === 'iced-caramel-macchiato')!,
    PRODUCTS.find((p) => p.id === 'passion-fruit-mint-cooler')!,
  ].filter(Boolean);

  return (
    <section className="w-full bg-[#0e0d0c] text-white py-14 sm:py-20 border-y border-neutral-800/60 overflow-hidden relative selection:bg-amber-500 selection:text-white">
      {/* Ambient Atmospheric Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.12),transparent_65%)] pointer-events-none" />
      <div className="absolute -bottom-24 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-10 text-center relative z-10">
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-amber-500/30 text-amber-400 font-bold tracking-[0.2em] text-[10.5px] uppercase shadow-md">
            <Sparkles className="w-3 h-3 text-amber-400" />
            CURATED CULINARY VARIETY
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-3">
          Explore Our Delicious Collection
        </h2>

        <p className="text-neutral-400 text-xs sm:text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          Discover delicious choices prepared to make every meal special. Four curated culinary tracks freshly crafted by master chefs.
        </p>

        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            onClick={() => setIsMenuModalOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer transition-colors"
          >
            <span>Browse Full Categorized Menu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4 Animated Rows */}
      <div className="space-y-6 sm:space-y-8 relative z-10">
        {/* ROW 1: Burgers & Sandwiches (Left to Right) */}
        <div className="space-y-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between text-left">
            <span className="text-[11px] font-bold text-amber-400/90 uppercase tracking-wider flex items-center gap-1.5">
              <span>🍔 Row 1: Handcrafted Burgers & Crispy Starters</span>
              <span className="text-neutral-600 font-normal">→ Left to Right</span>
            </span>
          </div>

          <div className="relative w-full overflow-hidden mask-gradient-x">
            <div
              className="flex items-stretch gap-3.5 sm:gap-4 animate-marquee-ltr pause-on-hover py-2"
              style={{ '--marquee-duration': '34s' } as React.CSSProperties}
            >
              {[...row1Products, ...row1Products].map((dish, idx) => (
                <div
                  key={`${dish.id}-r1-${idx}`}
                  className="w-56 sm:w-64 shrink-0 transition-all duration-300 hover:scale-105 hover:z-20"
                >
                  <ProductCard product={dish} compact />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ROW 2: Pizzas & Pastas (Right to Left) */}
        <div className="space-y-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between text-left">
            <span className="text-[11px] font-bold text-amber-400/90 uppercase tracking-wider flex items-center gap-1.5">
              <span>🍕 Row 2: Wood-Fired Pizzas & Artisanal Pastas</span>
              <span className="text-neutral-600 font-normal">← Right to Left</span>
            </span>
          </div>

          <div className="relative w-full overflow-hidden mask-gradient-x">
            <div
              className="flex items-stretch gap-3.5 sm:gap-4 animate-marquee-rtl pause-on-hover py-2"
              style={{ '--marquee-duration': '38s' } as React.CSSProperties}
            >
              {[...row2Products, ...row2Products].map((dish, idx) => (
                <div
                  key={`${dish.id}-r2-${idx}`}
                  className="w-56 sm:w-64 shrink-0 transition-all duration-300 hover:scale-105 hover:z-20"
                >
                  <ProductCard product={dish} compact />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ROW 3: Royal Dum Biryanis & Asian (Left to Right) */}
        <div className="space-y-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between text-left">
            <span className="text-[11px] font-bold text-amber-400/90 uppercase tracking-wider flex items-center gap-1.5">
              <span>🍛 Row 3: Royal Dum Biryanis, Curries & High-Wok Asian</span>
              <span className="text-neutral-600 font-normal">→ Left to Right</span>
            </span>
          </div>

          <div className="relative w-full overflow-hidden mask-gradient-x">
            <div
              className="flex items-stretch gap-3.5 sm:gap-4 animate-marquee-ltr pause-on-hover py-2"
              style={{ '--marquee-duration': '42s' } as React.CSSProperties}
            >
              {[...row3Products, ...row3Products].map((dish, idx) => (
                <div
                  key={`${dish.id}-r3-${idx}`}
                  className="w-56 sm:w-64 shrink-0 transition-all duration-300 hover:scale-105 hover:z-20"
                >
                  <ProductCard product={dish} compact />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ROW 4: Desserts & Handcrafted Coolers (Right to Left) */}
        <div className="space-y-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between text-left">
            <span className="text-[11px] font-bold text-amber-400/90 uppercase tracking-wider flex items-center gap-1.5">
              <span>🧁 Row 4: Indulgent Desserts & Handcrafted Coolers</span>
              <span className="text-neutral-600 font-normal">← Right to Left</span>
            </span>
          </div>

          <div className="relative w-full overflow-hidden mask-gradient-x">
            <div
              className="flex items-stretch gap-3.5 sm:gap-4 animate-marquee-rtl pause-on-hover py-2"
              style={{ '--marquee-duration': '36s' } as React.CSSProperties}
            >
              {[...row4Products, ...row4Products].map((dish, idx) => (
                <div
                  key={`${dish.id}-r4-${idx}`}
                  className="w-56 sm:w-64 shrink-0 transition-all duration-300 hover:scale-105 hover:z-20"
                >
                  <ProductCard product={dish} compact />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
