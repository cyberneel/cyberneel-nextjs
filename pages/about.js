import Head from 'next/head';
import BigBlock from '../components/BigBlock';
import { useEffect, useState } from 'react';
import { fetchAboutPost } from '../libs/contentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import styles from './posts/post.module.css';

export default function About() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function getPosts() {
      const aboutPost = await fetchAboutPost();
      setPosts(aboutPost);
    }
    getPosts();
  }, []);


  return (
    <>
      <Head>
        <title>About CyberNeel</title>
      </Head>
      <div className='p-3 col-9 container'>
        <BigBlock 
          headText='Who is CyberNeel?'
          description='Read on to find out! '
          linkText="Let's Go!"
          link='#aboutSection'
        />
      </div>
      
      <hr class="hr hr-blurry" id="aboutSection"/>
      <h2 class="text-center p-3" style={{backgroundColor: "white"}}>Learn About Me!</h2>
      <hr class="hr hr-blurry" />
      
      <div className={styles.postContainer + " rounded-3"}>
        {posts.length > 0 ? (
          <div className={styles.postContent}>
            {documentToReactComponents(posts[0].fields.content)}
          </div>
        ) : (
          <p>Loading...</p>
        )}         
      </div>
      
     </>
      
  );
}
