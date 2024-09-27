import React, { useState } from 'react'
import Head from 'next/head'
import Link from "next/link"
import dayjs from 'dayjs'
import { getAllArticles } from '../../src/utils/mdx'

// My Imports
import Masonry from 'react-responsive-masonry';
import PostCard from '../../components/PostCardMDX';
import dynamic from 'next/dynamic';
import SearchBarFlex from '../../components/SearchBar-Flex';


const ResponsiveMasonry = dynamic(() => import('react-responsive-masonry').then(mod => mod.ResponsiveMasonry), {
  ssr: false,
});

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1
};

export default function BlogPage({ posts }) {

  const [filteredPosts, setFilteredPosts] = useState(posts);


  return (
    <React.Fragment>
      <Head>
        <title>My Blog</title>
      </Head>

      <SearchBarFlex posts={posts} onSearchResults={setFilteredPosts} />

      <div class="alert alert-danger text-center" role="alert">
        This page is UNDER CONSTRUCTION, you may see placeholder items!
      </div>

      <hr class="hr hr-blurry" />
      <div style={{backgroundColor: "white"}}>
        <h2 class="text-center pt-3" >My Blog</h2>
        <p className='text-center pb-3' >Read longer version of posts, generally with more details</p>
      </div>
      {/* <SearchInput onSearch={handleSearch} /> */}
      <hr class="hr hr-blurry" />

      <ResponsiveMasonry columnsCountBreakPoints={breakpointColumnsObj}>
      <Masonry gutter="1rem">
        {filteredPosts.map((frontMatter) => {
          return (
            <PostCard key={frontMatter.slug} type={frontMatter.type} post={frontMatter} />
          )
        })}
      </Masonry>
      </ResponsiveMasonry>

    </React.Fragment>
  )
}

export async function getStaticProps() {
  const articles = await getAllArticles()

  // Check if running on localhost
  const isLocalhost = process.env.NODE_ENV !== 'production' || process.env.VERCEL_ENV === 'development';

  const sortedArticles = articles
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
  console.log("Sorted Articles:", sortedArticles.map(article => article.publishedAt));

  return {
    props: {
      posts: sortedArticles,
    },
  }
}