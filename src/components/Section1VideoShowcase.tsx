import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Sparkles, Flame, Plus, Minus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/products';

export interface VideoItem {
  id: string;
  title: string;
  category: string;
  src: string;
  poster: string;
  badge: string;
  badgeColor: string;
  description: string;
  associatedProductId: string;
  dishName: string;
  price: number;
}

export const SECTION_1_VIDEOS: VideoItem[] = [
  {
    id: 'commercial',
    title: 'TastyBites Brand Story: The Art of Good Food',
    category: 'Commercial Showcase',
    src: '/Videos/Sec 1/Commercial_advertisement.mp4',
    poster: '/Videos/Sec 1/thumb_commercial.jpg',
    badge: '★ Brand Anthem',
    badgeColor: 'bg-amber-500 text-neutral-950',
    description: 'A cinematic look into our kitchen philosophy — farm-fresh sourcing, wood-fired hearths, and handcrafted joy.',
    associatedProductId: 'classic-burger',
    dishName: 'Classic Gourmet Burger',
    price: 149,
  },
  {
    id: 'grilled-chicken',
    title: 'Sizzling Gourmet Fire-Grilled Chicken',
    category: 'Flame Grill',
    src: '/Videos/Sec 1/Grilled_chicken_food.mp4',
    poster: '/Videos/Sec 1/thumb_grilled_chicken.jpg',
    badge: '🔥 Live Flame',
    badgeColor: 'bg-red-500 text-white',
    description: 'Charcoal grilled to perfection with rosemary garlic basting and spiced herb glaze.',
    associatedProductId: 'grilled-chicken',
    dishName: 'Charcoal Grilled Chicken',
    price: 299,
  },
  {
    id: 'mango-smoothie',
    title: 'Cold-Pressed Mango Banana Artisanal Smoothie',
    category: 'Chilled Coolers',
    src: '/Videos/Sec 1/Mango_banana_smoothie.mp4',
    poster: '/Videos/Sec 1/thumb_mango_smoothie.jpg',
    badge: '🥭 Farm Fresh',
    badgeColor: 'bg-yellow-500 text-neutral-950',
    description: 'Pure Alphonso mango pulp blended with Cavendish bananas, organic honey, and chilled oat milk.',
    associatedProductId: 'mango-velvet-smoothie',
    dishName: 'Alphonso Mango Velvet Smoothie',
    price: 139,
  },
  {
    id: 'hakka-noodles',
    title: 'Master Wok Tossing Hakka Noodles in Flame',
    category: 'Wok Specialties',
    src: '/Videos/Sec 1/Wok_tossing_Hakka_noodles.mp4',
    poster: '/Videos/Sec 1/thumb_hakka_noodles.jpg',
    badge: '🥡 High Wok Sear',
    badgeColor: 'bg-orange-500 text-white',
    description: 'Springy hand-pulled egg noodles flash-tossed in high flame woks with crisp peppers and secret Schezwan oil.',
    associatedProductId: 'chilli-garlic-noodles',
    dishName: 'Chilli Garlic Hakka Noodles',
    price: 189,
  },
];

export const Section1VideoShowcase: React.FC = () => {
  const { addToCart, updateQuantity, showToast, setIsVideoModalOpen, cart } = useApp();
  const [selectedVideo, setSelectedVideo] = useState<VideoItem>(SECTION_1_VIDEOS[0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const mainVideoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Auto pause when scrolled out of view to preserve resources
  useEffect(() => {
    const video = mainVideoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
            setIsPlaying(true);
          } else {
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    const video = mainVideoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = mainVideoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleSelectVideo = (item: VideoItem) => {
    if (selectedVideo.id === item.id) return;
    setSelectedVideo(item);
    setIsPlaying(true);
    if (mainVideoRef.current) {
      mainVideoRef.current.pause();
      mainVideoRef.current.poster = item.poster;
      mainVideoRef.current.src = item.src;
      mainVideoRef.current.load();
      mainVideoRef.current.play().catch(() => {});
    }
  };

  // Find associated product or generate temporary cart item
  const handleAddDish = (dishId: string, dishName: string, price: number) => {
    const existing = PRODUCTS.find((p) => p.id === dishId);
    if (existing) {
      addToCart(existing);
    } else {
      addToCart({
        id: dishId,
        name: dishName,
        category: 'continental',
        price,
        rating: 4.8,
        reviews: '1.2k',
        deliveryTime: '20 mins',
        image: selectedVideo.poster,
        description: selectedVideo.description,
        isVeg: false,
      });
    }
  };

  return (
    <section
      id="kitchen-videos"
      ref={sectionRef}
      className="relative w-full bg-[#0d0c0b] text-white py-16 sm:py-24 border-b border-neutral-800/80 overflow-hidden"
    >
      {/* Background ambient warmth */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 text-left">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-amber-500/30 text-amber-400 font-bold text-xs uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Section 1 Live Culinary Theatre</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              Kitchen in <span className="text-amber-400">Motion</span>
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm md:text-base mt-2 max-w-xl">
              Witness the four culinary pillars of TastyBites — from high-flame wok toss to charcoal grills, freshly cold-pressed coolers, and our brand cinema.
            </p>
          </div>

          {/* Video Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {SECTION_1_VIDEOS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelectVideo(item)}
                className={`text-xs px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  selectedVideo.id === item.id
                    ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                    : 'bg-neutral-900/80 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                }`}
              >
                <span>{item.category}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Video Arena Layout: Left Featured Large Player (7 cols), Right 3 Video Showcase Cards (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Main Cinema Player (7 cols) */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-black border border-neutral-800 shadow-2xl group flex-1">
              <video
                ref={mainVideoRef}
                src={selectedVideo.src}
                poster={selectedVideo.poster}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover"
              />

              {/* Gradient Vignettes */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 pointer-events-none" />

              {/* Top Floating Badge */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${selectedVideo.badgeColor}`}
                >
                  {selectedVideo.badge}
                </span>
                <span className="text-[11px] bg-black/60 backdrop-blur-md text-neutral-300 px-2.5 py-1 rounded-full border border-neutral-700">
                  {selectedVideo.category}
                </span>
              </div>

              {/* Bottom Video Controls Overlay */}
              <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-left">
                <div className="max-w-md pr-4">
                  <h3 className="font-extrabold text-base sm:text-lg text-white leading-tight drop-shadow-md">
                    {selectedVideo.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-neutral-300 line-clamp-1 mt-0.5">
                    {selectedVideo.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={togglePlay}
                    className="w-9 h-9 rounded-full bg-black/70 hover:bg-amber-500 hover:text-neutral-950 backdrop-blur-md border border-neutral-700 flex items-center justify-center transition cursor-pointer text-white"
                    title={isPlaying ? 'Pause Video' : 'Play Video'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>

                  <button
                    onClick={toggleMute}
                    className="w-9 h-9 rounded-full bg-black/70 hover:bg-amber-500 hover:text-neutral-950 backdrop-blur-md border border-neutral-700 flex items-center justify-center transition cursor-pointer text-white"
                    title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => setIsVideoModalOpen(true)}
                    className="w-9 h-9 rounded-full bg-black/70 hover:bg-neutral-800 backdrop-blur-md border border-neutral-700 flex items-center justify-center transition cursor-pointer text-white"
                    title="Expand Fullscreen Modal"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Quick Order Strip for Featured Video Dish */}
            <div className="mt-4 bg-neutral-900/90 rounded-2xl p-4 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Flame className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{selectedVideo.dishName}</span>
                    <span className="font-mono text-amber-400 text-sm font-extrabold">
                      ₹{selectedVideo.price}
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-400">
                    Prepared live with ingredients seen in this video
                  </span>
                </div>
              </div>

              {(() => {
                const videoCartItem = cart.find(
                  (i) => i.product.id === selectedVideo.associatedProductId
                );
                if (videoCartItem) {
                  return (
                    <div className="flex items-center bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-1.5 gap-3">
                      <button
                        type="button"
                        onClick={() => updateQuantity(selectedVideo.associatedProductId, -1)}
                        className="w-7 h-7 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white flex items-center justify-center transition cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-extrabold text-white text-xs px-1 min-w-[24px] text-center">
                        {videoCartItem.quantity} in basket
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (videoCartItem.quantity >= 10) {
                            showToast(`Maximum limit of 10 reached for this item`, 'info');
                          } else {
                            updateQuantity(selectedVideo.associatedProductId, 1);
                          }
                        }}
                        disabled={videoCartItem.quantity >= 10}
                        className={`w-7 h-7 rounded-lg bg-neutral-700 flex items-center justify-center transition cursor-pointer ${
                          videoCartItem.quantity >= 10
                            ? 'opacity-40 cursor-not-allowed text-neutral-500'
                            : 'hover:bg-neutral-600 text-white'
                        }`}
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                }
                return (
                  <button
                    onClick={() =>
                      handleAddDish(
                        selectedVideo.associatedProductId,
                        selectedVideo.dishName,
                        selectedVideo.price
                      )
                    }
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer bg-[#e52e2e] hover:bg-[#cc2222] text-white shadow-lg shadow-red-900/30"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Order This Dish (₹{selectedVideo.price})</span>
                  </button>
                );
              })()}
            </div>
          </div>

          {/* Right Supporting 3 Video Cards (5 cols) */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col space-y-3.5 text-left">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider px-1">
              All 4 Section 1 Culinary Videos
            </span>

            {SECTION_1_VIDEOS.map((item) => {
              const isCurrent = selectedVideo.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectVideo(item)}
                  className={`relative p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 group ${
                    isCurrent
                      ? 'bg-neutral-800/90 border-amber-500 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500'
                      : 'bg-neutral-900/60 border-neutral-800 hover:bg-neutral-800/70 hover:border-neutral-700'
                  }`}
                >
                  {/* Video Thumbnail Image */}
                  <div className="relative w-28 h-20 rounded-xl overflow-hidden bg-neutral-950 shrink-0 border border-neutral-700/60 shadow-xs">
                    <img
                      src={item.poster}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/25 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                      <div className="w-7 h-7 rounded-full bg-amber-500/90 text-neutral-950 flex items-center justify-center shadow-md">
                        <Play className="w-3 h-3 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Info details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/30">
                        {item.category}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-white truncate group-hover:text-amber-400 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-neutral-800/60 text-[11px]">
                      <span className="text-neutral-300 font-semibold">{item.dishName}</span>
                      <span className="text-amber-400 font-extrabold">₹{item.price}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
