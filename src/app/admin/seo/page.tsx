'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import {
  Search,
  Plus,
  RefreshCw,
  Edit2,
  Trash2,
  ExternalLink,
  Code,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Eye,
  X,
  Upload,
  Sparkles,
  Globe,
  Share2,
} from 'lucide-react';
import { PageSeo } from '@/lib/seo';

// Helper for SEO status badges
function getTitleStatus(length: number) {
  if (length === 0) return { label: 'Missing', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' };
  if (length < 30) return { label: 'Short', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
  if (length <= 65) return { label: 'Optimal', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
  return { label: 'Too Long', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' };
}

function getDescriptionStatus(length: number) {
  if (length === 0) return { label: 'Missing', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' };
  if (length < 100) return { label: 'Short', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
  if (length <= 165) return { label: 'Optimal', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
  return { label: 'Too Long', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' };
}

export default function AdminSeoPage() {
  const [pages, setPages] = useState<PageSeo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'optimal' | 'attention'>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [previewTab, setPreviewTab] = useState<'google' | 'social'>('google');
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'mobile'>('desktop');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    pageRoute: '',
    pageName: '',
    metaTitle: '',
    metaDescription: '',
    keywordsInput: '',
    metaImage: '/images/og/mighty-warner-og.jpg',
    canonicalUrl: '',
    customHeadScripts: '',
  });

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<PageSeo | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Toast feedback
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch all SEO pages
  const fetchPages = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetch('/api/seo');
      const data = await res.json();
      if (data.success && Array.isArray(data.data || data.pages)) {
        setPages(data.data || data.pages);
        if (isManualRefresh) showToast('SEO pages re-synced successfully');
      } else {
        showToast(data.error || 'Failed to fetch SEO pages', 'error');
      }
    } catch (err: any) {
      console.error('Fetch SEO error:', err);
      showToast('Network error while fetching SEO records', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  // Filtered and searched pages
  const filteredPages = useMemo(() => {
    return pages.filter((page) => {
      const matchesSearch =
        page.pageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.pageRoute.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.metaTitle.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (statusFilter === 'optimal') {
        const titleLen = page.metaTitle.length;
        const descLen = page.metaDescription.length;
        return titleLen >= 30 && titleLen <= 65 && descLen >= 100 && descLen <= 165;
      }

      if (statusFilter === 'attention') {
        const titleLen = page.metaTitle.length;
        const descLen = page.metaDescription.length;
        return titleLen < 30 || titleLen > 65 || descLen < 100 || descLen > 165;
      }

      return true;
    });
  }, [pages, searchQuery, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = pages.length;
    let optimalTitles = 0;
    let optimalDescriptions = 0;
    let needsAttention = 0;

    pages.forEach((p) => {
      const tLen = p.metaTitle.length;
      const dLen = p.metaDescription.length;
      const isTitleOptimal = tLen >= 30 && tLen <= 65;
      const isDescOptimal = dLen >= 100 && dLen <= 165;

      if (isTitleOptimal) optimalTitles++;
      if (isDescOptimal) optimalDescriptions++;
      if (!isTitleOptimal || !isDescOptimal) needsAttention++;
    });

    return { total, optimalTitles, optimalDescriptions, needsAttention };
  }, [pages]);

  // Open Add Modal
  const handleOpenAddModal = () => {
    setIsEditing(false);
    setFormData({
      pageRoute: '',
      pageName: '',
      metaTitle: '',
      metaDescription: '',
      keywordsInput: '',
      metaImage: '/images/og/mighty-warner-og.jpg',
      canonicalUrl: '',
      customHeadScripts: '',
    });
    setPreviewTab('google');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (page: PageSeo) => {
    setIsEditing(true);
    setFormData({
      pageRoute: page.pageRoute,
      pageName: page.pageName,
      metaTitle: page.metaTitle || '',
      metaDescription: page.metaDescription || '',
      keywordsInput: Array.isArray(page.metaKeywords) ? page.metaKeywords.join(', ') : '',
      metaImage: page.metaImage || '/images/og/mighty-warner-og.jpg',
      canonicalUrl: page.canonicalUrl || '',
      customHeadScripts: page.customHeadScripts || '',
    });
    setPreviewTab('google');
    setIsModalOpen(true);
  };

  // Handle Image Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('folder', 'mighty-warner/seo');

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setFormData((prev) => ({ ...prev, metaImage: data.url }));
        showToast('Social image uploaded successfully');
      } else {
        showToast(data.error || 'Failed to upload image', 'error');
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      showToast('Image upload failed', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  // Save / Update Form Submission
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.pageRoute.trim()) {
      showToast('Page route is required (e.g. /about)', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        pageRoute: formData.pageRoute.trim(),
        pageName: formData.pageName.trim() || formData.pageRoute.trim(),
        metaTitle: formData.metaTitle.trim(),
        metaDescription: formData.metaDescription.trim(),
        metaKeywords: formData.keywordsInput
          .split(',')
          .map((k) => k.trim())
          .filter(Boolean),
        metaImage: formData.metaImage.trim(),
        canonicalUrl: formData.canonicalUrl.trim(),
        customHeadScripts: formData.customHeadScripts.trim(),
      };

      const method = isEditing ? 'PUT' : 'POST';
      const res = await fetch('/api/seo', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        showToast(isEditing ? 'Page SEO updated successfully' : 'Page SEO created successfully');
        setIsModalOpen(false);
        fetchPages();
      } else {
        showToast(data.error || 'Operation failed', 'error');
      }
    } catch (err: any) {
      console.error('Submit error:', err);
      showToast('Network error while saving SEO record', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Action
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/seo?route=${encodeURIComponent(deleteTarget.pageRoute)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Route ${deleteTarget.pageRoute} removed successfully`);
        setDeleteTarget(null);
        fetchPages();
      } else {
        showToast(data.error || 'Failed to delete record', 'error');
      }
    } catch (err) {
      console.error('Delete error:', err);
      showToast('Network error while deleting record', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const titleLen = formData.metaTitle.length;
  const descLen = formData.metaDescription.length;
  const titleStatus = getTitleStatus(titleLen);
  const descStatus = getDescriptionStatus(descLen);

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 p-6 md:p-8">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-xl text-sm flex items-center space-x-2 border transition-all ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-200 border-emerald-700/60'
              : 'bg-rose-950/90 text-rose-200 border-rose-700/60'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-sky-500/10 text-sky-400 rounded-lg border border-sky-500/20">
              <Globe className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              SEO Meta Tags & Page Manager
            </h1>
          </div>
          <p className="mt-1.5 text-sm text-slate-400 max-w-2xl">
            Configure dynamic Meta Titles, Meta Descriptions, Social OG Previews, Canonical URLs, and Custom &lt;head&gt; Scripts for all public routes.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => fetchPages(true)}
            disabled={refreshing || loading}
            className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 rounded-lg border border-slate-700 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-sky-400' : ''}`} />
            <span>{refreshing ? 'Syncing...' : 'Refresh'}</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow-sm transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Page SEO</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Total Managed Routes</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white">{stats.total}</span>
            <span className="text-xs text-sky-400 font-mono">PostgreSQL</span>
          </div>
        </div>

        <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Optimal Meta Titles</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-400">{stats.optimalTitles}</span>
            <span className="text-xs text-slate-400">30–65 chars</span>
          </div>
        </div>

        <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Optimal Descriptions</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-400">{stats.optimalDescriptions}</span>
            <span className="text-xs text-slate-400">100–165 chars</span>
          </div>
        </div>

        <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Action Recommended</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className={`text-2xl font-bold ${stats.needsAttention > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
              {stats.needsAttention}
            </span>
            <span className="text-xs text-slate-400">Too short / long</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-slate-900/70 rounded-xl border border-slate-800 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by page name or route..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950/80 border border-slate-700/80 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400">Filter:</span>
          <div className="flex rounded-lg bg-slate-950/80 p-0.5 border border-slate-700/80 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-md transition ${
                statusFilter === 'all' ? 'bg-sky-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({pages.length})
            </button>
            <button
              onClick={() => setStatusFilter('optimal')}
              className={`px-3 py-1 rounded-md transition ${
                statusFilter === 'optimal' ? 'bg-emerald-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Optimal
            </button>
            <button
              onClick={() => setStatusFilter('attention')}
              className={`px-3 py-1 rounded-md transition ${
                statusFilter === 'attention' ? 'bg-amber-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Needs Attention
            </button>
          </div>
        </div>
      </div>

      {/* Pages Table */}
      <div className="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-sm flex flex-col items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin text-sky-500 mb-3" />
            <span>Loading PostgreSQL SEO records...</span>
          </div>
        ) : filteredPages.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            <AlertCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p>No SEO pages found matching your filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-4">Page & Route</th>
                  <th className="py-3.5 px-4">Meta Title</th>
                  <th className="py-3.5 px-4">Meta Description</th>
                  <th className="py-3.5 px-4">Keywords</th>
                  <th className="py-3.5 px-4">Social OG</th>
                  <th className="py-3.5 px-4">Custom Scripts</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredPages.map((page) => {
                  const tStatus = getTitleStatus(page.metaTitle.length);
                  const dStatus = getDescriptionStatus(page.metaDescription.length);

                  return (
                    <tr
                      key={page.id || page.pageRoute}
                      className="hover:bg-slate-800/30 transition-colors group"
                    >
                      {/* Page & Route */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-200 text-sm">{page.pageName}</div>
                        <div className="mt-1 flex items-center space-x-1.5">
                          <code className="text-xs font-mono bg-slate-950 px-2 py-0.5 rounded text-sky-400 border border-slate-800">
                            {page.pageRoute}
                          </code>
                          <a
                            href={page.pageRoute}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-500 hover:text-slate-300 opacity-0 group-hover:opacity-100 transition"
                            title="Open live page"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>

                      {/* Meta Title */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="truncate text-slate-200 font-medium">
                          {page.metaTitle || <span className="italic text-slate-600">None</span>}
                        </div>
                        <div className="mt-1 flex items-center space-x-2">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${tStatus.color}`}
                          >
                            {tStatus.label}
                          </span>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {page.metaTitle.length} chars
                          </span>
                        </div>
                      </td>

                      {/* Meta Description */}
                      <td className="py-3.5 px-4 max-w-sm">
                        <div className="line-clamp-2 text-slate-300 text-xs">
                          {page.metaDescription || (
                            <span className="italic text-slate-600">None</span>
                          )}
                        </div>
                        <div className="mt-1 flex items-center space-x-2">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${dStatus.color}`}
                          >
                            {dStatus.label}
                          </span>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {page.metaDescription.length} chars
                          </span>
                        </div>
                      </td>

                      {/* Keywords */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2 py-1 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">
                          {Array.isArray(page.metaKeywords) ? page.metaKeywords.length : 0} tags
                        </span>
                      </td>

                      {/* OG Image */}
                      <td className="py-3.5 px-4">
                        {page.metaImage ? (
                          <div className="relative w-12 h-7 rounded border border-slate-700 overflow-hidden bg-slate-950">
                            <Image
                              src={page.metaImage}
                              alt="Social OG"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <span className="text-slate-600 text-xs">None</span>
                        )}
                      </td>

                      {/* Custom Scripts */}
                      <td className="py-3.5 px-4">
                        {page.customHeadScripts && page.customHeadScripts.trim().length > 0 ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-medium">
                            <Code className="w-3 h-3" />
                            <span>Active</span>
                          </span>
                        ) : (
                          <span className="text-slate-600 text-xs">Empty</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => handleOpenEditModal(page)}
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                            title="Edit SEO"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(page)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                            title="Delete SEO"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* ADD / EDIT MODAL WITH LIVE PREVIEW SIMULATOR                    */}
      {/* ============================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-5xl bg-[#0c1222] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-sky-400" />
                <h3 className="font-bold text-slate-100 text-base">
                  {isEditing ? `Edit SEO: ${formData.pageName || formData.pageRoute}` : 'Add New Page SEO'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: 2 Columns on Desktop */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Form Inputs (7 cols) */}
              <form id="seo-form" onSubmit={handleSubmitForm} className="lg:col-span-7 space-y-4">
                {/* Route & Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Page Route <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="/pricing"
                      value={formData.pageRoute}
                      disabled={isEditing}
                      onChange={(e) => setFormData({ ...formData, pageRoute: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-sky-500 disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">Must start with &apos;/&apos;</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Page Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Pricing & Plans"
                      value={formData.pageName}
                      onChange={(e) => setFormData({ ...formData, pageName: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                {/* Meta Title */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300">
                      Meta Title (Page Title)
                    </label>
                    <div className="flex items-center space-x-2 text-[11px]">
                      <span className={`font-medium ${titleStatus.color} px-1.5 py-0.2 rounded border`}>
                        {titleStatus.label}
                      </span>
                      <span className="text-slate-400 font-mono">{titleLen} / 60 chars</span>
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="E.g. Strategy, Technology & High-Impact Growth | Mighty Warner"
                    value={formData.metaTitle}
                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-sky-500"
                  />
                  <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        titleLen > 65
                          ? 'bg-rose-500'
                          : titleLen >= 30
                          ? 'bg-emerald-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(100, (titleLen / 60) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Meta Description */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300">
                      Meta Description
                    </label>
                    <div className="flex items-center space-x-2 text-[11px]">
                      <span className={`font-medium ${descStatus.color} px-1.5 py-0.2 rounded border`}>
                        {descStatus.label}
                      </span>
                      <span className="text-slate-400 font-mono">{descLen} / 160 chars</span>
                    </div>
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Enter an engaging description summarizing this page for search results..."
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-sky-500 resize-none"
                  />
                  <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        descLen > 165
                          ? 'bg-rose-500'
                          : descLen >= 100
                          ? 'bg-emerald-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(100, (descLen / 160) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Keywords */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Meta Keywords (Comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="strategy, enterprise architecture, agile talent, next.js"
                    value={formData.keywordsInput}
                    onChange={(e) => setFormData({ ...formData, keywordsInput: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-sky-500"
                  />
                </div>

                {/* OG Image & Upload */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Social OG Image URL
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="/images/og/mighty-warner-og.jpg"
                      value={formData.metaImage}
                      onChange={(e) => setFormData({ ...formData, metaImage: e.target.value })}
                      className="flex-1 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-sky-500"
                    />
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={uploadingImage}
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg flex items-center space-x-1.5 transition disabled:opacity-50"
                    >
                      <Upload className={`w-3.5 h-3.5 ${uploadingImage ? 'animate-bounce' : ''}`} />
                      <span>{uploadingImage ? 'Uploading...' : 'Upload'}</span>
                    </button>
                  </div>
                </div>

                {/* Canonical URL */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300">
                      Canonical URL
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          canonicalUrl: `https://mightywarner.com${prev.pageRoute === '/' ? '' : prev.pageRoute}`,
                        }))
                      }
                      className="text-[10px] text-sky-400 hover:underline"
                    >
                      Autofill default
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="https://mightywarner.com/about"
                    value={formData.canonicalUrl}
                    onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-sky-500"
                  />
                </div>

                {/* Custom Head Scripts */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1">
                      <Code className="w-3.5 h-3.5 text-sky-400" />
                      <span>Custom &lt;head&gt; Scripts & Schema</span>
                    </label>
                    <span className="text-[10px] text-slate-500">Google Tag Manager, Meta Pixel, JSON-LD</span>
                  </div>
                  <textarea
                    rows={4}
                    placeholder={`<!-- Google Tag Manager, Meta Pixel, or JSON-LD -->\n<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "WebPage"\n}\n</script>`}
                    value={formData.customHeadScripts}
                    onChange={(e) => setFormData({ ...formData, customHeadScripts: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-sky-500 resize-none leading-relaxed"
                  />
                </div>
              </form>

              {/* Right Column: Live SERP & Social Simulator (5 cols) */}
              <div className="lg:col-span-5 bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col h-full">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                  <div className="flex items-center space-x-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs">
                    <button
                      type="button"
                      onClick={() => setPreviewTab('google')}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-md transition ${
                        previewTab === 'google'
                          ? 'bg-sky-600 text-white font-medium'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Google SERP</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewTab('social')}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-md transition ${
                        previewTab === 'social'
                          ? 'bg-sky-600 text-white font-medium'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Social Card</span>
                    </button>
                  </div>

                  {previewTab === 'google' && (
                    <div className="flex items-center space-x-1 text-[11px] text-slate-400">
                      <button
                        type="button"
                        onClick={() => setDevicePreview('desktop')}
                        className={`px-2 py-0.5 rounded ${devicePreview === 'desktop' ? 'bg-slate-800 text-white' : ''}`}
                      >
                        Desktop
                      </button>
                      <span>/</span>
                      <button
                        type="button"
                        onClick={() => setDevicePreview('mobile')}
                        className={`px-2 py-0.5 rounded ${devicePreview === 'mobile' ? 'bg-slate-800 text-white' : ''}`}
                      >
                        Mobile
                      </button>
                    </div>
                  )}
                </div>

                {/* Live Simulator Canvas */}
                <div className="flex-1 flex flex-col justify-center">
                  {previewTab === 'google' ? (
                    /* Google Search Snippet Simulation */
                    <div
                      className={`bg-white text-slate-800 p-4 rounded-xl shadow-md border border-slate-200 transition-all ${
                        devicePreview === 'mobile' ? 'max-w-xs mx-auto' : 'w-full'
                      }`}
                    >
                      {/* Breadcrumb Header */}
                      <div className="flex items-center space-x-2 text-xs mb-1.5">
                        <div className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[9px]">
                          M
                        </div>
                        <div className="leading-tight">
                          <div className="text-[12px] font-medium text-[#202124]">Mighty Warner</div>
                          <div className="text-[11px] text-[#4d5156] font-mono truncate">
                            {formData.canonicalUrl || `https://mightywarner.com${formData.pageRoute}`}
                          </div>
                        </div>
                      </div>

                      {/* Google Blue Link Title */}
                      <div className="text-[#1a0dab] hover:underline font-medium text-[17px] leading-snug cursor-pointer line-clamp-2">
                        {formData.metaTitle || formData.pageName || 'Mighty Warner | Enterprise Solutions'}
                      </div>

                      {/* Google Description Snippet */}
                      <div className="text-[#4d5156] text-[13px] leading-relaxed mt-1 line-clamp-3">
                        {formData.metaDescription ||
                          'Explore our full suite of enterprise digital solutions, custom software engineering pods, and growth marketing frameworks.'}
                      </div>
                    </div>
                  ) : (
                    /* Social Card Simulation (Twitter / LinkedIn / OpenGraph) */
                    <div className="w-full bg-[#1e2330] rounded-xl overflow-hidden border border-slate-700 shadow-md">
                      {/* Image Thumbnail Banner */}
                      <div className="relative aspect-[1.91/1] w-full bg-slate-900 border-b border-slate-700/80">
                        {formData.metaImage ? (
                          <Image
                            src={formData.metaImage}
                            alt="Preview"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-slate-500">
                            <ImageIcon className="w-8 h-8 mb-1" />
                            <span className="text-xs">No OG Image specified</span>
                          </div>
                        )}
                      </div>

                      {/* Text Snippet Content */}
                      <div className="p-3.5">
                        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 font-mono">
                          MIGHTYWARNER.COM
                        </div>
                        <div className="text-slate-100 font-semibold text-sm line-clamp-1 mb-1">
                          {formData.metaTitle || formData.pageName || 'Mighty Warner'}
                        </div>
                        <div className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                          {formData.metaDescription ||
                            'One company. Multiple ways to move your business forward.'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Changes are saved in real-time to PostgreSQL</span>
                  <span className="text-emerald-400 font-medium">Next.js SSR Ready</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-slate-800 bg-slate-900/60">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="seo-form"
                disabled={submitting}
                className="px-5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow-sm transition disabled:opacity-50 flex items-center space-x-1.5"
              >
                {submitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>{submitting ? 'Saving...' : isEditing ? 'Update Page SEO' : 'Save Page SEO'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* DELETE CONFIRMATION MODAL                                      */}
      {/* ============================================================== */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0c1222] border border-slate-800 rounded-xl shadow-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Page SEO Record</h3>
                <p className="text-xs text-slate-400 mt-0.5">This action will remove custom SEO for this route.</p>
              </div>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 mb-6 text-xs text-slate-300">
              <span className="text-slate-500 block text-[11px] mb-1">Target Route:</span>
              <code className="text-sky-400 font-mono font-semibold">{deleteTarget.pageRoute}</code>
              <span className="text-slate-500 block text-[11px] mt-2 mb-1">Page Name:</span>
              <span className="text-white font-medium">{deleteTarget.pageName}</span>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-sm transition disabled:opacity-50 flex items-center space-x-1.5"
              >
                {deleting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>{deleting ? 'Deleting...' : 'Confirm Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
