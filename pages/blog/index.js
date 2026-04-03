import React, { useState } from 'react'
import Head from 'next/head'
import { getAllArticles } from '../../src/utils/mdx'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import PostCard from '../../components/PostCardMDX';
import SearchBarFlex from '../../components/SearchBar-Flex';

const breakpointColumnsObj = {
  350: 1,
  700: 2,
  1050: 3,
  1400: 4
};

export default function BlogPage({ posts }) {
  const [filteredPosts, setFilteredPosts] = useState(posts);

  return (
    <div className="min-h-screen pt-32 pb-20 transition-colors duration-500">
      <Head>
        <title>Blog | CyberNeel</title>
        <meta name="description" content="Explore CyberNeel's blog featuring insights on technology, artificial intelligence, web development, and digital experiences." />
      </Head>

      <div className="container mx-auto px-4 md:px-8">
        <header className="mb-16 text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white mb-6 uppercase">
            THE <span className="text-red-600 underline decoration-red-600/20 underline-offset-8">BLOG</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 font-bold tracking-tight">
            Deep dives into technology, AI, and digital development.
          </p>
        </header>

        <div className="mb-12 glass rounded-[2.5rem] p-4 flex items-center shadow-xl">
          <div className="flex-grow">
            <SearchBarFlex posts={posts} onSearchResults={setFilteredPosts} />
          </div>
        </div>

        <div className="relative">
          <ResponsiveMasonry columnsCountBreakPoints={breakpointColumnsObj}>
            <Masonry gutter="2rem">
              {filteredPosts.map((frontMatter) => (
                <PostCard 
                  key={frontMatter.slug} 
                  type={frontMatter.type} 
                  post={frontMatter} 
                />
              ))}
            </Masonry>
          </ResponsiveMasonry>
        </div>
      </div>
    </div>
  )
}

export async function getStaticProps() {
  const articles = await getAllArticles()
  const isLocalhost = process.env.NODE_ENV !== 'production' || process.env.VERCEL_ENV === 'development';

  const sortedArticles = articles
    .filter((article) => !article.draft || isLocalhost)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  return {
    props: {
      posts: sortedArticles,
    },
  }
}