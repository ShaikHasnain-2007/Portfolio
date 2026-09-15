import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Linkedin, Mail, ChevronDown, Brain, Gamepad2, Code2 } from 'lucide-react';
import SplitText from './SplitText';
import FluidHeroBackground from './FluidHeroBackground';
import baseBgImg from './retouch_2026070720521920.jpg_202607082155.jpeg';
import revealBgImg from './Make_man\'s_chest_wider_2K_202607082155.jpeg';

const ROLES = [
  { title: "AI & ML Engineer", icon: Brain },
  { title: "Unity 3D Game Dev", icon: Gamepad2 },
  { title: "Intelligent Systems", icon: Code2 },
];

// Custom hook to scramble text with random characters before settling on the target text
function useTextScramble(targetText, active = true, speed = 35, delay = 0) {
  const [text, setText] = useState('');

  useEffect(() => {
    if (!active) return;
    
    let isCancelled = false;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+~`|}{[]:;?><,./-';
    let frame = 0;
    const duration = 20; // total animation frames to resolve
    let timeoutId = null;
    let rAFId = null;
    
    const run = () => {
      if (isCancelled) return;
      frame++;
      
      const progress = frame / duration;
      if (progress >= 1) {
        setText(targetText);
        return;
      }

      let result = '';
      for (let i = 0; i < targetText.length; i++) {
        if (targetText[i] === ' ') {
          result += ' ';
          continue;
        }
        
        const charProgress = i / targetText.length;
        if (progress > charProgress) {
          result += targetText[i];
        } else {
          result += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      setText(result);
      timeoutId = setTimeout(() => {
        rAFId = requestAnimationFrame(run);
      }, 1000 / speed);
    };

    const delayTimeout = setTimeout(() => {
      rAFId = requestAnimationFrame(run);
    }, delay * 1000);

    return () => {
      isCancelled = true;
      clearTimeout(delayTimeout);
      if (timeoutId) clearTimeout(timeoutId);
      if (rAFId) cancelAnimationFrame(rAFId);
    };
  }, [targetText, active, speed, delay]);

  return text;
}

export default function HeroCanvas({ onProgress, onReady, startAnimations }) {
  const containerRef = useRef(null);

  // Refs for 3D Parallax scrolling overlays
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const navRef = useRef(null);
  const contactRef = useRef(null);
  const vignetteRef = useRef(null);

  // Cycling role index
  const [activeRole, setActiveRole] = useState(0);

  useEffect(() => {
    if (!startAnimations) return;
    const interval = setInterval(() => {
      setActiveRole((prev) => (prev + 1) % ROLES.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [startAnimations]);

  // Scramble developer name branding
  const scrambledBrandName = useTextScramble("Shaik Hasnain.", startAnimations, 35, 0.5);

  // GSAP ScrollTrigger animation with gsap.context
  useEffect(() => {
    if (!startAnimations) return;

    const ctx = gsap.context(() => {
      // Scroll trigger sequence timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        }
      });

      // Parallax branding/navigation elements sliding up/out
      if (navRef.current) {
        tl.to(navRef.current, {
          y: -100,
          opacity: 0,
          ease: 'none'
        }, 0);
      }

      if (contactRef.current) {
        tl.to(contactRef.current, {
          y: -120,
          opacity: 0,
          ease: 'none'
        }, 0);
      }

      // Parallax main title drifting up faster (creates 3D parallax separation)
      if (titleRef.current) {
        tl.to(titleRef.current, {
          y: -240,
          scale: 1.06,
          opacity: 0.05,
          ease: 'none'
        }, 0);
      }

      // Parallax description drifting down/out
      if (descRef.current) {
        tl.to(descRef.current, {
          y: 160,
          opacity: 0,
          ease: 'none'
        }, 0);
      }

      // Parallax vignette scaling down
      if (vignetteRef.current) {
        tl.to(vignetteRef.current, {
          opacity: 0.3,
          ease: 'none'
        }, 0);
      }
    }, containerRef);

    // Refresh ScrollTrigger to ensure geometry recalculation
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      ctx.revert();
    };
  }, [startAnimations]);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-black"
    >
      {/* Render the new fluid WebGL background at the bottom of the z-index stack */}
      <div className="absolute inset-0 z-0">
        <FluidHeroBackground
          baseBg={baseBgImg}
          revealBg={revealBgImg}
          onProgress={onProgress}
          onReady={onReady}
        />
      </div>

      {/* Lighting & Vignette Overlays */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none z-0" />
      <div
        ref={vignetteRef}
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, transparent 50%, rgba(0,0,0,0.4) 100%)'
        }}
      />
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/40 to-transparent pointer-events-none z-0" />

      {/* UI Overlay Content */}
      {startAnimations && (
        <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 md:p-12 text-white pointer-events-none">

          {/* Top Row: Links and Branding */}
          <div className="flex justify-between items-start w-full">
            <div ref={navRef} className="font-pixel text-xl sm:text-2xl font-bold tracking-wider uppercase">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-fuchsia-500">
                {scrambledBrandName || "Shaik Hasnain."}
              </span>
            </div>

            {/* Top-Right vertical contact stack */}
            <div ref={contactRef} className="flex flex-col gap-4 font-satoshi text-sm items-end pointer-events-auto">
              <a
                href="https://linkedin.com/in/shaik-hasnain-55a072396"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/70 hover:text-cyan-400 transition-colors duration-300 group"
              >
                <span className="hidden md:inline group-hover:underline">LinkedIn</span>
                <Linkedin size={18} className="text-white group-hover:text-cyan-400 transition-colors" />
              </a>
              <a
                href="mailto:shaikhasnain2007@gmail.com"
                className="flex items-center gap-2 text-white/70 hover:text-fuchsia-400 transition-colors duration-300 group"
              >
                <span className="hidden md:inline group-hover:underline">Email</span>
                <Mail size={18} className="text-white group-hover:text-fuchsia-400 transition-colors" />
              </a>
            </div>
          </div>

          {/* Bottom Row: Title and scroll prompt */}
          <div className="flex flex-col md:flex-row justify-between items-end w-full gap-8 md:gap-4 pb-8 md:pb-0">

            {/* Bottom-Left: Title & Dynamic Cycling Role Capsule */}
            <div ref={titleRef} className="w-full md:max-w-xl text-left">
              {/* Cycling Multi-Icon Role Capsule */}
              <div className="flex items-center gap-3 mb-4 pointer-events-auto select-none">
                {/* Stacked Icon Rings */}
                <div
                  className="relative flex items-center h-10 w-[68px]"
                  style={{ zIndex: 10 }}
                >
                  {ROLES.map((role, idx) => {
                    const pos = (idx - activeRole + 2 + ROLES.length) % ROLES.length;
                    const IconComp = role.icon;
                    const isActive = idx === activeRole;

                    return (
                      <div
                        key={role.title}
                        className="absolute top-0 w-10 h-10 rounded-full p-[2px] bg-black/85 border border-white/20 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] shadow-[0_4px_16px_rgba(0,0,0,0.7)] flex items-center justify-center"
                        style={{
                          transform: `translateX(${pos * 18}px)`,
                          zIndex: pos === 2 ? 30 : pos === 1 ? 20 : 10,
                          opacity: pos === 2 ? 1 : pos === 1 ? 0.75 : 0.45,
                        }}
                      >
                        <div className={`w-full h-full rounded-full flex items-center justify-center transition-colors duration-500 ${
                          isActive 
                            ? 'bg-gradient-to-tr from-cyan-400/30 to-fuchsia-500/30 text-cyan-300 border border-cyan-400/40 shadow-[0_0_12px_rgba(56,189,248,0.4)]' 
                            : 'bg-white/5 text-white/40'
                        }`}>
                          <IconComp size={16} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Sliding Role Pill */}
                <div className="h-10 px-5 rounded-full bg-black/70 border border-white/20 backdrop-blur-md flex items-center shadow-[0_4px_24px_rgba(0,0,0,0.6)] overflow-hidden relative w-[240px] sm:w-[260px]">
                  <div className="relative w-full h-full flex items-center">
                    {ROLES.map((role, idx) => (
                      <span
                        key={role.title}
                        className={`absolute left-0 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          activeRole === idx 
                            ? 'opacity-100 translate-y-0 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-fuchsia-500' 
                            : 'opacity-0 translate-y-3 pointer-events-none text-white/30'
                        }`}
                      >
                        {role.title}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <h1 className="font-pixel text-4xl sm:text-6xl md:text-8xl uppercase tracking-tight leading-tight mb-2 select-text cursor-default inline-block">
                <SplitText text="AI/ML" type="chars" stagger={0.03} delay={1.4} /> <br />
                <SplitText
                  text="Engineer"
                  type="chars"
                  stagger={0.03}
                  delay={1.65}
                  className="text-cyan-400"
                />
              </h1>
            </div>

            {/* Bottom-Right: Description and Scroll Prompt */}
            <div ref={descRef} className="flex flex-col items-start md:items-end text-left md:text-right gap-4 max-w-sm">
              <p className="font-serif italic font-normal text-white/90 text-base md:text-lg leading-relaxed tracking-wide">
                crafting high-performance intelligent interfaces and immersive graphics simulations where complex logic meets seamless visual art.
              </p>

              {/* Scroll Indicator */}
              <div className="flex items-center gap-2 text-cyan-400 text-xs tracking-widest uppercase font-bold animate-pulse">
                <span className="md:hidden">Scroll</span>
                <span className="hidden md:inline">Scroll Down</span>
                <div className="p-2 border border-cyan-400/40 rounded-full flex items-center justify-center">
                  <ChevronDown size={14} className="animate-bounce" />
                </div>
              </div>
            </div>

          </div>

        </div>
      )}
    </section>
  );
}

