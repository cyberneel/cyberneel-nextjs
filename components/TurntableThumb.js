import { useRef } from 'react';
import { RotateCw } from 'lucide-react';

// Gallery tile for a turntable post: shows the poster, spins the turntable
// video on hover. Video is only loaded when first hovered (preload="none").
export default function TurntableThumb({ src, poster, alt }) {
  const ref = useRef(null);

  const enter = () => ref.current?.play().catch(() => {});
  const leave = () => {
    const v = ref.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  };

  return (
    <div className="relative" onMouseEnter={enter} onMouseLeave={leave} onContextMenu={(e) => e.preventDefault()}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={poster} alt={alt} loading="lazy" draggable={false} className="block w-full" />
      <video
        ref={ref}
        src={src}
        muted
        loop
        playsInline
        preload="none"
        draggable={false}
        disablePictureInPicture
        controlsList="nodownload noremoteplayback"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <span className="chip absolute right-3 top-3 backdrop-blur-md">
        <RotateCw size={11} className="mr-1" /> 3D
      </span>
    </div>
  );
}
