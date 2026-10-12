import { AppProvider, useApp } from './context/AppContext';

import { TopBar } from './components/TopBar';
import { Navbar } from './components/Navbar';
import { CinematicHero } from './components/CinematicHero';
import { Section1VideoShowcase } from './components/Section1VideoShowcase';
import { CategoryBar } from './sections/CategoryBar';
import { PopularDishes } from './sections/PopularDishes';
import { ComboOffersPreview } from './sections/ComboOffersPreview';
import { AnimatedFoodShowcase } from './components/AnimatedFoodShowcase';
import { BrandStorySection } from './sections/BrandStorySection';
import { ServiceBenefits } from './sections/ServiceBenefits';
import { CustomerReviewsSection } from './sections/CustomerReviewsSection';
import { FAQSection } from './sections/FAQSection';
import { Footer } from './sections/Footer';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { VideoModal } from './components/VideoModal';
import { TrackOrderModal } from './components/TrackOrderModal';
import { AdminModal } from './components/AdminModal';
import { LocationModal } from './components/LocationModal';
import { OffersModal } from './components/OffersModal';
import { AuthModal } from './components/AuthModal';
import { FullMenuModal } from './sections/FullMenuModal';
import { ToastContainer } from './components/Toast';
import { MadeByZynova } from './components/MadeByZynova';
import { AllReviewsPage } from './pages/AllReviewsPage';
import { ComboOffersPage } from './pages/ComboOffersPage';

export function AppContent() {
  const { isAdminOpen, setIsAdminOpen, currentRoute, navigateTo } = useApp();

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-neutral-800 flex flex-col font-sans selection:bg-amber-500 selection:text-white relative">
      {/* 1. Top Utility Bar */}
      <TopBar />

      {/* 2. Sticky Navbar */}
      <Navbar />

      {/* 3. Main Route Views */}
      <main className="flex-1">
        {currentRoute === 'reviews' ? (
          <AllReviewsPage onBackToHome={() => navigateTo('home')} />
        ) : currentRoute === 'combo-offers' ? (
          <ComboOffersPage onBackToHome={() => navigateTo('home')} />
        ) : (
          <>
            {/* Cinematic 160-Frame Hero Sequence */}
            <CinematicHero />
            <Section1VideoShowcase />

            {/* Category Strip & Promo Banner Card */}
            <CategoryBar />

            {/* Popular Dishes */}
            <PopularDishes />

            {/* TASK 4: Special Combo Offers Preview (EXACTLY ABOVE moving food showcase) */}
            <ComboOffersPreview onExploreAllCombos={() => navigateTo('combo-offers')} />

            {/* Four Animated Food-Product Showcase Rows (Alternating directions) */}
            <AnimatedFoodShowcase />

            {/* Brand Story & Master Kitchen Standards (TASK 1: Café Storefront Image) */}
            <BrandStorySection />

            {/* Trust & Service Benefits Strip */}
            <ServiceBenefits />

            {/* Customer Reviews & Testimonials Section */}
            <CustomerReviewsSection onViewAllReviews={() => navigateTo('reviews')} />

            {/* Frequently Asked Questions */}
            <FAQSection />
          </>
        )}
      </main>

      {/* 4. Luxury Dark Footer */}
      <Footer />

      {/* 5. Minimal Fixed "Made by Zynova" Watermark (Always stationary bottom-right across all routes) */}
      <MadeByZynova />

      {/* Interactive Drawers & Modals */}
      <CartDrawer />
      <WishlistDrawer />
      <ProductDetailModal />
      <VideoModal />
      <TrackOrderModal />
      <AdminModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
      <LocationModal />
      <OffersModal />
      <AuthModal />
      <FullMenuModal />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
