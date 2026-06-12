import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileDown } from 'lucide-react';

export default function FloatingResumeButton() {
  const [isVisible, setIsVisible] = useState(false);

  // Show after scrolling past hero (roughly 100vh)
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.a
          href="mailto:shaikhasnain2007@gmail.com?subject=Resume%20Request&body=Hi%20Shaik%2C%20I%20would%20like%20to%20request%20your%20resume."
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          className="fixed right-6 top-1/2 -translate-y-1/2 z-[98] group"
          aria-label="Request Resume"
        >
          <div className="flex items-center gap-2 bg-black/80 backdrop-blur-xl border border-white/10 hover:border-cyan-400/40 rounded-full px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_10px_30px_rgba(var(--cyan-rgb),0.2)] transition-all duration-300">
            <FileDown size={14} className="text-cyan-400 group-hover:animate-bounce" />
            <span className="font-syne text-[10px] font-bold uppercase tracking-widest text-white/70 group-hover:text-cyan-400 transition-colors duration-300 hidden md:inline">
              Resume
            </span>
          </div>
          {/* Glow ring */}
          <div className="absolute inset-[-2px] rounded-full border border-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none animate-pulse" />
        </motion.a>
      )}
    </AnimatePresence>
  );
}
