'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  ExternalLink,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Sparkles,
  Sliders,
  Layers,
  ArrowUpRight,
  Tag,
  Star,
  Globe,
  Eye,
  Check,
  Upload,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useAdminTheme } from './AdminThemeContext';
import { WorkPageSettings, defaultWorkPageSettings } from '@/types/workPage';

interface ProjectRecord {
  id: string;
  slug: string;
  title: string;
  client: string;
  industry: string;
  verticalId?: string;
  verticalName?: string;
  year: string;
  heroImage: string;
  thumbnailImage: string;
  galleryImages?: string[];
  shortDescription: string;
  tagline: string;
  summary: string;
  challenge: string;
  solution: string;
  objectives?: string[];
  strategy?: string[];
  technologiesUsed?: string[];
  metrics?: { value: string; label: string; description?: string }[];
  featured: boolean;
  liveUrl?: string;
  order: number;
  metaTitle?: string;
  metaDescription?: string;
}

export function WorkPortfolioManagementView() {
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';

  // State
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [categoriesTitle, setCategoriesTitle] = useState('TRUSTED ACROSS:');
  const [headerSettings, setHeaderSettings] = useState<WorkPageSettings>(defaultWorkPageSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingHeader, setIsSavingHeader] = useState(false);
  const [isSavingCategories, setIsSavingCategories] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [editingCategoryIndex, setEditingCategoryIndex] = useState<number | null>(null);
  const [editingCategoryValue, setEditingCategoryValue] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Category Showcase 2-row limit & expansion state
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);
  const [hasMoreThanTwoRows, setHasMoreThanTwoRows] = useState(false);
  const [twoRowsHeight, setTwoRowsHeight] = useState<number | null>(null);
  const categoriesContainerRef = useRef<HTMLDivElement>(null);

  // Filters (Search by Title)
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearchQuery, setAppliedSearchQuery] = useState('');

  // Modal / Editor State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectRecord | null>(null);
  const [isSavingProject, setIsSavingProject] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const thumbnailInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when modal is open to eliminate background shifting
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  // Measure if categories wrap to more than 2 rows
  useEffect(() => {
    const checkCategoryRows = () => {
      if (!categoriesContainerRef.current) return;
      const items = categoriesContainerRef.current.children;
      if (items.length <= 1) {
        setHasMoreThanTwoRows(false);
        setTwoRowsHeight(null);
        return;
      }

      const row1Top = (items[0] as HTMLElement).offsetTop;
      let row2Top: number | null = null;
      let row2Item: HTMLElement | null = null;
      let hasRow3 = false;

      for (let i = 1; i < items.length; i++) {
        const item = items[i] as HTMLElement;
        const top = item.offsetTop;
        if (top > row1Top) {
          if (row2Top === null) {
            row2Top = top;
            row2Item = item;
          } else if (top > row2Top) {
            hasRow3 = true;
            break;
          }
        }
      }

      if (row2Top !== null && row2Item) {
        // Height needed to cleanly show row 1 and row 2 plus padding margin
        const calculatedTwoRowHeight = (row2Top - row1Top) + row2Item.offsetHeight + 4;
        setTwoRowsHeight(calculatedTwoRowHeight);
      } else {
        setTwoRowsHeight(null);
      }

      setHasMoreThanTwoRows(hasRow3);
    };

    checkCategoryRows();
    const timer = setTimeout(checkCategoryRows, 150);
    window.addEventListener('resize', checkCategoryRows);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkCategoryRows);
    };
  }, [categories, isCategoriesExpanded]);

  // Handle Thumbnail File Upload
  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProject) return;

    setIsUploadingThumbnail(true);
    try {
      const data = new FormData();
      data.append('file', file);
      data.append('folder', 'mighty-warner/work');
      data.append('resource_type', 'image');

      if (editingProject.thumbnailImage) {
        data.append('previousUrl', editingProject.thumbnailImage);
      }

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: data,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Upload failed');
      }

      const newImageUrl = json.url || json.secureUrl;
      setEditingProject((prev) =>
        prev
          ? {
              ...prev,
              thumbnailImage: newImageUrl,
              heroImage:
                prev.heroImage && prev.heroImage !== '/images/hero/mw-hero-bg.webp'
                  ? prev.heroImage
                  : newImageUrl,
            }
          : null
      );
      setFeedback({ type: 'success', message: 'Thumbnail image uploaded successfully!' });
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'Error uploading thumbnail image',
      });
    } finally {
      setIsUploadingThumbnail(false);
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
    }
  };

  // Load all projects, header settings, and categories
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [projRes, setRes, catRes] = await Promise.all([
        fetch('/api/admin/projects'),
        fetch('/api/admin/work/settings'),
        fetch('/api/admin/work/categories'),
      ]);
      const [projJson, setJson, catJson] = await Promise.all([
        projRes.json(),
        setRes.json(),
        catRes.json(),
      ]);

      if (projJson.success) {
        setProjects(projJson.projects || []);
      }
      if (setJson.success) {
        setHeaderSettings(setJson.data || defaultWorkPageSettings);
      }
      if (catJson.success) {
        setCategories(catJson.categories || []);
        if (catJson.title) setCategoriesTitle(catJson.title);
      } else if (projJson.industries) {
        setCategories(projJson.industries || []);
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error loading portfolio data' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Save Header Settings
  const handleSaveHeader = async () => {
    setIsSavingHeader(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/admin/work/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(headerSettings),
      });
      const json = await res.json();
      if (json.success) {
        setHeaderSettings(json.data);
        setFeedback({ type: 'success', message: 'Work page editorial header published!' });
      } else {
        setFeedback({ type: 'error', message: json.error || 'Failed to update header settings' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Network error updating settings' });
    } finally {
      setIsSavingHeader(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditingProject({
      id: '',
      slug: '',
      title: '',
      client: '',
      industry: categories[0] || '',
      year: new Date().getFullYear().toString(),
      heroImage: '/images/hero/mw-hero-bg.webp',
      thumbnailImage: '',
      shortDescription: '',
      tagline: '',
      summary: '',
      challenge: '',
      solution: '',
      technologiesUsed: [],
      metrics: [],
      featured: false,
      liveUrl: '',
      order: projects.length + 1,
    });
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (project: ProjectRecord) => {
    setEditingProject({
      ...project,
      technologiesUsed: project.technologiesUsed || [],
      metrics: project.metrics || [],
    });
    setIsModalOpen(true);
  };

  // Save Project (Create or Update)
  const handleSaveProject = async () => {
    if (!editingProject) return;
    if (!editingProject.title.trim()) {
      setFeedback({ type: 'error', message: 'Project title is required' });
      return;
    }

    setIsSavingProject(true);
    setFeedback(null);

    const isEdit = Boolean(editingProject.id);
    const endpoint = isEdit ? `/api/admin/projects/${editingProject.id}` : '/api/admin/projects';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProject),
      });
      const json = await res.json();
      if (json.success) {
        setIsModalOpen(false);
        setEditingProject(null);
        setFeedback({
          type: 'success',
          message: isEdit ? 'Project successfully updated!' : 'New project added to portfolio!',
        });
        await loadData();
      } else {
        setFeedback({ type: 'error', message: json.error || 'Failed to save project' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error saving project' });
    } finally {
      setIsSavingProject(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  // Quick toggle featured
  const handleToggleFeatured = async (project: ProjectRecord) => {
    try {
      const res = await fetch(`/api/admin/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !project.featured }),
      });
      const json = await res.json();
      if (json.success) {
        setProjects((prev) =>
          prev.map((p) => (p.id === project.id ? { ...p, featured: !project.featured } : p))
        );
      }
    } catch (err) {
      console.error('Error toggling featured state:', err);
    }
  };

  // Delete Project
  const handleDeleteProject = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        setDeleteConfirmId(null);
        setProjects((prev) => prev.filter((p) => p.id !== id));
        setFeedback({ type: 'success', message: 'Project removed from portfolio.' });
      } else {
        setFeedback({ type: 'error', message: json.error || 'Failed to delete project' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error deleting project' });
    } finally {
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  // Category CRUD Handlers
  const handleSaveCategories = async (updatedCategories: string[], newTitle?: string) => {
    setIsSavingCategories(true);
    try {
      const res = await fetch('/api/admin/work/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categories: updatedCategories,
          title: newTitle || categoriesTitle,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setCategories(json.categories);
        if (json.title) setCategoriesTitle(json.title);
        setFeedback({ type: 'success', message: 'Categories updated successfully!' });
      } else {
        setFeedback({ type: 'error', message: json.error || 'Failed to update categories' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error updating categories' });
    } finally {
      setIsSavingCategories(false);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleAddCategory = async () => {
    const trimmed = newCategoryInput.trim();
    if (!trimmed) return;
    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      setFeedback({ type: 'error', message: 'Category already exists' });
      return;
    }
    const next = [...categories, trimmed];
    setCategories(next);
    setNewCategoryInput('');
    await handleSaveCategories(next);
  };

  const handleStartEditCategory = (index: number) => {
    setEditingCategoryIndex(index);
    setEditingCategoryValue(categories[index]);
  };

  const handleSaveEditCategory = async (index: number) => {
    const trimmed = editingCategoryValue.trim();
    if (!trimmed) return;
    const oldCat = categories[index];
    if (oldCat === trimmed) {
      setEditingCategoryIndex(null);
      return;
    }
    const next = [...categories];
    next[index] = trimmed;
    setCategories(next);
    setEditingCategoryIndex(null);
    await handleSaveCategories(next);
  };

  const handleDeleteCategory = async (catToDelete: string) => {
    if (categories.length <= 1) {
      setFeedback({ type: 'error', message: 'You must keep at least one category.' });
      return;
    }
    const next = categories.filter((c) => c !== catToDelete);
    setCategories(next);
    await handleSaveCategories(next);
  };

  // Search Handlers
  const handleExecuteSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAppliedSearchQuery(searchQuery.trim());
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setAppliedSearchQuery('');
  };

  // Filtered projects (strictly by title, triggered by Search button or Enter)
  const filteredProjects = projects.filter((p) => {
    const q = appliedSearchQuery.trim();
    if (!q) return true;
    return p.title.toLowerCase().includes(q.toLowerCase());
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[420px] space-y-4">
        <Loader2 className="w-9 h-9 animate-spin text-indigo-600" />
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Loading Work Portfolio Catalog...
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
            <Layers className="w-3.5 h-3.5" />
            <span>Master Work &amp; Portfolio Management</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Work Portfolio &amp; Case Studies Manager
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            Manage complete client portfolio items, detailed case study content, challenge &amp; solution narratives, metrics, and configure the editorial headers for both /work and /portfolio pages.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="/work"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <span>View Live /work Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <span className="text-slate-400 dark:text-slate-600">•</span>
            <a
              href="/portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white"
            >
              <span>View Live /portfolio Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="absolute right-6 -bottom-10 opacity-5 dark:opacity-10 pointer-events-none">
          <Layers className="w-64 h-64 text-indigo-500" />
        </div>
      </div>

      {/* Feedback Toast */}
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

      {/* Accordion / Panel: Editorial Header Settings */}
      <div
        className={`p-6 rounded-2xl border space-y-4 ${
          isDark ? 'bg-[#0B101D] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-500" />
              <span>Work &amp; Portfolio Page Editorial Banner</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Controls the top banner title, highlight text, and description on /work and /portfolio.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSaveHeader}
            disabled={isSavingHeader}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
          >
            {isSavingHeader ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Update Page Header</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5 md:col-span-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Badge Eyebrow
            </label>
            <input
              type="text"
              value={headerSettings.badge}
              onChange={(e) => setHeaderSettings({ ...headerSettings, badge: e.target.value })}
              className={`w-full px-3 py-2 rounded-xl border text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:outline-none ${
                isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <div className="space-y-1.5 md:col-span-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Headline Title
            </label>
            <input
              type="text"
              value={headerSettings.title}
              onChange={(e) => setHeaderSettings({ ...headerSettings, title: e.target.value })}
              className={`w-full px-3 py-2 rounded-xl border text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:outline-none ${
                isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <div className="space-y-1.5 md:col-span-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Highlighted Title Gradient
            </label>
            <input
              type="text"
              value={headerSettings.highlightedTitle}
              onChange={(e) => setHeaderSettings({ ...headerSettings, highlightedTitle: e.target.value })}
              className={`w-full px-3 py-2 rounded-xl border text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:outline-none ${
                isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <div className="space-y-1.5 md:col-span-3">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Description Paragraph
            </label>
            <textarea
              rows={2}
              value={headerSettings.description}
              onChange={(e) => setHeaderSettings({ ...headerSettings, description: e.target.value })}
              className={`w-full px-3 py-2 rounded-xl border text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:outline-none ${
                isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Category Management & Horizontal Showcase Section */}
      <div
        className={`p-6 rounded-2xl border space-y-6 ${
          isDark ? 'bg-[#0B101D] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        {/* Category Header & Add Input */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-900 dark:text-white">
                  Work Categories &amp; Industry Taxonomy
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {categories.length} Active
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage portfolio categories. These populate the project dropdown and display horizontally on the live site.
              </p>
            </div>
          </div>

          {/* Add Category Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddCategory();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="New category name..."
              value={newCategoryInput}
              onChange={(e) => setNewCategoryInput(e.target.value)}
              className={`px-3 py-2 rounded-xl border text-xs focus:ring-2 focus:ring-sky-500/20 focus:outline-none w-52 sm:w-64 ${
                isDark
                  ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            />
            <button
              type="submit"
              disabled={!newCategoryInput.trim() || isSavingCategories}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white transition-all cursor-pointer shrink-0"
            >
              {isSavingCategories ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Plus className="w-3.5 h-3.5" />
              )}
              <span>Add Category</span>
            </button>
          </form>
        </div>

        {/* Categories Showcase (Max 2 rows with 'See All' toggle) */}
        <div className="space-y-2">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Hover over the categories to manage them.
          </p>

          <div
            className={`p-5 rounded-2xl border transition-colors ${
              isDark
                ? 'bg-[#080C14]/80 border-slate-800'
                : 'bg-gradient-to-r from-slate-50 via-slate-100/60 to-slate-50 border-slate-200'
            }`}
          >
          <div
            className={`transition-all duration-300 ease-in-out ${
              !isCategoriesExpanded && hasMoreThanTwoRows
                ? 'overflow-hidden'
                : 'overflow-visible'
            }`}
            style={
              !isCategoriesExpanded && hasMoreThanTwoRows && twoRowsHeight
                ? { maxHeight: `${twoRowsHeight}px` }
                : undefined
            }
          >
            <div
              ref={categoriesContainerRef}
              className="flex flex-wrap items-center justify-start gap-2.5 sm:gap-3"
            >
              {/* Category Pills (No leading doodled text) */}
              {categories.map((cat, index) => {
                const isEditing = editingCategoryIndex === index;

                if (isEditing) {
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-sky-500 bg-white dark:bg-slate-900 shadow-md ring-2 ring-sky-500/20"
                    >
                      <input
                        type="text"
                        autoFocus
                        value={editingCategoryValue}
                        onChange={(e) => setEditingCategoryValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSaveEditCategory(index);
                          } else if (e.key === 'Escape') {
                            setEditingCategoryIndex(null);
                          }
                        }}
                        className="text-xs font-semibold bg-transparent border-none outline-none text-slate-900 dark:text-white w-36 sm:w-44"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveEditCategory(index)}
                        className="p-1 rounded-full text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                        title="Save name"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingCategoryIndex(null)}
                        className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                }

                return (
                  <div
                    key={cat}
                    className="group relative px-4 py-2 rounded-full border border-slate-200 dark:border-white/20 bg-white dark:bg-white/[0.05] hover:bg-slate-50 dark:hover:bg-white/[0.1] hover:border-slate-300 dark:hover:border-white/40 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all duration-200 shadow-xs flex items-center gap-2"
                  >
                    <span>{cat}</span>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-1 pl-1.5 border-l border-slate-200 dark:border-white/10">
                      <button
                        type="button"
                        onClick={() => handleStartEditCategory(index)}
                        className="p-0.5 rounded text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                        title={`Rename "${cat}"`}
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat)}
                        className="p-0.5 rounded text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                        title={`Delete "${cat}"`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* See All / Show Less Button */}
          {hasMoreThanTwoRows && (
            <div className="flex items-center justify-center pt-3 mt-3 border-t border-slate-200/60 dark:border-slate-800/60">
              <button
                type="button"
                onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 transition-colors cursor-pointer"
              >
                <span>
                  {isCategoriesExpanded
                    ? 'Show Less'
                    : `See All Categories (${categories.length})`}
                </span>
                {isCategoriesExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>

      {/* Projects Table & Management Section */}
      <div
        className={`p-6 rounded-2xl border space-y-5 ${
          isDark ? 'bg-[#0B101D] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        {/* Header Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                Project Catalog ({projects.length} Total)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Create, update, or remove client projects and interactive case studies.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/25 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Project</span>
          </button>
        </div>

        {/* Search Bar & Search Button in Doodled Area */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <form
            onSubmit={handleExecuteSearch}
            className="flex items-center gap-2 flex-1 max-w-lg"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search projects by title..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (!e.target.value.trim()) {
                    setAppliedSearchQuery('');
                  }
                }}
                className={`w-full pl-9 pr-8 py-2 rounded-xl border text-xs focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Dedicated Search Button in Doodled Area */}
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all cursor-pointer shrink-0"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>
          </form>

          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Showing {filteredProjects.length} of {projects.length} {projects.length === 1 ? 'project' : 'projects'}
          </div>
        </div>

        {/* Projects List (Smaller, 4-Column Compact Premium Cards) */}
        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl space-y-3">
            <Briefcase className="w-8 h-8 mx-auto text-slate-400" />
            <p className="text-xs font-semibold text-slate-500">
              No projects matched your criteria.
            </p>
            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create your first project</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {filteredProjects.map((project) => {
              const isConfirmingDelete = deleteConfirmId === project.id;

              return (
                <div key={project.id} className="group flex flex-col">
                  {/* Visual Showcase Card with Rounded Corners */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-xs hover:shadow-lg transition-all duration-300">
                    <Image
                      src={project.thumbnailImage || '/images/hero/mw-hero-bg.webp'}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />

                    {/* Minimal Luxury Star Badge & Toggle */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFeatured(project);
                      }}
                      title={project.featured ? 'Featured Project (Click to unfeature)' : 'Mark as Featured'}
                      className={`absolute top-2.5 right-2.5 z-20 inline-flex items-center justify-center w-6 h-6 rounded-md backdrop-blur-md transition-all duration-200 cursor-pointer border ${
                        project.featured
                          ? 'bg-slate-950/70 border-amber-400/30 text-amber-300 shadow-sm shadow-black/40 hover:bg-slate-900/90 hover:border-amber-400/60 hover:scale-105 active:scale-95'
                          : 'opacity-0 group-hover:opacity-100 bg-slate-950/60 border-white/15 text-white/60 hover:text-amber-300 hover:border-amber-400/40 hover:scale-105 active:scale-95'
                      }`}
                    >
                      <Star
                        className={`w-3 h-3 transition-transform ${
                          project.featured ? 'fill-amber-300 text-amber-300' : 'text-current'
                        }`}
                      />
                    </button>

                    {/* Floating Glassmorphic Hover Overlay */}
                    <div
                      className={`absolute inset-0 z-10 bg-gradient-to-t from-slate-950/80 via-slate-950/15 to-transparent p-2.5 flex flex-col justify-end transition-opacity duration-200 ${
                        isConfirmingDelete
                          ? 'opacity-100 pointer-events-auto'
                          : 'opacity-0 group-hover:opacity-100 pointer-events-none'
                      }`}
                    >
                      {/* Bottom Floating Action Buttons */}
                      <div className="flex items-center justify-between w-full gap-1.5 pointer-events-auto">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(project)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white text-slate-900 hover:bg-slate-100 shadow-md transition-all cursor-pointer"
                          >
                            <Edit2 className="w-2.5 h-2.5" />
                            <span>Edit</span>
                          </button>

                          {isConfirmingDelete ? (
                            <div className="flex items-center gap-1 bg-black/80 p-0.5 rounded-md backdrop-blur-md border border-white/10">
                              <button
                                type="button"
                                onClick={() => handleDeleteProject(project.id)}
                                className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white hover:bg-rose-700 cursor-pointer"
                              >
                                Confirm
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-1.5 py-0.5 rounded text-[10px] text-slate-300 hover:text-white cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(project.id)}
                              className="p-1 rounded-md text-white/80 hover:text-rose-400 bg-black/50 hover:bg-rose-950/80 border border-white/10 backdrop-blur-md transition-all cursor-pointer"
                              title="Delete Project"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>

                        <a
                          href={`/work`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold bg-black/50 hover:bg-black/70 text-white border border-white/10 backdrop-blur-md transition-all"
                        >
                          <span>Preview</span>
                          <ArrowUpRight className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Minimal Middle-Aligned Product Name */}
                  <div className="mt-2 px-1 text-center">
                    <h3
                      title={project.title}
                      className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
                    >
                      {project.title}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Project Modal Drawer (Portaled to body to remove layout shift and top gap) */}
      {isModalOpen && editingProject && mounted && typeof document !== 'undefined'
        ? createPortal(
            <div className="fixed inset-0 !m-0 !top-0 !left-0 !right-0 !bottom-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
              <div
                className={`w-full max-w-3xl my-8 rounded-3xl border shadow-2xl overflow-hidden transition-all ${
                  isDark ? 'bg-[#0E1526] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black">
                      {editingProject.id ? 'Edit Case Study Project' : 'Add New Production Project'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Fill in the client outcome, showcase visuals, and case study details.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                  {/* Row 1: Title & Client */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Project Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingProject.title}
                        onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                        placeholder="e.g. Apex Global Logistics Platform"
                        className={`w-full px-3 py-2 rounded-xl border text-xs ${
                          isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                        }`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Client Name
                      </label>
                      <input
                        type="text"
                        value={editingProject.client}
                        onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                        placeholder="e.g. Apex Freight International"
                        className={`w-full px-3 py-2 rounded-xl border text-xs ${
                          isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Row 2: Category & Year */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Project Category *
                      </label>
                      <select
                        required
                        value={editingProject.industry}
                        onChange={(e) => setEditingProject({ ...editingProject, industry: e.target.value })}
                        className={`w-full px-3 py-2 rounded-xl border text-xs focus:ring-2 focus:ring-indigo-500/20 focus:outline-none ${
                          isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      >
                        <option value="" disabled>Select a Project Category</option>
                        {editingProject.industry && !categories.includes(editingProject.industry) && (
                          <option value={editingProject.industry}>
                            {editingProject.industry} (Current)
                          </option>
                        )}
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Delivery Year
                      </label>
                      <input
                        type="text"
                        value={editingProject.year}
                        onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                        placeholder="2026"
                        className={`w-full px-3 py-2 rounded-xl border text-xs ${
                          isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Row 3: Images & Live URL (Upload Button Replacing Text Field) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Thumbnail Image
                        </label>
                        {editingProject.thumbnailImage && (
                          <button
                            type="button"
                            onClick={() =>
                              setEditingProject({ ...editingProject, thumbnailImage: '' })
                            }
                            className="text-[11px] text-rose-500 hover:text-rose-600 font-medium cursor-pointer"
                          >
                            Remove Image
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Thumbnail Preview Box */}
                        <div
                          className={`w-16 h-11 rounded-xl border flex items-center justify-center shrink-0 overflow-hidden ${
                            isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-100 border-slate-300'
                          }`}
                        >
                          {editingProject.thumbnailImage ? (
                            <img
                              src={editingProject.thumbnailImage}
                              alt="Thumbnail preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-slate-400" />
                          )}
                        </div>

                        {/* File Upload Hidden Input + Button */}
                        <div className="flex-1 min-w-0">
                          <input
                            ref={thumbnailInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleThumbnailUpload}
                          />
                          <button
                            type="button"
                            onClick={() => thumbnailInputRef.current?.click()}
                            disabled={isUploadingThumbnail}
                            className={`w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer disabled:opacity-50 ${
                              isDark
                                ? 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
                                : 'bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-800'
                            }`}
                          >
                            {isUploadingThumbnail ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Uploading...</span>
                              </>
                            ) : (
                              <>
                                <Upload className="w-3.5 h-3.5 text-indigo-500" />
                                <span>
                                  {editingProject.thumbnailImage ? 'Change Image' : 'Upload Image'}
                                </span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Live Client URL (Optional)
                      </label>
                      <input
                        type="text"
                        value={editingProject.liveUrl || ''}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, liveUrl: e.target.value })
                        }
                        placeholder="https://client-domain.com"
                        className={`w-full px-3 py-2.5 rounded-xl border text-xs ${
                          isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Short Description */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Short Summary / Tagline
                    </label>
                    <textarea
                      rows={2}
                      value={editingProject.shortDescription}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, shortDescription: e.target.value })
                      }
                      placeholder="High-concurrency global trading platform scaled to 1.2M daily active users."
                      className={`w-full px-3 py-2 rounded-xl border text-xs ${
                        isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                      }`}
                    />
                  </div>

                  {/* Challenge & Solution */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        The Challenge
                      </label>
                      <textarea
                        rows={3}
                        value={editingProject.challenge}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, challenge: e.target.value })
                        }
                        placeholder="Legacy infrastructure bottlenecking transaction throughput..."
                        className={`w-full px-3 py-2 rounded-xl border text-xs ${
                          isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                        }`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        The Solution Delivered
                      </label>
                      <textarea
                        rows={3}
                        value={editingProject.solution}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, solution: e.target.value })
                        }
                        placeholder="Engineered high-speed microservices architecture with Next.js edge caching..."
                        className={`w-full px-3 py-2 rounded-xl border text-xs ${
                          isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Toggles: Featured Case Study */}
                  <div className="pt-2">
                    <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingProject.featured}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, featured: e.target.checked })
                        }
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Featured Case Study (Pinned with priority badge)</span>
                    </label>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveProject}
                    disabled={isSavingProject}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/25 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSavingProject ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>{editingProject.id ? 'Save Project Changes' : 'Create Project'}</span>
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
