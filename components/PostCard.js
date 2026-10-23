import Link from 'next/link';
import dayjs from 'dayjs';

// One card for blog articles and posts. `post.type` is 'blog' | 'posts', the route segment.
// Sits inside a .ruled grid, which draws the lines.
export default function PostCard({ post, priority = false }) {
  return (
    <Link href={`/${post.type}/${post.slug}`} className="group flex flex-col">
      {post.cover_image_link && (
        <div className="aspect-[16/10] overflow-hidden border-b border-hair bg-surface">
          <img
            src={post.cover_image_link}
            alt=""
            loading={priority ? 'eager' : 'lazy'}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
          <span>{post.type === 'posts' ? 'Post' : 'Article'}</span>
          {post.draft && <span>Draft</span>}
          <span className="font-mono text-[13px]">{dayjs(post.publishedAt).format('MMM D, YYYY')}</span>
          {post.readingTime && <span className="font-mono text-[13px]">{post.readingTime}</span>}
        </div>
        <h3 className="text-[22px] leading-tight group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
          {post.title}
        </h3>
        {post.excerpt && <p className="line-clamp-2 text-muted">{post.excerpt}</p>}
      </div>
    </Link>
  );
}
