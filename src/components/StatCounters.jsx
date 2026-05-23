import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  {
    value: 4,
    suffix: '+',
    label: 'Hackathons Competed',
    desc: 'HackSRM, Code to Connect, and regional hackathons',
    color: 'from-cyan-400 to-blue-500',
    glow: 'rgba(34, 211, 238, 0.15)'
  },
  {
    value: 6,
    suffix: '+',
    label: 'Projects Shipped',
    desc: 'AI systems, game simulations, and production web apps',
    color: 'from-fuchsia-500 to-purple-600',
    glow: 'rgba(217, 70, 239, 0.15)'
  },
  {
    value: 8.4,
    suffix: '',
    label: 'Academic Standing (CGPA)',
    desc: 'Solid first semester at SRM AP University',
    color: 'from-emerald-400 to-teal-500',
    glow: 'rgba(52, 211, 153, 0.15)',
    isFloat: true
  },
  {
    value: 3,
    suffix: '+',
    label: 'Game Simulations',
    desc: '3D FPS game, Flappy AP, and physics experiments',
    color: 'from-amber-400 to-orange-500',
    glow: 'rgba(245, 158, 11, 0.15)'
  }
];

export default function StatCounters() {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const cards = el.querySelectorAll('.grid > div');
      const elements = el.querySelectorAll('.stat-val');
      
      // Animate cards entry from bottom edge
      gsap.fromTo(cards,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.0,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          }
        }
      );
      
      elements.forEach((numEl) => {
        const targetVal = parseFloat(numEl.getAttribute('data-target'));
        const isFloat = numEl.getAttribute('data-float') === 'true';

        gsap.fromTo(numEl,
          { textContent: '0' },
          {
            textContent: targetVal,
            duration: 2.0,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: numEl,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
            snap: { textContent: isFloat ? 0.1 : 1 },
            onUpdate: function () {
              const val = parseFloat(this.targets()[0].textContent);
              numEl.textContent = isFloat ? val.toFixed(1) : Math.floor(val).toString();
            }
          }
        );
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full bg-black py-16 px-4 md:px-12 flex flex-col items-center overflow-hidden">
      {/* Background orb glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-7xl relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="group border border-white/5 bg-white/[0.02] backdrop-blur-xl rounded-3xl p-6 md:p-8 flex flex-col justify-between overflow-hidden relative transition-all duration-500 hover:border-white/10 hover:bg-white/[0.04]"
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
                {/* Large animated number */}
                <div className="flex items-baseline">
                  <span
                    className="stat-val font-syne font-black text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-white to-white tracking-tighter"
                    style={{
                      backgroundImage: 'linear-gradient(to right, #ffffff, #888888)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                    data-target={stat.value}
                    data-float={stat.isFloat ? 'true' : 'false'}
                  >
                    0
                  </span>
                  <span className="font-syne font-black text-4xl md:text-5xl text-white/90">
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
