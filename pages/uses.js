import fs from 'fs';
import path from 'path';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { motion } from 'framer-motion';
import Seo from '../components/Seo';
import FontWrapper from '../components/FontWrapper';

export default function Uses({ source }) {
  return (
    <>
      <Seo title="Uses" description="The hardware, software, and tools Neelesh Chevuri uses day to day." />

      <section className="mx-auto max-w-3xl px-4 pt-36 pb-10 md:px-6 md:pt-44">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="eyebrow mb-5">Uses</p>
          <h1 className="font-display text-[clamp(2.5rem,6vw,4rem)] font-medium leading-[1.0]">
            What I <span className="text-accent italic">use</span>.
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
      </section>
    </>
  );
}

export async function getStaticProps() {
  const source = await serialize(fs.readFileSync(path.join(process.cwd(), 'data', 'uses.mdx'), 'utf8'));
  return { props: { source } };
}
