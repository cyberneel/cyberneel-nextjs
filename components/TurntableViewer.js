import { useEffect, useRef, useState, useCallback } from 'react';
import { RotateCw, Hand } from 'lucide-react';

// Drag-to-rotate "turntable" viewer. The model is a pre-rendered 360° video;
// dragging horizontally scrubs through it so it feels like spinning a real 3D
// object — without ever exposing the model file or a single high-res still.
//
//   <TurntableViewer videoPath="/3d/RoboHead.mp4" caption="Robo Head — Nomad Sculpt" />
export default function TurntableViewer({
  videoPath,
  poster,
  caption,
  autoSpin = true,
  rotations = 1.1, // full-width drags per full turn
}) {
  const wrapRef = useRef(null);
  const videoRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [hint, setHint] = useState(true);

  // Mutable interaction state kept in a ref so the rAF loop sees fresh values.
  const st = useRef({ down: false, hovered: false, startX: 0, startTime: 0, vel: 0, lastX: 0, lastT: 0 });

  const fallbackPoster = poster || videoPath.replace(/\.(mp4|mov|webm)$/i, '.webp');

  const setTime = useCallback((t) => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const d = v.duration;
    v.currentTime = ((t % d) + d) % d; // wrap for seamless looping
  }, []);

  // Idle auto-spin + inertia, all on one rAF loop.
  useEffect(() => {
    let raf;
    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const v = videoRef.current;
      const s = st.current;
      if (v && v.duration) {
        if (s.down) {
          // controlled by pointer move
        } else if (Math.abs(s.vel) > 0.0005) {
          // inertia: vel is in "turns per second"
          setTime(v.currentTime + s.vel * v.duration * dt);
          s.vel *= 0.94;
        } else if (autoSpin && !s.hovered) {
          setTime(v.currentTime + (v.duration / 22) * dt); // ~22s per turn
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [autoSpin, setTime]);

  const onPointerDown = (e) => {
    const v = videoRef.current;
    if (!v) return;
    setDragging(true);
    setHint(false);
    const s = st.current;
    s.down = true;
    s.startX = e.clientX;
    s.startTime = v.currentTime;
    s.lastX = e.clientX;
    s.lastT = performance.now();
    s.vel = 0;
    wrapRef.current?.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    const s = st.current;
    const v = videoRef.current;
    const wrap = wrapRef.current;
    if (!s.down || !v || !wrap) return;
    const width = wrap.clientWidth || 1;
    const dx = e.clientX - s.startX;
    setTime(s.startTime + (dx / width) * rotations * v.duration);
    // track velocity for inertia (turns/sec)
    const now = performance.now();
    const dt = Math.max(1, now - s.lastT) / 1000;
    s.vel = ((e.clientX - s.lastX) / width) * rotations / dt;
    s.lastX = e.clientX;
    s.lastT = now;
  };

  const endDrag = () => {
    const s = st.current;
    if (!s.down) return;
    s.down = false;
    setDragging(false);
  };

  return (
    <figure className="not-prose my-12">
      <div
        ref={wrapRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerEnter={() => (st.current.hovered = true)}
        onPointerLeave={() => {
          st.current.hovered = false;
          endDrag();
        }}
        onContextMenu={(e) => e.preventDefault()}
        className="card group relative select-none overflow-hidden"
        style={{ cursor: dragging ? 'grabbing' : 'grab', touchAction: 'pan-y' }}
      >
        <video
          ref={videoRef}
          src={videoPath}
          poster={fallbackPoster}
          muted
          loop
          playsInline
          preload="auto"
          draggable={false}
          disablePictureInPicture
          controlsList="nodownload noremoteplayback noplaybackrate"
          onLoadedMetadata={(e) => {
            e.currentTarget.pause();
            setLoaded(true);
          }}
          className="pointer-events-none block w-full"
        />

        {/* badge */}
        <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5">
          <span className="chip backdrop-blur-md">
            <RotateCw size={11} className="mr-1" /> 3D Turntable
          </span>
        </div>

        {/* drag hint (fades after first interaction) */}
        <div
          className={`pointer-events-none absolute inset-0 flex items-end justify-center pb-5 transition-opacity duration-500 ${
            hint && loaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className="glass flex items-center gap-2 rounded-full px-4 py-2 text-sm text-fg">
            <Hand size={15} /> Drag to rotate
          </span>
        </div>

        {/* loading shimmer */}
        {!loaded && (
          <div className="absolute inset-0 grid place-items-center bg-bg-tint">
            <RotateCw size={22} className="animate-spin text-accent" />
          </div>
        )}
      </div>

      {caption && (
        <figcaption className="mt-3 text-center text-sm text-muted">{caption}</figcaption>
      )}
    </figure>
  );
}
