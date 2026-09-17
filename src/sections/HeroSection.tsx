import { ArrowRight, Play, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';


export const HeroSection: React.FC = () => {
  const { setIsVideoModalOpen, setIsMenuModalOpen } = useApp();

  const handleOrderOnline = () => {
    const el = document.getElementById('popular-dishes');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setIsMenuModalOpen(true);
    }
  };

  return (
    <section className="relative w-full bg-[#14110f] overflow-hidden pt-8 pb-16 lg:pt-12 lg:pb-20 border-b border-neutral-800/40">
      {/* Warm atmospheric restaurant glow background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(245,158,11,0.14),transparent_55%)] pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
          {/* Left Column: Hero Content (5 cols) */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center text-left">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="text-amber-500 font-bold tracking-[0.25em] text-[11px] sm:text-xs uppercase">
                GOOD FOOD. BRIGHTER DAYS.
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.08] tracking-tight mb-4">
              Good Food<br />
              Brings People<br />
              <span className="text-amber-500 drop-shadow-[0_4px_24px_rgba(245,158,11,0.35)]">
                Together
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-neutral-300 text-sm sm:text-base font-normal leading-relaxed mb-7 max-w-md">
              Fresh Ingredients. Great Taste. Always.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <button
                onClick={handleOrderOnline}
                className="bg-[#e52e2e] hover:bg-[#cc2222] text-white font-bold text-sm px-7 py-3.5 rounded-xl flex items-center gap-2.5 shadow-lg shadow-red-900/30 hover:shadow-red-700/40 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer group"
              >
                <span>Order Online</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setIsVideoModalOpen(true)}
                className="bg-neutral-900/80 hover:bg-neutral-800 text-white font-semibold text-sm px-6 py-3.5 rounded-xl flex items-center gap-2.5 border border-neutral-700 hover:border-neutral-500 transition-all cursor-pointer group"
              >
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-amber-500/20 group-hover:text-amber-400 transition-colors">
                  <Play className="w-3 h-3 fill-current text-white group-hover:text-amber-400 ml-0.5" />
                </div>
                <span>Watch Video</span>
              </button>
            </div>

            {/* Feature Highlights Pills (Matches screenshot under buttons) */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900/70 border border-neutral-700/70 text-neutral-300 text-xs font-medium">
                <span className="w-4 h-4 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center text-[10px]">
                  🌿
                </span>
                <span>Fresh Ingredients</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900/70 border border-neutral-700/70 text-neutral-300 text-xs font-medium">
                <span className="w-4 h-4 rounded-full bg-amber-950 text-amber-400 flex items-center justify-center text-[10px]">
                  🚚
                </span>
                <span>Fast Delivery</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900/70 border border-neutral-700/70 text-neutral-300 text-xs font-medium">
                <span className="w-4 h-4 rounded-full bg-amber-950 text-amber-400 flex items-center justify-center text-[10px]">
                  ⭐
                </span>
                <span>Best Quality</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900/70 border border-neutral-700/70 text-neutral-300 text-xs font-medium">
                <span className="w-4 h-4 rounded-full bg-orange-950 text-orange-400 flex items-center justify-center text-[10px]">
                  🍴
                </span>
                <span>Wide Menu</span>
              </div>
            </div>
          </div>

          {/* Right Column: Large Hero Burger with Fries & Handwritten Notes (7 cols) */}
          <div className="lg:col-span-6 xl:col-span-7 relative flex items-center justify-center lg:justify-end mt-4 lg:mt-0">
            {/* Handwritten Note 1: "It's Always a Good Food Day" (Left of Burger) */}
            <div className="absolute -top-4 left-2 sm:left-4 z-20 text-neutral-200/90 font-script text-2xl sm:text-3xl lg:text-4xl -rotate-6 select-none pointer-events-none drop-shadow-lg text-left leading-tight">
              <span className="block">It&apos;s</span>
              <span className="block">Always</span>
              <span className="block">a Good</span>
              <span className="block text-amber-400/95 font-bold">Food Day</span>
            </div>

            {/* Handwritten Note 2: "Bite Happiness Everyday ♡" (Top Right above Fries) */}
            <div className="absolute top-0 right-2 sm:right-6 z-20 text-neutral-200/90 font-script text-2xl sm:text-3xl lg:text-4xl rotate-6 select-none pointer-events-none drop-shadow-lg text-right leading-tight">
              <span className="block">Bite</span>
              <span className="block">Happiness</span>
              <span className="block text-amber-400/95 font-bold">Everyday</span>
              <span className="block text-amber-400 text-2xl sm:text-3xl mt-0.5">♡</span>
            </div>

            {/* Burger & French Fries Container */}
            <div className="relative w-full max-w-xl lg:max-w-none group">
              {/* Background ambient circular glow under burger */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

              {/* Main Burger Image */}
              <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-black/80 border border-neutral-800/40">
                <img
                  src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1400&q=85"
                  alt="TastyBites Signature Gourmet Burger with Crispy French Fries"
                  className="w-full h-auto max-h-[460px] lg:max-h-[500px] object-cover object-center transform group-hover:scale-102 transition-transform duration-700 ease-out"
                />

                {/* Subtle vignette gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#14110f]/80 via-transparent to-black/20 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#14110f]/60 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Floating Chef Badge Pill */}
              <div className="absolute -bottom-3 left-6 sm:left-10 bg-black/80 backdrop-blur-md border border-neutral-700/80 px-4 py-2 rounded-xl shadow-xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-white font-bold text-xs">Chef&apos;s Signature</span>
                    <span className="text-amber-400 text-xs font-semibold">4.9 ★</span>
                  </div>
                  <span className="text-neutral-400 text-[10px]">Over 50,000+ happy bites</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
