import Head from 'next/head';

const SEO = ({
  title = 'CyberNeel - 3D Artist & Developer',
  description = 'Personal website of CyberNeel featuring 3D art, blog posts about technology, LinkedIn AI, and creative projects.',
  canonicalUrl = 'https://cyberneel.com',
  ogImage = 'https://cyberneel.com/og-image.jpg',
  ogType = 'website',
  publishedTime,
  modifiedTime,
  tags = [],
  author = 'CyberNeel'
}) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": ogType === 'article' ? 'BlogPosting' : 'WebSite',
    "name": title,
    "description": description,
    "url": canonicalUrl,
    ...(ogType === 'article' && {
      "headline": title,
      "image": ogImage,
      "author": {
        "@type": "Person",
        "name": author
      },
      "publisher": {
        "@type": "Organization",
        "name": "CyberNeel Blog"
      },
      "datePublished": publishedTime,
      "dateModified": modifiedTime || publishedTime,
      "keywords": tags.join(', ')
    })
  };

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={tags.join(', ')} />
      <meta name="author" content={author} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="CyberNeel" />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Article specific tags */}
      {ogType === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {ogType === 'article' && (modifiedTime || publishedTime) && (
        <meta property="article:modified_time" content={modifiedTime || publishedTime} />
      )}
      {ogType === 'article' && (
        <meta property="article:author" content={author} />
      )}
      {ogType === 'article' && tags.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
    </Head>
  );
};

export default SEO;
