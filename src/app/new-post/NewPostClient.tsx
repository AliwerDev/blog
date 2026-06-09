'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';
import PostEditorForm from '@/components/blog/PostEditorForm';
import { Post } from '@/types';

interface NewPostClientProps {
  editPost?: Post;
}

export default function NewPostClient({ editPost }: NewPostClientProps) {
  return (
    <div className="relative min-h-screen px-4 pt-2 md:pt-4 pb-8 md:pb-16">
      {/* Ambient gradient glow */}
      <div className="glow-bg" />

      <div className="w-full max-w-5xl mx-auto relative z-10">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-8 border-b border-zinc-800/80 pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group text-sm font-medium"
          >
            <ArrowLeft className="h-4.5 w-4.5 transform group-hover:-translate-x-1 transition-transform" />
            Orqaga qaytish
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold font-display text-white">
              {editPost ? 'Postni tahrirlash' : 'Yangi post yaratish'}
            </h1>
            <ThemeToggle />
          </div>
        </div>

        {/* Post Editor Form */}
        <PostEditorForm editPost={editPost} />
      </div>
    </div>
  );
}
