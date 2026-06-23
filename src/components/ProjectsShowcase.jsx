import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Cpu, Gamepad2, HeartHandshake, Award } from 'lucide-react';
import { gsap } from 'gsap';

const projects = [
  {
    title: 'CampusX',
    description: 'An advanced AI consensus engine engineered to evaluate, aggregate, and rank multiple LLM outputs dynamically. Built during the HackSRM hackathon.',
    tech: ['AI/ML', 'Python', 'LLM Consensus', 'React', 'Next.js'],
    github: 'https://github.com/ShaikHasnain-2007/CampusX',
    icon: Cpu,
    gradient: 'from-cyan-500/20 to-blue-500/20',
    borderColor: 'group-hover:border-cyan-400/50',
    glowColor: 'rgba(var(--cyan-rgb), 0.15)',
    bannerText: 'AI Consensus Engine'
  },
  {
    title: 'Unity Zombie Apocalypse FPS',
    description: 'A high-octane 3D first-person shooter game featuring intelligent zombie AI behavior states, pathfinding systems, and physics-based player movement dynamics.',
    tech: ['Unity Engine', 'C#', 'AI Pathfinding', '3D Graphics'],
    github: 'https://github.com/ShaikHasnain-2007/Zombie-FPS-Unity',
    icon: Gamepad2,
    gradient: 'from-fuchsia-500/20 to-purple-500/20',
    borderColor: 'group-hover:border-fuchsia-400/50',
    glowColor: 'rgba(var(--fuchsia-rgb), 0.15)',
    bannerText: '3D Physics FPS Game'
  },
  {
    title: 'SafeEcho',
    description: 'A specialized mental health web application engineered for the Code to Connect hackathon. Tailored around emotional intelligence, analysis, and responsive support.',
    tech: ['React.js', 'Tailwind CSS', 'Sentiment Logic', 'Framer Motion'],
    github: 'https://github.com/ShaikHasnain-2007/SafeEcho',
    icon: HeartHandshake,
    gradient: 'from-emerald-500/20 to-teal-500/20',
    borderColor: 'group-hover:border-emerald-400/50',
    glowColor: 'rgba(16, 185, 129, 0.15)',
    bannerText: 'Interactive Support Platform'
  },
  {
    title: 'Flappy Bhai - SRM AP Edition',
    description: 'A customized, high-contrast web game designed around the SRM University AP ecosystem, integrated with Firebase Realtime Database for cross-device high score tracking.',
    tech: ['Web Dev', 'Firebase DB', 'Game Physics', 'Realtime Sync'],
    github: 'https://github.com/ShaikHasnain-2007/Flappy-Bhai',
    icon: Award,
    gradient: 'from-amber-500/20 to-orange-500/20',
    borderColor: 'group-hover:border-amber-400/50',
    glowColor: 'rgba(245, 158, 11, 0.15)',
    bannerText: 'Firebase High-Score Game'
  }
];

function ProjectCard({ project }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    // Disable 3D tilt on touch devices to avoid page jitter/stuck states
    const isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    if (isTouch) return;

    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6; // Max 6deg tilt
    const rotateY = ((x - centerX) / centerX) * 6;

    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  const IconComp = project.icon;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative border border-white/10 rounded-3xl bg-white/[0.03] backdrop-blur-xl p-5 md:p-7 flex flex-col justify-between overflow-hidden transition-all duration-300 spotlight-card h-full"
      style={{
        boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.37)`,
      }}
    >
      {/* Glow Backing Effect */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(400px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), ${project.glowColor}, transparent 50%)`
        }}
      />

      <div className="flex flex-col flex-grow">
        {/* Dynamic Abstract Tech Banner */}
        <div className={`relative w-full h-24 md:h-32 rounded-2xl bg-gradient-to-br ${project.gradient} border border-white/5 overflow-hidden flex items-center justify-center mb-4 shrink-0`}>
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          <IconComp className="w-12 h-12 md:w-16 md:h-16 text-white/80 group-hover:scale-110 transition-transform duration-500 relative z-10" />
          <span className="absolute bottom-2.5 left-3 text-[9px] font-bold tracking-widest uppercase text-white/60">
            {project.bannerText}
          </span>
        </div>

        {/* Project Meta */}
        <span className="text-cyan-400 text-[10px] font-bold tracking-widest uppercase font-satoshi">PROJECT</span>
        <h3 className="font-syne font-bold text-xl md:text-2xl text-white mt-0.5 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-fuchsia-500 transition-all duration-300">
          {project.title}
        </h3>
        <p className="font-satoshi text-xs md:text-sm text-white/60 leading-relaxed mb-4 line-clamp-3 md:line-clamp-4">
          {project.description}
        </p>
      </div>

      <div className="shrink-0">
        {/* Tech Badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tech.map((t, i) => (
            <span
              key={i}
              className="text-[9px] font-bold font-syne text-white/80 bg-white/5 border border-white/10 rounded-full px-2.5 py-0.5 uppercase tracking-wider"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-4 pt-3 border-t border-white/5">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white/70 hover:text-cyan-400 font-bold font-syne text-[10px] uppercase tracking-widest transition-colors duration-300"
          >
            <Github size={12} />
            <span>Repository</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsShowcase() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    // Calculate translation distance on trigger match
    const getTranslateX = () => {
      const trackWidth = track.scrollWidth;
      const viewportWidth = window.innerWidth;
      return -(trackWidth - viewportWidth);
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: () => "+=" + (track.scrollWidth - window.innerWidth),
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      }
    });

    tl.to(track, {
      x: getTranslateX,
      ease: 'none'
    });

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, []);

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative w-full h-screen bg-transparent overflow-hidden"
    >
      {/* Viewport frame - pinned by GSAP */}
      <div className="h-full w-full overflow-hidden flex flex-col justify-center bg-transparent">
        {/* Background neon orb glows */}
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/2 left-2/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-fuchsia-500/5 rounded-full blur-[140px] pointer-events-none" />

        {/* Outer content container flow */}
        <div className="w-full flex flex-col justify-between h-full py-12 md:py-16 relative z-10">
          
          {/* Header block (fixed top) */}
          <div className="w-full px-6 md:px-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="text-left">
              <span className="text-fuchsia-500 text-xs font-bold tracking-widest uppercase font-satoshi">SHOWCASE</span>
              <h2 className="font-syne font-extrabold text-4xl md:text-6xl text-white mt-1">
                Selected <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">Creations</span>
              </h2>
            </div>
            <p className="font-satoshi text-xs md:text-sm text-white/50 max-w-md leading-relaxed text-left">
              A selective snapshot of products built during hackathons, academic terms, and nights dedicated to building smart interfaces and virtual simulations.
            </p>
          </div>

          {/* Horizontal Track Area */}
          <div className="relative w-full flex-grow flex items-center overflow-hidden my-6">
            <div
              ref={trackRef}
              className="flex gap-6 md:gap-10 px-6 md:px-16 items-stretch"
              style={{ width: 'max-content' }}
            >
              {projects.map((proj, idx) => (
                <div
                  key={idx}
                  className="project-card-wrapper w-[85vw] sm:w-[420px] md:w-[480px] flex-shrink-0 h-[52vh] min-h-[420px] max-h-[500px]"
                >
                  <ProjectCard project={proj} />
                </div>
              ))}
            </div>
          </div>

          {/* Bottom stats indicators */}
          <div className="w-full px-6 md:px-16 flex justify-between items-center text-white/30 text-[10px] font-bold font-syne tracking-widest uppercase">
            <span>Scroll to explore projects</span>
            <div className="flex gap-2 items-center">
              <span>01</span>
              <div className="w-12 h-px bg-white/10" />
              <span>04</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
