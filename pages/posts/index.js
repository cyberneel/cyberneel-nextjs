import { useState } from 'react';
import Seo from '../../components/Seo';
import Gallery from '../../components/Gallery';
import SearchBar from '../../components/SearchBar';
import { getAllPosts } from '../../src/utils/mdx';

export default function Posts({ posts }) {
  const [results, setResults] = useState(posts);

  return (
    <>
      <Seo title="Posts & Art" description="Quick updates, creative experiments, and 3D digital art by CyberNeel." />

      <section className="mx-auto max-w-6xl px-4 pt-36 pb-10 md:px-6 md:pt-44">
        <header className="mb-10 max-w-2xl">
          <p className="eyebrow mb-5">Projects &amp; Art</p>
          <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-medium leading-[1.0]">
            The <span className="text-accent italic">work</span>.
          </h1>
          <p className="mt-5 text-lg text-muted">
            Renders, build logs, and quick experiments — a running gallery of what I make.
          </p>
        </header>

        <div className="mb-10 max-w-md">
          <SearchBar posts={posts} onResults={setResults} placeholder="Search projects…" />
        </div>

        {results.length === 0 ? (
          <p className="py-20 text-center text-muted">Nothing matches that search.</p>
        ) : (
          <Gallery posts={results} />
        )}
      </section>
    </>
  );
}

export async function getStaticProps() {
  const isLocal = process.env.NODE_ENV !== 'production' || process.env.VERCEL_ENV === 'development';
  const posts = (await getAllPosts())
    .filter((a) => isLocal || !a.draft)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  return { props: { posts } };
}
