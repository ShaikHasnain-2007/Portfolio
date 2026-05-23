import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollProgress() {
  const progressBarRef = useRef(null);

  useEffect(() => {
    const el = progressBarRef.current;
    if (!el) return;

    const tween = gsap.to(el, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.1,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <div
      ref={progressBarRef}
      className="fixed top-0 left-0 w-full h-[3px] bg-gradient-to-r from-cyan-400 to-fuchsia-500 origin-left z-[999] pointer-events-none scale-x-0"
      style={{ willChange: 'transform' }}
    />
  );
}
