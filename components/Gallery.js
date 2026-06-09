import { useEffect, useCallback, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import TurntableThumb from './TurntableThumb';
import TurntableViewer from './TurntableViewer';

// Masonry image gallery with a zoom lightbox. Clicking a tile opens the
// lightbox (keyboard + prev/next); the lightbox links through to the full post.
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
      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [column-fill:_balance]">
        {posts.map((p, i) => (
          <button
            key={p.slug}
            onClick={() => setIndex(i)}
            className="group mb-5 block w-full break-inside-avoid overflow-hidden rounded-2xl border border-line bg-bg-tint text-left transition-all duration-300 hover:-translate-y-1 hover:border-line-strong"
          >
            <div className="relative overflow-hidden rounded-2xl">
              {p.turntable ? (
                <TurntableThumb src={p.turntable} poster={p.cover_image_link} alt={p.title} />
              ) : (
                <img
                  src={p.cover_image_link}
                  alt={p.title}
                  loading="lazy"
                  className="w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              )}
              <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="p-5">
                  {p.draft && <span className="chip mb-2 border-amber-400/30 bg-amber-400/15 text-amber-300">Draft</span>}
                  <p className="font-display text-lg leading-tight text-white">{p.title}</p>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {open && current && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 md:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              className="absolute inset-0 bg-black/88 backdrop-blur-md"
            />

            {/* counter */}
            <div className="eyebrow absolute left-5 top-5 z-10 text-white/60">
              {index + 1} / {posts.length}
            </div>

            {/* close */}
            <button
              onClick={close}
              aria-label="Close"
              className="glass absolute right-5 top-5 z-10 grid h-10 w-10 place-items-center rounded-full text-white"
            >
              <X size={20} />
            </button>

            {/* prev / next */}
            {posts.length > 1 && (
              <>
                <button
                  onClick={prev}
                  aria-label="Previous"
                  className="glass absolute left-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full text-white md:left-6"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  onClick={next}
                  aria-label="Next"
                  className="glass absolute right-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full text-white md:right-6"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}

            <motion.div
              key={current.slug}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-0 flex max-h-[88vh] w-full max-w-5xl flex-col items-center"
            >
              {current.turntable ? (
                <div className="w-full max-w-lg">
                  <TurntableViewer videoPath={current.turntable} poster={current.cover_image_link} />
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={current.cover_image_link}
                  alt={current.title}
                  className="max-h-[76vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
                />
              )}
              <div className="mt-5 flex w-full items-center justify-between gap-4">
                <div>
                  <p className="font-display text-xl text-white">{current.title}</p>
                  {current.publishedAt && (
                    <p className="eyebrow mt-1 text-white/50">
                      {new Date(current.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  )}
                </div>
                <Link
                  href={`/${current.type}/${current.slug}`}
                  className="btn btn-primary shrink-0"
                >
                  View post <ArrowUpRight size={16} />
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
