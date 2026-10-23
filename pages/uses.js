import fs from 'fs';
import path from 'path';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import Seo from '../components/Seo';

export default function Uses({ source }) {
  return (
    <>
      <Seo title="Uses" description="The hardware, software and tools Neelesh Chevuri uses day to day." />
      <div className="wrap pb-24">
        <header className="page-head">
          <h1>What I use</h1>
        </header>
        <div className="prose max-w-[68ch]">
          <MDXRemote {...source} />
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const source = await serialize(fs.readFileSync(path.join(process.cwd(), 'data', 'uses.mdx'), 'utf8'));
  return { props: { source } };
}
