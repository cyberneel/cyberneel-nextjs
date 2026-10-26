import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';
import Seo from '../../components/Seo';

// Every guidebook, each next to the reel it goes with. Add new guides at the top.
// reel: the Instagram permalink once the reel is posted (null until then).
const GUIDES = [
  {
    slug: 'bluetooth-finder',
    title: 'Find anything Bluetooth',
    blurb: 'Lost earbuds or a controller? A free scanner app, the signal number, and the turn trick.',
    cover: '/guides/bluetooth-finder/cover.webp',
    reel: 'https://www.instagram.com/reel/De-GNycE3Ra/',
  },
  {
    slug: 'funko-pop',
    title: 'Make your own Funko Pop',
    blurb: 'Photo to printed figure in four free steps: ChatGPT, TRELLIS, Blender, a 3D printer.',
    cover: '/guides/funko-pop/cover.webp',
    reel: 'https://www.instagram.com/reel/De2JYJzk4s7/',
  },
];

const IG = 'https://instagram.com/cyber_neel';

export default function Guides() {
  return (
    <>
      <Seo title="Guides" description="Step-by-step guidebooks for the builds in my reels." />
      <div className="wrap wide pb-24">
        <header className="page-head">
          <h1>Guides</h1>
          <p>The full steps behind my reels: every tool, every prompt, every click.</p>
        </header>
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {GUIDES.map((g) => (
            <article key={g.slug} className="group mb-4 block w-full break-inside-avoid border border-line bg-bg">
              <Link href={`/guides/${g.slug}`} className="block no-underline">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.cover} alt={g.title} loading="lazy" className="block w-full" />
                <div className="border-t border-hair p-4">
                  <p className="text-lg leading-tight text-fg group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">{g.title}</p>
                  <p className="mt-1 text-sm text-muted">{g.blurb}</p>
                </div>
              </Link>
              <div className="flex flex-wrap gap-2 px-4 pb-4">
                <Link href={`/guides/${g.slug}`} className="btn primary sm">
                  Read the guide <ArrowRight size={14} />
                </Link>
                <a href={g.reel || IG} target="_blank" rel="noopener noreferrer" className="btn ghost sm">
                  {g.reel ? 'Watch the reel' : 'Reel soon on Instagram'} <ExternalLink size={13} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
