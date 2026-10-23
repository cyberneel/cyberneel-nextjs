import Link from 'next/link';
import Seo from '../../../components/Seo';
import PostCard from '../../../components/PostCard';
import { getAllArticles, tagSlug } from '../../../src/utils/mdx';

export default function Tag({ tag, posts }) {
  return (
    <>
      <Seo title={tag} description={`Articles tagged ${tag}.`} />
      <div className="wrap wide pb-24">
        <header className="page-head">
          <Link href="/blog" className="lnk text-sm">All articles</Link>
          <h1 className="mt-6">{tag}</h1>
          <p>
            <span className="font-mono">{posts.length}</span> article{posts.length === 1 ? '' : 's'}
          </p>
        </header>
        <div className="ruled sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const isLocal = process.env.NODE_ENV !== 'production' || process.env.VERCEL_ENV === 'development';
  const articles = (await getAllArticles()).filter((a) => isLocal || !a.draft);
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
