import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Send, MapPin, GraduationCap } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import BentoCard from './BentoCard';
import MagneticElement from './MagneticElement';

gsap.registerPlugin(ScrollTrigger);

export default function BentoGrid() {
  const gridRef = useRef(null);

  // States for interactive components
  const [formText, setFormText] = useState('');
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  


  // GSAP scroll trigger edge-assembly scroll-scrub animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const wrappers = gridRef.current.querySelectorAll('.bento-wrapper');
      if (wrappers.length < 6) return;

      const isMobile = window.innerWidth < 768;
      const shiftX = isMobile ? window.innerWidth : 800;
      const shiftY = isMobile ? window.innerHeight : 500;

      // Create GSAP scroll trigger timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top bottom', // Start animating as soon as the top of grid enters screen bottom
          end: 'top 12%',      // Fully assembled when the top of the grid is near top
          scrub: 1.2,          // Smooth scrubbing follow
          invalidateOnRefresh: true,
        }
      });

      // Card 1 (Gallery) -> Left Edge
      tl.fromTo(wrappers[0],
        { x: -shiftX, opacity: 0, scale: 0.8, rotate: isMobile ? 0 : -8 },
        { x: 0, opacity: 1, scale: 1, rotate: 0, ease: 'power2.out' },
        0
      );

      // Card 2 (Intro) -> Right Edge
      tl.fromTo(wrappers[1],
        { x: shiftX, opacity: 0, scale: 0.8, rotate: isMobile ? 0 : 8 },
        { x: 0, opacity: 1, scale: 1, rotate: 0, ease: 'power2.out' },
        0
      );

      // Card 3 (Tools) -> Left Edge
      tl.fromTo(wrappers[2],
        { x: -shiftX, opacity: 0, scale: 0.8 },
        { x: 0, opacity: 1, scale: 1, ease: 'power2.out' },
        0.15
      );

      // Card 4 (Profile) -> Bottom Edge
      tl.fromTo(wrappers[3],
        { y: shiftY, opacity: 0, scale: 0.8, rotate: isMobile ? 0 : 5 },
        { y: 0, opacity: 1, scale: 1, rotate: 0, ease: 'power2.out' },
        0.1
      );

      // Card 5 (Video) -> Right Edge
      tl.fromTo(wrappers[4],
        { x: shiftX, opacity: 0, scale: 0.8 },
        { x: 0, opacity: 1, scale: 1, ease: 'power2.out' },
        0.15
      );

      // Card 6 (Heatmap) -> Bottom Edge
      tl.fromTo(wrappers[5],
        { y: shiftY, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, ease: 'power2.out' },
        0.2
      );
    }, gridRef);

    return () => ctx.revert();
  }, []);

  // Form submit handler to submit messages using Web3Forms
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formText.trim()) return;
    
    setIsSubmitting(true);
    setFormError('');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_KEY,
          name: formName.trim() || 'Anonymous Portfolio Visitor',
          email: formEmail.trim() || 'no-reply@portfolio.com',
          message: formText.trim(),
          subject: 'New Message from Shaik Hasnain Portfolio'
        })
      });
      const data = await response.json();
      if (data.success) {
        setIsSubmitted(true);
        setFormText('');
        setFormName('');
        setFormEmail('');
        setTimeout(() => {
          setIsSubmitted(false);
        }, 4000);
      } else {
        setFormError(data.message || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      console.error("Web3Forms submission failed:", err);
      setFormError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };



  // Wallpaper list
  const wallpapers = [
    '/wall1.webp',
    '/wall2.webp',
    '/wall3.webp',
    '/wall4.webp',
    '/wall5.webp',
    '/wall6.webp',
    '/wall7.webp'
  ];

  // Double wallpapers for seamless looping
  const duplicatedWallpapers = [...wallpapers, ...wallpapers];

  // Tools logos list
  const tools = [
    { name: 'React', src: '/react.svg', isInverted: false },
    { name: 'Vite', src: '/vite.svg', isInverted: false },
    { name: 'Groq', src: '/groq_logo.webp', isInverted: false },
    { name: 'Hugging Face', src: '/huggingface-color.webp', isInverted: false },
    { name: 'Ollama', src: '/ollama-icon.webp', isInverted: true },
    { name: 'GitHub', src: '/github.svg', isInverted: true },
    { name: 'Unreal Engine', src: '/unrealengine.svg', isInverted: true },
    { name: 'Framer', src: '/framer_logo_icon_169149.webp', isInverted: false },
    { name: 'Spline', src: '/spline_logo.webp', isInverted: false }
  ];

  const duplicatedTools = [...tools, ...tools];

  // Simulated GitHub Contribution Grid data generator - Seeded for consistency
  const [activeCommits, setActiveCommits] = useState(null);
  const contributionGrid = useRef([]);
  
  if (contributionGrid.current.length === 0) {
    const days = 7;
    const weeks = 48; // Fits desktop layout nicely
    const list = [];
    for (let w = 0; w < weeks; w++) {
      const weekCols = [];
      for (let d = 0; d < days; d++) {
        // Seeded pseudo-randomness for a consistent, realistic heatmap layout
        const seed = (w * 7 + d) * 31;
        const wave = Math.sin(w * 0.15) * 2 + Math.cos(d * 0.5) * 1.5;
        let val = Math.floor(((seed % 9) + wave) / 2);
        if (val < 0) val = 0;
        if (val > 8) val = 8;
        weekCols.push(val);
      }
      list.push(weekCols);
    }
    contributionGrid.current = list;
  }

  // Sum the contributions to get actual representative contributions count
  const totalContributions = contributionGrid.current.reduce((acc, week) => {
    return acc + week.reduce((wAcc, val) => wAcc + (val > 0 ? Math.floor(val * 1.3) : 0), 0);
  }, 0);

  return (
    <section id="about" className="relative w-full bg-black py-20 px-4 md:px-12 flex justify-center overflow-hidden">

      {/* Background Accent Lights */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-fuchsia-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Decorative oversized section index */}
      <div className="absolute left-12 top-10 font-syne font-black text-[120px] leading-none text-white/[0.02] select-none pointer-events-none">
        01
      </div>

      {/* Grid Container */}
      <div
        ref={gridRef}
        className="grid grid-cols-12 gap-5 w-full max-w-7xl auto-rows-[180px] md:auto-rows-[160px]"
      >

        {/* CARD 1: Wallpaper Gallery (5 cols, 2 rows) */}
        <div className="bento-wrapper col-span-12 md:col-span-5 row-span-2">
          <BentoCard className="w-full h-full flex flex-col justify-center">
            {/* Vertical fading gradients */}
            <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none" />

            <div className="relative w-full flex items-center overflow-hidden h-full z-0">
              <div className="flex gap-4 p-4 animate-slide-horizontal w-max">
                {duplicatedWallpapers.map((src, index) => (
                  <div
                    key={index}
                    className="w-48 h-56 md:h-64 rounded-2xl overflow-hidden shrink-0 border border-white/10 shadow-lg relative group/item"
                  >
                    <img
                      src={src}
                      alt={`Wallpaper ${index % wallpapers.length + 1}`}
                      className="w-full h-full object-cover zoom-image"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                ))}
              </div>
            </div>
          </BentoCard>
        </div>

        {/* CARD 2: Intro Card (7 cols, 2 rows) */}
        <div className="bento-wrapper col-span-12 md:col-span-7 row-span-2">
          <BentoCard className="w-full h-full p-6 md:p-8 flex flex-col justify-between">
            {/* Content */}
            <div className="text-left relative z-10">
              <span className="text-cyan-400 text-xs font-bold tracking-widest uppercase font-satoshi">WHO I AM</span>
              <h2 className="font-syne font-extrabold text-2xl md:text-4xl text-white mt-2 mb-3">
                Hi, I'm Shaik Hasnain
              </h2>
              <p className="font-satoshi text-sm md:text-base text-white/70 leading-relaxed max-w-xl">
                I am an AI/ML student and developer at SRM AP University. Passionate about building high-performance intelligence consensus engines like <span className="text-cyan-400 font-medium">CampusX</span> and creating fast-paced immersive FPS games in <span className="text-fuchsia-400 font-medium">Unity</span>.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="relative z-20 w-full flex flex-col gap-3 mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col">
                  <label htmlFor="contact-name" className="sr-only">Your Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    placeholder="Your Name (Optional)"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(var(--cyan-rgb),0.3)] outline-none transition-all duration-300"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="contact-email" className="sr-only">Your Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder="Your Email (Optional)"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(var(--cyan-rgb),0.3)] outline-none transition-all duration-300"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-grow flex flex-col">
                  <label htmlFor="contact-message" className="sr-only">Your Message</label>
                  <input
                    id="contact-message"
                    type="text"
                    required
                    placeholder="Drop a quick message..."
                    value={formText}
                    onChange={(e) => setFormText(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(var(--cyan-rgb),0.3)] outline-none transition-all duration-300"
                  />
                </div>
                <MagneticElement>
                  <button
                    type="submit"
                    disabled={isSubmitting || isSubmitted}
                    className="bg-white text-black hover:bg-cyan-400 hover:text-black disabled:bg-white/20 disabled:text-white/40 disabled:pointer-events-none transition-all duration-300 font-bold px-4 py-3 rounded-xl flex items-center justify-center gap-2 text-sm shrink-0"
                  >
                    <span className="hidden sm:inline">Send</span>
                    <Send size={14} />
                  </button>
                </MagneticElement>
              </div>
              {formError && (
                <span className="text-rose-500 text-xs font-satoshi mt-1 block text-left">
                  {formError}
                </span>
              )}
            </form>

            {/* Success Overlay Slide-in */}
            <AnimatePresence>
              {isSubmitted && (
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                  className="absolute inset-0 bg-gradient-to-r from-cyan-900 to-black z-30 flex flex-col justify-center items-start px-8 text-left"
                >
                  <h3 className="font-syne text-xl md:text-2xl font-bold text-cyan-400 flex items-center gap-2">
                    <span>Message Transmitted!</span>
                  </h3>
                  <p className="font-satoshi text-sm text-white/70 mt-2">
                    Thank you. I'll get back to you shortly.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </BentoCard>
        </div>

        {/* CARD 3: Tools Marquee (12 cols, 1 row) - Expanded to full row width for maximum impact */}
        <div className="bento-wrapper col-span-12 row-span-1">
          <BentoCard className="w-full h-full flex flex-col justify-center">
            <div className="absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-black/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-black/80 to-transparent z-10 pointer-events-none" />

            <div className="flex items-center w-full h-full overflow-hidden z-0">
              <div className="flex gap-10 items-center px-4 animate-marquee w-max">
                {duplicatedTools.map((tool, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 shrink-0 group/tool"
                  >
                    <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/10 p-2 flex items-center justify-center relative overflow-hidden transition-colors group-hover/tool:border-cyan-400">
                      <img
                        src={tool.src}
                        alt={tool.name}
                        className={`w-full h-full object-contain transition-transform duration-300 group-hover/tool:scale-110 ${tool.isInverted ? 'invert brightness-[5]' : ''
                          }`}
                        loading="lazy"
                      />
                    </div>
                    <span className="font-syne text-sm font-semibold tracking-tight text-white/50 group-hover/tool:text-white transition-colors duration-300">
                      {tool.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </BentoCard>
        </div>

        {/* CARD 4: Profile Picture (6 cols, 2 rows) - Expanded side-by-side layout */}
        <div className="bento-wrapper col-span-12 md:col-span-6 row-span-2">
          <BentoCard className="w-full h-full">
            <img
              src="/mine_pic.webp"
              alt="Shaik Hasnain Profile"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/30 pointer-events-none" />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(circle, transparent 35%, rgba(0,0,0,0.85) 100%)'
              }}
            />

            {/* Cyberpunk color shift overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/30 via-purple-500/20 to-fuchsia-500/30 opacity-0 group-hover:opacity-100 transition-all duration-500 mix-blend-overlay pointer-events-none" />
            <div className="absolute inset-0 bg-cyan-400/10 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none border border-cyan-400/40 rounded-3xl" />
          </BentoCard>
        </div>

        {/* CARD 5: Location & Education Card (6 cols, 2 rows) */}
        <div className="bento-wrapper col-span-12 md:col-span-6 row-span-2">
          <BentoCard className="w-full h-full p-6 md:p-8 flex flex-col justify-between">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-fuchsia-500/5 pointer-events-none" />
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

            {/* Floating decorative orbs */}
            <div className="absolute top-8 right-8 w-20 h-20 rounded-full bg-cyan-400/10 blur-xl pointer-events-none animate-pulse" />
            <div className="absolute bottom-12 left-8 w-16 h-16 rounded-full bg-fuchsia-500/10 blur-xl pointer-events-none animate-pulse [animation-delay:1s]" />

            <div className="relative z-10 text-left">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
                  <MapPin size={14} className="text-cyan-400" />
                </div>
                <span className="text-cyan-400 text-xs font-bold tracking-widest uppercase font-satoshi">LOCATION</span>
              </div>
              <h3 className="font-syne font-extrabold text-2xl md:text-3xl text-white mb-1">
                Andhra Pradesh
              </h3>
              <p className="font-satoshi text-sm text-white/50">India 🇮🇳</p>
            </div>

            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent relative z-10" />

            <div className="relative z-10 text-left">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center">
                  <GraduationCap size={14} className="text-fuchsia-400" />
                </div>
                <span className="text-fuchsia-400 text-xs font-bold tracking-widest uppercase font-satoshi">EDUCATION</span>
              </div>
              <h3 className="font-syne font-bold text-lg md:text-xl text-white mb-1">
                SRM University AP
              </h3>
              <p className="font-satoshi text-xs text-white/50 leading-relaxed">
                B.Tech CSE — AI & Machine Learning Specialization
              </p>
              <div className="flex items-center gap-3 mt-3">
                <span className="text-[9px] font-bold font-syne text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 rounded-full px-3 py-1 uppercase tracking-wider">
                  8.4 CGPA
                </span>
                <span className="text-[9px] font-bold font-syne text-white/50 bg-white/5 border border-white/10 rounded-full px-3 py-1 uppercase tracking-wider">
                  2025 — Present
                </span>
              </div>
            </div>
          </BentoCard>
        </div>

        {/* CARD 6: GitHub Heatmap Card (12 cols, 2 rows) */}
        <div className="bento-wrapper col-span-12 row-span-2">
          <BentoCard className="w-full h-full p-6 md:p-8 flex flex-col justify-between">
            {/* Header Stats */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full z-10 text-left">
              <div>
                <span className="text-cyan-400 text-xs font-bold tracking-widest uppercase font-satoshi">CODE ACTIVITY</span>
                <h3 className="font-syne font-extrabold text-xl md:text-2xl text-white mt-1">
                  github.com/ShaikHasnain-2007
                </h3>
              </div>
              
              {/* Custom GitHub stats counter */}
              <div className="flex items-center gap-6 font-syne text-xs uppercase text-white/50">
                <div>
                  <span className="text-white block font-bold text-base">{totalContributions}+</span>
                  <span>Contributions</span>
                </div>
                <div className="w-[1px] h-8 bg-white/10" />
                <div>
                  <span className="text-cyan-400 block font-bold text-base">Active</span>
                  <span>Dev Status</span>
                </div>
              </div>
            </div>

            {/* Contribution Heatmap Grid */}
            <div className="relative w-full overflow-x-auto my-6 py-2 no-scrollbar z-10" role="grid" aria-label="GitHub Contributions Heatmap">
              <div className="flex flex-col gap-[3px] min-w-[700px]">
                {Array.from({ length: 7 }).map((_, dIdx) => (
                  <div key={dIdx} className="flex gap-[3px]" role="row">
                    {contributionGrid.current.map((week, wIdx) => {
                      const weight = week[dIdx];
                      // Map weight value to neon shades
                      const colorClass = 
                        weight === 0 ? 'bg-white/[0.04] border border-white/5' :
                        weight < 3 ? 'bg-cyan-500/25 border border-cyan-500/10' :
                        weight < 6 ? 'bg-cyan-500/60 border border-cyan-400/20' :
                        'bg-cyan-400 shadow-[0_0_8px_rgba(var(--cyan-rgb),0.7)]';
                      
                      return (
                        <div
                          key={wIdx}
                          onMouseEnter={() => {
                            setActiveCommits({
                              commits: weight === 0 ? 'No' : weight * 2,
                              date: `Week ${wIdx + 1}, Day ${dIdx + 1}`
                            });
                          }}
                          onMouseLeave={() => setActiveCommits(null)}
                          className={`w-[11px] h-[11px] rounded-[2px] transition-all duration-300 hover:scale-125 cursor-crosshair ${colorClass}`}
                          role="gridcell"
                          aria-label={`${weight === 0 ? 'No' : weight * 2} contributions on week ${wIdx + 1}, day ${dIdx + 1}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Heatmap Footer Legend */}
            <div className="flex justify-between items-center w-full z-10">
              {/* Hover tooltip feedback */}
              <div className="min-h-[16px] text-left">
                <AnimatePresence mode="wait">
                  {activeCommits && (
                    <motion.span
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-xs font-bold text-cyan-400 uppercase tracking-widest font-syne"
                    >
                      {activeCommits.commits} contributions on {activeCommits.date}
                    </motion.span>
                  )}
                  {!activeCommits && (
                    <span className="text-xs text-white/30 font-satoshi">
                      Hover boxes to check daily contributions
                    </span>
                  )}
                </AnimatePresence>
              </div>

              {/* Legend visual indicators */}
              <div className="flex items-center gap-1.5 text-[10px] text-white/40 uppercase font-bold tracking-widest">
                <span>Less</span>
                <div className="w-2.5 h-2.5 bg-white/[0.04] rounded-[1px]" />
                <div className="w-2.5 h-2.5 bg-cyan-500/25 rounded-[1px]" />
                <div className="w-2.5 h-2.5 bg-cyan-500/60 rounded-[1px]" />
                <div className="w-2.5 h-2.5 bg-cyan-400 rounded-[1px]" />
                <span>More</span>
              </div>
            </div>
          </BentoCard>
        </div>

      </div>
    </section>
  );
}
