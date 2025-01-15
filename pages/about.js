import Head from 'next/head';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import fs from 'fs';
import path from 'path';
import styles from './blog/post.module.css';
import BigBlock from '../components/BigBlock';

export default function About({ source }) {
  return (
    <>
      <Head>
        <title>About CyberNeel</title>
      </Head>
      <div className='p-3 col-md-8 container'>
        <BigBlock 
          headText='Who is CyberNeel?'
          description='Read on to find out! '
          linkText="Let's Go!"
          link='#aboutSection'
        />
      </div>
      
      <hr className="hr hr-blurry" id="aboutSection"/>
      <h2 className="text-center p-3" style={{backgroundColor: "white"}}>Learn About Me!</h2>
      <hr className="hr hr-blurry" />
      
      <div className={styles.postContainer + " rounded-3"}>
        <div className={styles.postContent}>
          <MDXRemote {...source} />
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'data', 'about.mdx');
  const source = fs.readFileSync(filePath, 'utf8');
  const mdxSource = await serialize(source);

  return {
    props: {
      source: mdxSource,
    },
  };
}