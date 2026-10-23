import { useState } from 'react';
import Seo from '../../components/Seo';
import PostCard from '../../components/PostCard';
import SearchBar from '../../components/SearchBar';
import { getAllArticles } from '../../src/utils/mdx';

export default function Blog({ posts }) {
  const [results, setResults] = useState(posts);

  return (
    <>
      <Seo title="Blog" description="Long-form writing on technology, AI, embedded systems and digital art." />
      <div className="wrap wide pb-24">
        <header className="page-head">
          <h1>Blog</h1>
          <p>Deep dives into projects, ideas and the things I learn along the way.</p>
        </header>
        <div className="mb-10 max-w-md">
          <SearchBar posts={posts} onResults={setResults} placeholder="Search articles" />
        </div>
        {results.length === 0 ? (
          <p className="py-20 text-center text-muted">Nothing matches that search.</p>
        ) : (
          <div className="ruled sm:grid-cols-2 lg:grid-cols-3">
            {results.map((post, i) => (
              <PostCard key={post.slug} post={post} priority={i < 3} />
            ))}
          </div>
        )}
      </div>
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
