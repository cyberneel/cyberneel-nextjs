import Head from 'next/head';
import BigBlock from '../components/BigBlock';
import Masonry from 'react-masonry-css';
import { useEffect, useState } from 'react';
import { fetchPosts } from '../libs/contentful';

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
    500: 1,
  };

  return (
    <>
      <Head>
        <title>Home Page</title>
      </Head>
      <div className='p-3'>
        <BigBlock />
      </div>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {posts.map((post) => (
          <div key={post.sys.id}>
            <h2>{post.fields.title}</h2>
            <p>{post.fields.description}</p>
            {/* Add other post details as needed */}
          </div>
        ))}
      </Masonry>
      <style jsx>{`
        .my-masonry-grid {
          display: flex;
          margin-left: -30px; /* gutter size offset */
          width: auto;
        }
        .my-masonry-grid_column {
          padding-left: 30px; /* gutter size */
          background-clip: padding-box;
        }
        .my-masonry-grid_column > div {
          background: white;
          margin-bottom: 30px;
        }
      `}</style>
    </>
  );
}
