import React from 'react'
import Head from 'next/head'
import Link from "next/link"
import dayjs from 'dayjs'
import { getAllArticles } from '../../src/utils/mdx'

// My Imports
import Masonry from 'react-responsive-masonry';
import PostCard from '../../components/PostCardMDX';
import dynamic from 'next/dynamic';


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
  return (
    <React.Fragment>
      <Head>
        <title>My Blog</title>
      </Head>

      <hr class="hr hr-blurry" />
      <div style={{backgroundColor: "white"}}>
        <h2 class="text-center pt-3" >My Blog</h2>
        <p className='text-center pb-3' >Read longer version of posts, generally with more details</p>
      </div>
      {/* <SearchInput onSearch={handleSearch} /> */}
      <hr class="hr hr-blurry" />

      <ResponsiveMasonry columnsCountBreakPoints={breakpointColumnsObj}>
      <Masonry gutter="1rem">
        {posts.map((frontMatter) => {
          return (
            <PostCard key={frontMatter.slug} post={frontMatter} />
            
          )
        })}
      </Masonry>
      </ResponsiveMasonry>

    </React.Fragment>
  )
}

export async function getStaticProps() {
  const articles = await getAllArticles()

  articles
    .map((article) => article.data)
    .sort((a, b) => {
      if (a.data.publishedAt > b.data.publishedAt) return 1
      if (a.data.publishedAt < b.data.publishedAt) return -1

      return 0
    })

  return {
    props: {
      posts: articles.reverse(),
    },
  }
}