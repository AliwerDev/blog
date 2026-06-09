'use client';

import React, { useState, useTransition } from 'react';
import { X, Loader2 } from 'lucide-react';
import { createVideoAction } from '@/lib/actions/video-actions';
import { getYoutubeId } from '@/lib/utils';

interface AddVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddVideoModal({ isOpen, onClose, onSuccess }: AddVideoModalProps) {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [category, setCategory] = useState('');
  
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!youtubeUrl.trim()) {
      setError('YouTube havola kiritilishi shart.');
      return;
    }

    const videoId = getYoutubeId(youtubeUrl);
    if (!videoId) {
      setError('Noto\'g\'ri YouTube havolasi. Iltimos, to\'liq yoki qisqa YouTube havolasini kiriting.');
      return;
    }

    startTransition(async () => {
      const response = await createVideoAction({
        youtubeUrl: youtubeUrl.trim(),
        category: category.trim() || 'Boshqa',
      });

      if (response.success) {
        // Reset form
        setYoutubeUrl('');
        setCategory('');
        onSuccess();
        onClose();
      } else {
        setError(response.error || 'Video saqlashda xatolik yuz berdi.');
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" 
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl glass p-6 shadow-2xl z-10 border border-zinc-800/80 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3 mb-5">
          <h2 className="text-lg font-bold text-white font-display">
            Yangi video qo'shish
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4.5">
          <div>
            <label htmlFor="video-url" className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              YouTube Havola <span className="text-purple-400">*</span>
            </label>
            <input
              id="video-url"
              type="url"
              required
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="Masalan: https://www.youtube.com/watch?v=..."
              className="w-full rounded-xl bg-zinc-950/80 border border-zinc-800 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all"
            />
          </div>

          <div>
            <label htmlFor="video-category" className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              Toifa (Kategoriya)
            </label>
            <input
              id="video-category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Masalan: Dasturlash, Dizayn (Boshqa)"
              className="w-full rounded-xl bg-zinc-950/80 border border-zinc-800 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all"
            />
          </div>

          <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-all disabled:opacity-50 cursor-pointer"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple-500/10 hover:shadow-purple-500/20 transition-all cursor-pointer focus:outline-none disabled:opacity-70"
            >
              {isPending && <Loader2 className="h-4.5 w-4.5 animate-spin" />}
              Qo'shish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
