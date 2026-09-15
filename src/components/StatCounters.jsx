import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const stats = [
  {
    value: 7,
    suffix: '+',
    label: 'Hackathons & Contests',
    desc: 'Adobe Hackathon, Hack The Winter, HackSRM, My1stHack & QuizOff',
    color: 'from-cyan-400 to-blue-500',
    glow: 'rgba(var(--cyan-rgb), 0.35)'
  },
  {
    value: 8,
    suffix: '+',
    label: 'Projects Shipped',
    desc: 'AI consensus, FastAPI backends, AEGIS governance & WebXR',
    color: 'from-fuchsia-500 to-purple-600',
    glow: 'rgba(var(--fuchsia-rgb), 0.35)'
  },
  {
    value: 8.5,
    suffix: '',
    label: 'Academic Standing (CGPA)',
    desc: 'B.Tech CSE with AI/ML at SRM University AP',
    color: 'from-emerald-400 to-teal-500',
    glow: 'rgba(52, 211, 153, 0.35)',
    isFloat: true
  },
  {
    value: 5,
    suffix: '+',
    label: 'Simulations & VR/AR',
    desc: 'Unity 3D FPS, ARC-LABS WebXR, Deloitte & Mastercard Cyber',
    color: 'from-amber-400 to-orange-500',
    glow: 'rgba(245, 158, 11, 0.35)'
  }
];

function SingleCounter({ stat, shouldAnimate }) {
  const [displayVal, setDisplayVal] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!shouldAnimate) return;

    const targetVal = stat.value;
    const isFloat = stat.isFloat;
    const obj = { val: 0 };

    const tween = gsap.to(obj, {
      val: targetVal,
      duration: 1.4,
      ease: 'power4.out',
      onStart: () => {
        setCompleted(false);
      },
      onUpdate: () => {
        setDisplayVal(isFloat ? parseFloat(obj.val.toFixed(1)) : Math.floor(obj.val));
      },
      onComplete: () => {
        setDisplayVal(targetVal);
        setCompleted(true);
      }
    });

    return () => {
      tween.kill();
    };
  }, [shouldAnimate, stat.value, stat.isFloat]);

  return (
    <span
      className={`font-pixel text-4xl sm:text-5xl md:text-6xl text-white tracking-wider inline-block transition-transform duration-300 ${
        completed ? 'scale-105 drop-shadow-[0_0_12px_rgba(var(--cyan-rgb),0.5)]' : ''
      }`}
    >
      {stat.isFloat ? (displayVal.toFixed ? displayVal.toFixed(1) : displayVal) : displayVal}
    </span>
  );
}

export default function StatCounters() {
  const containerRef = useRef(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Check if already in viewport immediately on mount or layout shift
    const checkVisibility = () => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 100 && rect.bottom > -100) {
        setShouldAnimate(true);
      }
    };

    checkVisibility();

    // IntersectionObserver triggers immediately when the section enters viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldAnimate(true);
          }
        });
      },
      { threshold: 0.05, rootMargin: '100px' }
    );

    observer.observe(el);

    const ctx = gsap.context(() => {
      const cards = el.querySelectorAll('.grid > div');

      // Animate cards entry from 3D camera depth with continuous scroll-driven scrub
      cards.forEach((card) => {
        gsap.fromTo(card,
          {
            y: 80,
            rotateX: 24,
            scale: 0.86,
            opacity: 0,
            filter: 'blur(12px)',
            transformOrigin: '50% 0%'
          },
          {
            y: 0,
            rotateX: 0,
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)',
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 96%',
              end: 'top 68%',
              scrub: 0.8,
              onEnter: () => setShouldAnimate(true),
            }
          }
        );
      });
    }, el);

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
      checkVisibility();
    }, 150);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      ctx.revert();
    };
  }, []);

  const handleMouseMove = (e) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--card-x', `${x}px`);
    card.style.setProperty('--card-y', `${y}px`);
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = `perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  return (
    <section ref={containerRef} className="relative w-full bg-transparent py-16 px-4 md:px-12 flex flex-col items-center">
      {/* Background orb glow */}
      <div className="absolute top-1/2 left-[-10%] -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/35 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-[-10%] -translate-y-1/2 w-[500px] h-[500px] bg-fuchsia-500/35 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-7xl relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              data-cursor="STATS"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="group border border-white/5 bg-white/[0.02] backdrop-blur-xl rounded-3xl p-6 md:p-8 flex flex-col justify-between overflow-hidden relative transition-transform duration-200 ease-out hover:border-white/20 hover:bg-white/[0.05] hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
              style={{
                boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.4)`,
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Dynamic spotlight cursor tracking gradient */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: `radial-gradient(350px circle at var(--card-x, 50%) var(--card-y, 50%), ${stat.glow}, transparent 65%)`
                }}
              />

              {/* Top ambient hairline border glow */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10 text-left">
                {/* Large animated number managed by React state */}
                <div className="flex items-baseline">
                  <SingleCounter stat={stat} shouldAnimate={shouldAnimate} />
                  <span className="font-pixel text-3xl sm:text-4xl md:text-5xl text-cyan-400 ml-1">
                    {stat.suffix}
                  </span>
                </div>

                {/* Labels */}
                <h4 className="font-syne font-bold text-white text-base mt-4 mb-2 tracking-tight group-hover:text-cyan-400 transition-colors duration-300">
                  {stat.label}
                </h4>
                <p className="font-satoshi text-xs text-white/50 leading-relaxed">
                  {stat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
