import React, { useState } from 'react';
import { X, Volume2, VolumeX, ChefHat, Play, Flame, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SECTION_1_VIDEOS, type VideoItem } from './Section1VideoShowcase';
import { PRODUCTS } from '../data/products';

export const VideoModal: React.FC = () => {
  const { isVideoModalOpen, setIsVideoModalOpen, addToCart } = useApp();
  const [activeVideo, setActiveVideo] = useState<VideoItem>(SECTION_1_VIDEOS[0]);
  const [isMuted, setIsMuted] = useState(false);

  if (!isVideoModalOpen) return null;

  const handleOrderDish = () => {
    const dish = PRODUCTS.find((p) => p.id === activeVideo.associatedProductId);
    if (dish) {
      addToCart(dish);
    } else {
      addToCart({
        id: activeVideo.associatedProductId,
        name: activeVideo.dishName,
        category: 'continental',
        price: activeVideo.price,
        rating: 4.9,
        reviews: '2.4k',
        deliveryTime: '20 mins',
        image: activeVideo.poster,
        description: activeVideo.description,
        isVeg: false,
      });
    }
    setIsVideoModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsVideoModalOpen(false)}
        className="fixed inset-0 bg-black/90 backdrop-blur-md transition-opacity"
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-5xl bg-neutral-950 rounded-3xl shadow-2xl border border-neutral-800 overflow-hidden z-10 text-left animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-neutral-800 bg-neutral-900/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>The Art of Good Food | TastyBites Cinema</span>
                <span className="text-[10px] bg-red-600/90 text-white font-bold px-2 py-0.5 rounded-full uppercase">
                  4 HD Videos
                </span>
              </h3>
              <p className="text-[11px] text-neutral-400">
                Witness wood-fired hearths, sizzling woks, and artisanal farm-fresh coolers.
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

        {/* Video Selector Tabs */}
        <div className="bg-neutral-900/60 px-4 py-2 border-b border-neutral-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          {SECTION_1_VIDEOS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveVideo(item)}
              className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeVideo.id === item.id
                  ? 'bg-amber-500 text-neutral-950 shadow-md'
                  : 'bg-neutral-800/70 text-neutral-300 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <Play className="w-3 h-3 fill-current" />
              <span>{item.category}</span>
            </button>
          ))}
        </div>

        {/* Video Player */}
        <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden flex-1">
          <video
            key={activeVideo.src}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            controls
            className="w-full h-full object-contain"
            poster={activeVideo.poster}
          >
            <source src={activeVideo.src} type="video/mp4" />
          </video>

          {/* Tasty Bites Official Branded Badge covering Google Flow watermark */}
          <div
            className="absolute z-15 pointer-events-none select-none flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-950/85 backdrop-blur-md border border-amber-500/40 shadow-lg shadow-black/80"
            style={{ left: '90.57%', top: '83.15%', transform: 'translate(-50%, -50%)' }}
            title="TastyBites Culinary Cinema"
          >
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white border border-amber-400/70 shadow-sm shrink-0">
              <ChefHat className="w-2.5 h-2.5" />
            </div>
            <span className="font-extrabold text-[10px] tracking-tight text-white whitespace-nowrap">
              Tasty<span className="text-amber-400">Bites</span>
            </span>
          </div>

          {/* Floating Audio Quick Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/70 hover:bg-amber-500 hover:text-neutral-950 backdrop-blur-md text-white flex items-center justify-center transition cursor-pointer border border-neutral-700 shadow-lg"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Footer Details & Order Action */}
        <div className="p-4 sm:p-5 bg-neutral-900 text-neutral-300 text-xs flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 border-t border-neutral-800">
          <div className="flex items-center gap-3 text-left w-full sm:w-auto">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold">{activeVideo.title}</span>
                <span className="text-amber-400 font-extrabold">₹{activeVideo.price}</span>
              </div>
              <p className="text-[11px] text-neutral-400 line-clamp-1">
                {activeVideo.description}
              </p>
            </div>
          </div>

          <button
            onClick={handleOrderDish}
            className="w-full sm:w-auto bg-[#e52e2e] hover:bg-[#cc2222] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg transition cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Order {activeVideo.dishName}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
