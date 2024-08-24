import Head from 'next/head';
import BigBlock from '../components/BigBlock';
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import { useEffect, useState } from 'react';
import { fetchPosts } from '../libs/contentful';
import PostCard from '../components/PostCard';
import dynamic from 'next/dynamic';

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function getPosts() {
      const fetchedPosts = await fetchPosts();
      setPosts(fetchedPosts);
    }
    getPosts();
  }, []);

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
      
      <hr class="hr hr-blurry" />
      <h2 class="text-center p-3 rounded-3 subtleTransparent">Latest Posts</h2>
      <hr class="hr hr-blurry" />
      
      <ResponsiveMasonry >
        <Masonry gutter="1rem">
          {posts.map((post) => (
            <PostCard key={post.sys.id} post={post} />
          ))}
        </Masonry>
      </ResponsiveMasonry>
      <div className="d-flex justify-content-center p-3">
        <a href={'/posts'} className="btn btn-danger">See All Posts</a>
      </div>
    </>
  );
}
