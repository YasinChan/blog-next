<script setup>
/**
 * Dependency-free WebGL point cloud for the home hero.
 * Density lives in buildField(), colours in PALETTE.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue';

const props = defineProps({
  density: {
    type: Number,
    default: 1,
  },
});

const canvasRef = ref(null);

const VERT = /* glsl */ `
  precision highp float;

  attribute vec3 aPosition;
  attribute vec3 aColor;
  attribute float aSize;
  attribute float aAlpha;
  attribute float aPhase;

  uniform float uTime;
  uniform vec2 uPointer;
  uniform vec2 uViewport;
  uniform float uIntro;
  uniform float uTheme;

  varying vec3 vColor;
  varying float vAlpha;

  mat2 rotate(float a) {
    float c = cos(a);
    float s = sin(a);
    return mat2(c, -s, s, c);
  }

  void main() {
    vec3 p = aPosition;

    // Slow orbit + pointer-driven camera tilt.
    float ry = uTime * 0.035 + uPointer.x * 0.16;
    float rx = -uPointer.y * 0.11 + sin(uTime * 0.16) * 0.02;
    p.xz = rotate(ry) * p.xz;
    p.yz = rotate(rx) * p.yz;

    // Organic drift so the cloud never feels frozen.
    p.x += sin(uTime * 0.33 + aPhase * 6.2831) * 0.018;
    p.y += cos(uTime * 0.27 + aPhase * 4.7124) * 0.022;

    float depth = max(5.2 - p.z, 1.0);
    float focal = 2.35;
    float aspect = uViewport.x / uViewport.y;

    vec2 ndc = vec2(
      (p.x * focal / depth) / aspect,
      p.y * focal / depth
    );

    gl_Position = vec4(ndc, 0.0, 1.0);

    float pointSize = aSize * uViewport.y * 0.5 * focal / depth;
    // On light backgrounds, hide pin-pricks and let the larger motes bloom.
    float sizeWeight = smoothstep(0.006, 0.03, aSize);
    if (uTheme < 0.5) pointSize *= mix(1.15, 2.4, sizeWeight);
    gl_PointSize = clamp(pointSize, 1.0, 140.0);

    float depthFade = (1.0 - smoothstep(4.2, 9.5, depth)) * smoothstep(1.4, 2.6, depth);
    float twinkle = 0.74 + 0.26 * sin(uTime * 1.15 + aPhase * 20.0);

    vColor = aColor;
    vAlpha = aAlpha * depthFade * twinkle * uIntro;
    if (uTheme < 0.5) vAlpha *= mix(0.3, 0.85, sizeWeight);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;

  uniform float uTheme;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;

    float soft = pow(1.0 - smoothstep(0.0, 0.5, d), 1.5);
    float core = 1.0 - smoothstep(0.0, 0.2, d);

    vec3 color = vColor + core * mix(0.04, 0.22, uTheme);
    float alpha = vAlpha * soft;

    // Light backgrounds get a pale, hazy tint instead of dark specks.
    if (uTheme < 0.5) {
      color = mix(color, vec3(1.0), 0.32);
      alpha *= 0.82;
    }

    gl_FragColor = vec4(color, alpha);
  }
`;

const PALETTE = [
  [0.43, 0.9, 1.0],
  [0.65, 0.55, 0.98],
  [0.96, 0.45, 0.72],
];

let gl = null;
let program = null;
let buffer = null;
let rafId = 0;
let resizeObserver = null;
let themeObserver = null;
let visibilityObserver = null;
let removeListeners = null;
let particleCount = 0;
let uniforms = null;

let startedAt = 0;
let lastFrame = 0;
let elapsed = 0;
let running = false;
let onScreen = true;

const pointer = { x: 0, y: 0 };
const target = { x: 0, y: 0 };
const reducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const isDark = () =>
  document.documentElement.dataset.theme === 'dark' ||
  (!document.documentElement.dataset.theme &&
    window.matchMedia('(prefers-color-scheme: dark)').matches);

function compile(type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn('[hero-particles] shader error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram() {
  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  gl.deleteShader(vs);
  gl.deleteShader(fs);

  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.warn('[hero-particles] link error:', gl.getProgramInfoLog(prog));
    gl.deleteProgram(prog);
    return null;
  }
  return prog;
}

function randomColor() {
  const r = Math.random();
  const base = r < 0.44 ? PALETTE[0] : r < 0.84 ? PALETTE[1] : PALETTE[2];
  const jitter = 0.93 + Math.random() * 0.14;
  return [
    Math.min(1, base[0] * jitter),
    Math.min(1, base[1] * jitter),
    Math.min(1, base[2] * jitter),
  ];
}

function buildField() {
  const area = window.innerWidth * window.innerHeight;
  const base = Math.round(
    Math.min(3200, Math.max(800, area / 460)) * Math.max(0.2, props.density),
  );
  const bokehCount = Math.round(base * 0.035);
  const hazeCount = 26;
  particleCount = base + bokehCount + hazeCount;

  // position(3) + color(3) + size(1) + alpha(1) + phase(1)
  const data = new Float32Array(particleCount * 9);
  let offset = 0;

  const push = (x, y, z, size, alpha) => {
    const color = randomColor();
    data[offset++] = x;
    data[offset++] = y;
    data[offset++] = z;
    data[offset++] = color[0];
    data[offset++] = color[1];
    data[offset++] = color[2];
    data[offset++] = size;
    data[offset++] = alpha;
    data[offset++] = Math.random();
  };

  for (let i = 0; i < base; i++) {
    // Filled ellipsoid shell: denser towards the rim, airy in the middle.
    const radius = 1.0 + Math.pow(Math.random(), 0.62) * 2.55;
    const theta = Math.random() * Math.PI * 2;
    const cosPhi = Math.random() * 2 - 1;
    const sinPhi = Math.sqrt(1 - cosPhi * cosPhi);

    const x = Math.cos(theta) * sinPhi * radius * 1.12;
    const y = cosPhi * radius * 0.8;
    const z = Math.sin(theta) * sinPhi * radius * 0.92;

    const big = Math.random() < 0.055;
    const size = big
      ? 0.03 + Math.random() * 0.022
      : 0.008 + Math.random() * 0.014;
    const alpha = big
      ? 0.85 + Math.random() * 0.15
      : 0.32 + Math.random() * 0.42;

    push(x, y, z, size, alpha);
  }

  for (let i = 0; i < bokehCount; i++) {
    // A handful of out-of-focus specks close to the camera.
    const x = (Math.random() - 0.5) * 7.6;
    const y = (Math.random() - 0.5) * 4.8;
    const z = 1.15 + Math.random() * 0.95;
    const size = 0.1 + Math.random() * 0.12;
    const alpha = 0.02 + Math.random() * 0.035;
    push(x, y, z, size, alpha);
  }

  for (let i = 0; i < hazeCount; i++) {
    // Broad, almost invisible glows that read as depth-of-field haze.
    const x = (Math.random() - 0.5) * 8.2;
    const y = (Math.random() - 0.5) * 5.2;
    const z = -0.6 + Math.random() * 2.4;
    const size = 0.2 + Math.random() * 0.3;
    const alpha = 0.005 + Math.random() * 0.012;
    push(x, y, z, size, alpha);
  }

  const array = new Float32Array(data);
  buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);

  const stride = 9 * 4;
  const attrs = [
    ['aPosition', 3, 0],
    ['aColor', 3, 3],
    ['aSize', 1, 6],
    ['aAlpha', 1, 7],
    ['aPhase', 1, 8],
  ];

  for (const [name, size, offsetInFloats] of attrs) {
    const location = gl.getAttribLocation(program, name);
    if (location < 0) continue;
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(
      location,
      size,
      gl.FLOAT,
      false,
      stride,
      offsetInFloats * 4,
    );
  }
}

function resize() {
  if (!gl || !canvasRef.value) return;
  const rect = canvasRef.value.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 1.35);
  const width = Math.max(1, Math.round(rect.width * dpr));
  const height = Math.max(1, Math.round(rect.height * dpr));

  if (canvasRef.value.width !== width || canvasRef.value.height !== height) {
    canvasRef.value.width = width;
    canvasRef.value.height = height;
  }
  gl.viewport(0, 0, width, height);
}

function draw(time, intro) {
  if (!gl || !program) return;

  gl.useProgram(program);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  if (isDark()) {
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE, gl.ONE, gl.ONE);
  } else {
    gl.blendFuncSeparate(
      gl.SRC_ALPHA,
      gl.ONE_MINUS_SRC_ALPHA,
      gl.ONE,
      gl.ONE_MINUS_SRC_ALPHA,
    );
  }

  gl.uniform1f(uniforms.time, time);
  gl.uniform1f(uniforms.intro, intro);
  gl.uniform2f(uniforms.pointer, pointer.x, pointer.y);
  gl.uniform2f(
    uniforms.viewport,
    canvasRef.value.width,
    canvasRef.value.height,
  );
  gl.uniform1f(uniforms.theme, isDark() ? 1 : 0);

  gl.drawArrays(gl.POINTS, 0, particleCount);
}

function frame(now) {
  if (!running) return;

  if (!lastFrame) lastFrame = now;
  const dt = Math.min((now - lastFrame) / 1000, 0.05);
  lastFrame = now;

  if (!reducedMotion) elapsed += dt;

  // Ease the pointer for a soft, inertial parallax.
  pointer.x += (target.x - pointer.x) * Math.min(1, dt * 3.4);
  pointer.y += (target.y - pointer.y) * Math.min(1, dt * 3.4);

  const intro = reducedMotion
    ? 1
    : Math.min(1, Math.max(0, (now - startedAt) / 1400));

  draw(elapsed, intro * intro * (3 - 2 * intro));
  rafId = requestAnimationFrame(frame);
}

function start() {
  if (running || !gl) return;
  running = true;
  lastFrame = 0;
  rafId = requestAnimationFrame(frame);
}

function stop() {
  running = false;
  if (rafId) cancelAnimationFrame(rafId);
  rafId = 0;
  lastFrame = 0;
}

function onPointerMove(event) {
  target.x = (event.clientX / window.innerWidth - 0.5) * 2;
  target.y = (event.clientY / window.innerHeight - 0.5) * 2;
}

function resetPointer() {
  target.x = 0;
  target.y = 0;
}

function onVisibility() {
  if (document.hidden || !onScreen) stop();
  else start();
}


onMounted(() => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  gl = canvas.getContext('webgl', {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: true,
    powerPreference: 'high-performance',
  });

  if (!gl) {
    canvas.style.display = 'none';
    return;
  }

  program = createProgram();
  if (!program) {
    canvas.style.display = 'none';
    return;
  }

  gl.useProgram(program);
  buildField();
  resize();

  uniforms = {
    time: gl.getUniformLocation(program, 'uTime'),
    intro: gl.getUniformLocation(program, 'uIntro'),
    pointer: gl.getUniformLocation(program, 'uPointer'),
    viewport: gl.getUniformLocation(program, 'uViewport'),
    theme: gl.getUniformLocation(program, 'uTheme'),
  };

  gl.disable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);

  startedAt = performance.now();

  resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);

  themeObserver = new MutationObserver(() => {
    if (reducedMotion) draw(elapsed, 1);
  });
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  visibilityObserver = new IntersectionObserver(
    (entries) => {
      onScreen = entries[0]?.isIntersecting ?? true;
      if (document.hidden || !onScreen) stop();
      else start();
    },
    { threshold: 0.01 },
  );
  visibilityObserver.observe(canvas);

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  document.documentElement.addEventListener('pointerleave', resetPointer, {
    passive: true,
  });
  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);

  removeListeners = () => {
    window.removeEventListener('pointermove', onPointerMove);
    document.documentElement.removeEventListener('pointerleave', resetPointer);
    window.removeEventListener('resize', resize);
    document.removeEventListener('visibilitychange', onVisibility);
  };

  if (reducedMotion) {
    draw(0, 1);
  } else {
    start();
  }

  // Re-measure once fonts/layout settle.
  setTimeout(resize, 250);
});

onBeforeUnmount(() => {
  stop();
  resizeObserver?.disconnect();
  themeObserver?.disconnect();
  visibilityObserver?.disconnect();
  removeListeners?.();
  if (gl) {
    if (buffer) gl.deleteBuffer(buffer);
    if (program) gl.deleteProgram(program);
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    gl = null;
  }
});
</script>

<template>
  <canvas ref="canvasRef" class="hero-particles" aria-hidden="true"></canvas>
</template>

<style scoped>
.hero-particles {
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
