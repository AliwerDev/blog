'use client';

import React, { useTransition } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Plus, LogOut, Loader2 } from 'lucide-react';
import { logoutAction } from '@/lib/actions/auth-actions';

interface HeaderProps {
  isAdmin: boolean;
}

export default function Header({ isAdmin }: HeaderProps) {
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  const isBlogActive = pathname === '/';
  const isVideosActive = pathname === '/videos' || pathname.startsWith('/videos/');

  const handleLogout = () => {
    if (confirm('Tizimdan chiqmoqchimisiz?')) {
      startTransition(async () => {
        await logoutAction();
      });
    }
  };

  return (
    <header className="flex items-center justify-between py-6 mb-12 border-b border-zinc-800/80">
      <div className="flex items-center gap-6 md:gap-10">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xl font-bold font-display tracking-tight text-[var(--foreground)] group-hover:text-[var(--foreground-dim)] transition-colors">
            alisher<span className="text-[var(--muted)] font-normal group-hover:text-[var(--foreground-dim)] transition-colors">.blog</span>
          </span>
        </Link>

        <nav className="flex items-center gap-5 text-sm">
          <Link
            href="/"
            className={`transition-colors duration-200 ${
              isBlogActive 
                ? 'text-[var(--accent)] font-bold' 
                : 'text-zinc-400 hover:text-zinc-200 font-medium'
            }`}
          >
            Blog
          </Link>
          <Link
            href="/videos"
            className={`transition-colors duration-200 ${
              isVideosActive 
                ? 'text-[var(--accent)] font-bold' 
                : 'text-zinc-400 hover:text-zinc-200 font-medium'
            }`}
          >
            Videolar
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        {isAdmin && (
          <>
            <Link
              href="/new-post"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-purple-500/10 hover:shadow-purple-500/20 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black"
            >
              <Plus className="h-4.5 w-4.5" />
              Yangi post
            </Link>
            <button
              onClick={handleLogout}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-300 hover:text-white disabled:opacity-50 transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              {isPending ? (
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
              ) : (
                <LogOut className="h-4.5 w-4.5 text-zinc-400 group-hover:text-white" />
              )}
              Chiqish
            </button>
          </>
        )}
      </div>
    </header>
  );
}
