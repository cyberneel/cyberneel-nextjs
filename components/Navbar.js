import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export const LOGO = 'https://cyberneel.github.io/img/CyberNeelLogoNewOutfit1080p-1400x1400.webp';

const ITEMS = [
  { label: 'About', path: '/about' },
  { label: 'Experience', path: '/experience' },
  { label: 'Blog', path: '/blog' },
  { label: 'Posts', path: '/posts' },
];

export default function Navbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const close = () => setOpen(false);
    router.events.on('routeChangeStart', close);
    return () => router.events.off('routeChangeStart', close);
  }, [router.events]);

  const active = (p) => router.pathname === p || router.pathname.startsWith(`${p}/`);

  return (
    <nav className="site-nav">
      <div className="wrap wide navin">
        <Link href="/" className="logo">
          <img src={LOGO} alt="" />
          <span>Cyber<span className="text-accent">Neel</span></span>
        </Link>
        <ThemeToggle />
        <button
          className="navtoggle"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X /> : <Menu />}
        </button>
        <div className={`navmenu${open ? ' open' : ''}`}>
          <div className="navlinks">
            {ITEMS.map((i) => (
              <Link key={i.path} href={i.path} aria-current={active(i.path) ? 'page' : undefined}>
                {i.label}
              </Link>
            ))}
          </div>
          <div className="navacts">
            <ThemeToggle />
            <Link href="/contact" className="btn primary">Get in touch</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
