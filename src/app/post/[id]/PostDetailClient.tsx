'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit, Trash2, Loader2 } from 'lucide-react';
import PostDetailContent from '@/components/blog/PostDetailContent';
import { deletePostAction } from '@/lib/actions/post-actions';
import { Post } from '@/types';

interface PostDetailClientProps {
  post: Post;
  isAdmin: boolean;
}

export default function PostDetailClient({ post, isAdmin }: PostDetailClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');

  const handleDelete = () => {
    if (!confirm('Haqiqatan ham ushbu postni o\'chirmoqchimisiz?')) return;
    
    setError('');

    startTransition(async () => {
      try {
        const res = await deletePostAction(post.id);
        if (!res.success) {
          setError(res.error || 'O\'chirishda xatolik yuz berdi');
        } else {
          router.push('/');
          router.refresh();
        }
      } catch (err) {
        setError('O\'chirishda kutilmagan xatolik yuz berdi');
        console.error(err);
      }
    });
  };

  return (
    <div className="relative min-h-screen px-4 pt-2 md:pt-4 pb-8 md:pb-16">
      {/* Ambient gradient glow */}
      <div className="glow-bg" />

      <main className="relative z-10 py-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          {/* Navigation and Actions Bar */}
          <div className="flex items-center justify-between mb-8 border-b border-zinc-200 pb-4 select-none">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-zinc-500 hover:text-black transition-colors group text-xs font-mono uppercase tracking-wider"
            >
              <ArrowLeft className="h-3.5 w-3.5 transform group-hover:-translate-x-1 transition-transform" />
              Orqaga qaytish
            </Link>

            <div className="flex items-center gap-3">
              {isAdmin && (
                <>
                  <Link
                    href={`/new-post?edit=${post.id}`}
                    className="inline-flex items-center gap-1.5 rounded-none bg-[var(--foreground)] hover:bg-zinc-800 border border-[var(--foreground)] px-3.5 py-1.5 text-xs font-bold text-white transition-all uppercase tracking-wider"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    Tahrirlash
                  </Link>
                  <button
                    onClick={handleDelete}
                    disabled={isPending}
                    className="inline-flex items-center gap-1.5 rounded-none bg-transparent hover:bg-rose-50 border border-rose-250 px-3.5 py-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 disabled:opacity-50 transition-all cursor-pointer uppercase tracking-wider"
                  >
                    {isPending ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                    O&apos;chirish
                  </button>
                </>
              )}
            </div>
          </div>

          {error && (
            <div className="text-sm text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 mb-6 text-center max-w-5xl mx-auto">
              {error}
            </div>
          )}

          {/* Render Detail content */}
          <PostDetailContent post={post} />
        </motion.div>
      </main>
    </div>
  );
}
