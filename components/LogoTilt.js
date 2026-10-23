import { useEffect, useRef, useState } from 'react';
import { LOGO } from './Navbar';

const TILE = 88; // target tile size in px; the count adapts to the pane
const tileSize = (w) => Math.ceil(w / Math.max(1, Math.round(w / TILE))); // whole px keeps seams crisp

// The logo cut into a square grid that fills the hero pane. Tiles near the cursor lift and
// turn toward it. JS only tracks the cursor (in tiles); the falloff lives in .tiles in globals.css.
export default function LogoTilt() {
  const ref = useRef(null);
  const [box, setBox] = useState(null);

  useEffect(() => {
    const el = ref.current;
    const ro = new ResizeObserver(([e]) => setBox({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const t = tileSize(r.width);
      el.style.setProperty('--mx', (e.clientX - r.left) / t);
      el.style.setProperty('--my', (e.clientY - r.top) / t);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener('pointermove', move);
    };
  }, []);

  let tiles = null;
  if (box) {
    const t = tileSize(box.w);
    const cols = Math.ceil(box.w / t);
    const rows = Math.ceil(box.h / t);
    const s = Math.max(box.w, box.h); // the logo is square: cover the pane, centred
    const ox = (box.w - s) / 2;
    const oy = (box.h - s) / 2;
    tiles = Array.from({ length: cols * rows }, (_, i) => {
      const c = i % cols;
      const r = Math.floor(i / cols);
      return (
        <i
          key={i}
          style={{
            '--c': c,
            '--r': r,
            left: c * t,
            top: r * t,
            width: t,
            height: t,
            backgroundSize: `${s}px ${s}px`,
            backgroundPosition: `${ox - c * t}px ${oy - r * t}px`,
          }}
        />
      );
    });
  }

  return (
    <div ref={ref} className="tiles" role="img" aria-label="CyberNeel logo" style={{ '--img': `url(${LOGO})` }}>
      {tiles}
    </div>
  );
}
