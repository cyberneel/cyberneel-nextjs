import Head from 'next/head';
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCardMDX';
import ModernHero from '../components/ModernHero';
import { getAllPosts, getAllArticles } from '../src/utils/mdx';

export default function Home({ posts }) {

  return (
    <>
      <Head>
        <title>CyberNeel | Tinkerer & Artist</title>
      </Head>
      
      <main className="min-h-screen transition-colors duration-500">
        <ModernHero />
        
        <div id="projects" className="container mx-auto px-4 py-20">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-[1px] flex-grow bg-slate-200 dark:bg-zinc-800" />
            <h2 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white px-4">
              LATEST <span className="text-red-600">CREATIONS</span>
            </h2>
            <div className="h-[1px] flex-grow bg-slate-200 dark:bg-zinc-800" />
          </div>
          
          <ResponsiveMasonry>
            <Masonry gutter="1.5rem">
              {posts.map((frontMatter) => {
                return (
                  <PostCard key={frontMatter.slug} type={frontMatter.type} post={frontMatter} />
                )
              })}
            </Masonry>
          </ResponsiveMasonry>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-16">
            <a href={'/posts'} className="px-10 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-red-600/20">
              Explore All Projects
            </a>
            <a href={'/blog'} className="px-10 py-4 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-900 dark:text-white border border-slate-200 dark:border-zinc-800 rounded-2xl font-bold transition-all shadow-lg">
              Read My Blog
            </a>
          </div>
        </div>
      </main>
    </>
  );
}

export async function getStaticProps() {
  const posts = await getAllPosts();
  const blogs = await getAllArticles();

  const postsAndBlogs = posts.concat(blogs);

  // Check if running on localhost
  const isLocalhost = process.env.NODE_ENV !== 'production' || process.env.VERCEL_ENV === 'development';

  const sortedPosts = postsAndBlogs
  .filter((article) => 
    {
      // Only show draft posts if on localhost
      if (article.draft && !isLocalhost) {
        return false;
      }
      return true;
    }
  )
  .sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt)).reverse();  // Sort by date

  // Log sorted dates to confirm the order
  console.log("Sorted Articles:", sortedPosts.map(article => article.publishedAt));

  // Trim the array to the first 3 elements
  const latestPosts = sortedPosts.slice(0, 3);

  return {
    props: {
      posts: latestPosts,
    },
  }
}
