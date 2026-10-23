import { useEffect, useCallback, useState } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import TurntableThumb from './TurntableThumb';
import TurntableViewer from './TurntableViewer';

const ctl = 'grid h-11 w-11 place-items-center border border-[#5c5c5c] bg-black text-white hover:bg-[#1a1a1a]';

// Masonry gallery with a lightbox (keyboard prev/next) that links through to the full post.
export default function Gallery({ posts }) {
  const [index, setIndex] = useState(-1);
  const open = index >= 0 && index < posts.length;

  const close = useCallback(() => setIndex(-1), []);
  const prev = useCallback(() => setIndex((i) => (i - 1 + posts.length) % posts.length), [posts.length]);
  const next = useCallback(() => setIndex((i) => (i + 1) % posts.length), [posts.length]);

  // Close if the underlying set changes (e.g. a search query filters it).
  useEffect(() => setIndex(-1), [posts]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, close, prev, next]);

  const current = open ? posts[index] : null;

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {posts.map((p, i) => (
          <button
            key={p.slug}
            onClick={() => setIndex(i)}
            className="group mb-4 block w-full break-inside-avoid border border-line bg-bg text-left"
          >
            {p.turntable ? (
              <TurntableThumb src={p.turntable} poster={p.cover_image_link} alt={p.title} />
            ) : (
              <img src={p.cover_image_link} alt={p.title} loading="lazy" className="block w-full" />
            )}
            <div className="border-t border-hair p-4">
              <p className="text-lg leading-tight group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">{p.title}</p>
              <p className="mt-1 flex gap-4 text-sm text-muted">
                {p.draft && <span>Draft</span>}
                {p.publishedAt && <span className="font-mono text-[13px]">{dayjs(p.publishedAt).format('MMM D, YYYY')}</span>}
              </p>
            </div>
          </button>
        ))}
      </div>

      {current && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-4 md:p-12" onClick={close} role="dialog" aria-modal="true" aria-label={current.title}>
          <div className="absolute left-4 top-4 font-mono text-sm text-[#a3a3a3]">
            {index + 1} of {posts.length}
          </div>
          <button onClick={close} aria-label="Close" className={`${ctl} absolute right-4 top-4`}>
            <X size={20} />
          </button>
          {posts.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous" className={`${ctl} absolute left-3 top-1/2 -translate-y-1/2 md:left-6`}>
                <ChevronLeft size={22} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next" className={`${ctl} absolute right-3 top-1/2 -translate-y-1/2 md:right-6`}>
                <ChevronRight size={22} />
              </button>
            </>
          )}

          <div className="flex max-h-[88vh] w-full max-w-5xl flex-col items-center" onClick={(e) => e.stopPropagation()}>
            {current.turntable ? (
              <div className="w-full max-w-lg">
                <TurntableViewer videoPath={current.turntable} poster={current.cover_image_link} />
              </div>
            ) : (
              <img src={current.cover_image_link} alt={current.title} className="max-h-[76vh] w-auto max-w-full object-contain" />
            )}
            <div className="mt-5 flex w-full flex-wrap items-center justify-between gap-4 text-white">
              <div>
                <p className="text-xl">{current.title}</p>
                {current.publishedAt && (
                  <p className="mt-1 font-mono text-[13px] text-[#a3a3a3]">{dayjs(current.publishedAt).format('MMM D, YYYY')}</p>
                )}
              </div>
              <Link href={`/${current.type}/${current.slug}`} className="btn primary shrink-0">
                View post
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
