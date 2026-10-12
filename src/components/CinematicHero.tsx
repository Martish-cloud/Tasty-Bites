import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowRight, Play, Star, ChevronDown, Sparkles, Film } from 'lucide-react';
import { useApp } from '../context/AppContext';

const TOTAL_FRAMES = 160;

// Helper to format frame path
const getFrameSrc = (index: number) => {
  const frameNum = String(index + 1).padStart(3, '0');
  return `/tasty_bites_clean_160_frames/tasty_bites_frame_${frameNum}.jpg`;
};

export const CinematicHero: React.FC = () => {
  const { setIsVideoModalOpen, setIsMenuModalOpen } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [currentFrame, setCurrentFrame] = useState(0);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // In-memory cache of HTMLImageElements
  const imagesRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const rafIdRef = useRef<number | null>(null);
  const lastDrawnFrameRef = useRef<number>(-1);

  // Check reduced motion
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setIsReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  // Draw image on canvas preserving aspect ratio (object-fit: cover)
  const drawFrame = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    // Calculate aspect ratio cover fit
    const imgAspect = img.width / img.height;
    const canvasAspect = displayWidth / displayHeight;

    let drawWidth = displayWidth;
    let drawHeight = displayHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasAspect > imgAspect) {
      drawHeight = displayWidth / imgAspect;
      offsetY = (displayHeight - drawHeight) / 2;
    } else {
      drawWidth = displayHeight * imgAspect;
      offsetX = (displayWidth - drawWidth) / 2;
    }

    ctx.clearRect(0, 0, displayWidth, displayHeight);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    ctx.restore();
  }, []);

  // Preload frame helper
  const preloadImage = useCallback(
    (index: number): Promise<HTMLImageElement> => {
      return new Promise((resolve) => {
        if (imagesRef.current.has(index)) {
          resolve(imagesRef.current.get(index)!);
          return;
        }

        const img = new Image();
        img.src = getFrameSrc(index);
        img.onload = () => {
          imagesRef.current.set(index, img);
          setLoadedCount((prev) => prev + 1);
          resolve(img);
        };
        img.onerror = () => {
          // If frame fails, resolve with fallback (first loaded image)
          const fallback = imagesRef.current.get(0) || img;
          resolve(fallback);
        };
      });
    },
    []
  );

  // Progressive preloading strategy
  useEffect(() => {
    let isCancelled = false;

    // 1. Immediately load frame 0 and display it
    preloadImage(0).then((firstImg) => {
      if (!isCancelled) {
        drawFrame(firstImg);
        lastDrawnFrameRef.current = 0;
      }
    });

    // 2. Preload nearby frames (1-20) right away
    const initialBatch = Array.from({ length: 20 }, (_, i) => i + 1);
    initialBatch.forEach((idx) => {
      if (idx < TOTAL_FRAMES) preloadImage(idx);
    });

    // 3. Staged preloader for remaining frames in chunks
    let currentChunk = 21;
    const chunkSize = 15;

    const loadNextChunk = () => {
      if (isCancelled || currentChunk >= TOTAL_FRAMES) return;
      const end = Math.min(currentChunk + chunkSize, TOTAL_FRAMES);
      for (let i = currentChunk; i < end; i++) {
        preloadImage(i);
      }
      currentChunk = end;
      if (currentChunk < TOTAL_FRAMES) {
        setTimeout(loadNextChunk, 150);
      }
    };

    const timer = setTimeout(loadNextChunk, 300);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [preloadImage, drawFrame]);

  // Scroll mapping
  useEffect(() => {
    if (isReducedMotion) return;

    const handleScroll = () => {
      if (rafIdRef.current) return;

      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const totalScrollable = rect.height - window.innerHeight;
        if (totalScrollable <= 0) return;

        // Progress from 0 (top of section) to 1 (bottom of pinned section)
        const progress = Math.max(0, Math.min(1, -rect.top / totalScrollable));
        const targetFrameIndex = Math.min(TOTAL_FRAMES - 1, Math.floor(progress * TOTAL_FRAMES));

        setCurrentFrame(targetFrameIndex);

        if (targetFrameIndex !== lastDrawnFrameRef.current) {
          // Get image from cache or find closest available loaded frame
          let imgToDraw = imagesRef.current.get(targetFrameIndex);
          if (!imgToDraw) {
            // Find nearest loaded frame
            for (let offset = 1; offset < 20; offset++) {
              if (imagesRef.current.has(targetFrameIndex - offset)) {
                imgToDraw = imagesRef.current.get(targetFrameIndex - offset);
                break;
              }
              if (imagesRef.current.has(targetFrameIndex + offset)) {
                imgToDraw = imagesRef.current.get(targetFrameIndex + offset);
                break;
              }
            }
          }

          if (imgToDraw) {
            drawFrame(imgToDraw);
            lastDrawnFrameRef.current = targetFrameIndex;
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [drawFrame, isReducedMotion]);

  const handleOrderOnline = () => {
    const el = document.getElementById('popular-dishes');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setIsMenuModalOpen(true);
    }
  };

  const handleExploreVideos = () => {
    const el = document.getElementById('kitchen-videos');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const progressPercent = Math.round(((currentFrame + 1) / TOTAL_FRAMES) * 100);

  return (
    <section
      ref={containerRef}
      className={`relative w-full ${
        isReducedMotion ? 'min-h-[85vh]' : 'h-[320vh]'
      } bg-[#14110f] border-b border-neutral-800/60`}
    >
      {/* Pinned Sticky Viewport */}
      <div
        className={`${
          isReducedMotion ? 'relative min-h-[85vh]' : 'sticky top-0 h-screen'
        } w-full overflow-hidden flex flex-col justify-between`}
      >
        {/* Background Canvas: 160 Cinematic Frame Sequence */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        />

        {/* Ambient Dark Atmospheric Vignettes & Glows for Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#14110f] via-black/45 to-black/70 pointer-events-none z-1" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_45%,rgba(245,158,11,0.18),transparent_55%)] pointer-events-none z-1" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none z-1" />

        {/* Top Spacer to account for sticky navbar */}
        <div className="h-6 sm:h-12 pointer-events-none z-10" />

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full relative z-10 py-6 sm:py-10 my-auto text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Bold Headline & Actions */}
            <div className="lg:col-span-7 xl:col-span-7 flex flex-col justify-center">
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-2 mb-3.5 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900/80 border border-amber-500/30 text-amber-400 font-bold tracking-[0.2em] text-[10.5px] uppercase shadow-lg backdrop-blur-md">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  GOOD FOOD. BRIGHTER DAYS.
                </span>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-900/60 border border-neutral-700/60 text-neutral-300 text-[10.5px] font-medium backdrop-blur-md">
                  <Film className="w-3 h-3 text-red-400" />
                  160-Frame Cinematic Journey
                </span>
              </div>

              {/* Main Headline with Masked Reveal & Glowing Amber Accent */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-4 drop-shadow-md">
                Good Food<br />
                Brings People<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 drop-shadow-[0_4px_28px_rgba(245,158,11,0.45)]">
                  Together
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-neutral-200 text-sm sm:text-base md:text-lg font-normal leading-relaxed mb-7 max-w-lg drop-shadow-sm">
                Fresh Ingredients. Master Flame Cooking. Great Taste. Always.
              </p>

              {/* CTA Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 mb-8">
                <button
                  onClick={handleOrderOnline}
                  className="bg-[#e52e2e] hover:bg-[#cc2222] text-white font-bold text-sm px-7 py-3.5 rounded-xl flex items-center gap-2.5 shadow-xl shadow-red-900/40 hover:shadow-red-600/50 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer group"
                >
                  <span>Order Online</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </button>

                <button
                  onClick={handleExploreVideos}
                  className="bg-neutral-900/80 hover:bg-neutral-800 text-white font-semibold text-sm px-6 py-3.5 rounded-xl flex items-center gap-2.5 border border-amber-500/40 hover:border-amber-400 backdrop-blur-md transition-all cursor-pointer group shadow-lg"
                >
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 group-hover:bg-amber-400 group-hover:text-neutral-950 transition-colors">
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                  </div>
                  <span>Kitchen In Motion (4 Videos)</span>
                </button>

                <button
                  onClick={() => setIsVideoModalOpen(true)}
                  className="bg-neutral-950/60 hover:bg-neutral-900 text-neutral-300 hover:text-white font-medium text-xs px-4 py-3.5 rounded-xl border border-neutral-800 backdrop-blur-md transition cursor-pointer"
                >
                  Brand Story
                </button>
              </div>

              {/* Feature Highlights Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-950/80 border border-neutral-700/60 text-neutral-200 text-xs font-medium backdrop-blur-md shadow-xs">
                  <span className="w-4 h-4 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center text-[10px]">
                    🌿
                  </span>
                  <span>Farm-Fresh Ingredients</span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-950/80 border border-neutral-700/60 text-neutral-200 text-xs font-medium backdrop-blur-md shadow-xs">
                  <span className="w-4 h-4 rounded-full bg-amber-950 text-amber-400 flex items-center justify-center text-[10px]">
                    🚚
                  </span>
                  <span>30-Min Express Delivery</span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-950/80 border border-neutral-700/60 text-neutral-200 text-xs font-medium backdrop-blur-md shadow-xs">
                  <span className="w-4 h-4 rounded-full bg-amber-950 text-amber-400 flex items-center justify-center text-[10px]">
                    ⭐
                  </span>
                  <span>4.9 Star Rating</span>
                </div>
              </div>
            </div>

            {/* Right Column: Floating Signature Chef Plaque & Frame Progress Pill */}
            <div className="lg:col-span-5 xl:col-span-5 flex flex-col items-start lg:items-end justify-center space-y-4">
              {/* Handwritten Note Accent */}
              <div className="hidden sm:block text-neutral-200/90 font-script text-2xl sm:text-3xl rotate-3 select-none pointer-events-none drop-shadow-lg text-right leading-tight">
                <span className="block">It&apos;s Always a</span>
                <span className="block text-amber-400 font-bold">Good Food Day ♡</span>
              </div>

              {/* Glassmorphic Chef's Signature Card */}
              <div className="bg-neutral-950/85 backdrop-blur-xl border border-neutral-700/80 p-4 sm:p-5 rounded-2xl shadow-2xl max-w-sm text-left">
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-400 shadow-inner">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold text-sm">Chef&apos;s Signature</span>
                      <span className="text-amber-400 text-xs font-extrabold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">
                        4.9 ★
                      </span>
                    </div>
                    <span className="text-neutral-400 text-xs">Over 50,000+ satisfied foodies</span>
                  </div>
                </div>
                <p className="text-neutral-300 text-xs leading-relaxed">
                  Every dish is cooked fresh to order with artisanal sauces, premium cuts, and farm-picked vegetables.
                </p>
              </div>

              {/* Scroll Driven Frame Counter / Live Progress Meter */}
              {!isReducedMotion && (
                <div className="bg-black/80 backdrop-blur-md border border-neutral-800 px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-neutral-900 border border-amber-500/30 flex items-center justify-center text-xs font-mono text-amber-400 font-bold">
                    {progressPercent}%
                  </div>
                  <div className="text-left">
                    <div className="text-[11px] font-bold text-neutral-200 flex items-center gap-1">
                      <span>Cinematic Frame {currentFrame + 1} of 160</span>
                      {loadedCount < TOTAL_FRAMES && (
                        <span className="text-[9px] text-amber-400/80 animate-pulse">
                          (Buffering {loadedCount})
                        </span>
                      )}
                    </div>
                    {/* Micro Progress Bar */}
                    <div className="w-36 h-1.5 bg-neutral-800 rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-red-500 transition-all duration-75"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Pinned Footer: Scroll Indicator Prompt */}
        {!isReducedMotion && (
          <div className="w-full relative z-10 pb-4 sm:pb-6 flex flex-col items-center justify-center pointer-events-none">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-neutral-800/80 text-neutral-300 text-xs font-medium backdrop-blur-md shadow-md animate-bounce">
              <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
              <span>Scroll down to play the 160-frame culinary story</span>
              <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
