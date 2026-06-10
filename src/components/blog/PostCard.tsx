'use client';

import React from 'react';
import Link from 'next/link';
import TagBadge from '@/components/ui/TagBadge';
import { formatDate } from '@/lib/utils';
import { Post } from '@/types';
import { motion, Variants } from 'framer-motion';

interface PostCardProps {
  post: Post;
  variants?: Variants;
  isFeatured?: boolean;
}

export default function PostCard({ post, variants, isFeatured = false }: PostCardProps) {
  // Helper to extract normalized tags list for a post
  const getPostTags = (p: Post): string[] => {
    if (p.tags && Array.isArray(p.tags) && p.tags.length > 0) {
      return p.tags;
    }
    if (p.topicId) {
      return [p.topicId];
    }
    return [];
  };

  return (
    <motion.article
      variants={variants}
      className={`group relative flex flex-col justify-between cursor-pointer border-b border-zinc-200/80 last:border-none ${
        isFeatured 
          ? 'py-8 md:pb-12 md:pt-4 border-b-2 border-zinc-350' 
          : 'py-6'
      }`}
    >
      <Link href={`/post/${post.id}`} className="absolute inset-0 z-10" aria-label={post.title} />
      
      <div className="relative z-20 pointer-events-none">
        {/* Card Meta - Newspaper Style */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-sans text-[var(--muted)] mb-3">
          <div className="flex flex-wrap gap-1.5 pointer-events-auto">
            {getPostTags(post).map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
          <span className="text-[11px] tracking-wider text-zinc-500 font-mono">
            {formatDate(post.createdAt)}
          </span>
        </div>

        {/* Title - Newspaper Serif */}
        <h3 className={`font-bold font-display text-[var(--foreground)] group-hover:text-zinc-600 transition-colors mb-3 leading-tight tracking-tight ${
          isFeatured 
            ? 'text-3xl sm:text-4xl md:text-5xl font-black' 
            : 'text-xl sm:text-2xl'
        }`}>
          {post.title}
        </h3>

        {/* Preview Text - Reading Serif */}
        <p className={`text-zinc-650 font-serif leading-relaxed mb-4 ${
          isFeatured 
            ? 'text-base md:text-lg line-clamp-4' 
            : 'text-sm line-clamp-3'
        }`}>
          {post.previewText || "Ushbu maqolaning qisqa mazmuni mavjud emas."}
        </p>
      </div>

      {/* Read More - Minimalist */}
      <div className="inline-flex items-center gap-1 text-xs font-bold font-sans tracking-wider uppercase text-[var(--foreground)] group-hover:underline underline-offset-2 transition-all relative z-20 pointer-events-none mt-2">
        Batafsil o&apos;qish 
        <span className="inline-block transform group-hover:translate-x-1 transition-transform duration-200">→</span>
      </div>
    </motion.article>
  );
}
