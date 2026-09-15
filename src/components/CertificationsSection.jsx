import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Trophy, BookOpen, Cpu, Sparkles, ShieldCheck, Lock } from 'lucide-react';

const categories = ['All', 'Competition', 'Simulation', 'Workshop', 'Degree'];

const certifications = [
  {
    title: 'Deloitte Cyber Job Simulation',
    issuer: 'Deloitte (Forage)',
    type: 'Simulation',
    icon: ShieldCheck,
    color: 'cyan',
    year: '2026',
    description: 'Hands-on exposure to practical cybersecurity tasks, threat analysis, and engineering secure software systems.',
  },
  {
    title: 'Mastercard Cybersecurity Simulation',
    issuer: 'Mastercard (Forage)',
    type: 'Simulation',
    icon: Lock,
    color: 'fuchsia',
    year: '2026',
    description: 'Designed phishing awareness campaigns and analyzed threat simulation metrics for proactive organizational security.',
  },
  {
    title: 'HackSRM Hackathon',
    issuer: 'SRM University AP',
    type: 'Competition',
    icon: Trophy,
    color: 'cyan',
    year: '2026',
    description: 'Built CampusX AI consensus engine — dynamic multi-LLM aggregation and ranking system.',
  },
  {
    title: 'Hack The Winter – The Second Wave',
    issuer: 'Hackathon Community',
    type: 'Competition',
    icon: Award,
    color: 'fuchsia',
    year: '2025',
    description: 'Led Team Stark Industries (Angry Bird Edition), architected VOCA with scalable schemas & strict Git PR workflows.',
  },
  {
    title: 'Code to Connect',
    issuer: 'SRM University AP',
    type: 'Competition',
    icon: Sparkles,
    color: 'cyan',
    year: '2026',
    description: 'Developed SafeEcho mental health support platform with responsive sentiment intelligence.',
  },
  {
    title: 'QC² Quantum Conclave',
    issuer: 'Research & Innovation',
    type: 'Workshop',
    icon: Cpu,
    color: 'fuchsia',
    year: '2026',
    description: 'Selected participant — quantum gates, superpositions, and molecular computational algorithms.',
  },
  {
    title: 'B.Tech CSE — AI/ML',
    issuer: 'SRM University AP',
    type: 'Degree',
    icon: BookOpen,
    color: 'cyan',
    year: '2025–29',
    description: 'Computer Science & Engineering with AI/ML specialization — 8.5 CGPA academic standing.',
  },
];

export default function CertificationsSection() {
  const containerRef = useRef(null);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const header = el.querySelector('.section-header');
      const tabs = el.querySelector('.cert-tabs');
      const cards = el.querySelectorAll('.cert-card');

      if (header) {
        gsap.fromTo(header,
          { y: 50, opacity: 0, filter: 'blur(8px)' },
          {
            y: 0, opacity: 1, filter: 'blur(0px)', ease: 'power2.out',
            scrollTrigger: { trigger: header, start: 'top 92%', end: 'top 68%', scrub: 0.8 }
          }
        );
      }

      if (tabs) {
        gsap.fromTo(tabs,
          { y: 30, opacity: 0, scale: 0.95, filter: 'blur(6px)' },
          {
            y: 0, opacity: 1, scale: 1, filter: 'blur(0px)', ease: 'power2.out',
            scrollTrigger: { trigger: tabs, start: 'top 92%', end: 'top 70%', scrub: 0.8 }
          }
        );
      }

      // Parallax on oversized background number 05
      const bgNumber = el.querySelector('.cert-bg-number');
      if (bgNumber) {
        gsap.to(bgNumber, {
          y: -120,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          }
        });
      }

      // Animate cards entry with continuous 3D camera depth scrub and blur-to-sharp dissolve
      cards.forEach((card) => {
        gsap.fromTo(card,
          {
            y: 90,
            rotateX: 24,
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
            scrollTrigger: {
              trigger: card,
              start: 'top 96%',
              end: 'top 68%',
              scrub: 0.8,
            }
          }
        );
      });
    }, el);
    return () => ctx.revert();
  }, []);

  // Recalculate ScrollTrigger metrics when category tab filter updates
  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 100);
    return () => clearTimeout(t);
  }, [activeTab]);

  const handleCardMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--card-x', `${x}px`);
    card.style.setProperty('--card-y', `${y}px`);

    if (!window.matchMedia('(pointer: coarse)').matches) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    }
  };

  const handleCardMouseLeave = (e) => {
    e.currentTarget.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  const filtered = activeTab === 'All' 
    ? certifications 
    : certifications.filter((c) => c.type.toLowerCase() === activeTab.toLowerCase());

  return (
    <section ref={containerRef} className="relative w-full bg-transparent py-20 px-4 md:px-12 flex flex-col items-center">
      <div className="absolute top-1/2 left-[-10%] -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/35 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-[-10%] -translate-y-1/2 w-[600px] h-[600px] bg-fuchsia-500/35 rounded-full blur-[140px] pointer-events-none" />

      {/* Decorative oversized section index */}
      <div className="cert-bg-number absolute right-12 top-10 font-syne font-black text-[120px] leading-none text-white/[0.02] select-none pointer-events-none">
        05
      </div>

      <div className="w-full max-w-7xl relative z-10">
        <div className="section-header text-left mb-8">
          <span className="font-mono text-cyan-400 text-xs font-bold tracking-widest uppercase mb-2 inline-flex items-center gap-2">
            // 05. ACHIEVEMENTS <span className="animate-twinkle text-cyan-300">✦</span>
          </span>
          <h2 className="font-pixel text-3xl sm:text-5xl md:text-6xl text-white mt-2 tracking-wide leading-tight">
            Certifications & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-fuchsia-500">Awards</span>
          </h2>
          <p className="font-serif italic text-base md:text-lg text-white/75 max-w-lg mt-3 leading-relaxed tracking-wide">
            Hackathon victories, academic milestones, and research initiatives that define my engineering journey.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="cert-tabs flex flex-wrap gap-2 mb-10 pb-2 border-b border-white/5 text-left">
          {categories.map((cat) => {
            const isActive = cat === activeTab;
            return (
              <button
                key={cat}
                data-cursor="FILTER"
                onClick={() => setActiveTab(cat)}
                className={`font-syne text-xs uppercase tracking-widest px-5 py-2.5 rounded-full border transition-all duration-300 relative z-10 cursor-pointer ${
                  isActive
                    ? 'text-white font-bold border-cyan-400/40 shadow-[0_0_15px_rgba(var(--cyan-rgb),0.3)]'
                    : 'border-white/5 text-white/40 hover:text-white hover:border-white/20 bg-transparent'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCertTab"
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 border border-cyan-400/60 rounded-full -z-10"
                    transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                  />
                )}
                {cat}
              </button>
            );
          })}
        </div>

        {/* Filtered Grid with popLayout layout animation */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((cert) => {
              const IconComp = cert.icon;
              const isCyan = cert.color === 'cyan';
              return (
                <motion.div
                  layout
                  key={cert.title}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  data-cursor="AWARD"
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={handleCardMouseLeave}
                  className="cert-card group relative border border-white/10 rounded-3xl bg-white/[0.03] backdrop-blur-xl p-6 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:border-cyan-400/40 hover:bg-white/[0.05] hover:shadow-[0_12px_36px_rgba(0,0,0,0.6)]"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Cursor-following radial spotlight */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      background: `radial-gradient(350px circle at var(--card-x, 50%) var(--card-y, 50%), ${isCyan ? 'rgba(var(--cyan-rgb),0.25)' : 'rgba(var(--fuchsia-rgb),0.25)'}, transparent 65%)`
                    }}
                  />

                  <div className="relative z-10" style={{ transform: 'translateZ(10px)' }}>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 ${isCyan ? 'bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 group-hover:border-cyan-400/60 group-hover:shadow-[0_0_12px_rgba(var(--cyan-rgb),0.5)]' : 'bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 group-hover:border-fuchsia-400/60 group-hover:shadow-[0_0_12px_rgba(var(--fuchsia-rgb),0.5)]'}`}>
                        <IconComp size={18} />
                      </div>
                      <span className={`text-[9px] font-bold font-syne uppercase tracking-widest px-3 py-1 rounded-full border ${isCyan ? 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20' : 'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20'}`}>
                        {cert.type}
                      </span>
                    </div>

                    <h3 className={`font-syne font-bold text-lg text-white mb-1 transition-colors duration-300 ${isCyan ? 'group-hover:text-cyan-400' : 'group-hover:text-fuchsia-400'}`}>
                      {cert.title}
                    </h3>
                    <span className="font-satoshi text-xs text-white/40 block mb-3">{cert.issuer} • {cert.year}</span>
                    <p className="font-satoshi text-xs text-white/60 leading-relaxed">
                      {cert.description}
                    </p>
                  </div>

                  {/* Top Hairline Sheen */}
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
