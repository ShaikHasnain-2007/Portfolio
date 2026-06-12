import React, { useEffect, useRef, useState, useMemo } from 'react';
import { gsap } from 'gsap';

// Scramble text hook - characters resolve left-to-right
function useScrambleText(target, active, speed = 30) {
  const [text, setText] = useState('');
  useEffect(() => {
    if (!active) return;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*';
    let frame = 0;
    const total = 25;
    let cancelled = false;
    const run = () => {
      if (cancelled) return;
      frame++;
      const p = frame / total;
      if (p >= 1) { setText(target); return; }
      let r = '';
      for (let i = 0; i < target.length; i++) {
        if (target[i] === ' ') { r += ' '; continue; }
        r += (p > i / target.length) ? target[i] : chars[Math.floor(Math.random() * chars.length)];
      }
      setText(r);
      setTimeout(() => requestAnimationFrame(run), 1000 / speed);
    };
    const t = setTimeout(() => requestAnimationFrame(run), 300);
    return () => { cancelled = true; clearTimeout(t); };
  }, [target, active, speed]);
  return text;
}

export default function NetworkPreloader({ progress, isReady, onDismissed }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const ringsRef = useRef(null);
  const textRef = useRef(null);
  const progressRef = useRef(null);
  const heroGlyphRef = useRef(null);

  const [displayProgress, setDisplayProgress] = useState(0);
  const [isDismissing, setIsDismissing] = useState(false);
  const [phase, setPhase] = useState('loading'); // loading | ready | dismissing
  const startTimestamp = useRef(Date.now());
  const progressLerped = useRef(0);
  const animFrameRef = useRef(null);

  const scrambledName = useScrambleText('SHAIK HASNAIN', !isDismissing);
  const scrambledTag = useScrambleText('CREATIVE PORTFOLIO', !isDismissing);

  // Smooth progress lerp
  useEffect(() => {
    let active = true;
    const tick = () => {
      if (!active) return;
      const target = progress || 0;
      const diff = target - progressLerped.current;
      progressLerped.current += diff > 0.1 ? diff * 0.08 : diff;
      setDisplayProgress(Math.floor(progressLerped.current));
      if (progressLerped.current < 100 || !isReady) {
        requestAnimationFrame(tick);
      }
    };
    requestAnimationFrame(tick);
    return () => { active = false; };
  }, [progress, isReady]);

  // Particle canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const isMobile = w < 768;
    const count = isMobile ? 30 : 60;
    const maxDist = 120;

    const rootStyle = getComputedStyle(document.documentElement);
    const cyanRGB = rootStyle.getPropertyValue('--cyan-rgb').trim() || '34, 211, 238';
    const cyanHex = rootStyle.getPropertyValue('--color-cyan-hex').trim() || '#22d3ee';
    const fuchsiaHex = rootStyle.getPropertyValue('--color-fuchsia-hex').trim() || '#d946ef';

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      r: Math.random() * 1.5 + 0.5,
      color: Math.random() > 0.5 ? cyanHex : fuchsiaHex,
      exploded: false,
    }));

    const handleResize = () => {
      if (!canvas) return;
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    let globalAlpha = 1;

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      if (isDismissing) {
        globalAlpha -= 0.025;
        if (globalAlpha < 0) globalAlpha = 0;
      }
      ctx.globalAlpha = globalAlpha;

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.15 * globalAlpha;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${cyanRGB}, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Update & draw particles
      particles.forEach((p) => {
        if (isDismissing && !p.exploded) {
          const dx = p.x - w / 2;
          const dy = p.y - h / 2;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          p.vx = (dx / dist) * 10 + (Math.random() - 0.5) * 3;
          p.vy = (dy / dist) * 10 + (Math.random() - 0.5) * 3;
          p.exploded = true;
        }
        p.x += p.vx;
        p.y += p.vy;
        if (!isDismissing) {
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      if (globalAlpha > 0) {
        animFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [isDismissing]);

  // Ring rotation GSAP animation
  useEffect(() => {
    const el = ringsRef.current;
    if (!el) return;

    const rings = el.querySelectorAll('.preloader-ring');
    const orbs = el.querySelectorAll('.orbit-dot');

    const ctx = gsap.context(() => {
      // Each ring rotates at different speed + direction
      rings.forEach((ring, i) => {
        const direction = i % 2 === 0 ? 1 : -1;
        const duration = 4 + i * 1.5;
        gsap.to(ring, {
          rotation: 360 * direction,
          duration,
          repeat: -1,
          ease: 'none',
          transformOrigin: 'center center',
        });
      });

      // Orbiting dots pulsate
      orbs.forEach((orb, i) => {
        gsap.to(orb, {
          scale: 1.8,
          opacity: 0.4,
          duration: 0.8 + i * 0.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.15,
        });
      });

      // Hexagon slow rotation
      const hex = el.querySelector('.hex-shape');
      if (hex) {
        gsap.to(hex, {
          rotation: 360,
          duration: 20,
          repeat: -1,
          ease: 'none',
          transformOrigin: 'center center',
        });
      }
    }, el);

    return () => ctx.revert();
  }, []);

  // Hero glyph pulse
  useEffect(() => {
    const el = heroGlyphRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.to(el, {
        scale: 1.05,
        opacity: 0.8,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, el);
    return () => ctx.revert();
  }, []);

  // Dismissal coordination
  useEffect(() => {
    const MIN_DURATION = 2200;
    const check = () => {
      const elapsed = Date.now() - startTimestamp.current;
      const done = isReady && progress >= 100;

      if (done && elapsed >= MIN_DURATION) {
        setIsDismissing(true);
        setPhase('dismissing');

        const ctx = gsap.context(() => {
          // Rings scale up and fade
          gsap.to(ringsRef.current, {
            scale: 1.5,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.inOut',
          });

          gsap.to(textRef.current, {
            scale: 1.2,
            opacity: 0,
            duration: 0.7,
            ease: 'power3.inOut',
          });

          gsap.to(progressRef.current, {
            opacity: 0,
            y: 20,
            duration: 0.5,
            ease: 'power2.inOut',
          });

          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 1.1,
            ease: 'power4.inOut',
            onComplete: () => {
              if (onDismissed) onDismissed();
            },
          });
        }, containerRef);

        return () => ctx.revert();
      } else {
        const remaining = Math.max(50, MIN_DURATION - elapsed);
        const timer = setTimeout(check, remaining);
        return () => clearTimeout(timer);
      }
    };

    const cleanup = check();
    return () => { if (typeof cleanup === 'function') cleanup(); };
  }, [isReady, progress, onDismissed]);

  // SVG ring data
  const ringData = useMemo(() => [
    { r: 80, stroke: 'var(--color-cyan-hex)', isCyan: true, width: 1.5, dash: '8 12', opacity: 0.6 },
    { r: 110, stroke: 'var(--color-fuchsia-hex)', isCyan: false, width: 1, dash: '4 16', opacity: 0.4 },
    { r: 140, stroke: 'var(--color-cyan-hex)', isCyan: true, width: 0.8, dash: '2 20', opacity: 0.3 },
    { r: 165, stroke: 'var(--color-fuchsia-hex)', isCyan: false, width: 0.5, dash: '6 24', opacity: 0.2 },
  ], []);

  // Orbit dot positions (placed on each ring)
  const orbitDots = useMemo(() => [
    { r: 80, angle: 0, color: 'var(--color-cyan-hex)', isCyan: true, size: 3 },
    { r: 80, angle: 180, color: 'var(--color-cyan-hex)', isCyan: true, size: 2 },
    { r: 110, angle: 90, color: 'var(--color-fuchsia-hex)', isCyan: false, size: 3.5 },
    { r: 110, angle: 270, color: 'var(--color-fuchsia-hex)', isCyan: false, size: 2 },
    { r: 140, angle: 45, color: 'var(--color-cyan-hex)', isCyan: true, size: 2.5 },
    { r: 140, angle: 225, color: 'var(--color-cyan-hex)', isCyan: true, size: 2 },
    { r: 165, angle: 135, color: 'var(--color-fuchsia-hex)', isCyan: false, size: 2 },
    { r: 165, angle: 315, color: 'var(--color-fuchsia-hex)', isCyan: false, size: 1.5 },
  ], []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-[#020205] flex items-center justify-center overflow-hidden"
      style={{ touchAction: 'none' }}
    >
      {/* Particle canvas background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block pointer-events-none"
      />

      {/* Radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_15%,#020205_85%)] pointer-events-none" />

      {/* Central Ring Assembly */}
      <div className="relative z-10 flex flex-col items-center justify-center select-none">

        {/* SVG Rings + Orbiting Dots */}
        <div ref={ringsRef} className="relative w-[360px] h-[360px] md:w-[420px] md:h-[420px] flex items-center justify-center">

          {/* Background hex shape */}
          <svg
            className="hex-shape absolute inset-0 w-full h-full"
            viewBox="0 0 420 420"
            fill="none"
          >
            <polygon
              points="210,30 370,120 370,300 210,390 50,300 50,120"
              stroke="rgba(34,211,238,0.06)"
              strokeWidth="1"
              fill="none"
            />
            <polygon
              points="210,60 340,135 340,285 210,360 80,285 80,135"
              stroke="rgba(217,70,239,0.04)"
              strokeWidth="0.5"
              fill="none"
            />
          </svg>

          {/* Concentric Rotating Rings */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 420 420"
            fill="none"
          >
            {/* Glow filters */}
            <defs>
              <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="glow-fuchsia" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {ringData.map((ring, i) => (
              <circle
                key={i}
                className="preloader-ring"
                cx="210"
                cy="210"
                r={ring.r}
                stroke={ring.stroke}
                strokeWidth={ring.width}
                strokeDasharray={ring.dash}
                strokeLinecap="round"
                fill="none"
                opacity={ring.opacity}
                filter={ring.isCyan ? 'url(#glow-cyan)' : 'url(#glow-fuchsia)'}
              />
            ))}

            {/* Orbiting dots on rings */}
            {orbitDots.map((dot, i) => {
              const rad = (dot.angle * Math.PI) / 180;
              const cx = 210 + dot.r * Math.cos(rad);
              const cy = 210 + dot.r * Math.sin(rad);
              return (
                <circle
                  key={`orb-${i}`}
                  className="orbit-dot preloader-ring"
                  cx={cx}
                  cy={cy}
                  r={dot.size}
                  fill={dot.color}
                  opacity="0.8"
                  filter={dot.isCyan ? 'url(#glow-cyan)' : 'url(#glow-fuchsia)'}
                />
              );
            })}
          </svg>

          {/* Central Content Inside Rings */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            {/* Pulsing glyph */}
            <div
              ref={heroGlyphRef}
              className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-fuchsia-500/20 border border-white/10 flex items-center justify-center mb-4 backdrop-blur-sm"
            >
              <span className="font-syne font-black text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
                SH
              </span>
            </div>

            {/* Progress percentage */}
            <div className="font-syne text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 tabular-nums tracking-tight">
              {String(displayProgress).padStart(2, '0')}
              <span className="text-2xl md:text-3xl">%</span>
            </div>
          </div>
        </div>

        {/* Text Branding Below Rings */}
        <div ref={textRef} className="mt-6 md:mt-8 text-center">
          <h2 className="font-syne font-extrabold text-xl sm:text-2xl md:text-3xl tracking-[0.2em] text-white uppercase leading-none mb-2">
            {scrambledName}
          </h2>
          <p className="font-satoshi text-[10px] sm:text-xs tracking-[0.4em] text-cyan-400/70 uppercase font-semibold">
            {scrambledTag}
          </p>
        </div>

        {/* Progress Bar */}
        <div ref={progressRef} className="w-48 md:w-64 mt-6 flex flex-col items-center">
          <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-cyan-400 transition-all duration-150 ease-out rounded-full"
              style={{
                width: `${displayProgress}%`,
                boxShadow: '0 0 12px rgba(34,211,238,0.5), 0 0 24px rgba(217,70,239,0.3)',
              }}
            />
          </div>
          <span className="font-satoshi text-[9px] tracking-[0.3em] text-white/30 uppercase mt-3 animate-pulse">
            {displayProgress < 100 ? 'Initializing Neural Grid...' : 'System Loaded'}
          </span>
        </div>
      </div>

      {/* Corner decorative elements */}
      <div className="absolute top-6 left-6 flex flex-col gap-1 opacity-20 pointer-events-none">
        <div className="w-8 h-[1px] bg-cyan-400" />
        <div className="w-4 h-[1px] bg-cyan-400" />
      </div>
      <div className="absolute top-6 right-6 flex flex-col gap-1 items-end opacity-20 pointer-events-none">
        <div className="w-8 h-[1px] bg-fuchsia-500" />
        <div className="w-4 h-[1px] bg-fuchsia-500" />
      </div>
      <div className="absolute bottom-6 left-6 flex flex-col gap-1 opacity-20 pointer-events-none">
        <div className="w-4 h-[1px] bg-fuchsia-500" />
        <div className="w-8 h-[1px] bg-fuchsia-500" />
      </div>
      <div className="absolute bottom-6 right-6 flex flex-col gap-1 items-end opacity-20 pointer-events-none">
        <div className="w-4 h-[1px] bg-cyan-400" />
        <div className="w-8 h-[1px] bg-cyan-400" />
      </div>

      {/* Scan line effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)',
        }}
      />
    </div>
  );
}
