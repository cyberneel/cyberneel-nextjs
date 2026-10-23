import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import { LOGO } from './Navbar';

const spring = { stiffness: 150, damping: 16, mass: 0.6 };

// The logo tilts toward the cursor on a spring, with a glare that follows the pointer.
export default function LogoTilt() {
  const ref = useRef(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [12, -12]), spring);
  const rotateY = useSpring(useTransform(mx, [0, 1], [-12, 12]), spring);
  const gx = useTransform(mx, [0, 1], ['0%', '100%']);
  const gy = useTransform(my, [0, 1], ['0%', '100%']);
  const glare = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.45), rgba(255,255,255,0) 55%)`;

  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const reset = () => { mx.set(0.5); my.set(0.5); };

  return (
    <div className="w-full max-w-[420px] [perspective:1100px]">
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={reset}
        style={{ rotateX, rotateY }}
        className="relative aspect-square w-full overflow-hidden border border-line will-change-transform"
      >
        <img src={LOGO} alt="CyberNeel logo" className="h-full w-full scale-105 object-cover" draggable={false} />
        <motion.div style={{ backgroundImage: glare }} className="pointer-events-none absolute inset-0 mix-blend-soft-light" />
      </motion.div>
    </div>
  );
}
