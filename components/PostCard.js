import Link from 'next/link';
import dayjs from 'dayjs';
import { ArrowUpRight } from 'lucide-react';

// One card for both blog articles and posts. `post.type` is 'blog' | 'posts'
// (matching the route segment), set by the mdx loaders.
export default function PostCard({ post, priority = false }) {
  const href = `/${post.type}/${post.slug}`;
  const kind = post.type === 'posts' ? 'Post' : 'Article';

  return (
    <Link href={href} className="card group block overflow-hidden hover:-translate-y-1">
      {post.cover_image_link && (
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={post.cover_image_link}
            alt={post.title}
            loading={priority ? 'eager' : 'lazy'}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          <div className="absolute left-3 top-3 flex gap-2">
            <span className="chip backdrop-blur-md">{kind}</span>
            {post.draft && (
              <span className="chip border-amber-500/30 bg-amber-500/15 text-amber-600 backdrop-blur-md dark:text-amber-400">
                Draft
              </span>
            )}
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="eyebrow mb-3 flex items-center gap-2">
          <span>{dayjs(post.publishedAt).format('MMM D, YYYY')}</span>
          {post.readingTime && (
            <>
              <span className="text-faint">/</span>
              <span>{post.readingTime}</span>
            </>
          )}
        </div>

        <h3 className="font-display text-2xl leading-tight transition-colors group-hover:text-accent">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="mt-3 line-clamp-2 text-[15px] leading-relaxed text-muted">{post.excerpt}</p>
        )}

        <div className="mt-5 flex items-center gap-1.5 text-sm font-medium text-accent">
          Read
          <ArrowUpRight
            size={15}
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </div>
      </div>
    </Link>
  );
}
