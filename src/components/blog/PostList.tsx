'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PostCard from '@/components/blog/PostCard';
import { Post } from '@/types';
import { Plus } from 'lucide-react';
import Link from 'next/link';

interface PostListProps {
  posts: Post[];
  selectedTopic: string;
  isAdmin: boolean;
}

export default function PostList({ posts, selectedTopic, isAdmin }: PostListProps) {
  // Helper to extract normalized tags list for a post
  const getPostTags = (post: Post): string[] => {
    if (post.tags && Array.isArray(post.tags) && post.tags.length > 0) {
      return post.tags;
    }
    if (post.topicId) {
      return [post.topicId];
    }
    return [];
  };

  // Filter posts based on selected tag/topic
  const filteredPosts =
    selectedTopic === 'all'
      ? posts
      : posts.filter((post) => getPostTags(post).includes(selectedTopic));

  // Stagger animation container
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 100 },
    },
  };

  const leadPost = filteredPosts[0];
  const secondaryPosts = filteredPosts.slice(1);

  return (
    <AnimatePresence mode="wait">
      {filteredPosts.length > 0 ? (
        <motion.div
          key={selectedTopic}
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col"
        >
          {/* Featured Headline Article */}
          {leadPost && (
            <div className="w-full">
              <PostCard post={leadPost} variants={itemVariants} isFeatured={true} />
            </div>
          )}

          {/* Column Articles */}
          {secondaryPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 mt-4">
              {secondaryPosts.map((post) => (
                <PostCard key={post.id} post={post} variants={itemVariants} />
              ))}
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-center py-20 bg-white border border-dashed border-zinc-300 rounded-none"
        >
          <p className="text-zinc-500 font-serif text-base">
            Hozircha ushbu mavzuda maqolalar yo&apos;q.
          </p>
          {isAdmin && (
            <Link
              href="/new-post"
              className="mt-4 inline-flex items-center gap-1.5 bg-[var(--foreground)] hover:bg-zinc-800 px-4 py-2 text-xs font-bold text-white transition-all cursor-pointer uppercase tracking-wider border border-[var(--foreground)]"
            >
              <Plus className="h-4 w-4" />
              Ilk postni yozish
            </Link>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
