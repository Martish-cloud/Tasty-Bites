import React from 'react';
import { Star, Clock, Heart, Plus, Minus } from 'lucide-react';
import type { Product } from '../types';
import { useApp } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, compact = false }) => {
  const { addToCart, updateQuantity, toggleWishlist, isInWishlist, setSelectedProduct, cart, showToast } =
    useApp();

  const isFavorite = isInWishlist(product.id);
  const cartItem = cart.find((i) => i.product.id === product.id);
  const isAdded = Boolean(cartItem);

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;
    setSelectedProduct(product);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`bg-white rounded-2xl border border-neutral-100 shadow-xs hover:shadow-lg hover:border-amber-200 transition-all duration-300 ${
        compact ? 'p-2 sm:p-2.5' : 'p-3'
      } flex flex-col justify-between group cursor-pointer text-left relative overflow-hidden`}
    >
      {/* Top Image Container */}
      <div className={`relative w-full ${compact ? 'aspect-[4/3] mb-1.5' : 'aspect-[16/11] mb-2.5'} rounded-xl overflow-hidden bg-neutral-100`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Dietary Veg / Non-Veg Indicator */}
        <div className="absolute top-1.5 left-1.5 z-10 bg-white/90 backdrop-blur-xs p-0.5 sm:p-1 rounded-md shadow-xs flex items-center justify-center">
          <div
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 border flex items-center justify-center p-0.5 ${
              product.isVeg ? 'border-emerald-600' : 'border-rose-600'
            }`}
          >
            <div
              className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${
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
          className={`absolute top-1.5 right-1.5 z-10 w-6 h-6 rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer shadow-xs ${
            isFavorite
              ? 'bg-rose-50 text-rose-500 fill-rose-500 scale-105'
              : 'bg-white/85 text-neutral-600 hover:text-rose-500 hover:bg-white'
          }`}
        >
          <Heart className={`w-3 h-3 ${isFavorite ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Optional Badge */}
        {product.badge && (
          <span className="absolute bottom-1.5 left-1.5 bg-neutral-950/80 text-amber-300 text-[8.5px] font-bold px-1.5 py-0.2 rounded backdrop-blur-xs">
            {product.badge}
          </span>
        )}
      </div>

      {/* Content details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Dish Name */}
          <h4 className="font-bold text-neutral-900 text-xs sm:text-[13px] tracking-tight leading-snug group-hover:text-amber-600 transition-colors line-clamp-1">
            {product.name}
          </h4>

          {/* Rating and Delivery time */}
          <div className={`flex items-center gap-1.5 ${compact ? 'text-[10px] mt-0.5 mb-1' : 'text-[10.5px] mt-1 mb-1.5'} text-neutral-500 font-medium`}>
            <div className="flex items-center gap-0.5 text-amber-600 font-bold">
              <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-400 text-amber-500" />
              <span>{product.rating}</span>
            </div>
            <span className="text-neutral-300">•</span>
            <div className="flex items-center gap-1 text-neutral-500">
              <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-neutral-400" />
              <span>{product.deliveryTime}</span>
            </div>
          </div>

          {/* Short description (only in standard mode) */}
          {!compact && (
            <p className="text-[11px] text-neutral-500 line-clamp-1 leading-relaxed mb-2 font-normal">
              {product.description}
            </p>
          )}
        </div>

        {/* Price & Add to Cart Controls */}
        <div className={`${compact ? 'pt-1.5 mt-1' : 'pt-2 mt-auto'} border-t border-neutral-100`}>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-baseline gap-1">
              <span className={`${compact ? 'text-xs sm:text-sm font-black' : 'text-sm sm:text-base font-extrabold'} text-neutral-900`}>
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-[9.5px] sm:text-[10px] text-neutral-400 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>

            {product.originalPrice && (
              <span className="text-[8.5px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </span>
            )}
          </div>

          {/* Action: Add to Cart or [ - ] [ Quantity ] [ + ] Stepper */}
          {isAdded && cartItem ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className={`w-full ${
                compact ? 'py-1 px-1 rounded-lg' : 'py-1 px-1.5 rounded-xl'
              } bg-amber-50 border border-amber-300 flex items-center justify-between text-neutral-900 shadow-2xs`}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  updateQuantity(product.id, -1);
                }}
                aria-label={`Decrease ${product.name} quantity`}
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-white border border-amber-200 text-neutral-800 hover:bg-amber-100 hover:text-red-600 flex items-center justify-center transition cursor-pointer active:scale-95 shadow-2xs"
              >
                <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>

              <div className="flex items-center gap-1">
                <span className="font-black text-xs sm:text-sm text-neutral-900 px-1.5 min-w-[20px] text-center">
                  {cartItem.quantity}
                </span>
                <span className="text-[9.5px] text-amber-800/80 font-medium hidden sm:inline">in basket</span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (cartItem.quantity >= 10) {
                    showToast(`Maximum limit of 10 reached for "${product.name}"`, 'info');
                  } else {
                    updateQuantity(product.id, 1);
                  }
                }}
                aria-label={`Increase ${product.name} quantity`}
                disabled={cartItem.quantity >= 10}
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-white border border-amber-200 flex items-center justify-center transition cursor-pointer active:scale-95 shadow-2xs ${
                  cartItem.quantity >= 10
                    ? 'opacity-40 cursor-not-allowed text-neutral-400'
                    : 'text-neutral-800 hover:bg-amber-100 hover:text-emerald-700'
                }`}
              >
                <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
              className={`w-full ${
                compact ? 'py-1.5 px-2 text-[11px] sm:text-xs rounded-lg' : 'py-1.5 sm:py-2 px-3 text-xs rounded-xl'
              } font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-98 bg-[#e52e2e] text-white hover:bg-[#cc2222] hover:shadow-md hover:shadow-red-600/20`}
            >
              <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Add to Cart</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
