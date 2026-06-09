'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit, Trash2, Calendar, Tag, Loader2 } from 'lucide-react';
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

interface PostDetailProps {
  post: Post;
  isAdmin: boolean;
  onBack: () => void;
  onEdit: (post: Post) => void;
  onDeleteSuccess: () => void;
}

export default function PostDetail({ post, isAdmin, onBack, onEdit, onDeleteSuccess }: PostDetailProps) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const topic = topicsData.find((t) => t.id === post.topicId);

  const handleDelete = async () => {
    if (!confirm('Haqiqatan ham ushbu postni o\'chirmoqchimisiz?')) return;
    
    setDeleting(true);
    setError('');

    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'O\'chirishda xatolik yuz berdi');
      }

      onDeleteSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Xatolik yuz berdi');
      setDeleting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('uz-UZ', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-3xl mx-auto"
    >
      {/* Navigation and Actions Bar */}
      <div className="flex items-center justify-between mb-8 border-b border-zinc-800/80 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group cursor-pointer text-sm font-medium"
        >
          <ArrowLeft className="h-4.5 w-4.5 transform group-hover:-translate-x-1 transition-transform" />
          Orqaga qaytish
        </button>

        {isAdmin && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => onEdit(post)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer"
            >
              <Edit className="h-3.5 w-3.5 text-purple-400" />
              Tahrirlash
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 hover:border-rose-500/40 px-3.5 py-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 disabled:opacity-50 transition-all cursor-pointer"
            >
              {deleting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
              O&apos;chirish
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="text-sm text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 mb-6 text-center">
          {error}
        </div>
      )}

      {/* Post Content Area */}
      <article className="glass rounded-2xl p-6 md:p-10 shadow-xl border border-zinc-800/60">
        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 mb-6">
          <div className="inline-flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1 text-purple-400 font-medium">
            <Tag className="h-3.5 w-3.5" />
            {topic?.label || 'Kategoriya'}
          </div>
          <div className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(post.createdAt)}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold font-display text-white tracking-tight mb-8 leading-tight">
          {post.title}
        </h1>

        {/* HTML Rich Text Body */}
        <div 
          className="prose max-w-none text-zinc-300"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </motion.div>
  );
}
