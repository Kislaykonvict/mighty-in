'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react';
import { useAdminTheme } from '@/components/admin/AdminThemeContext';

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/admin/hero';
  const { theme, toggleTheme } = useAdminTheme();
  const isDark = theme === 'dark';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in, redirect immediately
  useEffect(() => {
    async function checkExistingAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          router.replace(from);
        }
      } catch {
        // Not logged in, stay on login page
      }
    }
    checkExistingAuth();
  }, [from, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please provide both your email address and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed. Please check your credentials.');
      }

      // Successful login
      router.push(from);
      router.refresh();
    } catch (err: any) {
      setError(err?.message || 'Failed to authenticate. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans select-none transition-colors duration-200 ${
        isDark ? 'bg-[#070B14] text-white' : 'bg-[#EEF2F6] text-slate-900'
      }`}
    >
      {/* Top-Right Theme Toggle Pill */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <div
          className={`flex items-center p-1 rounded-full border transition-all ${
            isDark
              ? 'bg-slate-900/90 border-slate-700/80 shadow-md'
              : 'bg-white/95 border-slate-300 shadow-sm'
          }`}
        >
          <button
            type="button"
            onClick={() => {
              if (isDark) toggleTheme();
            }}
            className={`p-1.5 rounded-full transition-all cursor-pointer ${
              !isDark
                ? 'bg-amber-100 text-amber-700 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Switch to light theme"
          >
            <Sun className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              if (!isDark) toggleTheme();
            }}
            className={`p-1.5 rounded-full transition-all cursor-pointer ${
              isDark
                ? 'bg-slate-800 text-indigo-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
            title="Switch to dark theme"
          >
            <Moon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Background ambient lighting effects */}
      <div
        className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] blur-3xl pointer-events-none rounded-full transition-opacity duration-300 ${
          isDark
            ? 'bg-gradient-to-tr from-indigo-600/15 via-sky-500/10 to-transparent opacity-100'
            : 'bg-gradient-to-tr from-indigo-500/10 via-sky-400/5 to-transparent opacity-80'
        }`}
      />
      <div
        className={`absolute -bottom-20 -right-20 w-80 h-80 blur-3xl pointer-events-none rounded-full ${
          isDark ? 'bg-rose-500/5' : 'bg-indigo-300/10'
        }`}
      />

      <div className="relative w-full max-w-md z-10 space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-3">
          <div
            className={`inline-flex items-center justify-center p-3 rounded-2xl border shadow-xl backdrop-blur-md mb-1 transition-colors ${
              isDark
                ? 'bg-white/[0.04] border-white/10'
                : 'bg-white border-slate-200/90 shadow-slate-200/50'
            }`}
          >
            <Image
              src="/images/mw-logo.webp"
              alt="Mighty Warner"
              width={160}
              height={44}
              priority
              className="h-10 w-auto object-contain"
            />
          </div>

          <div className="space-y-1">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase border transition-colors ${
                isDark
                  ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                  : 'bg-indigo-50 border-indigo-200 text-indigo-700'
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              <span>Restricted Admin Portal</span>
            </div>
            <h1
              className={`text-2xl font-black tracking-tight transition-colors ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Sign In to Console
            </h1>
            <p
              className={`text-xs max-w-xs mx-auto transition-colors ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Authorized administrator credentials required.
            </p>
          </div>
        </div>

        {/* Login form card */}
        <div
          className={`rounded-3xl border p-6 sm:p-8 backdrop-blur-xl relative transition-all duration-200 ${
            isDark
              ? 'bg-[#0D1424]/90 border-slate-800 shadow-2xl text-white'
              : 'bg-white border-slate-200/90 shadow-[0_20px_60px_rgba(15,23,42,0.06)] text-slate-900'
          }`}
        >
          {/* Error Banner */}
          {error && (
            <div
              className={`mb-6 p-3.5 rounded-xl border text-xs flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200 ${
                isDark
                  ? 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                  : 'bg-rose-50 border-rose-200 text-rose-700'
              }`}
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              <span className="leading-relaxed font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Address */}
            <div className="space-y-1.5">
              <label
                htmlFor="admin-email"
                className={`block text-xs font-semibold tracking-wide ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Work Email Address
              </label>
              <div className="relative">
                <div
                  className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${
                    isDark ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mightywarner.com"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm transition-all focus:outline-none ${
                    isDark
                      ? 'bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500'
                      : 'bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600'
                  }`}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="admin-password"
                  className={`block text-xs font-semibold tracking-wide ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <div
                  className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${
                    isDark ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-xs sm:text-sm font-mono transition-all focus:outline-none ${
                    isDark
                      ? 'bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500'
                      : 'bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute inset-y-0 right-0 pr-3.5 flex items-center transition-colors cursor-pointer ${
                    isDark
                      ? 'text-slate-500 hover:text-slate-300'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Security Session Indicator (1 Day Expiration) */}
            <div
              className={`pt-1 flex items-center justify-between text-[11px] ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              <span className="flex items-center gap-1.5 font-medium">
                <Sparkles className="w-3 h-3 text-indigo-500" />
                <span>Protected 24h session</span>
              </span>
              <span className="font-mono text-[10px] text-slate-400">
                Auto-logout in 1 day
              </span>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Admin</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer note */}
          <div
            className={`mt-6 pt-5 border-t text-center text-[11px] space-y-1 transition-colors ${
              isDark
                ? 'border-slate-800/80 text-slate-500'
                : 'border-slate-200 text-slate-500'
            }`}
          >
            <p className="font-semibold">Mighty Warner Digital Operating System</p>
            <p className="text-[10px] text-slate-400 font-mono">
              Authorized administrator access only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-[#EEF2F6] dark:bg-[#070B14]">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      }
    >
      <AdminLoginContent />
    </Suspense>
  );
}

