import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, Move3d, Activity, Cpu } from 'lucide-react';

export default function HolographicCore() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [telemetry, setTelemetry] = useState({ rotX: 0, rotY: 0, active: true });
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let width = container.clientWidth || 400;
    let height = container.clientHeight || 340;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 7.5;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 3. Create Circular Glow Point Texture programmatically
    const createGlowTexture = () => {
      const size = 128;
      const cvs = document.createElement('canvas');
      cvs.width = size;
      cvs.height = size;
      const ctx = cvs.getContext('2d');

      const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.2, 'rgba(0, 240, 255, 0.9)');
      grad.addColorStop(0.5, 'rgba(217, 70, 239, 0.4)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);

      const texture = new THREE.CanvasTexture(cvs);
      texture.needsUpdate = true;
      return texture;
    };

    const pointTexture = createGlowTexture();

    // 4. Main Hologram Object Group
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // 5. Fibonacci Lattice Particle Sphere (2,200 nodes)
    const particleCount = 2200;
    const sphereRadius = 2.3;
    const originalPositions = new Float32Array(particleCount * 3);
    const currentPositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const cyan = new THREE.Color('#00F0FF');
    const fuchsia = new THREE.Color('#D946EF');
    const amber = new THREE.Color('#F59E0B');

    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    for (let i = 0; i < particleCount; i++) {
      const y = 1 - (i / (particleCount - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      // Small jitter for organic depth
      const jitter = (Math.random() - 0.5) * 0.08;
      const posX = (x + jitter) * sphereRadius;
      const posY = (y + jitter) * sphereRadius;
      const posZ = (z + jitter) * sphereRadius;

      originalPositions[i * 3] = posX;
      originalPositions[i * 3 + 1] = posY;
      originalPositions[i * 3 + 2] = posZ;

      currentPositions[i * 3] = posX;
      currentPositions[i * 3 + 1] = posY;
      currentPositions[i * 3 + 2] = posZ;

      // Interpolate colors: top cyan, middle fuchsia, bottom amber/cyan
      const t = (y + 1) / 2;
      const mixedColor = new THREE.Color();
      if (t > 0.5) {
        mixedColor.lerpColors(fuchsia, cyan, (t - 0.5) * 2);
      } else {
        mixedColor.lerpColors(amber, fuchsia, t * 2);
      }

      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.14,
      map: pointTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particleSphere = new THREE.Points(particleGeometry, particleMaterial);
    coreGroup.add(particleSphere);

    // 6. Inner Geometric Core (Wireframe Icosahedron)
    const icoGeo = new THREE.IcosahedronGeometry(1.2, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0x00F0FF,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending
    });
    const innerCore = new THREE.Mesh(icoGeo, icoMat);
    coreGroup.add(innerCore);

    // 7. Center Quantum Singularity (Small pulsing core)
    const centerGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const centerMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const centerCore = new THREE.Mesh(centerGeo, centerMat);
    coreGroup.add(centerCore);

    // 8. Orbital Gimbal Rings
    // Ring 1 (Cyan)
    const ringGeo1 = new THREE.RingGeometry(2.9, 2.94, 72);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x00F0FF,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    coreGroup.add(ring1);

    // Ring 2 (Fuchsia)
    const ringGeo2 = new THREE.RingGeometry(3.18, 3.21, 72);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xD946EF,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 6;
    coreGroup.add(ring2);

    // Ring 3 (Outer subtle scan circle)
    const ringGeo3 = new THREE.RingGeometry(3.45, 3.47, 72);
    const ringMat3 = new THREE.MeshBasicMaterial({
      color: 0x38BDF8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending
    });
    const ring3 = new THREE.Mesh(ringGeo3, ringMat3);
    ring3.rotation.z = Math.PI / 5;
    coreGroup.add(ring3);

    // 9. Interactive Drag & Momentum Physics
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    let velocity = { x: 0.004, y: 0.002 };
    let shockwave = 0; // Triggered on click
    let shockwaveSpeed = 0;

    const handlePointerDown = (e) => {
      isDragging = true;
      setIsInteracting(true);
      const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0]?.clientY) || 0;
      prevMousePos = { x: clientX, y: clientY };
    };

    const handlePointerMove = (e) => {
      if (!isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0]?.clientY) || 0;

      const deltaX = clientX - prevMousePos.x;
      const deltaY = clientY - prevMousePos.y;

      velocity.x = deltaX * 0.005;
      velocity.y = deltaY * 0.005;

      coreGroup.rotation.y += velocity.x;
      coreGroup.rotation.x += velocity.y;

      prevMousePos = { x: clientX, y: clientY };
    };

    const handlePointerUp = () => {
      isDragging = false;
      setTimeout(() => setIsInteracting(false), 500);
    };

    // Click to emit a quantum pulse shockwave
    const handleClick = () => {
      shockwave = 1.0;
      shockwaveSpeed = 0.04;
    };

    const domEl = container;
    domEl.addEventListener('mousedown', handlePointerDown);
    domEl.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchend', handlePointerUp);
    domEl.addEventListener('click', handleClick);

    // 10. Animation Loop with Visibility Gating
    let animationFrameId = null;
    let isVisible = true;
    let clock = new THREE.Clock();
    let telemetryThrottle = 0;

    const render = () => {
      if (!isVisible) return;
      animationFrameId = requestAnimationFrame(render);

      const elapsedTime = clock.getElapsedTime();

      // Inertial momentum and auto rotation
      if (!isDragging) {
        velocity.x *= 0.95;
        velocity.y *= 0.95;

        coreGroup.rotation.y += velocity.x + 0.004;
        coreGroup.rotation.x += velocity.y + 0.0015;
      }

      // Counter-rotate inner geometry & rings
      innerCore.rotation.x = -elapsedTime * 0.4;
      innerCore.rotation.y = elapsedTime * 0.5;

      ring1.rotation.z = elapsedTime * 0.25;
      ring2.rotation.z = -elapsedTime * 0.35;
      ring3.rotation.x = elapsedTime * 0.15;

      // Handle shockwave burst
      if (shockwave > 0) {
        shockwave -= shockwaveSpeed;
        if (shockwave < 0) shockwave = 0;
      }

      // Pulsate / breathe particles organically
      const posAttr = particleGeometry.attributes.position;
      const posArray = posAttr.array;
      const waveFreq = 2.4;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const ox = originalPositions[i3];
        const oy = originalPositions[i3 + 1];
        const oz = originalPositions[i3 + 2];

        // Complex radial pulse calculation
        const noise = Math.sin(ox * waveFreq + elapsedTime * 2.0) *
                      Math.cos(oy * waveFreq + elapsedTime * 1.8) * 0.08;

        const burstScale = 1.0 + shockwave * 0.35 * Math.sin(i * 0.05 + elapsedTime * 5);
        const factor = (1.0 + noise) * burstScale;

        posArray[i3] = ox * factor;
        posArray[i3 + 1] = oy * factor;
        posArray[i3 + 2] = oz * factor;
      }
      posAttr.needsUpdate = true;

      // Inner center core glow breathing
      const centerScale = 1.0 + Math.sin(elapsedTime * 3) * 0.15 + shockwave * 0.5;
      centerCore.scale.set(centerScale, centerScale, centerScale);

      renderer.render(scene, camera);

      // Throttled Telemetry update (approx every 6 frames)
      telemetryThrottle++;
      if (telemetryThrottle % 6 === 0) {
        const degX = Math.round(((coreGroup.rotation.x * 180) / Math.PI) % 360);
        const degY = Math.round(((coreGroup.rotation.y * 180) / Math.PI) % 360);
        setTelemetry({
          rotX: degX < 0 ? degX + 360 : degX,
          rotY: degY < 0 ? degY + 360 : degY,
          active: true
        });
      }
    };

    // 11. Intersection Observer (0% CPU when scrolled past)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animationFrameId) {
          clock.start();
          render();
        } else if (!isVisible && animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      });
    }, { threshold: 0.05 });

    observer.observe(container);

    // 12. Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      if (newWidth === 0 || newHeight === 0) return;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    });

    resizeObserver.observe(container);

    // Initial render trigger
    render();

    // Cleanup
    return () => {
      observer.disconnect();
      resizeObserver.disconnect();

      if (animationFrameId) cancelAnimationFrame(animationFrameId);

      domEl.removeEventListener('mousedown', handlePointerDown);
      domEl.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchend', handlePointerUp);
      domEl.removeEventListener('click', handleClick);

      // Dispose Three resources
      particleGeometry.dispose();
      particleMaterial.dispose();
      pointTexture.dispose();
      icoGeo.dispose();
      icoMat.dispose();
      centerGeo.dispose();
      centerMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      ringGeo3.dispose();
      ringMat3.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[300px] sm:min-h-[340px] flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing select-none group/hologram rounded-3xl"
    >
      {/* 3D WebGL Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 block" />

      {/* Radial Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-fuchsia-500/10 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Cybernetic HUD Overlay */}
      <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-between pointer-events-none z-10">
        {/* Top Header Telemetry */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
            <span className="font-mono text-[10px] font-bold tracking-widest text-cyan-400 uppercase">
              NEURAL CORE // ACTIVE
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 font-mono text-[9px] uppercase tracking-wider backdrop-blur-md">
            <Move3d size={11} className="text-cyan-400" />
            <span>3D INTERACTIVE</span>
          </div>
        </div>

        {/* Drag Indicator Positioned Above Bottom Telemetry */}
        <div className={`absolute bottom-12 left-1/2 -translate-x-1/2 transition-opacity duration-300 pointer-events-none text-center whitespace-nowrap ${isInteracting ? 'opacity-0' : 'opacity-70 group-hover/hologram:opacity-100'}`}>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-white/10 text-[9px] font-mono uppercase tracking-widest text-white/70 shadow-lg backdrop-blur-md">
            <Sparkles size={10} className="text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>DRAG TO ROTATE • CLICK TO BURST</span>
          </div>
        </div>

        {/* Bottom Technical Telemetry Specs */}
        <div className="flex items-end justify-between text-left">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5 font-mono text-[9px] text-white/40 tracking-wider">
              <Cpu size={10} className="text-cyan-400" />
              <span>SPATIAL MATRIX: 2,200 NODES</span>
            </div>
            <span className="font-mono text-[9px] text-cyan-400/80 font-bold tracking-widest">
              X: {telemetry.rotX}° | Y: {telemetry.rotY}°
            </span>
          </div>

          <div className="flex items-center gap-1 font-mono text-[9px] text-fuchsia-400 bg-fuchsia-500/10 px-2 py-0.5 rounded border border-fuchsia-500/20">
            <Activity size={10} className="animate-pulse" />
            <span>QUANTUM AI CORE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
