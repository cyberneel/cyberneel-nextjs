import Head from 'next/head';
import { useRouter } from 'next/router';

const SITE = 'https://cyberneel.com';
const BRAND = 'CyberNeel';
const AUTHOR = 'Neelesh Chevuri';
const DEFAULT_DESC =
  'Neelesh Chevuri (CyberNeel) — computer scientist, tinkerer, and digital artist. Projects, writing, and 3D art exploring the intersection of code and creativity.';
const DEFAULT_OG = 'https://cyberneel.github.io/img/CyberNeelLogoNewOutfit1080p-1400x1400.webp';
const SAME_AS = [
  'https://github.com/cyberneel',
  'https://linkedin.cyberneel.com',
  'https://instagram.com/cyber_neel',
];

export default function Seo({
  title,
  description,
  label,
  type = 'website',
  publishedAt,
  tags = [],
  noindex = false,
}) {
  const router = useRouter();
  const path = (router.asPath || '/').split('?')[0].split('#')[0];
  const url = `${SITE}${path === '/' ? '' : path}`;
  const fullTitle = title ? `${title} · ${BRAND}` : `${BRAND} — ${AUTHOR}`;
  const desc = description || DEFAULT_DESC;

  // Branded share card generated on the fly by /api/og.
  const og = (() => {
    const p = new URLSearchParams();
    p.set('title', title || AUTHOR);
    if (label) p.set('type', label);
    else if (type === 'article') p.set('type', 'Article');
    if (publishedAt) {
      try {
        p.set(
          'date',
          new Date(publishedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        );
      } catch {
        /* leave date off */
      }
    }
    return `${SITE}/api/og?${p.toString()}`;
  })();

  const jsonLd =
    type === 'article'
      ? {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: title,
          description: desc,
          image: og,
          url,
          datePublished: publishedAt,
          dateModified: publishedAt,
          author: { '@type': 'Person', name: AUTHOR, url: SITE },
          publisher: { '@type': 'Person', name: AUTHOR },
          ...(tags.length ? { keywords: tags.join(', ') } : {}),
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: AUTHOR,
          alternateName: BRAND,
          url: SITE,
          image: DEFAULT_OG,
          jobTitle: 'Computer Scientist & Digital Artist',
          sameAs: SAME_AS,
        };

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:site_name" content={BRAND} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={og} />
      {type === 'article' && publishedAt && (
        <meta property="article:published_time" content={publishedAt} />
      )}
      {type === 'article' && tags.map((t) => <meta property="article:tag" content={t} key={t} />)}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={og} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Head>
  );
}
