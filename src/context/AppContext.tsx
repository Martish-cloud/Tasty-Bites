import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, CartItem, CategoryId, PromoCode } from '../types';

import { PROMO_CODES } from '../data/products';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextType {
  cart: CartItem[];
  wishlist: string[];
  location: { city: string; pincode: string };
  activeCategory: CategoryId | 'all';
  searchQuery: string;
  appliedPromo: PromoCode | null;
  toasts: ToastMessage[];

  // Modal / Drawer states
  isCartOpen: boolean;
  isWishlistOpen: boolean;
  isMenuModalOpen: boolean;
  isVideoModalOpen: boolean;
  isTrackOrderOpen: boolean;
  isLocationModalOpen: boolean;
  isOffersModalOpen: boolean;
  isAuthModalOpen: boolean;
  isAdminOpen: boolean;
  selectedProduct: Product | null;

  // Cart calculations
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  total: number;
  cartCount: number;

  // Actions
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  applyPromo: (codeStr: string) => { success: boolean; message: string };
  removePromo: () => void;
  setLocation: (loc: { city: string; pincode: string }) => void;
  setActiveCategory: (category: CategoryId | 'all') => void;
  setSearchQuery: (query: string) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;

  // Modal setters
  setIsCartOpen: (open: boolean) => void;
  setIsWishlistOpen: (open: boolean) => void;
  setIsMenuModalOpen: (open: boolean) => void;
  setIsVideoModalOpen: (open: boolean) => void;
  setIsTrackOrderOpen: (open: boolean) => void;
  setIsLocationModalOpen: (open: boolean) => void;
  setIsOffersModalOpen: (open: boolean) => void;
  setIsAuthModalOpen: (open: boolean) => void;
  setIsAdminOpen: (open: boolean) => void;
  setSelectedProduct: (product: Product | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // LocalStorage initialization
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('tastybites_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tastybites_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [location, setLocationState] = useState(() => {
    try {
      const saved = localStorage.getItem('tastybites_location');
      return saved ? JSON.parse(saved) : { city: 'Bengaluru', pincode: '560001' };
    } catch {
      return { city: 'Bengaluru', pincode: '560001' };
    }
  });

  const [activeCategory, setActiveCategory] = useState<CategoryId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isOffersModalOpen, setIsOffersModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // URL Hash Listener for deep-linking (#admin, #track-order, etc.)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#staff-portal') {
        setIsAdminOpen(true);
      }
      if (hash === '#track-order' || hash === '#track') {
        setIsTrackOrderOpen(true);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('tastybites_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('tastybites_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  const setLocation = (loc: { city: string; pincode: string }) => {
    setLocationState(loc);
    try {
      localStorage.setItem('tastybites_location', JSON.stringify(loc));
    } catch (e) {
      console.error(e);
    }
    showToast(`Delivery location set to ${loc.city} (${loc.pincode})`, 'info');
  };

  // Toast helper
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added ${quantity}x "${product.name}" to cart! 🍔`, 'success');
  };

  const removeFromCart = (productId: string) => {
    const item = cart.find((i) => i.product.id === productId);
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
    if (item) {
      showToast(`Removed "${item.product.name}" from cart`, 'info');
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
  };

  // Wishlist
  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.includes(product.id);
      if (exists) {
        showToast(`Removed "${product.name}" from Wishlist`, 'info');
        return prev.filter((id) => id !== product.id);
      } else {
        showToast(`Saved "${product.name}" to Wishlist! ❤️`, 'success');
        return [...prev, product.id];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Cart calculations
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  let discount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountPercentage) {
      const calcDiscount = (subtotal * appliedPromo.discountPercentage) / 100;
      discount = Math.min(calcDiscount, 150); // Cap at 150
    } else if (appliedPromo.discountAmount) {
      discount = appliedPromo.discountAmount;
    }
  }

  // Delivery fee: ₹40 standard, free over ₹499 or with FREEDEL
  const isFreeDelivery = subtotal >= 499 || appliedPromo?.code === 'FREEDEL';
  const deliveryFee = subtotal === 0 ? 0 : isFreeDelivery ? 0 : 40;
  const tax = Math.round(subtotal * 0.05); // 5% GST
  const total = Math.max(0, subtotal - discount + deliveryFee + tax);

  const applyPromo = (codeStr: string) => {
    const clean = codeStr.trim().toUpperCase();
    const promo = PROMO_CODES.find((p) => p.code === clean);
    if (!promo) {
      return { success: false, message: 'Invalid coupon code. Try TASTY50 or WELCOME100' };
    }
    if (subtotal < promo.minOrder) {
      return {
        success: false,
        message: `Minimum order value for ${promo.code} is ₹${promo.minOrder}. Add items worth ₹${promo.minOrder - subtotal} more!`,
      };
    }
    setAppliedPromo(promo);
    showToast(`Coupon "${promo.code}" applied successfully! 🎉`, 'success');
    return { success: true, message: `Coupon applied: ${promo.description}` };
  };

  const removePromo = () => {
    setAppliedPromo(null);
    showToast('Promo code removed', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        wishlist,
        location,
        activeCategory,
        searchQuery,
        appliedPromo,
        toasts,
        isCartOpen,
        isWishlistOpen,
        isMenuModalOpen,
        isVideoModalOpen,
        isTrackOrderOpen,
        isLocationModalOpen,
        isOffersModalOpen,
        isAuthModalOpen,
        isAdminOpen,
        selectedProduct,
        subtotal,
        discount,
        deliveryFee,
        tax,
        total,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        applyPromo,
        removePromo,
        setLocation,
        setActiveCategory,
        setSearchQuery,
        showToast,
        removeToast,
        setIsCartOpen,
        setIsWishlistOpen,
        setIsMenuModalOpen,
        setIsVideoModalOpen,
        setIsTrackOrderOpen,
        setIsLocationModalOpen,
        setIsOffersModalOpen,
        setIsAuthModalOpen,
        setIsAdminOpen,
        setSelectedProduct,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
