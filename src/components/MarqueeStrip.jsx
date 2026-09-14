import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

/**
 * High-performance, velocity-responsive infinitely scrolling horizontal marquee text strip.
 * Features:
 * - GSAP ticker-driven 60fps transform loop
 * - Real-time scroll acceleration synced with Lenis velocity
 * - Smooth deceleration on hover (0.25x speed)
 * - Interactive individual chip tilt and neon glow
 */
export default function MarqueeStrip({ texts, speed = 'medium', color = 'cyan', reverse = false }) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Duplicate texts 4 times to ensure it overflows the screen width and loops seamlessly
  const duplicatedTexts = [...texts, ...texts, ...texts, ...texts];

  const baseSpeedVal = 
    speed === 'fast' ? 2.0 :
    speed === 'slow' ? 0.8 :
    1.25;

  const glowColorClass = 
    color === 'cyan' ? 'text-cyan-400 drop-shadow-[0_0_10px_rgba(var(--cyan-rgb),0.5)]' :
    color === 'fuchsia' ? 'text-fuchsia-500 drop-shadow-[0_0_10px_rgba(var(--fuchsia-rgb),0.5)]' :
    'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.25)]';

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let xPos = 0;
    const direction = reverse ? 1 : -1;
    let baseSpeed = baseSpeedVal * direction;
    let currentSpeed = baseSpeed;
    let velocityBoost = 0;

    // Connect to Lenis scroll velocity for kinetic responsiveness
    const handleScroll = (e) => {
      const vel = Math.abs(e.velocity || 0);
      velocityBoost = Math.min(vel * 0.45, 8);
    };

    if (window.lenis) {
      window.lenis.on('scroll', handleScroll);
    }

    const ticker = () => {
      // Determine target speed depending on hover state and scroll boost
      const targetBase = isHovered ? baseSpeed * 0.3 : baseSpeed;
      const targetSpeed = targetBase + (direction * velocityBoost);

      // Smoothly interpolate current speed towards target speed
      currentSpeed += (targetSpeed - currentSpeed) * 0.08;
      velocityBoost *= 0.92; // Decay scroll boost with natural friction

      xPos += currentSpeed;

      // Wrap-around boundary calculation
      const singleSetWidth = track.scrollWidth / 2;
      if (direction < 0 && Math.abs(xPos) >= singleSetWidth) {
        xPos = 0;
      } else if (direction > 0 && xPos >= 0) {
        xPos = -singleSetWidth;
      }

      track.style.transform = `translate3d(${xPos}px, 0, 0)`;
    };

    gsap.ticker.add(ticker);

    return () => {
      gsap.ticker.remove(ticker);
      if (window.lenis) {
        window.lenis.off('scroll', handleScroll);
      }
    };
  }, [reverse, baseSpeedVal, isHovered]);

  return (
    <div 
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full overflow-hidden bg-black/40 border-y border-white/5 py-4 select-none z-10"
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)'
      }}
    >
      <div className="flex items-center w-full overflow-hidden">
        <div 
          ref={trackRef}
          className="flex gap-8 items-center will-change-transform"
        >
          {duplicatedTexts.map((text, idx) => (
            <div 
              key={idx} 
              data-cursor="STACK"
              className="flex items-center gap-8 shrink-0 group/pill cursor-default transition-transform duration-300 hover:scale-105"
            >
              <span className={`font-pixel text-xs md:text-sm uppercase tracking-widest transition-all duration-300 group-hover/pill:text-white ${glowColorClass}`}>
                {text}
              </span>
              <span className="text-cyan-300 font-mono text-xs animate-twinkle group-hover/pill:scale-125 transition-transform">✦</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
