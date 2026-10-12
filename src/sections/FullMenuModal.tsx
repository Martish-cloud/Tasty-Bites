import { useState } from 'react';
import { X, Search, ArrowUpDown } from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../data/products';
import type { CategoryId } from '../types';
import { ProductCard } from '../components/ProductCard';
import { useApp } from '../context/AppContext';


export const FullMenuModal: React.FC = () => {
  const { isMenuModalOpen, setIsMenuModalOpen } = useApp();

  const [selectedCat, setSelectedCat] = useState<CategoryId | 'all'>('all');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'time'>('featured');
  const [localSearch, setLocalSearch] = useState('');

  if (!isMenuModalOpen) return null;

  // Filter and sort products
  const filtered = PRODUCTS.filter((p) => {
    if (selectedCat !== 'all' && p.category !== selectedCat) return false;
    if (dietaryFilter === 'veg' && !p.isVeg) return false;
    if (dietaryFilter === 'non-veg' && p.isVeg) return false;
    if (localSearch.trim()) {
      const q = localSearch.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'time') return parseInt(a.deliveryTime) - parseInt(b.deliveryTime);
    return 0; // featured
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsMenuModalOpen(false)}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-6xl max-h-[92vh] bg-[#f8f9fa] rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10 text-left animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-white border-b border-neutral-200 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                TastyBItes Full Restaurant Menu 📖
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Handcrafted with farm fresh ingredients & artisanal love.
              </p>
            </div>

            <button
              onClick={() => setIsMenuModalOpen(false)}
              className="w-9 h-9 rounded-full bg-neutral-100 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200 flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search and Sort controls */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search dishes, flavours, ingredients..."
                className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            {/* Dietary Filter (All, Veg, Non-Veg) */}
            <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-xl shrink-0 text-xs font-semibold">
              <button
                onClick={() => setDietaryFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  dietaryFilter === 'all'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setDietaryFilter('veg')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer ${
                  dietaryFilter === 'veg'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-neutral-500 hover:text-emerald-700'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                Pure Veg
              </button>
              <button
                onClick={() => setDietaryFilter('non-veg')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer ${
                  dietaryFilter === 'non-veg'
                    ? 'bg-white text-rose-700 shadow-xs'
                    : 'text-neutral-500 hover:text-rose-700'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-600" />
                Non-Veg
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium text-neutral-800 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="featured">Featured Picks</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="time">Fastest Delivery</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setSelectedCat('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCat === 'all'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-white border border-neutral-200 text-neutral-700 hover:border-neutral-300'
              }`}
            >
              🍽️ All Categories ({PRODUCTS.length})
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  selectedCat === cat.id
                    ? 'bg-amber-500 text-neutral-950 shadow-xs'
                    : 'bg-white border border-neutral-200 text-neutral-700 hover:border-neutral-300'
                }`}
              >
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} className="w-4 h-4 rounded-full object-cover" />
                ) : (
                  <span>{cat.icon}</span>
                )}
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Dish Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {filtered.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <span className="text-4xl">🔍</span>
              <h3 className="font-bold text-neutral-800 text-base">No dishes found</h3>
              <p className="text-xs text-neutral-500">
                Try adjusting your search terms or dietary filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-white border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-500">
          <span>Showing {filtered.length} dishes</span>
          <span className="text-neutral-700 font-semibold">
            Lightning delivery in 20-30 mins 🚀
          </span>
        </div>
      </div>
    </div>
  );
};
