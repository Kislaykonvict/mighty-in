'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

export function FooterNewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'footer' }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(data.message || 'Thank you for subscribing!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again later.');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-4 py-2.5 rounded-full border border-emerald-200 dark:border-emerald-800/40">
        <CheckCircle2 className="w-4 h-4 shrink-0" />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
      <div className="relative">
        <input
          type="email"
          required
          placeholder="Enter your work email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full sm:w-72 px-4 py-2.5 rounded-full bg-white dark:bg-[#0B101B] border border-neutral-300 dark:border-white/15 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-rose-500 dark:focus:border-sky-400 transition-colors shadow-xs"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs shrink-0 disabled:opacity-50"
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Subscribing...</span>
          </>
        ) : (
          <>
            <span>Subscribe</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </>
        )}
      </button>

      {status === 'error' && (
        <span className="text-xs text-rose-600 dark:text-rose-400 self-center sm:self-auto">
          {message}
        </span>
      )}
    </form>
  );
}

