import fs from 'fs';
import path from 'path';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import Seo from '../components/Seo';

export default function Now({ source }) {
  return (
    <>
      <Seo title="Now" description="What Neelesh Chevuri is focused on right now." />
      <div className="wrap pb-24">
        <header className="page-head">
          <h1>What I’m doing now</h1>
        </header>
        <div className="prose max-w-[68ch]">
          <MDXRemote {...source} />
        </div>
        <p className="mt-16 border-t border-hair pt-6 text-sm text-muted">
          This is a <a href="https://nownownow.com/about">now page</a>.
        </p>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const source = await serialize(fs.readFileSync(path.join(process.cwd(), 'data', 'now.mdx'), 'utf8'));
  return { props: { source } };
}
