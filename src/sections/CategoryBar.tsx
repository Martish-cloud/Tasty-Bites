import { CATEGORIES } from '../data/products';
import type { CategoryId } from '../types';
import { useApp } from '../context/AppContext';
import { ArrowRight } from 'lucide-react';


export const CategoryBar: React.FC = () => {
  const { activeCategory, setActiveCategory, setIsMenuModalOpen } = useApp();

  const handleCategorySelect = (id: CategoryId) => {
    if (activeCategory === id) {
      setActiveCategory('all');
    } else {
      setActiveCategory(id);
    }
    const el = document.getElementById('popular-dishes');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Custom visual food emoji/icons matching reference
  const getCategoryVisual = (id: CategoryId) => {
    switch (id) {
      case 'burgers':
        return (
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-orange-50 text-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            🍔
          </div>
        );
      case 'pizza':
        return (
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-red-50 text-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            🍕
          </div>
        );
      case 'indian':
        return (
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-50 text-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            🍛
          </div>
        );
      case 'chinese':
        return (
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-red-50 text-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            🥡
          </div>
        );
      case 'continental':
        return (
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-yellow-50 text-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            🍝
          </div>
        );
      case 'salads':
        return (
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 text-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            🥗
          </div>
        );
      case 'desserts':
        return (
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-pink-50 text-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            🧁
          </div>
        );
      case 'beverages':
        return (
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-50 text-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            🥤
          </div>
        );
    }
  };

  return (
    <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-8 -mt-6 sm:-mt-8 mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Left Side: 8 Food Categories Strip (8 or 9 cols on desktop) */}
        <div className="lg:col-span-8 xl:col-span-9 bg-white rounded-2xl p-2.5 sm:p-3.5 shadow-xl shadow-black/5 border border-neutral-100 flex items-center">
          <div className="w-full flex items-center justify-between overflow-x-auto no-scrollbar gap-2 sm:gap-4 px-1">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`flex flex-col items-center justify-center min-w-[70px] sm:min-w-[84px] py-2 px-1.5 rounded-xl transition-all cursor-pointer group select-none ${
                    isActive
                      ? 'bg-amber-50/90 text-amber-900 ring-2 ring-amber-400 font-bold shadow-xs'
                      : 'hover:bg-neutral-50 text-neutral-700 font-medium'
                  }`}
                >
                  <div className="mb-1.5">{getCategoryVisual(cat.id)}</div>
                  <span className={`text-xs tracking-tight transition-colors ${isActive ? 'text-amber-800' : 'group-hover:text-amber-600'}`}>
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Promotional Banner Card (Matches reference screenshot) */}
        <div
          onClick={() => setIsMenuModalOpen(true)}
          className="lg:col-span-4 xl:col-span-3 bg-gradient-to-br from-amber-400 via-amber-400 to-amber-500 rounded-2xl p-4 shadow-xl shadow-amber-500/10 border border-amber-300 flex items-center justify-between cursor-pointer hover:shadow-2xl hover:scale-[1.01] transition-all group overflow-hidden relative"
        >
          {/* Subtle background decorative shapes */}
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/20 rounded-full blur-lg pointer-events-none" />

          {/* Text Info */}
          <div className="z-10 flex flex-col text-left pr-2">
            <h3 className="font-extrabold text-neutral-950 text-sm sm:text-base leading-tight">
              Delicious<br />
              Meals for<br />
              Every Mood
            </h3>
            <p className="text-[11px] font-semibold text-neutral-800 mt-1">
              Fresh. Tasty. Affordable.
            </p>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-neutral-900 mt-2 group-hover:translate-x-1 transition-transform">
              <span>Explore Menu</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Circular/Oval Food Image on the right of banner */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-white/60 shadow-md shrink-0">
            <img
              src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80"
              alt="Fresh Gourmet Platter"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
