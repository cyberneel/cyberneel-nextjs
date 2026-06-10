import Link from 'next/link';
import Image from 'next/image';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import rehypeCodeTitles from 'rehype-code-titles';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import 'highlight.js/styles/atom-one-dark-reasonable.css';
import Seo from '../../components/Seo';
import FontWrapper from '../../components/FontWrapper';
import ImageMDX from '../../components/ImageMDX';
import TurntableViewer from '../../components/TurntableViewer';
import Pre from '../../components/Pre';
import ReadingProgress from '../../components/ReadingProgress';
import TableOfContents from '../../components/TableOfContents';
import PostCard from '../../components/PostCard';
import { SectionTitle, Text } from '../../data/components/mdx-components';
import { getPostSlug, getPostFromSlug, getAllPosts, extractToc, pickRelated } from '../../src/utils/mdx';

const mdxComponents = { Image, SectionTitle, Text, TurntableViewer, ImageMDX, Font: FontWrapper, pre: Pre };

export default function Post({ post: { source, frontmatter }, toc, related }) {
  return (
    <>
      <ReadingProgress />
      <Seo
        title={frontmatter.title}
        description={frontmatter.excerpt}
        label="Project"
        type="article"
        publishedAt={frontmatter.publishedAt}
        tags={frontmatter.tags || []}
      />

      <div className="mx-auto flex max-w-6xl gap-12 px-4 pt-32 pb-10 md:px-6 md:pt-40">
        <div className="hidden w-52 shrink-0 xl:block" aria-hidden="true" />

        <article className="mx-auto w-full min-w-0 max-w-2xl">
          <Link href="/posts" className="eyebrow inline-flex items-center gap-2 text-muted hover:text-fg">
            <ArrowLeft size={14} /> Posts
          </Link>

          <motion.header
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8"
          >
            {frontmatter.tags?.length > 0 && (
              <div className="mb-5 flex flex-wrap gap-2">
                {frontmatter.tags.map((t) => (
                  <span key={t} className="chip">{t}</span>
                ))}
              </div>
            )}
            <h1 className="font-display text-[clamp(2.25rem,5.5vw,3.75rem)] font-medium leading-[1.02]">
              {frontmatter.title}
            </h1>
            <div className="eyebrow mt-6 flex items-center gap-3">
              <span>{dayjs(frontmatter.publishedAt).format('MMMM D, YYYY')}</span>
              <span className="h-1 w-1 rounded-full bg-accent" />
              <span>{frontmatter.readingTime}</span>
            </div>
          </motion.header>

          {frontmatter.cover_image_link && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 overflow-hidden rounded-2xl border border-line"
            >
              <img src={frontmatter.cover_image_link} alt={frontmatter.title} className="block h-auto w-full" />
            </motion.div>
          )}

          <div className="prose-atelier mt-12">
            <MDXRemote {...source} components={mdxComponents} />
          </div>
        </article>

        <aside className="hidden w-52 shrink-0 xl:block">
          <div className="sticky top-32">
            <TableOfContents toc={toc} />
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-8 md:px-6">
          <div className="hairline pt-12">
            <p className="eyebrow mb-8">More work</p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <PostCard key={`${p.type}-${p.slug}`} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export async function getStaticProps({ params }) {
  const { content, frontmatter } = await getPostFromSlug(params.slug);
  const source = await serialize(content, {
    mdxOptions: {
      rehypePlugins: [
        rehypeSlug,
        [rehypeAutolinkHeadings, { properties: { className: ['anchor'] } }, { behaviour: 'wrap' }],
        rehypeHighlight,
        rehypeCodeTitles,
      ],
    },
  });

  const isLocal = process.env.NODE_ENV !== 'production' || process.env.VERCEL_ENV === 'development';
  const all = (await getAllPosts())
    .filter((a) => isLocal || !a.draft)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  return {
    props: {
      post: { source, frontmatter },
      toc: extractToc(content),
      related: pickRelated(all, frontmatter, 3),
    },
  };
}

export async function getStaticPaths() {
  const paths = (await getPostSlug()).map((slug) => ({ params: { slug } }));
  return { paths, fallback: false };
}
