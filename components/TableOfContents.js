import { useEffect, useState } from 'react';

export default function TableOfContents({ toc }) {
  const [active, setActive] = useState('');

  useEffect(() => {
    if (!toc?.length) return;
    const els = toc.map((t) => document.getElementById(t.id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-90px 0px -70% 0px', threshold: 0 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [toc]);

  if (!toc?.length) return null;

  return (
    <nav aria-label="Table of contents">
      <p className="eyebrow mb-4">On this page</p>
      <ul className="border-l border-line">
        {toc.map((t) => (
          <li key={t.id}>
            <a
              href={`#${t.id}`}
              className={`-ml-px block border-l-2 py-1.5 text-sm leading-snug transition-colors ${
                active === t.id
                  ? 'border-accent text-fg'
                  : 'border-transparent text-muted hover:text-fg'
              }`}
              style={{ paddingLeft: t.level === 3 ? '1.65rem' : '0.85rem' }}
            >
              {t.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
