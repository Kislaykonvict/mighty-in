'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Briefcase,
  Save,
  RotateCcw,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronUp,
  ChevronDown,
  Layers,
  ArrowRight,
  Eye,
  Sliders,
  Sparkles,
  Search,
  Check,
  Plus,
} from 'lucide-react';
import { useAdminTheme } from './AdminThemeContext';
import { HomepageWorkData, defaultHomepageWorkData } from '@/types/homepageWork';
import { MinimalRichTextEditor } from './MinimalRichTextEditor';

interface ProjectListItem {
  id: string;
  slug: string;
  title: string;
  client: string;
  industry: string;
  verticalId?: string;
  verticalName?: string;
  thumbnailImage: string;
  featured: boolean;
  order: number;
}

export function HomepageProjectsManagementView() {
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState<HomepageWorkData>(defaultHomepageWorkData);
  const [allProjects, setAllProjects] = useState<ProjectListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch initial config and available projects
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/admin/homepage/projects');
        const json = await res.json();
        if (json.success) {
          setFormData(json.data);
          setAllProjects(json.allProjects || []);
        } else {
          setFeedback({ type: 'error', message: json.error || 'Failed to load configuration' });
        }
      } catch (err: any) {
        setFeedback({ type: 'error', message: err.message || 'Error connecting to database' });
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Handle Save
  const handleSave = async () => {
    setIsSaving(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/admin/homepage/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (json.success) {
        setFormData(json.data);
        setIsDirty(false);
        setFeedback({ type: 'success', message: 'Homepage work section updated and published!' });
      } else {
        setFeedback({ type: 'error', message: json.error || 'Failed to save configuration' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Network error saving changes' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setFeedback(null), 5000);
    }
  };

  // Toggle project inclusion in homepage
  const toggleProjectSelection = (id: string) => {
    setIsDirty(true);
    setFormData((prev) => {
      const exists = prev.selectedProjectIds.includes(id);
      let updated: string[];
      if (exists) {
        updated = prev.selectedProjectIds.filter((pId) => pId !== id);
      } else {
        updated = [...prev.selectedProjectIds, id];
      }
      return { ...prev, selectedProjectIds: updated };
    });
  };

  // Move selected project up/down
  const moveProject = (index: number, direction: 'up' | 'down') => {
    setIsDirty(true);
    setFormData((prev) => {
      const list = [...prev.selectedProjectIds];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return { ...prev, selectedProjectIds: list };
    });
  };

  // Lookup map for fast retrieval
  const projectMap = new Map<string, ProjectListItem>();
  allProjects.forEach((p) => projectMap.set(p.id, p));

  // Selected projects in exact user-defined order
  const selectedProjects = formData.selectedProjectIds
    .map((id) => projectMap.get(id))
    .filter((p): p is ProjectListItem => Boolean(p));

  // Unselected projects filtered by search
  const unselectedProjects = allProjects
    .filter((p) => !formData.selectedProjectIds.includes(p.id))
    .filter((p) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.client.toLowerCase().includes(q) ||
        (p.industry && p.industry.toLowerCase().includes(q))
      );
    });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[420px] space-y-4">
        <Loader2 className="w-9 h-9 animate-spin text-indigo-600" />
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Loading Homepage Project Configuration...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 font-sans">
      {/* Top Banner */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border transition-colors relative overflow-hidden ${
          isDark
            ? 'bg-gradient-to-br from-[#0F172A] to-[#0A0F1D] border-slate-800 text-white'
            : 'bg-gradient-to-br from-white to-slate-50 border-slate-200 text-slate-900 shadow-sm'
        }`}
      >
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/20">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Homepage Section 4 • Work &amp; Case Studies</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Homepage Featured Projects
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            Select and sequence the verified case studies showcased on the primary homepage grid. Manage overall section copy, call-to-action buttons, and project display order.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/admin/work"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <span>Manage Full Project Portfolio (CRUD &amp; Details)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <span className="text-slate-400 dark:text-slate-600">•</span>
            <a
              href="/#work"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white"
            >
              <span>Preview Live Homepage Section</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="absolute right-6 -bottom-10 opacity-5 dark:opacity-10 pointer-events-none">
          <Briefcase className="w-64 h-64 text-indigo-500" />
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 border text-sm font-semibold transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-400'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Main Grid: Settings & Projects Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Section Copy & Global CTA */}
        <div className="lg:col-span-5 space-y-6">
          <div
            className={`p-6 rounded-2xl border space-y-5 ${
              isDark ? 'bg-[#0B101D] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-500" />
                <span>Section Copy &amp; Call to Action</span>
              </h2>
            </div>

            {/* Eyebrow Badge */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Eyebrow Badge Text
              </label>
              <MinimalRichTextEditor
                value={formData.badge}
                onChange={(val) => {
                  setIsDirty(true);
                  setFormData({ ...formData, badge: val });
                }}
                placeholder="PROVEN CLIENT CASE STUDIES"
                variant="inline"
              />
            </div>

            {/* Section Headline */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Headline Title
              </label>
              <MinimalRichTextEditor
                value={formData.title}
                onChange={(val) => {
                  setIsDirty(true);
                  setFormData({ ...formData, title: val });
                }}
                placeholder="We've built things worth talking about."
                variant="inline"
              />
            </div>

            {/* Subtitle */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Supporting Subtitle
              </label>
              <MinimalRichTextEditor
                value={formData.subtitle}
                onChange={(val) => {
                  setIsDirty(true);
                  setFormData({ ...formData, subtitle: val });
                }}
                placeholder="Explore the businesses, products, experiences, and technical solutions we've helped bring to life."
                variant="multiline"
                minHeight="72px"
              />
            </div>

            {/* Bottom CTA Button */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  CTA Button Label
                </label>
                <input
                  type="text"
                  value={formData.ctaText}
                  onChange={(e) => {
                    setIsDirty(true);
                    setFormData({ ...formData, ctaText: e.target.value });
                  }}
                  placeholder="Explore Complete Portfolio & Case Studies"
                  className={`w-full px-3 py-2 rounded-xl border text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:outline-none ${
                    isDark
                      ? 'bg-slate-900 border-slate-700 text-white'
                      : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  CTA Destination URL
                </label>
                <input
                  type="text"
                  value={formData.ctaLink}
                  onChange={(e) => {
                    setIsDirty(true);
                    setFormData({ ...formData, ctaLink: e.target.value });
                  }}
                  placeholder="/portfolio"
                  className={`w-full px-3 py-2 rounded-xl border text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:outline-none ${
                    isDark
                      ? 'bg-slate-900 border-slate-700 text-white'
                      : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Featured Projects Selector & Sequencing */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Featured Projects in Order */}
          <div
            className={`p-6 rounded-2xl border space-y-4 ${
              isDark ? 'bg-[#0B101D] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Selected Homepage Showcase
                </h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                {selectedProjects.length} {selectedProjects.length === 1 ? 'Project' : 'Projects'}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              All projects listed below appear on the homepage in this exact sequence. Use the arrow buttons to reorder.
            </p>

            {selectedProjects.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl">
                <p className="text-xs font-semibold text-slate-500">
                  No projects currently selected for homepage showcase. Choose projects from the catalog below.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {selectedProjects.map((project, index) => (
                  <div
                    key={project.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      isDark
                        ? 'bg-slate-900/80 border-slate-700/80 hover:border-slate-600'
                        : 'bg-slate-50 border-slate-200 hover:border-indigo-200 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Order Number Badge */}
                      <span className="w-6 h-6 shrink-0 rounded-lg bg-indigo-600 text-white font-mono font-black text-xs flex items-center justify-center shadow-xs">
                        {index + 1}
                      </span>

                      {/* Thumbnail */}
                      <div className="relative w-12 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 bg-slate-800">
                        <Image
                          src={project.thumbnailImage || '/images/hero/mw-hero-bg.webp'}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Project Meta */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {project.title}
                          </h4>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
                            {project.industry}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          Client: <span className="font-semibold">{project.client}</span>
                        </p>
                      </div>
                    </div>

                    {/* Actions: Move Up / Down & Remove */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveProject(index, 'up')}
                        title="Move Up"
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        disabled={index === selectedProjects.length - 1}
                        onClick={() => moveProject(index, 'down')}
                        title="Move Down"
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleProjectSelection(project.id)}
                        title="Remove from Homepage"
                        className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-rose-300 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors ml-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Available Projects Pool */}
          <div
            className={`p-6 rounded-2xl border space-y-4 ${
              isDark ? 'bg-[#0B101D] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-500" />
                <span>Available Project Catalog ({unselectedProjects.length})</span>
              </h3>

              {/* Search filter */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter available..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-8 pr-3 py-1.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                    isDark
                      ? 'bg-slate-900 border-slate-700 text-white'
                      : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>
            </div>

            {unselectedProjects.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">
                {allProjects.length === 0
                  ? 'No projects found in database. Create projects in Case Studies / Work.'
                  : 'All projects are currently added to the homepage showcase.'}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
                {unselectedProjects.map((project) => (
                  <div
                    key={project.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                      isDark
                        ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                        : 'bg-slate-50 border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative w-10 h-8 rounded overflow-hidden shrink-0 bg-slate-800">
                        <Image
                          src={project.thumbnailImage || '/images/hero/mw-hero-bg.webp'}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                          {project.title}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate">
                          {project.client} • {project.industry}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleProjectSelection(project.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Save Action Bar */}
      <div
        className={`sticky bottom-6 z-20 p-4 rounded-2xl border flex items-center justify-between backdrop-blur-md shadow-xl transition-all ${
          isDark
            ? 'bg-slate-900/90 border-slate-700 text-white'
            : 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-200/50'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              isDirty ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'
            }`}
          />
          <span className="text-xs font-semibold">
            {isDirty ? 'You have unsaved changes' : 'All changes published to live storefront'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/25 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? 'Publishing...' : 'Save & Publish Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
