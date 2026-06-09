"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, LogIn, LogOut, Tag, Calendar, ChevronRight } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import type { Post } from "@/lib/db";

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

  // Dynamically extract unique tags from all posts
  const allTags = React.useMemo(() => {
    const tagsSet = new Set<string>();
    posts.forEach((post) => {
      getPostTags(post).forEach((tag) => {
        if (tag) {
          tagsSet.add(tag.toLowerCase());
        }
      });
    });
    return Array.from(tagsSet);
  }, [posts]);

  // Filter posts based on selected tag/topic
  const filteredPosts =
    selectedTopic === "all"
      ? posts
      : posts.filter((post) => getPostTags(post).includes(selectedTopic));

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("uz-UZ", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
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
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 100 },
    },
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
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Intro removed */}

      {/* Dynamic Tags Filter Tabs */}
      <div className="flex flex-wrap gap-2.5 mb-8 topic-tabs-container">
        <button
          onClick={() => onSelectTopic("all")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer border ${
            selectedTopic === "all"
              ? "bg-[var(--accent)]/10 border-[var(--accent)]/40 text-[var(--accent)] font-bold shadow-sm"
              : "bg-zinc-900/40 border-zinc-800/60 text-zinc-400 hover:text-zinc-200"
          }`}
        >
          #barchasi
        </button>
        {allTags.map((tag) => {
          const isActive = selectedTopic === tag;
          return (
            <button
              key={tag}
              onClick={() => onSelectTopic(tag)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer border ${
                isActive
                  ? "bg-[var(--accent)]/10 border-[var(--accent)]/40 text-[var(--accent)] font-bold shadow-sm"
                  : "bg-zinc-900/40 border-zinc-800/60 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              #{tag}
            </button>
          );
        })}
      </div>

      {/* Posts Cards Grid */}
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
              <motion.article
                key={post.id}
                variants={itemVariants}
                onClick={() => onSelectPost(post)}
                className="group glass glass-hover rounded-2xl p-6 shadow-md flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Card Meta */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 mb-4">
                    <div className="flex flex-wrap gap-1.5">
                      {getPostTags(post).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 bg-zinc-900 border border-zinc-800 px-2.5 py-0.5 rounded-full text-purple-400 font-medium"
                        >
                          <Tag className="h-3 w-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
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
                    {post.previewText ||
                      "Ushbu maqolaning qisqa mazmuni mavjud emas."}
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
            <p className="text-zinc-400 text-base">
              Hozircha ushbu mavzuda maqolalar yo&apos;q.
            </p>
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
