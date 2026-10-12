import { useState } from 'react';
import { X, Star, Clock, Heart, Plus, Minus, Flame, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';


export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
  } = useApp();

  const [quantity, setQuantity] = useState(1);

  if (!selectedProduct) return null;

  const isFavorite = isInWishlist(selectedProduct.id);

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity);
    setSelectedProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={() => setSelectedProduct(null)}
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 text-left animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-neutral-600 hover:text-neutral-950 shadow-md transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Layout: Image on top or left */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Dish Image */}
          <div className="relative aspect-[4/3] md:aspect-auto md:h-full bg-neutral-100 overflow-hidden">
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent md:hidden" />

            {/* Veg / Non-Veg Indicator */}
            <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md p-1.5 rounded-lg shadow-sm flex items-center gap-1.5 text-[11px] font-bold">
              <div
                className={`w-3.5 h-3.5 border flex items-center justify-center p-0.5 ${
                  selectedProduct.isVeg ? 'border-emerald-600' : 'border-rose-600'
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    selectedProduct.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                  }`}
                />
              </div>
              <span className={selectedProduct.isVeg ? 'text-emerald-700' : 'text-rose-700'}>
                {selectedProduct.isVeg ? 'Pure Veg' : 'Non-Veg'}
              </span>
            </div>

            {/* Favorite button */}
            <button
              onClick={() => toggleWishlist(selectedProduct)}
              className="absolute bottom-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-md cursor-pointer hover:scale-110 transition-transform"
            >
              <Heart
                className={`w-4 h-4 ${
                  isFavorite ? 'text-rose-500 fill-rose-500' : 'text-neutral-600'
                }`}
              />
            </button>
          </div>

          {/* Details Content */}
          <div className="p-6 flex flex-col justify-between space-y-4">
            <div>
              {/* Category & Badge */}
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">
                  {selectedProduct.category}
                </span>
                {selectedProduct.badge && (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {selectedProduct.badge}
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-black text-neutral-900 leading-tight">
                {selectedProduct.name}
              </h3>

              {/* Rating & Delivery */}
              <div className="flex items-center gap-3 text-xs text-neutral-600 font-medium mt-2 mb-3">
                <div className="flex items-center gap-1 text-amber-600 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  <span>{selectedProduct.rating}</span>
                  <span className="text-neutral-400 font-normal">({selectedProduct.reviews} reviews)</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{selectedProduct.deliveryTime}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-neutral-600 leading-relaxed">
                {selectedProduct.description}
              </p>

              {/* Nutrition & Specs */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-neutral-100 text-xs">
                {selectedProduct.calories && (
                  <div className="flex items-center gap-1.5 text-neutral-600">
                    <Flame className="w-3.5 h-3.5 text-orange-500" />
                    <span><b>{selectedProduct.calories}</b> kcal</span>
                  </div>
                )}
                {selectedProduct.serves && (
                  <div className="flex items-center gap-1.5 text-neutral-600">
                    <Users className="w-3.5 h-3.5 text-blue-500" />
                    <span>Serves: <b>{selectedProduct.serves}</b></span>
                  </div>
                )}
              </div>

              {/* Ingredients */}
              {selectedProduct.ingredients && selectedProduct.ingredients.length > 0 && (
                <div className="mt-4">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
                    Key Ingredients
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProduct.ingredients.map((ing, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-md font-medium"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions: Quantity + Add to Cart */}
            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between gap-4">
              {/* Stepper */}
              <div className="flex items-center border border-neutral-300 rounded-xl bg-neutral-50 overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-neutral-600 hover:bg-neutral-200 transition cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-sm font-bold text-neutral-900 min-w-[28px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  disabled={quantity >= 10}
                  className={`px-3 py-2 transition cursor-pointer ${
                    quantity >= 10 ? 'text-neutral-300 cursor-not-allowed' : 'text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Cart CTA */}
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-[#e52e2e] hover:bg-[#cc2222] text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 transition-all cursor-pointer"
              >
                <span>Add to Cart</span>
                <span>•</span>
                <span>₹{selectedProduct.price * quantity}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
