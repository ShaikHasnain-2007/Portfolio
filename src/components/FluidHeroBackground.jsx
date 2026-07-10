import { useEffect, useRef, useState } from 'react';
import defaultBaseBg from './retouch_2026070720521920.jpg_202607082155.jpeg';
import defaultRevealBg from './Make_man\'s_chest_wider_2K_202607082155.jpeg';

export default function FluidHeroBackground({
  baseBg = defaultBaseBg,
  revealBg = defaultRevealBg,
  splatRadius = 0.007,
  densityDissipation = 0.99,
  velocityDissipation = 0.99,
  densityDiffusion = 0.15,
  pressureIterations = 20,
  className = "",
  onProgress,
  onReady,
  children
}) {
  const canvasRef = useRef(null);
  const imagesRef = useRef({ base: null, reveal: null });
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Interaction tracking refs
  const lastMouse = useRef({ x: 0.5, y: 0.5, valid: false });
  const currentMouse = useRef({ x: 0.5, y: 0.5, active: false });
  const clickQueue = useRef([]);
  const persistMode = useRef(false);
  const resetRequested = useRef(false);
  const [showPersistLabel, setShowPersistLabel] = useState(false);

  // FIX: Stable callback refs to avoid stale closures in image loader
  const onProgressRef = useRef(onProgress);
  const onReadyRef = useRef(onReady);
  useEffect(() => { onProgressRef.current = onProgress; }, [onProgress]);
  useEffect(() => { onReadyRef.current = onReady; }, [onReady]);

  // Context loss recovery state
  const [glContextKey, setGlContextKey] = useState(0);

  // Load images
  useEffect(() => {
    let active = true;
    const imagesToLoad = [
      { key: 'base', src: baseBg },
      { key: 'reveal', src: revealBg }
    ];

    let loadedCount = 0;
    imagesToLoad.forEach(item => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = item.src;
      img.onload = () => {
        if (!active) return;
        imagesRef.current[item.key] = img;
        loadedCount++;
        if (onProgressRef.current) {
          onProgressRef.current(Math.round((loadedCount / imagesToLoad.length) * 100));
        }
        if (loadedCount === imagesToLoad.length) {
          setImagesLoaded(true);
          if (onReadyRef.current) onReadyRef.current();
        }
      };
      img.onerror = () => {
        console.error("Failed to load image:", item.src);
        const canvas = document.createElement('canvas');
        canvas.width = 2;
        canvas.height = 2;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = item.key === 'base' ? '#ecc94b' : '#3182ce';
        ctx.fillRect(0, 0, 2, 2);

        const fallbackImg = new Image();
        fallbackImg.src = canvas.toDataURL();
        fallbackImg.onload = () => {
          if (!active) return;
          imagesRef.current[item.key] = fallbackImg;
          loadedCount++;
          if (onProgressRef.current) {
            onProgressRef.current(Math.round((loadedCount / imagesToLoad.length) * 100));
          }
          if (loadedCount === imagesToLoad.length) {
            setImagesLoaded(true);
            if (onReadyRef.current) onReadyRef.current();
          }
        };
      };
    });

    return () => {
      active = false;
    };
  }, [baseBg, revealBg]);

  // WebGL Render Loop
  useEffect(() => {
    if (!imagesLoaded || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl2', {
      alpha: false,
      depth: false,
      stencil: false,
      antialias: false,
      powerPreference: 'high-performance'
    });

    if (!gl) {
      console.error("WebGL 2 not supported by browser.");
      return;
    }

    // ─── Context loss handling ───
    const handleContextLost = (e) => {
      e.preventDefault();
      cancelAnimationFrame(raf);
    };
    const handleContextRestored = () => {
      // Force full re-init by bumping context key
      setGlContextKey(k => k + 1);
    };
    canvas.addEventListener('webglcontextlost', handleContextLost);
    canvas.addEventListener('webglcontextrestored', handleContextRestored);

    // Float texture support
    const extColorBufferFloat = gl.getExtension('EXT_color_buffer_float');
    const supportLinear = gl.getExtension('OES_texture_float_linear');

    let internalFormat = gl.RGBA8;
    let format = gl.RGBA;
    let type = gl.UNSIGNED_BYTE;

    if (extColorBufferFloat) {
      internalFormat = gl.RGBA16F;
      type = gl.HALF_FLOAT;
    }

    const filter = supportLinear ? gl.LINEAR : gl.NEAREST;

    // Simulation resolution
    const simWidth = 256;
    const simHeight = 256;

    // ─── Shaders ───

    const baseVertexShader = `#version 300 es
      in vec2 position;
      out vec2 vUv;
      void main() {
        vUv = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Splat: paints velocity or density along a capsule segment OR radial shockwave ring
    const splatShader = `#version 300 es
      precision highp float;
      in vec2 vUv;
      out vec4 fragColor;

      uniform sampler2D uTarget;
      uniform vec2 uPoint;
      uniform vec2 uPointPrev;
      uniform vec3 uColor;
      uniform float uRadius;
      uniform float uAspectRatio;
      uniform float uIsActive;
      uniform float uIsShockwave;

      float distToSeg(vec2 a, vec2 b, vec2 p) {
        vec2 pa = p - a, ba = b - a;
        float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
        return length(pa - ba * h);
      }

      void main() {
        vec4 base = texture(uTarget, vUv);
        if (uIsActive < 0.5) { fragColor = base; return; }

        vec2 p = vUv;  p.x *= uAspectRatio;
        vec2 a = uPointPrev; a.x *= uAspectRatio;
        vec2 b = uPoint;     b.x *= uAspectRatio;

        float splat = 0.0;
        vec3 col = uColor;

        if (uIsShockwave > 0.5) {
          // Radial outward push ring
          vec2 dir = p - b;
          float len = length(dir);
          if (len > 0.0001) dir = dir / len;
          float ring = exp(-pow(len - 0.05, 2.0) / 0.001);
          col = vec3(dir * ring * 350.0, 0.0);
          splat = ring;
        } else {
          float d = distToSeg(a, b, p);
          splat = exp(-d * d / uRadius);
        }

        fragColor = base + vec4(col * splat, splat);
      }
    `;

    // Advection: moves a field along the velocity, with optional diffusion & turbulence
    const advectShader = `#version 300 es
      precision highp float;
      in vec2 vUv;
      out vec4 fragColor;

      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 uTexelSize;
      uniform float uDt;
      uniform float uDissipation;
      uniform float uDiffusion;
      uniform float uTime;
      uniform float uIsVelocity;

      void main() {
        vec2 vel = texture(uVelocity, vUv).xy;
        vec2 coord = vUv - uDt * vel * uTexelSize;
        coord = clamp(coord, 0.001, 0.999);

        vec4 center = texture(uSource, coord);

        // 4-neighbour average for watercolour-ink diffusion
        vec4 L = texture(uSource, coord - vec2(uTexelSize.x, 0.0));
        vec4 R = texture(uSource, coord + vec2(uTexelSize.x, 0.0));
        vec4 T = texture(uSource, coord + vec2(0.0, uTexelSize.y));
        vec4 B = texture(uSource, coord - vec2(0.0, uTexelSize.y));
        vec4 avg = (L + R + T + B) * 0.25;
        vec4 diffused = mix(center, avg, uDiffusion);

        vec4 result = uDissipation * diffused;

        // Inject subtle curl turbulence into velocity (no wind / no drift)
        if (uIsVelocity > 0.5) {
          vec2 turb = vec2(
            sin(coord.y * 14.0 + uTime * 1.5) * cos(coord.x * 9.0 + uTime),
            cos(coord.x * 14.0 + uTime * 1.5) * sin(coord.y * 9.0 + uTime)
          ) * 0.08;
          result.xy += turb * uDt;
        }

        fragColor = result;
      }
    `;

    const divergenceShader = `#version 300 es
      precision highp float;
      in vec2 vUv;
      out vec4 fragColor;
      uniform sampler2D uVelocity;
      uniform vec2 uTexelSize;
      void main() {
        float L = texture(uVelocity, vUv - vec2(uTexelSize.x, 0.0)).x;
        float R = texture(uVelocity, vUv + vec2(uTexelSize.x, 0.0)).x;
        float T = texture(uVelocity, vUv + vec2(0.0, uTexelSize.y)).y;
        float B = texture(uVelocity, vUv - vec2(0.0, uTexelSize.y)).y;
        fragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
      }
    `;

    const jacobiShader = `#version 300 es
      precision highp float;
      in vec2 vUv;
      out vec4 fragColor;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;
      uniform vec2 uTexelSize;
      void main() {
        float L = texture(uPressure, vUv - vec2(uTexelSize.x, 0.0)).x;
        float R = texture(uPressure, vUv + vec2(uTexelSize.x, 0.0)).x;
        float T = texture(uPressure, vUv + vec2(0.0, uTexelSize.y)).x;
        float B = texture(uPressure, vUv - vec2(0.0, uTexelSize.y)).x;
        float d = texture(uDivergence, vUv).x;
        fragColor = vec4((L + R + B + T - d) * 0.25, 0.0, 0.0, 1.0);
      }
    `;

    const gradSubShader = `#version 300 es
      precision highp float;
      in vec2 vUv;
      out vec4 fragColor;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;
      uniform vec2 uTexelSize;
      void main() {
        float L = texture(uPressure, vUv - vec2(uTexelSize.x, 0.0)).x;
        float R = texture(uPressure, vUv + vec2(uTexelSize.x, 0.0)).x;
        float T = texture(uPressure, vUv + vec2(0.0, uTexelSize.y)).x;
        float B = texture(uPressure, vUv - vec2(0.0, uTexelSize.y)).x;
        vec2 vel = texture(uVelocity, vUv).xy;
        vel -= 0.5 * vec2(R - L, T - B);
        fragColor = vec4(vel, 0.0, 1.0);
      }
    `;

    // Composite: FBM cloud edges + edge glow (dFdx/dFdy) + drop shadow, no UV warp
    const renderShader = `#version 300 es
      precision highp float;
      in vec2 vUv;
      out vec4 fragColor;

      uniform sampler2D uBaseBg;
      uniform sampler2D uRevealBg;
      uniform sampler2D uDensity;
      uniform vec2 uBaseScale;
      uniform vec2 uRevealScale;
      uniform float uTime;

      float hash(vec2 p) {
        p = fract(p * vec2(127.1, 311.7));
        p += dot(p, p + 19.19);
        return fract(p.x * p.y);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
                   mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
      }

      float fbm(vec2 p) {
        float v = 0.0, a = 0.5;
        vec2 shift = vec2(100.0);
        mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
        for (int i = 0; i < 4; ++i) {
          v += a * noise(p);
          p = rot * p * 2.0 + shift;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 baseUv   = (vUv - 0.5) * uBaseScale   + 0.5;
        vec2 revealUv = (vUv - 0.5) * uRevealScale  + 0.5;

        vec4 base   = texture(uBaseBg,   baseUv);
        vec4 reveal = texture(uRevealBg, revealUv);

        float density = texture(uDensity, vUv).r;

        // Idle cloud breathing: slow-drifting FBM noise for billowy cloud edges
        vec2 nc = vUv * 7.0 + vec2(uTime * 0.06, uTime * 0.03);
        float n = fbm(nc);

        float mask = smoothstep(0.12, 0.48, density + (n - 0.5) * 0.45);
        mask = clamp(mask, 0.0, 1.0);

        // Drop Shadow: sample density at offset for soft shadow beneath the top image
        vec2 shadowOffset = vec2(0.006, -0.01);
        float shadowDensity = texture(uDensity, vUv + shadowOffset).r;
        float shadowMask = clamp(smoothstep(0.12, 0.48, shadowDensity + (n - 0.5) * 0.45), 0.0, 1.0);
        float shadow = shadowMask * (1.0 - mask) * 0.3;

        // Edge Glow: GPU screen-space derivatives (free — no extra texture samples)
        float edge = length(vec2(dFdx(mask), dFdy(mask))) * 35.0;
        float glow = smoothstep(0.05, 1.0, edge);
        vec3 glowColor = mix(vec3(0.85, 0.92, 1.0), vec3(0.6, 0.8, 1.0), sin(uTime * 0.8) * 0.5 + 0.5);

        // Composite
        vec4 result = mix(base, reveal, mask);
        result.rgb -= vec3(shadow);
        result.rgb += glowColor * glow * 0.25;

        fragColor = result;
      }
    `;

    // ─── Shader helpers ───

    const compile = (src, t) => {
      const s = gl.createShader(t);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error("Shader:", gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    };

    const link = (vs, fs) => {
      const v = compile(vs, gl.VERTEX_SHADER);
      const f = compile(fs, gl.FRAGMENT_SHADER);
      if (!v || !f) return null;
      const p = gl.createProgram();
      gl.attachShader(p, v);
      gl.attachShader(p, f);
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
        console.error("Link:", gl.getProgramInfoLog(p));
        gl.deleteProgram(p);
        return null;
      }
      return p;
    };

    const splatProg  = link(baseVertexShader, splatShader);
    const advectProg = link(baseVertexShader, advectShader);
    const divProg    = link(baseVertexShader, divergenceShader);
    const jacobiProg = link(baseVertexShader, jacobiShader);
    const gradProg   = link(baseVertexShader, gradSubShader);
    const renderProg = link(baseVertexShader, renderShader);

    if (!splatProg || !advectProg || !divProg || !jacobiProg || !gradProg || !renderProg) {
      console.error("Failed to compile WebGL programs");
      return;
    }

    // ─── PERF: Cache all uniform locations once (eliminates ~30+ string lookups/frame) ───

    const cacheUniforms = (prog, names) => {
      const u = {};
      names.forEach(n => { u[n] = gl.getUniformLocation(prog, n); });
      return u;
    };

    const splatU  = cacheUniforms(splatProg,  ["uTarget", "uPoint", "uPointPrev", "uColor", "uRadius", "uAspectRatio", "uIsActive", "uIsShockwave"]);
    const advectU = cacheUniforms(advectProg, ["uVelocity", "uSource", "uTexelSize", "uDt", "uDissipation", "uDiffusion", "uTime", "uIsVelocity"]);
    const divU    = cacheUniforms(divProg,    ["uVelocity", "uTexelSize"]);
    const jacobiU = cacheUniforms(jacobiProg, ["uPressure", "uDivergence", "uTexelSize"]);
    const gradU   = cacheUniforms(gradProg,   ["uPressure", "uVelocity", "uTexelSize"]);
    const renderU = cacheUniforms(renderProg, ["uBaseBg", "uRevealBg", "uDensity", "uBaseScale", "uRevealScale", "uTime"]);

    // PERF: Cache attribute location once
    const posLoc = gl.getAttribLocation(splatProg, "position");

    // ─── FBO helpers ───

    const makeFBO = (w, h, intFmt, fmt, tp, flt) => {
      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, flt);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, flt);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, intFmt, w, h, 0, fmt, tp, null);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      return { texture: tex, fbo, width: w, height: h };
    };

    const makeDoubleFBO = (w, h, intFmt, fmt, tp, flt) => {
      let a = makeFBO(w, h, intFmt, fmt, tp, flt);
      let b = makeFBO(w, h, intFmt, fmt, tp, flt);
      return {
        read: a, write: b,
        swap() { const t = this.read; this.read = this.write; this.write = t; }
      };
    };

    // Create simulation buffers
    const velocity   = makeDoubleFBO(simWidth, simHeight, internalFormat, format, type, filter);
    const density    = makeDoubleFBO(simWidth, simHeight, internalFormat, format, type, filter);
    const pressure   = makeDoubleFBO(simWidth, simHeight, internalFormat, format, type, filter);
    const divergence = makeFBO(simWidth, simHeight, internalFormat, format, type, filter);

    // Fullscreen quad
    const quadVerts = new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]);
    const quadVbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadVbo);
    gl.bufferData(gl.ARRAY_BUFFER, quadVerts, gl.STATIC_DRAW);
    const drawQuad = () => gl.drawArrays(gl.TRIANGLES, 0, 6);

    // Static image textures
    const loadTex = (img) => {
      const t = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      return t;
    };

    const baseTex   = loadTex(imagesRef.current.base);
    const revealTex = loadTex(imagesRef.current.reveal);

    // Cover-fit scaling
    let baseScale = [1, 1], revealScale = [1, 1], lastW = 0, lastH = 0;

    const resize = () => {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (w === lastW && h === lastH) return;
      lastW = w; lastH = h;
      canvas.width = w; canvas.height = h;
      const cr = w / h;

      const bi = imagesRef.current.base,  br = bi.width / bi.height;
      baseScale = cr > br ? [1, br / cr] : [cr / br, 1];

      const ri = imagesRef.current.reveal, rr = ri.width / ri.height;
      revealScale = cr > rr ? [1, rr / cr] : [cr / rr, 1];
    };

    // Splat helper (velocity OR density, optional shockwave mode)
    const splat = (pt, prev, color, target, isShockwave = 0.0, customRadius = splatRadius) => {
      gl.useProgram(splatProg);
      gl.uniform1i(splatU.uTarget, 0);
      gl.uniform2f(splatU.uPoint, pt.x, pt.y);
      gl.uniform2f(splatU.uPointPrev, prev.x, prev.y);
      gl.uniform3f(splatU.uColor, color.r, color.g, color.b);
      gl.uniform1f(splatU.uRadius, customRadius);
      gl.uniform1f(splatU.uAspectRatio, canvas.width / canvas.height);
      gl.uniform1f(splatU.uIsActive, 1.0);
      gl.uniform1f(splatU.uIsShockwave, isShockwave);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, target.read.texture);
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.write.fbo);
      gl.viewport(0, 0, simWidth, simHeight);
      drawQuad();
      target.swap();
    };

    let lastTime = performance.now();
    const startTime = performance.now();
    let raf = null;

    const draw = (time) => {
      resize();
      const dt = Math.min((time - lastTime) / 1000, 0.033);
      lastTime = time;
      const elapsed = (time - startTime) / 1000;

      gl.disable(gl.BLEND);
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      // ── 1. Reset (R key) ──
      if (resetRequested.current) {
        [velocity, density, pressure].forEach(db => {
          gl.bindFramebuffer(gl.FRAMEBUFFER, db.read.fbo);
          gl.clearColor(0, 0, 0, 1);
          gl.clear(gl.COLOR_BUFFER_BIT);
          gl.bindFramebuffer(gl.FRAMEBUFFER, db.write.fbo);
          gl.clear(gl.COLOR_BUFFER_BIT);
        });
        resetRequested.current = false;
      }

      // ── 2. Click shockwaves ──
      if (clickQueue.current.length > 0) {
        clickQueue.current.forEach(click => {
          // Radial velocity push (shockwave ring)
          splat(click, click, { r: 0, g: 0, b: 0 }, velocity, 1.0);
          // Dense cloud puff at click center
          splat(click, click, { r: 1, g: 1, b: 1 }, density, 0.0, splatRadius * 1.5);
        });
        clickQueue.current = [];
      }

      // ── 3. Mouse splats ──
      if (currentMouse.current.active) {
        if (!lastMouse.current.valid) {
          lastMouse.current = { x: currentMouse.current.x, y: currentMouse.current.y, valid: true };
        }

        const dx = currentMouse.current.x - lastMouse.current.x;
        const dy = currentMouse.current.y - lastMouse.current.y;
        const force = 140.0;
        const pt   = { x: currentMouse.current.x, y: currentMouse.current.y };
        const prev = { x: lastMouse.current.x,    y: lastMouse.current.y };

        splat(pt, prev, { r: dx * force, g: dy * force, b: 0 }, velocity);
        splat(pt, prev, { r: 1, g: 1, b: 1 },                   density);

        lastMouse.current = { x: pt.x, y: pt.y, valid: true };
      }

      // ── 4. Advect velocity (turbulence, no wind) ──
      gl.useProgram(advectProg);
      gl.uniform2f(advectU.uTexelSize, 1 / simWidth, 1 / simHeight);
      gl.uniform1f(advectU.uDt, dt);
      gl.uniform1f(advectU.uTime, elapsed);

      gl.uniform1i(advectU.uVelocity, 0);
      gl.uniform1i(advectU.uSource, 0);
      gl.uniform1f(advectU.uDissipation, velocityDissipation);
      gl.uniform1f(advectU.uDiffusion, 0.0);
      gl.uniform1f(advectU.uIsVelocity, 1.0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, velocity.read.texture);
      gl.bindFramebuffer(gl.FRAMEBUFFER, velocity.write.fbo);
      gl.viewport(0, 0, simWidth, simHeight);
      drawQuad();
      velocity.swap();

      // ── 5. Advect density (with diffusion = ink bleed) ──
      gl.uniform1i(advectU.uVelocity, 0);
      gl.uniform1i(advectU.uSource, 1);
      gl.uniform1f(advectU.uDissipation, persistMode.current ? 1.0 : densityDissipation);
      gl.uniform1f(advectU.uDiffusion, densityDiffusion);
      gl.uniform1f(advectU.uIsVelocity, 0.0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, velocity.read.texture);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, density.read.texture);
      gl.bindFramebuffer(gl.FRAMEBUFFER, density.write.fbo);
      gl.viewport(0, 0, simWidth, simHeight);
      drawQuad();
      density.swap();

      // ── 6. Divergence ──
      gl.useProgram(divProg);
      gl.uniform2f(divU.uTexelSize, 1 / simWidth, 1 / simHeight);
      gl.uniform1i(divU.uVelocity, 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, velocity.read.texture);
      gl.bindFramebuffer(gl.FRAMEBUFFER, divergence.fbo);
      gl.viewport(0, 0, simWidth, simHeight);
      drawQuad();

      // ── 7. Jacobi pressure solve ──
      gl.useProgram(jacobiProg);
      gl.uniform2f(jacobiU.uTexelSize, 1 / simWidth, 1 / simHeight);
      gl.uniform1i(jacobiU.uDivergence, 0);
      gl.uniform1i(jacobiU.uPressure, 1);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, divergence.texture);

      // Clear pressure
      gl.bindFramebuffer(gl.FRAMEBUFFER, pressure.read.fbo);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      for (let i = 0; i < pressureIterations; i++) {
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, pressure.read.texture);
        gl.bindFramebuffer(gl.FRAMEBUFFER, pressure.write.fbo);
        gl.viewport(0, 0, simWidth, simHeight);
        drawQuad();
        pressure.swap();
      }

      // ── 8. Gradient subtract ──
      gl.useProgram(gradProg);
      gl.uniform2f(gradU.uTexelSize, 1 / simWidth, 1 / simHeight);
      gl.uniform1i(gradU.uPressure, 0);
      gl.uniform1i(gradU.uVelocity, 1);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, pressure.read.texture);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, velocity.read.texture);
      gl.bindFramebuffer(gl.FRAMEBUFFER, velocity.write.fbo);
      gl.viewport(0, 0, simWidth, simHeight);
      drawQuad();
      velocity.swap();

      // ── 9. Composite render ──
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(renderProg);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, baseTex);
      gl.uniform1i(renderU.uBaseBg, 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, revealTex);
      gl.uniform1i(renderU.uRevealBg, 1);
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, density.read.texture);
      gl.uniform1i(renderU.uDensity, 2);
      gl.uniform2f(renderU.uBaseScale, baseScale[0], baseScale[1]);
      gl.uniform2f(renderU.uRevealScale, revealScale[0], revealScale[1]);
      gl.uniform1f(renderU.uTime, elapsed);

      drawQuad();
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);

      gl.deleteTexture(baseTex);
      gl.deleteTexture(revealTex);
      gl.deleteBuffer(quadVbo);

      [velocity, density, pressure].forEach(db => {
        gl.deleteTexture(db.read.texture);
        gl.deleteTexture(db.write.texture);
        gl.deleteFramebuffer(db.read.fbo);
        gl.deleteFramebuffer(db.write.fbo);
      });
      gl.deleteTexture(divergence.texture);
      gl.deleteFramebuffer(divergence.fbo);

      [splatProg, advectProg, divProg, jacobiProg, gradProg, renderProg].forEach(p => {
        if (!p) return;
        gl.getAttachedShaders(p).forEach(s => gl.deleteShader(s));
        gl.deleteProgram(p);
      });
    };
  }, [imagesLoaded, splatRadius, densityDissipation, velocityDissipation, pressureIterations, densityDiffusion, glContextKey]);

  // ─── Pointer events ───

  const handlePointerDown = (e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = 1.0 - (e.clientY - rect.top) / rect.height;
    // Queue click shockwave
    clickQueue.current.push({ x, y });
    currentMouse.current = { x, y, active: true };
    lastMouse.current = { x, y, valid: true };
  };

  const handlePointerMove = (e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = 1.0 - (e.clientY - rect.top) / rect.height;
    currentMouse.current = { x, y, active: true };
  };

  const handlePointerEnter = (e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = 1.0 - (e.clientY - rect.top) / rect.height;
    currentMouse.current = { x, y, active: true };
    lastMouse.current = { x, y, valid: true };
  };

  const handlePointerLeave = () => {
    currentMouse.current.active = false;
    lastMouse.current.valid = false;
  };

  // Keyboard listener for P (persistence) and R (reset)
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'p' || e.key === 'P') {
        persistMode.current = !persistMode.current;
        setShowPersistLabel(persistMode.current);
      }
      if (e.key === 'r' || e.key === 'R') {
        resetRequested.current = true;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className={`fluid-hero-bg ${className}`} style={{
      position: 'relative', width: '100%', height: '100vh', overflow: 'hidden'
    }}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          display: 'block', pointerEvents: 'auto', cursor: 'none'
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      />
      {!imagesLoaded && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundSize: 'cover', backgroundPosition: 'center',
          transition: 'opacity 0.5s ease', backgroundImage: `url(${baseBg})`
        }} />
      )}
      {showPersistLabel && (
        <div style={{
          position: 'absolute', bottom: 16, right: 16, zIndex: 20,
          background: 'rgba(0,0,0,0.6)', color: '#fff',
          padding: '6px 14px', borderRadius: 8, fontSize: 13,
          fontFamily: 'Inter, system-ui, sans-serif',
          backdropFilter: 'blur(8px)', letterSpacing: '0.5px',
          pointerEvents: 'none', userSelect: 'none'
        }}>
          Permanent Paint ON (P to toggle)
        </div>
      )}
      <div style={{
        position: 'relative', zIndex: 10, width: '100%', height: '100%', pointerEvents: 'none'
      }}>
        {children}
      </div>
    </div>
  );
}
