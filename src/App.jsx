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

// Resilient lazy loader with auto-retry and cache mismatch recovery
function lazyWithRetry(componentImport) {
  return lazy(() => {
    return new Promise((resolve, reject) => {
      const hasRefreshed = typeof window !== 'undefined' && window.sessionStorage.getItem('chunk_retry_refreshed');

      componentImport()
        .then((module) => {
          if (typeof window !== 'undefined') {
            window.sessionStorage.removeItem('chunk_retry_refreshed');
          }
          resolve(module);
        })
        .catch((error) => {
          // If chunk fails to fetch (e.g. after a new deployment or network glitch)
          if (!hasRefreshed && typeof window !== 'undefined') {
            window.sessionStorage.setItem('chunk_retry_refreshed', 'true');
            window.location.reload();
          } else {
            console.error('Lazy chunk load failed:', error);
            reject(error);
          }
        });
    });
  });
}

const BentoGrid = lazyWithRetry(() => import('./components/BentoGrid'));
const SkillsSection = lazyWithRetry(() => import('./components/SkillsSection'));
const StatCounters = lazyWithRetry(() => import('./components/StatCounters'));
const ProjectsShowcase = lazyWithRetry(() => import('./components/ProjectsShowcase'));
const TestimonialsSection = lazyWithRetry(() => import('./components/TestimonialsSection'));
const InteractiveTimeline = lazyWithRetry(() => import('./components/InteractiveTimeline'));
const CertificationsSection = lazyWithRetry(() => import('./components/CertificationsSection'));
const Footer = lazyWithRetry(() => import('./components/Footer'));

class SectionErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.warn(`Section Error caught [${this.props.name || 'Component'}]:`, error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full py-12 flex flex-col items-center justify-center text-center px-4">
          <p className="font-satoshi text-xs text-white/40 mb-3">Content temporarily unavailable</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-1.5 rounded-lg bg-white/10 text-white/80 font-syne text-[10px] uppercase font-bold tracking-widest hover:bg-white/20 transition-colors"
          >
            Retry Section
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

class RootErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error('Root Error Boundary caught:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full min-h-screen bg-black flex items-center justify-center text-center px-6">
          <div className="max-w-md">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 font-bold">
              !
            </div>
            <h2 className="font-syne text-xl font-bold text-white mb-2">Portfolio Recovery Mode</h2>
            <p className="font-satoshi text-xs text-white/50 mb-6 leading-relaxed">A temporary resource glitch occurred. Click below to refresh your view with the latest version.</p>
            <button
              onClick={() => {
                window.sessionStorage.clear();
                window.location.reload();
              }}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-white font-syne text-xs uppercase font-bold tracking-widest hover:scale-105 transition-transform shadow-lg cursor-pointer"
            >
              Refresh Application
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
  const [isWindowLoaded, setIsWindowLoaded] = useState(() => {
    return typeof document !== 'undefined' ? document.readyState === 'complete' : false;
  });
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

    if (document.readyState !== 'complete') {
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
    <RootErrorBoundary>
      <div className="w-full bg-black text-white relative min-h-screen">
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-[0]">
          <div className="absolute inset-0 bg-cyber-dots opacity-80" />
          
          <div className="absolute top-[15%] left-[-15%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(var(--cyan-rgb),0.48)_0%,transparent_75%)] blur-[120px] animate-orb-float-1" />
          <div className="absolute bottom-[10%] right-[-15%] w-[55vw] h-[55vw] rounded-full bg-[radial-gradient(circle,rgba(var(--fuchsia-rgb),0.48)_0%,transparent_75%)] blur-[130px] animate-orb-float-2" />
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
          
          <SectionErrorBoundary name="BentoGrid">
            <Suspense fallback={<SectionLoader />}>
              <BentoGrid />
            </Suspense>
          </SectionErrorBoundary>

          <SectionErrorBoundary name="SkillsSection">
            <Suspense fallback={<SectionLoader />}>
              <SkillsSection />
            </Suspense>
          </SectionErrorBoundary>
          
          <SectionErrorBoundary name="StatCounters">
            <Suspense fallback={<SectionLoader />}>
              <StatCounters />
            </Suspense>
          </SectionErrorBoundary>

          <SectionErrorBoundary name="ProjectsShowcase">
            <Suspense fallback={<SectionLoader />}>
              <ProjectsShowcase />
            </Suspense>
          </SectionErrorBoundary>

          <SectionErrorBoundary name="TestimonialsSection">
            <Suspense fallback={<SectionLoader />}>
              <TestimonialsSection />
            </Suspense>
          </SectionErrorBoundary>

          <SectionErrorBoundary name="InteractiveTimeline">
            <Suspense fallback={<SectionLoader />}>
              <InteractiveTimeline />
            </Suspense>
          </SectionErrorBoundary>

          <SectionErrorBoundary name="CertificationsSection">
            <Suspense fallback={<SectionLoader />}>
              <CertificationsSection />
            </Suspense>
          </SectionErrorBoundary>

          <SectionErrorBoundary name="Footer">
            <Suspense fallback={<SectionLoader />}>
              <Footer />
            </Suspense>
          </SectionErrorBoundary>
        </main>
      </div>
    </RootErrorBoundary>
  );
}
