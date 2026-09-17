import { X, Phone, MessageSquare, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';


export const TrackOrderModal: React.FC = () => {
  const { isTrackOrderOpen, setIsTrackOrderOpen, location, showToast } = useApp();

  if (!isTrackOrderOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={() => setIsTrackOrderOpen(false)}
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10 text-left animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#14110f] text-white p-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-500 text-neutral-950 font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                Live Status
              </span>
              <span className="text-xs text-neutral-400">Order #TB-842910</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">
              Arriving in approx 18-22 mins ⏱️
            </h3>
          </div>

          <button
            onClick={() => setIsTrackOrderOpen(false)}
            className="w-8 h-8 rounded-full bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Tracking Stages Timeline */}
          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200">
            {/* Step 1 */}
            <div className="relative flex items-start gap-3">
              <div className="absolute -left-6 mt-0.5 w-4.5 h-4.5 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-4 ring-white shadow-xs text-[10px]">
                ✓
              </div>
              <div>
                <h4 className="text-xs font-bold text-neutral-900">Order Placed & Confirmed</h4>
                <p className="text-[11px] text-neutral-500">Restaurant accepted your order (04:45 PM)</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex items-start gap-3">
              <div className="absolute -left-6 mt-0.5 w-4.5 h-4.5 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-4 ring-white shadow-xs text-[10px]">
                ✓
              </div>
              <div>
                <h4 className="text-xs font-bold text-neutral-900">Kitchen Preparing with Fresh Ingredients</h4>
                <p className="text-[11px] text-neutral-500">Chef is preparing and packing your meal hot</p>
              </div>
            </div>

            {/* Step 3 - Active */}
            <div className="relative flex items-start gap-3">
              <div className="absolute -left-6 mt-0.5 w-4.5 h-4.5 rounded-full bg-amber-500 text-white flex items-center justify-center ring-4 ring-amber-100 shadow-sm animate-pulse text-[10px]">
                🛵
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-700">Rider on the Way to Deliver</h4>
                <p className="text-[11px] text-neutral-600 font-medium">
                  Rahul Verma has picked up your order and is driving towards you
                </p>
              </div>
            </div>

            {/* Step 4 - Pending */}
            <div className="relative flex items-start gap-3 opacity-50">
              <div className="absolute -left-6 mt-0.5 w-4.5 h-4.5 rounded-full bg-neutral-300 text-white flex items-center justify-center ring-4 ring-white text-[10px]">
                4
              </div>
              <div>
                <h4 className="text-xs font-bold text-neutral-800">Delivered & Hot at Your Doorstep</h4>
                <p className="text-[11px] text-neutral-500">Enjoy your TastyBites experience!</p>
              </div>
            </div>
          </div>

          {/* Delivery Rider Card */}
          <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-xl">
                👨🏽‍🍳
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs sm:text-sm text-neutral-900">Rahul Verma</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                    ★ 4.9
                  </span>
                </div>
                <span className="text-[11px] text-neutral-500 block">Eco EV Rider • 1,420 orders</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => showToast('Calling delivery partner Rahul Verma...', 'info')}
                className="p-2 rounded-xl bg-white border border-neutral-200 text-neutral-700 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300 transition cursor-pointer"
                title="Call Rider"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                onClick={() => showToast('Opening chat with delivery partner...', 'info')}
                className="p-2 rounded-xl bg-white border border-neutral-200 text-neutral-700 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-300 transition cursor-pointer"
                title="Message Rider"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Delivery Address Details */}
          <div className="flex items-start gap-2.5 text-xs text-neutral-600 pt-1">
            <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-neutral-900">Delivery Address:</span>
              <p className="text-[11px] text-neutral-500">
                102, Green Glen Heights, {location.city}, PIN: {location.pincode}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-xs">
          <span className="text-neutral-500">Need help with this order?</span>
          <button
            onClick={() => showToast('Live support chat connected with support executive!', 'info')}
            className="text-amber-600 font-bold hover:underline cursor-pointer"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};
