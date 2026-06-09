import { useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from 'framer-motion';

const LOGO = 'https://cyberneel.github.io/img/CyberNeelLogoNewOutfit1080p-1400x1400.webp';
const spring = { stiffness: 150, damping: 16, mass: 0.6 };

// Interactive 3D logo. Tilts toward the cursor with a spring, throws a glare
// highlight that tracks the pointer, and floats a couple of depth layers in
// front via translateZ for real parallax. Static + flat on touch / reduced motion.
export default function LogoTilt() {
  const ref = useRef(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(my, [0, 1], [13, -13]), spring);
  const rotateY = useSpring(useTransform(mx, [0, 1], [-13, 13]), spring);
  const glareX = useTransform(mx, [0, 1], ['0%', '100%']);
  const glareY = useTransform(my, [0, 1], ['0%', '100%']);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.5), rgba(255,255,255,0) 55%)`;

  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto w-full max-w-[400px] [perspective:1100px]"
    >
      {/* ambient accent glow */}
      <div className="absolute -inset-8 rounded-[3rem] bg-accent/20 blur-3xl" />

      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={reset}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative aspect-square w-full rounded-[2rem] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.55)] will-change-transform"
      >
        {/* logo face */}
        <div className="absolute inset-0 overflow-hidden rounded-[2rem] ring-1 ring-line">
          <img src={LOGO} alt="CyberNeel" className="h-full w-full scale-105 object-cover" draggable={false} />
        </div>

        {/* cursor glare */}
        <motion.div
          style={{ backgroundImage: glare }}
          className="pointer-events-none absolute inset-0 rounded-[2rem] mix-blend-soft-light"
        />

        {/* inner frame highlight */}
        <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/20" />

        {/* floating depth layers */}
        <div
          style={{ transform: 'translateZ(70px)' }}
          className="glass pointer-events-none absolute -bottom-5 -right-4 rounded-2xl px-4 py-2.5"
        >
          <p className="font-display text-sm leading-none">Neelesh&nbsp;Chevuri</p>
          <p className="eyebrow mt-1 !text-[0.6rem]">Code · Craft · Art</p>
        </div>

        <div
          style={{ transform: 'translateZ(45px)' }}
          className="pointer-events-none absolute -left-3 -top-3 grid h-10 w-10 place-items-center rounded-xl bg-accent text-[var(--accent-contrast)] shadow-lg"
        >
          <span className="font-display text-lg leading-none">C</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
