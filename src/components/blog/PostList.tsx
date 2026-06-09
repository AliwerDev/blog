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

  return (
    <AnimatePresence mode="wait">
      {filteredPosts.length > 0 ? (
        <motion.div
          key={selectedTopic}
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-6"
        >
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} variants={itemVariants} />
          ))}
        </motion.div>
      ) : (
        <motion.div
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-center py-20 glass rounded-2xl border border-dashed border-zinc-800"
        >
          <p className="text-zinc-400 text-base">
            Hozircha ushbu mavzuda maqolalar yo&apos;q.
          </p>
          {isAdmin && (
            <Link
              href="/new-post"
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 hover:border-purple-500/40 px-4 py-2 text-sm font-semibold text-purple-400 hover:text-purple-300 transition-all cursor-pointer"
            >
              <Plus className="h-4.5 w-4.5" />
              Ilk postni yozish
            </Link>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
