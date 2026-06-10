import { useMemo, useState } from 'react';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, MapPin, X, ArrowUpRight, Briefcase, GraduationCap, Sparkles } from 'lucide-react';
import Seo from '../components/Seo';
import FontWrapper from '../components/FontWrapper';
import ImageMDX from '../components/ImageMDX';
import { getAllExperienceData } from '../src/utils/experiences';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'work', label: 'Work' },
  { key: 'education', label: 'Education' },
  { key: 'project', label: 'Projects' },
];

const ICONS = { work: Briefcase, education: GraduationCap, project: Sparkles };

function summaryOf(content) {
  return (content || '').split('=ReAdMoRe=')[0].trim();
}
function detailOf(content) {
  const parts = (content || '').split('=ReAdMoRe=');
  return parts.length > 1 ? parts[1].trim() : '';
}

export default function Experience({ items }) {
  const [filter, setFilter] = useState('all');
  const [active, setActive] = useState(null);
  const [detailSource, setDetailSource] = useState(null);

  const filtered = useMemo(
    () => (filter === 'all' ? items : items.filter((i) => i.category === filter)),
    [filter, items]
  );

  const years = useMemo(
    () => [...new Set(filtered.map((i) => i.year))].sort((a, b) => b - a),
    [filtered]
  );

  const open = async (item) => {
    setActive(item);
    setDetailSource(null);
    const detail = detailOf(item.content);
    if (detail) {
      try {
        setDetailSource(await serialize(detail));
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <>
      <Seo title="Experience" description="The professional, academic, and creative trajectory of Neelesh Chevuri." />

      <section className="mx-auto max-w-5xl px-4 pt-36 pb-10 md:px-6 md:pt-44">
        <header className="mb-12">
          <p className="eyebrow mb-5">Experience</p>
          <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-medium leading-[1.0]">
            The <span className="text-accent italic">trajectory</span>.
          </h1>
        </header>

        <div className="mb-14 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${
                filter === f.key
                  ? 'bg-accent text-[var(--accent-contrast)]'
                  : 'glass text-muted hover:text-fg'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="space-y-16">
          {years.map((year) => (
            <div key={year} className="grid gap-6 md:grid-cols-[7rem_1fr]">
              <div className="md:pt-1">
                <span className="font-display text-3xl text-faint md:sticky md:top-28">{year}</span>
              </div>
              <div className="space-y-5">
                {filtered
                  .filter((i) => i.year === year)
                  .map((item) => {
                    const Icon = ICONS[item.category] || Sparkles;
                    const hasDetail = Boolean(detailOf(item.content));
                    return (
                      <motion.button
                        key={item.id}
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        onClick={() => open(item)}
                        className="card group w-full p-6 text-left hover:-translate-y-0.5"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span className="chip mb-3">
                              <Icon size={12} className="mr-1.5" /> {item.category}
                            </span>
                            <h3 className="font-display text-2xl leading-tight transition-colors group-hover:text-accent">
                              {item.title}
                            </h3>
                            <p className="mt-1 text-[15px] font-medium text-accent">{item.company}</p>
                          </div>
                          {item.link && (
                            <ArrowUpRight
                              size={18}
                              className="shrink-0 text-faint transition-colors group-hover:text-accent"
                            />
                          )}
                        </div>

                        <div className="eyebrow mt-4 flex flex-wrap gap-x-5 gap-y-2">
                          <span className="inline-flex items-center gap-1.5">
                            <Calendar size={12} /> {item.startDate}{item.endDate ? ` — ${item.endDate}` : ''}
                          </span>
                          {item.location && (
                            <span className="inline-flex items-center gap-1.5">
                              <MapPin size={12} /> {item.location}
                            </span>
                          )}
                        </div>

                        <p className="mt-4 line-clamp-2 text-[15px] leading-relaxed text-muted">
                          {summaryOf(item.content)}
                        </p>

                        {(item.keywords || item.technologies) && (
                          <div className="mt-5 flex flex-wrap gap-2">
                            {(item.keywords || item.technologies).slice(0, 5).map((t) => (
                              <span
                                key={t}
                                className="rounded-full border border-line px-2.5 py-1 text-xs text-muted"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}

                        {hasDetail && (
                          <span className="mt-5 inline-block text-sm font-medium text-accent">
                            Read more →
                          </span>
                        )}
                      </motion.button>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Detail modal */}
      <AnimatePresence>
        {active && (
          <div className="fixed inset-0 z-[60] flex items-end justify-center p-0 md:items-center md:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActive(null)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl border border-line bg-[var(--surface-solid)] p-7 md:rounded-3xl md:p-10"
            >
              <button
                onClick={() => setActive(null)}
                aria-label="Close"
                className="glass absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full text-muted hover:text-fg"
              >
                <X size={18} />
              </button>

              <span className="chip mb-4">{active.category}</span>
              <h2 className="font-display text-3xl md:text-4xl">{active.title}</h2>
              <p className="mt-2 text-lg font-medium text-accent">{active.company}</p>
              <div className="eyebrow mt-4 flex flex-wrap gap-x-5 gap-y-2">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={12} /> {active.startDate}{active.endDate ? ` — ${active.endDate}` : ''}
                </span>
                {active.location && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={12} /> {active.location}
                  </span>
                )}
              </div>

              <div className="prose-atelier hairline mt-7 pt-7">
                <p>{summaryOf(active.content)}</p>
                {detailSource && (
                  <MDXRemote {...detailSource} components={{ ImageMDX, Font: FontWrapper }} />
                )}
              </div>

              {active.link && (
                <a href={active.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-8">
                  Visit <ArrowUpRight size={16} />
                </a>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export async function getStaticProps() {
  return { props: { items: getAllExperienceData() } };
}
