import { useState, useEffect } from 'react';
import { Search, Heart, ShoppingBag, Menu as MenuIcon, X } from 'lucide-react';
import { Logo } from './Logo';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const {
    cartCount,
    wishlist,
    searchQuery,
    setSearchQuery,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsMenuModalOpen,
    setIsOffersModalOpen,
    openOrderTracking,
    currentRoute,
    navigateTo,
  } = useApp();


  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    {
      name: 'Home',
      action: () => {
        setActiveTab('Home');
        navigateTo('home');
      },
    },
    {
      name: 'Menu',
      action: () => {
        setActiveTab('Menu');
        if (currentRoute !== 'home') navigateTo('home');
        setTimeout(() => {
          const el = document.getElementById('popular-dishes');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
          else setIsMenuModalOpen(true);
        }, 50);
      },
    },
    {
      name: 'Combos',
      action: () => {
        setActiveTab('Combos');
        navigateTo('combo-offers');
      },
    },
    {
      name: 'Track Order',
      action: () => {
        setActiveTab('Track Order');
        openOrderTracking();
      },
    },
    {
      name: 'Reviews',
      action: () => {
        setActiveTab('Reviews');
        navigateTo('reviews');
      },
    },
    {
      name: 'Story',
      action: () => {
        setActiveTab('Story');
        if (currentRoute !== 'home') navigateTo('home');
        setTimeout(() => {
          const el = document.getElementById('brand-story');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      },
    },
    {
      name: 'Offers',
      action: () => {
        setActiveTab('Offers');
        setIsOffersModalOpen(true);
      },
    },
    {
      name: 'FAQ',
      action: () => {
        setActiveTab('FAQ');
        if (currentRoute !== 'home') navigateTo('home');
        setTimeout(() => {
          const el = document.getElementById('faq');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      },
    },
    {
      name: 'Contact',
      action: () => {
        setActiveTab('Contact');
        if (currentRoute !== 'home') navigateTo('home');
        setTimeout(() => {
          const el = document.getElementById('footer');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      },
    },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#12100e]/95 backdrop-blur-md shadow-xl shadow-black/30 border-b border-neutral-800/80 py-2.5'
          : 'bg-[#14110f] border-b border-neutral-800/40 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between gap-4">
        {/* Left: Logo */}
        <Logo
          onClick={() => {
            setActiveTab('Home');
            navigateTo('home');
          }}
        />

        {/* Center: Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-3.5 xl:gap-6 shrink-0">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={item.action}
              className={`text-sm font-medium whitespace-nowrap transition-colors relative py-1 cursor-pointer ${
                activeTab === item.name
                  ? 'text-amber-500 font-semibold'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              {item.name}
              {activeTab === item.name && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Right side: Search bar, Wishlist, Cart, Mobile Menu toggle */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Search Input Bar (Matches reference screenshot) */}
          <div className="relative hidden md:flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.trim().length > 0) {
                  const el = document.getElementById('popular-dishes');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              placeholder="Search for dishes, cuisines..."
              className="bg-neutral-800/70 text-xs text-white placeholder-neutral-400 pl-9 pr-4 py-2 rounded-full border border-neutral-700/60 focus:outline-none focus:border-amber-500 focus:bg-neutral-800 transition-all w-44 lg:w-60 focus:w-68 shadow-inner"
            />
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-neutral-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            className="flex items-center gap-1.5 text-neutral-300 hover:text-white text-xs font-medium px-2 py-1.5 rounded-lg hover:bg-white/5 transition cursor-pointer relative"
            title="View Wishlist"
          >
            <div className="relative">
              <Heart
                className={`w-4 h-4 ${
                  wishlist.length > 0 ? 'text-rose-500 fill-rose-500' : 'text-neutral-300'
                }`}
              />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </div>
            <span className="hidden xl:inline">Wishlist</span>
          </button>

          {/* Cart Icon with Red Badge (Matches reference screenshot) */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-neutral-200 hover:text-white transition cursor-pointer group"
            title="View Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5 text-neutral-200 group-hover:scale-110 transition-transform" />
            {/* Red count badge */}
            <span className="absolute 0 top-0.5 right-0 bg-[#e52e2e] text-white text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center shadow-md animate-pulse">
              {cartCount}
            </span>
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-neutral-300 hover:text-white rounded-lg hover:bg-neutral-800 transition cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="px-4 pt-2 pb-1 md:hidden">
        <div className="relative flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for dishes, cuisines..."
            className="w-full bg-neutral-800/80 text-xs text-white placeholder-neutral-400 pl-9 pr-4 py-2 rounded-full border border-neutral-700/70 focus:outline-none focus:border-amber-500"
          />
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 pointer-events-none" />
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#161311] border-b border-neutral-800 px-6 py-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                item.action();
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left py-2 text-sm font-medium cursor-pointer ${
                activeTab === item.name ? 'text-amber-500 font-bold' : 'text-neutral-300 hover:text-white'
              }`}
            >
              {item.name}
            </button>
          ))}
          <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
            <span>Free delivery over ₹499</span>
            <span className="text-amber-400 font-semibold">Code: TASTY50</span>
          </div>
        </div>
      )}
    </header>
  );
};
