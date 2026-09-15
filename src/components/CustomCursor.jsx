import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { playClickSound, playHoverSound } from '../utils/audio';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const badgeRef = useRef(null);
  const badgeTextRef = useRef(null);
  const hiddenRef = useRef(true);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const badge = badgeRef.current;
    const badgeText = badgeTextRef.current;
    if (!dot || !ring || !badge) return;

    // Mouse coordinates
    const mouse = { x: 0, y: 0 };
    // Trailing coordinates
    const ringPos = { x: 0, y: 0 };

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (hiddenRef.current) {
        hiddenRef.current = false;
        setHidden(false);
      }
    };

    const onMouseLeave = () => {
      hiddenRef.current = true;
      setHidden(true);
    };

    const onMouseEnter = () => {
      hiddenRef.current = false;
      setHidden(false);
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Dynamic spring trail for outer ring & badge using GSAP ticker
    const tick = () => {
      // Linear interpolation for smooth trailing follow
      ringPos.x += (mouse.x - ringPos.x) * 0.16;
      ringPos.y += (mouse.y - ringPos.y) * 0.16;

      gsap.set(ring, {
        x: ringPos.x,
        y: ringPos.y,
        xPercent: -50,
        yPercent: -50
      });

      // Move immediate dot instantly without lag
      gsap.set(dot, {
        x: mouse.x,
        y: mouse.y,
        xPercent: -50,
        yPercent: -50
      });

      // Move badge with trailing offset
      gsap.set(badge, {
        x: ringPos.x + 18,
        y: ringPos.y + 14,
      });
    };

    gsap.ticker.add(tick);

    // Event delegation for contextual badges and hover states
    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;

      const cursorTarget = target.closest ? target.closest('[data-cursor]') : null;
      const dataCursorVal = cursorTarget ? cursorTarget.getAttribute('data-cursor') : null;

      if (dataCursorVal && badgeText) {
        playHoverSound();
        badgeText.textContent = dataCursorVal;
        gsap.to(badge, {
          scale: 1,
          opacity: 1,
          duration: 0.25,
          ease: 'back.out(2)'
        });
        gsap.to(ring, {
          scale: 1.8,
          borderColor: 'var(--color-cyan-hex)',
          backgroundColor: 'rgba(var(--cyan-rgb), 0.1)',
          duration: 0.3
        });
        gsap.to(dot, {
          scale: 0.8,
          backgroundColor: 'var(--color-cyan-hex)',
          duration: 0.2
        });
        return;
      } else {
        gsap.to(badge, {
          scale: 0,
          opacity: 0,
          duration: 0.18,
          ease: 'power2.in'
        });
      }

      // Standard interactive elements hover
      const isHoverable = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        (target.closest && (
          target.closest('a') || 
          target.closest('button') || 
          target.closest('.bento-card') || 
          target.closest('.spotlight-card')
        )) ||
        (target.classList && target.classList.contains('cursor-pointer'));

      if (isHoverable) {
        playHoverSound();
        gsap.to(ring, {
          scale: 1.6,
          borderColor: 'var(--color-fuchsia-hex)',
          backgroundColor: 'var(--color-fuchsia-hover-bg)',
          duration: 0.3
        });
        gsap.to(dot, {
          scale: 1.4,
          backgroundColor: 'var(--color-cyan-hex)',
          duration: 0.3
        });
      } else {
        gsap.to(ring, {
          scale: 1.0,
          borderColor: 'var(--color-cyan-ring-border)',
          backgroundColor: 'transparent',
          duration: 0.3
        });
        gsap.to(dot, {
          scale: 1.0,
          backgroundColor: 'var(--color-cyan-hex)',
          duration: 0.3
        });
      }
    };

    // Click ripple / shockwave effect
    const onMouseDown = () => {
      playClickSound();
      gsap.to(dot, { scale: 0.6, duration: 0.15 });
      gsap.fromTo(ring, 
        { scale: 0.9, opacity: 1 },
        { scale: 2.2, opacity: 0.3, borderColor: 'var(--color-cyan-hex)', duration: 0.35, ease: 'power2.out', onComplete: () => {
          gsap.to(ring, { scale: 1.0, opacity: 1, duration: 0.2 });
        }}
      );
    };

    const onMouseUp = () => {
      gsap.to(dot, { scale: 1.0, duration: 0.2, ease: 'back.out(2)' });
    };

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseover', handleMouseOver);

    // Cleanups
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
      gsap.ticker.remove(tick);
    };
  }, []);

  // Don't render cursor on mobile touch devices
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) return null;

  return (
    <>
      {/* Outer Spring Ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className={`fixed top-0 left-0 w-8 h-8 rounded-full border border-cyan-400/50 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 mix-blend-difference ${
          hidden ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ willChange: 'transform', transform: 'translate3d(-100px, -100px, 0)' }}
      />

      {/* Inner Dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className={`fixed top-0 left-0 w-2 h-2 bg-cyan-400 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 mix-blend-difference ${
          hidden ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ willChange: 'transform', transform: 'translate3d(-100px, -100px, 0)' }}
      />

      {/* Floating Contextual Pill Badge */}
      <div
        ref={badgeRef}
        aria-hidden="true"
        className={`fixed top-0 left-0 pointer-events-none z-[10000] px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-cyan-400/40 shadow-[0_0_15px_rgba(var(--cyan-rgb),0.4)] flex items-center justify-center transition-opacity duration-200 select-none scale-0 origin-left ${
          hidden ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ willChange: 'transform', transform: 'translate3d(-100px, -100px, 0)' }}
      >
        <span
          ref={badgeTextRef}
          className="text-[9px] font-mono font-bold tracking-widest text-cyan-300 uppercase whitespace-nowrap"
        />
      </div>
    </>
  );
}
