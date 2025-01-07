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

  return (
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
  );

  return (
    <React.Fragment>
      <Head>
        <title>{frontmatter.title} | My blog</title>
      </Head>
      <div className="article-container">
        <h1 className="article-title">{frontmatter.title}</h1>
        <p className="publish-date">
          {dayjs(frontmatter.publishedAt).format('MMMM D, YYYY')} &mdash;{' '}
          {frontmatter.readingTime}
        </p>
        <div className="content">
          <MDXRemote {...source} components={{ Image, SectionTitle, Text }} />
        </div>
      </div>
    </React.Fragment>
  )
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