import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const skillCategories = [
  { id: 'all', name: 'All Skills' },
  { id: 'ai-ml', name: 'AI / Machine Learning' },
  { id: 'game-dev', name: 'Game Development' },
  { id: 'web-dev', name: 'Web Engineering' },
  { id: 'core', name: 'Systems & Languages' }
];

const SKILLS_DATA = [
  // AI / Machine Learning
  {
    name: 'Python',
    category: 'AI / ML',
    type: 'ai-ml',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',
    glow: 'rgba(56, 189, 248, 0.35)',
  },
  {
    name: 'PyTorch',
    category: 'Deep Learning',
    type: 'ai-ml',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pytorch/pytorch-original.svg',
    glow: 'rgba(238, 76, 44, 0.35)',
  },
  {
    name: 'Hugging Face',
    category: 'Transformers',
    type: 'ai-ml',
    icon: '/huggingface-color.webp',
    glow: 'rgba(255, 210, 30, 0.35)',
  },
  {
    name: 'Ollama',
    category: 'Local LLMs',
    type: 'ai-ml',
    icon: '/ollama-icon.webp',
    extraClass: 'invert brightness-[5]',
    glow: 'rgba(255, 255, 255, 0.35)',
  },
  {
    name: 'Groq API',
    category: 'LPU Inference',
    type: 'ai-ml',
    icon: '/groq_logo.webp',
    glow: 'rgba(249, 115, 22, 0.35)',
  },
  {
    name: 'FastAPI',
    category: 'AI Backend',
    type: 'ai-ml',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg',
    glow: 'rgba(0, 150, 136, 0.35)',
  },

  // Game Development & Spatial Computing
  {
    name: 'Unity Engine',
    category: 'Game Engine',
    type: 'game-dev',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/unity/unity-original.svg',
    extraClass: 'invert',
    glow: 'rgba(217, 70, 239, 0.35)',
  },
  {
    name: 'C#',
    category: 'Game Logic',
    type: 'game-dev',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg',
    glow: 'rgba(155, 79, 150, 0.35)',
  },
  {
    name: 'AR/VR & WebXR',
    category: 'WebXR / Meta Quest',
    type: 'game-dev',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/threejs/threejs-original.svg',
    extraClass: 'invert',
    glow: 'rgba(217, 70, 239, 0.35)',
  },
  {
    name: 'Spatial Computing',
    category: '3D Virtual Spaces',
    type: 'game-dev',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/unity/unity-original.svg',
    extraClass: 'invert',
    glow: 'rgba(56, 189, 248, 0.35)',
  },
  {
    name: 'Unreal Engine',
    category: '3D Graphics',
    type: 'game-dev',
    icon: '/unrealengine.svg',
    extraClass: 'invert',
    glow: 'rgba(255, 255, 255, 0.35)',
  },
  {
    name: '3D Physics',
    category: 'Simulation',
    type: 'game-dev',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/threejs/threejs-original.svg',
    extraClass: 'invert',
    glow: 'rgba(56, 189, 248, 0.35)',
  },

  // Web Engineering
  {
    name: 'React',
    category: 'Frontend',
    type: 'web-dev',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
    glow: 'rgba(97, 218, 251, 0.35)',
  },
  {
    name: 'Next.js',
    category: 'Full Stack',
    type: 'web-dev',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg',
    extraClass: 'bg-white rounded-full p-0.5',
    glow: 'rgba(255, 255, 255, 0.35)',
  },
  {
    name: 'TypeScript',
    category: 'Language',
    type: 'web-dev',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg',
    glow: 'rgba(49, 120, 198, 0.35)',
  },
  {
    name: 'Tailwind CSS',
    category: 'Framework',
    type: 'web-dev',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg',
    glow: 'rgba(56, 189, 248, 0.35)',
  },
  {
    name: 'Node.js',
    category: 'Backend',
    type: 'web-dev',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg',
    glow: 'rgba(104, 160, 99, 0.35)',
  },
  {
    name: 'Firebase',
    category: 'Cloud / DB',
    type: 'web-dev',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg',
    glow: 'rgba(255, 202, 40, 0.35)',
  },
  {
    name: 'Vite',
    category: 'Build Engine',
    type: 'web-dev',
    icon: '/vite.svg',
    glow: 'rgba(189, 52, 254, 0.35)',
  },
  {
    name: 'Framer Motion',
    category: 'Animation',
    type: 'web-dev',
    icon: '/framer_logo_icon_169149.webp',
    glow: 'rgba(217, 70, 239, 0.35)',
  },

  // Systems & Languages
  {
    name: 'Cybersecurity',
    category: 'InfoSec & Audit',
    type: 'core',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/oauth/oauth-original.svg',
    glow: 'rgba(59, 130, 246, 0.35)',
  },
  {
    name: 'System Design',
    category: 'Scalable Architecture',
    type: 'core',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kubernetes/kubernetes-plain.svg',
    glow: 'rgba(249, 115, 22, 0.35)',
  },
  {
    name: 'C++',
    category: 'Language',
    type: 'core',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg',
    glow: 'rgba(0, 89, 156, 0.35)',
  },
  {
    name: 'Java',
    category: 'OOP Structure',
    type: 'core',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg',
    glow: 'rgba(234, 45, 46, 0.35)',
  },
  {
    name: 'PostgreSQL',
    category: 'Database',
    type: 'core',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg',
    glow: 'rgba(51, 103, 145, 0.35)',
  },
  {
    name: 'Docker',
    category: 'DevOps',
    type: 'core',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg',
    glow: 'rgba(36, 150, 237, 0.35)',
  },
  {
    name: 'Git & GitHub',
    category: 'Tools',
    type: 'core',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg',
    glow: 'rgba(240, 80, 50, 0.35)',
  },
  {
    name: 'Linux',
    category: 'OS / CLI',
    type: 'core',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg',
    glow: 'rgba(255, 214, 0, 0.35)',
  },
];

export default function SkillsSection() {
  const [activeTab, setActiveTab] = useState('all');
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const el = containerRef.current;
      if (!el) return;

      const header = el.querySelector('.section-header');
      const tabs = el.querySelector('.category-tabs');
      const grid = el.querySelector('.skills-grid');

      if (!header || !tabs || !grid) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          end: 'top 50%',
          scrub: 1,
          invalidateOnRefresh: true,
        }
      });

      tl.fromTo(header, 
        { x: -120, opacity: 0 }, 
        { x: 0, opacity: 1, ease: 'power2.out' },
        0
      );

      tl.fromTo(tabs, 
        { x: 120, opacity: 0 }, 
        { x: 0, opacity: 1, ease: 'power2.out' },
        0.1
      );

      tl.fromTo(grid, 
        { y: 80, opacity: 0, scale: 0.96 }, 
        { y: 0, opacity: 1, scale: 1, ease: 'power2.out' },
        0.2
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Recalculate GSAP ScrollTrigger positions when skills filter changes section height
  useEffect(() => {
    const t1 = setTimeout(() => ScrollTrigger.refresh(), 50);
    const t2 = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [activeTab]);

  const activeSkills = activeTab === 'all' 
    ? SKILLS_DATA 
    : SKILLS_DATA.filter(s => s.type === activeTab);

  return (
    <section id="skills" ref={containerRef} className="relative w-full bg-transparent py-20 px-4 md:px-12 flex flex-col items-center">
      <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] bg-fuchsia-500/30 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-[-10%] w-[600px] h-[600px] bg-cyan-500/30 rounded-full blur-[140px] pointer-events-none" />

      <div className="absolute right-12 top-10 font-syne font-black text-[120px] leading-none text-white/[0.02] select-none pointer-events-none">
        02
      </div>

      <div className="w-full max-w-7xl relative z-10">
        {/* Header */}
        <div className="section-header text-left mb-12">
          <span className="font-mono text-cyan-400 text-xs font-bold tracking-widest uppercase mb-2 inline-flex items-center gap-2">
            // 02. COMPETENCIES <span className="animate-twinkle text-cyan-300">✦</span>
          </span>
          <h2 className="font-pixel text-3xl sm:text-5xl md:text-6xl text-white mt-2 tracking-wide leading-tight">
            Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-fuchsia-500">Arsenal</span>
          </h2>
          <p className="font-serif italic text-base md:text-lg text-white/75 max-w-xl mt-3 leading-relaxed tracking-wide">
            Technologies and frameworks I leverage to engineer smart applications and interactive graphics simulations.
          </p>
        </div>

        {/* Category Tabs */}
        <div role="tablist" aria-label="Skill Categories" className="category-tabs flex flex-wrap gap-2 mb-10 pb-2 border-b border-white/5 text-left">
          {skillCategories.map((cat) => {
            const isActive = cat.id === activeTab;
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isActive}
                aria-controls="skills-panel"
                id={`tab-${cat.id}`}
                onClick={() => setActiveTab(cat.id)}
                className={`font-syne text-xs uppercase tracking-widest px-5 py-2.5 rounded-full border transition-all duration-300 relative ${
                  isActive 
                    ? 'border-cyan-400/50 text-white bg-cyan-500/10 font-bold shadow-[0_0_25px_rgba(var(--cyan-rgb),0.4)]' 
                    : 'border-white/5 text-white/40 hover:text-white hover:border-white/20 bg-transparent'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Skills Cards Grid */}
        <div 
          id="skills-panel" 
          role="tabpanel" 
          aria-labelledby={`tab-${activeTab}`} 
          className="skills-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3.5 w-full items-start"
        >
          <AnimatePresence>
            {activeSkills.map((skill) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 15 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                key={skill.name}
                className="group relative h-[105px] sm:h-[116px] p-3 sm:p-3.5 rounded-2xl border border-white/10 bg-black/50 hover:bg-white/[0.05] hover:border-cyan-400/40 transition-all duration-300 cursor-default flex flex-col items-center justify-center gap-2 text-center select-none shadow-[0_4px_16px_rgba(0,0,0,0.4)] hover:-translate-y-1"
              >
                {/* Radial Glow on Hover */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                  style={{
                    background: `radial-gradient(130px circle at 50% 40%, ${skill.glow}, transparent 70%)`
                  }}
                />

                {/* Skill Logo */}
                <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center relative z-10 transition-transform duration-300 group-hover:scale-110">
                  <img
                    src={skill.icon}
                    alt={`${skill.name} logo`}
                    className={`w-7 h-7 sm:w-8 sm:h-8 object-contain drop-shadow-md ${skill.extraClass || ''}`}
                    loading="lazy"
                  />
                </div>

                {/* Skill Name & Category Sub-label */}
                <div className="flex flex-col items-center relative z-10">
                  <span className="font-syne font-bold text-xs sm:text-[13px] text-white/95 group-hover:text-white transition-colors duration-300 leading-tight">
                    {skill.name}
                  </span>
                  <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-widest text-white/40 group-hover:text-cyan-300 transition-colors mt-0.5 leading-none">
                    {skill.category}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
