import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { label: 'About', target: 'about' },
  { label: 'Skills', target: 'skills' },
  { label: 'Projects', target: 'projects' },
  { label: 'Timeline', target: 'timeline' }
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const lastScrollYRef = useRef(0);
  const [theme, setTheme] = useState('cyberpunk');

  // Load theme state and initial scroll state on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('portfolio-theme') || 'cyberpunk';
    setTheme(savedTheme);

    const initialScrollY = window.scrollY;
    setIsScrolled(initialScrollY > 50);
    setIsVisible(initialScrollY > 50);
  }, []);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Monitor scroll for navbar visibility (hide on scroll down, show on scroll up) and bg changes
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Add background blur/fill if scrolled
      setIsScrolled(currentScrollY > 50);

      // Hide/Show logic
      if (currentScrollY < 50) {
        setIsVisible(false); // Hide at top of screen to prevent overlap with contact links
      } else if (currentScrollY > lastScrollYRef.current && currentScrollY > 100) {
        setIsVisible(false); // Scrolling down
      } else {
        setIsVisible(true); // Scrolling up
      }
      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Use IntersectionObserver to detect active section in viewport
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -40% 0px', // Trigger when section occupies center of viewport
      threshold: 0.1
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    // Watch sections
    const sections = ['about', 'skills', 'projects', 'timeline'];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // Also watch hero/top
    const heroEl = document.querySelector('section'); // First section on page is hero
    if (heroEl) observer.observe(heroEl);

    return () => observer.disconnect();
  }, []);

  const handleNavClick = (targetId) => {
    setIsMobileMenuOpen(false);
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      if (window.lenis) {
        window.lenis.scrollTo(targetEl);
      } else {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -15, scale: 0.9, x: '-50%', opacity: 0 }}
        animate={{ 
          y: isVisible ? 0 : -15,
          scale: isVisible ? 1 : 0.9,
          x: '-50%',
          opacity: isVisible ? 1 : 0 
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: 'center' }}
        className={`fixed top-4 left-1/2 z-[100] w-[92%] max-w-5xl rounded-full border border-white/5 bg-black/40 backdrop-blur-md transition-all duration-300 ${
          isScrolled ? 'shadow-[0_10px_30px_rgba(0,0,0,0.8)] border-white/10 bg-black/80' : ''
        } ${isVisible ? 'pointer-events-auto' : 'pointer-events-none'}`}
      >
        <div className="flex h-16 items-center justify-between px-6 md:px-8">
          
          {/* Logo / Brand */}
          <button 
            onClick={() => handleNavClick('about')}
            className="font-syne text-sm font-extrabold tracking-widest uppercase cursor-pointer text-left text-white hover:opacity-80 transition-opacity"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">SHAIK.</span>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.target;
              return (
                <button
                  key={item.target}
                  onClick={() => handleNavClick(item.target)}
                  className={`font-syne text-xs uppercase tracking-widest transition-all duration-300 relative py-1 cursor-pointer ${
                    isActive ? 'text-cyan-400 font-bold' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-cyan-400 to-fuchsia-500 rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* CTA Contact Button + Theme Selector (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {/* Minimal Accent Theme Switcher */}
            <div className="flex items-center gap-2 border border-white/5 bg-white/[0.02] backdrop-blur-md rounded-full px-3 py-1.5">
              <button
                onClick={() => changeTheme('cyberpunk')}
                className={`w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-cyan-400 to-fuchsia-500 relative transition-transform duration-300 hover:scale-125 cursor-pointer ${
                  theme === 'cyberpunk' ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : 'opacity-60 hover:opacity-100'
                }`}
                title="Cyberpunk Theme"
                aria-label="Switch to Cyberpunk theme"
              />
              <button
                onClick={() => changeTheme('sunset')}
                className={`w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 relative transition-transform duration-300 hover:scale-125 cursor-pointer ${
                  theme === 'sunset' ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : 'opacity-60 hover:opacity-100'
                }`}
                title="Sunset Theme"
                aria-label="Switch to Sunset theme"
              />
              <button
                onClick={() => changeTheme('matrix')}
                className={`w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-green-400 to-lime-500 relative transition-transform duration-300 hover:scale-125 cursor-pointer ${
                  theme === 'matrix' ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : 'opacity-60 hover:opacity-100'
                }`}
                title="Matrix Theme"
                aria-label="Switch to Matrix theme"
              />
            </div>

            <button
              onClick={() => handleNavClick('about')}
              className="group flex items-center gap-1.5 font-syne text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-500/5 text-white hover:text-cyan-400 transition-all duration-300 active:scale-95"
            >
              <span>Get In Touch</span>
              <ArrowUpRight size={10} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white hover:text-cyan-400 transition-colors p-2"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

        </div>
      </motion.header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99] bg-black/95 backdrop-blur-xl md:hidden flex flex-col justify-center px-8"
          >
            {/* Drawer Navigation List */}
            <nav className="flex flex-col gap-8 text-left">
              {NAV_ITEMS.map((item, idx) => {
                const isActive = activeSection === item.target;
                return (
                  <motion.button
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ delay: idx * 0.08, duration: 0.3 }}
                    key={item.target}
                    onClick={() => handleNavClick(item.target)}
                    className={`font-syne text-2xl uppercase tracking-widest cursor-pointer border-b border-white/5 pb-2 text-left ${
                      isActive 
                        ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 font-bold' 
                        : 'text-white/60'
                    }`}
                  >
                    {item.label}
                  </motion.button>
                );
              })}
              
              {/* Mobile CTA */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.35, duration: 0.3 }}
                onClick={() => handleNavClick('about')}
                className="w-full flex items-center justify-center gap-2 font-syne text-xs uppercase font-bold tracking-widest py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-white mt-4"
              >
                <span>Get In Touch</span>
                <ArrowUpRight size={14} />
              </motion.button>

              {/* Mobile Theme Selector */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.42, duration: 0.3 }}
                className="mt-6 border-t border-white/5 pt-6 flex flex-col gap-3"
              >
                <span className="font-syne text-[9px] font-bold uppercase tracking-widest text-white/30 text-left">Select Theme Accent</span>
                <div className="flex gap-3">
                  <button
                    onClick={() => changeTheme('cyberpunk')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border text-[10px] font-syne font-bold uppercase tracking-widest transition-all duration-300 ${
                      theme === 'cyberpunk' ? 'bg-white/10 text-white border-white/20' : 'text-white/40 bg-transparent border-white/5'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-gradient-to-tr from-cyan-400 to-fuchsia-500" />
                    Cyber
                  </button>
                  <button
                    onClick={() => changeTheme('sunset')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border text-[10px] font-syne font-bold uppercase tracking-widest transition-all duration-300 ${
                      theme === 'sunset' ? 'bg-white/10 text-white border-white/20' : 'text-white/40 bg-transparent border-white/5'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500" />
                    Sunset
                  </button>
                  <button
                    onClick={() => changeTheme('matrix')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border text-[10px] font-syne font-bold uppercase tracking-widest transition-all duration-300 ${
                      theme === 'matrix' ? 'bg-white/10 text-white border-white/20' : 'text-white/40 bg-transparent border-white/5'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-gradient-to-tr from-green-400 to-lime-500" />
                    Matrix
                  </button>
                </div>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
