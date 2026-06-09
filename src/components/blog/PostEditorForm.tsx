'use client';

import React, { useEffect, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Save, X, Loader2 } from 'lucide-react';
import { createPostAction, updatePostAction } from '@/lib/actions/post-actions';
import { toPlainText } from '@/lib/utils';
import { Post } from '@/types';

interface PostEditorFormProps {
  editPost?: Post;
}

export default function PostEditorForm({ editPost }: PostEditorFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(editPost?.title || '');
  const [tags, setTags] = useState<string[]>(
    editPost?.tags || (editPost?.topicId ? [editPost.topicId] : [])
  );
  const [tagInput, setTagInput] = useState('');
  const [content, setContent] = useState(
    editPost ? toPlainText(editPost.content) : ''
  );
  const [error, setError] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow textarea height on value change
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

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
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSave = (e: React.FormEvent) => {
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

    setError('');

    startTransition(async () => {
      try {
        let res;
        if (editPost) {
          res = await updatePostAction(editPost.id, {
            title,
            content,
            tags,
          });
        } else {
          res = await createPostAction({
            title,
            content,
            tags,
          });
        }

        if (!res.success) {
          setError(res.error || 'Saqlashda xatolik yuz berdi');
        } else {
          router.push('/');
          router.refresh();
        }
      } catch (err) {
        setError('Kutilmagan xatolik yuz berdi');
        console.error(err);
      }
    });
  };

  return (
    <div className="w-full">
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
              Hashtaglar (Enter tugmasi orqali qo&apos;shing)
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
                placeholder={
                  tags.length === 0
                    ? 'Tag yozib, Enter bosing (masalan: tech, coding)...'
                    : "Yana tag qo'shish..."
                }
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
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-purple-500/10 hover:shadow-purple-500/20 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {editPost ? 'Yangilash' : 'Chop etish'}
          </button>
        </div>
      </form>
    </div>
  );
}
