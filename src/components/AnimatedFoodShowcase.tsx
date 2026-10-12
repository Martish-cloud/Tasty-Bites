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
    PRODUCTS.find((p) => p.id === 'truffle-mushroom-burger')!, // Uses /images/one/Truffle Mushroom Swiss Burger.png
    PRODUCTS.find((p) => p.id === 'crispy-paneer-burger')!,
    PRODUCTS.find((p) => p.id === 'chicken-wings')!,
    PRODUCTS.find((p) => p.id === 'grilled-chicken')!,
    PRODUCTS.find((p) => p.id === 'chicken-caesar-salad')!, // Uses /images/one/Charred Chicken Caesar Bowl.png
    PRODUCTS.find((p) => p.id === 'mediterranean-greek-salad')!,
  ].filter(Boolean);

  // Row 2: Pizzas & Pastas (Right to Left)
  const row2Products = [
    PRODUCTS.find((p) => p.id === 'margherita-pizza')!,
    PRODUCTS.find((p) => p.id === 'pepperoni-overload-pizza')!,
    PRODUCTS.find((p) => p.id === 'farmhouse-supreme-pizza')!,
    PRODUCTS.find((p) => p.id === 'smoky-bbq-chicken-pizza')!,
    PRODUCTS.find((p) => p.id === 'pasta-alfredo')!, // Uses /images/one/Pasta Alfredo.png
    PRODUCTS.find((p) => p.id === 'truffle-tagliatelle')!, // Uses /images/one/Black Truffle Tagliatelle.png
    PRODUCTS.find((p) => p.id === 'avocado-quinoa-bowl')!,
    PRODUCTS.find((p) => p.id === 'steamed-dim-sums')!,
  ].filter(Boolean);

  // Row 3: Indian Biryanis & Curries & Asian (Left to Right)
  const row3Products = [
    PRODUCTS.find((p) => p.id === 'chicken-dum-biryani')!,
    PRODUCTS.find((p) => p.id === 'veg-biryani')!,
    PRODUCTS.find((p) => p.id === 'paneer-butter-masala')!,
    PRODUCTS.find((p) => p.id === 'dal-makhani-combo')!, // Uses /images/one/Slow Simmered Dal Makhani.png
    PRODUCTS.find((p) => p.id === 'tandoori-soya-chaap')!, // Uses /images/one/Tandoori Soya Chaap Tikka.png
    PRODUCTS.find((p) => p.id === 'schezwan-fried-rice')!, // Uses /images/one/Wok Schezwan Fried Rice.png
    PRODUCTS.find((p) => p.id === 'chilli-garlic-noodles')!,
    PRODUCTS.find((p) => p.id === 'kung-pao-chicken')!, // Uses /images/one/Kung Pao Chicken.png
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
    <section className="w-full bg-[#0e0d0c] text-white py-8 sm:py-12 border-y border-neutral-800/60 overflow-hidden relative selection:bg-amber-500 selection:text-white">
      {/* Ambient Atmospheric Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.12),transparent_65%)] pointer-events-none" />
      <div className="absolute -bottom-24 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header: Compact & Cohesive */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-5 sm:mb-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-900 border border-amber-500/30 text-amber-400 font-bold tracking-[0.18em] text-[10px] uppercase shadow-xs mb-1.5">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Curated Culinary Variety</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
            Explore Our Delicious Collection
          </h2>

          <p className="text-neutral-400 text-xs sm:text-sm mt-1 max-w-2xl">
            Handcrafted Burgers, Wood-Fired Pizzas, Royal Dum Biryanis & Artisanal Desserts
          </p>
        </div>

        <button
          onClick={() => setIsMenuModalOpen(true)}
          className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-bold px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition cursor-pointer shrink-0"
        >
          <span>Full Menu</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4 Animated Rows: Row 1 & 2 visible in initial viewport, Row 3 & 4 via natural vertical scrolling */}
      <div className="space-y-3 sm:space-y-4 relative z-10">
        {/* ROW 1: Burgers & Starters (Left to Right) */}
        <div className="relative w-full overflow-hidden mask-gradient-x">
          <div
            className="flex items-stretch gap-3 sm:gap-3.5 animate-marquee-ltr pause-on-hover py-0.5"
            style={{ '--marquee-duration': '32s' } as React.CSSProperties}
          >
            {[...row1Products, ...row1Products].map((dish, idx) => (
              <div
                key={`${dish.id}-r1-${idx}`}
                className="w-48 sm:w-52 shrink-0 transition-all duration-300 hover:scale-103 hover:z-20"
              >
                <ProductCard product={dish} compact />
              </div>
            ))}
          </div>
        </div>

        {/* ROW 2: Pizzas & Pastas (Right to Left) */}
        <div className="relative w-full overflow-hidden mask-gradient-x">
          <div
            className="flex items-stretch gap-3 sm:gap-3.5 animate-marquee-rtl pause-on-hover py-0.5"
            style={{ '--marquee-duration': '34s' } as React.CSSProperties}
          >
            {[...row2Products, ...row2Products].map((dish, idx) => (
              <div
                key={`${dish.id}-r2-${idx}`}
                className="w-48 sm:w-52 shrink-0 transition-all duration-300 hover:scale-103 hover:z-20"
              >
                <ProductCard product={dish} compact />
              </div>
            ))}
          </div>
        </div>

        {/* ROW 3: Royal Dum Biryanis & Asian (Left to Right - Discovered on natural scroll) */}
        <div className="relative w-full overflow-hidden mask-gradient-x pt-2 sm:pt-4">
          <div
            className="flex items-stretch gap-3 sm:gap-3.5 animate-marquee-ltr pause-on-hover py-0.5"
            style={{ '--marquee-duration': '34s' } as React.CSSProperties}
          >
            {[...row3Products, ...row3Products].map((dish, idx) => (
              <div
                key={`${dish.id}-r3-${idx}`}
                className="w-48 sm:w-52 shrink-0 transition-all duration-300 hover:scale-103 hover:z-20"
              >
                <ProductCard product={dish} compact />
              </div>
            ))}
          </div>
        </div>

        {/* ROW 4: Desserts & Handcrafted Beverages (Right to Left) */}
        <div className="relative w-full overflow-hidden mask-gradient-x">
          <div
            className="flex items-stretch gap-3 sm:gap-3.5 animate-marquee-rtl pause-on-hover py-0.5"
            style={{ '--marquee-duration': '32s' } as React.CSSProperties}
          >
            {[...row4Products, ...row4Products].map((dish, idx) => (
              <div
                key={`${dish.id}-r4-${idx}`}
                className="w-48 sm:w-52 shrink-0 transition-all duration-300 hover:scale-103 hover:z-20"
              >
                <ProductCard product={dish} compact />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
