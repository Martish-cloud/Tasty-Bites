import { useState } from 'react';
import { X, MapPin, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

import { DELIVERY_LOCATIONS } from '../data/products';

export const LocationModal: React.FC = () => {
  const { isLocationModalOpen, setIsLocationModalOpen, location, setLocation } = useApp();
  const [customCity, setCustomCity] = useState('');
  const [customPincode, setCustomPincode] = useState('');

  if (!isLocationModalOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCity.trim() || !customPincode.trim()) return;
    setLocation({ city: customCity.trim(), pincode: customPincode.trim() });
    setIsLocationModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={() => setIsLocationModalOpen(false)}
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden z-10 text-left animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500/15 text-amber-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">Select Delivery Location</h3>
              <p className="text-[11px] text-neutral-500">Fast delivery within 20-30 minutes</p>
            </div>
          </div>

          <button
            onClick={() => setIsLocationModalOpen(false)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Popular Locations */}
        <div className="p-5 space-y-4">
          <div>
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-2">
              Popular Cities
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DELIVERY_LOCATIONS.map((loc, idx) => {
                const isSelected = location.pincode === loc.pincode && location.city === loc.city;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setLocation({ city: loc.city, pincode: loc.pincode });
                      setIsLocationModalOpen(false);
                    }}
                    className={`flex items-start justify-between p-2.5 rounded-xl border text-left transition cursor-pointer ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/50 text-amber-950 font-bold'
                        : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 text-neutral-700'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold flex items-center gap-1">
                        <span>{loc.city}</span>
                        <span className="text-[10px] text-neutral-400 font-normal">({loc.pincode})</span>
                      </div>
                      <span className="text-[10px] text-neutral-500 line-clamp-1 mt-0.5">
                        {loc.area}
                      </span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Pincode Form */}
          <div className="pt-2 border-t border-neutral-100">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-2">
              Or Enter Custom Location
            </span>
            <form onSubmit={handleCustomSubmit} className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={customCity}
                  onChange={(e) => setCustomCity(e.target.value)}
                  placeholder="City Name"
                  className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
                />
                <input
                  type="text"
                  value={customPincode}
                  onChange={(e) => setCustomPincode(e.target.value)}
                  placeholder="Pincode (e.g. 560001)"
                  className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#e52e2e] hover:bg-[#cc2222] text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition cursor-pointer"
              >
                Set My Location
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
