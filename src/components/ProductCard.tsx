import React from 'react';
import { Star, Clock, Heart, Plus, Check } from 'lucide-react';
import type { Product } from '../types';
import { useApp } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, compact = false }) => {
  const { addToCart, toggleWishlist, isInWishlist, setSelectedProduct, cart } = useApp();

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
        compact ? 'p-2.5' : 'p-3'
      } flex flex-col justify-between group cursor-pointer text-left relative overflow-hidden`}
    >
      {/* Top Image Container */}
      <div className="relative w-full aspect-[16/11] rounded-xl overflow-hidden bg-neutral-100 mb-2.5">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Dietary Veg / Non-Veg Indicator */}
        <div className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur-xs p-1 rounded-md shadow-xs flex items-center justify-center">
          <div
            className={`w-3 h-3 border flex items-center justify-center p-0.5 ${
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
          className={`absolute top-2 right-2 z-10 w-6.5 h-6.5 rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer shadow-xs ${
            isFavorite
              ? 'bg-rose-50 text-rose-500 fill-rose-500 scale-105'
              : 'bg-white/85 text-neutral-600 hover:text-rose-500 hover:bg-white'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Optional Badge */}
        {product.badge && (
          <span className="absolute bottom-2 left-2 bg-neutral-950/80 text-amber-300 text-[9px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
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
          <div className="flex items-center gap-1.5 text-[10.5px] text-neutral-500 font-medium mt-1 mb-1.5">
            <div className="flex items-center gap-0.5 text-amber-600 font-bold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
              <span>{product.rating}</span>
            </div>
            <span className="text-neutral-300">•</span>
            <div className="flex items-center gap-1 text-neutral-500">
              <Clock className="w-3 h-3 text-neutral-400" />
              <span>{product.deliveryTime}</span>
            </div>
          </div>

          {/* Short description */}
          <p className="text-[11px] text-neutral-500 line-clamp-1 leading-relaxed mb-2 font-normal">
            {product.description}
          </p>
        </div>

        {/* Price & Add to Cart Button */}
        <div className="pt-2 border-t border-neutral-100 mt-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm sm:text-base font-extrabold text-neutral-900">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-[10.5px] text-neutral-400 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>

            {product.originalPrice && (
              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className={`w-full py-1.5 sm:py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-98 ${
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
