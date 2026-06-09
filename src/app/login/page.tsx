'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Mail, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState('');

  // Check if already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await fetch('/api/auth');
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            router.push('/');
            return;
          }
        }
      } catch (err) {
        console.error('Auth check error:', err);
      } finally {
        setCheckingAuth(false);
      }
    };
    checkAuthStatus();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login amalga oshmadi');
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
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      {/* Absolute floating theme toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      {/* Ambient gradient glow */}
      <div className="glow-bg" />

      {/* Main card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="w-full max-w-md overflow-hidden rounded-2xl glass p-8 shadow-2xl relative z-10"
      >
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white mb-6 transition-colors group"
        >
          <ArrowLeft className="h-3.5 w-3.5 transform group-hover:-translate-x-0.5 transition-transform" />
          Bosh sahifaga qaytish
        </Link>

        <div className="mb-6 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 mb-3 border border-purple-500/20">
            <Lock className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold font-display text-white">Admin Tizimi</h2>
          <p className="text-sm text-zinc-400 mt-1">Blog boshqaruvi uchun login qiling</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@blog.com"
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 py-3.5 pl-11 pr-4 text-white placeholder-zinc-500 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Parol
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-zinc-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 py-3.5 pl-11 pr-4 text-white placeholder-zinc-500 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 text-center"
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 py-3.5 px-4 text-sm font-semibold text-white shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 transition-all cursor-pointer mt-6"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Kirish"
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
