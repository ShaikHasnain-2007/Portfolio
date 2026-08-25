import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Award, Trophy, BookOpen, Cpu, Sparkles } from 'lucide-react';

const certifications = [
  {
    title: 'HackSRM Hackathon',
    issuer: 'SRM University AP',
    type: 'Competition',
    icon: Trophy,
    color: 'cyan',
    year: '2026',
    description: 'Built CampusX AI consensus engine — multi-LLM aggregation system',
  },
  {
    title: 'Hack The Winter',
    issuer: 'Hackathon Community',
    type: 'Competition',
    icon: Award,
    color: 'fuchsia',
    year: '2025',
    description: 'Led Team Stark Industries, engineered VOCA language learning platform',
  },
  {
    title: 'Code to Connect',
    issuer: 'SRM University AP',
    type: 'Competition',
    icon: Sparkles,
    color: 'cyan',
    year: '2026',
    description: 'Developed SafeEcho mental health support web application',
  },
  {
    title: 'QC² Quantum Conclave',
    issuer: 'Research & Innovation',
    type: 'Workshop',
    icon: Cpu,
    color: 'fuchsia',
    year: '2026',
    description: 'Selected participant — quantum gates, superpositions, molecular simulations',
  },
  {
    title: 'B.Tech CSE — AI/ML',
    issuer: 'SRM University AP',
    type: 'Degree',
    icon: BookOpen,
    color: 'cyan',
    year: '2025–29',
    description: 'Computer Science & Engineering with AI/ML specialization — 8.5 CGPA',
  },
];

export default function CertificationsSection() {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const cards = el.querySelectorAll('.cert-card');
      gsap.fromTo(cards,
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          }
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full bg-transparent py-20 px-4 md:px-12 flex flex-col items-center">
      <div className="absolute top-1/2 left-[-10%] -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/35 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-[-10%] -translate-y-1/2 w-[600px] h-[600px] bg-fuchsia-500/35 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-7xl relative z-10">
        <div className="text-left mb-12">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {certifications.map((cert, i) => {
            const IconComp = cert.icon;
            const isCyan = cert.color === 'cyan';
            return (
              <div
                key={i}
                className="cert-card group relative border border-white/10 rounded-3xl bg-white/[0.03] backdrop-blur-xl p-6 flex flex-col justify-between overflow-hidden transition-all duration-500 hover:border-white/20 hover:bg-white/[0.05]"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(300px circle at 50% 30%, ${isCyan ? 'rgba(var(--cyan-rgb),0.3)' : 'rgba(var(--fuchsia-rgb),0.3)'}, transparent 60%)`
                  }}
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isCyan ? 'bg-cyan-400/10 border border-cyan-400/20 text-cyan-400' : 'bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400'}`}>
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

                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
