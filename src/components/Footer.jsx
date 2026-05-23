import React from 'react';
import { Linkedin, Github, Instagram, Mail, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="relative w-full bg-black border-t border-white/5 pt-20 pb-10 px-6 md:px-12 flex flex-col items-center z-10 select-text">
      <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-start gap-12 pb-12 border-b border-white/5">
        
        {/* Left Column: Branding */}
        <div className="text-left max-w-sm">
          <div className="font-syne text-xl font-bold tracking-tight uppercase mb-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">Shaik Hasnain.</span>
          </div>
          <p className="font-satoshi text-sm text-white/50 leading-relaxed">
            AI/ML CS student at SRM University AP. Engineering intelligent consensus software interfaces and fluid 3D game engines.
          </p>
        </div>

        {/* Center Column: Quick Navigation Links */}
        <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 text-left">
          <div className="flex flex-col gap-3">
            <span className="font-syne text-[10px] font-bold uppercase tracking-widest text-cyan-400">NAVIGATION</span>
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
            <span className="font-syne text-[10px] font-bold uppercase tracking-widest text-fuchsia-500">SOCIALS</span>
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
              href="https://www.instagram.com/shaik_hasnain99?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
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
            className="group flex items-center gap-2 font-syne text-xs uppercase font-bold tracking-widest text-white/50 hover:text-cyan-400 transition-colors duration-300"
          >
            <span>Back To Top</span>
            <div className="p-2.5 bg-white/5 border border-white/10 group-hover:border-cyan-400/40 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-105">
              <ArrowUp size={14} className="group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </button>
        </div>

      </div>

      {/* Large Typographic Display Word */}
      <div className="w-full text-center mt-12 mb-6 select-none overflow-hidden pointer-events-none">
        <h1 className="font-syne font-black text-[12vw] leading-none tracking-tighter text-white/[0.03] uppercase">
          HASNAIN.
        </h1>
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
