import { useRef } from 'react';
import { ArrowUp } from 'lucide-react';

export default function Footer() {
  const textRef = useRef(null);

  const handleMouseMove = (e) => {
    const el = textRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--text-mouse-x', `${x}px`);
    el.style.setProperty('--text-mouse-y', `${y}px`);
  };
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      if (window.lenis) {
        window.lenis.scrollTo(el);
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const scrollToTop = () => {
    if (window.lenis) {
      window.lenis.scrollTo(0);
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer className="relative w-full bg-transparent border-t border-white/5 pt-20 pb-10 px-6 md:px-12 flex flex-col items-center z-10 select-text">
      <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-start gap-12 pb-12 border-b border-white/5">
        
        {/* Left Column: Branding */}
        <div className="text-left max-w-sm">
          <div className="font-pixel text-xl sm:text-2xl font-bold tracking-wider uppercase mb-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-fuchsia-500">Shaik Hasnain.</span>
          </div>
          <p className="font-serif italic text-base text-white/60 leading-relaxed font-light">
            AI/ML CS scholar at SRM University AP. Architecting intelligent consensus software engines and fluid 3D game simulations.
          </p>
        </div>

        {/* Center Column: Quick Navigation Links */}
        <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 text-left">
          <div className="flex flex-col gap-3">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-cyan-400">NAVIGATION</span>
            <button
              onClick={() => scrollToSection('about')}
              className="font-satoshi text-sm text-white/60 hover:text-white transition-colors duration-300 w-fit cursor-pointer text-left"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('skills')}
              className="font-satoshi text-sm text-white/60 hover:text-white transition-colors duration-300 w-fit cursor-pointer text-left"
            >
              Skills
            </button>
            <button
              onClick={() => scrollToSection('projects')}
              className="font-satoshi text-sm text-white/60 hover:text-white transition-colors duration-300 w-fit cursor-pointer text-left"
            >
              Projects
            </button>
            <button
              onClick={() => scrollToSection('timeline')}
              className="font-satoshi text-sm text-white/60 hover:text-white transition-colors duration-300 w-fit cursor-pointer text-left"
            >
              Timeline
            </button>
          </div>

          {/* Socials Connection */}
          <div className="flex flex-col gap-3">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-fuchsia-400">SOCIALS</span>
            <a
              href="https://linkedin.com/in/shaik-hasnain-55a072396"
              target="_blank"
              rel="noopener noreferrer"
              className="font-satoshi text-sm text-white/60 hover:text-white transition-colors duration-300"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/ShaikHasnain-2007"
              target="_blank"
              rel="noopener noreferrer"
              className="font-satoshi text-sm text-white/60 hover:text-white transition-colors duration-300"
            >
              GitHub
            </a>
            <a
              href="https://www.instagram.com/shaik_hasnain99"
              target="_blank"
              rel="noopener noreferrer"
              className="font-satoshi text-sm text-white/60 hover:text-white transition-colors duration-300"
            >
              Instagram
            </a>
          </div>
        </div>

        {/* Right Column: Scroll To Top button */}
        <div className="self-end md:self-start">
          <button
            onClick={scrollToTop}
            className="group flex items-center gap-2 font-mono text-xs uppercase font-bold tracking-widest text-white/50 hover:text-cyan-400 transition-colors duration-300"
          >
            <span>Back To Top</span>
            <div className="p-2.5 bg-white/5 border border-white/10 group-hover:border-cyan-400/40 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-105">
              <ArrowUp size={14} className="group-hover:-translate-y-0.5 transition-transform text-cyan-400" />
            </div>
          </button>
        </div>

      </div>

      {/* Large Typographic Display Word */}
      <div 
        ref={textRef}
        onMouseMove={handleMouseMove}
        className="w-full flex justify-center items-center mt-12 mb-6 select-none overflow-hidden cursor-default"
      >
        <div className="font-syne font-black text-[11.5vw] leading-none tracking-tight text-white/[0.04] uppercase spotlight-text text-center w-full mx-auto">
          HASNAIN
        </div>
      </div>

      {/* Bottom Sub-bar: Copyright and Tech tag */}
      <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left mt-6">
        <p className="font-satoshi text-xs text-white/40">
          &copy; {new Date().getFullYear()} Shaik Hasnain. All rights reserved. Deployed to production.
        </p>

        {/* Crafted with line */}
        <div className="flex flex-wrap justify-center md:justify-end gap-1.5 font-syne text-[9px] font-bold tracking-widest text-white/30 uppercase">
          <span>React</span>
          <span>•</span>
          <span>GSAP</span>
          <span>•</span>
          <span>Tailwind</span>
          <span>•</span>
          <span>Lenis Smooth Scroll</span>
          <span>•</span>
          <span>Firebase Hosting</span>
        </div>
      </div>
    </footer>
  );
}
