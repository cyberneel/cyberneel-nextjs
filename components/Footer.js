import Link from 'next/link';

const LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Experience', href: '/experience' },
  { label: 'Résumé', href: '/resume' },
  { label: 'Now', href: '/now' },
  { label: 'Uses', href: '/uses' },
  { label: 'RSS', href: '/feed.xml' },
  { label: 'GitHub', href: 'https://github.com/cyberneel' },
  { label: 'LinkedIn', href: 'https://linkedin.cyberneel.com/' },
  { label: 'Instagram', href: 'https://instagram.com/cyber_neel' },
];

export default function Footer() {
  return (
    <footer className="band">
      <div className="wrap wide footin">
        <span>© {new Date().getFullYear()} Neelesh Chevuri</span>
        <div>
          {LINKS.map((l) =>
            l.href.startsWith('/') && l.href !== '/feed.xml' ? (
              <Link key={l.label} href={l.href}>{l.label}</Link>
            ) : (
              <a key={l.label} href={l.href}>{l.label}</a>
            )
          )}
        </div>
      </div>
    </footer>
  );
}
