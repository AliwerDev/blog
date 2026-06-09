'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    // Determine initial theme
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'light') {
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.classList.remove('light');
      }
    } else {
      document.documentElement.classList.remove('light'); // default to dark
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    
    if (nextTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 p-2.5 text-zinc-400 hover:text-white transition-all cursor-pointer shadow-md hover:shadow-lg"
      aria-label="Mavzuni o'zgartirish"
      title={theme === 'dark' ? 'Yorug\' mavzu' : 'Qorong\'u mavzu'}
    >
      {theme === 'dark' ? (
        <Sun className="h-4.5 w-4.5 text-amber-400 animate-pulse" />
      ) : (
        <Moon className="h-4.5 w-4.5 text-indigo-400" />
      )}
    </button>
  );
}
