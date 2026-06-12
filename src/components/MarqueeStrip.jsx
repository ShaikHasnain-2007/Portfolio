import React from 'react';

/**
 * Reusable infinitely scrolling horizontal marquee text strip.
 */
export default function MarqueeStrip({ texts, speed = 'medium', color = 'cyan', reverse = false }) {
  // Multiply texts to ensure it overflows the screen width and loops seamlessly
  const duplicatedTexts = [...texts, ...texts, ...texts, ...texts];

  const speedStyle = 
    speed === 'fast' ? { animationDuration: '15s' } :
    speed === 'slow' ? { animationDuration: '40s' } :
    { animationDuration: '25s' };

  const glowColorClass = 
    color === 'cyan' ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(var(--cyan-rgb),0.4)]' :
    color === 'fuchsia' ? 'text-fuchsia-500 drop-shadow-[0_0_8px_rgba(var(--fuchsia-rgb),0.4)]' :
    'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]';

  return (
    <div className="relative w-full overflow-hidden bg-black/40 border-y border-white/5 py-4 select-none z-10">
      {/* Edge gradient overlays for smooth fade-in/fade-out */}
      <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

      <div className="flex items-center w-full overflow-hidden">
        <div 
          className={`flex gap-8 items-center animate-marquee w-max ${reverse ? '[animation-direction:reverse]' : ''}`}
          style={speedStyle}
        >
          {duplicatedTexts.map((text, idx) => (
            <div key={idx} className="flex items-center gap-8 shrink-0">
              <span className={`font-syne font-black text-xs md:text-sm uppercase tracking-widest ${glowColorClass}`}>
                {text}
              </span>
              <span className="text-white/20 font-syne text-xs">✦</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
