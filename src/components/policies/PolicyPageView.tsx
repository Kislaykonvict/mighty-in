'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowRight, ShieldCheck, Clock, FileText, ChevronRight, Mail } from 'lucide-react';
import { PolicyPageData } from '@/types/policyPage';
import { RichTextContent } from '@/components/ui/RichTextContent';

interface PolicyPageViewProps {
  page: PolicyPageData;
}

export function PolicyPageView({ page }: PolicyPageViewProps) {
  const scrollToContent = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const elem = document.getElementById('policy-content');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const formattedDate = page.updatedAt
    ? new Date(page.updatedAt).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
    : 'October 2026';

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#080C14] text-slate-900 dark:text-[#F8FAFC]">
      {/* ============================================================ */}
      {/* 1. HERO SECTION: Full-Screen Picture + Optional Bottom-Left Text */}
      {/* ============================================================ */}
      <section className="relative min-h-[70vh] sm:min-h-[80vh] flex flex-col justify-end overflow-hidden bg-slate-950 pb-12 sm:pb-20 pt-28 border-b border-slate-200 dark:border-white/10">
        {/* Full-bleed background image covering whole screen */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src={page.heroImage}
            alt={page.heroTitle || page.title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-100 brightness-[1.05] contrast-[1.05]"
          />

          {/* Cinematic gradients for bottom-left text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent sm:w-2/3" />
        </div>

        {/* Bottom-Left Overlay Content */}
        <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4 sm:space-y-6">
            {/* Optional Badge */}
            {page.heroBadge && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-900/90 text-white border border-white/20 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                <RichTextContent content={page.heroBadge} inline />
              </div>
            )}

            {/* Optional Headline (aligned bottom-left) */}
            {page.heroTitle ? (
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-normal text-white tracking-tight leading-[1.12] drop-shadow-md">
                <RichTextContent content={page.heroTitle} inline />
              </h1>
            ) : (
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-normal text-white tracking-tight leading-[1.12] drop-shadow-md">
                <RichTextContent content={page.title} inline />
              </h1>
            )}

            {/* Optional Subtitle */}
            {page.heroSubtitle && (
              <div className="text-base sm:text-xl text-slate-200 font-light leading-relaxed drop-shadow-sm max-w-2xl">
                <RichTextContent content={page.heroSubtitle} />
              </div>
            )}

            {/* Meta Pill + Scroll Indicator Arrow */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                <span>Last Updated: {formattedDate}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Official Mighty Warner Policy</span>
              </span>

              <a
                href="#policy-content"
                onClick={scrollToContent}
                className="ml-auto inline-flex items-center gap-2 text-xs font-bold text-white hover:text-sky-300 transition-colors px-3 py-1.5 rounded-full bg-slate-900/90 border border-white/20 hover:bg-slate-800"
                aria-label="Scroll to policy content"
              >
                <span>Read Policy</span>
                <ArrowDown className="w-4 h-4 animate-bounce" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. POLICY BODY CONTENT AREA (Clean corporate readable area) */}
      {/* ============================================================ */}
      <section id="policy-content" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 flex-1 scroll-mt-24 bg-[#DBDBDB] dark:bg-[#080C14]">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-slate-800 dark:hover:text-slate-300 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-500">Legal</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-rose-600 dark:text-sky-400 font-semibold">{page.title}</span>
          </nav>

          {/* Rendered Rich Content */}
          <article
            className="prose prose-slate dark:prose-invert lg:prose-lg max-w-none
              prose-headings:font-normal prose-headings:tracking-tight prose-headings:text-slate-900 dark:prose-headings:text-white
              prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:pt-4 prose-h2:border-t prose-h2:border-slate-200 dark:prose-h2:border-white/10
              prose-h3:text-lg sm:prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-rose-700 dark:prose-h3:text-sky-300
              prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:leading-relaxed prose-p:font-normal prose-p:my-4
              prose-strong:text-slate-900 dark:prose-strong:text-white prose-strong:font-semibold
              prose-a:text-rose-600 dark:prose-a:text-sky-400 prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-rose-700 dark:hover:prose-a:text-sky-300
              prose-ul:my-4 prose-ul:text-slate-700 dark:prose-ul:text-slate-300 prose-li:my-1.5
              prose-blockquote:border-l-rose-500 dark:prose-blockquote:border-l-sky-500 prose-blockquote:bg-white dark:prose-blockquote:bg-white/[0.02] prose-blockquote:py-1 prose-blockquote:px-5 prose-blockquote:rounded-r-xl prose-blockquote:text-slate-700 dark:prose-blockquote:text-slate-300
              prose-table:border-collapse prose-table:w-full prose-table:my-6
              prose-th:border prose-th:border-slate-200 dark:prose-th:border-white/15 prose-th:bg-slate-100 dark:prose-th:bg-white/5 prose-th:p-3 prose-th:text-slate-900 dark:prose-th:text-white
              prose-td:border prose-td:border-slate-200 dark:prose-td:border-white/10 prose-td:p-3 prose-td:text-slate-700 dark:prose-td:text-slate-300"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />

          {/* Quick Help & Questions Box */}
          <div className="mt-16 sm:mt-24 p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#111927] border border-slate-200 dark:border-white/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-rose-600 dark:text-sky-400 font-bold">
                <Mail className="w-3.5 h-3.5" />
                <span>Legal &amp; Compliance Inquiries</span>
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Have questions about our terms or data governance?
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl">
                Our global compliance officers and executive counsel are available to answer contractual or privacy questions.
              </p>
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 transition-all shrink-0 shadow-md group"
            >
              <span>Contact Legal Team</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
