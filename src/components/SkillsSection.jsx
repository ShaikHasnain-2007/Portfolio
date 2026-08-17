import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';

const skillCategories = [
  {
    id: 'all',
    name: 'All Skills',
  },
  {
    id: 'ai-ml',
    name: 'AI / Machine Learning',
    color: 'cyan',
    skills: ['Python', 'LLM Integration', 'Consensus Engines', 'Groq API', 'Hugging Face', 'Ollama', 'Prompt Engineering']
  },
  {
    id: 'game-dev',
    name: 'Game Development',
    color: 'fuchsia',
    skills: ['Unity Engine', 'C#', 'AI Pathfinding', '3D Physics', 'Unreal Engine', 'Game Mechanics']
  },
  {
    id: 'web-dev',
    name: 'Web Engineering',
    color: 'cyan',
    skills: ['React.js', 'Next.js', 'Vite', 'GSAP', 'Framer Motion', 'Tailwind CSS', 'Firebase DB', 'HTML5/CSS3']
  },
  {
    id: 'core',
    name: 'Systems & Languages',
    color: 'fuchsia',
    skills: ['C++', 'Java', 'SQL', 'Git/GitHub', 'Algorithms', 'OOP Structure']
  }
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
      const cloud = el.querySelector('.skills-cloud');

      if (!header || !tabs || !cloud) return;

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
        { x: -150, opacity: 0 }, 
        { x: 0, opacity: 1, ease: 'power2.out' },
        0
      );

      tl.fromTo(tabs, 
        { x: 150, opacity: 0 }, 
        { x: 0, opacity: 1, ease: 'power2.out' },
        0.1
      );

      tl.fromTo(cloud, 
        { y: 100, opacity: 0, scale: 0.95 }, 
        { y: 0, opacity: 1, scale: 1, ease: 'power2.out' },
        0.2
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const getActiveSkills = () => {
    if (activeTab === 'all') {
      const all = [];
      skillCategories.forEach(cat => {
        if (cat.skills) {
          cat.skills.forEach(skill => {
            if (!all.find(s => s.name === skill)) {
              all.push({
                name: skill,
                color: cat.color || 'cyan'
              });
            }
          });
        }
      });
      return all;
    }

    const matched = skillCategories.find(c => c.id === activeTab);
    return matched ? matched.skills.map(s => ({ name: s, color: matched.color })) : [];
  };

  const activeSkills = getActiveSkills();

  return (
    <section id="skills" ref={containerRef} className="relative w-full bg-transparent py-20 px-4 md:px-12 flex flex-col items-center">
      <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] bg-fuchsia-500/35 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-[-10%] w-[600px] h-[600px] bg-cyan-500/35 rounded-full blur-[130px] pointer-events-none" />

      <div className="absolute right-12 top-10 font-syne font-black text-[120px] leading-none text-white/[0.02] select-none pointer-events-none">
        02
      </div>

      <div className="w-full max-w-7xl relative z-10">
        <div className="section-header text-left mb-12">
          <span className="text-cyan-400 text-xs font-bold tracking-widest uppercase font-satoshi">COMPETENCIES</span>
          <h2 className="font-syne font-extrabold text-4xl md:text-6xl text-white mt-2">
            Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">Arsenal</span>
          </h2>
          <p className="font-satoshi text-sm md:text-base text-white/50 max-w-lg mt-4 leading-relaxed">
            A comprehensive breakdown of frameworks, engines, and architectural methods I leverage to engineer smart applications and interactive experiences.
          </p>
        </div>

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
                  ? 'border-cyan-400/50 text-white bg-cyan-500/5 font-bold shadow-[0_0_25px_rgba(var(--cyan-rgb),0.4)]' 
                  : 'border-white/5 text-white/40 hover:text-white hover:border-white/20 bg-transparent'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      <div 
        id="skills-panel" 
        role="tabpanel" 
        aria-labelledby={`tab-${activeTab}`} 
        className="skills-cloud flex flex-wrap gap-4 justify-start items-start w-full min-h-[180px]"
      >
        <AnimatePresence>
          {activeSkills.map((skill) => {
            const borderGlowClass = 
              skill.color === 'cyan' 
                ? 'hover:border-cyan-400/50 hover:shadow-[0_0_25px_rgba(var(--cyan-rgb),0.4)] hover:text-cyan-400' 
                : 'hover:border-fuchsia-400/50 hover:shadow-[0_0_25px_rgba(var(--fuchsia-rgb),0.4)] hover:text-fuchsia-400';

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  key={skill.name}
                  className={`skill-pill px-6 py-4 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-xl font-syne text-sm md:text-base font-semibold text-white/80 transition-all duration-300 cursor-default select-none ${borderGlowClass}`}
                >
                  <span className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      skill.color === 'cyan' ? 'bg-cyan-400' : 'bg-fuchsia-500'
                    }`} />
                    {skill.name}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
