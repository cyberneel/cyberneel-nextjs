import { getArticleSlug, getPostSlug, getAllArticles, tagSlug } from '../src/utils/mdx';

const SITE = 'https://cyberneel.com';

function url(loc, priority = '0.7') {
  return `<url><loc>${SITE}${loc}</loc><changefreq>weekly</changefreq><priority>${priority}</priority></url>`;
}

export async function getServerSideProps({ res }) {
  const [articles, posts, allArticles] = [
    await getArticleSlug(),
    await getPostSlug(),
    await getAllArticles(),
  ];

  const tags = new Set();
  allArticles.forEach((a) => (a.tags || []).forEach((t) => tags.add(tagSlug(t))));

  const staticRoutes = ['/', '/about', '/experience', '/blog', '/posts', '/contact', '/uses', '/now', '/resume'];
  const entries = [
    ...staticRoutes.map((r) => url(r, r === '/' ? '1.0' : '0.8')),
    ...articles.map((slug) => url(`/blog/${slug}`)),
    ...posts.map((slug) => url(`/posts/${slug}`)),
    ...[...tags].map((t) => url(`/blog/tag/${t}`, '0.5')),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');
  res.write(xml);
  res.end();
  return { props: {} };
}

export default function Sitemap() {
  return null;
}
