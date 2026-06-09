import { getAllArticles, getAllPosts } from '../src/utils/mdx';

const SITE = 'https://cyberneel.com';

function esc(s = '') {
  return String(s).replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]));
}

export async function getServerSideProps({ res }) {
  const articles = (await getAllArticles()).filter((a) => !a.draft).map((a) => ({ ...a, base: 'blog' }));
  const posts = (await getAllPosts()).filter((a) => !a.draft).map((a) => ({ ...a, base: 'posts' }));
  const items = [...articles, ...posts]
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, 30);

  const entries = items
    .map((it) => {
      const url = `${SITE}/${it.base}/${it.slug}`;
      return `    <item>
      <title>${esc(it.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(it.publishedAt).toUTCString()}</pubDate>
      ${it.excerpt ? `<description>${esc(it.excerpt)}</description>` : ''}
      ${(it.tags || []).map((t) => `<category>${esc(t)}</category>`).join('')}
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>CyberNeel — Neelesh Chevuri</title>
    <link>${SITE}</link>
    <description>Projects, writing, and digital art by Neelesh Chevuri.</description>
    <language>en</language>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml" />
${entries}
  </channel>
</rss>`;

  res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate');
  res.write(xml);
  res.end();
  return { props: {} };
}

export default function Feed() {
  return null;
}
