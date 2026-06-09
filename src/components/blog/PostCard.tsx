'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, ChevronRight } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import TagBadge from '@/components/ui/TagBadge';
import { formatDate } from '@/lib/utils';
import { Post } from '@/types';

interface PostCardProps {
  post: Post;
  variants?: Variants;
}

export default function PostCard({ post, variants }: PostCardProps) {
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
      className="group glass glass-hover rounded-2xl p-6 shadow-md flex flex-col justify-between cursor-pointer border border-zinc-850/60 relative overflow-hidden"
    >
      <Link href={`/post/${post.id}`} className="absolute inset-0 z-10" aria-label={post.title} />
      
      <div className="relative z-20 pointer-events-none">
        {/* Card Meta */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 mb-4">
          <div className="flex flex-wrap gap-1.5 pointer-events-auto">
            {getPostTags(post).map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-zinc-500/80" />
            {formatDate(post.createdAt)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold font-display text-white group-hover:text-purple-400 transition-colors mb-3 leading-snug">
          {post.title}
        </h3>

        {/* Preview Text */}
        <p className="text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-3">
          {post.previewText || "Ushbu maqolaning qisqa mazmuni mavjud emas."}
        </p>
      </div>

      {/* Read More link */}
      <div className="flex items-center gap-1.5 text-sm font-semibold text-purple-400 group-hover:text-purple-300 transition-colors relative z-20 pointer-events-none mt-auto">
        Batafsil o&apos;qish
        <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.article>
  );
}
