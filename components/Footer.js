import Link from 'next/link';
import { Github, Linkedin, Instagram, ArrowUpRight } from 'lucide-react';

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/cyberneel', Icon: Github },
  { label: 'LinkedIn', href: 'https://linkedin.cyberneel.com/', Icon: Linkedin },
  { label: 'Instagram', href: 'https://instagram.com/cyber_neel', Icon: Instagram },
];

const NAV = [
  { label: 'About', href: '/about' },
  { label: 'Experience', href: '/experience' },
  { label: 'Blog', href: '/blog' },
  { label: 'Posts', href: '/posts' },
  { label: 'Contact', href: '/contact' },
];

const MORE = [
  { label: 'Uses', href: '/uses' },
  { label: 'Now', href: '/now' },
  { label: 'Résumé', href: '/resume' },
  { label: 'RSS', href: '/feed.xml', external: true },
];

export default function Footer() {
  return (
    <footer className="relative mt-32">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="hairline pt-16 pb-12">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_0.9fr]">
            <div>
              <p className="eyebrow mb-4">Get in touch</p>
              <h2 className="font-display text-4xl leading-[1.05] md:text-5xl">
                Let&apos;s build
                <br />
                something <span className="text-accent italic">good.</span>
              </h2>
              <Link href="/contact" className="btn btn-primary mt-7">
                Start a conversation <ArrowUpRight size={17} />
              </Link>
            </div>

            <div>
              <p className="eyebrow mb-5">Sitemap</p>
              <ul className="flex flex-col gap-3">
                {NAV.map((n) => (
                  <li key={n.href}>
                    <Link href={n.href} className="link-underline text-muted transition-colors hover:text-fg">
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="eyebrow mb-5">More</p>
              <ul className="flex flex-col gap-3">
                {MORE.map((n) =>
                  n.external ? (
                    <li key={n.href}>
                      <a href={n.href} className="link-underline text-muted transition-colors hover:text-fg">
                        {n.label}
                      </a>
                    </li>
                  ) : (
                    <li key={n.href}>
                      <Link href={n.href} className="link-underline text-muted transition-colors hover:text-fg">
                        {n.label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <p className="eyebrow mb-5">Elsewhere</p>
              <ul className="flex flex-col gap-3">
                {SOCIALS.map(({ label, href, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 text-muted transition-colors hover:text-fg"
                    >
                      <Icon size={16} />
                      <span className="link-underline">{label}</span>
                      <ArrowUpRight size={13} className="opacity-0 transition-opacity group-hover:opacity-100" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="hairline flex flex-col items-center justify-between gap-3 py-6 sm:flex-row">
          <p className="text-sm text-faint">
            © {new Date().getFullYear()} Neelesh Chevuri
          </p>
          <p className="eyebrow">Tinkerer &amp; Digital Artist</p>
        </div>
      </div>
    </footer>
  );
}
