import React, { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Components
import HeroCanvas from './components/HeroCanvas';
import BentoGrid from './components/BentoGrid';
import SkillsSection from './components/SkillsSection';
import StatCounters from './components/StatCounters';
import ProjectsShowcase from './components/ProjectsShowcase';
import InteractiveTimeline from './components/InteractiveTimeline';
import Footer from './components/Footer';

// Overlays & Dividers
import CustomCursor from './components/CustomCursor';
import ScrollProgress from './components/ScrollProgress';
import AIChatWidget from './components/AIChatWidget';
import MarqueeStrip from './components/MarqueeStrip';
import NetworkPreloader from './components/NetworkPreloader';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [preloaderFinished, setPreloaderFinished] = useState(false);
  const [isWindowLoaded, setIsWindowLoaded] = useState(false);
  const lenisRef = useRef(null);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    // Lock scrolling initially
    lenis.stop();

    // Update ScrollTrigger on scroll
    lenis.on('scroll', () => {
      ScrollTrigger.update();
    });

    // Sync Lenis RAF with GSAP ticker
    const gsapTicker = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(gsapTicker);

    // Disable lag smoothing in GSAP to keep animations perfectly tight
    gsap.ticker.lagSmoothing(0);

    // Track window load state
    const handleLoad = () => {
      setIsWindowLoaded(true);
    };

    if (document.readyState === 'complete') {
      setIsWindowLoaded(true);
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      lenis.destroy();
      gsap.ticker.remove(gsapTicker);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  // Unlock scrolling once preloader fades out
  useEffect(() => {
    if (preloaderFinished && lenisRef.current) {
      lenisRef.current.start();
      // Recalculate ScrollTrigger measurements once page layout is stable
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);
    }
  }, [preloaderFinished]);

  // Preloader is fully ready only when both Hero canvas frames load AND the browser window reports complete (images/fonts/scripts loaded)
  const isPreloaderReady = isReady && isWindowLoaded;

  return (
    <div className="w-full bg-black text-white relative min-h-screen">
      {/* Premium Network Preloader */}
      {!preloaderFinished && (
        <NetworkPreloader
          progress={loadingProgress}
          isReady={isPreloaderReady}
          onDismissed={() => setPreloaderFinished(true)}
        />
      )}

      {/* Global Interactive Systems - mounted only after preloader for performance */}
      {preloaderFinished && (
        <>
          <CustomCursor />
        </>
      )}
      
      <ScrollProgress />
      <AIChatWidget />

      {/* Page Content */}
      <div className="w-full">
        {/* Hero Section (Contains canvas sequence) */}
        <HeroCanvas
          onProgress={setLoadingProgress}
          onReady={() => setIsReady(true)}
          startAnimations={preloaderFinished}
        />
        
        {/* Infinite Neon Marquee Divider */}
        <MarqueeStrip 
          texts={[
            'AI/ML ENGINEER', 
            'GAME DEVELOPER', 
            'SRM UNIVERSITY AP', 
            'HACKATHON WINNER', 
            'CREATIVE CODER', 
            'IMMERSIVE DESIGNS'
          ]}
          speed="medium"
          color="cyan"
        />
        
        {/* Static content sections */}
        <BentoGrid />
        <SkillsSection />
        
        <StatCounters />

        {/* Projects Showcase */}
        <ProjectsShowcase />

        <InteractiveTimeline />
        <Footer />
      </div>
    </div>
  );
}
