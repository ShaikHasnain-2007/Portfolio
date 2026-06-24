import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Linkedin, Mail, ChevronDown } from 'lucide-react';
import SplitText from './SplitText';

const TOTAL_FRAMES = 165;
const FIRST_BATCH_SIZE = 30;

// Custom hook to scramble text with random characters before settling on the target text
function useTextScramble(targetText, active = true, speed = 35, delay = 0) {
  const [text, setText] = useState('');

  useEffect(() => {
    if (!active) return;
    
    let isCancelled = false;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+~`|}{[]:;?><,./-';
    let frame = 0;
    const duration = 20; // total animation frames to resolve
    let timeoutId = null;
    let rAFId = null;
    
    const run = () => {
      if (isCancelled) return;
      frame++;
      
      const progress = frame / duration;
      if (progress >= 1) {
        setText(targetText);
        return;
      }

      let result = '';
      for (let i = 0; i < targetText.length; i++) {
        if (targetText[i] === ' ') {
          result += ' ';
          continue;
        }
        
        const charProgress = i / targetText.length;
        if (progress > charProgress) {
          result += targetText[i];
        } else {
          result += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      setText(result);
      timeoutId = setTimeout(() => {
        rAFId = requestAnimationFrame(run);
      }, 1000 / speed);
    };

    const delayTimeout = setTimeout(() => {
      rAFId = requestAnimationFrame(run);
    }, delay * 1000);

    return () => {
      isCancelled = true;
      clearTimeout(delayTimeout);
      if (timeoutId) clearTimeout(timeoutId);
      if (rAFId) cancelAnimationFrame(rAFId);
    };
  }, [targetText, active, speed, delay]);

  return text;
}

export default function HeroCanvas({ onProgress, onReady, startAnimations }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const [isReady, setIsReady] = useState(false);
  const frameIndexRef = useRef(0);

  // Refs for 3D Parallax scrolling overlays
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const navRef = useRef(null);
  const contactRef = useRef(null);
  const vignetteRef = useRef(null);

  // Scramble developer name branding
  const scrambledBrandName = useTextScramble("Shaik Hasnain.", startAnimations, 35, 0.5);

  // Progressive batch loader
  useEffect(() => {
    // Array to hold images
    imagesRef.current = new Array(TOTAL_FRAMES);

    const loadBatch = (start, end) => {
      return new Promise((resolve) => {
        let loadedInBatch = 0;
        const batchSize = end - start + 1;
        if (batchSize <= 0) {
          resolve();
          return;
        }

        for (let i = start; i <= end; i++) {
          const img = new Image();
          img.src = `/frames/frame_${String(i).padStart(3, '0')}_delay-0.042s.webp`;
          img.onload = () => {
            imagesRef.current[i] = img;
            loadedInBatch++;

            // Calculate progress for user feedback
            if (start === 0 && onProgress) {
              onProgress(Math.round((loadedInBatch / FIRST_BATCH_SIZE) * 100));
            }

            if (loadedInBatch === batchSize) {
              resolve();
            }
          };
          img.onerror = () => {
            loadedInBatch++;
            if (start === 0 && onProgress) {
              onProgress(Math.round((loadedInBatch / FIRST_BATCH_SIZE) * 100));
            }
            if (loadedInBatch === batchSize) {
              resolve();
            }
          };
        }
      });
    };

    // Load first batch immediately (0 to 29)
    loadBatch(0, FIRST_BATCH_SIZE - 1).then(() => {
      setIsReady(true);
      if (onReady) onReady();

      // Draw the first frame
      const firstImg = imagesRef.current[0];
      if (firstImg) {
        requestAnimationFrame(() => drawImage(firstImg));
      }

      // Load remaining frames in batches of 30 in the background
      const loadBackgroundBatches = async () => {
        const batchSize = 30;
        for (let start = FIRST_BATCH_SIZE; start < TOTAL_FRAMES; start += batchSize) {
          const end = Math.min(start + batchSize - 1, TOTAL_FRAMES - 1);
          await loadBatch(start, end);
        }
      };

      loadBackgroundBatches();
    });
  }, []);

  // Canvas drawing function with cover scaling
  const drawImage = (img) => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    const imgW = img.naturalWidth || 1920;
    const imgH = img.naturalHeight || 1080;

    const canvasRatio = w / h;
    const imgRatio = imgW / imgH;

    let drawW = w;
    let drawH = h;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
      drawH = w / imgRatio;
      offsetY = (h - drawH) / 2;
    } else {
      drawW = h * imgRatio;
      offsetX = (w - drawW) / 2;
    }

    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
  };

  // Resize listener
  useEffect(() => {
    let resizeAnimationFrameId = null;

    const handleResize = () => {
      if (resizeAnimationFrameId) return;

      resizeAnimationFrameId = requestAnimationFrame(() => {
        resizeAnimationFrameId = null;

        // Ignore height-only resizing on mobile (like address bar toggles) to prevent scroll jitter
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
          const lastWidth = canvasRef.current?._lastWidth || 0;
          if (lastWidth === window.innerWidth) return;
        }

        if (canvasRef.current) {
          canvasRef.current._lastWidth = window.innerWidth;
        }

        const currentImg = imagesRef.current[frameIndexRef.current];
        if (currentImg) {
          drawImage(currentImg);
        }
      });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeAnimationFrameId) cancelAnimationFrame(resizeAnimationFrameId);
    };
  }, []);

  // GSAP ScrollTrigger animation with gsap.context
  useEffect(() => {
    if (!startAnimations) return;

    const ctx = gsap.context(() => {
      const obj = { frame: 0 };

      // Scroll trigger sequence timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
          onUpdate: () => {
            const index = Math.round(obj.frame);
            frameIndexRef.current = index;
            let img = imagesRef.current[index];

            // Fallback for failed/unloaded images - search for nearest loaded frame
            if (!img) {
              let offset = 1;
              while (index - offset >= 0 || index + offset < TOTAL_FRAMES) {
                if (index - offset >= 0 && imagesRef.current[index - offset]) {
                  img = imagesRef.current[index - offset];
                  break;
                }
                if (index + offset < TOTAL_FRAMES && imagesRef.current[index + offset]) {
                  img = imagesRef.current[index + offset];
                  break;
                }
                offset++;
              }
            }

            if (img) {
              drawImage(img);
            }
          },
        }
      });

      // Animate canvas frame sequence
      tl.to(obj, {
        frame: TOTAL_FRAMES - 1,
        ease: 'none'
      }, 0);

      // Parallax branding/navigation elements sliding up/out
      if (navRef.current) {
        tl.to(navRef.current, {
          y: -100,
          opacity: 0,
          ease: 'none'
        }, 0);
      }

      if (contactRef.current) {
        tl.to(contactRef.current, {
          y: -120,
          opacity: 0,
          ease: 'none'
        }, 0);
      }

      // Parallax main title drifting up faster (creates 3D parallax separation from canvas)
      if (titleRef.current) {
        tl.to(titleRef.current, {
          y: -240,
          scale: 1.06,
          opacity: 0.05,
          ease: 'none'
        }, 0);
      }

      // Parallax description drifting down/out
      if (descRef.current) {
        tl.to(descRef.current, {
          y: 160,
          opacity: 0,
          ease: 'none'
        }, 0);
      }

      // Parallax vignette scaling down
      if (vignetteRef.current) {
        tl.to(vignetteRef.current, {
          opacity: 0.3,
          ease: 'none'
        }, 0);
      }
    }, containerRef);

    // Refresh ScrollTrigger to ensure geometry recalculation
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      ctx.revert();
    };
  }, [startAnimations]);

  return (
    <div
      id="hero"
      ref={containerRef}
      className={`relative w-full ${startAnimations ? 'h-[800vh]' : 'h-screen overflow-hidden'}`}
    >
      {/* Sticky Frame Wrapper */}
      <div className="sticky top-0 left-0 w-full h-screen bg-black overflow-hidden select-none">

        {/* Canvas for sequence rendering */}
        <div className="absolute inset-0 w-full h-full saturate-[1.25]">
          <canvas 
            ref={canvasRef} 
            className="block w-full h-full object-cover" 
            role="img"
            aria-label="3D background animation rendering sequence of a computer workspace"
          />
        </div>

        {/* Poster Image Overlay */}
        <div
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out pointer-events-none ${isReady ? 'opacity-0' : 'opacity-100'}`}
          style={{ backgroundImage: "url('/video-poster.webp')" }}
        />

        {/* Lighting & Vignette Overlays */}
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
        <div
          ref={vignetteRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, transparent 50%, rgba(0,0,0,0.4) 100%)'
          }}
        />
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

        {/* UI Overlay Content */}
        {startAnimations && (
          <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-12 text-white">

            {/* Top Row: Links and Branding */}
            <div className="flex justify-between items-start w-full">
              <div ref={navRef} className="font-syne text-xl font-bold tracking-tight uppercase">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
                  {scrambledBrandName || "Shaik Hasnain."}
                </span>
              </div>

              {/* Top-Right vertical contact stack */}
              <div ref={contactRef} className="flex flex-col gap-4 font-satoshi text-sm items-end">
                <a
                  href="https://linkedin.com/in/shaik-hasnain-55a072396"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/70 hover:text-cyan-400 transition-colors duration-300 group"
                >
                  <span className="hidden md:inline group-hover:underline">LinkedIn</span>
                  <Linkedin size={18} className="text-white group-hover:text-cyan-400 transition-colors" />
                </a>
                <a
                  href="mailto:shaikhasnain2007@gmail.com"
                  className="flex items-center gap-2 text-white/70 hover:text-fuchsia-400 transition-colors duration-300 group"
                >
                  <span className="hidden md:inline group-hover:underline">Email</span>
                  <Mail size={18} className="text-white group-hover:text-fuchsia-400 transition-colors" />
                </a>
              </div>
            </div>

            {/* Bottom Row: Title and scroll prompt */}
            <div className="flex flex-col md:flex-row justify-between items-end w-full gap-8 md:gap-4 pb-8 md:pb-0">

              {/* Bottom-Left: Title */}
              <div ref={titleRef} className="w-full md:max-w-xl text-left">
                <h1 className="font-syne font-extrabold text-5xl sm:text-6xl md:text-8xl uppercase tracking-tighter leading-none mb-2 select-text cursor-default inline-block">
                  <SplitText text="AI/ML" type="chars" stagger={0.03} delay={1.4} /> <br />
                  <SplitText
                    text="Engineer"
                    type="chars"
                    stagger={0.03}
                    delay={1.65}
                    className="text-cyan-400"
                  />
                </h1>
              </div>

              {/* Bottom-Right: Description and Scroll Prompt */}
              <div ref={descRef} className="flex flex-col items-start md:items-end text-left md:text-right gap-4 font-satoshi max-w-sm">
                <p className="text-white/80 text-sm md:text-base leading-relaxed">
                  Crafting high-performance intelligent interfaces and immersive graphics simulations. Scroll to explore the details.
                </p>

                {/* Scroll Indicator */}
                <div className="flex items-center gap-2 text-cyan-400 text-xs tracking-widest uppercase font-bold animate-pulse">
                  <span className="md:hidden">Scroll</span>
                  <span className="hidden md:inline">Scroll Down</span>
                  <div className="p-2 border border-cyan-400/40 rounded-full flex items-center justify-center">
                    <ChevronDown size={14} className="animate-bounce" />
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
