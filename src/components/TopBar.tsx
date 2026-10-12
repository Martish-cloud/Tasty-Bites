import { Heart, MapPin, Tag, Compass, HelpCircle, User, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';


export const TopBar: React.FC = () => {
  const {
    location,
    setIsLocationModalOpen,
    setIsOffersModalOpen,
    setIsTrackOrderOpen,
    setIsAuthModalOpen,
    setIsAdminOpen,
    showToast,
  } = useApp();

  return (
    <div className="w-full bg-[#0c0b0a] text-neutral-300 text-xs py-2 px-4 sm:px-8 border-b border-neutral-800/60 select-none z-30 relative">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4">
        {/* Left info items */}
        <div className="flex items-center space-x-3 text-[11px] sm:text-xs font-medium text-neutral-300">
          <div className="flex items-center gap-1.5 hover:text-white transition cursor-default">
            <span className="w-4 h-4 rounded-full bg-emerald-950/80 text-emerald-400 flex items-center justify-center text-[10px]">
              🌿
            </span>
            <span>Fresh Ingredients</span>
          </div>

          <span className="text-neutral-700">|</span>

          <div className="flex items-center gap-1.5 hover:text-white transition cursor-default">
            <span className="w-4 h-4 rounded-full bg-amber-950/80 text-amber-400 flex items-center justify-center text-[10px]">
              🚚
            </span>
            <span>Fast Delivery</span>
          </div>

          <span className="text-neutral-700 hidden sm:inline">|</span>

          <div className="hidden sm:flex items-center gap-1.5 hover:text-white transition cursor-default">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>Great Taste Always</span>
          </div>
        </div>

        {/* Right utility links */}
        <div className="flex items-center flex-wrap justify-center gap-2 sm:gap-3 text-[11px] sm:text-xs font-medium text-neutral-300">
          {/* Deliver to button */}
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="flex items-center gap-1 hover:text-amber-400 transition cursor-pointer group px-1 py-0.5"
            title="Change Delivery Location"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-500 group-hover:animate-bounce" />
            <span className="text-neutral-400">Deliver to:</span>
            <span className="text-white font-semibold">{location.city}, {location.pincode}</span>
            <ChevronDown className="w-3 h-3 text-neutral-400 group-hover:text-amber-400" />
          </button>

          <span className="text-neutral-700">|</span>

          {/* Offers */}
          <button
            onClick={() => setIsOffersModalOpen(true)}
            className="flex items-center gap-1 text-amber-400 font-semibold hover:text-amber-300 transition cursor-pointer"
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Offers</span>
          </button>

          <span className="text-neutral-700">|</span>

          {/* Track Order */}
          <button
            onClick={() => setIsTrackOrderOpen(true)}
            className="flex items-center gap-1 hover:text-white transition cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-neutral-400" />
            <span>Track Order</span>
          </button>

          <span className="text-neutral-700 hidden sm:inline">|</span>

          {/* Help */}
          <button
            onClick={() => showToast('TastyBites 24/7 Support: Call 1800-TASTY or email support@tastybites.com', 'info')}
            className="hidden sm:flex items-center gap-1 hover:text-white transition cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-neutral-400" />
            <span>Help</span>
          </button>

          <span className="text-neutral-700 hidden sm:inline">|</span>

          {/* Staff Admin Portal */}
          <button
            onClick={() => setIsAdminOpen(true)}
            className="flex items-center gap-1 text-amber-500/90 hover:text-amber-400 transition font-mono text-[11px] cursor-pointer"
            title="Staff Admin Portal (PIN: 1234)"
          >
            <span>🔐 Admin</span>
          </button>

          <span className="text-neutral-700">|</span>

          {/* Sign In */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-1 text-neutral-200 hover:text-amber-400 transition font-medium cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-neutral-400" />
            <span>Sign In</span>
          </button>
        </div>
      </div>
    </div>
  );
};
