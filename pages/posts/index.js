import { useState } from 'react';
import Seo from '../../components/Seo';
import Gallery from '../../components/Gallery';
import SearchBar from '../../components/SearchBar';
import { getAllPosts } from '../../src/utils/mdx';

export default function Posts({ posts }) {
  const [results, setResults] = useState(posts);

  return (
    <>
      <Seo title="Posts and art" description="Quick updates, creative experiments and 3D digital art by CyberNeel." />
      <div className="wrap wide pb-24">
        <header className="page-head">
          <h1>Posts and art</h1>
          <p>Renders, build logs and quick experiments. A running gallery of what I make.</p>
        </header>
        <div className="mb-10 max-w-md">
          <SearchBar posts={posts} onResults={setResults} placeholder="Search posts" />
        </div>
        {results.length === 0 ? (
          <p className="py-20 text-center text-muted">Nothing matches that search.</p>
        ) : (
          <Gallery posts={results} />
        )}
      </div>
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
