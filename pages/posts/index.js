import React, { useState } from 'react'
import Head from 'next/head'
import Link from "next/link"
import dayjs from 'dayjs'
import { getAllPosts } from '../../src/utils/mdx'

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
        <title>CyberNeel Posts - Quick Updates and Insights</title>
        <meta name="description" content="Browse CyberNeel's latest posts featuring quick updates, tech insights, creative projects, and digital art. Short-form content covering technology, AI, and development." />
        <meta name="keywords" content="CyberNeel posts, tech updates, digital art, creative projects, technology insights, AI posts, development updates" />
        <meta name="author" content="Neelesh Chevuri" />
        <link rel="canonical" href="https://cyberneel.com/posts" />
        
        {/* Open Graph */}
        <meta property="og:title" content="CyberNeel Posts - Quick Updates and Insights" />
        <meta property="og:description" content="Browse CyberNeel's latest posts featuring quick updates, tech insights, creative projects, and digital art." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://cyberneel.com/posts" />
        <meta property="og:site_name" content="CyberNeel" />
        
        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="CyberNeel Posts - Quick Updates and Insights" />
        <meta name="twitter:description" content="Browse CyberNeel's latest posts featuring quick updates, tech insights, creative projects, and digital art." />
        
        {/* Structured Data for Posts Collection */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              "name": "CyberNeel Posts",
              "description": "Quick Updates and Insights",
              "url": "https://cyberneel.com/posts",
              "author": {
                "@type": "Person",
                "name": "Neelesh Chevuri"
              }
            })
          }}
        />
      </Head>

      <SearchBarFlex posts={posts} onSearchResults={setFilteredPosts} />

      {/* <div class="alert alert-danger text-center" role="alert">
        This page is UNDER CONSTRUCTION, you may see placeholder items!
      </div> */}

      <hr class="hr hr-blurry" />
      <div style={{backgroundColor: "white"}}>
        <h2 class="text-center pt-3" >My Posts</h2>
        <p className='text-center pb-3' >Quick and short updates</p>
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
  const articles = await getAllPosts()
  //await indexPosts(articles);

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