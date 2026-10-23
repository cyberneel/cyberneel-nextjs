import { serialize } from 'next-mdx-remote/serialize';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import rehypeCodeTitles from 'rehype-code-titles';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import Article from '../../components/Article';
import { getPostSlug, getPostFromSlug, getAllPosts, extractToc, pickRelated } from '../../src/utils/mdx';

export default function PostArticle({ post: { source, frontmatter }, toc, related }) {
  return (
    <Article
      source={source}
      frontmatter={frontmatter}
      toc={toc}
      related={related}
      back={{ href: '/posts', label: 'All posts' }}
      label="Project"
      relatedTitle="More work"
    />
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
