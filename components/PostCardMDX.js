import React from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';

const PostCard = ({ type, post, fullImage = false }) => {
  let btnText = type === 'posts' ? 'View Project' : 'Read Blog';

  return (
    <Link href={`/${type}/${post.slug}`}>
      <motion.div 
        whileHover={{ y: -8 }}
        className="group relative glass-card rounded-3xl overflow-hidden transition-all duration-500"
      >
        <div className={fullImage ? "w-full" : "aspect-[4/3] overflow-hidden"}>
          <img 
            src={post.cover_image_link} 
            alt={post.title} 
            className={`w-full h-full object-cover ${!fullImage ? 'group-hover:scale-110' : 'group-hover:brightness-110'} transition-all duration-700`} 
          />
        </div>
        
        <div className="p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] uppercase tracking-[0.2em] font-black text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-3 py-1 rounded-full">
              {type === 'posts' ? 'Project' : 'Blog'}
            </span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {dayjs(post.publishedAt).format('MMM D, YYYY')}
            </span>
          </div>
          
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter leading-tight group-hover:text-red-600 transition-colors">
            {post.title}
          </h2>
          
          {post.draft && (
            <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 text-[10px] font-black py-1 px-3 rounded-full mb-3 inline-block tracking-widest">
              DRAFT
            </div>
          )}
          
          {!fullImage && (
            <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-6 leading-relaxed">
              {post.excerpt}
            </p>
          )}
          
          <div className="flex items-center justify-between mt-auto">
            <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              {post.readingTime}
            </span>
            <span className="text-sm font-black text-red-600 dark:text-red-400 group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
              {btnText} <span className="text-lg">→</span>
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default PostCard;
