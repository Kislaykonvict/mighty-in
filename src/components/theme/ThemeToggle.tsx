'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`w-9 h-9 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 ${className}`}
        aria-hidden="true"
      />
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative inline-flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-200 
        bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300
        dark:bg-white/[0.08] dark:hover:bg-white/[0.14] dark:text-slate-200 dark:border-white/15 
        hover:scale-105 active:scale-95 cursor-pointer shadow-xs ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 rotate-0" />
      ) : (
        <Moon className="w-4 h-4 text-slate-700 transition-transform duration-300 rotate-0" />
      )}
    </button>
  );
}
