import { useState } from 'react';
import { motion } from 'framer-motion';
import Seo from '../../components/Seo';
import PostCard from '../../components/PostCard';
import SearchBar from '../../components/SearchBar';
import { getAllArticles } from '../../src/utils/mdx';

export default function Blog({ posts }) {
  const [results, setResults] = useState(posts);

  return (
    <>
      <Seo title="Blog" description="Long-form writing on technology, AI, embedded systems, and digital art." />

      <section className="mx-auto max-w-6xl px-4 pt-36 pb-10 md:px-6 md:pt-44">
        <header className="mb-10 max-w-2xl">
          <p className="eyebrow mb-5">Writing</p>
          <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-medium leading-[1.0]">
            The <span className="text-accent italic">blog</span>.
          </h1>
          <p className="mt-5 text-lg text-muted">
            Deep dives into projects, ideas, and the things I learn along the way.
          </p>
        </header>

        <div className="mb-10 max-w-md">
          <SearchBar posts={posts} onResults={setResults} placeholder="Search articles…" />
        </div>

        {results.length === 0 ? (
          <p className="py-20 text-center text-muted">Nothing matches that search.</p>
        ) : (
          <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((post, i) => (
              <PostCard key={post.slug} post={post} priority={i < 3} />
            ))}
          </motion.div>
        )}
      </section>
    </>
  );
}

export async function getStaticProps() {
  const isLocal = process.env.NODE_ENV !== 'production' || process.env.VERCEL_ENV === 'development';
  const posts = (await getAllArticles())
    .filter((a) => isLocal || !a.draft)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  return { props: { posts } };
}
