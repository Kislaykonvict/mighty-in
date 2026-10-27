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
  TrendingUp,
  Tag,
  Star,
  Globe,
  Eye,
  Check,
  Upload,
  Image as ImageIcon,
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
  const [industries, setIndustries] = useState<string[]>([]);
  const [headerSettings, setHeaderSettings] = useState<WorkPageSettings>(defaultWorkPageSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingHeader, setIsSavingHeader] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('ALL');

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

  // Load all projects and header settings
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [projRes, setRes] = await Promise.all([
        fetch('/api/admin/projects'),
        fetch('/api/admin/work/settings'),
      ]);
      const [projJson, setJson] = await Promise.all([projRes.json(), setRes.json()]);

      if (projJson.success) {
        setProjects(projJson.projects || []);
        setIndustries(projJson.industries || []);
      }
      if (setJson.success) {
        setHeaderSettings(setJson.data || defaultWorkPageSettings);
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
      industry: '',
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

  // Filtered projects
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      !searchQuery.trim() ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.industry && p.industry.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesIndustry =
      selectedIndustry === 'ALL' || p.industry === selectedIndustry;

    return matchesSearch && matchesIndustry;
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

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects by title, client, or industry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-4 py-2 rounded-xl border text-xs focus:ring-2 focus:ring-indigo-500/20 focus:outline-none ${
                isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            />
          </div>

          {/* Vertical Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setSelectedIndustry('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                selectedIndustry === 'ALL'
                  ? 'bg-indigo-600 text-white'
                  : isDark
                  ? 'bg-slate-800 text-slate-400 hover:text-white'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              All Industries
            </button>
            {industries.map((ind) => (
              <button
                key={ind}
                type="button"
                onClick={() => setSelectedIndustry(ind)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                  selectedIndustry === ind
                    ? 'bg-indigo-600 text-white'
                    : isDark
                    ? 'bg-slate-800 text-slate-400 hover:text-white'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>

        {/* Projects List */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className={`rounded-2xl border flex flex-col justify-between overflow-hidden transition-all duration-200 group ${
                  isDark
                    ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    : 'bg-white border-slate-200 hover:border-indigo-300 shadow-xs'
                }`}
              >
                <div>
                  {/* Thumbnail Cover */}
                  <div className="relative h-40 w-full overflow-hidden bg-slate-800">
                    <Image
                      src={project.thumbnailImage || '/images/hero/mw-hero-bg.webp'}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Featured Star Badge */}
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(project)}
                      title={project.featured ? 'Featured on Top (Click to toggle)' : 'Mark as Featured'}
                      className={`absolute top-2.5 right-2.5 p-1.5 rounded-lg backdrop-blur-md transition-colors ${
                        project.featured
                          ? 'bg-amber-500 text-white shadow-md'
                          : 'bg-slate-900/70 text-slate-400 hover:text-amber-400'
                      }`}
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </button>

                    <div className="absolute bottom-2.5 left-2.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-950/80 text-white backdrop-blur-xs">
                        {project.industry}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>Client: <strong className="text-slate-800 dark:text-slate-200">{project.client}</strong></span>
                      <span className="font-mono">{project.year}</span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                      {project.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {project.shortDescription || project.summary}
                    </p>

                    {/* Metrics preview */}
                    {project.metrics && project.metrics.length > 0 && (
                      <div className="flex items-center gap-2 pt-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>{project.metrics[0].value} {project.metrics[0].label}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Actions */}
                <div
                  className={`p-3 border-t flex items-center justify-between gap-2 ${
                    isDark ? 'border-slate-800 bg-slate-950/50' : 'border-slate-100 bg-slate-50/70'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(project)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>

                    {deleteConfirmId === project.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleDeleteProject(project.id)}
                          className="px-2 py-1.5 rounded-lg text-xs font-bold bg-rose-600 text-white hover:bg-rose-700"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-2 py-1.5 rounded-lg text-xs text-slate-500"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(project.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <a
                    href={`/work`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1"
                  >
                    <span>Preview</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
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

                  {/* Row 2: Industry & Year */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Industry Domain *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingProject.industry}
                        onChange={(e) => setEditingProject({ ...editingProject, industry: e.target.value })}
                        placeholder="e.g. Supply Chain / SaaS, Fintech, E-Commerce"
                        className={`w-full px-3 py-2 rounded-xl border text-xs ${
                          isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                        }`}
                      />
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
