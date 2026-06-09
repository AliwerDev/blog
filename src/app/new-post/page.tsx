'use client';

import React, { useEffect, useRef, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, ArrowLeft, Save, X } from 'lucide-react';
import Link from 'next/link';
import topicsData from '@/config/topics.json';
import ThemeToggle from '@/components/ThemeToggle';

// Helper to convert plain text to HTML paragraphs
function toHtml(text: string): string {
  return text
    .split('\n\n')
    .map(p => {
      const trimmed = p.trim();
      if (!trimmed) return '';
      return `<p>${trimmed.replace(/\n/g, '<br />')}</p>`;
    })
    .filter(Boolean)
    .join('');
}

// Helper to convert HTML paragraphs back to plain text
function toPlainText(html: string): string {
  if (!html) return '';
  let text = html;
  // Replace paragraph endings with double newlines
  text = text.replace(/<\/p>\s*<p>/gi, '\n\n');
  // Strip opening/closing paragraph tags
  text = text.replace(/<p>/gi, '');
  text = text.replace(/<\/p>/gi, '');
  // Convert br tags to newlines
  text = text.replace(/<br\s*\/?>/gi, '\n');
  // Strip any other tags (e.g. if created using TipTap previously)
  text = text.replace(/<[^>]*>/g, '');
  return text.trim();
}

function NewPostForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [content, setContent] = useState('');
  
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fetchingPost, setFetchingPost] = useState(false);
  const [error, setError] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = tagInput.trim().toLowerCase().replace(/#/g, '');
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
        setTagInput('');
      }
    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // 1. Verify Authentication Status
  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const res = await fetch('/api/auth');
        if (!res.ok) {
          router.push('/login');
          return;
        }
        const data = await res.json();
        if (!data.authenticated) {
          router.push('/login');
          return;
        }
        setCheckingAuth(false);
      } catch {
        router.push('/login');
      }
    };
    verifyAdmin();
  }, [router]);

  // 2. Fetch post details if in edit mode
  useEffect(() => {
    if (checkingAuth || !editId) return;

    const fetchPostDetails = async () => {
      setFetchingPost(true);
      setError('');
      try {
        const res = await fetch('/api/posts');
        if (res.ok) {
          const posts = await res.json();
          const post = posts.find((p: { id: string }) => p.id === editId);
          if (post) {
            setTitle(post.title);
            setTags(post.tags || (post.topicId ? [post.topicId] : []));
            setContent(toPlainText(post.content));
          } else {
            setError('Tahrirlanayotgan post topilmadi');
          }
        }
      } catch {
        setError('Post tafsilotlarini yuklashda xatolik yuz berdi');
      } finally {
        setFetchingPost(false);
      }
    };

    fetchPostDetails();
  }, [editId, checkingAuth]);

  // 3. Auto-grow textarea height on value change
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  // 4. Save/Publish Handler
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Sarlavhani kiriting');
      return;
    }
    if (tags.length === 0) {
      setError('Kamida bitta tag (hashtag) kiriting');
      return;
    }
    if (!content.trim()) {
      setError('Post matnini yozing');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const url = editId ? `/api/posts/${editId}` : '/api/posts';
      const method = editId ? 'PUT' : 'POST';
      const htmlContent = toHtml(content);

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content: htmlContent,
          tags,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Saqlashda xatolik yuz berdi');
      }

      router.push('/');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 text-purple-500 animate-spin" />
        <p className="text-zinc-500 text-sm mt-4">Tekshirilmoqda...</p>
      </div>
    );
  }

  if (fetchingPost) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 text-purple-500 animate-spin" />
        <p className="text-zinc-500 text-sm mt-4">Post tafsilotlari yuklanmoqda...</p>
      </div>
    );
  }

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
              {editId ? 'Postni tahrirlash' : 'Yangi post yaratish'}
            </h1>
            <ThemeToggle />
          </div>
        </div>

        {error && (
          <div className="text-sm text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 mb-6 text-center max-w-3xl mx-auto">
            {error}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6 max-w-3xl mx-auto">
          <div className="space-y-4">
            {/* Title input */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Sarlavha
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Post sarlavhasini kiriting..."
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 py-3.5 px-4 text-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-display text-lg shadow-inner"
              />
            </div>

            {/* Dynamic Tags Input */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Hashtaglar (Enter tugmasi orqali qo'shing)
              </label>
              <div className="w-full rounded-xl bg-zinc-900 border border-zinc-800 p-2 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 transition-all flex flex-wrap gap-2 items-center min-h-[50px] shadow-inner">
                {tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/30 text-purple-300 rounded-lg px-2.5 py-1 text-xs font-semibold"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-purple-400 hover:text-purple-200 transition-colors focus:outline-none cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder={tags.length === 0 ? "Tag yozib, Enter bosing (masalan: tech, coding)..." : "Yana tag qo'shish..."}
                  className="flex-1 min-w-[150px] bg-transparent border-none outline-none text-white text-sm py-1 px-2 focus:ring-0 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Post Content Input Area (Auto-growing Textarea) */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Maqola Matni
            </label>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Maqola matnini bu yerga yozing..."
              className="w-full rounded-xl bg-zinc-900 border border-zinc-800 p-4 text-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all min-h-[300px] resize-none overflow-hidden leading-relaxed text-base"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-zinc-800/80">
            <Link
              href="/"
              className="rounded-xl px-5 py-3 text-sm font-semibold text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
            >
              Bekor qilish
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-purple-500/10 hover:shadow-purple-500/20 transition-all cursor-pointer"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {editId ? 'Yangilash' : 'Chop etish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function NewPostPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 text-purple-500 animate-spin" />
      </div>
    }>
      <NewPostForm />
    </Suspense>
  );
}
