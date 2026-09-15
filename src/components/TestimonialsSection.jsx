import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import MagneticElement from './MagneticElement';

const testimonials = [
  {
    quote: "Shaik's technical depth in AI/ML and ability to rapidly prototype during hackathons is genuinely impressive. His CampusX consensus engine showed innovative thinking beyond typical student projects.",
    name: 'HackSRM Mentors',
    role: 'Hackathon Jury Panel',
    color: 'cyan',
  },
  {
    quote: "Working with Hasnain on the VOCA platform during Hack The Winter was an incredible experience. His drive to push boundaries and integrate multiple LLM APIs into a cohesive product is remarkable.",
    name: 'Team Stark Industries',
    role: 'Hack The Winter Teammates',
    color: 'fuchsia',
  },
  {
    quote: "Hasnain brings a unique combination of creative design sensibility and strong engineering fundamentals. His Unity zombie FPS game demonstrated sophisticated AI pathfinding and state machine architecture.",
    name: 'Game Dev Community',
    role: 'Peer Review',
    color: 'cyan',
  },
  {
    quote: "SafeEcho demonstrated real empathy-driven engineering. The sentiment analysis logic and responsive UI showed that Shaik understands both the technical and human sides of software development.",
    name: 'Code to Connect',
    role: 'Hackathon Organizers',
    color: 'fuchsia',
  },
];

export default function TestimonialsSection() {
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);

  // Auto-rotate testimonials when not paused
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
      setProgressKey((prev) => prev + 1);
    }, 6000);

    return () => clearInterval(timer);
  }, [activeIndex, isPaused]);

  // GSAP 3D perspective scroll entrance with blur-to-sharp dissolve
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const header = el.querySelector('.testimonial-header');
      const wrapper = el.querySelector('.testimonial-card-wrapper');

      if (header) {
        gsap.fromTo(header,
          { y: 50, opacity: 0, filter: 'blur(8px)' },
          {
            y: 0, opacity: 1, filter: 'blur(0px)', ease: 'power2.out',
            scrollTrigger: { trigger: header, start: 'top 92%', end: 'top 70%', scrub: 0.8 }
          }
        );
      }

      if (wrapper) {
        gsap.fromTo(wrapper,
          {
            y: 90,
            rotateX: 20,
            scale: 0.88,
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
            scrollTrigger: { trigger: wrapper, start: 'top 92%', end: 'top 65%', scrub: 0.8 }
          }
        );
      }
    }, el);
    return () => ctx.revert();
  }, []);

  const goTo = (dir) => {
    setDirection(dir);
    setActiveIndex((prev) => {
      if (dir === 1) return (prev + 1) % testimonials.length;
      return prev === 0 ? testimonials.length - 1 : prev - 1;
    });
    setProgressKey((prev) => prev + 1);
  };

  const handleMouseMove = (e) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    if (cardRef.current) {
      cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    }
  };

  const current = testimonials[activeIndex];

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 120 : -120, opacity: 0, scale: 0.95, filter: 'blur(6px)' }),
    center: { x: 0, opacity: 1, scale: 1, filter: 'blur(0px)' },
    exit: (dir) => ({ x: dir > 0 ? -120 : 120, opacity: 0, scale: 0.95, filter: 'blur(6px)' }),
  };

  return (
    <section ref={containerRef} className="relative w-full bg-transparent py-20 px-4 md:px-12 flex flex-col items-center select-none">
      {/* Background glow */}
      <div className="absolute top-1/3 left-[-10%] w-[500px] h-[500px] bg-cyan-500/35 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-[-10%] w-[500px] h-[500px] bg-fuchsia-500/35 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-4xl relative z-10">
        {/* Header */}
        <div className="testimonial-header text-left mb-12">
          <span className="font-mono text-fuchsia-400 text-xs font-bold tracking-widest uppercase mb-2 inline-flex items-center gap-2">
            // 06. FEEDBACK <span className="animate-twinkle-delay-1 text-fuchsia-300">✦</span>
          </span>
          <h2 className="font-pixel text-3xl sm:text-5xl md:text-6xl text-white mt-2 tracking-wide leading-tight">
            What People <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-fuchsia-500">Say</span>
          </h2>
        </div>

        {/* Testimonial Card with 3D Mouse Physics and Hover Pause */}
        <div 
          ref={cardRef}
          data-cursor="TESTIMONIAL"
          onMouseEnter={() => setIsPaused(true)}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="testimonial-card-wrapper relative min-h-[280px] md:min-h-[240px] transition-transform duration-300"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="w-full border border-white/10 rounded-3xl bg-white/[0.03] backdrop-blur-xl p-8 md:p-10 relative overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.5)]"
            >
              {/* Quote glow */}
              <div className={`absolute top-0 right-0 w-40 h-40 rounded-full blur-[80px] pointer-events-none ${current.color === 'cyan' ? 'bg-cyan-500/15' : 'bg-fuchsia-500/15'}`} />

              <Quote size={32} className={`mb-4 ${current.color === 'cyan' ? 'text-cyan-400/40' : 'text-fuchsia-400/40'} animate-pulse`} />

              <p className="font-serif italic text-base md:text-lg text-white/90 leading-relaxed mb-6 relative z-10 font-light">
                "{current.quote}"
              </p>

              <div className="flex items-center gap-3 relative z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold font-mono ${current.color === 'cyan' ? 'bg-cyan-400/10 text-cyan-400 border border-cyan-400/20' : 'bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20'}`}>
                  {current.name.charAt(0)}
                </div>
                <div className="text-left">
                  <h4 className="font-syne font-bold text-sm text-white">{current.name}</h4>
                  <span className="font-satoshi text-xs text-white/50">{current.role}</span>
                </div>
              </div>

              {/* Countdown Scrub Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/5 overflow-hidden">
                <motion.div
                  key={progressKey}
                  initial={{ width: '0%' }}
                  animate={{ width: isPaused ? '0%' : '100%' }}
                  transition={{ duration: isPaused ? 0 : 6, ease: 'linear' }}
                  className={`h-full ${current.color === 'cyan' ? 'bg-cyan-400 shadow-[0_0_8px_rgba(var(--cyan-rgb),0.8)]' : 'bg-fuchsia-400 shadow-[0_0_8px_rgba(var(--fuchsia-rgb),0.8)]'}`}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation & Controls */}
        <div className="flex items-center justify-between mt-8">
          {/* Dots Indicator */}
          <div className="flex gap-2 items-center">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > activeIndex ? 1 : -1); setActiveIndex(i); setProgressKey((prev) => prev + 1); }}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${i === activeIndex ? 'bg-cyan-400 w-7' : 'bg-white/20 hover:bg-white/40 w-2'}`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
            {isPaused && (
              <span className="font-mono text-[9px] font-bold text-cyan-400/80 uppercase tracking-widest ml-3">
                [PAUSED]
              </span>
            )}
          </div>

          {/* Magnetic Arrow Buttons */}
          <div className="flex gap-3">
            <MagneticElement range={35}>
              <button
                onClick={() => goTo(-1)}
                data-cursor="NAV"
                className="w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:border-cyan-400/50 hover:bg-cyan-500/10 flex items-center justify-center text-white/60 hover:text-cyan-400 transition-all duration-300 cursor-pointer shadow-md"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={16} />
              </button>
            </MagneticElement>

            <MagneticElement range={35}>
              <button
                onClick={() => goTo(1)}
                data-cursor="NAV"
                className="w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:border-cyan-400/50 hover:bg-cyan-500/10 flex items-center justify-center text-white/60 hover:text-cyan-400 transition-all duration-300 cursor-pointer shadow-md"
                aria-label="Next testimonial"
              >
                <ChevronRight size={16} />
              </button>
            </MagneticElement>
          </div>
        </div>
      </div>
    </section>
  );
}
