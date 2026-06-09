import fs from 'fs';
import path from 'path';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { motion } from 'framer-motion';
import Seo from '../components/Seo';
import FontWrapper from '../components/FontWrapper';

export default function Now({ source }) {
  return (
    <>
      <Seo title="Now" description="What Neelesh Chevuri is focused on right now." />

      <section className="mx-auto max-w-3xl px-4 pt-36 pb-10 md:px-6 md:pt-44">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="eyebrow mb-5">Now</p>
          <h1 className="font-display text-[clamp(2.5rem,6vw,4rem)] font-medium leading-[1.0]">
            Right <span className="text-accent italic">now</span>.
          </h1>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="prose-atelier mt-12"
        >
          <MDXRemote {...source} components={{ Font: FontWrapper }} />
        </motion.div>

        <p className="hairline mt-16 pt-6 text-sm text-faint">
          This is a{' '}
          <a href="https://nownownow.com/about" target="_blank" rel="noopener noreferrer" className="link-underline text-muted hover:text-fg">
            now page
          </a>
          .
        </p>
      </section>
    </>
  );
}

export async function getStaticProps() {
  const source = await serialize(fs.readFileSync(path.join(process.cwd(), 'data', 'now.mdx'), 'utf8'));
  return { props: { source } };
}
