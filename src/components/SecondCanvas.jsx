import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SecondCanvas() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Parallax overlay refs
  const textRef1 = useRef(null);
  const textRef2 = useRef(null);
  const cardOverlayRef = useRef(null);

  // Canvas cover rendering logic
  const drawVideoFrame = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video || !videoLoaded) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    // Use video native aspect ratio
    const videoW = video.videoWidth || 1920;
    const videoH = video.videoHeight || 1080;

    const canvasRatio = w / h;
    const videoRatio = videoW / videoH;

    let drawW = w;
    let drawH = h;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > videoRatio) {
      drawH = w / videoRatio;
      offsetY = (h - drawH) / 2;
    } else {
      drawW = h * videoRatio;
      offsetX = (w - drawW) / 2;
    }

    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(video, offsetX, offsetY, drawW, drawH);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setVideoLoaded(true);
      // Draw initial frame once loaded
      setTimeout(drawVideoFrame, 150);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    // In case already loaded in cache
    if (video.readyState >= 1) {
      handleLoadedMetadata();
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  // Update canvas on video updates (seeking)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoLoaded) return;

    const handleSeeked = () => {
      requestAnimationFrame(drawVideoFrame);
    };

    video.addEventListener('seeked', handleSeeked);
    video.addEventListener('timeupdate', handleSeeked);

    return () => {
      video.removeEventListener('seeked', handleSeeked);
      video.removeEventListener('timeupdate', handleSeeked);
    };
  }, [videoLoaded]);

  // Window resize sync
  useEffect(() => {
    const handleResize = () => {
      if (videoLoaded) {
        drawVideoFrame();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [videoLoaded]);

  // Scroll scrubbing sync using ScrollTrigger
  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video || !videoLoaded) return;

    // Direct scrub of video current time
    const scrollObj = { currentTime: 0 };
    const duration = video.duration || 10;

    // Sync scroll triggers
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.0, // Slight smooth lag on time scrubbing for beautiful deceleration
        onUpdate: (self) => {
          // Set video time based on scroll progress
          if (video.duration) {
            const targetTime = self.progress * (video.duration - 0.1); // Keep slightly off end to prevent loop snap
            video.currentTime = targetTime;
          }
        }
      }
    });

    // Parallax text and overlay animations
    if (textRef1.current) {
      tl.to(textRef1.current, {
        y: -120,
        opacity: 0,
        ease: 'none'
      }, 0);
    }

    if (textRef2.current) {
      tl.to(textRef2.current, {
        y: -250,
        scale: 1.08,
        opacity: 0,
        ease: 'none'
      }, 0);
    }

    if (cardOverlayRef.current) {
      tl.to(cardOverlayRef.current, {
        y: 180,
        opacity: 0.1,
        ease: 'none'
      }, 0);
    }

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [videoLoaded]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[350vh] bg-black"
    >
      {/* Hidden native HTML5 video element */}
      <video
        ref={videoRef}
        src="/carchase.mp4"
        preload="auto"
        muted
        playsInline
        className="hidden"
      />

      {/* Sticky Canvas Viewport */}
      <div className="sticky top-0 left-0 w-full h-screen bg-black overflow-hidden select-none z-10">
        
        {/* Canvas renderer with cyberpunk color styling filter */}
        <div className="absolute inset-0 w-full h-full saturate-[1.3] hue-rotate-[10deg] brightness-[0.85]">
          <canvas ref={canvasRef} className="block w-full h-full object-cover" />
        </div>

        {/* Ambient Dark Overlays */}
        <div className="absolute inset-0 bg-black/30 pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.7) 100%)'
          }}
        />
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black to-transparent pointer-events-none" />

        {/* Parallax Content Layers */}
        <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-12 text-white z-20">
          
          {/* Top Label */}
          <div ref={textRef1} className="w-full flex justify-between items-start">
            <div>
              <span className="text-cyan-400 text-xs font-bold tracking-widest uppercase font-satoshi">SIMULATION ENGINE</span>
              <h3 className="font-syne text-lg font-bold uppercase mt-1">Intelligent Physics</h3>
            </div>
            <div className="text-right">
              <span className="text-white/40 text-xs uppercase tracking-widest font-satoshi">Scrubbing Mode</span>
            </div>
          </div>

          {/* Core Visual Header (Center) */}
          <div ref={textRef2} className="flex flex-col items-center justify-center my-auto text-center w-full max-w-2xl mx-auto">
            <h2 className="font-syne font-extrabold text-4xl md:text-7xl uppercase tracking-tighter leading-none mb-4">
              CYBERNETIC <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
                CHASE
              </span>
            </h2>
            <p className="font-satoshi text-sm md:text-base text-white/70 max-w-md">
              Real-time frame evaluation displaying fluid tracking mechanics, vectorized navigation meshes, and physics integration.
            </p>
          </div>

          {/* Bottom Card details */}
          <div ref={cardOverlayRef} className="w-full flex justify-between items-end">
            <div className="bg-black/60 border border-white/10 backdrop-blur-md p-5 rounded-2xl max-w-sm text-left">
              <span className="text-[10px] font-bold text-fuchsia-500 tracking-wider uppercase font-syne">Vectorization</span>
              <h4 className="font-syne font-bold text-sm text-white mt-1">Autonomous Trajectory</h4>
              <p className="font-satoshi text-xs text-white/50 mt-2 leading-relaxed">
                Evaluating structural tracking sequences dynamically linked to scroll physics and screen coordinate frames.
              </p>
            </div>
            <div className="hidden md:block">
              <span className="font-syne text-xs uppercase tracking-widest text-white/20">Frame-Seek / Synced</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
