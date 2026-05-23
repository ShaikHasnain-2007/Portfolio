import React from 'react';

/**
 * Animated SVG Film Grain Overlay for high-end aesthetic texture.
 */
export default function FilmGrain() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[90] w-full h-full overflow-hidden opacity-[0.065] select-none">
      <svg 
        className="absolute w-[200%] h-[200%] -top-[50%] -left-[50%] animate-noise-shift"
        aria-hidden="true"
      >
        <filter id="noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
    </div>
  );
}
