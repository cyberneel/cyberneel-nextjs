import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Seo from '../../../components/Seo';
import PostCard from '../../../components/PostCard';
import { getAllArticles, tagSlug } from '../../../src/utils/mdx';

export default function Tag({ tag, posts }) {
  return (
    <>
      <Seo title={`#${tag}`} description={`Articles tagged ${tag}.`} />

      <section className="mx-auto max-w-6xl px-4 pt-36 pb-10 md:px-6 md:pt-44">
        <Link href="/blog" className="eyebrow inline-flex items-center gap-2 text-muted hover:text-fg">
          <ArrowLeft size={14} /> All articles
        </Link>

        <header className="mb-12 mt-8">
          <p className="eyebrow mb-5">Tag</p>
          <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-medium leading-[1.0]">
            <span className="text-accent">#</span>
            {tag}
          </h1>
          <p className="mt-4 text-muted">
            {posts.length} article{posts.length === 1 ? '' : 's'}
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </>
  );
}

export async function getStaticPaths() {
  const articles = await getAllArticles();
  const tags = new Set();
  articles.forEach((a) => (a.tags || []).forEach((t) => tags.add(tagSlug(t))));
  return { paths: [...tags].map((tag) => ({ params: { tag } })), fallback: false };
}

export async function getStaticProps({ params }) {
  const isLocal = process.env.NODE_ENV !== 'production' || process.env.VERCEL_ENV === 'development';
  const all = (await getAllArticles()).filter((a) => isLocal || !a.draft);

  // Display name = the first original tag that maps to this slug.
  let label = params.tag;
  for (const a of all) {
    const hit = (a.tags || []).find((t) => tagSlug(t) === params.tag);
    if (hit) {
      label = hit;
      break;
    }
  }

  const posts = all
    .filter((a) => (a.tags || []).some((t) => tagSlug(t) === params.tag))
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  return { props: { tag: label, posts } };
}
