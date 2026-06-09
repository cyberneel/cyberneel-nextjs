import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { motion } from 'framer-motion';
import { ArrowUpRight, Radio, Wrench, FileText } from 'lucide-react';
import Seo from '../components/Seo';
import FontWrapper from '../components/FontWrapper';

const MORE = [
  { href: '/now', label: 'Now', desc: 'What I’m focused on at the moment', Icon: Radio },
  { href: '/uses', label: 'Uses', desc: 'The gear, software, and tools I use', Icon: Wrench },
  { href: '/resume', label: 'Résumé', desc: 'Experience, projects, and education', Icon: FileText },
];

export default function About({ source }) {
  return (
    <>
      <Seo title="About" description="About Neelesh Chevuri — computer scientist, tinkerer, and digital artist." />

      <article className="mx-auto max-w-3xl px-4 pt-36 pb-10 md:px-6 md:pt-44">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="eyebrow mb-5">About</p>
          <h1 className="font-display text-[clamp(2.5rem,6vw,4rem)] font-medium leading-[1.0]">
            Who is <span className="text-accent italic">CyberNeel</span>?
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

        <div className="hairline mt-16 pt-10">
          <p className="eyebrow mb-6">More about me</p>
          <div className="grid gap-4 sm:grid-cols-3">
            {MORE.map(({ href, label, desc, Icon }) => (
              <Link key={href} href={href} className="card group p-5 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <Icon size={18} className="text-accent" />
                  <ArrowUpRight size={16} className="text-faint transition-colors group-hover:text-accent" />
                </div>
                <p className="mt-4 font-display text-xl">{label}</p>
                <p className="mt-1 text-sm leading-snug text-muted">{desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </>
  );
}

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'data', 'about.mdx');
  const source = await serialize(fs.readFileSync(filePath, 'utf8'));
  return { props: { source } };
}
