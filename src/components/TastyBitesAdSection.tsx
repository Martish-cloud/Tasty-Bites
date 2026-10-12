import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';

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

  // Toggle audio with reduced volume
  const toggleAudio = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      // Unmute with safe reduced volume (0.3)
      videoRef.current.muted = false;
      videoRef.current.volume = 0.3;
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
      className="w-full bg-[#f8f9fa] py-10 sm:py-14 border-t border-neutral-200"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Subtle section label */}
        <div className="flex items-center justify-between mb-3 text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-200/70 text-neutral-600 font-bold text-[10px] uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>Featured Brand Cinema</span>
          </div>

          <span className="text-[10.5px] text-neutral-400 font-medium">
            Tasty Bites Commercial Showcase
          </span>
        </div>

        {/* Video Container Box */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#0c0b0a] shadow-xl border border-neutral-800/60 aspect-video group">
          <video
            ref={videoRef}
            src="/Videos/Tasty Bites.mp4"
            autoPlay
            muted
            playsInline
            loop
            onTimeUpdate={handleTimeUpdate}
            onError={() => setHasError(true)}
            className="w-full h-full object-cover sm:object-contain bg-black"
            aria-label="Tasty Bites Brand Cinema Advertisement"
          />

          {/* Top Control Bar Over Video */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-auto z-20">
            {/* Audio Toggle (Reduced Volume) */}
            <button
              type="button"
              onClick={toggleAudio}
              className="px-2.5 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 text-white/90 text-xs backdrop-blur-md flex items-center gap-1.5 border border-white/10 transition cursor-pointer"
              aria-label={isMuted ? 'Unmute video (reduced volume)' : 'Mute video'}
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-neutral-300" />
                  <span className="text-[10.5px] font-medium hidden sm:inline">Sound Off</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[10.5px] font-medium hidden sm:inline">Sound On (30%)</span>
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

          {/* Bottom subtle brand watermark badge */}
          <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-black/50 text-[10px] text-white/70 backdrop-blur-xs pointer-events-none">
            Tasty Bites © Official Ad
          </div>
        </div>
      </div>
    </section>
  );
};
