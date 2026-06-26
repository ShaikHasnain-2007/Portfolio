import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const hiddenRef = useRef(true);
  const [hidden, setHidden] = useState(true);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

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

    // Dynamic spring trail for the outer ring using GSAP ticker
    const tick = () => {
      // Linear interpolation for smooth trailing follow
      ringPos.x += (mouse.x - ringPos.x) * 0.15;
      ringPos.y += (mouse.y - ringPos.y) * 0.15;

      gsap.set(ring, {
        x: ringPos.x,
        y: ringPos.y
      });

      // Move immediate dot instantly without creating new tweens
      gsap.set(dot, {
        x: mouse.x,
        y: mouse.y
      });
    };

    gsap.ticker.add(tick);

    // Event delegation for hover tags
    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;

      // Check if hovering a link, button, input, textarea, or a spotlight-card
      const isHoverable = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.closest('a') || 
        target.closest('button') || 
        target.closest('.bento-card') || 
        target.closest('.spotlight-card') ||
        target.classList.contains('cursor-pointer');

      if (isHoverable) {
        setHovered(true);
        gsap.to(ring, {
          scale: 1.6,
          borderColor: 'var(--color-fuchsia-hex)', // Fuchsia on hover
          backgroundColor: 'var(--color-fuchsia-hover-bg)',
          duration: 0.3
        });
        gsap.to(dot, {
          scale: 1.5,
          backgroundColor: 'var(--color-cyan-hex)', // Cyan on hover
          duration: 0.3
        });
      } else {
        setHovered(false);
        gsap.to(ring, {
          scale: 1.0,
          borderColor: 'var(--color-cyan-ring-border)', // Cyan border
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

    document.addEventListener('mouseover', handleMouseOver);

    // Cleanups
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
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
    </>
  );
}
