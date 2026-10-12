import React, { useState } from 'react';
import { X, MapPin, Check, AlertCircle, CheckCircle2, ChevronRight, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  POPULAR_LOCATIONS,
  checkDeliveryServiceability,
  type DeliveryLocationOption,
} from '../data/products';

export const LocationModal: React.FC = () => {
  const { isLocationModalOpen, setIsLocationModalOpen, location, setLocation, showToast } = useApp();

  const [customCity, setCustomCity] = useState('');
  const [customPincode, setCustomPincode] = useState('');
  const [selectedPunjabRegion, setSelectedPunjabRegion] = useState(false);

  // Verification state: null | { serviceable: boolean; invalidFormat?: boolean; message: string; city: string; pincode: string }
  const [verificationResult, setVerificationResult] = useState<ReturnType<typeof checkDeliveryServiceability> | null>(null);

  if (!isLocationModalOpen) return null;

  const handleClose = () => {
    setIsLocationModalOpen(false);
    setVerificationResult(null);
    setSelectedPunjabRegion(false);
  };

  // Run availability check on submit
  const handleCheckCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = checkDeliveryServiceability(customCity, customPincode);
    setVerificationResult(result);
  };

  // When clicking a popular location card
  const handleSelectPopularCard = (loc: DeliveryLocationOption) => {
    if (loc.isRegion) {
      setSelectedPunjabRegion(true);
      setVerificationResult(null);
      return;
    }

    if (loc.pincode) {
      setCustomCity(loc.city);
      setCustomPincode(loc.pincode);
      const result = checkDeliveryServiceability(loc.city, loc.pincode);
      setVerificationResult(result);
    }
  };

  // Confirm and persist location
  const handleConfirmLocation = (city: string, pincode: string) => {
    setLocation({ city, pincode });
    showToast(`Delivery location set to ${city} (${pincode})`, 'success');
    handleClose();
  };

  const isCurrentActive = (city: string, pincode?: string) => {
    if (!pincode) return false;
    return location.city.toLowerCase() === city.toLowerCase() && location.pincode === pincode;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10 text-left animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Header */}
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-600 flex items-center justify-center shadow-xs">
              <MapPin className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-neutral-900">Select Delivery Location</h3>
                <span className="text-[10px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                  Express 30 Mins
                </span>
              </div>
              <p className="text-[11.5px] text-neutral-500">
                Current: <span className="font-semibold text-neutral-800">{location.city} ({location.pincode})</span>
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition cursor-pointer"
            aria-label="Close location modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Subview: Punjab Region Cities Selection */}
          {selectedPunjabRegion ? (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedPunjabRegion(false)}
                  className="inline-flex items-center gap-1.5 text-xs text-neutral-600 hover:text-neutral-900 font-semibold cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to all cities</span>
                </button>
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                  Punjab Region
                </span>
              </div>

              <div className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-2xl text-xs text-amber-900">
                <p className="font-semibold">Punjab Serviceable Hubs:</p>
                <p className="text-[11px] text-amber-800/90 mt-0.5">
                  Select a supported city hub or enter your specific PIN code below to check instant coverage.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {POPULAR_LOCATIONS.find((l) => l.isRegion)?.supportedCities?.map((hub) => (
                  <button
                    key={hub.pincode}
                    onClick={() => {
                      setCustomCity(hub.city);
                      setCustomPincode(hub.pincode);
                      const result = checkDeliveryServiceability(hub.city, hub.pincode);
                      setVerificationResult(result);
                    }}
                    className={`flex items-start justify-between p-3 rounded-2xl border text-left transition cursor-pointer ${
                      customPincode === hub.pincode && customCity === hub.city
                        ? 'border-amber-500 bg-amber-50/70 text-amber-950 font-bold shadow-xs'
                        : 'border-neutral-200 hover:border-amber-300 hover:bg-neutral-50 text-neutral-700'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-neutral-900">
                        {hub.city} <span className="text-[11px] font-normal text-neutral-500 font-mono">({hub.pincode})</span>
                      </div>
                      <span className="text-[10px] text-neutral-500 line-clamp-1 mt-0.5">
                        {hub.area}
                      </span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-400 mt-0.5" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Main Popular Locations Grid (6 Unique Options) */
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                  Popular Locations (6 Cities & Regions)
                </span>
                <span className="text-[11px] text-neutral-400">Click to test coverage</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {POPULAR_LOCATIONS.map((loc) => {
                  const isActive = isCurrentActive(loc.city, loc.pincode);
                  const isPendingSelected = customCity === loc.city && (!loc.pincode || customPincode === loc.pincode);

                  return (
                    <button
                      key={loc.city}
                      onClick={() => handleSelectPopularCard(loc)}
                      className={`flex items-start justify-between p-3 rounded-2xl border text-left transition cursor-pointer group ${
                        isActive
                          ? 'border-emerald-500 bg-emerald-50/60 text-emerald-950 font-bold ring-1 ring-emerald-500/30'
                          : isPendingSelected
                          ? 'border-amber-500 bg-amber-50/60 text-amber-950 font-bold'
                          : 'border-neutral-200 hover:border-amber-300 hover:bg-neutral-50 text-neutral-700'
                      }`}
                    >
                      <div className="pr-2">
                        <div className="text-xs font-bold text-neutral-900 flex items-center gap-1.5 flex-wrap">
                          <span>{loc.city}</span>
                          {loc.pincode ? (
                            <span className="text-[10.5px] text-neutral-400 font-mono font-normal">
                              ({loc.pincode})
                            </span>
                          ) : (
                            <span className="text-[9.5px] bg-amber-100 text-amber-800 font-semibold px-1.5 py-0.2 rounded">
                              Region
                            </span>
                          )}
                        </div>
                        <span className="text-[10.5px] text-neutral-500 line-clamp-1 mt-0.5">
                          {loc.area}
                        </span>
                      </div>

                      {isActive ? (
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : loc.isRegion ? (
                        <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-amber-600 transition-colors shrink-0 mt-0.5" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-neutral-300 group-hover:bg-amber-500 transition-colors mt-1.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Validation Result Box */}
          {verificationResult && (
            <div
              className={`p-4 rounded-2xl border transition-all animate-in fade-in duration-200 ${
                verificationResult.serviceable
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50/80 border-rose-200 text-rose-900'
              }`}
            >
              <div className="flex items-start gap-3">
                {verificationResult.serviceable ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <h4 className="text-xs font-bold">
                    {verificationResult.serviceable
                      ? 'Great news! Delivery is available at your location.'
                      : 'Delivery Currently Unavailable'}
                  </h4>
                  <p className="text-[11px] mt-0.5 opacity-90 leading-relaxed">
                    {verificationResult.message}
                  </p>

                  {/* Confirmed Details & Action Button when Serviceable */}
                  {verificationResult.serviceable && (
                    <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-emerald-200/70">
                      <div className="text-[11px] font-medium text-emerald-800">
                        Selected: <span className="font-bold">{verificationResult.city} ({verificationResult.pincode})</span>
                      </div>
                      <button
                        onClick={() =>
                          handleConfirmLocation(verificationResult.city, verificationResult.pincode)
                        }
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-1.5 rounded-xl transition cursor-pointer shadow-xs"
                      >
                        Confirm Location & Continue
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Working Custom Location Form */}
          <div className="pt-3 border-t border-neutral-100">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
              OR ENTER CUSTOM LOCATION
            </span>

            <form onSubmit={handleCheckCustomSubmit} className="space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
                    City Name
                  </label>
                  <input
                    type="text"
                    value={customCity}
                    onChange={(e) => {
                      setCustomCity(e.target.value);
                      if (verificationResult) setVerificationResult(null);
                    }}
                    placeholder="e.g. Pune, Delhi, Mumbai"
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-amber-500 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
                    PIN Code (6 Digits)
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={customPincode}
                    onChange={(e) => {
                      setCustomPincode(e.target.value.replace(/\D/g, ''));
                      if (verificationResult) setVerificationResult(null);
                    }}
                    placeholder="e.g. 411001"
                    className="w-full text-xs font-mono bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-amber-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#e52e2e] hover:bg-[#cc2222] text-white font-bold text-xs py-2.5 rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Check Availability</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
