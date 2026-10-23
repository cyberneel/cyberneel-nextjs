import Link from 'next/link';
import dayjs from 'dayjs';
import { MDXRemote } from 'next-mdx-remote';
import 'highlight.js/styles/atom-one-dark-reasonable.css';
import Seo from './Seo';
import ImageMDX from './ImageMDX';
import TurntableViewer from './TurntableViewer';
import Pre from './Pre';
import ReadingProgress from './ReadingProgress';
import TableOfContents from './TableOfContents';
import PostCard from './PostCard';

const mdxComponents = { TurntableViewer, ImageMDX, pre: Pre };

// Shared layout for /blog/[slug] and /posts/[slug].
export default function Article({ source, frontmatter, toc, related, back, label, tagHref, relatedTitle }) {
  const tags = frontmatter.tags || [];
  return (
    <>
      <ReadingProgress />
      <Seo
        title={frontmatter.title}
        description={frontmatter.excerpt}
        label={label}
        type="article"
        publishedAt={frontmatter.publishedAt}
        tags={tags}
      />

      <div className="wrap flex gap-12 pt-12 pb-16 md:pt-16">
        <article className="min-w-0 max-w-[720px] flex-1">
          <Link href={back.href} className="lnk text-sm">{back.label}</Link>

          <header className="mt-8">
            <h1 className="text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.05]">{frontmatter.title}</h1>
            <p className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
              <span className="font-mono text-[13px]">{dayjs(frontmatter.publishedAt).format('MMMM D, YYYY')}</span>
              <span className="font-mono text-[13px]">{frontmatter.readingTime}</span>
              {tags.length > 0 && (
                <span>
                  {tags.map((t, i) => (
                    <span key={t}>
                      {i > 0 && ', '}
                      {tagHref ? <Link href={tagHref(t)} className="hover:text-fg hover:underline">{t}</Link> : t}
                    </span>
                  ))}
                </span>
              )}
            </p>
          </header>

          {frontmatter.cover_image_link && (
            <img src={frontmatter.cover_image_link} alt={frontmatter.title} className="mt-10 block h-auto w-full border border-line" />
          )}

          <div className="prose mt-12">
            <MDXRemote {...source} components={mdxComponents} />
          </div>
        </article>

        {toc?.length > 0 && (
          <aside className="hidden w-56 shrink-0 xl:block">
            <div className="sticky top-24">
              <TableOfContents toc={toc} />
            </div>
          </aside>
        )}
      </div>

      {related.length > 0 && (
        <section className="wrap pb-20">
          <h2 className="sec-h mb-8 border-t border-hair pt-12">{relatedTitle}</h2>
          <div className="ruled sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <PostCard key={`${p.type}-${p.slug}`} post={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
