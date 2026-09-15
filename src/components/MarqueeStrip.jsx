

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
    <div 
      className="relative w-full overflow-hidden bg-black/40 border-y border-white/5 py-4 select-none z-10"
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)'
      }}
    >
      <div className="flex items-center w-full overflow-hidden">
        <div 
          className={`flex gap-8 items-center animate-marquee ${reverse ? '[animation-direction:reverse]' : ''}`}
          style={speedStyle}
        >
          {duplicatedTexts.map((text, idx) => (
            <div key={idx} className="flex items-center gap-8 shrink-0">
              <span className={`font-pixel text-xs md:text-sm uppercase tracking-widest ${glowColorClass}`}>
                {text}
              </span>
              <span className="text-cyan-300 font-mono text-xs animate-twinkle">✦</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
