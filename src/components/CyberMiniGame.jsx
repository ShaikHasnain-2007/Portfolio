import { useEffect, useRef, useState, useCallback } from 'react';
import { Play, RotateCcw, Trophy, Shield, Crosshair, Zap, Gamepad2, Volume2, VolumeX } from 'lucide-react';

class CyberAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  playLaser() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, t);
      osc.frequency.exponentialRampToValueAtTime(140, t + 0.08);

      gain.gain.setValueAtTime(0.09, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.08);
    } catch {
    }
  }

  playHit() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, t);
      osc.frequency.exponentialRampToValueAtTime(450, t + 0.04);

      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.04);
    } catch {
    }
  }

  playExplosion() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, t);
      osc.frequency.exponentialRampToValueAtTime(32, t + 0.2);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.2);

      const bufferSize = Math.floor(this.ctx.sampleRate * 0.12);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(1200, t);
      noiseFilter.frequency.linearRampToValueAtTime(250, t + 0.12);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.12, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      noise.start(t);
      noise.stop(t + 0.12);
    } catch {
    }
  }

  playShieldHit() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(220, t);
      osc.frequency.setValueAtTime(140, t + 0.05);
      osc.frequency.setValueAtTime(260, t + 0.1);

      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.18);
    } catch {
    }
  }

  playStart() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const t = this.ctx.currentTime + idx * 0.055;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.1, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.075);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.075);
      });
    } catch {
    }
  }

  playGameOver() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const notes = [440, 370, 311, 220]; // Descending minor progression
      notes.forEach((freq, idx) => {
        const t = this.ctx.currentTime + idx * 0.085;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.11);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.11);
      });
    } catch {
    }
  }
}

export default function CyberMiniGame() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const audioEngineRef = useRef(null);

  // React HUD states
  const [gameState, setGameState] = useState('start'); // 'start' | 'playing' | 'gameover'
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('hasnain_cyber_highscore') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [playerHp, setPlayerHp] = useState(3);
  const [isMuted, setIsMuted] = useState(() => {
    try {
      return localStorage.getItem('hasnain_cyber_sfx_muted') === 'true';
    } catch {
      return false;
    }
  });

  if (!audioEngineRef.current) {
    audioEngineRef.current = new CyberAudioEngine();
    audioEngineRef.current.isMuted = isMuted;
  }

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (audioEngineRef.current) {
      audioEngineRef.current.isMuted = nextMuted;
      if (!nextMuted) {
        audioEngineRef.current.playHit();
      }
    }
    try {
      localStorage.setItem('hasnain_cyber_sfx_muted', nextMuted ? 'true' : 'false');
    } catch { /* ignore */ }
  };

  // Engine refs to avoid stale closures in requestAnimationFrame
  const engineRef = useRef({
    gameState: 'start',
    score: 0,
    highScore: 0,
    playerHp: 3,
    ship: null,
    keys: {},
    mouse: { x: 0, y: 0, isDown: false },
    bullets: [],
    asteroids: [],
    particles: [],
    popups: [],
    stars: [],
    lastSpawn: 0,
    lastShot: 0,
    screenShake: 0,
    width: 400,
    height: 340,
    isVisible: true,
  });

  // Start game handler
  const startGame = useCallback(() => {
    audioEngineRef.current?.playStart();
    const engine = engineRef.current;
    const w = engine.width;
    const h = engine.height;

    engine.gameState = 'playing';
    engine.score = 0;
    engine.playerHp = 3;
    engine.bullets = [];
    engine.asteroids = [];
    engine.particles = [];
    engine.popups = [];
    engine.lastSpawn = performance.now();
    engine.lastShot = 0;
    engine.screenShake = 0;

    engine.ship = {
      x: w / 2,
      y: h / 2,
      vx: 0,
      vy: 0,
      angle: -Math.PI / 2,
      radius: 13,
      invulnerable: performance.now() + 1000 // 1s grace period
    };

    setScore(0);
    setPlayerHp(3);
    setGameState('playing');
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    const engine = engineRef.current;

    // Resize canvas to match container layout and device pixel ratio
    const applyResize = (newW, newH) => {
      const w = Math.floor(newW) || container.clientWidth || 400;
      const h = Math.floor(newH) || container.clientHeight || 340;
      if (w <= 0 || h <= 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const targetW = Math.floor(w * dpr);
      const targetH = Math.floor(h * dpr);

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      engine.width = w;
      engine.height = h;

      if (engine.ship) {
        engine.ship.x = Math.max(15, Math.min(engine.ship.x, w - 15));
        engine.ship.y = Math.max(15, Math.min(engine.ship.y, h - 15));
      }

      // Seed background stars
      if (engine.stars.length === 0) {
        for (let i = 0; i < 45; i++) {
          engine.stars.push({
            x: Math.random() * w,
            y: Math.random() * h,
            size: Math.random() * 1.5 + 0.5,
            alpha: Math.random() * 0.7 + 0.2,
            speed: Math.random() * 0.25 + 0.1
          });
        }
      }
    };

    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w > 0 && h > 0) {
        applyResize(w, h);
      }
    };

    handleResize();
    const tInit = setTimeout(handleResize, 100);

    const resizeObserver = new ResizeObserver((entries) => {
      if (entries && entries[0] && entries[0].contentRect) {
        const { width, height } = entries[0].contentRect;
        if (width > 0 && height > 0) {
          applyResize(width, height);
          return;
        }
      }
      handleResize();
    });
    resizeObserver.observe(container);
    window.addEventListener('resize', handleResize);

    const visObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        engine.isVisible = entry.isIntersecting;
        if (entry.isIntersecting && !animationFrameId) {
          lastTime = performance.now();
          animationFrameId = requestAnimationFrame(gameLoop);
        }
      });
    }, { threshold: 0.05 });
    visObserver.observe(container);

    // Input Listeners
    const handleKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space'].includes(e.code)) {
        if (engine.gameState === 'playing') {
          e.preventDefault();
        }
      }
      engine.keys[e.code] = true;
      if (e.code === 'Space' && engine.gameState === 'playing') {
        engine.mouse.isDown = true;
      }
    };

    const handleKeyUp = (e) => {
      engine.keys[e.code] = false;
      if (e.code === 'Space') {
        engine.mouse.isDown = false;
      }
    };

    const handlePointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = rect.width > 0 ? (engine.width / rect.width) : 1;
      const scaleY = rect.height > 0 ? (engine.height / rect.height) : 1;
      engine.mouse.x = (e.clientX - rect.left) * scaleX;
      engine.mouse.y = (e.clientY - rect.top) * scaleY;
    };

    const handlePointerDown = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = rect.width > 0 ? (engine.width / rect.width) : 1;
      const scaleY = rect.height > 0 ? (engine.height / rect.height) : 1;
      engine.mouse.x = (e.clientX - rect.left) * scaleX;
      engine.mouse.y = (e.clientY - rect.top) * scaleY;
      engine.mouse.isDown = true;
    };

    const handlePointerUp = () => {
      engine.mouse.isDown = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('mousemove', handlePointerMove);
    canvas.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mouseup', handlePointerUp);

    // Touch support for mobile devices
    const handleTouchMove = (e) => {
      if (!e.touches[0]) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = rect.width > 0 ? (engine.width / rect.width) : 1;
      const scaleY = rect.height > 0 ? (engine.height / rect.height) : 1;
      engine.mouse.x = (e.touches[0].clientX - rect.left) * scaleX;
      engine.mouse.y = (e.touches[0].clientY - rect.top) * scaleY;
    };

    const handleTouchStart = (e) => {
      if (!e.touches[0]) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = rect.width > 0 ? (engine.width / rect.width) : 1;
      const scaleY = rect.height > 0 ? (engine.height / rect.height) : 1;
      engine.mouse.x = (e.touches[0].clientX - rect.left) * scaleX;
      engine.mouse.y = (e.touches[0].clientY - rect.top) * scaleY;
      engine.mouse.isDown = true;
    };

    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
    canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    // Main Game Loop
    let animationFrameId;
    let lastTime = performance.now();

    const spawnAsteroid = () => {
      const w = engine.width;
      const h = engine.height;
      const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
      let x, y;

      if (side === 0) { x = Math.random() * w; y = -25; }
      else if (side === 1) { x = w + 25; y = Math.random() * h; }
      else if (side === 2) { x = Math.random() * w; y = h + 25; }
      else { x = -25; y = Math.random() * h; }

      // Target ship or center
      const targetX = engine.ship ? engine.ship.x : w / 2;
      const targetY = engine.ship ? engine.ship.y : h / 2;
      const angle = Math.atan2(targetY - y, targetX - x) + (Math.random() - 0.5) * 0.5;
      const speed = Math.random() * 1.2 + 0.9;
      const radius = Math.random() * 10 + 14; // 14 to 24px

      // Polygon points for cool geometric vector shape
      const vertices = [];
      const numPoints = 6 + Math.floor(Math.random() * 3);
      for (let i = 0; i < numPoints; i++) {
        const a = (i / numPoints) * Math.PI * 2;
        const dist = radius * (0.8 + Math.random() * 0.4);
        vertices.push({ x: Math.cos(a) * dist, y: Math.sin(a) * dist });
      }

      engine.asteroids.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.04,
        vertices,
        hp: radius > 18 ? 2 : 1,
        color: Math.random() > 0.4 ? '#00F0FF' : '#D946EF'
      });
    };

    const addSparks = (x, y, count, color) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3.5 + 1;
        engine.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          size: Math.random() * 2 + 1,
          decay: Math.random() * 0.03 + 0.02,
          color
        });
      }
    };

    const gameLoop = (now) => {
      if (!engine.isVisible) {
        animationFrameId = null;
        return;
      }
      animationFrameId = requestAnimationFrame(gameLoop);

      // Reconcile dimensions if container layout size shifted
      const curW = container.clientWidth;
      const curH = container.clientHeight;
      if (curW > 0 && curH > 0 && (curW !== engine.width || curH !== engine.height)) {
        applyResize(curW, curH);
      }

      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const w = engine.width;
      const h = engine.height;

      // Clear & Screen Shake
      ctx.save();
      if (engine.screenShake > 0) {
        const shakeX = (Math.random() - 0.5) * engine.screenShake;
        const shakeY = (Math.random() - 0.5) * engine.screenShake;
        ctx.translate(shakeX, shakeY);
        engine.screenShake *= 0.88;
        if (engine.screenShake < 0.2) engine.screenShake = 0;
      }

      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, w, h);

      // Cyber Grid Background
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 32;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Parallax Stars
      engine.stars.forEach((star) => {
        star.y += star.speed;
        if (star.y > h) { star.y = 0; star.x = Math.random() * w; }
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.fillRect(star.x, star.y, star.size, star.size);
      });

      // UPDATE & DRAW PARTICLES
      for (let i = engine.particles.length - 1; i >= 0; i--) {
        const p = engine.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          engine.particles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // UPDATE & DRAW FLOATING TEXT POPUPS
      for (let i = engine.popups.length - 1; i >= 0; i--) {
        const pop = engine.popups[i];
        pop.y -= 0.8;
        pop.alpha -= 0.02;

        if (pop.alpha <= 0) {
          engine.popups.splice(i, 1);
          continue;
        }

        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = pop.color;
        ctx.globalAlpha = pop.alpha;
        ctx.fillText(pop.text, pop.x, pop.y);
        ctx.globalAlpha = 1;
      }

      // GAMEPLAY LOGIC
      if (engine.gameState === 'playing' && engine.ship) {
        const ship = engine.ship;

        // Rotate ship towards mouse
        const dx = engine.mouse.x - ship.x;
        const dy = engine.mouse.y - ship.y;
        ship.angle = Math.atan2(dy, dx);

        // Movement physics (WASD or Arrow keys)
        let thrust = false;
        const accel = 18;
        if (engine.keys['KeyW'] || engine.keys['ArrowUp']) {
          ship.vy -= accel * dt;
          thrust = true;
        }
        if (engine.keys['KeyS'] || engine.keys['ArrowDown']) {
          ship.vy += accel * dt;
          thrust = true;
        }
        if (engine.keys['KeyA'] || engine.keys['ArrowLeft']) {
          ship.vx -= accel * dt;
          thrust = true;
        }
        if (engine.keys['KeyD'] || engine.keys['ArrowRight']) {
          ship.vx += accel * dt;
          thrust = true;
        }

        // Slight drift towards mouse when holding left click far away
        const distToMouse = Math.hypot(dx, dy);
        if (engine.mouse.isDown && distToMouse > 50) {
          ship.vx += Math.cos(ship.angle) * 8 * dt;
          ship.vy += Math.sin(ship.angle) * 8 * dt;
          thrust = true;
        }

        // Apply friction
        ship.vx *= 0.96;
        ship.vy *= 0.96;

        ship.x += ship.vx;
        ship.y += ship.vy;

        // Screen wrap
        if (ship.x < -10) ship.x = w + 10;
        if (ship.x > w + 10) ship.x = -10;
        if (ship.y < -10) ship.y = h + 10;
        if (ship.y > h + 10) ship.y = -10;

        // Thrust Exhaust Particles
        if (thrust || Math.hypot(ship.vx, ship.vy) > 0.5) {
          const exhaustAngle = ship.angle + Math.PI + (Math.random() - 0.5) * 0.4;
          const exSpeed = Math.random() * 2 + 1.5;
          engine.particles.push({
            x: ship.x - Math.cos(ship.angle) * ship.radius,
            y: ship.y - Math.sin(ship.angle) * ship.radius,
            vx: Math.cos(exhaustAngle) * exSpeed + ship.vx * 0.3,
            vy: Math.sin(exhaustAngle) * exSpeed + ship.vy * 0.3,
            alpha: 0.9,
            size: Math.random() * 2 + 1,
            decay: 0.05,
            color: Math.random() > 0.5 ? '#00F0FF' : '#D946EF'
          });
        }

        // Auto/Click Laser Firing (rate limit: 160ms)
        if (engine.mouse.isDown && now - engine.lastShot > 160) {
          engine.lastShot = now;
          audioEngineRef.current?.playLaser();
          const bulletSpeed = 9;

          // Dual lasers from ship wings
          const wingOffset = 8;
          const perpAngle = ship.angle + Math.PI / 2;

          [-wingOffset, wingOffset].forEach((offset) => {
            const bx = ship.x + Math.cos(perpAngle) * offset + Math.cos(ship.angle) * ship.radius;
            const by = ship.y + Math.sin(perpAngle) * offset + Math.sin(ship.angle) * ship.radius;
            engine.bullets.push({
              x: bx,
              y: by,
              vx: Math.cos(ship.angle) * bulletSpeed + ship.vx * 0.2,
              vy: Math.sin(ship.angle) * bulletSpeed + ship.vy * 0.2,
              life: 45
            });
          });
        }

        // Spawn Asteroids periodically
        if (now - engine.lastSpawn > 1200) {
          engine.lastSpawn = now;
          if (engine.asteroids.length < 8) {
            spawnAsteroid();
          }
        }

        // UPDATE BULLETS
        for (let bIdx = engine.bullets.length - 1; bIdx >= 0; bIdx--) {
          const b = engine.bullets[bIdx];
          b.x += b.vx;
          b.y += b.vy;
          b.life -= 1;

          // Remove dead bullets
          if (b.life <= 0 || b.x < 0 || b.x > w || b.y < 0 || b.y > h) {
            engine.bullets.splice(bIdx, 1);
            continue;
          }

          // Bullet - Asteroid Collision
          let bulletHit = false;
          for (let aIdx = engine.asteroids.length - 1; aIdx >= 0; aIdx--) {
            const ast = engine.asteroids[aIdx];
            const dist = Math.hypot(b.x - ast.x, b.y - ast.y);

            if (dist < ast.radius + 3) {
              bulletHit = true;
              ast.hp -= 1;
              addSparks(b.x, b.y, 6, '#00F0FF');

              if (ast.hp <= 0) {
                // Destroy asteroid
                audioEngineRef.current?.playExplosion();
                addSparks(ast.x, ast.y, 16, ast.color);
                engine.screenShake = 3;

                // Points calculation
                const earned = Math.round(150 / ast.radius) * 10;
                engine.score += earned;
                setScore(engine.score);

                // High score update
                if (engine.score > engine.highScore) {
                  engine.highScore = engine.score;
                  setHighScore(engine.score);
                  try {
                    localStorage.setItem('hasnain_cyber_highscore', engine.score.toString());
                  } catch { /* ignore */ }
                }

                engine.popups.push({
                  x: ast.x,
                  y: ast.y,
                  text: `+${earned}`,
                  color: '#00F0FF',
                  alpha: 1
                });

                engine.asteroids.splice(aIdx, 1);
              } else {
                audioEngineRef.current?.playHit();
              }
              break;
            }
          }

          if (bulletHit) {
            engine.bullets.splice(bIdx, 1);
            continue;
          }

          // Draw Bullet (neon laser bolt)
          ctx.strokeStyle = '#00F0FF';
          ctx.lineWidth = 2.5;
          ctx.shadowColor = '#00F0FF';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.moveTo(b.x, b.y);
          ctx.lineTo(b.x - b.vx * 1.5, b.y - b.vy * 1.5);
          ctx.stroke();
          ctx.shadowBlur = 0;
        }

        // UPDATE ASTEROIDS & CHECK PLAYER COLLISION
        for (let aIdx = engine.asteroids.length - 1; aIdx >= 0; aIdx--) {
          const ast = engine.asteroids[aIdx];
          ast.x += ast.vx;
          ast.y += ast.vy;
          ast.rot += ast.rotSpeed;

          // Despawn far outside bounds
          if (ast.x < -60 || ast.x > w + 60 || ast.y < -60 || ast.y > h + 60) {
            engine.asteroids.splice(aIdx, 1);
            continue;
          }

          // Check collision with ship
          const distToShip = Math.hypot(ship.x - ast.x, ship.y - ast.y);
          const isInvulnerable = now < ship.invulnerable;

          if (distToShip < ship.radius + ast.radius && !isInvulnerable) {
            engine.playerHp -= 1;
            setPlayerHp(engine.playerHp);
            ship.invulnerable = now + 1500; // 1.5s shield cooldown
            engine.screenShake = 9;
            addSparks(ship.x, ship.y, 22, '#EF4444');
            audioEngineRef.current?.playShieldHit();

            if (engine.playerHp <= 0) {
              // Game Over
              engine.gameState = 'gameover';
              setGameState('gameover');
              addSparks(ship.x, ship.y, 35, '#EF4444');
              addSparks(ship.x, ship.y, 25, '#00F0FF');
              audioEngineRef.current?.playGameOver();
            }
          }

          // Draw Asteroid (Neon Vector Polygon)
          ctx.save();
          ctx.translate(ast.x, ast.y);
          ctx.rotate(ast.rot);

          ctx.strokeStyle = ast.color;
          ctx.lineWidth = 1.8;
          ctx.shadowColor = ast.color;
          ctx.shadowBlur = 6;
          ctx.fillStyle = 'rgba(0, 240, 255, 0.05)';

          ctx.beginPath();
          ast.vertices.forEach((v, idx) => {
            if (idx === 0) ctx.moveTo(v.x, v.y);
            else ctx.lineTo(v.x, v.y);
          });
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Internal core dot
          ctx.fillStyle = ast.color;
          ctx.beginPath();
          ctx.arc(0, 0, 2, 0, Math.PI * 2);
          ctx.fill();

          ctx.shadowBlur = 0;
          ctx.restore();
        }

        // DRAW PLAYER SHIP
        if (engine.gameState === 'playing') {
          ctx.save();
          ctx.translate(ship.x, ship.y);
          ctx.rotate(ship.angle);

          const isFlickering = now < ship.invulnerable && Math.floor(now / 80) % 2 === 0;

          if (!isFlickering) {
            // Neon Ship Glow
            ctx.shadowColor = '#00F0FF';
            ctx.shadowBlur = 10;
            ctx.strokeStyle = '#00F0FF';
            ctx.fillStyle = 'rgba(0, 240, 255, 0.15)';
            ctx.lineWidth = 2;

            // Sleek Fighter Jet Polygon
            ctx.beginPath();
            ctx.moveTo(ship.radius + 3, 0); // Nose
            ctx.lineTo(-ship.radius, -ship.radius * 0.85); // Left wing
            ctx.lineTo(-ship.radius * 0.45, 0); // Inner engine cove
            ctx.lineTo(-ship.radius, ship.radius * 0.85); // Right wing
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Cockpit neon dot
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(ship.radius * 0.2, 0, 2, 0, Math.PI * 2);
            ctx.fill();

            // Shield bubble when invulnerable
            if (now < ship.invulnerable) {
              ctx.strokeStyle = 'rgba(217, 70, 239, 0.7)';
              ctx.lineWidth = 1.5;
              ctx.beginPath();
              ctx.arc(0, 0, ship.radius + 7, 0, Math.PI * 2);
              ctx.stroke();
            }
          }

          ctx.shadowBlur = 0;
          ctx.restore();
        }
      }

      ctx.restore();
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      clearTimeout(tInit);
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      visObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('mousemove', handlePointerMove);
      canvas.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mouseup', handlePointerUp);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[300px] sm:min-h-[340px] flex items-center justify-center overflow-hidden select-none group/game rounded-3xl bg-[#030712]"
    >
      {/* 2D Canvas Viewport */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 block cursor-crosshair" />

      {/* Top HUD Bar */}
      <div className="absolute top-0 inset-x-0 p-4 flex items-center justify-between z-10 pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 backdrop-blur-md">
            <Gamepad2 size={12} className="text-cyan-400" />
            <span className="font-pixel text-xs text-cyan-400 tracking-wider">
              {score.toString().padStart(4, '0')}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Trophy size={11} className="text-amber-400" />
            <span className="font-mono text-[9px] text-white/60">
              HI: {highScore}
            </span>
          </div>

          <button
            onClick={toggleMute}
            type="button"
            aria-label={isMuted ? "Unmute audio SFX" : "Mute audio SFX"}
            className="flex items-center justify-center w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-cyan-400 transition-all cursor-pointer pointer-events-auto backdrop-blur-md shadow-sm active:scale-95"
            title={isMuted ? "SFX Muted (Click to Unmute)" : "SFX Enabled (Click to Mute)"}
          >
            {isMuted ? <VolumeX size={12} className="text-rose-400/80" /> : <Volume2 size={12} className="text-cyan-400" />}
          </button>
        </div>

        {/* Shield / HP Pips */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
          <Shield size={11} className="text-fuchsia-400" />
          <div className="flex gap-1">
            {[1, 2, 3].map((pip) => (
              <div
                key={pip}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  pip <= playerHp
                    ? 'bg-fuchsia-400 shadow-[0_0_8px_rgba(217,70,239,0.8)]'
                    : 'bg-white/10 border border-white/20'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* START SCREEN OVERLAY */}
      {gameState === 'start' && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(0,240,255,0.3)]">
            <Crosshair size={24} className="text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
          </div>

          <h3 className="font-pixel text-xl sm:text-2xl text-white tracking-wide text-center">
            NEON <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">DEFENDER</span>
          </h3>

          <p className="font-satoshi text-xs text-white/70 max-w-xs text-center mt-1.5 mb-5 leading-relaxed">
            Test my interactive game mechanics. Aim with mouse, hold left-click to fire lasers, use WASD to fly!
          </p>

          <button
            onClick={startGame}
            className="liquid-glass-btn group flex items-center gap-2 font-syne text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-full text-white bg-cyan-500/20 border border-cyan-400/40 hover:bg-cyan-400/30 hover:border-cyan-400 transition-all cursor-pointer shadow-[0_0_20px_rgba(0,240,255,0.4)]"
          >
            <Play size={13} className="text-cyan-400 group-hover:scale-110 transition-transform" />
            <span>START MISSION</span>
          </button>

          <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest mt-3">
            [ TOUCH & DRAG TO STEER ON MOBILE ]
          </span>
        </div>
      )}

      {/* GAME OVER SCREEN OVERLAY */}
      {gameState === 'gameover' && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-2">
            <Zap size={20} className="text-rose-400 animate-pulse" />
          </div>

          <h3 className="font-pixel text-xl sm:text-2xl text-rose-400 tracking-wide">
            MISSION FAILED
          </h3>

          <div className="flex items-center gap-4 my-3 font-mono text-xs">
            <span className="text-white/70">
              SCORE: <strong className="text-cyan-400 text-sm font-bold">{score}</strong>
            </span>
            <span className="text-white/40">•</span>
            <span className="text-white/70">
              BEST: <strong className="text-amber-400 text-sm font-bold">{highScore}</strong>
            </span>
          </div>

          <button
            onClick={startGame}
            className="liquid-glass-btn group flex items-center gap-2 font-syne text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-full text-white bg-cyan-500/20 border border-cyan-400/40 hover:bg-cyan-400/30 hover:border-cyan-400 transition-all cursor-pointer shadow-[0_0_20px_rgba(0,240,255,0.4)]"
          >
            <RotateCcw size={13} className="text-cyan-400 group-hover:-rotate-90 transition-transform" />
            <span>PLAY AGAIN</span>
          </button>
        </div>
      )}

      {/* Bottom Controls Legend (during gameplay) */}
      {gameState === 'playing' && (
        <div className="absolute bottom-2.5 inset-x-0 flex items-center justify-center pointer-events-none z-10">
          <span className="font-mono text-[9px] text-white/40 bg-black/40 px-3 py-0.5 rounded-full border border-white/5 backdrop-blur-sm">
            AIM: MOUSE • FIRE: CLICK/HOLD • THRUST: W/A/S/D
          </span>
        </div>
      )}
    </div>
  );
}
