import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Volume2, VolumeX, Sparkles, ChefHat } from 'lucide-react';

const AD_SESSION_KEY = 'tastybites_ad_dismissed_session';

export const TastyBitesAdSection: React.FC = () => {
  // Session dismissal memory
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(AD_SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [playbackSeconds, setPlaybackSeconds] = useState<number>(0);
  const [canSkip, setCanSkip] = useState<boolean>(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const warningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Synchronize playback progress to enable skip after 5 seconds of actual playback
  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    setPlaybackSeconds(current);
    if (current >= 5) {
      setCanSkip(true);
    }
  }, []);

  // Early-skip attempt handler
  const handleEarlySkipClick = () => {
    if (canSkip) {
      dismissAd();
      return;
    }

    // Display temporary English warning message
    setWarningMessage('This is an advertisement. You can skip it after 5 seconds.');
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
    }
    warningTimerRef.current = setTimeout(() => {
      setWarningMessage(null);
    }, 3200);
  };

  // Safe ad dismissal
  const dismissAd = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.removeAttribute('src');
      videoRef.current.load();
    }
    try {
      sessionStorage.setItem(AD_SESSION_KEY, 'true');
    } catch {
      // Ignore storage errors
    }
    setIsDismissed(true);
  };

  // Toggle audio with internal 26% volume setting
  const toggleAudio = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.volume = 0.26;
      videoRef.current.muted = false;
      setIsMuted(false);
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (warningTimerRef.current) {
        clearTimeout(warningTimerRef.current);
      }
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, []);

  if (isDismissed || hasError) {
    return null;
  }

  const secondsRemaining = Math.max(0, 5 - Math.floor(playbackSeconds));

  return (
    <section
      id="tasty-bites-advertisement"
      aria-label="Tasty Bites Advertisement"
      className="w-full bg-[#f8f9fa] py-6 sm:py-8 border-t border-neutral-200"
    >
      <div className="flex flex-col items-center mx-auto px-4">
        {/* Subtle section label matching video width to eliminate side gaps */}
        <div className="w-full max-w-[310px] sm:max-w-[330px] flex items-center justify-between mb-2 text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-200/70 text-neutral-600 font-bold text-[10px] uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>Featured Brand Cinema</span>
          </div>

          <span className="text-[10px] sm:text-[10.5px] text-neutral-400 font-medium">
            Tasty Bites Commercial Showcase
          </span>
        </div>

        {/* Compact Video Container Box - Sized to natural 9:16 aspect ratio fitting 100% desktop zoom viewport */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-black shadow-2xl aspect-[9/16] w-full max-w-[310px] sm:max-w-[330px] max-h-[min(520px,68vh)] group mx-auto">
          {/* Moving 2px green light around the video frame perimeter */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {/* Subtle static border track */}
            <rect
              x="1"
              y="1"
              width="calc(100% - 2px)"
              height="calc(100% - 2px)"
              rx="22"
              ry="22"
              fill="none"
              stroke="rgba(34, 197, 94, 0.25)"
              strokeWidth="1.5"
            />
            {/* Continuous 2px emerald green light moving along perimeter */}
            <rect
              x="1"
              y="1"
              width="calc(100% - 2px)"
              height="calc(100% - 2px)"
              rx="22"
              ry="22"
              pathLength="100"
              fill="none"
              stroke="#22c55e"
              strokeWidth="2"
              strokeLinecap="round"
              className="ad-moving-light"
            />
          </svg>

          <video
            ref={videoRef}
            src="/Videos/Tasty Bites.mp4"
            autoPlay
            muted={isMuted}
            playsInline
            loop
            onTimeUpdate={handleTimeUpdate}
            onError={() => setHasError(true)}
            className="w-full h-full object-contain bg-black"
            aria-label="Tasty Bites Brand Cinema Advertisement"
          />

          {/* Top Control Bar Over Video */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-auto z-20">
            {/* Audio Toggle (Internal 26% Volume, NO percentage in label) */}
            <button
              type="button"
              onClick={toggleAudio}
              className="px-2.5 py-1.5 rounded-xl bg-black/70 hover:bg-black/90 text-white/90 text-xs backdrop-blur-md flex items-center gap-1.5 border border-white/10 transition cursor-pointer"
              aria-label={isMuted ? 'Unmute advertisement audio' : 'Mute advertisement audio'}
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-neutral-300" />
                  <span className="text-[10.5px] font-medium hidden sm:inline">Sound Off</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[10.5px] font-medium hidden sm:inline">Sound On</span>
                </>
              )}
            </button>

            {/* Skip Control Button */}
            <div className="flex flex-col items-end">
              <button
                type="button"
                onClick={handleEarlySkipClick}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md backdrop-blur-md flex items-center gap-1.5 cursor-pointer ${
                  canSkip
                    ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950 hover:scale-105 active:scale-95'
                    : 'bg-black/70 hover:bg-black/85 text-neutral-300 border border-white/15'
                }`}
                aria-label={canSkip ? 'Skip advertisement' : `Skip available in ${secondsRemaining} seconds`}
              >
                {canSkip ? (
                  <>
                    <span>Skip Ad</span>
                    <span className="font-mono text-sm leading-none">✕</span>
                  </>
                ) : (
                  <span>Skip in {secondsRemaining}s</span>
                )}
              </button>

              {/* Early-skip temporary English warning pill */}
              {warningMessage && (
                <div
                  role="status"
                  aria-live="polite"
                  className="mt-2 px-3 py-1.5 rounded-lg bg-black/90 text-amber-300 text-[11px] font-medium shadow-lg border border-amber-500/40 animate-in fade-in slide-in-from-top-1 duration-150 max-w-xs text-right"
                >
                  {warningMessage}
                </div>
              )}
            </div>
          </div>

          {/* Tasty Bites Official Branded Badge concealing the lower-right Google Flow/Gemini watermark */}
          <div
            className="absolute z-15 pointer-events-none select-none flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-950/90 backdrop-blur-md border border-amber-500/50 shadow-lg shadow-black/80"
            style={{ right: '12px', bottom: '8.8%' }}
            title="TastyBites Brand Cinema"
          >
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white border border-amber-400/70 shadow-sm shrink-0">
              <ChefHat className="w-2.5 h-2.5" />
            </div>
            <span className="font-extrabold text-[10px] tracking-tight text-white whitespace-nowrap">
              Tasty<span className="text-amber-400">Bites</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
