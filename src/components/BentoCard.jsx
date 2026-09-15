import { useRef } from 'react';

export default function BentoCard({ children, className = '', style = {}, speed = 0, ...props }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    if (isTouch) return;

    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`bento-card spotlight-card border-beam-container specular-border border border-white/10 rounded-3xl bg-white/[0.03] backdrop-blur-xl shadow-lg overflow-hidden relative group transition-all duration-300 ${className}`}
      style={{
        ...style,
        transformStyle: 'preserve-3d',
      }}
      data-speed={speed}
      {...props}
    >
      {/* Iridescent Border Beam on Hover */}
      <div className="border-beam border-beam-hover" />

      {/* Dynamic Cursor Spotlight Glow */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-0"
        style={{
          background: `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(var(--cyan-rgb), 0.15), transparent 65%)`
        }}
      />
      {children}
    </div>
  );
}
