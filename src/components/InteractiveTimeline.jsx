import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { GraduationCap, Code2, Award, Zap, Trophy, Glasses } from 'lucide-react';

const milestones = [
  {
    date: 'Late 2025',
    title: 'Commenced CS Degree (AI/ML)',
    location: 'SRM University AP',
    description: 'Enrolled in B.Tech Computer Science & Engineering, specializing in Artificial Intelligence and Machine Learning to build the foundation of algorithmic logic, neural computation, and software systems.',
    icon: GraduationCap,
    glow: 'rgba(var(--cyan-rgb), 0.2)'
  },
  {
    date: 'December 2025',
    title: 'Hack The Winter – The Second Wave (Angry Bird Edition)',
    location: 'Team Stark Industries',
    description: 'Led Team "Stark Industries" to build the VOCA platform. Focused on robust system design, architecture mapping, scalable database schemas, and strict Git workflows with feature branches and pull request code reviews.',
    icon: Code2,
    glow: 'rgba(var(--fuchsia-rgb), 0.2)'
  },
  {
    date: 'January 2026',
    title: 'First Semester Milestone',
    location: 'Academic Standing',
    description: 'Completed the initial university term with a strong academic foundation, achieving an 8.5 CGPA in core computer science and engineering coursework.',
    icon: Award,
    glow: 'rgba(16, 185, 129, 0.2)'
  },
  {
    date: 'February 2026',
    title: 'My1stHack 2025 & Hackathon Triple Launches',
    location: 'GFG SRM AP & HackSRM',
    description: 'Competed with Team Apex Coders at My1stHack 2025 focusing on live debugging and building software architecture from scratch. Engineered the CampusX AI consensus engine and deployed SafeEcho for Code to Connect.',
    icon: Zap,
    glow: 'rgba(245, 158, 11, 0.2)'
  },
  {
    date: 'March 2026',
    title: 'Adobe University Hackathon & QuizOff 2026',
    location: 'Adobe, Unstop & CampusCrew',
    description: 'Competed in the Adobe University Hackathon (Adobe & Unstop) with a focus on rapid prototyping, real-time problem solving, and cross-functional teamwork. Competed in QuizOff 2026 (India\'s Biggest AI Quiz) alongside 5.25L+ students globally.',
    icon: Trophy,
    glow: 'rgba(var(--fuchsia-rgb), 0.2)'
  },
  {
    date: 'April 2026',
    title: 'YISL AR/VR Innovation Workshop & QC²',
    location: 'Young Innovators STEM Lab & X-Lab',
    description: 'Hands-on spatial computing experience at Young Innovators STEM Lab (YISL) building VR applications, exploring WebXR technologies, and live testing on Meta Quest headsets at the X-Lab Auditorium. Selected for QC² Quantum Conclave.',
    icon: Glasses,
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
          start: 'top 75%',
          end: 'bottom 85%',
          scrub: 0.3,
        }
      });

      // Animate timeline nodes and cards entering viewport quickly and smoothly
      items.forEach((item) => {
        const node = item.querySelector('.timeline-node');
        const card = item.querySelector('.timeline-card');

        gsap.fromTo(node, 
          { scale: 0, opacity: 0 },
          { 
            scale: 1, 
            opacity: 1, 
            duration: 0.35,
            ease: 'back.out(1.8)',
            scrollTrigger: {
              trigger: item,
              start: 'top 90%',
              toggleActions: 'play none none none'
            }
          }
        );

        gsap.fromTo(card,
          {
            x: 40,
            rotateY: -15,
            rotateX: 10,
            scale: 0.92,
            opacity: 0,
            filter: 'blur(10px)',
            transformOrigin: 'left center'
          },
          {
            x: 0,
            rotateY: 0,
            rotateX: 0,
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.85,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 88%',
              toggleActions: 'play none none none'
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
            className="absolute left-[15px] md:left-[31px] top-4 w-[2px] bg-gradient-to-b from-cyan-400 via-fuchsia-400 to-cyan-300 rounded-full origin-top h-0 z-10"
            style={{ willChange: 'height' }}
          >
            {/* Glowing Laser Head Tracker */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(var(--cyan-rgb),1),0_0_24px_rgba(var(--cyan-rgb),0.8)] animate-pulse" />
          </div>

          {/* Timeline Nodes & Cards */}
          <div className="flex flex-col gap-16">
            {milestones.map((m, i) => {
              const IconComp = m.icon;
              return (
                <div key={i} className="timeline-item relative flex flex-col items-start text-left">
                  
                  {/* Glowing Node Dot */}
                  <div className="timeline-node absolute left-[-28px] md:left-[-44px] top-1.5 w-6 h-6 rounded-full bg-black border-2 border-cyan-400 flex items-center justify-center z-20 shadow-[0_0_12px_rgba(34,211,238,0.6)] group-hover:scale-110 transition-transform duration-300">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  </div>

                  {/* Glass Card Container */}
                  <div
                    data-cursor="TIMELINE"
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      e.currentTarget.style.setProperty('--card-x', `${e.clientX - rect.left}px`);
                      e.currentTarget.style.setProperty('--card-y', `${e.clientY - rect.top}px`);
                    }}
                    className="timeline-card w-full bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 hover:border-cyan-400/50 hover:-translate-y-1.5 hover:shadow-[0_12px_36px_rgba(var(--cyan-rgb),0.25)] transition-all duration-300 relative group overflow-hidden"
                  >
                    {/* Dynamic spotlight cursor tracking gradient */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{
                        background: `radial-gradient(350px circle at var(--card-x, 50%) var(--card-y, 50%), ${m.glow}, transparent 65%)`
                      }}
                    />

                    {/* Top ambient hairline border glow */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
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
                          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner text-white group-hover:text-fuchsia-400 group-hover:border-fuchsia-400/30 transition-all duration-300"
                          style={{ boxShadow: `inset 0 0 10px rgba(255,255,255,0.05)` }}
                        >
                          <IconComp size={18} />
                        </div>
                      </div>
                    </div>

                    {/* Milestone body text */}
                    <p className="relative z-10 font-satoshi text-sm md:text-base text-white/60 leading-relaxed">
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
