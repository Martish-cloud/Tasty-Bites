import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/products';

export const WishlistDrawer: React.FC = () => {
  const { wishlist, isWishlistOpen, setIsWishlistOpen, toggleWishlist, addToCart } = useApp();

  if (!isWishlistOpen) return null;

  const wishlistProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsWishlistOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between text-left">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <h2 className="text-base sm:text-lg font-bold text-neutral-900">
                Your Saved Dishes
              </h2>
              <span className="text-xs bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">
                {wishlist.length}
              </span>
            </div>

            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {wishlistProducts.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto text-3xl">
                  ❤️
                </div>
                <h3 className="font-bold text-neutral-800 text-base">Your wishlist is empty</h3>
                <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                  Click the heart icon on any mouth-watering dish to save it for your next cravings!
                </p>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="mt-2 bg-[#e52e2e] hover:bg-[#cc2222] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {wishlistProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl border border-neutral-100 hover:border-neutral-200 transition bg-neutral-50/40"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-14 h-14 rounded-lg object-cover shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-neutral-900 truncate">
                        {product.name}
                      </h4>
                      <p className="text-xs font-extrabold text-neutral-900 mt-0.5">
                        ₹{product.price}
                      </p>
                      <span className="text-[10px] text-amber-600 font-semibold">
                        ★ {product.rating} ({product.reviews})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          addToCart(product);
                          toggleWishlist(product);
                        }}
                        className="bg-[#e52e2e] hover:bg-[#cc2222] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-xs transition cursor-pointer"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Move to Cart</span>
                      </button>

                      <button
                        onClick={() => toggleWishlist(product)}
                        className="text-neutral-400 hover:text-rose-500 p-1 transition cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
