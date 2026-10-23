import { useEffect, useRef } from 'react';
import { LOGO } from './Navbar';

const TILE = 22; // target tile size in px; the count adapts to the pane
const DOME = 88; // px per unit of the cursor dome, so it keeps its size whatever the tiles
const R = 4.5; // dome radius in DOME units
const LIFT = 70; // px the dome's peak rises toward the viewer
const TILT = (32 * Math.PI) / 180; // most a tile tilts away from the cursor
const P = 900; // perspective distance in px
const clamp = (v) => Math.max(-1, Math.min(1, v));

// The logo cut into a square grid that fills the hero pane, drawn on one canvas so a thousand
// tiles stay cheap. Tiles near the cursor lift into a dome and tilt away from it. Frames are
// drawn only while the dome moves.
export default function LogoTilt() {
  const ref = useRef(null);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv.getContext('2d');
    const img = new Image();
    img.src = LOGO;
    let w = 0;
    let h = 0;
    let raf = 0;
    const cur = { x: -R, y: -R }; // dome centre, eased toward tgt (DOME units)
    const tgt = { x: -R, y: -R };
    const out = (p) => p.x <= -R || p.y <= -R || p.x >= w / DOME + R || p.y >= h / DOME + R;

    const draw = () => {
      if (!img.complete || !img.naturalWidth || !w) return;
      const t = Math.ceil(w / Math.max(1, Math.round(w / TILE))); // whole px keeps seams crisp
      const s = Math.max(w, h); // the logo is square: cover the pane, centred
      const ox = (w - s) / 2;
      const oy = (h - s) / 2;
      const k = img.naturalWidth / s;
      const tiles = [];
      for (let y = t / 2; y - t / 2 < h; y += t)
        for (let x = t / 2; x - t / 2 < w; x += t) {
          const dx = cur.x - x / DOME;
          const dy = cur.y - y / DOME;
          // smooth bump: zero slope at the rim, so the dome has no visible edge
          const f = (1 - Math.min(1, (dx * dx + dy * dy) / (R * R))) ** 2;
          tiles.push({ x, y, dx, dy, f });
        }
      tiles.sort((a, b) => a.f - b.f); // raised tiles paint last
      ctx.clearRect(0, 0, w, h);
      for (const { x, y, dx, dy, f } of tiles) {
        const z = P / (P - f * LIFT);
        const tw = (t - 1) * z * Math.cos(clamp(dx) * f * TILT);
        const th = (t - 1) * z * Math.cos(clamp(dy) * f * TILT);
        const X = w / 2 + (x - w / 2) * z;
        const Y = h / 2 + (y - h / 2) * z;
        ctx.drawImage(img, (x - t / 2 - ox) * k, (y - t / 2 - oy) * k, (t - 1) * k, (t - 1) * k, X - tw / 2, Y - th / 2, tw, th);
      }
    };

    const loop = () => {
      cur.x += (tgt.x - cur.x) * 0.18;
      cur.y += (tgt.y - cur.y) * 0.18;
      if (Math.abs(tgt.x - cur.x) + Math.abs(tgt.y - cur.y) < 0.002) {
        Object.assign(cur, tgt);
        raf = 0;
      } else raf = requestAnimationFrame(loop);
      draw();
    };

    const move = (e) => {
      const b = cv.getBoundingClientRect();
      tgt.x = Math.min(Math.max((e.clientX - b.left) / DOME, -R), w / DOME + R);
      tgt.y = Math.min(Math.max((e.clientY - b.top) / DOME, -R), h / DOME + R);
      if (out(tgt) && out(cur)) Object.assign(cur, tgt); // flat either way: nothing to draw
      else if (!raf) raf = requestAnimationFrame(loop);
    };

    const size = () => {
      const d = devicePixelRatio || 1;
      ({ width: w, height: h } = cv.getBoundingClientRect());
      cv.width = Math.round(w * d);
      cv.height = Math.round(h * d);
      ctx.setTransform(d, 0, 0, d, 0, 0);
      ctx.imageSmoothingQuality = 'high';
      draw();
    };

    const ro = new ResizeObserver(size);
    ro.observe(cv);
    img.onload = draw;
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!still) window.addEventListener('pointermove', move, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener('pointermove', move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={ref} role="img" aria-label="CyberNeel logo" className="absolute inset-0 h-full w-full" />;
}
