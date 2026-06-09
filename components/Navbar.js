import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import pages from '../public/pages.json';

function isActive(pathname, itemPath) {
  if (itemPath === '/') return pathname === '/';
  return pathname === itemPath || pathname.startsWith(`${itemPath}/`);
}

function flatten(items) {
  // Drop test/hidden items; lift dropdown children to top level on mobile.
  return items.filter((i) => !i.test);
}

export default function Navbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const close = () => setOpen(false);
    router.events.on('routeChangeStart', close);
    return () => router.events.off('routeChangeStart', close);
  }, [router.events]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const items = flatten(pages).filter((i) => !i.children);
  const dropdowns = flatten(pages).filter((i) => i.children);
  const mobileItems = [
    ...items,
    ...dropdowns.flatMap((d) => d.children || []),
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 pt-4 md:px-6">
        <nav className="glass flex items-center justify-between rounded-full pl-3 pr-2 py-2">

          {/* Brand */}
          <Link href="/" className="group flex items-center gap-2.5 pl-1">
            <span className="grid h-8 w-8 place-items-center overflow-hidden rounded-lg ring-1 ring-line">
              <img
                src="https://cyberneel.github.io/img/CyberNeelLogoNewOutfit1080p-1400x1400.webp"
                alt="CyberNeel"
                className="h-full w-full scale-110 object-cover"
              />
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-fg">
              Cyber<span className="text-accent">Neel</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-1 md:flex">
            {items.map((item) => {
              const active = isActive(router.pathname, item.path);
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  aria-current={active ? 'page' : undefined}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    active ? 'text-fg' : 'text-fg/80 hover:text-fg'
                  }`}
                >
                  <span className="relative">
                    {item.label}
                    <span
                      className={`absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent transition-opacity ${
                        active ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Link
              href="/contact"
              className="hidden rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-[var(--accent-contrast)] transition-transform hover:scale-[1.03] active:scale-95 sm:inline-flex"
            >
              Let&apos;s talk
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={open}
              className="grid h-9 w-9 place-items-center rounded-full text-fg transition-colors hover:bg-bg-tint md:hidden"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 top-0 z-40 bg-bg md:hidden">
          <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 pt-28 pb-12">
            <nav className="flex flex-col">
              {mobileItems.map((item, i) => {
                const active = isActive(router.pathname, item.path);
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`hairline flex items-center justify-between py-5 font-display text-3xl transition-colors ${
                      active ? 'text-accent' : 'text-fg'
                    }`}
                    style={{ borderTop: i === 0 ? 'none' : undefined }}
                  >
                    {item.label}
                    <span className="eyebrow">{String(i + 1).padStart(2, '0')}</span>
                  </Link>
                );
              })}
            </nav>
            <Link href="/contact" className="btn btn-primary mt-8 justify-center">
              Let&apos;s talk
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
