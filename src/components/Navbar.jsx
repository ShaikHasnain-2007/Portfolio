import { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MagneticElement from './MagneticElement';

const NAV_ITEMS = [
  { label: 'About', target: 'about' },
  { label: 'Skills', target: 'skills' },
  { label: 'Projects', target: 'projects' },
  { label: 'Timeline', target: 'timeline' },
  { label: 'Contact', target: 'contact' }
];

const THEME_MAP = {
  cyberpunk: '1',
  sunset: '2',
  matrix: '3'
};

const OPTION_TO_THEME = {
  '1': 'cyberpunk',
  '2': 'sunset',
  '3': 'matrix'
};

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(() => {
    return typeof window !== 'undefined' ? window.scrollY > 50 : false;
  });
  const [isVisible, setIsVisible] = useState(() => {
    return typeof window !== 'undefined' ? window.scrollY > 50 : false;
  });
  const lastScrollYRef = useRef(0);
  
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('portfolio-theme') || 'cyberpunk';
  });
  const [previousOption, setPreviousOption] = useState(() => {
    const saved = localStorage.getItem('portfolio-theme') || 'cyberpunk';
    return THEME_MAP[saved] || '1';
  });

  const mobileMenuRef = useRef(null);

  // Lock body scroll and trap focus when mobile menu is open
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    
    if (window.lenis) {
      window.lenis.stop();
    }

    const menuEl = mobileMenuRef.current;
    if (!menuEl) return;

    const focusableElements = menuEl.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (firstElement) {
      firstElement.focus();
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        return;
      }

      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalStyle;
      if (window.lenis) {
        window.lenis.start();
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  const changeTheme = (newTheme) => {
    const currentOpt = THEME_MAP[theme] || '1';
    setPreviousOption(currentOpt);
    setTheme(newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleRadioChange = (optValue) => {
    const targetTheme = OPTION_TO_THEME[optValue];
    if (targetTheme) {
      changeTheme(targetTheme);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsScrolled(currentScrollY > 50);

      if (currentScrollY < 50) {
        setIsVisible(false);
      } else if (currentScrollY > lastScrollYRef.current) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -40% 0px',
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

    const sections = ['about', 'skills', 'projects', 'timeline', 'contact'];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const heroEl = document.querySelector('section');
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

  const activeOption = THEME_MAP[theme] || '1';

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
        className={`liquid-glass-nav fixed top-4 left-1/2 z-[100] w-[92%] max-w-5xl rounded-full transition-all duration-400 ${
          isScrolled ? 'is-scrolled' : ''
        } ${isVisible ? 'pointer-events-auto' : 'pointer-events-none'}`}
      >
        <div className="flex h-16 items-center justify-between px-6 md:px-8">
          
          <button 
            onClick={() => handleNavClick('about')}
            className="group flex items-center gap-2 font-syne text-sm font-extrabold tracking-widest uppercase cursor-pointer text-left text-white transition-opacity"
            aria-label="Go to about section"
          >
            <span className="relative flex h-2.5 w-2.5 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400"></span>
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-fuchsia-500 group-hover:brightness-125 transition-all">
              SHAIK.
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.target;
              return (
                <button
                  key={item.target}
                  onClick={() => handleNavClick(item.target)}
                  className={`font-syne text-xs uppercase tracking-widest transition-all duration-300 relative py-1.5 cursor-pointer ${
                    isActive ? 'text-cyan-400 font-bold' : 'text-white/70 hover:text-white'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-fuchsia-500 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.8)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            
            <fieldset className="switcher" c-previous={previousOption} aria-label="Theme color switcher">
              <legend className="switcher__legend">Choose theme</legend>
              
              <label className="switcher__option" title="Signature Theme">
                <input
                  className="switcher__input"
                  type="radio"
                  name="theme"
                  value="cyberpunk"
                  c-option="1"
                  checked={activeOption === '1'}
                  onChange={() => handleRadioChange('1')}
                  aria-label="Switch to Signature theme"
                />
                <svg className="switcher__icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 36 36">
                  <path fill="var(--c)" fillRule="evenodd" d="M18 12a6 6 0 1 1 0 12 6 6 0 0 1 0-12Zm0 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" clipRule="evenodd"/>
                  <path fill="var(--c)" d="M17 6.038a1 1 0 1 1 2 0v3a1 1 0 0 1-2 0v-3ZM24.244 7.742a1 1 0 1 1 1.618 1.176L24.1 11.345a1 1 0 1 1-1.618-1.176l1.763-2.427ZM29.104 13.379a1 1 0 0 1 .618 1.902l-2.854.927a1 1 0 1 1-.618-1.902l2.854-.927ZM29.722 20.795a1 1 0 0 1-.619 1.902l-2.853-.927a1 1 0 1 1 .618-1.902l2.854.927ZM25.862 27.159a1 1 0 0 1-1.618 1.175l-1.763-2.427a1 1 0 1 1 1.618-1.175l1.763 2.427ZM19 30.038a1 1 0 0 1-2 0v-3a1 1 0 1 1 2 0v3ZM11.755 28.334a1 1 0 0 1-1.618-1.175l1.764-2.427a1 1 0 1 1 1.618 1.175l-1.764 2.427ZM6.896 22.697a1 1 0 1 1-.618-1.902l2.853-.927a1 1 0 1 1 .618 1.902l-2.853.927ZM6.278 15.28a1 1 0 1 1 .618-1.901l2.853.927a1 1 0 1 1-.618 1.902l-2.853-.927ZM10.137 8.918a1 1 0 0 1 1.618-1.176l1.764 2.427a1 1 0 0 1-1.618 1.176l-1.764-2.427Z"/>
                </svg>
              </label>

              <label className="switcher__option" title="Sunset Theme">
                <input
                  className="switcher__input"
                  type="radio"
                  name="theme"
                  value="sunset"
                  c-option="2"
                  checked={activeOption === '2'}
                  onChange={() => handleRadioChange('2')}
                  aria-label="Switch to Sunset theme"
                />
                <svg className="switcher__icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 36 36">
                  <path fill="var(--c)" d="M12.5 8.473a10.968 10.968 0 0 1 8.785-.97 7.435 7.435 0 0 0-3.737 4.672l-.09.373A7.454 7.454 0 0 0 28.732 20.4a10.97 10.97 0 0 1-5.232 7.125l-.497.27c-5.014 2.566-11.175.916-14.234-3.813l-.295-.483C5.53 18.403 7.13 11.93 12.017 8.77l.483-.297Zm4.234.616a8.946 8.946 0 0 0-2.805.883l-.429.234A9 9 0 0 0 10.206 22.5l.241.395A9 9 0 0 0 22.5 25.794l.416-.255a8.94 8.94 0 0 0 2.167-1.99 9.433 9.433 0 0 1-2.782-.313c-5.043-1.352-8.036-6.535-6.686-11.578l.147-.491c.242-.745.573-1.44.972-2.078Z"/>
                </svg>
              </label>

              <label className="switcher__option" title="Matrix Theme">
                <input
                  className="switcher__input"
                  type="radio"
                  name="theme"
                  value="matrix"
                  c-option="3"
                  checked={activeOption === '3'}
                  onChange={() => handleRadioChange('3')}
                  aria-label="Switch to Matrix theme"
                />
                <svg className="switcher__icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 36 36">
                  <path fill="var(--c)" fillRule="evenodd" d="M19 8a1 1 0 1 0-2 0v3a1 1 0 1 0 2 0V8ZM25.364 9.222a1 1 0 0 0-1.414 1.414l2.121 2.122a1 1 0 0 0 1.415-1.415l-2.122-2.12ZM12.05 10.636a1 1 0 0 0-1.414-1.414l-2.122 2.12a1 1 0 0 0 1.415 1.415l2.121-2.121ZM18 14a6 6 0 0 0-6 6h12a6 6 0 0 0-6-6ZM7 23a1 1 0 0 1 1-1h20a1 1 0 1 1 0 2H8a1 1 0 0 1-1-1ZM10 26a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H11a1 1 0 0 1-1-1Z" clipRule="evenodd"/>
                </svg>
              </label>
            </fieldset>

            <MagneticElement>
              <button
                onClick={() => handleNavClick('contact')}
                className="liquid-glass-btn group flex items-center gap-1.5 font-syne text-[10px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-full text-white hover:text-cyan-400 active:scale-95 cursor-pointer"
              >
                <span>Get In Touch</span>
                <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-cyan-400" />
              </button>
            </MagneticElement>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white hover:text-cyan-400 transition-colors p-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99] bg-black/90 backdrop-blur-2xl md:hidden flex flex-col justify-center px-8"
          >
            <nav className="flex flex-col gap-6 text-left">
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


              
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.35, duration: 0.3 }}
                onClick={() => handleNavClick('contact')}
                className="liquid-glass-btn w-full flex items-center justify-center gap-2 font-syne text-xs uppercase font-bold tracking-widest py-4 rounded-2xl border border-white/20 text-white mt-4"
              >
                <span>Get In Touch</span>
                <ArrowUpRight size={14} className="text-cyan-400" />
              </motion.button>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.42, duration: 0.3 }}
                className="mt-6 border-t border-white/10 pt-6 flex flex-col gap-3"
              >
                <span className="font-syne text-[9px] font-bold uppercase tracking-widest text-white/40 text-left">Select Theme Mode</span>
                <div className="flex gap-3">
                  <button
                    onClick={() => changeTheme('cyberpunk')}
                    aria-label="Switch to Signature theme"
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border text-[10px] font-syne font-bold uppercase tracking-widest transition-all duration-300 ${
                      theme === 'cyberpunk' ? 'bg-white/15 text-white border-cyan-400/50 shadow-[0_0_15px_rgba(56,189,248,0.3)]' : 'text-white/40 bg-transparent border-white/5'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-gradient-to-tr from-cyan-400 to-fuchsia-500" />
                    Signature
                  </button>
                  <button
                    onClick={() => changeTheme('sunset')}
                    aria-label="Switch to Sunset theme"
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border text-[10px] font-syne font-bold uppercase tracking-widest transition-all duration-300 ${
                      theme === 'sunset' ? 'bg-white/15 text-white border-rose-400/50 shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'text-white/40 bg-transparent border-white/5'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500" />
                    Sunset
                  </button>
                  <button
                    onClick={() => changeTheme('matrix')}
                    aria-label="Switch to Matrix theme"
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border text-[10px] font-syne font-bold uppercase tracking-widest transition-all duration-300 ${
                      theme === 'matrix' ? 'bg-white/15 text-white border-green-400/50 shadow-[0_0_15px_rgba(74,222,128,0.3)]' : 'text-white/40 bg-transparent border-white/5'
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
