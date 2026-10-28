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
  title: string;
  category: string;
  industry?: string;
  thumbnailImage: string;
  liveUrl?: string;
  published?: boolean;
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

  // Auto-dismiss toast feedback after 4 seconds
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

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
        ((p.category || p.industry) && (p.category || p.industry)!.toLowerCase().includes(q))
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
      {/* Sticky Top Header Container: Action Bar + Toast Message */}
      <div className="sticky top-[76px] z-20 space-y-3 pb-2 -mt-2 pt-2">
        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-4 rounded-xl flex items-center justify-between gap-3 text-xs font-medium shadow-xl backdrop-blur-md animate-fade-in border ${
              feedback.type === 'success'
                ? isDark
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : isDark
                ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                : 'bg-rose-50 border-rose-300 text-rose-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
          </div>
        )}

        {/* Top Action Bar */}
        <div
          className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg backdrop-blur-xl transition-all ${
            isDark ? 'bg-[#0F172A]/95 border-slate-800 shadow-black/40' : 'bg-white/95 border-slate-200 shadow-slate-200/50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-500 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Homepage Featured Projects</h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {formData.selectedProjectIds?.length || 0} Featured
                </span>
              </div>
              <p className="text-xs text-slate-400">Configure hero copy, selected case study tiles &amp; primary CTA</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>{isSaving ? 'Publishing...' : 'Save & Publish'}</span>
            </button>
          </div>
        </div>
      </div>

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
                            {project.category || project.industry}
                          </span>
                        </div>
                        {project.liveUrl && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            URL: <span className="font-mono">{project.liveUrl}</span>
                          </p>
                        )}
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
                          {project.category || project.industry}
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
    </div>
  );
}
