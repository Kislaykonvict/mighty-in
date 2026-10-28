'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  FileText,
  Upload,
  Save,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Eye,
  RotateCcw,
  Sparkles,
  Shield,
  Layers,
  Globe,
  Loader2,
  Image as ImageIcon,
  Type,
  AlignLeft,
  Check,
  CheckCheck,
} from 'lucide-react';
import { useAdminTheme } from './AdminThemeContext';
import { PolicyPageData } from '@/types/policyPage';
import { defaultPolicyPages } from '@/data/defaultPolicyPages';
import { TipTapEditor } from './TipTapEditor';
import { MinimalRichTextEditor } from './MinimalRichTextEditor';

const POLICY_TABS = [
  { slug: 'terms-and-conditions', label: 'Terms & Conditions', icon: Shield, badge: 'Contract' },
  { slug: 'disclaimer', label: 'Disclaimer', icon: AlertCircle, badge: 'Liability' },
  { slug: 'privacy-policy', label: 'Privacy Policy', icon: FileText, badge: 'GDPR / CCPA' },
  { slug: 'refund-policy', label: 'Refund Policy', icon: Layers, badge: 'Billing' },
];

const HERO_IMAGE_PRESETS: Record<string, string[]> = {
  'terms-and-conditions': [
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=2000&q=80',
  ],
  'disclaimer': [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=2000&q=80',
  ],
  'privacy-policy': [
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=2000&q=80',
  ],
  'refund-policy': [
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=2000&q=80',
  ],
};

export function PoliciesManagementView() {
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';

  const [activeSlug, setActiveSlug] = useState('terms-and-conditions');
  const [formData, setFormData] = useState<PolicyPageData>(defaultPolicyPages['terms-and-conditions']);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load policy page by slug
  useEffect(() => {
    let isCancelled = false;

    async function loadPage() {
      setIsLoading(true);
      setFeedback(null);
      try {
        const res = await fetch(`/api/admin/policies/${activeSlug}`);
        const json = await res.json();
        if (!isCancelled) {
          if (json.success && json.data) {
            setFormData(json.data);
          } else {
            setFormData(defaultPolicyPages[activeSlug]);
          }
        }
      } catch (err: any) {
        if (!isCancelled) {
          console.error('Error fetching policy page:', err);
          setFormData(defaultPolicyPages[activeSlug]);
          setFeedback({ type: 'error', message: 'Could not load page from database, showing defaults.' });
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadPage();

    return () => {
      isCancelled = true;
    };
  }, [activeSlug]);

  // Auto-dismiss toast feedback after 4 seconds
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Handle Image Upload
  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setFeedback(null);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('folder', 'mighty-warner/legal');
      if (formData.heroImage) {
        uploadFormData.append('previousUrl', formData.heroImage);
      }

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Upload failed');
      }

      setFormData((prev) => ({
        ...prev,
        heroImage: json.url,
      }));

      setFeedback({
        type: 'success',
        message: `Hero image uploaded successfully (${json.provider === 'cloudinary' ? 'Cloudinary CDN' : 'Local Storage'})!`,
      });
    } catch (err: any) {
      console.error('Upload error:', err);
      setFeedback({
        type: 'error',
        message: err.message || 'Image upload failed. You can paste a direct URL below.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Save changes to database
  const handleSave = async () => {
    setIsSaving(true);
    setFeedback(null);
    try {
      const res = await fetch(`/api/admin/policies/${activeSlug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to save policy page');
      }

      setFormData(json.data);
      setFeedback({
        type: 'success',
        message: `${formData.title} saved and published successfully!`,
      });
    } catch (err: any) {
      console.error('Save error:', err);
      setFeedback({
        type: 'error',
        message: err.message || 'Error saving changes to database.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to default
  const handleResetToDefault = () => {
    if (confirm(`Reset ${formData.title} to standard template defaults?`)) {
      const def = defaultPolicyPages[activeSlug];
      if (def) {
        setFormData(def);
        setFeedback({
          type: 'success',
          message: 'Reset to default template. Remember to click "Save Changes" to publish.',
        });
      }
    }
  };

  return (
    <div className="space-y-8 pb-16 font-sans">
      {/* Sticky Top Header Container: Action Bar + Toast Message */}
      <div className="sticky top-[76px] z-20 space-y-3 pb-2 -mt-2 pt-2">
        {/* Feedback Banner */}
        {feedback && (
          <div
            className={`p-4 rounded-2xl flex items-center justify-between text-xs sm:text-sm font-semibold transition-all shadow-xl backdrop-blur-md animate-fade-in ${
              feedback.type === 'success'
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/15 border border-rose-500/30 text-rose-400'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              )}
              <span>{feedback.message}</span>
            </div>
          </div>
        )}

        {/* Top Header & Save Action Bar Card */}
        <div
          className={`p-5 sm:p-6 rounded-2xl border shadow-lg backdrop-blur-xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            isDark
              ? 'bg-[#0F172A]/95 border-slate-800 shadow-black/40'
              : 'bg-white/95 border-slate-200 shadow-slate-200/50'
          }`}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Dynamic Legal Studio
              </span>
              <span className="text-xs text-slate-400">• Full Screen Hero + Rich Content</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Policies &amp; Legal Page Management
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage Terms &amp; Conditions, Disclaimer, Privacy Policy, and Refund Policy with full-bleed hero covers and rich text manipulation.
            </p>
          </div>

          {/* Global Save Button & Live Link */}
          <div className="flex items-center gap-2.5">
            <a
              href={`/${activeSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                isDark
                  ? 'border-slate-700 bg-slate-800/70 hover:bg-slate-700 text-slate-200'
                  : 'border-slate-300 bg-white hover:bg-slate-100 text-slate-700 shadow-xs'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-indigo-400" />
              <span>View Live</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || isLoading}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 via-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tab Selector (The 4 Pages) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {POLICY_TABS.map((tab) => {
          const isSelected = activeSlug === tab.slug;
          const Icon = tab.icon;

          return (
            <button
              key={tab.slug}
              type="button"
              onClick={() => setActiveSlug(tab.slug)}
              className={`p-3.5 rounded-2xl border text-left transition-all duration-200 relative group ${
                isSelected
                  ? isDark
                    ? 'bg-indigo-600/15 border-indigo-500/60 text-white shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/30'
                    : 'bg-indigo-50 border-indigo-400 text-indigo-950 shadow-xs ring-1 ring-indigo-400/40'
                  : isDark
                  ? 'bg-slate-900/50 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`p-2 rounded-xl transition-colors ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : isDark
                      ? 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                      : 'bg-slate-100 text-slate-600 group-hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border transition-colors ${
                    isSelected
                      ? isDark
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                        : 'bg-indigo-100 text-indigo-700 border-indigo-200'
                      : isDark
                      ? 'bg-slate-800/80 text-slate-400 border-slate-700/60'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {tab.badge}
                </span>
              </div>

              <div className="font-bold text-xs sm:text-sm tracking-tight truncate">
                {tab.label}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5 truncate">
                /{tab.slug}
              </div>
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="p-16 text-center text-slate-400 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-500" />
          <p className="text-xs sm:text-sm font-medium">Loading {activeSlug} configuration...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* SECTION 1: Page Header & Hero Section Configuration */}
          <div
            className={`rounded-2xl border p-5 sm:p-7 space-y-6 ${
              isDark
                ? 'bg-[#0B101D] border-slate-800/80 shadow-xl'
                : 'bg-white border-slate-200/90 shadow-sm'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-slate-200/70 dark:border-slate-800/70">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    Full-Screen Hero Section (Picture Covering Whole Screen)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Controls background photo and optional text aligned in the bottom-left corner over the picture.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Page Active</span>
                </label>
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Template</span>
                </button>
              </div>
            </div>


            {/* Hero Image, Page Name, and Optional Hero Badge in a balanced 3-column row */}
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* 1. Hero Background Image */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>Hero Background Image (URL or Upload)</span>
                    <span className="text-[10px] text-slate-400 font-normal">Covers full screen</span>
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.heroImage}
                      onChange={(e) => setFormData((prev) => ({ ...prev, heroImage: e.target.value }))}
                      placeholder="https://images.unsplash.com/..."
                      className={`flex-1 min-w-0 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                        isDark
                          ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
                          : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                      }`}
                    />

                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-colors flex items-center gap-1.5 shrink-0 disabled:opacity-50 cursor-pointer"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Photo</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* 2. Page Name (Title) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>Page Name (Title)</span>
                    <span className="text-[10px] text-slate-400 font-normal">Primary title</span>
                  </label>
                  <MinimalRichTextEditor
                    value={formData.title}
                    onChange={(val) => setFormData((prev) => ({ ...prev, title: val }))}
                    placeholder="e.g. Terms and Conditions"
                    variant="inline"
                  />
                </div>

                {/* 3. Optional Hero Badge */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>Optional Hero Badge</span>
                    <span className="text-[10px] text-slate-400 font-normal">Optional tag</span>
                  </label>
                  <MinimalRichTextEditor
                    value={formData.heroBadge || ''}
                    onChange={(val) => setFormData((prev) => ({ ...prev, heroBadge: val }))}
                    placeholder="e.g. Legal Agreement"
                    variant="inline"
                  />
                </div>
              </div>

              {/* Presets Row placed cleanly underneath */}
              {HERO_IMAGE_PRESETS[activeSlug] && (
                <div className="flex items-center gap-2 pt-0.5 overflow-x-auto">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                    Presets:
                  </span>
                  <div className="flex items-center gap-2">
                    {HERO_IMAGE_PRESETS[activeSlug].map((imgUrl, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, heroImage: imgUrl }))}
                        className={`relative w-12 h-7 rounded-lg overflow-hidden border shrink-0 hover:scale-105 transition-all cursor-pointer ${
                          formData.heroImage === imgUrl ? 'ring-2 ring-indigo-500 border-white' : 'border-slate-700'
                        }`}
                      >
                        <Image src={imgUrl} alt="Preset" fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Optional Overlay Text Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Optional Hero Headline (Bottom-Left)</span>
                  <span className="text-[10px] text-slate-400 font-normal">Leave blank if no text wanted</span>
                </label>
                <MinimalRichTextEditor
                  value={formData.heroTitle || ''}
                  onChange={(val) => setFormData((prev) => ({ ...prev, heroTitle: val }))}
                  placeholder="e.g. Terms Of Use"
                  variant="inline"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Optional Hero Subheadline (Bottom-Left)</span>
                  <span className="text-[10px] text-slate-400 font-normal">Leave blank if none</span>
                </label>
                <MinimalRichTextEditor
                  value={formData.heroSubtitle || ''}
                  onChange={(val) => setFormData((prev) => ({ ...prev, heroSubtitle: val }))}
                  placeholder="e.g. Clear, transparent guidelines for Mighty Warner solutions"
                  variant="inline"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Rich Text Content Editor (TipTap / CKEditor-like features) */}
          <div
            className={`rounded-2xl border p-5 sm:p-7 space-y-4 ${
              isDark
                ? 'bg-[#0B101D] border-slate-800/80 shadow-xl'
                : 'bg-white border-slate-200/90 shadow-sm'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4 border-slate-200/70 dark:border-slate-800/70">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Type className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    Page Body Content (Rich Text Editor)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Full text manipulation tools: headings (H1-H4), bold, italic, underline, strikethrough, colors, alignment, lists, links, tables, and dividers.
                  </p>
                </div>
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                Matches screenshot layout &amp; dark theme
              </div>
            </div>

            {/* The Editor */}
            <TipTapEditor
              content={formData.content}
              onChange={(newHtml) => setFormData((prev) => ({ ...prev, content: newHtml }))}
              isDark={isDark}
            />
          </div>

          {/* SECTION 3: SEO & Metadata */}
          <div
            className={`rounded-2xl border p-5 sm:p-7 space-y-4 ${
              isDark
                ? 'bg-[#0B101D] border-slate-800/80 shadow-xl'
                : 'bg-white border-slate-200/90 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-2.5 border-b pb-4 border-slate-200/70 dark:border-slate-800/70">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Search Engine Optimization (SEO) &amp; OpenGraph
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Custom meta title and description for search engines and social link previews.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={formData.metaTitle || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, metaTitle: e.target.value }))}
                  placeholder={`${formData.title} | Mighty Warner`}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                    isDark
                      ? 'bg-slate-900 border-slate-700 text-white'
                      : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Meta Description
                </label>
                <textarea
                  rows={2}
                  value={formData.metaDescription || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, metaDescription: e.target.value }))}
                  placeholder="Enter a descriptive summary for search snippets..."
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none ${
                    isDark
                      ? 'bg-slate-900 border-slate-700 text-white'
                      : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Bottom Save Action Bar */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-slate-500">
              Editing: <span className="font-mono text-indigo-400 font-bold">/{activeSlug}</span>
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-indigo-600 via-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save &amp; Publish {formData.title}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
