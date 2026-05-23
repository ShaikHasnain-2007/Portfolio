import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function NetworkPreloader({ progress, isReady, onDismissed }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const progressRef = useRef(null);
  
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isDismissing, setIsDismissing] = useState(false);
  const startTimestamp = useRef(Date.now());
  const animationFrameId = useRef(null);
  const progressLerped = useRef(0);

  // Lerp progress to make it look smooth and premium
  useEffect(() => {
    let active = true;
    const updateProgress = () => {
      if (!active) return;
      
      // Smoothly interpolate displayProgress towards the target progress
      const target = progress || 0;
      const diff = target - progressLerped.current;
      
      if (diff > 0.1) {
        progressLerped.current += diff * 0.1; // Lerp factor
      } else {
        progressLerped.current = target;
      }
      
      setDisplayProgress(Math.floor(progressLerped.current));
      
      if (progressLerped.current < 100 || !isReady) {
        requestAnimationFrame(updateProgress);
      }
    };
    
    requestAnimationFrame(updateProgress);
    return () => {
      active = false;
    };
  }, [progress, isReady]);

  // Main canvas particle animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Responsive particle count
    const particleCount = width < 768 ? 20 : 35;
    const particles = [];
    const connectionDistance = 140;

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 1.2;
        this.vy = (Math.random() - 0.5) * 1.2;
        this.radius = Math.random() * 2 + 1.5;
        this.color = Math.random() > 0.5 ? '#00f0ff' : '#d946ef'; // Cyan or Fuchsia
        this.originalVx = this.vx;
        this.originalVy = this.vy;
        this.exploded = false;
      }

      update(isExploding) {
        if (isExploding) {
          if (!this.exploded) {
            // Push particles outward from the center
            const dx = this.x - width / 2;
            const dy = this.y - height / 2;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const force = 12; // Outward explosion speed
            this.vx = (dx / dist) * force + (Math.random() - 0.5) * 2;
            this.vy = (dy / dist) * force + (Math.random() - 0.5) * 2;
            this.exploded = true;
          }
        }
        
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges (only if not exploding)
        if (!isExploding) {
          if (this.x < 0 || this.x > width) this.vx *= -1;
          if (this.y < 0 || this.y > height) this.vy *= -1;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 0; // Disable shadow blur for performance during load
        ctx.fill();
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Global alpha control for the canvas fade-out
    let globalAlpha = 1.0;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Determine if we should perform the outward blast animation
      const isExploding = isDismissing;
      
      if (isExploding) {
        globalAlpha -= 0.035; // Fade out quickly during dismissal
        if (globalAlpha < 0) globalAlpha = 0;
      }
      
      ctx.globalAlpha = globalAlpha;

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            
            // Connection line alpha matches proximity
            const alpha = (1 - dist / connectionDistance) * 0.25 * globalAlpha;
            // Create cyan to fuchsia gradient or use a simple midtone
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw and update particles
      particles.forEach((p) => {
        p.update(isExploding);
        p.draw();
      });

      if (globalAlpha > 0) {
        animationFrameId.current = requestAnimationFrame(animate);
      }
    };

    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [isDismissing]);

  // Coordinate dismissal timing
  useEffect(() => {
    // Keep visible for at least 2.0 seconds for smooth branding experience
    const MIN_DURATION = 2000; 
    
    const checkStatus = () => {
      const timeElapsed = Date.now() - startTimestamp.current;
      const firstBatchDone = isReady && progress >= 100;
      
      if (firstBatchDone && timeElapsed >= MIN_DURATION) {
        setIsDismissing(true);
        
        // Trigger GSAP exit transitions on text and container
        const ctx = gsap.context(() => {
          gsap.to(textRef.current, {
            scale: 1.15,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.inOut',
          });
          
          gsap.to(progressRef.current, {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.inOut',
          });

          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 1.0,
            ease: 'power4.inOut',
            onComplete: () => {
              if (onDismissed) onDismissed();
            },
          });
        }, containerRef);

        return () => ctx.revert();
      } else {
        // Check again shortly
        const remainingTime = Math.max(50, MIN_DURATION - timeElapsed);
        const timer = setTimeout(checkStatus, remainingTime);
        return () => clearTimeout(timer);
      }
    };

    const cleanup = checkStatus();
    return () => {
      if (typeof cleanup === 'function') cleanup();
    };
  }, [isReady, progress, onDismissed]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-[#030303] flex items-center justify-center overflow-hidden"
      style={{ touchAction: 'none' }}
    >
      {/* Background connecting dots canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block pointer-events-none"
      />
      
      {/* Radial overlay to draw focus to the center */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#030303_90%)] pointer-events-none" />

      {/* Brand & Loading Info Wrapper */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 select-none">
        <div ref={textRef} className="mb-8">
          {/* Typographic large logo */}
          <h2 className="font-syne font-extrabold text-3xl sm:text-5xl tracking-[0.25em] text-white uppercase leading-none mb-3">
            SHAIK HASNAIN
          </h2>
          <p className="font-satoshi text-xs sm:text-sm tracking-[0.5em] text-cyan-400/80 uppercase font-semibold">
            Creative Portfolio
          </p>
        </div>

        {/* Loading Progress Section */}
        <div ref={progressRef} className="w-64 flex flex-col items-center">
          {/* Progress percentage display */}
          <div className="font-syne text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 mb-4 tabular-nums">
            {String(displayProgress).padStart(2, '0')}%
          </div>
          
          {/* Sleek track and loading bar */}
          <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 transition-all duration-100 ease-out shadow-[0_0_10px_rgba(0,240,255,0.5)]"
              style={{ width: `${displayProgress}%` }}
            />
          </div>
          
          {/* Status Label */}
          <span className="font-satoshi text-[10px] tracking-[0.3em] text-white/40 uppercase mt-3 animate-pulse">
            {displayProgress < 100 ? 'Syncing Neural Assets...' : 'System Fully Initialized'}
          </span>
        </div>
      </div>
    </div>
  );
}
