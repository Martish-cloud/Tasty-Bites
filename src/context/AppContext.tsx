import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import type { Product, CartItem, CategoryId, PromoCode, UserProfile } from '../types';

import { PROMO_CODES, PRODUCTS } from '../data/products';

// Centralized Tax Configuration: GST 18%
export const TAX_CONFIG = {
  gstRate: 0.18, // 18% GST (Indian tax rate for restaurant & food supply)
  ratePercentage: 18,
  label: 'GST (18%)',
};

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

  // Customer Authentication
  currentUser: UserProfile | null;
  loginWithPhone: (phone: string, name?: string, email?: string) => UserProfile;
  logout: () => void;

  // Modal / Drawer states
  isCartOpen: boolean;
  isWishlistOpen: boolean;
  isMenuModalOpen: boolean;
  isVideoModalOpen: boolean;
  isTrackOrderOpen: boolean;
  trackingOrderNumber: string | null;
  setTrackingOrderNumber: (orderNumber: string | null) => void;
  openOrderTracking: (orderNumber?: string) => void;
  currentRoute: 'home' | 'reviews' | 'combo-offers';
  setCurrentRoute: (route: 'home' | 'reviews' | 'combo-offers') => void;
  navigateTo: (route: 'home' | 'reviews' | 'combo-offers') => void;
  navigateBackToHome: () => void;
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
  taxRate: number;

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

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('tastybites_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeCategory, setActiveCategory] = useState<CategoryId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isMenuModalOpen, setIsMenuModalOpenState] = useState(() => {
    return typeof window !== 'undefined' && window.location.hash.toLowerCase() === '#menu';
  });
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [trackingOrderNumber, setTrackingOrderNumber] = useState<string | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isOffersModalOpen, setIsOffersModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedProduct, setSelectedProductState] = useState<Product | null>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash.startsWith('#dish-')) {
        const dishId = hash.replace('#dish-', '');
        return PRODUCTS.find((p) => p.id === dishId) || null;
      }
    }
    return null;
  });

  const [currentRoute, setCurrentRoute] = useState<'home' | 'reviews' | 'combo-offers'>(() => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    if (path.includes('reviews') || hash.includes('reviews')) return 'reviews';
    if (path.includes('combo-offers') || hash.includes('combo-offers') || hash.includes('combos')) return 'combo-offers';
    return 'home';
  });

  const isHandlingPopstateRef = useRef(false);
  const isProgrammaticScrollRef = useRef(false);
  const currentRouteRef = useRef(currentRoute);

  useEffect(() => {
    currentRouteRef.current = currentRoute;
  }, [currentRoute]);

  // Set manual scroll restoration to control exact scroll positions
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    if (!window.history.state?.key) {
      const initialKey = `tb_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      window.history.replaceState(
        {
          ...window.history.state,
          key: initialKey,
          route: currentRouteRef.current,
          scrollY: window.scrollY,
        },
        ''
      );
    }
  }, []);

  // Track scroll position per history entry and per route
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (isProgrammaticScrollRef.current) return;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          const currentKey = window.history.state?.key || `tb_${currentRouteRef.current}`;
          try {
            window.history.replaceState(
              {
                ...window.history.state,
                key: currentKey,
                scrollY: currentY,
                route: currentRouteRef.current,
              },
              ''
            );
            sessionStorage.setItem('tb_scroll_' + currentKey, String(currentY));
            sessionStorage.setItem('tb_scroll_route_' + currentRouteRef.current, String(currentY));
          } catch {
            // Ignore potential quota errors
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Frame-aware scroll restoration
  const restoreScrollPosition = useCallback((targetY: number) => {
    if (targetY <= 0) {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      return;
    }

    isProgrammaticScrollRef.current = true;
    let attempts = 0;
    const maxAttempts = 30;

    const step = () => {
      attempts++;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll >= targetY || attempts >= maxAttempts) {
        window.scrollTo({
          top: Math.min(targetY, Math.max(0, maxScroll)),
          behavior: 'instant' as ScrollBehavior,
        });
        requestAnimationFrame(() => {
          const finalMax = document.documentElement.scrollHeight - window.innerHeight;
          window.scrollTo({
            top: Math.min(targetY, Math.max(0, finalMax)),
            behavior: 'instant' as ScrollBehavior,
          });
          setTimeout(() => {
            isProgrammaticScrollRef.current = false;
          }, 50);
        });
      } else {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, []);

  const navigateTo = (route: 'home' | 'reviews' | 'combo-offers') => {
    // 1. Save scroll position of current page before leaving
    const currentY = window.scrollY;
    const currentKey = window.history.state?.key || `tb_${currentRoute}_${Date.now()}`;
    try {
      window.history.replaceState(
        {
          ...window.history.state,
          key: currentKey,
          scrollY: currentY,
          route: currentRoute,
        },
        ''
      );
      sessionStorage.setItem('tb_scroll_' + currentKey, String(currentY));
      sessionStorage.setItem('tb_scroll_route_' + currentRoute, String(currentY));
    } catch {
      // Ignore
    }

    // 2. Push state for target route
    const nextKey = `tb_${route}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const targetPath =
      route === 'reviews'
        ? '/reviews'
        : route === 'combo-offers'
        ? '/combo-offers'
        : '/';

    window.history.pushState(
      { key: nextKey, route, scrollY: 0 },
      '',
      targetPath
    );

    // 3. Update route and document title
    setCurrentRoute(route);
    if (route === 'reviews') {
      document.title = 'Customer Reviews & Ratings | TastyBites';
    } else if (route === 'combo-offers') {
      document.title = 'Combo Offers | TastyBites';
    } else {
      document.title = 'TastyBites';
    }

    // 4. Reset scroll for forward navigation to a new page
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  const navigateBackToHome = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigateTo('home');
    }
  };

  // Synchronized Full Menu Modal with browser history
  const setIsMenuModalOpen = (open: boolean) => {
    if (open) {
      if (!isMenuModalOpen) {
        const currentY = window.scrollY;
        const nextKey = `tb_modal_menu_${Date.now()}`;
        window.history.pushState(
          { key: nextKey, modal: 'menu', route: currentRoute, scrollY: currentY },
          '',
          '#menu'
        );
        setIsMenuModalOpenState(true);
      }
    } else {
      if (!isHandlingPopstateRef.current && (window.location.hash.toLowerCase() === '#menu' || window.history.state?.modal === 'menu')) {
        window.history.back();
      } else {
        setIsMenuModalOpenState(false);
      }
    }
  };

  // Synchronized Product Detail Modal with browser history
  const setSelectedProduct = (product: Product | null) => {
    if (product) {
      const currentY = window.scrollY;
      const nextKey = `tb_dish_${product.id}_${Date.now()}`;
      window.history.pushState(
        {
          key: nextKey,
          modal: 'product',
          productId: product.id,
          route: currentRoute,
          scrollY: currentY,
        },
        '',
        `#dish-${product.id}`
      );
      setSelectedProductState(product);
    } else {
      if (!isHandlingPopstateRef.current && (window.location.hash.toLowerCase().startsWith('#dish-') || window.history.state?.modal === 'product')) {
        window.history.back();
      } else {
        setSelectedProductState(null);
      }
    }
  };

  const openOrderTracking = (orderNumber?: string) => {
    if (orderNumber) {
      setTrackingOrderNumber(orderNumber);
    }
    setIsTrackOrderOpen(true);
  };

  // URL Pathname and Hash Listener for routing & deep-linking
  useEffect(() => {
    const handleLocationChange = (e?: PopStateEvent) => {
      isHandlingPopstateRef.current = true;
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();

      let nextRoute: 'home' | 'reviews' | 'combo-offers' = 'home';
      if (path.includes('reviews') || hash.includes('reviews')) {
        nextRoute = 'reviews';
      } else if (path.includes('combo-offers') || hash.includes('combo-offers') || hash.includes('combos')) {
        nextRoute = 'combo-offers';
      } else {
        nextRoute = 'home';
      }

      // Sync menu modal state
      const isMenu = hash === '#menu' || e?.state?.modal === 'menu';
      setIsMenuModalOpenState(isMenu);

      // Sync product detail modal state
      if (hash.startsWith('#dish-')) {
        const dishId = hash.replace('#dish-', '');
        const found = PRODUCTS.find((p) => p.id === dishId);
        if (found) setSelectedProductState(found);
      } else if (e?.state?.modal === 'product' && e?.state?.productId) {
        const found = PRODUCTS.find((p) => p.id === e.state.productId);
        if (found) setSelectedProductState(found);
      } else {
        setSelectedProductState(null);
      }

      if (hash === '#staff-portal') {
        setIsAdminOpen(true);
      }
      if (hash.startsWith('#track-order') || hash.startsWith('#track')) {
        const parts = hash.split('/');
        if (parts.length > 1 && parts[1]) {
          setTrackingOrderNumber(parts[1].toUpperCase());
        }
        setIsTrackOrderOpen(true);
      }

      const routeChanged = nextRoute !== currentRouteRef.current;
      setCurrentRoute(nextRoute);
      if (nextRoute === 'reviews') {
        document.title = 'Customer Reviews & Ratings | TastyBites';
      } else if (nextRoute === 'combo-offers') {
        document.title = 'Combo Offers | TastyBites';
      } else {
        document.title = 'TastyBites';
      }

      // Scroll restoration
      const stateKey = e?.state?.key || window.history.state?.key;
      let targetScrollY: number | null = typeof e?.state?.scrollY === 'number'
        ? e.state.scrollY
        : typeof window.history.state?.scrollY === 'number'
        ? window.history.state.scrollY
        : null;

      if (targetScrollY === null && stateKey) {
        const stored = sessionStorage.getItem('tb_scroll_' + stateKey);
        if (stored !== null) targetScrollY = Number(stored);
      }
      if (targetScrollY === null && nextRoute === 'home') {
        const storedRoute = sessionStorage.getItem('tb_scroll_route_home');
        if (storedRoute !== null) targetScrollY = Number(storedRoute);
      }

      if (typeof targetScrollY === 'number' && targetScrollY > 0) {
        restoreScrollPosition(targetScrollY);
      } else if (routeChanged && targetScrollY === 0) {
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      }

      setTimeout(() => {
        isHandlingPopstateRef.current = false;
      }, 50);
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange as any);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange as any);
    };
  }, [restoreScrollPosition]);

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

  // Auth Operations
  const loginWithPhone = (phone: string, name = 'Foodie Customer', email = '') => {
    const user: UserProfile = {
      id: `usr_${Date.now()}`,
      name: name.trim() || 'Foodie Customer',
      phone: phone.trim(),
      email: email.trim() || undefined,
      isVerified: true,
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(user);
    try {
      localStorage.setItem('tastybites_user', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
    showToast(`Authenticated as ${user.name} (${user.phone}) ✅`, 'success');
    return user;
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('tastybites_user');
    } catch (e) {
      console.error(e);
    }
    showToast('Logged out of TastyBites', 'info');
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

  // Cart operations (Max 10 units limit per line item, no duplicates)
  const addToCart = (product: Product, quantity = 1) => {
    let reachedLimit = false;
    let newTotalQuantity = quantity;

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= 10) {
          reachedLimit = true;
          return prev;
        }
        const updatedQty = Math.min(10, existing.quantity + quantity);
        newTotalQuantity = updatedQty;
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: updatedQty } : item
        );
      }
      const initialQty = Math.min(10, Math.max(1, quantity));
      newTotalQuantity = initialQty;
      return [...prev, { product, quantity: initialQty }];
    });

    if (reachedLimit) {
      showToast(`Maximum limit of 10 reached for "${product.name}"`, 'info');
    } else {
      showToast(`Added "${product.name}" to basket! (qty: ${newTotalQuantity}) 🍔`, 'success');
    }
  };

  const removeFromCart = (productId: string) => {
    const item = cart.find((i) => i.product.id === productId);
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
    if (item) {
      showToast(`Removed "${item.product.name}" from cart`, 'info');
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === productId);
      if (!existing) return prev;

      const newQty = existing.quantity + delta;
      if (newQty > 10) {
        showToast(`Maximum limit of 10 reached for "${existing.product.name}"`, 'info');
        return prev;
      }
      if (newQty <= 0) {
        showToast(`Removed "${existing.product.name}" from cart`, 'info');
        return prev.filter((item) => item.product.id !== productId);
      }
      return prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQty } : item
      );
    });
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

  // Cart calculations with 18% GST configuration
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
  // Centralized 18% GST (Indian GST rate)
  const tax = Math.round(subtotal * TAX_CONFIG.gstRate);
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
        currentUser,
        loginWithPhone,
        logout,
        taxRate: TAX_CONFIG.ratePercentage,
        isCartOpen,
        isWishlistOpen,
        isMenuModalOpen,
        isVideoModalOpen,
        isTrackOrderOpen,
        trackingOrderNumber,
        setTrackingOrderNumber,
        openOrderTracking,
        currentRoute,
        setCurrentRoute,
        navigateTo,
        navigateBackToHome,
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
