import { useState } from 'react';
import { X, Volume2, VolumeX, ChefHat } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const VideoModal: React.FC = () => {
  const { isVideoModalOpen, setIsVideoModalOpen, setIsMenuModalOpen } = useApp();
  const [isMuted, setIsMuted] = useState(true);


  if (!isVideoModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsVideoModalOpen(false)}
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-4xl bg-neutral-950 rounded-3xl shadow-2xl border border-neutral-800 overflow-hidden z-10 text-left animate-in fade-in zoom-in-95 duration-300">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-neutral-800 bg-neutral-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <ChefHat className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                The Art of Good Food | TastyBites Kitchen Stories
              </h3>
              <p className="text-[11px] text-neutral-400">
                Witness our wood-fired ovens, farm-fresh produce, and secret artisan sauces.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsVideoModalOpen(false)}
            className="w-8 h-8 rounded-full bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Player Mock / Live Video */}
        <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
          {/* High quality culinary MP4 showcase or looping visual */}
          <video
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover"
            poster="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80"
          >
            <source
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4"
              type="video/mp4"
            />
          </video>

          {/* Floating Video Overlay Controls */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-amber-500 hover:text-neutral-950 transition cursor-pointer shadow-md"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <span className="text-xs text-neutral-300 font-medium">
                {isMuted ? 'Click for Sound' : 'Audio Enabled 🎵'}
              </span>
            </div>

            <button
              onClick={() => {
                setIsVideoModalOpen(false);
                setIsMenuModalOpen(true);
              }}
              className="bg-[#e52e2e] hover:bg-[#cc2222] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg transition cursor-pointer"
            >
              Order These Dishes →
            </button>
          </div>
        </div>

        {/* Story note */}
        <div className="p-4 sm:p-5 bg-neutral-900 text-neutral-300 text-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold">✨ Farm-to-Table Philosophy:</span>
            <span className="text-neutral-400">
              Every morning at 5:00 AM, our chefs hand-select fresh vegetables, herbs, and bakery buns.
            </span>
          </div>
          <span className="text-neutral-500 text-[11px] shrink-0">TastyBites Culinary Standard</span>
        </div>
      </div>
    </div>
  );
};
