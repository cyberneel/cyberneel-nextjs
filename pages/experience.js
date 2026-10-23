import { useEffect, useMemo, useRef, useState } from 'react';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { X } from 'lucide-react';
import Seo from '../components/Seo';
import ImageMDX from '../components/ImageMDX';
import { getAllExperienceData } from '../src/utils/experiences';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'work', label: 'Work' },
  { key: 'education', label: 'Education' },
  { key: 'project', label: 'Projects' },
];
const KIND = { work: 'Work', education: 'Education', project: 'Project' };

function summaryOf(content) {
  return (content || '').split('=ReAdMoRe=')[0].trim();
}
function detailOf(content) {
  const parts = (content || '').split('=ReAdMoRe=');
  return parts.length > 1 ? parts[1].trim() : '';
}

function Meta({ item }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
      <span>{KIND[item.category] || item.category}</span>
      <span className="font-mono text-[13px]">
        {item.startDate}{item.endDate ? ` – ${item.endDate}` : ''}
      </span>
      {item.location && <span>{item.location}</span>}
    </div>
  );
}

export default function Experience({ items }) {
  const [filter, setFilter] = useState('all');
  const [active, setActive] = useState(null);
  const [detailSource, setDetailSource] = useState(null);
  const dialog = useRef(null);

  const filtered = useMemo(
    () => (filter === 'all' ? items : items.filter((i) => i.category === filter)),
    [filter, items]
  );
  const years = useMemo(
    () => [...new Set(filtered.map((i) => i.year))].sort((a, b) => b - a),
    [filtered]
  );

  useEffect(() => {
    if (active && !dialog.current.open) dialog.current.showModal();
  }, [active]);

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
      <Seo title="Experience" description="Work, education and projects of Neelesh Chevuri." />

      <div className="wrap pb-24">
        <header className="page-head">
          <h1>Experience</h1>
          <p>Where I&apos;ve worked, studied and built things.</p>
        </header>

        <div className="ruled mb-14 w-fit grid-cols-4" role="group" aria-label="Filter">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              aria-pressed={filter === f.key}
              className={`h-11 px-3 text-[15px] sm:px-5 ${filter === f.key ? '!bg-fg text-bg' : 'hover:!bg-surface'}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="space-y-14">
          {years.map((year) => (
            <div key={year} className="grid gap-4 md:grid-cols-[7rem_1fr]">
              <div className="font-mono text-2xl font-light text-muted md:sticky md:top-24 md:self-start">{year}</div>
              <div className="ruled">
                {filtered
                  .filter((i) => i.year === year)
                  .map((item) => (
                    <button key={item.id} onClick={() => open(item)} className="group p-6 text-left hover:!bg-surface">
                      <Meta item={item} />
                      <h3 className="mt-3 text-[22px] leading-tight">{item.title}</h3>
                      <p className="mt-1 font-medium">{item.company}</p>
                      <p className="mt-3 line-clamp-2 text-muted">{summaryOf(item.content)}</p>
                      {(item.keywords || item.technologies) && (
                        <p className="mt-3 text-sm text-muted">
                          {(item.keywords || item.technologies).slice(0, 5).join(', ')}
                        </p>
                      )}
                      {detailOf(item.content) && (
                        <span className="mt-4 inline-block font-medium underline decoration-1 underline-offset-[3px] group-hover:decoration-2">
                          Read more
                        </span>
                      )}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <dialog
        ref={dialog}
        onClose={() => setActive(null)}
        onClick={(e) => e.target === dialog.current && dialog.current.close()}
        className="m-auto max-h-[88vh] w-[calc(100%-32px)] max-w-3xl border border-line bg-bg p-0 text-fg backdrop:bg-black/60"
      >
        {active && (
          <div className="p-6 md:p-10">
            <button onClick={() => dialog.current.close()} aria-label="Close" className="theme-btn float-right -mr-2 -mt-2">
              <X />
            </button>
            <Meta item={active} />
            <h2 className="mt-3 text-3xl md:text-4xl">{active.title}</h2>
            <p className="mt-2 text-lg font-medium">{active.company}</p>
            <div className="prose mt-6 border-t border-hair pt-6">
              <p>{summaryOf(active.content)}</p>
              {detailSource && <MDXRemote {...detailSource} components={{ ImageMDX }} />}
            </div>
            {active.link && (
              <a href={active.link} target="_blank" rel="noopener noreferrer" className="btn primary mt-8">
                Open link
              </a>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}

export async function getStaticProps() {
  return { props: { items: getAllExperienceData() } };
}
