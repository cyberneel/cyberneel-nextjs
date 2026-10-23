import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import Seo from '../components/Seo';

const MORE = [
  { href: '/now', label: 'Now', desc: 'What I’m focused on at the moment.' },
  { href: '/uses', label: 'Uses', desc: 'The gear, software and tools I use.' },
  { href: '/resume', label: 'Résumé', desc: 'Experience, projects and education.' },
];

export default function About({ source }) {
  return (
    <>
      <Seo title="About" description="About Neelesh Chevuri: computer science student, tinkerer and digital artist." />
      <div className="wrap">
        <header className="page-head">
          <h1>Hello, I&apos;m Neelesh Chevuri.</h1>
        </header>
        <div className="prose max-w-[68ch]">
          <MDXRemote {...source} />
        </div>
        <div className="ruled mt-16 mb-24 sm:grid-cols-3">
          {MORE.map((m) => (
            <Link key={m.href} href={m.href} className="group p-6">
              <h2 className="text-[22px] group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">{m.label}</h2>
              <p className="mt-2 text-muted">{m.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'data', 'about.mdx');
  const source = await serialize(fs.readFileSync(filePath, 'utf8'));
  return { props: { source } };
}
