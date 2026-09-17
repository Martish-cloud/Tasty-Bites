import { ArrowRight, Flame } from 'lucide-react';
import { PRODUCTS } from '../data/products';

import { ProductCard } from '../components/ProductCard';
import { useApp } from '../context/AppContext';

export const PopularDishes: React.FC = () => {
  const { activeCategory, searchQuery, applyPromo, setIsCartOpen, setIsMenuModalOpen, showToast } = useApp();

  // Filter products
  const filteredProducts = PRODUCTS.filter((product) => {
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchCat = product.category.toLowerCase().includes(q);
      const matchDesc = product.description.toLowerCase().includes(q);
      return matchName || matchCat || matchDesc;
    }
    // Category match
    if (activeCategory !== 'all') {
      return product.category === activeCategory;
    }
    // Default popular dishes
    return true;
  });

  // Pick top 6 dishes to display in the main row (matches reference screenshot)
  const popularSix = activeCategory === 'all' && !searchQuery.trim()
    ? PRODUCTS.slice(0, 6)
    : filteredProducts.slice(0, 6);

  const handleApplyOffer = () => {
    applyPromo('TASTY50');
    showToast('Applied FLAT 50% OFF! Added coupon TASTY50 to your cart.', 'success');
    setIsCartOpen(true);
  };

  return (
    <section id="popular-dishes" className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-10">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
            {searchQuery
              ? `Results for "${searchQuery}"`
              : activeCategory !== 'all'
              ? `${activeCategory.toUpperCase()} Dishes`
              : 'Our Popular Dishes'}
          </h2>
          {activeCategory === 'all' && !searchQuery && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
              Hot Picks
            </span>
          )}
        </div>

        <button
          onClick={() => setIsMenuModalOpen(true)}
          className="text-xs sm:text-sm font-bold text-red-600 hover:text-red-700 flex items-center gap-1 group cursor-pointer transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Main Grid: Dishes Cards + Promo Banner */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3.5 sm:gap-4 items-stretch">
        {/* Left Side: 6 Product Cards (Cols 1-9 on desktop so all 6 fit in a single row) */}
        <div className="xl:col-span-9 2xl:col-span-9">
          {popularSix.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 h-full">
              {popularSix.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-10 text-center border border-neutral-200 shadow-xs">
              <p className="text-neutral-500 text-sm mb-3">No dishes found matching your criteria.</p>
              <button
                onClick={() => setIsMenuModalOpen(true)}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-4 py-2 rounded-xl"
              >
                Browse Full Menu
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Large 50% Off Promo Card (Cols 10-12 on desktop) */}
        <div className="xl:col-span-3 2xl:col-span-3 flex flex-col">
          <div className="relative flex-1 rounded-3xl bg-[#171412] border border-neutral-800/80 p-4 sm:p-5 shadow-xl overflow-hidden flex flex-col justify-between group">
            {/* Ambient warm glow behind dish */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top decorative text */}
            <div className="relative z-10 text-left">
              <div className="font-script text-2xl sm:text-3xl text-neutral-200 tracking-wide leading-tight">
                Good Food<br />
                <span className="text-amber-400">Good Mood</span> 😊
              </div>

              {/* Red Ribbon Banner: FLAT 50% OFF */}
              <div className="mt-3 mb-1.5">
                <div className="inline-block bg-[#e52e2e] text-white font-black text-xs sm:text-sm px-3 py-1 rounded-lg shadow-lg shadow-red-900/40 uppercase tracking-wider transform -rotate-1 group-hover:rotate-0 transition-transform">
                  FLAT 50% OFF
                </div>
              </div>

              <p className="text-[11px] text-neutral-300 font-medium tracking-wide">
                On Selected Dishes
              </p>
            </div>

            {/* Appetizing Asian Gourmet Stir-Fry / Noodle Dish Image on Dark Slate */}
            <div className="relative my-3 flex items-center justify-center">
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden shadow-2xl shadow-black/80 border-4 border-neutral-800 group-hover:scale-105 transition-transform duration-700 ease-out">
                <img
                  src="https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=700&q=80"
                  alt="Delicious Bowl with 50% discount offer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Decorative herbs / spice accent badge */}
              <div className="absolute -bottom-1 right-2 bg-black/80 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[9px] text-amber-300 border border-neutral-700">
                ⚡ Special Deal
              </div>
            </div>

            {/* Action Button: Order Now → */}
            <div className="relative z-10 text-left pt-1">
              <button
                onClick={handleApplyOffer}
                className="bg-white hover:bg-amber-400 text-neutral-950 font-extrabold text-xs px-5 py-2 rounded-full inline-flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all cursor-pointer group/btn"
              >
                <span>Order Now</span>
                <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
