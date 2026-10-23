import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Home, Compass } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-24 text-center">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center mx-auto mb-6 text-rose-600 dark:text-sky-400">
          <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: '12s' }} />
        </div>

        <div className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-2">
          Error 404
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Page Not Found
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mb-8 leading-relaxed">
          The destination you are looking for might have been moved, renamed, or is currently undergoing strategic optimization.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button href="/" variant="primary" leftIcon={<Home className="w-4 h-4" />}>
            Return to Homepage
          </Button>
          <Button href="/businesses" variant="outline" rightIcon={<ArrowLeft className="w-4 h-4 rotate-180" />}>
            Explore Capabilities
          </Button>
        </div>
      </div>
    </div>
  );
}
