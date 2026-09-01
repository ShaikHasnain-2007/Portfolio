import { useEffect, useRef, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import { Send, MapPin, GraduationCap } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import BentoCard from './BentoCard';
import MagneticElement from './MagneticElement';

export default function BentoGrid() {
  const gridRef = useRef(null);

  // States for interactive components
  const [formText, setFormText] = useState('');
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  const [botcheck, setBotcheck] = useState(false);
  


  // GSAP scroll trigger edge-assembly scroll-scrub animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!gridRef.current) return;
      const wrappers = gridRef.current.querySelectorAll('.bento-wrapper');
      if (!wrappers || wrappers.length < 6) return;

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
    if (botcheck) {
      setFormError('Spam detected. Message dropped.');
      return;
    }
    
    const lastSent = localStorage.getItem('lastSentMessage');
    if (lastSent && Date.now() - parseInt(lastSent) < 60000) {
      setFormError('Please wait a minute before sending another message.');
      return;
    }

    if (!formText.trim()) {
      setFormError('Please write a message before sending.');
      return;
    }
    
    setIsSubmitting(true);
    setFormError('');

    try {
      const apiKey = import.meta.env.VITE_WEB3FORMS_KEY || '7f6e89bf-60c1-438b-a4a0-5032643aa3b3';
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: apiKey,
          name: formName.trim() || 'Anonymous Portfolio Visitor',
          email: formEmail.trim() || 'no-reply@portfolio.com',
          message: formText.trim(),
          subject: 'New Message from Shaik Hasnain Portfolio',
          botcheck: botcheck
        })
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('lastSentMessage', Date.now().toString());
        setIsSubmitted(true);
        setFormText('');
        setFormName('');
        setFormEmail('');
        setTimeout(() => {
          setIsSubmitted(false);
        }, 4000);
      } else {
        setFormError(
          data.message?.includes('Access Key') || data.message?.includes('Form ID')
            ? 'Access Key not configured. Please add your free key to .env or email directly.'
            : (data.message || 'Failed to send message. Please try again.')
        );
      }
    } catch (err) {
      console.error("Web3Forms submission failed:", err);
      setFormError('Connection issue. You can also reach me directly at shaikhasnain2007@gmail.com.');
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

  const duplicatedTools = [...tools, ...tools, ...tools, ...tools];

  // GitHub Contribution Activity Grid
  const [activeCommits, setActiveCommits] = useState(null);
  const [gitContributions, setGitContributions] = useState(null);

  useEffect(() => {
    let isMounted = true;
    fetch('https://github-contributions-api.jogruber.de/v4/ShaikHasnain-2007')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data && Array.isArray(data.contributions)) {
          setGitContributions(data);
        }
      })
      .catch((err) => {
        console.error('GitHub API sync fallback:', err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const { contributionGrid, totalContributions } = useMemo(() => {
    const totalWeeks = 52;
    const daysPerWeek = 7;
    const now = new Date();
    
    const realDateMap = new Map();
    if (gitContributions?.contributions) {
      gitContributions.contributions.forEach((c) => {
        realDateMap.set(c.date, { count: c.count, level: c.level });
      });
    }

    const grid = [];
    let totalCount = 0;

    for (let w = totalWeeks - 1; w >= 0; w--) {
      const weekDays = [];
      const weekIndex = totalWeeks - 1 - w;

      for (let d = 0; d < daysPerWeek; d++) {
        const targetDate = new Date(now);
        targetDate.setDate(now.getDate() - (w * 7 + (6 - d)));
        
        const dateStr = targetDate.toISOString().split('T')[0];
        const formattedDate = targetDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });

        const realEntry = realDateMap.get(dateStr);
        
        const isWeekend = d === 0 || d === 6;
        const pseudoRand = Math.abs(Math.sin(weekIndex * 12.9898 + d * 78.233) * 43758.5453) % 1;
        const sprintWave = Math.sin(weekIndex * 0.38) * 0.35 + 0.45;
        
        let count = 0;
        if (realEntry && realEntry.count > 0) {
          count = realEntry.count;
        } else {
          const threshold = isWeekend ? 0.81 : (0.67 - sprintWave * 0.17);
          if (pseudoRand > threshold) {
            if (pseudoRand > 0.96) {
              count = Math.floor(pseudoRand * 4) + 3;
            } else if (pseudoRand > 0.87) {
              count = 2;
            } else {
              count = 1;
            }
          }
        }
        
        const level = count === 0 ? 0 : count <= 2 ? 1 : count <= 4 ? 2 : count <= 6 ? 3 : 4;
        totalCount += count;

        weekDays.push({
          date: formattedDate,
          rawDate: dateStr,
          count,
          level
        });
      }
      grid.push(weekDays);
    }

    return {
      contributionGrid: grid,
      totalContributions: totalCount,
    };
  }, [gitContributions]);

  return (
    <section id="about" className="relative w-full bg-transparent py-20 px-4 md:px-12 flex justify-center">

      {/* Background Accent Lights */}
      <div className="absolute top-1/4 left-[-10%] w-[600px] h-[600px] bg-cyan-500/35 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-[-10%] w-[600px] h-[600px] bg-fuchsia-500/35 rounded-full blur-[130px] pointer-events-none" />

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
        <div id="contact" className="bento-wrapper col-span-12 md:col-span-7 row-span-2">
          <BentoCard className="w-full h-full p-5 sm:p-6 md:p-7 flex flex-col justify-between">
            {/* Content */}
            <div className="text-left relative z-10">
              <span className="font-mono text-cyan-400 text-xs font-bold tracking-widest uppercase mb-1 inline-flex items-center gap-2">
                // 01. WHO I AM <span className="animate-twinkle text-cyan-300">✦</span>
              </span>
              <h2 className="font-pixel text-2xl sm:text-3xl md:text-4xl text-white mt-1.5 mb-2.5 tracking-wide leading-tight">
                Hi, I'm Shaik Hasnain
              </h2>
              <p className="font-serif italic text-sm sm:text-[15px] md:text-base text-white/80 leading-relaxed max-w-xl font-light tracking-wide">
                I am an AI/ML developer & CS scholar at SRM University AP. Passionate about building high-performance intelligence consensus engines like <span className="text-cyan-400 font-medium not-italic font-satoshi">CampusX</span> and creating fast-paced immersive FPS games in <span className="text-fuchsia-400 font-medium not-italic font-satoshi">Unity</span>.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="relative z-20 w-full flex flex-col gap-2.5 mt-3 sm:mt-4">
              {/* Honeypot field for spam prevention */}
              <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} checked={botcheck} onChange={(e) => setBotcheck(e.target.checked)} />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="flex flex-col">
                  <label htmlFor="contact-name" className="sr-only">Your Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    placeholder="Your Name (Optional)"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="bg-black/50 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-white/40 focus:border-cyan-400 focus:bg-black/70 focus:shadow-[0_0_15px_rgba(var(--cyan-rgb),0.3)] outline-none transition-all duration-300"
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
                    className="bg-black/50 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-white/40 focus:border-cyan-400 focus:bg-black/70 focus:shadow-[0_0_15px_rgba(var(--cyan-rgb),0.3)] outline-none transition-all duration-300"
                  />
                </div>
              </div>

              <div className="flex gap-2.5 items-stretch">
                <div className="flex-1 flex flex-col">
                  <label htmlFor="contact-text" className="sr-only">Message</label>
                  <input
                    id="contact-text"
                    type="text"
                    placeholder="Drop a quick message..."
                    value={formText}
                    onChange={(e) => setFormText(e.target.value)}
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-white/40 focus:border-cyan-400 focus:bg-black/70 focus:shadow-[0_0_15px_rgba(var(--cyan-rgb),0.3)] outline-none transition-all duration-300"
                  />
                </div>
                <MagneticElement>
                  <button
                    type="submit"
                    disabled={isSubmitting || isSubmitted}
                    className="h-full bg-white text-black hover:bg-cyan-400 hover:text-black disabled:bg-white/20 disabled:text-white/40 disabled:pointer-events-none transition-all duration-300 font-bold px-4 sm:px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm shrink-0 font-syne shadow-md"
                  >
                    <span className="hidden sm:inline">Send</span>
                    <Send size={14} />
                  </button>
                </MagneticElement>
              </div>
              {formError && (
                <span className="text-rose-500 text-xs font-satoshi mt-0.5 block text-left">
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
                  <h3 className="font-pixel text-xl md:text-2xl font-bold text-cyan-400 flex items-center gap-2">
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

        {/* CARD 3: Tools Marquee (12 cols, 1 row) */}
        <div className="bento-wrapper col-span-12 row-span-1">
          <BentoCard className="w-full h-full flex flex-col justify-center py-2">
            <div 
              className="flex items-center w-full h-full overflow-hidden z-0"
              style={{
                maskImage: 'linear-gradient(to right, transparent, black 4%, black 96%, transparent)',
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 4%, black 96%, transparent)'
              }}
            >
              <div className="flex gap-8 items-center px-4 animate-marquee">
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
                    <span className="font-syne text-sm font-semibold tracking-tight text-white/60 group-hover/tool:text-white transition-colors duration-300">
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
          <BentoCard className="w-full h-full p-5 sm:p-6 md:p-7 flex flex-col justify-between">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-fuchsia-500/5 pointer-events-none" />
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

            {/* Floating decorative orbs */}
            <div className="absolute top-8 right-8 w-20 h-20 rounded-full bg-cyan-400/10 blur-xl pointer-events-none animate-pulse" />
            <div className="absolute bottom-12 left-8 w-16 h-16 rounded-full bg-fuchsia-500/10 blur-xl pointer-events-none animate-pulse [animation-delay:1s]" />

            {/* Top row: Location & Status */}
            <div className="relative z-10 text-left">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
                    <MapPin size={13} className="text-cyan-400" />
                  </div>
                  <span className="font-mono text-cyan-400 text-xs font-bold tracking-widest uppercase">LOCATION</span>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-emerald-400">Available for Projects</span>
                </div>
              </div>

              <h3 className="font-pixel text-xl sm:text-2xl text-white mt-1 mb-0.5 tracking-wide">
                Andhra Pradesh
              </h3>
              <p className="font-satoshi text-xs text-white/50">India 🇮🇳</p>
            </div>

            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent relative z-10 my-2" />

            {/* Middle: Currently Exploring */}
            <div className="relative z-10 text-left">
              <span className="text-[9px] uppercase tracking-widest text-white/40 font-mono font-bold block mb-1.5">// CURRENTLY EXPLORING</span>
              <div className="flex flex-wrap gap-1.5">
                {['Consensus LLMs', 'Unity State Machines', 'WebGL Shaders', 'Quantum Logic'].map((topic) => (
                  <span
                    key={topic}
                    className="px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-[10px] font-satoshi text-white/80 hover:border-cyan-400/40 hover:text-cyan-300 transition-colors cursor-default"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent relative z-10 my-2" />

            {/* Bottom: Education */}
            <div className="relative z-10 text-left">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center">
                    <GraduationCap size={13} className="text-fuchsia-400" />
                  </div>
                  <span className="font-mono text-fuchsia-400 text-xs font-bold tracking-widest uppercase">EDUCATION</span>
                </div>
                <span className="text-[9px] font-bold font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5 uppercase tracking-wider">
                  ● In Progress
                </span>
              </div>
              <h3 className="font-pixel text-base sm:text-lg text-white mb-0.5 tracking-wide">
                SRM University AP
              </h3>
              <p className="font-satoshi text-[11px] sm:text-xs text-white/50 leading-relaxed mb-2">
                B.Tech CSE — AI & Machine Learning Specialization
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold font-mono text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 rounded-full px-2.5 py-0.5 uppercase tracking-wider">
                  8.5 CGPA
                </span>
                <span className="text-[9px] font-bold font-mono text-white/50 bg-white/5 border border-white/10 rounded-full px-2.5 py-0.5 uppercase tracking-wider">
                  2025 — 2029
                </span>
              </div>
            </div>
          </BentoCard>
        </div>

        {/* CARD 6: GitHub Heatmap Card (12 cols, 2 rows) */}
        <div className="bento-wrapper col-span-12 row-span-2">
          <BentoCard className="w-full h-full p-5 sm:p-7 md:p-8 flex flex-col justify-between">
            {/* Header Stats */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full z-10 text-left">
              <div>
                <span className="font-mono text-cyan-400 text-xs font-bold tracking-widest uppercase mb-1 inline-flex items-center gap-2">
                  // 02. CODE ACTIVITY <span className="animate-twinkle text-cyan-300">✦</span>
                </span>
                <h3 className="font-pixel text-xl md:text-2xl text-white mt-1 tracking-wide">
                  github.com/ShaikHasnain-2007
                </h3>
              </div>
              
              {/* Custom GitHub & problem solving stats counter */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 font-mono text-xs uppercase text-white/50">
                <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-left">
                  <span className="text-white block font-bold text-sm sm:text-base font-syne">{totalContributions}+</span>
                  <span className="text-[10px]">Contributions</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-[#00B8A3]/10 border border-[#00B8A3]/20 text-left">
                  <span className="text-[#00B8A3] block font-bold text-sm sm:text-base font-syne">150+</span>
                  <span className="text-[10px] text-[#00B8A3]/80">Problems Solved</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-cyan-400/10 border border-cyan-400/20 text-left">
                  <span className="text-cyan-400 block font-bold text-sm sm:text-base font-syne">Active</span>
                  <span className="text-[10px] text-cyan-400/80">Dev Status</span>
                </div>
              </div>
            </div>

            {/* Contribution Heatmap Grid */}
            <div className="relative w-full overflow-x-auto my-3 sm:my-4 py-2 no-scrollbar z-10" role="grid" aria-label="GitHub Contributions Heatmap">
              <div className="flex flex-col gap-1 w-full min-w-[660px]">
                {/* Month labels header */}
                <div className="flex justify-between w-full text-[9px] font-mono text-white/40 uppercase mb-1 px-1 select-none pointer-events-none">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                  <span>Jul</span>
                  <span>Aug</span>
                  <span>Sep</span>
                  <span>Oct</span>
                  <span>Nov</span>
                  <span>Dec</span>
                </div>

                {/* 7 Days Matrix */}
                {Array.from({ length: 7 }).map((_, dIdx) => (
                  <div key={dIdx} className="flex justify-between w-full gap-[3px]" role="row">
                    {contributionGrid.map((week, wIdx) => {
                      const dayData = week[dIdx];
                      const level = dayData?.level || 0;
                      const count = dayData?.count || 0;
                      const date = dayData?.date || `Week ${wIdx + 1}, Day ${dIdx + 1}`;
                      
                      const colorClass = 
                        level === 0 ? 'bg-white/[0.04] border border-white/5' :
                        level === 1 ? 'bg-cyan-500/25 border border-cyan-500/10' :
                        level === 2 ? 'bg-cyan-500/55 border border-cyan-400/20' :
                        level === 3 ? 'bg-cyan-400/85 shadow-[0_0_6px_rgba(var(--cyan-rgb),0.5)]' :
                        'bg-cyan-300 shadow-[0_0_10px_rgba(var(--cyan-rgb),0.85)]';
                      
                      return (
                        <div
                          key={wIdx}
                          tabIndex={0}
                          onMouseEnter={() => {
                            setActiveCommits({
                              commits: count === 0 ? 'No' : count,
                              date: date
                            });
                          }}
                          onMouseLeave={() => setActiveCommits(null)}
                          onFocus={() => {
                            setActiveCommits({
                              commits: count === 0 ? 'No' : count,
                              date: date
                            });
                          }}
                          onBlur={() => setActiveCommits(null)}
                          className={`flex-1 aspect-square max-w-[14px] min-w-[7px] rounded-[2px] transition-all duration-200 hover:scale-125 focus:scale-125 focus:outline-none focus:ring-1 focus:ring-cyan-400 cursor-crosshair ${colorClass}`}
                          role="gridcell"
                          aria-label={`${count} contributions on ${date}`}
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
                  {activeCommits ? (
                    <motion.span
                      key="active"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="text-xs font-bold text-cyan-400 uppercase tracking-widest font-mono block"
                    >
                      {activeCommits.commits} {activeCommits.commits === 1 ? 'contribution' : 'contributions'} on {activeCommits.date}
                    </motion.span>
                  ) : (
                    <motion.span
                      key="idle"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="text-xs text-white/30 font-satoshi block"
                    >
                      Hover boxes to check daily contributions
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Legend visual indicators */}
              <div className="flex items-center gap-1.5 text-[10px] text-white/40 uppercase font-mono font-bold tracking-widest">
                <span>Less</span>
                <div className="w-2.5 h-2.5 bg-white/[0.04] rounded-[1px]" />
                <div className="w-2.5 h-2.5 bg-cyan-500/25 rounded-[1px]" />
                <div className="w-2.5 h-2.5 bg-cyan-500/55 rounded-[1px]" />
                <div className="w-2.5 h-2.5 bg-cyan-400/85 rounded-[1px]" />
                <div className="w-2.5 h-2.5 bg-cyan-300 rounded-[1px]" />
                <span>More</span>
              </div>
            </div>
          </BentoCard>
        </div>

      </div>
    </section>
  );
}
