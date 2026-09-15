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

  useEffect(() => {
    if (!shouldAnimate) return;

    const targetVal = stat.value;
    const isFloat = stat.isFloat;
    const obj = { val: 0 };

    const tween = gsap.to(obj, {
      val: targetVal,
      duration: 1.6,
      ease: 'power2.out',
      onUpdate: () => {
        setDisplayVal(isFloat ? parseFloat(obj.val.toFixed(1)) : Math.floor(obj.val));
      },
      onComplete: () => {
        setDisplayVal(targetVal);
      }
    });

    return () => {
      tween.kill();
    };
  }, [shouldAnimate, stat.value, stat.isFloat]);

  return (
    <span className="font-pixel text-4xl sm:text-5xl md:text-6xl text-white tracking-wider">
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

    // IntersectionObserver triggers immediately when the section enters viewport (via scroll OR tab filtering layout shifts)
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

      // Animate cards entry from bottom edge
      gsap.fromTo(cards,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 95%',
            toggleActions: 'play none none none',
            onEnter: () => setShouldAnimate(true),
          }
        }
      );
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
              className="group border border-white/5 bg-white/[0.02] backdrop-blur-xl rounded-3xl p-6 md:p-8 flex flex-col justify-between overflow-hidden relative transition-all duration-500 hover:border-white/20 hover:bg-white/[0.05]"
              style={{
                boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.4)`,
              }}
            >
              {/* Spotlight cursor tracking placeholder gradient */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(300px circle at 50% 50%, ${stat.glow}, transparent 60%)`
                }}
              />

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
