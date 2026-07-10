import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

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
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeIndex]);

  // GSAP scroll entrance
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el.querySelector('.testimonial-header'),
        { y: 80, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
        }
      );
      gsap.fromTo(el.querySelector('.testimonial-card-wrapper'),
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, delay: 0.2, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none none' }
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  const goTo = (dir) => {
    setDirection(dir);
    setActiveIndex((prev) => {
      if (dir === 1) return (prev + 1) % testimonials.length;
      return prev === 0 ? testimonials.length - 1 : prev - 1;
    });
  };

  const current = testimonials[activeIndex];

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 200 : -200, opacity: 0, scale: 0.95 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir) => ({ x: dir > 0 ? -200 : 200, opacity: 0, scale: 0.95 }),
  };

  return (
    <section ref={containerRef} className="relative w-full bg-transparent py-20 px-4 md:px-12 flex flex-col items-center">
      {/* Background glow */}
      <div className="absolute top-1/3 left-[-10%] w-[500px] h-[500px] bg-cyan-500/35 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-[-10%] w-[500px] h-[500px] bg-fuchsia-500/35 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-4xl relative z-10">
        {/* Header */}
        <div className="testimonial-header text-left mb-12">
          <span className="text-fuchsia-400 text-xs font-bold tracking-widest uppercase font-satoshi">FEEDBACK</span>
          <h2 className="font-syne font-extrabold text-4xl md:text-6xl text-white mt-2">
            What People <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">Say</span>
          </h2>
        </div>

        {/* Testimonial Card */}
        <div className="testimonial-card-wrapper relative min-h-[280px] md:min-h-[240px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full border border-white/10 rounded-3xl bg-white/[0.03] backdrop-blur-xl p-8 md:p-10 relative overflow-hidden"
            >
              {/* Quote glow */}
              <div className={`absolute top-0 right-0 w-40 h-40 rounded-full blur-[80px] pointer-events-none ${current.color === 'cyan' ? 'bg-cyan-500/10' : 'bg-fuchsia-500/10'}`} />

              <Quote size={32} className={`mb-4 ${current.color === 'cyan' ? 'text-cyan-400/30' : 'text-fuchsia-400/30'}`} />

              <p className="font-satoshi text-sm md:text-base text-white/80 leading-relaxed mb-6 relative z-10">
                "{current.quote}"
              </p>

              <div className="flex items-center gap-3 relative z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold font-syne ${current.color === 'cyan' ? 'bg-cyan-400/10 text-cyan-400 border border-cyan-400/20' : 'bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20'}`}>
                  {current.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-syne font-bold text-sm text-white">{current.name}</h4>
                  <span className="font-satoshi text-xs text-white/50">{current.role}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          {/* Dots */}
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > activeIndex ? 1 : -1); setActiveIndex(i); }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === activeIndex ? 'bg-cyan-400 w-6' : 'bg-white/20 hover:bg-white/40'}`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>

          {/* Arrows */}
          <div className="flex gap-2">
            <button
              onClick={() => goTo(-1)}
              className="w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:border-cyan-400/40 hover:bg-cyan-500/5 flex items-center justify-center text-white/60 hover:text-cyan-400 transition-all duration-300"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => goTo(1)}
              className="w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:border-cyan-400/40 hover:bg-cyan-500/5 flex items-center justify-center text-white/60 hover:text-cyan-400 transition-all duration-300"
              aria-label="Next testimonial"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
