import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play, Pause, Volume2, VolumeX, Send, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

// Reusable BentoCard with 3D Tilt and Spotlight Cursor Follower
function BentoCard({ children, className = '', style = {}, speed = 0, ...props }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    // Disable 3D tilt on touch devices to avoid page jitter
    const isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    if (isTouch) return;

    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate rotation angles based on mouse pointer position relative to center
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5; // Limit to 5 deg tilt
    const rotateY = ((x - centerX) / centerX) * 5;

    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`bento-card spotlight-card border border-white/10 rounded-3xl bg-white/5 backdrop-blur-md shadow-lg overflow-hidden relative group transition-all duration-300 ${className}`}
      style={style}
      data-speed={speed}
      {...props}
    >
      {children}
    </div>
  );
}

// Reusable Magnetic Container for buttons
function MagneticElement({ children, className = '', range = 35, ...props }) {
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    if (isTouch) return;

    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const distance = Math.sqrt(x * x + y * y);
    if (distance < range) {
      // Attract element slightly
      gsap.to(el, {
        x: x * 0.35,
        y: y * 0.35,
        duration: 0.3,
        ease: 'power2.out'
      });
    } else {
      // Elastic snapback
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1.1, 0.4)'
      });
    }
  };

  const handleMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    gsap.to(el, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1.1, 0.4)'
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`inline-block ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default function BentoGrid() {
  const gridRef = useRef(null);

  // States for interactive components
  const [formText, setFormText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  // Web Audio Context & Analyser States
  const [audioCtx, setAudioCtx] = useState(null);
  const [analyser, setAnalyser] = useState(null);

  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const canvasRefMusic = useRef(null);

  // GSAP scroll trigger edge-assembly scroll-scrub animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const wrappers = gridRef.current.querySelectorAll('.bento-wrapper');
      if (wrappers.length < 7) return;

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

      // Card 6 (Music) -> Left Edge
      tl.fromTo(wrappers[5],
        { x: -shiftX, opacity: 0, scale: 0.8 },
        { x: 0, opacity: 1, scale: 1, ease: 'power2.out' },
        0.2
      );

      // Card 7 (Heatmap) -> Bottom Edge
      tl.fromTo(wrappers[6],
        { y: shiftY, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, ease: 'power2.out' },
        0.2
      );
    }, gridRef);

    return () => ctx.revert();
  }, []);

  // Web Audio Visualizer Drawing Loop
  useEffect(() => {
    if (!isMusicPlaying || !analyser || !canvasRefMusic.current) return;
    const canvas = canvasRefMusic.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animId = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Render 16 responsive bars
      const barWidth = (w / 16);
      let x = 0;

      for (let i = 0; i < 16; i++) {
        // Read and scale frequency data
        const val = dataArray[i * 2] || 0;
        const barHeight = Math.max(3, (val / 255) * h * 0.9);

        const grad = ctx.createLinearGradient(0, h, 0, h - barHeight);
        grad.addColorStop(0, 'rgba(34, 211, 238, 0.4)'); // Cyan bottom
        grad.addColorStop(1, '#d946ef'); // Fuchsia top

        ctx.fillStyle = grad;
        ctx.fillRect(x, h - barHeight, barWidth - 1.5, barHeight);

        x += barWidth;
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isMusicPlaying, analyser]);

  // Form submit handler to submit messages using Web3Forms
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formText.trim()) return;
    
    setIsSubmitted(true);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: '0289a0fa-c81b-4b2a-bad8-d069a7c376bb', // Public-facing access key
          name: 'Anonymous Portfolio Visitor',
          email: 'no-reply@portfolio.com',
          message: formText,
          subject: 'New Message from Shaik Hasnain Portfolio'
        })
      });
      const data = await response.json();
      if (data.success) {
        console.log("Message successfully transmitted to Web3Forms.");
      }
    } catch (err) {
      console.error("Web3Forms submission failed:", err);
    }

    setTimeout(() => {
      setIsSubmitted(false);
      setFormText('');
    }, 4000);
  };

  // Music Player play/pause toggle & Web Audio initializer
  const toggleMusic = () => {
    if (!audioRef.current) return;

    let activeCtx = audioCtx;
    if (!activeCtx) {
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContextClass();
        const analyserNode = ctx.createAnalyser();
        analyserNode.fftSize = 64; // Yields 32 bins

        const source = ctx.createMediaElementSource(audioRef.current);
        source.connect(analyserNode);
        analyserNode.connect(ctx.destination);

        setAudioCtx(ctx);
        setAnalyser(analyserNode);
        activeCtx = ctx;
      } catch (err) {
        console.warn("Web Audio Context initialization blocked or unsupported:", err);
      }
    }

    if (isMusicPlaying) {
      audioRef.current.pause();
      setIsMusicPlaying(false);
    } else {
      if (activeCtx && activeCtx.state === 'suspended') {
        activeCtx.resume();
      }
      audioRef.current.play().then(() => {
        setIsMusicPlaying(true);
      }).catch(err => {
        console.error("Audio playback blocked by browser settings.", err);
      });
    }
  };

  // Video mute/unmute toggle
  const toggleVideoMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsVideoMuted(videoRef.current.muted);
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
    { name: 'GitHub', src: 'https://unpkg.com/simple-icons@v9/icons/github.svg', isInverted: true },
    { name: 'Unreal Engine', src: 'https://unpkg.com/simple-icons@v9/icons/unrealengine.svg', isInverted: true },
    { name: 'Framer', src: '/framer_logo_icon_169149.webp', isInverted: false },
    { name: 'Spline', src: '/spline_logo.webp', isInverted: false }
  ];

  const duplicatedTools = [...tools, ...tools];

  // Simulated GitHub Contribution Grid data generator
  const [activeCommits, setActiveCommits] = useState(null);
  const contributionGrid = useRef([]);
  
  if (contributionGrid.current.length === 0) {
    const days = 7;
    const weeks = 48; // Fits desktop layout nicely
    const list = [];
    for (let w = 0; w < weeks; w++) {
      const weekCols = [];
      for (let d = 0; d < days; d++) {
        // Random activity weight
        const val = Math.random() > 0.4 ? Math.floor(Math.random() * 8) : 0;
        weekCols.push(val);
      }
      list.push(weekCols);
    }
    contributionGrid.current = list;
  }

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
          <BentoCard
            className="w-full h-full flex flex-col justify-center"
          >
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
          <BentoCard
            className="w-full h-full p-6 md:p-8 flex flex-col justify-between"
          >
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
            <form onSubmit={handleFormSubmit} className="relative z-20 w-full flex items-center gap-2 mt-6">
              <input
                type="text"
                placeholder="Drop a quick message..."
                value={formText}
                onChange={(e) => setFormText(e.target.value)}
                className="flex-grow bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.3)] outline-none transition-all duration-300"
              />
              <MagneticElement>
                <button
                  type="submit"
                  className="bg-white text-black hover:bg-cyan-400 hover:text-black transition-all duration-300 font-bold px-4 py-3 rounded-xl flex items-center justify-center gap-2 text-sm shrink-0"
                >
                  <span className="hidden sm:inline">Send</span>
                  <Send size={14} />
                </button>
              </MagneticElement>
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

        {/* CARD 3: Tools Marquee (6 cols, 1 row) */}
        <div className="bento-wrapper col-span-12 md:col-span-6 row-span-1">
          <BentoCard
            className="w-full h-full flex flex-col justify-center"
          >
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

        {/* CARD 4: Profile Picture (2 cols, 2 rows) */}
        <div className="bento-wrapper col-span-12 md:col-span-2 row-span-2">
          <BentoCard
            className="w-full h-full"
          >
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

        {/* CARD 5: Video Card (4 cols, 2 rows) */}
        <div className="bento-wrapper col-span-12 md:col-span-4 row-span-2">
          <BentoCard
            className="w-full h-full"
          >
            <video
              ref={videoRef}
              src="/carchase.mp4"
              loop
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover transition-transform duration-75"
            />
            <div className="absolute inset-0 bg-black/40 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

            {/* Mute/Unmute Control */}
            <MagneticElement className="absolute bottom-4 right-4 z-20">
              <button
                onClick={toggleVideoMute}
                className="bg-black/60 hover:bg-cyan-400 text-white hover:text-black p-3 rounded-full backdrop-blur-md border border-white/15 transition-all duration-300 hover:scale-110 active:scale-90"
                aria-label={isVideoMuted ? 'Unmute video preview' : 'Mute video preview'}
              >
                {isVideoMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            </MagneticElement>

            <div className="absolute bottom-4 left-4 text-left pointer-events-none z-10">
              <span className="text-[10px] font-bold tracking-widest text-cyan-400 uppercase">SIMULATION</span>
              <h4 className="font-syne text-sm font-bold text-white tracking-tight">Looping Chase</h4>
            </div>
          </BentoCard>
        </div>

        {/* CARD 6: Music Player (6 cols, 1 row) */}
        <div className="bento-wrapper col-span-12 md:col-span-6 row-span-1">
          <BentoCard
            className="w-full h-full p-4 flex items-center justify-between"
          >
            {/* Hidden HTML5 Audio Element */}
            <audio ref={audioRef} src="/NEFFEX_-_Best_of_Me_(mp3.pm).mp3" loop crossOrigin="anonymous" />

            {/* Blurred Background Art */}
            <div
              className="absolute inset-0 bg-cover bg-center filter blur-3xl opacity-20 pointer-events-none transition-transform duration-[10s] group-hover:scale-125"
              style={{ backgroundImage: "url('/songpic.webp')" }}
            />

            <div className="flex items-center gap-4 relative z-10">
              {/* Album Cover Art */}
              <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-white/10 relative group/art shadow-md">
                <img src="/songpic.webp" alt="Album Cover" className="w-full h-full object-cover" />
                <MagneticElement className="absolute inset-0">
                  <button
                    onClick={toggleMusic}
                    className="w-full h-full bg-black/60 flex items-center justify-center opacity-0 group-hover/art:opacity-100 transition-opacity duration-300"
                    aria-label={isMusicPlaying ? 'Pause NEFFEX Soundtrack' : 'Play NEFFEX Soundtrack'}
                  >
                    {isMusicPlaying ? <Pause size={20} className="text-white" /> : <Play size={20} className="text-white" />}
                  </button>
                </MagneticElement>
              </div>

              {/* Title / Artist */}
              <div className="text-left">
                <h4 className="font-syne text-sm md:text-base font-bold text-white tracking-tight leading-tight">
                  Best of Me
                </h4>
                <p className="font-satoshi text-xs text-white/50 mt-0.5">
                  NEFFEX
                </p>

                <div className="flex items-center gap-1.5 mt-2 text-cyan-400 text-[10px] tracking-wider uppercase font-extrabold">
                  <Music size={10} className={isMusicPlaying ? 'animate-spin' : ''} />
                  <span>SOUNDTRACK</span>
                </div>
              </div>
            </div>

            {/* Equalizer Waveform Canvas (Web Audio interactive) */}
            <div className="flex items-center justify-center h-8 px-4 relative z-10 shrink-0">
              <canvas 
                ref={canvasRefMusic} 
                width={80} 
                height={32} 
                className="w-20 h-8 opacity-90 transition-opacity duration-300"
                aria-label="Real-time frequency visualizer"
              />
            </div>

            {/* Control Play Button */}
            <MagneticElement className="mr-2 z-20 shrink-0">
              <button
                onClick={toggleMusic}
                className="bg-white/10 hover:bg-white text-white hover:text-black p-3 rounded-full backdrop-blur-md border border-white/10 transition-all duration-300 hover:scale-105 active:scale-95"
                aria-label={isMusicPlaying ? 'Pause Music' : 'Play Music'}
              >
                {isMusicPlaying ? <Pause size={14} /> : <Play size={14} />}
              </button>
            </MagneticElement>
          </BentoCard>
        </div>

        {/* CARD 7: GitHub Heatmap Card (12 cols, 2 rows) */}
        <div className="bento-wrapper col-span-12 row-span-2">
          <BentoCard
            className="w-full h-full p-6 md:p-8 flex flex-col justify-between"
          >
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
                  <span className="text-white block font-bold text-base">450+</span>
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
            <div className="relative w-full overflow-x-auto my-6 py-2 no-scrollbar z-10">
              <div className="flex flex-col gap-[3px] min-w-[700px]">
                {Array.from({ length: 7 }).map((_, dIdx) => (
                  <div key={dIdx} className="flex gap-[3px]">
                    {contributionGrid.current.map((week, wIdx) => {
                      const weight = week[dIdx];
                      // Map weight value to neon shades
                      const colorClass = 
                        weight === 0 ? 'bg-white/[0.04] border border-white/5' :
                        weight < 3 ? 'bg-cyan-500/25 border border-cyan-500/10' :
                        weight < 6 ? 'bg-cyan-500/60 border border-cyan-400/20' :
                        'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.7)]';
                      
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
