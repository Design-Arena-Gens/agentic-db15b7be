"use client";

import { useEffect, useRef } from 'react';

const VERT = `
attribute vec2 position;
void main(){
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

// Fragment shader: animated data-curves + flow noise + mouse distortion
const FRAG = `
precision highp float;

uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse; // normalized 0..1

// Hash/Noise helpers
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p){
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f*f*(3.0-2.0*f);
  return mix(a, b, u.x) + (c - a)*u.y*(1.0 - u.x) + (d - b)*u.x*u.y;
}

// Signed distance to a sin-based curve
float sdCurve(vec2 uv, float amp, float freq, float phase, float thickness){
  float y = sin(uv.x * freq + phase) * amp;
  float d = abs(uv.y - y);
  return smoothstep(thickness, 0.0, d);
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy; // 0..1
  vec2 p = (gl_FragCoord.xy - 0.5 * u_res.xy) / u_res.y; // aspect-corrected space

  // Mouse attractor
  vec2 m = u_mouse * 2.0 - 1.0;
  m.x *= u_res.x / u_res.y;
  float r = length(p - m);
  float distort = exp(-r * 3.0) * 0.3;
  p.y += distort * 0.25;

  // Flow field background
  float t = u_time * 0.25;
  float f = noise(p * 2.0 + t) * 0.7 + noise(p * 8.0 - t) * 0.3;

  // Build multi-curve signal representing data streams
  float curves = 0.0;
  curves += sdCurve(p * vec2(1.0, 1.2), 0.18, 4.2, t * 2.0, 0.02);
  curves += sdCurve(p * vec2(1.0, 1.0), 0.24, 3.1, t * 1.4 + 2.0, 0.018);
  curves += sdCurve(p * vec2(1.0, 0.9), 0.32, 2.2, t * 1.1 + 4.0, 0.016);

  // Contour lines (iso-lines) suggest structure
  float iso = fract((p.y + f * 0.1 + t * 0.05) * 20.0);
  float grid = smoothstep(0.0, 0.03, iso) * 0.08;

  // Colors
  vec3 base = vec3(0.04, 0.05, 0.07);
  vec3 accentA = vec3(0.48, 0.64, 1.0); // #7aa2ff
  vec3 accentB = vec3(0.07, 0.83, 1.0); // #12d5ff

  float vignette = smoothstep(1.2, 0.2, length(p));

  // Blend curves with flow
  float glow = curves * (0.6 + 0.6 * f) + grid;
  vec3 col = base + glow * mix(accentA, accentB, uv.x);

  // Subtle vertical gradient
  col *= mix(0.85, 1.15, uv.y);

  // Vignette and depth
  col *= mix(0.85, 1.0, vignette);

  gl_FragColor = vec4(col, 1.0);
}
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) || 'Shader compile error');
  }
  return shader;
}

export default function ShaderBackground() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const gl = canvas.getContext('webgl', { antialias: true, powerPreference: 'high-performance' });
    if (!gl) return;

    // Setup program
    const vs = createShader(gl, gl.VERTEX_SHADER, VERT);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAG);
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) || 'Program link error');
    }

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    // Two triangles covering clip space
    const verts = new Float32Array([
      -1, -1, 1, -1, -1, 1,
      -1,  1, 1, -1, 1,  1
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, 'position');
    const timeLoc = gl.getUniformLocation(program, 'u_time');
    const resLoc = gl.getUniformLocation(program, 'u_res');
    const mouseLoc = gl.getUniformLocation(program, 'u_mouse');

    const DPR = Math.min(2, window.devicePixelRatio || 1);

    function resize() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const dw = Math.max(1, Math.floor(w * DPR));
      const dh = Math.max(1, Math.floor(h * DPR));
      if (canvas.width !== dw || canvas.height !== dh) {
        canvas.width = dw; canvas.height = dh;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    let mouse = { x: 0.5, y: 0.2 };
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) / rect.width;
      mouse.y = (e.clientY - rect.top) / rect.height;
    };
    window.addEventListener('mousemove', onMove);

    let raf = 0; let start = performance.now();
    function frame() {
      raf = requestAnimationFrame(frame);
      resize();

      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.enableVertexAttribArray(positionLoc);
      gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

      gl.uniform1f(timeLoc, (performance.now() - start) / 1000);
      gl.uniform2f(resLoc, canvas.width, canvas.height);
      gl.uniform2f(mouseLoc, mouse.x, 1.0 - mouse.y);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    frame();

    const obs = new ResizeObserver(() => resize());
    obs.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      obs.disconnect();
      gl.deleteProgram(program);
      gl.deleteShader(vs); gl.deleteShader(fs);
      gl.deleteBuffer(quad!);
    };
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0 }} aria-hidden>
      <canvas ref={ref} style={{ width: '100%', height: '100%', display: 'block' }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(800px 400px at 50% 0%, rgba(18,213,255,0.08), transparent)',
        pointerEvents: 'none'
      }} />
    </div>
  );
}
