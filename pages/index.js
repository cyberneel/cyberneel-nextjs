import Head from 'next/head';
import BigBlock from '../components/BigBlock';
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import { useEffect, useState } from 'react';
import { fetchPosts } from '../libs/contentful';
import PostCard from '../components/PostCard';

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
      <ResponsiveMasonry columnsCountBreakPoints={{350: 1, 750: 2, 900: 3}}>
        <Masonry>
          {posts.map((post) => (
            <PostCard key={post.sys.id} post={post} />
          ))}
        </Masonry>
      </ResponsiveMasonry>
    </>
  );
}
