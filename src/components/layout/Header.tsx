'use client';

import React, { useTransition, useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, LogOut, Loader2 } from 'lucide-react';
import { logoutAction } from '@/lib/actions/auth-actions';

interface HeaderProps {
  isAdmin: boolean;
}

export default function Header({ isAdmin }: HeaderProps) {
  const [isPending, startTransition] = useTransition();
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const today = new Date();
    setDateStr(
      today.toLocaleDateString('uz-UZ', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    );
  }, []);

  const handleLogout = () => {
    if (confirm('Tizimdan chiqmoqchimisiz?')) {
      startTransition(async () => {
        await logoutAction();
      });
    }
  };

  return (
    <header className="w-full mb-12 flex flex-col items-center">
      {/* Title Masthead */}
      <div className="w-full text-center py-4 relative">
        <Link href="/" className="inline-block group select-none">
          <span className="text-4xl sm:text-5xl md:text-6xl font-black font-display tracking-tight text-[var(--foreground)] group-hover:text-zinc-600 transition-colors uppercase block">
            alisher<span className="text-zinc-400 font-light group-hover:text-zinc-500 transition-colors">.blog</span>
          </span>
        </Link>
      </div>

      {/* Newspaper Dateline with double border */}
      <div className="w-full border-double-y py-2.5 my-2 flex flex-col sm:flex-row items-center justify-between text-[10px] md:text-xs font-sans text-zinc-500 uppercase tracking-widest gap-2 select-none">
        <span className="sm:w-1/3 text-center sm:text-left font-medium">Toshkent, UZ</span>
        <span className="sm:w-1/3 text-center font-bold text-[var(--foreground)]">
          {dateStr || 'KUNLIK NASHR'}
        </span>
        <span className="sm:w-1/3 text-center sm:text-right font-medium">Mustaqil Blog</span>
      </div>

      {/* Admin Actions Bar */}
      {isAdmin && (
        <div className="w-full flex items-center justify-end gap-3 pt-2 text-sm">
          <Link
            href="/new-post"
            className="inline-flex items-center gap-1.5 bg-[var(--foreground)] hover:bg-zinc-800 px-3.5 py-1.5 text-xs font-bold text-white transition-all cursor-pointer uppercase tracking-wider border border-[var(--foreground)]"
          >
            <Plus className="h-3.5 w-3.5" />
            Yangi post
          </Link>
          <button
            onClick={handleLogout}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 bg-transparent hover:bg-zinc-100 border border-zinc-300 px-3.5 py-1.5 text-xs font-bold text-zinc-700 hover:text-black disabled:opacity-50 transition-all cursor-pointer uppercase tracking-wider"
          >
            {isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <LogOut className="h-3.5 w-3.5" />
            )}
            Chiqish
          </button>
        </div>
      )}
    </header>
  );
}
