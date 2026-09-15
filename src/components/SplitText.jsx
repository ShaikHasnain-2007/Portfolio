import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * Reusable SplitText component using React DOM mapping & GSAP ScrollTrigger.
 * Split text into words or characters and reveals them with a smooth stagger.
 */
export default function SplitText({ text, className = '', itemClassName = '', type = 'chars', stagger = 0.015, delay = 0 }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const items = el.querySelectorAll('.split-item');
    if (items.length === 0) return;

    const animation = gsap.fromTo(items,
      { yPercent: 100, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.8,
        stagger: stagger,
        delay: delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        }
      }
    );

    return () => {
      if (animation.scrollTrigger) animation.scrollTrigger.kill();
      animation.kill();
    };
  }, [text, stagger, delay]);

  if (!text) return null;

  if (type === 'words') {
    return (
      <span ref={containerRef} className={`inline-block ${className}`}>
        {text.split(' ').map((word, wIdx) => (
          <span key={wIdx} className="inline-block overflow-hidden mr-[0.25em]">
            <span className={`split-item inline-block origin-bottom-left select-text ${itemClassName}`}>
              {word}
            </span>
          </span>
        ))}
      </span>
    );
  }

  // Default: characters
  return (
    <span ref={containerRef} className={`inline-block ${className}`}>
      {text.split(' ').map((word, wIdx) => (
        <span key={wIdx} className="inline-block overflow-hidden mr-[0.22em] whitespace-nowrap">
          {word.split('').map((char, cIdx) => (
            <span key={cIdx} className={`split-item inline-block origin-bottom-left select-text ${itemClassName}`}>
              {char}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}
