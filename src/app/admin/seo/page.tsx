'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Globe,
  Sliders,
  Sparkles,
  ChevronRight,
  FileText,
  Briefcase,
  Layers,
  CheckCircle2,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { SeoCardEditor, SeoData } from '@/components/admin/SeoCardEditor';
import { useAdminTheme } from '@/components/admin/AdminThemeContext';

export default function AdminSeoHubPage() {
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';

  const [pages, setPages] = useState<SeoData[]>([]);
  const [selectedPath, setSelectedPath] = useState<string>('/');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'static' | 'businesses' | 'work' | 'insights'>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Modal for adding a new route
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRoutePath, setNewRoutePath] = useState('');
  const [newRouteName, setNewRouteName] = useState('');

  const fetchSeoPages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/seo');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setPages(json.data);
      }
    } catch (err) {
      console.error('Failed to load SEO pages:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSeoPages();
  }, []);

  const selectedPage = pages.find((p) => p.path === selectedPath) || pages[0];

  const handleSaved = (saved: SeoData) => {
    setPages((prev) =>
      prev.map((p) => (p.path === saved.path ? { ...p, ...saved } : p))
    );
  };

  const handleAddNewRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoutePath.startsWith('/')) {
      alert('Route path must start with a slash (e.g. /landing-page)');
      return;
    }

    const newPage: SeoData = {
      path: newRoutePath.trim(),
      pageName: newRouteName.trim() || newRoutePath.trim(),
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
      canonicalUrl: `https://mightywarner.com${newRoutePath.trim()}`,
      headCode: '',
    };

    setPages((prev) => [newPage, ...prev]);
    setSelectedPath(newPage.path);
    setIsAddModalOpen(false);
    setNewRoutePath('');
    setNewRouteName('');
  };

  const filteredPages = pages.filter((p) => {
    const matchesSearch =
      p.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.pageName && p.pageName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.metaTitle && p.metaTitle.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterCategory === 'all') return true;
    if (filterCategory === 'businesses') return p.path.startsWith('/businesses');
    if (filterCategory === 'work') return p.path.startsWith('/work');
    if (filterCategory === 'insights') return p.path.startsWith('/insights');
    if (filterCategory === 'static') {
      return (
        !p.path.startsWith('/work/') &&
        !p.path.startsWith('/insights/') &&
        !p.path.startsWith('/businesses/')
      );
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b transition-colors ${
        isDark ? 'border-white/10' : 'border-slate-200'
      }`}>
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-sky-500 dark:text-sky-400 uppercase tracking-widest mb-1.5 font-bold">
            <Globe className="w-4 h-4" />
            <span>MIGHTY WARNER ADMIN • SEO ARCHITECTURE</span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight transition-colors ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Search Engine Optimization & Metadata Hub
          </h1>
          <p className={`text-sm mt-1 max-w-2xl transition-colors ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Manage page titles, meta descriptions, canonical URLs, and custom &lt;head&gt; JSON-LD schemas across every public route.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 dark:bg-sky-500 dark:hover:bg-sky-400 text-xs font-mono font-bold text-white shadow-md shadow-sky-600/20 dark:shadow-sky-500/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Page Route</span>
          </button>
          <button
            onClick={fetchSeoPages}
            disabled={isLoading}
            className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
              isDark
                ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
                : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700 shadow-xs'
            }`}
            title="Refresh SEO records"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Grid: Left Route Selector, Right Exact SEO Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Routes Navigator */}
        <div className={`lg:col-span-4 rounded-2xl border p-5 space-y-4 transition-colors ${
          isDark
            ? 'bg-[#0B111E] border-white/10 shadow-xl'
            : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <div className={`text-xs font-mono uppercase tracking-wider font-bold ${
              isDark ? 'text-slate-400' : 'text-slate-700'
            }`}>
              Pages & Routes ({filteredPages.length})
            </div>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
              isDark ? 'text-slate-500' : 'text-slate-400'
            }`} />
            <input
              type="text"
              placeholder="Search route or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs transition-colors focus:outline-none focus:border-sky-500 border ${
                isDark
                  ? 'bg-[#070B14] border-white/10 text-white placeholder:text-slate-600'
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white'
              }`}
            />
          </div>

          {/* Filter Tabs */}
          <div className={`flex flex-wrap gap-1.5 pb-2 border-b text-[11px] font-mono ${
            isDark ? 'border-white/10' : 'border-slate-200'
          }`}>
            {[
              { id: 'all', label: 'All' },
              { id: 'static', label: 'Core' },
              { id: 'businesses', label: 'Businesses' },
              { id: 'work', label: 'Case Studies' },
              { id: 'insights', label: 'Articles' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setFilterCategory(t.id as any)}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  filterCategory === t.id
                    ? 'bg-sky-600 dark:bg-sky-500 text-white font-bold shadow-xs'
                    : isDark
                    ? 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Route List */}
          <div className="space-y-1.5 max-h-[560px] overflow-y-auto pr-1">
            {filteredPages.map((p) => {
              const isSelected = p.path === selectedPath;
              const hasSchema = p.headCode && p.headCode.includes('application/ld+json');

              return (
                <button
                  key={p.path}
                  onClick={() => setSelectedPath(p.path)}
                  className={`w-full p-3 rounded-xl text-left transition-all flex items-center justify-between group cursor-pointer border ${
                    isSelected
                      ? isDark
                        ? 'bg-sky-500/15 border-sky-500/40 text-white shadow-md'
                        : 'bg-sky-50 border-sky-300 text-sky-950 shadow-xs'
                      : isDark
                      ? 'bg-white/[0.02] border-transparent hover:bg-white/[0.05] text-slate-300'
                      : 'bg-slate-50/70 border-slate-100 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className={`text-xs font-semibold truncate ${
                      isSelected
                        ? isDark ? 'text-white' : 'text-sky-950 font-bold'
                        : isDark ? 'text-slate-200' : 'text-slate-800'
                    }`}>
                      {p.pageName || p.path}
                    </div>
                    <div className={`text-[11px] font-mono truncate flex items-center gap-1.5 mt-0.5 ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      <span>{p.path}</span>
                      {hasSchema && (
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold border ${
                          isDark
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          Schema
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isSelected
                        ? isDark ? 'text-sky-400 translate-x-0.5' : 'text-sky-600 translate-x-0.5'
                        : isDark ? 'text-slate-600 group-hover:text-slate-400' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                </button>
              );
            })}

            {filteredPages.length === 0 && (
              <div className={`p-6 text-center text-xs ${
                isDark ? 'text-slate-500' : 'text-slate-400'
              }`}>
                No matching routes found.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Exact SEO Card Editor */}
        <div className="lg:col-span-8">
          {selectedPage ? (
            <SeoCardEditor
              key={selectedPage.path}
              initialData={selectedPage}
              onSave={handleSaved}
              entityLabel={
                selectedPage.path.startsWith('/insights')
                  ? 'article'
                  : selectedPage.path.startsWith('/work')
                  ? 'case study'
                  : 'page'
              }
            />
          ) : (
            <div className={`p-12 rounded-2xl border text-center text-sm transition-colors ${
              isDark
                ? 'bg-[#0B111E] border-white/10 text-slate-400'
                : 'bg-white border-slate-200 text-slate-600 shadow-sm'
            }`}>
              Select a page route to configure SEO.
            </div>
          )}
        </div>
      </div>

      {/* Add Page Route Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl space-y-5 animate-fade-in transition-colors ${
            isDark
              ? 'bg-[#0F172A] border-white/15 text-white'
              : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <h3 className={`text-lg font-bold tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Add Page Route SEO Record
            </h3>
            <form onSubmit={handleAddNewRoute} className="space-y-4">
              <div>
                <label className={`block text-xs font-semibold mb-1 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Route Path (Must start with /)
                </label>
                <input
                  type="text"
                  required
                  placeholder="/solutions/custom-landing"
                  value={newRoutePath}
                  onChange={(e) => setNewRoutePath(e.target.value)}
                  className={`w-full px-3.5 py-2 rounded-xl text-xs font-mono focus:outline-none focus:border-sky-500 border transition-colors ${
                    isDark
                      ? 'bg-[#070B14] border-white/10 text-white placeholder:text-slate-600'
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Human-Friendly Name
                </label>
                <input
                  type="text"
                  placeholder="Custom Solutions Landing"
                  value={newRouteName}
                  onChange={(e) => setNewRouteName(e.target.value)}
                  className={`w-full px-3.5 py-2 rounded-xl text-xs focus:outline-none focus:border-sky-500 border transition-colors ${
                    isDark
                      ? 'bg-[#070B14] border-white/10 text-white placeholder:text-slate-600'
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white'
                  }`}
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className={`px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer border ${
                    isDark
                      ? 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border-transparent'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 dark:bg-sky-500 dark:hover:bg-sky-400 text-xs font-bold text-white transition-colors cursor-pointer shadow-sm"
                >
                  Create Route SEO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
