import Link from 'next/link';
import Seo from '../components/Seo';
import PostCard from '../components/PostCard';
import LogoTilt from '../components/LogoTilt';
import { getAllPosts, getAllArticles } from '../src/utils/mdx';

const FACTS = [
  { k: 'Now', v: 'Embedded software intern at EM Microelectronic' },
  { k: 'Studying', v: 'Computer science at UT Austin' },
  { k: 'Recognition', v: 'Swift Student Challenge distinguished winner, 2025' },
];

const PROJECTS = [
  {
    name: 'FridayOS',
    blurb: 'A personal AI for your tasks, calendar, email and calls. It reaches out when something needs you, and asks before it acts.',
    href: 'https://systems.cyberneel.com',
    cta: 'Meet Friday',
  },
  {
    name: 'indrajaal',
    blurb: 'Tasks and calendars as one graph, with readiness from Apple Health.',
    href: 'https://systems.cyberneel.com/handbook#tasks',
    cta: 'See indrajaal',
  },
  {
    name: 'Polymux',
    blurb: 'Run and steer coding agents across your machines. Free and open source.',
    href: 'https://github.com/cyberneel/polymux',
    cta: 'Get Polymux',
  },
];

export default function Home({ featured }) {
  return (
    <>
      <Seo />

      <section className="hero">
        <div className="wrap wide hero-in" style={{ padding: 0 }}>
          <div className="hero-l">
            <h1>I build software, hardware and digital art.</h1>
            <div className="hero-copy">
              <p>
                I&apos;m Neelesh Chevuri, a computer science student at UT Austin. I write firmware, build
                full-stack systems and make 3D art. This is where I keep the work and the writing.
              </p>
              <div className="cta-row">
                <Link href="/posts" className="btn primary">See my work</Link>
                <Link href="/about" className="btn ghost">About me</Link>
              </div>
            </div>
          </div>
          <div className="hero-r">
            <LogoTilt />
          </div>
        </div>
        <div className="wrap wide" style={{ padding: 0 }}>
          <div className="facts">
            {FACTS.map((f) => (
              <div key={f.k}>
                <div className="k">{f.k}</div>
                <div className="v">{f.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band projects">
        <div className="wrap wide projects-in" style={{ padding: 0 }}>
          <div className="projects-l">
            <h2 className="sec-h">Things I&apos;m building</h2>
            <p>A personal AI, the task graph behind it and a way to run coding agents. They work as one.</p>
          </div>
          <div className="ruled">
            {PROJECTS.map((p) => (
              <article key={p.name}>
                <h3>{p.name}</h3>
                <p>{p.blurb}</p>
                <a href={p.href} className="lnk">{p.cta}</a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-[clamp(56px,8vw,96px)]">
        <div className="wrap wide">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <h2 className="sec-h">Recent work and writing</h2>
            <div className="flex gap-6 font-medium">
              <Link href="/posts" className="lnk">All posts</Link>
              <Link href="/blog" className="lnk">Blog</Link>
            </div>
          </div>
          <div className="ruled sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <PostCard key={`${p.type}-${p.slug}`} post={p} priority={i < 3} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="wrap wide close-in">
          <div>
            <h2>Let&apos;s build something.</h2>
            <p>Have a project, a role or a question? I read everything.</p>
          </div>
          <div className="cta-row">
            <Link href="/contact" className="btn primary">Get in touch</Link>
            <a href="mailto:contact@cyberneel.com" className="btn ghost">Email me</a>
          </div>
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
