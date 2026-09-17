import { Star, Clock, Heart, Plus, Check } from 'lucide-react';
import type { Product } from '../types';
import { useApp } from '../context/AppContext';


interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist, setSelectedProduct, cart } = useApp();

  const isFavorite = isInWishlist(product.id);
  const cartItem = cart.find((i) => i.product.id === product.id);
  const isAdded = Boolean(cartItem);

  const handleCardClick = (e: React.MouseEvent) => {
    // If user clicked heart or add to cart button, don't trigger modal
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;
    setSelectedProduct(product);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-2xl border border-neutral-100/90 shadow-sm hover:shadow-xl hover:border-amber-200/80 transition-all duration-300 p-3 sm:p-3.5 flex flex-col justify-between group cursor-pointer text-left relative"
    >
      {/* Top Image Container */}
      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-neutral-100 mb-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Dietary Veg / Non-Veg Indicator */}
        <div className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur-xs p-1 rounded-md shadow-xs flex items-center justify-center">
          <div
            className={`w-3.5 h-3.5 border flex items-center justify-center p-0.5 ${
              product.isVeg ? 'border-emerald-600' : 'border-rose-600'
            }`}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                product.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
              }`}
            />
          </div>
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-2 right-2 z-10 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer shadow-xs ${
            isFavorite
              ? 'bg-rose-50 text-rose-500 fill-rose-500 scale-110'
              : 'bg-white/80 text-neutral-600 hover:text-rose-500 hover:bg-white'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Optional Badge */}
        {product.badge && (
          <span className="absolute bottom-2 left-2 bg-black/70 text-amber-300 text-[9.5px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
            {product.badge}
          </span>
        )}
      </div>

      {/* Content details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Dish Name */}
          <h4 className="font-bold text-neutral-900 text-sm tracking-tight leading-snug group-hover:text-amber-600 transition-colors line-clamp-1">
            {product.name}
          </h4>

          {/* Rating and Delivery time */}
          <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-medium mt-1 mb-2 flex-wrap">
            <div className="flex items-center gap-1 text-amber-600 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>{product.rating}</span>
              <span className="text-neutral-400 font-normal">({product.reviews})</span>
            </div>

            <span className="text-neutral-300">•</span>

            <div className="flex items-center gap-1 text-neutral-500">
              <Clock className="w-3 h-3 text-neutral-400" />
              <span>{product.deliveryTime}</span>
            </div>
          </div>

          {/* Delicious Description (Fills the blank space with real food details) */}
          <p className="text-[11.5px] text-neutral-500 line-clamp-2 leading-relaxed mb-2 font-normal">
            {product.description}
          </p>

          {/* Quick Specs / Ingredients Chips */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
            {product.serves && (
              <span className="text-[9.5px] bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded font-medium">
                {product.serves}
              </span>
            )}
            {product.calories && (
              <span className="text-[9.5px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded font-medium">
                {product.calories} kcal
              </span>
            )}
            {product.isSpicy && (
              <span className="text-[9.5px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-semibold">
                🌶️ Spicy
              </span>
            )}
          </div>
        </div>

        {/* Price & Add to Cart Button */}
        <div className="pt-2 border-t border-neutral-100 mt-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-neutral-900">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-[11px] text-neutral-400 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>

            {product.originalPrice && (
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </span>
            )}
          </div>

          {/* Red Add to Cart Button (Matches reference screenshot) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-98 ${
              isAdded
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-[#e52e2e] text-white hover:bg-[#cc2222] hover:shadow-md hover:shadow-red-600/20'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added ({cartItem?.quantity})</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
