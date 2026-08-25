import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { GraduationCap, Code2, Award, Zap, Compass } from 'lucide-react';

const milestones = [
  {
    date: 'Late 2025',
    title: 'Commenced CS Degree (AI/ML)',
    location: 'SRM University AP',
    description: 'Enrolled in B.Tech Computer Science & Engineering, specializing in Artificial Intelligence and Machine Learning to build the foundation of algorithmic logic and complex computing systems.',
    icon: GraduationCap,
    glow: 'rgba(var(--cyan-rgb), 0.2)'
  },
  {
    date: 'December 2025',
    title: 'Developed VOCA & Hack The Winter',
    location: 'Hackathon Initiative',
    description: 'Led team "Stark Industries" to engineer VOCA, an innovative AI-powered language learning platform, during the Hack The Winter hackathon.',
    icon: Code2,
    glow: 'rgba(var(--fuchsia-rgb), 0.2)'
  },
  {
    date: 'January 2026',
    title: 'First Semester Milestone',
    location: 'Academic Standing',
    description: 'Completed the initial university term with a strong academic foundation, achieving an 8.5 CGPA in core computer science curriculum.',
    icon: Award,
    glow: 'rgba(16, 185, 129, 0.2)'
  },
  {
    date: 'February 2026',
    title: 'Hackathon Sprint & Triple Launches',
    location: 'HackSRM & Code to Connect',
    description: 'A high-velocity month engineering the CampusX LLM consensus engine for HackSRM, scripting SafeEcho for Code to Connect, and compiling the Firebase-integrated game "Flappy Bhai - SRM AP Edition".',
    icon: Zap,
    glow: 'rgba(245, 158, 11, 0.2)'
  },
  {
    date: 'March 2026',
    title: 'QC² Quantum Computing Conclave',
    location: 'Research & Innovation Hack',
    description: 'Selected to participate in the prestigious QC² Quantum Computing Conclave hackathon, exploring quantum gates, superpositions, and molecular simulations.',
    icon: Compass,
    glow: 'rgba(var(--cyan-rgb), 0.2)'
  }
];

export default function InteractiveTimeline() {
  const containerRef = useRef(null);
  const lineProgressRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const items = el.querySelectorAll('.timeline-item');
      const lineProgress = lineProgressRef.current;

      // Timeline Line Progress drawing animation on scroll
      gsap.to(lineProgress, {
        height: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top 60%',
          end: 'bottom 60%',
          scrub: true,
        }
      });

      // Animate timeline nodes and cards entering viewport alternately
      items.forEach((item, idx) => {
        const node = item.querySelector('.timeline-node');
        const card = item.querySelector('.timeline-card');
        const isEven = idx % 2 === 0;

        gsap.fromTo(node, 
          { scale: 0, opacity: 0 },
          { 
            scale: 1, 
            opacity: 1, 
            duration: 0.5,
            scrollTrigger: {
              trigger: node,
              start: 'top 80%',
              toggleActions: 'play none none reverse'
            }
          }
        );

        gsap.fromTo(card,
          { x: isEven ? -200 : 200, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section id="timeline" ref={containerRef} className="relative w-full bg-transparent py-24 px-4 md:px-12 flex flex-col items-center">
      {/* Background radial soft light */}
      <div className="absolute top-1/4 left-[-10%] w-[500px] h-[500px] bg-cyan-500/35 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-[-10%] w-[500px] h-[500px] bg-fuchsia-500/35 rounded-full blur-[110px] pointer-events-none" />

      <div className="w-full max-w-4xl relative z-10">
        
        {/* Section Header */}
        <div className="text-left mb-20">
          <span className="font-mono text-cyan-400 text-xs font-bold tracking-widest uppercase mb-2 inline-flex items-center gap-2">
            // 04. CHRONOLOGY <span className="animate-twinkle-delay-2 text-cyan-300">✦</span>
          </span>
          <h2 className="font-pixel text-3xl sm:text-5xl md:text-6xl text-white mt-2 tracking-wide leading-tight">
            Academic & Project <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-fuchsia-500">Journey</span>
          </h2>
          <p className="font-serif italic text-base md:text-lg text-white/75 max-w-md mt-4 leading-relaxed tracking-wide">
            A linear progression of milestones, hackathons, and technical leaps as a Computer Science student at SRM University AP.
          </p>
        </div>

        {/* Timeline Core Structure */}
        <div className="relative pl-8 md:pl-16">
          
          {/* Timeline Center line backer (grey) */}
          <div className="absolute left-[15px] md:left-[31px] top-4 bottom-4 w-[2px] bg-white/10 rounded-full" />
          
          {/* Active growing line (Neon gradient fill on scroll) */}
          <div 
            ref={lineProgressRef}
            className="absolute left-[15px] md:left-[31px] top-4 w-[2px] bg-gradient-to-b from-cyan-400 to-fuchsia-500 rounded-full origin-top h-0"
            style={{ willChange: 'height' }}
          />

          {/* Timeline Nodes & Cards */}
          <div className="flex flex-col gap-16">
            {milestones.map((m, i) => {
              const IconComp = m.icon;
              return (
                <div key={i} className="timeline-item relative flex flex-col items-start text-left">
                  
                  {/* Glowing Node Dot */}
                  <div className="timeline-node absolute left-[-28px] md:left-[-44px] top-1.5 w-6 h-6 rounded-full bg-black border-2 border-cyan-400 flex items-center justify-center z-20 shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                    <div className="w-2 h-2 rounded-full bg-cyan-400" />
                  </div>

                  {/* Glass Card Container */}
                  <div className="timeline-card w-full bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(var(--cyan-rgb),0.3)] transition-all duration-500 relative group">
                    {/* Shadow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent rounded-3xl pointer-events-none" />

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      {/* Left: Date / Title */}
                      <div>
                        <span className="text-[10px] font-bold tracking-widest text-cyan-400 uppercase font-syne bg-cyan-400/10 border border-cyan-400/20 px-3 py-1 rounded-full">
                          {m.date}
                        </span>
                        <h3 className="font-syne font-bold text-xl md:text-2xl text-white mt-3 group-hover:text-cyan-400 transition-colors duration-300">
                          {m.title}
                        </h3>
                      </div>

                      {/* Right: Location & Icon */}
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-xs font-bold text-white/50 tracking-wider uppercase font-satoshi block">
                            {m.location}
                          </span>
                        </div>
                        <div 
                          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner text-white group-hover:text-fuchsia-400 transition-colors duration-300"
                          style={{ boxShadow: `inset 0 0 10px rgba(255,255,255,0.05)` }}
                        >
                          <IconComp size={18} />
                        </div>
                      </div>
                    </div>

                    {/* Milestone body text */}
                    <p className="font-satoshi text-sm md:text-base text-white/60 leading-relaxed">
                      {m.description}
                    </p>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
