'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { convertContentToHtml } from '@/lib/utils/blogContent';
import '@/styles/blog-detail.css';

export interface DetailedInsightArticle {
  id: string;
  slug: string;
  title: string;
  titleAccent?: string | null;
  subtitle?: string | null;
  category: string;
  readTime: string;
  publishedAt: string | Date;
  authorName: string;
  authorRole?: string | null;
  authorAvatar?: string | null;
  coverImage?: string | null;
  excerpt?: string | null;
  content: string[] | any;
  keyTakeaways?: string[] | any;
  tags?: string[] | any;
}

interface MightyBlogDetailProps {
  article: DetailedInsightArticle;
}

function formatDetailDate(dateInput: string | Date): string {
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return 'Recently published';
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return 'Recently published';
  }
}

export default function MightyBlogDetail({ article }: MightyBlogDetailProps) {
  // Integrate strictly with global next-themes
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    // Remove any stale data-theme or mw-theme attributes that forced dark mode
    try {
      document.documentElement.removeAttribute('data-theme');
      localStorage.removeItem('mw-theme');
    } catch {
      // Ignore
    }
  }, []);

  const isDark = mounted ? (resolvedTheme === 'dark' || theme === 'dark') : false;

  // Convert content (HTML string or legacy markdown array) into clean HTML
  const htmlContent = convertContentToHtml(article.content);

  return (
    <div
      className={`mwb-detail ${isDark ? 'dark' : ''}`}
      data-theme={isDark ? 'dark' : 'light'}
    >
      <div className="wrap">
        {/* ── Top nav bar with Back to blog ── */}
        <div className="bar">
          <Link className="back" href="/insights">
            &larr; Back to blog
          </Link>
        </div>

        {/* ── Article Header ── */}
        <header>
          <p className="cat">{article.category}</p>
          <h1>
            {article.title} {article.titleAccent && <i>{article.titleAccent}</i>}
          </h1>
          <p className="meta">
            <b>{article.authorName || 'Team Mighty Warner'}</b> &nbsp;&middot;&nbsp;{' '}
            {formatDetailDate(article.publishedAt)} &nbsp;&middot;&nbsp; {article.readTime}
          </p>
        </header>

        {/* ── Hero Cover Image ── */}
        {article.coverImage && (
          <div className="cover">
            <img src={article.coverImage} alt={article.title} />
          </div>
        )}

        {/* ── Article Content (Rich Text) ── */}
        <article dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>

      {/* ── Footer ── */}
      <footer>
        &copy; {new Date().getFullYear()} Mighty Warners &nbsp;&middot;&nbsp; info@mightywarner.com
      </footer>
    </div>
  );
}
