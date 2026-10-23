import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate, useTime, useReducedMotion } from 'framer-motion';
import { LOGO } from './Navbar';

const spring = { stiffness: 120, damping: 18, mass: 0.7 };

// Soft ellipses unioned into one blob mask: centre and radii (% of the pane), how far each
// leans toward the cursor, and its drift period in ms. Different leans make the edge wobble.
// Keep x/y ± (r + k + 4) inside 0..100 or the fade hits the pane edge and cuts off hard.
const BLOBS = [
  { x: 50, y: 54, rx: 34, ry: 34, k: 5, p: 9000 },
  { x: 44, y: 58, rx: 26, ry: 26, k: 9, p: 11000 },
  { x: 56, y: 44, rx: 24, ry: 24, k: 12, p: 13000 },
];
const clamp = (v) => Math.max(-1, Math.min(1, v));

// The logo fills the hero pane and fades out at an organic edge. The blob, the image
// and a glare all follow the cursor anywhere on the page.
export default function LogoTilt() {
  const ref = useRef(null);
  const still = useReducedMotion();
  const mx = useMotionValue(0); // -1..1 from the pane centre
  const my = useMotionValue(0);
  const sx = useSpring(mx, spring);
  const sy = useSpring(my, spring);
  const time = useTime();

  useEffect(() => {
    const move = (e) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      mx.set(clamp(((e.clientX - r.left) / r.width) * 2 - 1));
      my.set(clamp(((e.clientY - r.top) / r.height) * 2 - 1));
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [mx, my]);

  // ponytail: repaints the mask every frame for the drift; pause offscreen if it ever shows up in profiles
  const mask = useTransform([sx, sy, time], ([x, y, t]) =>
    BLOBS.map((b) => {
      const a = still ? 0 : (t / b.p) * 2 * Math.PI;
      const cx = b.x + x * b.k + Math.sin(a) * 4;
      const cy = b.y + y * b.k + Math.cos(a * 1.3) * 4;
      return `radial-gradient(ellipse ${b.rx}% ${b.ry}% at ${cx}% ${cy}%, #000 50%, transparent)`;
    }).join(', ')
  );
  const rotateY = useTransform(sx, [-1, 1], [-7, 7]);
  const rotateX = useTransform(sy, [-1, 1], [7, -7]);
  const x = useTransform(sx, [-1, 1], ['2%', '-2%']);
  const y = useTransform(sy, [-1, 1], ['2%', '-2%']);
  const gx = useTransform(sx, [-1, 1], ['0%', '100%']);
  const gy = useTransform(sy, [-1, 1], ['0%', '100%']);
  const glare = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.4), rgba(255,255,255,0) 50%)`;

  return (
    <motion.div ref={ref} style={{ maskImage: mask, WebkitMaskImage: mask }} className="absolute inset-0 [perspective:1100px]">
      <motion.img
        src={LOGO}
        alt="CyberNeel logo"
        style={{ rotateX, rotateY, x, y }}
        className="h-full w-full scale-110 object-cover will-change-transform"
        draggable={false}
      />
      <motion.div style={{ backgroundImage: glare }} className="pointer-events-none absolute inset-0 mix-blend-soft-light" />
    </motion.div>
  );
}
