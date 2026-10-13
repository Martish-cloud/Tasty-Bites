import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowRight, Play, Star, ChevronDown, Sparkles } from 'lucide-react';
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

  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // In-memory cache of HTMLImageElements
  const imagesRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const loadingMapRef = useRef<Map<number, Promise<HTMLImageElement>>>(new Map());
  const rafIdRef = useRef<number | null>(null);
  const lastDrawnFrameRef = useRef<number>(-1);
  const targetFrameRef = useRef<number>(0);
  const currentFrameRef = useRef<number>(0);
  const canvasSizeRef = useRef({ width: 0, height: 0, dpr: 1 });
  const containerMetricsRef = useRef({ top: 0, height: 0, scrollable: 0 });

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

  // Cache canvas dimensions to eliminate synchronous layout thrashing during scroll
  const updateCanvasDimensions = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    canvasSizeRef.current = { width: displayWidth, height: displayHeight, dpr };

    if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
    }
  }, []);

  // Draw image on canvas preserving aspect ratio (object-fit: cover)
  const drawFrame = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const { width: displayWidth, height: displayHeight, dpr } = canvasSizeRef.current;
    if (displayWidth === 0 || displayHeight === 0) return;

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

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    ctx.restore();
  }, []);

  // Preload frame helper with asynchronous off-thread decoding
  const preloadImage = useCallback(
    (index: number): Promise<HTMLImageElement> => {
      if (imagesRef.current.has(index)) {
        return Promise.resolve(imagesRef.current.get(index)!);
      }
      if (loadingMapRef.current.has(index)) {
        return loadingMapRef.current.get(index)!;
      }

      const promise = new Promise<HTMLImageElement>((resolve) => {
        const img = new Image();
        img.src = getFrameSrc(index);
        img.onload = () => {
          if ('decode' in img) {
            img
              .decode()
              .catch(() => {})
              .finally(() => {
                imagesRef.current.set(index, img);
                loadingMapRef.current.delete(index);
                resolve(img);
              });
          } else {
            imagesRef.current.set(index, img);
            loadingMapRef.current.delete(index);
            resolve(img);
          }
        };
        img.onerror = () => {
          loadingMapRef.current.delete(index);
          const fallback = imagesRef.current.get(0) || img;
          resolve(fallback);
        };
      });

      loadingMapRef.current.set(index, promise);
      return promise;
    },
    []
  );

  // Priority preloading around current target frame
  const priorityPreloadWindow = useCallback(
    (centerIdx: number) => {
      const start = Math.max(0, centerIdx - 2);
      const end = Math.min(TOTAL_FRAMES - 1, centerIdx + 10);
      for (let i = start; i <= end; i++) {
        preloadImage(i);
      }
    },
    [preloadImage]
  );

  // Progressive preloading strategy
  useEffect(() => {
    let isCancelled = false;

    updateCanvasDimensions();

    // 1. Immediately load frame 0 and display it
    preloadImage(0).then((firstImg) => {
      if (!isCancelled) {
        drawFrame(firstImg);
        lastDrawnFrameRef.current = 0;
      }
    });

    // 2. Preload initial batch (1-30) right away
    for (let i = 1; i <= Math.min(30, TOTAL_FRAMES - 1); i++) {
      preloadImage(i);
    }

    // 3. Staged background preloader for remaining frames in idle chunks
    let currentChunk = 31;
    const chunkSize = 15;

    const loadNextChunk = () => {
      if (isCancelled || currentChunk >= TOTAL_FRAMES) return;
      const end = Math.min(currentChunk + chunkSize, TOTAL_FRAMES);
      for (let i = currentChunk; i < end; i++) {
        preloadImage(i);
      }
      currentChunk = end;
      if (currentChunk < TOTAL_FRAMES) {
        setTimeout(loadNextChunk, 80);
      }
    };

    const timer = setTimeout(loadNextChunk, 150);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [preloadImage, drawFrame, updateCanvasDimensions]);

  // Section metrics calculation on resize
  const updateMetrics = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const scrollTop = window.scrollY;
    const containerTop = rect.top + scrollTop;
    const containerHeight = container.offsetHeight;
    const scrollable = Math.max(1, containerHeight - window.innerHeight);

    containerMetricsRef.current = {
      top: containerTop,
      height: containerHeight,
      scrollable,
    };
    updateCanvasDimensions();
  }, [updateCanvasDimensions]);

  // Scroll mapping & smooth interpolated render loop
  useEffect(() => {
    if (isReducedMotion) return;

    updateMetrics();

    let isLoopRunning = true;

    // Fluid RAF render loop with cinematic damping
    const renderLoop = () => {
      if (!isLoopRunning) return;

      const target = targetFrameRef.current;
      const current = currentFrameRef.current;
      const delta = target - current;

      if (Math.abs(delta) > 0.04) {
        currentFrameRef.current += delta * 0.45;
        const frameIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(currentFrameRef.current)));

        if (frameIndex !== lastDrawnFrameRef.current) {
          let imgToDraw = imagesRef.current.get(frameIndex);
          if (!imgToDraw) {
            for (let offset = 1; offset < 20; offset++) {
              if (imagesRef.current.has(frameIndex - offset)) {
                imgToDraw = imagesRef.current.get(frameIndex - offset);
                break;
              }
              if (imagesRef.current.has(frameIndex + offset)) {
                imgToDraw = imagesRef.current.get(frameIndex + offset);
                break;
              }
            }
          }

          if (imgToDraw) {
            drawFrame(imgToDraw);
            lastDrawnFrameRef.current = frameIndex;
          }
        }
      }

      rafIdRef.current = requestAnimationFrame(renderLoop);
    };

    rafIdRef.current = requestAnimationFrame(renderLoop);

    const handleScroll = () => {
      const { top, scrollable } = containerMetricsRef.current;
      if (scrollable <= 0) return;

      const scrollY = window.scrollY;
      const progress = Math.max(0, Math.min(1, (scrollY - top) / scrollable));
      const targetFrame = Math.min(TOTAL_FRAMES - 1, Math.floor(progress * TOTAL_FRAMES));

      if (targetFrame !== targetFrameRef.current) {
        targetFrameRef.current = targetFrame;
        priorityPreloadWindow(targetFrame);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateMetrics, { passive: true });

    return () => {
      isLoopRunning = false;
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateMetrics);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [drawFrame, isReducedMotion, priorityPreloadWindow, updateMetrics]);

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

  return (
    <section
      id="cinematic-hero"
      data-theme="dark"
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
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  Artisanal Food Experience
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
                    <span className="text-neutral-400 text-xs">Over 7,000 satisfied foodies</span>
                  </div>
                </div>
                <p className="text-neutral-300 text-xs leading-relaxed">
                  Every dish is cooked fresh to order with artisanal sauces, premium cuts, and farm-picked vegetables.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Pinned Footer: Scroll Indicator Prompt */}
        {!isReducedMotion && (
          <div className="w-full relative z-10 pb-4 sm:pb-6 flex flex-col items-center justify-center pointer-events-none">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-neutral-800/80 text-neutral-300 text-xs font-medium backdrop-blur-md shadow-md animate-bounce">
              <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
              <span>Scroll to explore our culinary story</span>
              <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
