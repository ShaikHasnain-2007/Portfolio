import React, { useEffect, useRef, useState, useCallback, Suspense, lazy } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import HeroCanvas from './components/HeroCanvas';
import NetworkPreloader from './components/NetworkPreloader';

import Navbar from './components/Navbar';
import CustomCursor from './components/CustomCursor';
import ScrollProgress from './components/ScrollProgress';
import AIChatWidget from './components/AIChatWidget';
import MarqueeStrip from './components/MarqueeStrip';

const BentoGrid = lazy(() => import('./components/BentoGrid'));
const SkillsSection = lazy(() => import('./components/SkillsSection'));
const StatCounters = lazy(() => import('./components/StatCounters'));
const ProjectsShowcase = lazy(() => import('./components/ProjectsShowcase'));
const TestimonialsSection = lazy(() => import('./components/TestimonialsSection'));
const InteractiveTimeline = lazy(() => import('./components/InteractiveTimeline'));
const CertificationsSection = lazy(() => import('./components/CertificationsSection'));
const Footer = lazy(() => import('./components/Footer'));

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error('Portfolio Error Boundary caught:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-screen bg-black flex items-center justify-center text-center px-6">
          <div>
            <h2 className="font-syne text-2xl font-bold text-white mb-3">Something went wrong</h2>
            <p className="font-satoshi text-sm text-white/50 mb-6">An unexpected error occurred while rendering this section.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-white font-syne text-xs uppercase font-bold tracking-widest hover:scale-105 transition-transform"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function SectionLoader() {
  return (
    <div className="w-full py-20 flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [preloaderFinished, setPreloaderFinished] = useState(false);
  const [isWindowLoaded, setIsWindowLoaded] = useState(false);
  const lenisRef = useRef(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('portfolio-theme') || 'cyberpunk';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  useEffect(() => {
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
    window.lenis = lenis;

    lenis.stop();

    lenis.on('scroll', () => {
      ScrollTrigger.update();
    });

    const gsapTicker = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(gsapTicker);

    gsap.ticker.lagSmoothing(0);

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

  useEffect(() => {
    if (preloaderFinished && lenisRef.current) {
      lenisRef.current.start();
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);
    }
  }, [preloaderFinished]);

  const handlePreloaderDismissed = useCallback(() => {
    setPreloaderFinished(true);
  }, []);

  const isPreloaderReady = isReady && isWindowLoaded;

  return (
    <ErrorBoundary>
      <div className="w-full bg-black text-white relative min-h-screen">
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-[0]">
          <div className="absolute inset-0 bg-cyber-dots opacity-80" />
          
          <div className="absolute top-[15%] left-[-15%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(var(--cyan-rgb),0.22)_0%,transparent_70%)] blur-[120px] animate-orb-float-1" />
          <div className="absolute bottom-[10%] right-[-15%] w-[55vw] h-[55vw] rounded-full bg-[radial-gradient(circle,rgba(var(--fuchsia-rgb),0.22)_0%,transparent_70%)] blur-[130px] animate-orb-float-2" />
        </div>

        {!preloaderFinished && (
          <NetworkPreloader
            progress={loadingProgress}
            isReady={isPreloaderReady}
            onDismissed={handlePreloaderDismissed}
          />
        )}

        {preloaderFinished && (
          <>
            <Navbar />
            <CustomCursor />
          </>
        )}
        
        <ScrollProgress />
        <AIChatWidget />

        <main id="main-content" className="w-full">
          <HeroCanvas
            onProgress={setLoadingProgress}
            onReady={() => setIsReady(true)}
            startAnimations={preloaderFinished}
          />
          
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
          
          <Suspense fallback={<SectionLoader />}>
            <BentoGrid />
          </Suspense>

          <Suspense fallback={<SectionLoader />}>
            <SkillsSection />
          </Suspense>
          
          <Suspense fallback={<SectionLoader />}>
            <StatCounters />
          </Suspense>

          <Suspense fallback={<SectionLoader />}>
            <ProjectsShowcase />
          </Suspense>

          <Suspense fallback={<SectionLoader />}>
            <TestimonialsSection />
          </Suspense>

          <Suspense fallback={<SectionLoader />}>
            <InteractiveTimeline />
          </Suspense>

          <Suspense fallback={<SectionLoader />}>
            <CertificationsSection />
          </Suspense>

          <Suspense fallback={<SectionLoader />}>
            <Footer />
          </Suspense>
        </main>
      </div>
    </ErrorBoundary>
  );
}
