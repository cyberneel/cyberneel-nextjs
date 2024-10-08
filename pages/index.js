import Head from 'next/head';
import BigBlock from '../components/BigBlock';
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import { useEffect, useState } from 'react';
import { fetchPosts } from '../libs/contentful';
import PostCard from '../components/PostCardMDX';
import dynamic from 'next/dynamic';
import { getAllPosts, getAllArticles } from '../src/utils/mdx';
import { post } from 'jquery';

export default function Home({ posts }) {

  const breakpointColumnsObj = {
    1100: 3,
    700: 2,
    500: 1
  };


  return (
    <>
      <Head>
        <title>Home Page</title>
      </Head>
      <div className='p-3 container'>
        <BigBlock />
      </div>
      
      <hr className="hr hr-blurry" />
      <h2 className="text-center p-3 rounded-3 subtleTransparent">Latest Updates</h2>
      <hr className="hr hr-blurry" />
      
      <ResponsiveMasonry >
        <Masonry gutter="1rem">
          {posts.map((frontMatter) => {
            return (
              <PostCard key={frontMatter.slug} type={frontMatter.type} post={frontMatter} />
            )
          })}
        </Masonry>
      </ResponsiveMasonry>
      <div className="d-flex justify-content-center p-3">
        <a href={'/posts'} className="btn btn-danger m-3">See All Posts</a>
        <a href={'/blog'} className="btn btn-danger m-3">See All Blogs</a>
      </div>
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
