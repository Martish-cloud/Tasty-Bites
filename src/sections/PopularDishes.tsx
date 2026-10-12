import { ArrowRight, Flame } from 'lucide-react';
import { PRODUCTS } from '../data/products';

import { ProductCard } from '../components/ProductCard';
import { useApp } from '../context/AppContext';

export const PopularDishes: React.FC = () => {
  const { activeCategory, searchQuery, setIsMenuModalOpen } = useApp();

  // Filter products based on search or category
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
    return true;
  });

  // Display 12 compact products in two rows of 6 on wide desktop screens
  const popularTwelve = activeCategory === 'all' && !searchQuery.trim()
    ? PRODUCTS.slice(0, 12)
    : filteredProducts.slice(0, 12);

  return (
    <section id="popular-dishes" className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
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
              12 Chef Selections
            </span>
          )}
        </div>

        <button
          onClick={() => setIsMenuModalOpen(true)}
          className="text-xs sm:text-sm font-bold text-red-600 hover:text-red-700 flex items-center gap-1 group cursor-pointer transition-colors"
        >
          <span>View All ({PRODUCTS.length})</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* 12 Compact Product Cards: 2 Rows of 6 on wide desktop */}
      {popularTwelve.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-3.5">
          {popularTwelve.map((product) => (
            <ProductCard key={product.id} product={product} compact />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-10 text-center border border-neutral-200 shadow-xs">
          <p className="text-neutral-500 text-sm mb-3">No dishes found matching your criteria.</p>
          <button
            onClick={() => setIsMenuModalOpen(true)}
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer"
          >
            Browse Full Menu
          </button>
        </div>
      )}
    </section>
  );
};
