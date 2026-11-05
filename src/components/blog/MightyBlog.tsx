'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import '@/styles/blog.css';

export interface BlogPostItem {
  id: string;
  slug: string;
  category: string;
  title: string;
  titleAccent?: string | null;
  excerpt?: string | null;
  publishedAt: string | Date;
  readTime: string;
  coverImage?: string | null;
  featured?: boolean;
  tags?: string[];
}

interface MightyBlogProps {
  initialPosts: BlogPostItem[];
  allCategories?: string[];
  title?: string;
  titleAccent?: string;
  latestCount?: number;
}

const pad = (n: number) => String(n).padStart(2, '0');

function formatDisplayDate(dateInput: string | Date): string {
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return 'Recently';
    return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
  } catch {
    return 'Recently';
  }
}

export default function MightyBlog({
  initialPosts = [],
  allCategories,
  title = 'The Mighty',
  titleAccent = 'Blog',
  latestCount = 3,
}: MightyBlogProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [query, setQuery] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [subscribing, setSubscribing] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);
  const [subError, setSubError] = useState<string>('');

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

  // Build unique category list dynamically
  const filterPills = useMemo(() => {
    if (allCategories && allCategories.length > 0) {
      return ['All', ...allCategories.filter((c) => c !== 'All')];
    }
    const cats = Array.from(new Set(initialPosts.map((p) => p.category).filter(Boolean)));
    return ['All', ...cats];
  }, [allCategories, initialPosts]);

  // Filter posts
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return initialPosts.filter((p) => {
      const matchesCategory = activeCategory === 'All' || p.category.toLowerCase() === activeCategory.toLowerCase();
      const searchBlob = `${p.title} ${p.titleAccent || ''} ${p.excerpt || ''} ${p.category} ${(p.tags || []).join(' ')}`.toLowerCase();
      const matchesQuery = !q || searchBlob.includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [initialPosts, activeCategory, query]);

  // Pick featured post (first marked featured, or the first in list)
  const featuredIndex = visible.findIndex((p) => p.featured);
  const featured = featuredIndex >= 0 ? visible[featuredIndex] : visible[0];
  const rest = visible.filter((p) => p.id !== featured?.id);
  const latest = rest.slice(0, latestCount);

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setSubError('Please enter a valid email address');
      return;
    }
    setSubscribing(true);
    setSubError('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'blog_sidebar' }),
      });
      if (res.ok) {
        setDone(true);
        setEmail('');
      } else {
        const data = await res.json().catch(() => ({}));
        setSubError(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch {
      setSubError('Network error. Please try again.');
    } finally {
      setSubscribing(false);
    }
  }

  return (
    <section
      className={`mwb ${isDark ? 'dark' : ''}`}
      data-theme={isDark ? 'dark' : 'light'}
      aria-labelledby="mwb-title"
    >
      <div className="mwb-wrap">
        {/* ── Top bar: category pills + search + theme toggle ── */}
        <div className="mwb-bar">
          <div className="mwb-pills" role="group" aria-label="Filter articles">
            {filterPills.map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={c === activeCategory}
                className={'mwb-pill' + (c === activeCategory ? ' is-on' : '')}
                onClick={() => setActiveCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <label className="mwb-search">
            <span className="mwb-sr">Search articles</span>
            <input
              type="search"
              placeholder="Search articles"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-4-4" />
            </svg>
          </label>
        </div>

        {/* ── Page title ── */}
        <h2 id="mwb-title" className="mwb-title">
          {title} <i>{titleAccent}</i>
        </h2>

        {!featured ? (
          <p className="mwb-empty">No articles found. Try another category or search query.</p>
        ) : (
          <div className="mwb-main">
            {/* ── Left: Featured article ── */}
            <article className="mwb-lead">
              <Link
                className="mwb-lead-img"
                href={`/insights/${featured.slug}`}
                tabIndex={-1}
                aria-hidden="true"
              >
                {featured.coverImage ? (
                  <img src={featured.coverImage} alt={featured.title} loading="lazy" />
                ) : (
                  <div className="mwb-ph" />
                )}
              </Link>
              <span className="mwb-tag">Featured · {featured.category}</span>
              <h3 className="mwb-lead-title">
                <Link href={`/insights/${featured.slug}`}>
                  {featured.title} {featured.titleAccent && <i>{featured.titleAccent}</i>}
                </Link>
              </h3>
              {featured.excerpt && <p className="mwb-excerpt">{featured.excerpt}</p>}
              <Link className="mwb-read" href={`/insights/${featured.slug}`}>
                Read article
              </Link>
            </article>

            {/* ── Right: Latest list + Newsletter ── */}
            <aside className="mwb-side" aria-label="Latest articles">
              <p className="mwb-side-h">Latest</p>

              <div className="mwb-list-scroll">
                {rest.length === 0 ? (
                  <p className="mwb-empty" style={{ padding: '24px 0', fontSize: '14px' }}>
                    No other articles found in this category.
                  </p>
                ) : (
                  rest.map((p, i) => (
                    <Link className="mwb-item" key={p.id} href={`/insights/${p.slug}`}>
                      <span className="mwb-num">{pad(i + 1)}</span>
                      <span className="mwb-item-body">
                        <span className="mwb-tag">{p.category}</span>
                        <h4>
                          {p.title} {p.titleAccent && <i>{p.titleAccent}</i>}
                        </h4>
                        <span className="mwb-meta">
                          {formatDisplayDate(p.publishedAt)} · {p.readTime}
                        </span>
                      </span>
                    </Link>
                  ))
                )}
              </div>

              {/* Dark newsletter card */}
              <form className="mwb-sub" onSubmit={handleSubscribe}>
                <b>Get new insights in your inbox</b>
                <span>One practical idea a week.</span>
                {done ? (
                  <em>Thanks! You&apos;re subscribed.</em>
                ) : (
                  <>
                    <div style={{ marginTop: '10px' }}>
                      <input
                        type="email"
                        required
                        placeholder="Your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 16px',
                          borderRadius: '50px',
                          border: '1px solid rgba(255,255,255,0.2)',
                          background: 'rgba(255,255,255,0.08)',
                          color: '#ffffff',
                          fontSize: '13px',
                          outline: 'none',
                          marginBottom: '8px',
                        }}
                      />
                    </div>
                    {subError && (
                      <span style={{ fontSize: '11px', color: '#ff8a9e', display: 'block', marginBottom: '6px' }}>
                        {subError}
                      </span>
                    )}
                    <div className="mwb-sub-row">
                      <button type="submit" disabled={subscribing}>
                        {subscribing ? 'Subscribing...' : 'Subscribe'}
                      </button>
                    </div>
                  </>
                )}
              </form>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
