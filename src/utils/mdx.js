import path from 'path'
import fs from 'fs'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import { sync } from 'glob'
import GithubSlugger from 'github-slugger'
import { tagSlug } from './tags'

export { tagSlug }

// Pull h2/h3 headings out of raw MDX for a table of contents. IDs use the same
// slugger as rehype-slug so the anchors match the rendered headings.
export function extractToc(content) {
  const slugger = new GithubSlugger()
  const toc = []
  let inFence = false
  for (const line of (content || '').split('\n')) {
    if (/^\s*```/.test(line)) { inFence = !inFence; continue }
    if (inFence) continue
    const m = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line)
    if (m) {
      const text = m[2].replace(/[*_`[\]]/g, '').replace(/\(.*?\)/g, '').trim()
      if (text) toc.push({ level: m[1].length, text, id: slugger.slug(text) })
    }
  }
  return toc
}

const articlesPath = path.join(process.cwd(), 'data/blogs')
const postsPath = path.join(process.cwd(), 'data/posts')

// Pick up to `n` related articles: those sharing a tag first, then most recent.
export function pickRelated(all, current, n = 3) {
  const currentTags = new Set((current.tags || []).map(tagSlug))
  const others = all.filter((a) => a.slug !== current.slug)
  const score = (a) =>
    (a.tags || []).reduce((acc, t) => acc + (currentTags.has(tagSlug(t)) ? 1 : 0), 0)
  return [...others]
    .sort((a, b) => score(b) - score(a) || new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, n)
}

export async function getArticleSlug() {
  const paths = sync(`${articlesPath}/*.mdx`)

  return paths.map((path) => {
    // holds the paths to the directory of the article
    const pathContent = path.split('/')
    const fileName = pathContent[pathContent.length - 1]
    const [slug, _extension] = fileName.split('.')

    return slug
  })
}

export async function getPostSlug() {
  const paths = sync(`${postsPath}/*.mdx`)

  return paths.map((path) => {
    // holds the paths to the directory of the article
    const pathContent = path.split('/')
    const fileName = pathContent[pathContent.length - 1]
    const [slug, _extension] = fileName.split('.')

    return slug
  })
}

export async function getArticleFromSlug(slug) {
    const articleDir = path.join(articlesPath, `${slug}.mdx`)
    const source = fs.readFileSync(articleDir)
    const { content, data } = matter(source)
  
    return {
      content,
      frontmatter: {
        slug,
        excerpt: data.excerpt,
        title: data.title,
        publishedAt: data.publishedAt,
        readingTime: readingTime(source).text,
        ...data,
      },
    }
  }

  export async function getPostFromSlug(slug) {
    const articleDir = path.join(postsPath, `${slug}.mdx`)
    const source = fs.readFileSync(articleDir)
    const { content, data } = matter(source)
  
    return {
      content,
      frontmatter: {
        slug,
        excerpt: data.excerpt,
        title: data.title,
        publishedAt: data.publishedAt,
        readingTime: readingTime(source).text,
        ...data,
      },
    }
  }

  export async function getAllArticles() {
    const articles = fs.readdirSync(path.join(process.cwd(), 'data/blogs'))
  
    return articles.reduce((allArticles, articleSlug) => {
      // get parsed data from mdx files in the "articles" dir
      const source = fs.readFileSync(
        path.join(process.cwd(), 'data/blogs', articleSlug),
        'utf-8'
      )
      const { data } = matter(source)
  
      return [
        {
          ...data,
          slug: articleSlug.replace('.mdx', ''),
          readingTime: readingTime(source).text,
          type: 'blog'
        },
        ...allArticles,
      ]
    }, [])
  }

  export async function getAllPosts() {
    const articles = fs.readdirSync(path.join(process.cwd(), 'data/posts'))
  
    return articles.reduce((allArticles, articleSlug) => {
      // get parsed data from mdx files in the "articles" dir
      const source = fs.readFileSync(
        path.join(process.cwd(), 'data/posts', articleSlug),
        'utf-8'
      )
      const { data } = matter(source)
  
      return [
        {
          ...data,
          slug: articleSlug.replace('.mdx', ''),
          readingTime: readingTime(source).text,
          type: 'posts'
        },
        ...allArticles,
      ]
    }, [])
  }