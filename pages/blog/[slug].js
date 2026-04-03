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
import FontWrapper from '../../components/FontWrapper'
import { motion } from 'framer-motion'

export default function Blog({ post: { source, frontmatter } }) {
  const canonicalUrl = `https://cyberneel.com/blog/${frontmatter.slug || 'unknown'}`;

  return (
    <article className="min-h-screen pt-40 pb-20 transition-colors duration-500">
      <Head>
        <title>{frontmatter.title} | Blog | CyberNeel</title>
        <meta name="description" content={frontmatter.excerpt} />
        <link rel="canonical" href={canonicalUrl} />
      </Head>
      
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <header className="mb-20">
          {frontmatter.cover_image_link && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-video w-full rounded-[3rem] overflow-hidden mb-12 shadow-2xl border border-white/10"
            >
              <img src={frontmatter.cover_image_link} alt={frontmatter.title} className="w-full h-full object-cover" />
            </motion.div>
          )}
          
          <div className="flex flex-wrap gap-3 mb-8">
            {frontmatter.tags && frontmatter.tags.map(tag => (
              <span key={tag} className="text-[10px] font-black uppercase tracking-widest text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-4 py-1.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white mb-8 leading-tight">
            {frontmatter.title}
          </h1>
          
          <div className="flex items-center gap-6 text-slate-500 dark:text-zinc-500 font-bold uppercase tracking-widest text-xs">
            <span>{dayjs(frontmatter.publishedAt).format('MMMM D, YYYY')}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
            <span>{frontmatter.readingTime}</span>
          </div>
        </header>

        <div className="prose prose-slate dark:prose-invert max-w-none 
          prose-headings:tracking-tighter prose-headings:font-black
          prose-p:text-lg prose-p:leading-relaxed prose-p:font-medium
          prose-a:text-red-600 dark:prose-a:text-red-400 prose-a:no-underline hover:prose-a:underline prose-a:font-black
          prose-img:rounded-[2rem] prose-img:shadow-2xl
          prose-pre:bg-zinc-950 dark:prose-pre:bg-black prose-pre:border prose-pre:border-white/5 prose-pre:rounded-2xl">
          <MDXRemote {...source} components={{ Image, SectionTitle, Text, TurntableViewer, ImageMDX, Font: FontWrapper }} />
        </div>
      </div>
    </article>
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