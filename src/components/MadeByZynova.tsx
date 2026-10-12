import React from 'react';

/**
 * Minimal, fixed "Made by Zynova" watermark.
 * Displayed across all views and routes in pure black (#000000).
 * Completely static with no hover, animations, transitions, or interaction.
 */
export const MadeByZynova: React.FC = () => {
  return (
    <div
      className="fixed z-40 text-[11px] sm:text-[12px] font-sans pointer-events-none select-none tracking-normal leading-none"
      style={{
        color: '#000000',
        bottom: 'max(14px, env(safe-area-inset-bottom, 14px))',
        right: 'max(16px, env(safe-area-inset-right, 16px))',
      }}
      aria-hidden="true"
    >
      Made by Zynova
    </div>
  );
};
