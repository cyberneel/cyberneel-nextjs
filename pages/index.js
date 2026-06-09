import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Seo from '../components/Seo';
import PostCard from '../components/PostCard';
import LogoTilt from '../components/LogoTilt';
import { getAllPosts, getAllArticles } from '../src/utils/mdx';

const fade = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

const FOCUS = [
  { k: '01', t: 'Engineering', d: 'Full-stack systems, AI/ML pipelines, and the infrastructure behind them.' },
  { k: '02', t: 'Tinkering', d: 'Embedded firmware, hardware hacks, and open-source contributions.' },
  { k: '03', t: 'Digital Art', d: '3D renders and stylized scenes — exploring fields through computer graphics.' },
];

export default function Home({ featured }) {
  return (
    <>
      <Seo />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-36 pb-24 md:px-6 md:pt-48">
        <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.85fr] lg:gap-16">
          <div>
            <motion.h1
              variants={fade}
              initial="hidden"
              animate="show"
              className="font-display text-[clamp(2.75rem,6.5vw,5rem)] font-medium leading-[0.96]"
            >
              At the seam of <span className="text-accent italic">code</span>{' '}&amp; craft.
            </motion.h1>

            <motion.p
              variants={fade}
              initial="hidden"
              animate="show"
              custom={2}
              className="mt-7 max-w-xl text-lg leading-relaxed text-muted"
            >
              I&apos;m Neelesh — I build software and systems, tinker with hardware, and make digital
              art. This is my workspace for the projects, writing, and rabbit holes in between.
            </motion.p>

            <motion.div
              variants={fade}
              initial="hidden"
              animate="show"
              custom={3}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <Link href="/posts" className="btn btn-primary">
                View the work <ArrowUpRight size={17} />
              </Link>
              <Link href="/about" className="btn btn-ghost">
                About me
              </Link>
            </motion.div>
          </div>

          {/* Interactive 3D logo */}
          <div className="hidden lg:block">
            <LogoTilt />
          </div>
        </div>

        <motion.div
          variants={fade}
          initial="hidden"
          animate="show"
          custom={4}
          className="hairline mt-16 flex flex-wrap items-center gap-x-8 gap-y-3 pt-7"
        >
          {['CTO @ AiME Technologies', 'CS @ UT Austin', 'Swift Student Challenge ’25'].map((m) => (
            <span key={m} className="eyebrow">{m}</span>
          ))}
        </motion.div>
      </section>

      {/* Focus */}
      <section className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-3">
          {FOCUS.map((f) => (
            <div key={f.k} className="bg-bg p-7">
              <p className="eyebrow">{f.k}</p>
              <h3 className="mt-4 font-display text-2xl">{f.t}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Selected work */}
      <section className="mx-auto max-w-6xl px-4 pt-28 md:px-6">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="eyebrow mb-3">Latest</p>
            <h2 className="font-display text-4xl md:text-5xl">Selected work &amp; writing</h2>
          </div>
          <Link href="/posts" className="link-underline hidden text-muted hover:text-fg sm:inline-flex">
            View all →
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((post, i) => (
            <PostCard key={`${post.type}-${post.slug}`} post={post} priority={i < 3} />
          ))}
        </div>

        <div className="mt-10 sm:hidden">
          <Link href="/posts" className="btn btn-ghost w-full justify-center">
            View all work
          </Link>
        </div>
      </section>
    </>
  );
}

export async function getStaticProps() {
  const [posts, blogs] = [await getAllPosts(), await getAllArticles()];
  const isLocal = process.env.NODE_ENV !== 'production' || process.env.VERCEL_ENV === 'development';

  const featured = posts
    .concat(blogs)
    .filter((a) => isLocal || !a.draft)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, 6);

  return { props: { featured } };
}
