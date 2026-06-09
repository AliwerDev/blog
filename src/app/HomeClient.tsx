'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import PostList from '@/components/blog/PostList';
import { Post } from '@/types';

interface HomeClientProps {
  initialPosts: Post[];
  isAdmin: boolean;
}

export default function HomeClient({ initialPosts, isAdmin }: HomeClientProps) {
  const [selectedTopic, setSelectedTopic] = useState('all');

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
    initialPosts.forEach((post) => {
      getPostTags(post).forEach((tag) => {
        if (tag) {
          tagsSet.add(tag.toLowerCase());
        }
      });
    });
    return Array.from(tagsSet);
  }, [initialPosts]);

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Top Header Navigation */}
      <Header isAdmin={isAdmin} />

      {/* Dynamic Tags Filter Tabs */}
      <div className="flex flex-wrap gap-2.5 mb-8 topic-tabs-container">
        <button
          onClick={() => setSelectedTopic('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer border ${
            selectedTopic === 'all'
              ? 'bg-[var(--accent)]/10 border-[var(--accent)]/40 text-[var(--accent)] font-bold shadow-sm'
              : 'bg-zinc-900/40 border-zinc-800/60 text-zinc-400 hover:text-zinc-200'
          }`}
        >
          #barchasi
        </button>
        {allTags.map((tag) => {
          const isActive = selectedTopic === tag;
          return (
            <button
              key={tag}
              onClick={() => setSelectedTopic(tag)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer border ${
                isActive
                  ? 'bg-[var(--accent)]/10 border-[var(--accent)]/40 text-[var(--accent)] font-bold shadow-sm'
                  : 'bg-zinc-900/40 border-zinc-800/60 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              #{tag}
            </button>
          );
        })}
      </div>

      {/* Grid of posts */}
      <PostList
        posts={initialPosts}
        selectedTopic={selectedTopic}
        isAdmin={isAdmin}
      />
    </div>
  );
}
