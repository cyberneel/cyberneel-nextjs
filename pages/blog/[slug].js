import dayjs from 'dayjs'
import React from 'react'
import Head from 'next/head'
import Image from 'next/image'
import rehypeSlug from 'rehype-slug'
import { MDXRemote } from 'next-mdx-remote'
import rehypeHighlight from 'rehype-highlight'
import rehypeCodeTitles from 'rehype-code-titles'
import { serialize } from 'next-mdx-remote/serialize'
import 'highlight.js/styles/atom-one-dark-reasonable.css'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { getArticleSlug, getArticleFromSlug } from '../../src/utils/mdx'
import { SectionTitle, Text } from '../../data/components/mdx-components'
import TurntableViewer from '../../components/TurntableViewer'
import ImageMDX from '../../components/ImageMDX'
import styles from './post.module.css';

export default function Blog({ post: { source, frontmatter } }) {
  const canonicalUrl = `https://cyberneel.com/blog/${frontmatter.slug || 'unknown'}`;
  const publishedDate = new Date(frontmatter.publishedAt).toISOString();
  const modifiedDate = new Date().toISOString();

  return (
    <>
      <Head>
        <title>{frontmatter.title} | CyberNeel Blog</title>
        <meta name="description" content={frontmatter.excerpt} />
        <meta name="keywords" content={frontmatter.tags ? frontmatter.tags.join(', ') : ''} />
        <meta name="author" content="CyberNeel" />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph */}
        <meta property="og:title" content={frontmatter.title} />
        <meta property="og:description" content={frontmatter.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="CyberNeel Blog" />
        {frontmatter.cover_image_link && <meta property="og:image" content={frontmatter.cover_image_link} />}
        
        {/* Article specific */}
        <meta property="article:published_time" content={publishedDate} />
        <meta property="article:modified_time" content={modifiedDate} />
        <meta property="article:author" content="CyberNeel" />
        {frontmatter.tags && frontmatter.tags.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
        
        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={frontmatter.title} />
        <meta name="twitter:description" content={frontmatter.excerpt} />
        {frontmatter.cover_image_link && <meta name="twitter:image" content={frontmatter.cover_image_link} />}
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "headline": frontmatter.title,
              "description": frontmatter.excerpt,
              "image": frontmatter.cover_image_link || null,
              "author": {
                "@type": "Person",
                "name": "CyberNeel"
              },
              "publisher": {
                "@type": "Organization",
                "name": "CyberNeel Blog"
              },
              "datePublished": publishedDate,
              "dateModified": modifiedDate,
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": canonicalUrl
              },
              "keywords": frontmatter.tags ? frontmatter.tags.join(', ') : ''
            })
          }}
        />
      </Head>
      
      <div className={styles.postContainer + " rounded-3"}>
        {frontmatter.cover_image_link && <img src={frontmatter.cover_image_link} alt={frontmatter.title} className={styles.postImage} />}

        {frontmatter.tags && <div className={styles.postTags}>Tags: {frontmatter.tags.join(', ')}</div>}
        
        <h1 className={styles.postTitle}>{frontmatter.title}</h1>
        <p className={styles.postDate}>{dayjs(frontmatter.publishedAt).format('MMMM D, YYYY')} &mdash;{' '} {frontmatter.readingTime}</p>
        <p className={styles.postDescription}>{frontmatter.excerpt}</p>
        <div className={styles.postContent}>
          <MDXRemote {...source} components={{ Image, SectionTitle, Text, TurntableViewer, ImageMDX }} />
        </div>
      </div>
    </>
  );
}

export async function getStaticProps({ params }) {
  //fetch the particular file based on the slug
  const { slug } = params
  const { content, frontmatter } = await getArticleFromSlug(slug)

  const mdxSource = await serialize(content, {
    mdxOptions: {
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            properties: { className: ['anchor'] },
          },
          { behaviour: 'wrap' },
        ],
        rehypeHighlight,
        rehypeCodeTitles,
      ],
    },
  })

  return {
    props: {
      post: {
        source: mdxSource,
        frontmatter,
      },
    },
  }
}

// dynamically generate the slugs for each article(s)
export async function getStaticPaths() {
    // getting all paths of each article as an array of
    // objects with their unique slugs
    const paths = (await getArticleSlug()).map((slug) => ({ params: { slug } }))
  
    return {
      paths,
      // in situations where you try to access a path
      // that does not exist. it'll return a 404 page
      fallback: false,
    }
}