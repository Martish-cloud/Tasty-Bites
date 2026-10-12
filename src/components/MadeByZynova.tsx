import React, { useEffect, useRef, useState } from 'react';

/**
 * Minimal, fixed "Made by Zynova" watermark.
 * Dynamically switches text color based on the underlying section background:
 * - Pure White (#FFFFFF) over dark backgrounds (e.g. Hero, Kitchen in Motion, Brand Story, Footer)
 * - Pure Black (#000000) over light backgrounds
 * Non-interactive, stationary in bottom-right corner across all routes.
 */
export const MadeByZynova: React.FC = () => {
  const [isDark, setIsDark] = useState(true);
  const watermarkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const evaluateBackground = () => {
      if (!watermarkRef.current) return;

      const rect = watermarkRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      // Ensure coordinates are within viewport
      if (x < 0 || y < 0 || x > window.innerWidth || y > window.innerHeight) {
        return;
      }

      const elements = document.elementsFromPoint(x, y);

      for (const el of elements) {
        // Skip the watermark itself
        if (el === watermarkRef.current || watermarkRef.current.contains(el)) {
          continue;
        }

        // Check if element or any ancestor is explicitly marked dark or is a known dark section
        const darkAncestor = el.closest(
          '[data-theme="dark"], footer, [data-bg="dark"], #brand-story, #kitchen-videos, #cinematic-hero, .dark-section'
        );
        if (darkAncestor) {
          setIsDark(true);
          return;
        }

        // Check computed background color of the element
        const style = window.getComputedStyle(el);
        const bg = style.backgroundColor;

        if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
          const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
          if (match) {
            const r = parseInt(match[1], 10);
            const g = parseInt(match[2], 10);
            const b = parseInt(match[3], 10);
            const a = match[4] !== undefined ? parseFloat(match[4]) : 1;

            if (a > 0.4) {
              const luminance = (r * 299 + g * 587 + b * 114) / 1000;
              setIsDark(luminance < 128);
              return;
            }
          }
        }
      }

      // Default fallback: if nothing dark detected, assume light background
      setIsDark(false);
    };

    evaluateBackground();

    const handleScrollOrResize = () => {
      evaluateBackground();
    };

    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });

    // Continuous check during initial load and smooth scrolling
    const intervalId = setInterval(evaluateBackground, 250);

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div
      ref={watermarkRef}
      className="fixed z-40 text-[11px] sm:text-[12px] font-sans pointer-events-none select-none tracking-normal leading-none"
      style={{
        color: isDark ? '#FFFFFF' : '#000000',
        bottom: 'max(14px, env(safe-area-inset-bottom, 14px))',
        right: 'max(16px, env(safe-area-inset-right, 16px))',
      }}
      aria-hidden="true"
    >
      Made by Zynova
    </div>
  );
};
