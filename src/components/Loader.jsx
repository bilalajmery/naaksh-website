'use client';
import React from 'react';

const Loader = ({ fullScreen = true }) => {
  return (
    <div
      className={
        fullScreen
          ? "fixed inset-0 z-[99999] flex items-center justify-center bg-black transition-opacity duration-300"
          : "min-h-[70vh] w-full flex items-center justify-center bg-black"
      }
      role="status"
      aria-label="Loading NAAKSH"
    >
      <div className="relative flex items-center justify-center">
        {/* Subtle Ambient Gold Glow */}
        <div className="absolute w-32 h-32 rounded-full bg-yellow-500/10 blur-xl pointer-events-none" />

        {/* Spinning Gold Ring */}
        <div className="w-28 h-28 sm:w-32 sm:h-32 border-[3px] border-neutral-800/90 border-t-yellow-400 border-r-yellow-500/70 rounded-full animate-spin" />

        {/* Centered Brand Logo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <img
            src="/logo/sm.png"
            alt="NAAKSH"
            className="w-16 sm:w-20 h-auto object-contain animate-pulse relative z-10 drop-shadow-[0_2px_12px_rgba(245,197,24,0.25)]"
          />
        </div>
      </div>
    </div>
  );
};

export default Loader;
