import { useEffect, useRef, useState } from 'react';
import { FileText, Github, Globe, Instagram, Linkedin, Mail } from 'lucide-react';
import Seo from '../components/Seo';
import { LOGO } from '../components/Navbar';

// hello.cyberneel.com (rewritten to /hello in next.config.js): the card I hand to people I meet.
// A red card with my logo that catches the light as it tilts, with my links below. Tap it for the QR on the back.

const LINKS = [
  { label: 'Website', handle: 'cyberneel.com', href: 'https://cyberneel.com', Icon: Globe },
  { label: 'LinkedIn', handle: 'Neelesh Chevuri', href: 'https://linkedin.cyberneel.com', Icon: Linkedin },
  { label: 'GitHub', handle: 'cyberneel', href: 'https://github.com/cyberneel', Icon: Github },
  { label: 'Instagram', handle: 'cyber_neel', href: 'https://instagram.com/cyber_neel', Icon: Instagram },
  { label: 'Email', handle: 'contact@cyberneel.com', href: 'mailto:contact@cyberneel.com', Icon: Mail },
  { label: 'Résumé', handle: 'cyberneel.com/resume', href: 'https://cyberneel.com/resume', Icon: FileText },
];

const clamp = (v) => Math.max(-1, Math.min(1, v));

// Brushed red aluminium. Grooves run along the card, so each light becomes a streak across them (Ward's
// anisotropic highlight), and the grain breaks that streak into fine lines. Same tilt as the CSS, eye at
// the stage's perspective, so the light stays put while the card moves under it.
const FRAG = `precision highp float;
uniform vec2 res, tilt;
uniform float dist;
varying vec2 uv;
float h(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f *= f * (3. - 2. * f);
  return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + 1.), f.x), f.y);
}
mat3 ry(float a) { float c = cos(a), s = sin(a); return mat3(c, 0, -s, 0, 1, 0, s, 0, c); }
mat3 rx(float a) { float c = cos(a), s = sin(a); return mat3(1, 0, 0, 0, c, s, 0, -s, c); }
float ward(vec3 L, vec3 V, vec3 N) {
  vec3 H = normalize(L + V);
  float nl = max(dot(N, L), 0.);
  return exp(-(H.x * H.x / .0036 + H.y * H.y / .2) / (H.z * H.z)) * nl;
}
void main() {
  vec3 P = vec3(uv.x - .5, (uv.y - .5) * res.y / res.x, 0);
  mat3 inv = rx(radians(tilt.y * 14.)) * ry(radians(-tilt.x * 18.));
  vec3 V = normalize(inv * vec3(0, 0, dist) - P);
  float y = uv.y * res.y;
  float g = n(vec2(uv.x * 2.5, y * .7)) * .6 + n(vec2(uv.x * 8., y * 1.6)) * .4;
  vec3 N = normalize(vec3(0, (g - .5) * .1, 1));
  vec3 K = normalize(inv * vec3(-.55, -1, 1.8) - P), F = normalize(inv * vec3(.75, .2, 1.8) - P);
  float spec = (ward(K, V, N) + ward(F, V, N) * .6) * (.6 + .8 * g);
  vec3 col = vec3(.66, .03, .03) * (.94 + .12 * g) * (.35 + .65 * max(dot(N, K), 0.)) + spec * vec3(1, .42, .38);
  gl_FragColor = vec4(pow(col, vec3(1. / 2.2)), 1);
}`;

function metal(c) {
  const gl = c.getContext('webgl');
  if (!gl) return () => {};
  const p = gl.createProgram();
  for (const [type, src] of [
    [gl.VERTEX_SHADER, 'attribute vec2 a;varying vec2 uv;void main(){uv=vec2(a.x,-a.y)*.5+.5;gl_Position=vec4(a,0,1);}'],
    [gl.FRAGMENT_SHADER, FRAG],
  ]) {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    gl.attachShader(p, sh);
  }
  gl.bindAttribLocation(p, 0, 'a');
  gl.linkProgram(p);
  gl.useProgram(p);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  const [res, tilt, dist] = ['res', 'tilt', 'dist'].map((u) => gl.getUniformLocation(p, u));
  // A canvas that never draws stays transparent, so the CSS red behind it is the fallback.
  return (x, y) => {
    const dpr = Math.min(devicePixelRatio, 2);
    const w = Math.round(c.clientWidth * dpr);
    const h = Math.round(c.clientHeight * dpr);
    if (c.width !== w || c.height !== h) {
      c.width = w;
      c.height = h;
      gl.viewport(0, 0, w, h);
    }
    gl.uniform2f(res, w, h);
    gl.uniform2f(tilt, x, y);
    gl.uniform1f(dist, 1100 / c.clientWidth); // .hc-stage perspective, in card widths
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
}

function Card() {
  const ref = useRef(null);
  const [back, setBack] = useState(false);

  // Tilt toward the pointer; with no pointer (phones, idle) sway slowly so the metal still glints.
  useEffect(() => {
    const el = ref.current;
    const draws = [...el.querySelectorAll('.hc-metal')].map(metal);
    draws.forEach((d) => d(0, 0));
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cur = { x: 0, y: 0 };
    const tgt = { x: 0, y: 0 };
    let last = -1e4;
    let raf = 0;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const touch = e.pointerType !== 'mouse';
      if (touch && !el.contains(e.target)) return;
      tgt.x = clamp((e.clientX - r.left - r.width / 2) / (touch ? r.width / 2 : innerWidth / 2));
      tgt.y = clamp((e.clientY - r.top - r.height / 2) / (touch ? r.height / 2 : innerHeight / 2));
      last = performance.now();
    };
    const loop = (t) => {
      if (t - last > 2500) {
        tgt.x = Math.sin(t / 2300) * 0.55;
        tgt.y = Math.cos(t / 3100) * 0.35;
      }
      cur.x += (tgt.x - cur.x) * 0.07;
      cur.y += (tgt.y - cur.y) * 0.07;
      el.style.setProperty('--x', cur.x.toFixed(4));
      el.style.setProperty('--y', cur.y.toFixed(4));
      draws.forEach((d) => d(cur.x, cur.y));
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('pointermove', move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('pointermove', move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="hc-stage">
      <div ref={ref} className="hc-tilt">
        <button
          type="button"
          className={`hc-card${back ? ' is-back' : ''}`}
          onClick={() => setBack(!back)}
          aria-label={back ? 'Show the front of the card' : 'Show the QR code on the back of the card'}
        >
          <span className="hc-face hc-front" aria-hidden={back}>
            <canvas className="hc-metal" />
            <img className="hc-logo" src={LOGO} alt="" />
            <img className="hc-logo hc-fig" src="/hello/figure.webp" alt="" />
            <span className="hc-brand">CyberNeel</span>
            <span className="hc-name">
              Neelesh
              <br />
              Chevuri
            </span>
            <span className="hc-role">Firmware, full stack, 3D</span>
          </span>
          <span className="hc-face hc-back" aria-hidden={!back}>
            <canvas className="hc-metal" />
            <svg className="hc-mark" viewBox="0 0 100 100" aria-hidden>
              <path d="M65.56 34.44 A22 22 0 1 0 65.56 65.56" />
            </svg>
            <span className="hc-brand">CyberNeel</span>
            <img className="hc-qr" src="/hello/qr.svg" alt="QR code for hello.cyberneel.com" />
            <span className="hc-url">
              Scan to open this card
              <br />
              hello.cyberneel.com
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}

export default function Hello() {
  return (
    <main className="hello">
      <Seo title="Hello" description="Neelesh Chevuri: computer science at UT Austin. Links, contact and a quick hello." />
      <Card />
      <p className="hello-hint">Tap the card for a QR code.</p>

      <section className="hello-bio">
        <h1>Hi, I&rsquo;m Neel.</h1>
        <p>
          I study computer science at UT Austin. I write Bluetooth firmware at EM Microelectronic, build telemetry
          for Longhorn Racing Electric, and make Friday, a personal AI that asks before it acts.
        </p>
        <a href="/hello/neelesh-chevuri.vcf" download className="btn primary">
          Save my contact
        </a>
      </section>

      <ul className="hello-links">
        {LINKS.map(({ label, handle, href, Icon }) => (
          <li key={label}>
            <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
              <Icon size={18} aria-hidden />
              <span>{label}</span>
              <span className="h">{handle}</span>
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}

Hello.bare = true; // no site nav or footer
Hello.theme = 'dark';
