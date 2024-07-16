import Head from 'next/head';
import BigBlock from '../components/BigBlock';
import Masonry from "react-responsive-masonry"
import { useEffect, useState } from 'react';
import { fetchPosts } from '../libs/contentful';
import PostCard from '../components/PostCard';
import dynamic from 'next/dynamic';

const ResponsiveMasonry = dynamic(() => import('react-responsive-masonry').then(mod => mod.ResponsiveMasonry), {
  ssr: false,
});

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
    default: 4,
    1100: 4,
    700: 2,
    500: 1
  };


  return (
    <>
      <Head>
        <title>About CyberNeel</title>
      </Head>
      <div className='p-3 container'>
        <BigBlock />
      </div>
      
      <hr class="hr hr-blurry" />
      <h2 class="text-center p-3" style={{backgroundColor: "white"}}>Learn About Me!</h2>
      <hr class="hr hr-blurry" />
      
  );
}
