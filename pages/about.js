import Head from 'next/head';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import fs from 'fs';
import path from 'path';
import FontWrapper from '../components/FontWrapper';
import { motion } from 'framer-motion';

export default function About({ source }) {
  return (
    <div className="min-h-screen pt-32 pb-20 transition-colors duration-500">
      <Head>
        <title>About | CyberNeel</title>
      </Head>
      
      <div className="container mx-auto px-4 max-w-4xl">
        <header className="mb-20 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 dark:text-white mb-8 uppercase"
          >
            WHO IS <span className="text-red-600">CYBERNEEL</span>?
          </motion.h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-bold leading-relaxed">
            A computer scientist, tinkerer, and digital artist exploring the intersection of code and creativity.
          </p>
        </header>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-[3rem] p-8 md:p-16 relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-3 h-full bg-red-600 group-hover:w-4 transition-all duration-500" />
          
          <div className="prose prose-slate dark:prose-invert max-w-none
            prose-headings:tracking-tighter prose-headings:font-black
            prose-p:text-lg prose-p:leading-relaxed prose-p:font-medium
            prose-a:text-red-600 dark:prose-a:text-red-400 prose-a:no-underline hover:prose-a:underline prose-a:font-black">
            <MDXRemote {...source} components={{ Font: FontWrapper }} />
          </div>
        </motion.div>
      </div>
    </div>
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