'use client';

import React, { useState } from 'react';
import { Save, CheckCircle2, AlertCircle, Sparkles, Code2, Globe, HelpCircle } from 'lucide-react';
import { useAdminTheme } from './AdminThemeContext';

export interface SeoData {
  path: string;
  pageName?: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  canonicalUrl: string;
  headCode: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  noIndex?: boolean;
  noFollow?: boolean;
}

interface SeoCardEditorProps {
  initialData: SeoData;
  onSave?: (savedData: SeoData) => void;
  entityLabel?: string; // e.g. "article", "case study", "page"
}

export function SeoCardEditor({
  initialData,
  onSave,
  entityLabel = 'page',
}: SeoCardEditorProps) {
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState<SeoData>({
    path: initialData.path || '/',
    pageName: initialData.pageName || '',
    metaTitle: initialData.metaTitle || '',
    metaDescription: initialData.metaDescription || '',
    metaKeywords: initialData.metaKeywords || '',
    canonicalUrl: initialData.canonicalUrl || '',
    headCode: initialData.headCode || '',
    ogTitle: initialData.ogTitle || '',
    ogDescription: initialData.ogDescription || '',
    ogImage: initialData.ogImage || '',
    noIndex: initialData.noIndex || false,
    noFollow: initialData.noFollow || false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (field: keyof SeoData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (saveStatus !== 'idle') setSaveStatus('idle');
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setSaveStatus('idle');
    setErrorMessage('');

    try {
      const res = await fetch('/api/admin/seo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to save SEO settings');
      }

      setSaveStatus('success');
      if (onSave) onSave(json.data);
      setTimeout(() => setSaveStatus('idle'), 3500);
    } catch (err: any) {
      setSaveStatus('error');
      setErrorMessage(err.message || 'Error occurred while saving');
    } finally {
      setIsSaving(false);
    }
  };

  const titleLength = formData.metaTitle.length;
  const descLength = formData.metaDescription.length;

  return (
    <div className={`rounded-2xl border shadow-xl overflow-hidden font-sans transition-colors ${
      isDark
        ? 'bg-[#0B111E] border-white/10 text-slate-200'
        : 'bg-white border-slate-200 text-slate-800 shadow-sm'
    }`}>
      {/* Top Banner / Breadcrumb */}
      <div className={`px-6 py-4 border-b flex items-center justify-between transition-colors ${
        isDark
          ? 'bg-[#0F172A] border-white/8'
          : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-2.5">
          <Globe className="w-4 h-4 text-sky-500 dark:text-sky-400" />
          <span className={`text-xs font-mono uppercase tracking-wider font-semibold ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}>
            PAGE ROUTE: <span className="text-sky-600 dark:text-sky-400 font-mono font-bold">{formData.path}</span>
          </span>
        </div>
        {formData.pageName && (
          <span className={`text-xs px-2.5 py-1 rounded-md font-medium border transition-colors ${
            isDark
              ? 'bg-white/5 border-white/10 text-slate-400'
              : 'bg-white border-slate-200 text-slate-700 shadow-xs'
          }`}>
            {formData.pageName}
          </span>
        )}
      </div>

      <div className="p-6 sm:p-8 space-y-7">
        {/* Section 1: Core SEO */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h3 className={`text-sm font-bold font-mono tracking-wider uppercase flex items-center gap-2 ${
              isDark ? 'text-slate-100' : 'text-slate-900'
            }`}>
              <Sparkles className="w-4 h-4 text-orange-500 dark:text-orange-400" />
              <span>SEARCH ENGINE OPTIMIZATION (SEO)</span>
            </h3>
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Google & Search Engines</span>
          </div>

          <div className="space-y-5">
            {/* Meta Title */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Meta Title (Page Title)
                </label>
                <span
                  className={`text-[11px] font-mono ${
                    titleLength > 60
                      ? 'text-amber-500 dark:text-amber-400 font-semibold'
                      : isDark
                      ? 'text-slate-400'
                      : 'text-slate-500'
                  }`}
                >
                  {titleLength}/60 chars recommended
                </span>
              </div>
              <input
                type="text"
                value={formData.metaTitle}
                onChange={(e) => handleChange('metaTitle', e.target.value)}
                placeholder="e.g. Dubai Rental Laws: Tenant & Landlord Rights Explained"
                className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 border ${
                  isDark
                    ? 'bg-[#070B14] border-white/10 text-white placeholder:text-slate-600'
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white'
                }`}
              />
            </div>

            {/* Meta Description */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Meta Description
                </label>
                <span
                  className={`text-[11px] font-mono ${
                    descLength > 160
                      ? 'text-amber-500 dark:text-amber-400 font-semibold'
                      : isDark
                      ? 'text-slate-400'
                      : 'text-slate-500'
                  }`}
                >
                  {descLength}/160 chars recommended
                </span>
              </div>
              <textarea
                rows={3}
                value={formData.metaDescription}
                onChange={(e) => handleChange('metaDescription', e.target.value)}
                placeholder="Understand Dubai rental laws, including tenant and landlord rights, rent increases, Ejari, deposits, maintenance, renewals, and eviction rules."
                className={`w-full px-4 py-2.5 rounded-xl text-sm leading-relaxed transition-all focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 border ${
                  isDark
                    ? 'bg-[#070B14] border-white/10 text-white placeholder:text-slate-600'
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white'
                }`}
              />
            </div>

            {/* Meta Keywords */}
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Meta Keywords (Comma separated)
              </label>
              <input
                type="text"
                value={formData.metaKeywords}
                onChange={(e) => handleChange('metaKeywords', e.target.value)}
                placeholder="strategy, enterprise growth, custom software, engineering pods"
                className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 border ${
                  isDark
                    ? 'bg-[#070B14] border-white/10 text-white placeholder:text-slate-600'
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white'
                }`}
              />
            </div>

            {/* Canonical URL */}
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Canonical URL (Optional)
              </label>
              <input
                type="url"
                value={formData.canonicalUrl}
                onChange={(e) => handleChange('canonicalUrl', e.target.value)}
                placeholder="https://mightywarner.com/insights/example-slug"
                className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 font-mono text-xs border ${
                  isDark
                    ? 'bg-[#070B14] border-white/10 text-white placeholder:text-slate-600'
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className={`border-t pt-6 transition-colors ${isDark ? 'border-white/8' : 'border-slate-200'}`}>
          {/* Section 2: Custom Header Scripts, Meta Tags & Schema (Head Code) */}
          <div className="mb-2">
            <h3 className={`text-sm font-bold font-mono tracking-wider uppercase flex items-center gap-2 ${
              isDark ? 'text-slate-100' : 'text-slate-900'
            }`}>
              <Code2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              <span>CUSTOM HEADER SCRIPTS, META TAGS & SCHEMA (HEAD CODE)</span>
            </h3>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Paste any custom <code className={`px-1.5 py-0.5 rounded font-mono text-[11px] ${
                isDark ? 'bg-white/5 text-slate-300' : 'bg-slate-100 text-slate-800 border border-slate-200'
              }`}>&lt;meta&gt;</code> tags (verification, geo tags), tracking scripts (GTM, Meta Pixel), or <code className={`px-1.5 py-0.5 rounded font-mono text-[11px] ${
                isDark ? 'bg-white/5 text-slate-300' : 'bg-slate-100 text-slate-800 border border-slate-200'
              }`}>&lt;script type=&quot;application/ld+json&quot;&gt;</code> schema for this {entityLabel}.
            </p>
          </div>

          <div className="mt-3">
            <textarea
              rows={8}
              value={formData.headCode}
              onChange={(e) => handleChange('headCode', e.target.value)}
              placeholder={`<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "Article",\n  "mainEntityOfPage": {\n    "@type": "WebPage",\n    "@id": "https://mightywarner.com/..."\n  }\n}\n</script>`}
              className={`w-full p-4 rounded-xl font-mono text-xs text-emerald-400 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all leading-relaxed border ${
                isDark
                  ? 'bg-[#05080F] border-white/10'
                  : 'bg-[#0B1120] border-slate-700 shadow-inner'
              }`}
            />
            <p className={`text-[11px] italic mt-1.5 flex items-center gap-1.5 ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              <span>* All tags and scripts placed here will be injected directly into the &lt;head&gt; section when viewing this {entityLabel}.</span>
            </p>
          </div>
        </div>

        {/* Bottom Actions & Status */}
        <div className={`pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors ${
          isDark ? 'border-white/8' : 'border-slate-200'
        }`}>
          <div className="flex items-center gap-2 text-xs">
            {saveStatus === 'success' && (
              <span className="flex items-center gap-1.5 text-emerald-500 dark:text-emerald-400 font-medium animate-fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>SEO settings saved and page revalidated!</span>
              </span>
            )}
            {saveStatus === 'error' && (
              <span className="flex items-center gap-1.5 text-rose-500 dark:text-rose-400 font-medium animate-fade-in">
                <AlertCircle className="w-4 h-4" />
                <span>{errorMessage || 'Failed to save changes'}</span>
              </span>
            )}
            {saveStatus === 'idle' && (
              <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Changes take effect instantly on live URLs.
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={isSaving}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 dark:bg-sky-500 dark:hover:bg-sky-400 text-white text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-md shadow-sky-600/20 dark:shadow-sky-500/25 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save SEO Settings'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
