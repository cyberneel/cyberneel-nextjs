import Head from 'next/head';
import Masonry from "react-responsive-masonry"
import { useEffect, useState } from 'react';
import { fetchPosts, fetchAllPosts } from '../../libs/contentful';
import PostCard from '../../components/PostCard';
import dynamic from 'next/dynamic';

const ResponsiveMasonry = dynamic(() => import('react-responsive-masonry').then(mod => mod.ResponsiveMasonry), {
  ssr: false,
});

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function getPosts() {
      const fetchedPosts = await fetchAllPosts();
      setPosts(fetchedPosts);
    }
    getPosts();
  }, []);

  const breakpointColumnsObj = {
    default: 4,
    1100: 4,
    700: 2,
    500: 1
  };


  return (
    <>
      <Head>
        <title>Posts</title>
      </Head>
      
      <hr class="hr hr-blurry" />
      <h2 class="text-center p-3">My Posts</h2>
      <hr class="hr hr-blurry" />
      
      <ResponsiveMasonry columnsCountBreakPoints={breakpointColumnsObj}>
        <Masonry gutter="1rem">
          {posts.map((post) => (
            <PostCard key={post.sys.id} post={post} />
          ))}
        </Masonry>
      </ResponsiveMasonry>
    </>
  );
}
