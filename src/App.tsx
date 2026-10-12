import { AppProvider, useApp } from './context/AppContext';

import { TopBar } from './components/TopBar';
import { Navbar } from './components/Navbar';
import { CinematicHero } from './components/CinematicHero';
import { Section1VideoShowcase } from './components/Section1VideoShowcase';
import { CategoryBar } from './sections/CategoryBar';
import { PopularDishes } from './sections/PopularDishes';
import { ServiceBenefits } from './sections/ServiceBenefits';
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

export function AppContent() {
  const { isAdminOpen, setIsAdminOpen } = useApp();

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-neutral-800 flex flex-col font-sans selection:bg-amber-500 selection:text-white">
      {/* 1. Top Utility Bar */}
      <TopBar />

      {/* 2. Sticky Navbar */}
      <Navbar />

      {/* 3. Main Content with Cinematic 160-Frame Sequence & Section 1 Video Showcase */}
      <main className="flex-1">
        <CinematicHero />
        <Section1VideoShowcase />

        {/* 4 & 5 & 6. Category Strip & Promo Banner Card */}
        <CategoryBar />

        {/* 7 & 8. Popular Dishes & 50% Off Promo Card */}
        <PopularDishes />

        {/* 9. Trust & Service Benefits Strip */}
        <ServiceBenefits />
      </main>

      {/* 10. Dark Luxury Footer */}
      <Footer />

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
