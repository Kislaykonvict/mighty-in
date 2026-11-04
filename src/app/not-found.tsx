import React from 'react';
import { Button } from '@/components/ui/Button';
import { Home, ArrowLeft } from 'lucide-react';
import { constructMetadata } from '@/lib/utils/seo';

export const metadata = constructMetadata({
  title: 'Page Not Found',
  description: 'The requested page could not be located on the Mighty Warner platform.',
});

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#080C14] px-4 py-32">
      <div className="max-w-md w-full text-center">
        <div className="inline-block p-3 rounded-2xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono text-sm font-bold mb-6">
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
          <Button href="/work" variant="outline" rightIcon={<ArrowLeft className="w-4 h-4 rotate-180" />}>
            Explore Case Studies
          </Button>
        </div>
      </div>
    </div>
  );
}
