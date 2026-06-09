'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, LogIn, LogOut, Tag, Calendar, ChevronRight } from 'lucide-react';
import topicsData from '@/config/topics.json';

interface Post {
  id: string;
  title: string;
  content: string;
  previewText: string;
  topicId: string;
  createdAt: string;
  updatedAt: string;
}

interface BlogLayoutProps {
  posts: Post[];
  selectedTopic: string;
  onSelectTopic: (id: string) => void;
  onSelectPost: (post: Post) => void;
  isAdmin: boolean;
  onLoginClick?: () => void;
  onLogoutClick: () => void;
  onNewPostClick: () => void;
}

export default function BlogLayout({
  posts,
  selectedTopic,
  onSelectTopic,
  onSelectPost,
  isAdmin,
  onLoginClick,
  onLogoutClick,
  onNewPostClick,
}: BlogLayoutProps) {
  
  // Filter posts based on selected topic
  const filteredPosts = selectedTopic === 'all'
    ? posts
    : posts.filter((post) => post.topicId === selectedTopic);

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('uz-UZ', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const getTopicLabel = (topicId: string) => {
    return topicsData.find((t) => t.id === topicId)?.label || topicId;
  };

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
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } },
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Top Header Navigation */}
      <header className="flex items-center justify-between py-6 mb-12 border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold font-display tracking-tight text-white">
            alisher<span className="text-purple-400 font-normal">.blog</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <>
              <button
                onClick={onNewPostClick}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-purple-500/10 hover:shadow-purple-500/20 transition-all cursor-pointer"
              >
                <Plus className="h-4.5 w-4.5" />
                Yangi post
              </button>
              <button
                onClick={onLogoutClick}
                className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer"
              >
                <LogOut className="h-4.5 w-4.5" />
                Chiqish
              </button>
            </>
          )}
        </div>
      </header>

      {/* Hero Intro removed */}

      {/* Topics Filter Tabs */}
      <div className="flex overflow-x-auto pb-4 mb-8 -mx-4 px-4 scrollbar-none">
        <div className="flex gap-2 bg-zinc-950 p-1 rounded-2xl border border-zinc-900/80">
          {topicsData.map((topic) => {
            const isActive = selectedTopic === topic.id;
            return (
              <button
                key={topic.id}
                onClick={() => onSelectTopic(topic.id)}
                className={`relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                  isActive ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    className="absolute inset-0 bg-zinc-900 border border-zinc-800/80 rounded-xl"
                  />
                )}
                <span className="relative z-10">{topic.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Posts Cards Grid */}
      <AnimatePresence mode="wait">
        {filteredPosts.length > 0 ? (
          <motion.div
            key={selectedTopic}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {filteredPosts.map((post) => (
              <motion.article
                key={post.id}
                variants={itemVariants}
                onClick={() => onSelectPost(post)}
                className="group glass glass-hover rounded-2xl p-6 shadow-md flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Card Meta */}
                  <div className="flex items-center gap-3 text-xs text-zinc-500 mb-4">
                    <span className="inline-flex items-center gap-1 bg-zinc-900 border border-zinc-800 px-2.5 py-0.5 rounded-full text-purple-400 font-medium">
                      <Tag className="h-3 w-3" />
                      {getTopicLabel(post.topicId)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
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
                <div className="flex items-center gap-1.5 text-sm font-semibold text-purple-400 group-hover:text-purple-300 transition-colors">
                  Batafsil o&apos;qish
                  <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.article>
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
            <p className="text-zinc-400 text-base">Hozircha ushbu mavzuda maqolalar yo&apos;q.</p>
            {isAdmin && (
              <button
                onClick={onNewPostClick}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 hover:border-purple-500/40 px-4 py-2 text-sm font-semibold text-purple-400 hover:text-purple-300 transition-all cursor-pointer"
              >
                <Plus className="h-4.5 w-4.5" />
                Ilk postni yozish
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
