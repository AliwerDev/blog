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
      <div className="flex flex-wrap gap-2 mb-8 topic-tabs-container select-none">
        <button
          onClick={() => setSelectedTopic('all')}
          className={`px-3 py-1 rounded-none text-[11px] font-bold font-mono uppercase tracking-wider transition-all cursor-pointer border ${
            selectedTopic === 'all'
              ? 'bg-[var(--foreground)] border-[var(--foreground)] text-[var(--background)]'
              : 'bg-transparent border-zinc-300 text-[var(--muted)] hover:bg-zinc-100 hover:text-black'
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
              className={`px-3 py-1 rounded-none text-[11px] font-bold font-mono uppercase tracking-wider transition-all cursor-pointer border ${
                isActive
                  ? 'bg-[var(--foreground)] border-[var(--foreground)] text-[var(--background)]'
                  : 'bg-transparent border-zinc-300 text-[var(--muted)] hover:bg-zinc-100 hover:text-black'
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
