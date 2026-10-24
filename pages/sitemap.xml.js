import { getAllArticles, getAllPosts, tagSlug } from '../src/utils/mdx';

const SITE = 'https://cyberneel.com';

function url(loc, priority = '0.7') {
  return `<url><loc>${SITE}${loc}</loc><changefreq>weekly</changefreq><priority>${priority}</priority></url>`;
}

export async function getServerSideProps({ res }) {
  // drafts are reachable by URL for previews, but not listed
  const articles = (await getAllArticles()).filter((a) => !a.draft);
  const posts = (await getAllPosts()).filter((a) => !a.draft);

  const tags = new Set();
  articles.forEach((a) => (a.tags || []).forEach((t) => tags.add(tagSlug(t))));

  const staticRoutes = ['/', '/about', '/experience', '/blog', '/posts', '/contact', '/uses', '/now', '/resume', '/guides', '/guides/funko-pop'];
  const entries = [
    ...staticRoutes.map((r) => url(r, r === '/' ? '1.0' : '0.8')),
    ...articles.map((a) => url(`/blog/${a.slug}`)),
    ...posts.map((a) => url(`/posts/${a.slug}`)),
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
