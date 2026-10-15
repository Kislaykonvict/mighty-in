'use client';

import React, { useState } from 'react';
import { Save, CheckCircle2, AlertCircle, Sparkles, Code2, Globe, HelpCircle } from 'lucide-react';

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
    <div className="rounded-2xl bg-[#0B111E] border border-white/10 shadow-2xl overflow-hidden font-sans text-slate-200">
      {/* Top Banner / Breadcrumb */}
      <div className="bg-[#0F172A] px-6 py-4 border-b border-white/8 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Globe className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
            PAGE ROUTE: <span className="text-sky-400 font-mono">{formData.path}</span>
          </span>
        </div>
        {formData.pageName && (
          <span className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-400 font-medium">
            {formData.pageName}
          </span>
        )}
      </div>

      <div className="p-6 sm:p-8 space-y-7">
        {/* Section 1: Core SEO */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold font-mono tracking-wider text-slate-100 uppercase flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span>SEARCH ENGINE OPTIMIZATION (SEO)</span>
            </h3>
            <span className="text-xs text-slate-400">Google & Search Engines</span>
          </div>

          <div className="space-y-5">
            {/* Meta Title */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Meta Title (Page Title)
                </label>
                <span
                  className={`text-[11px] font-mono ${
                    titleLength > 60 ? 'text-amber-400' : 'text-slate-400'
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
                className="w-full px-4 py-2.5 rounded-xl bg-[#070B14] border border-white/10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
              />
            </div>

            {/* Meta Description */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Meta Description
                </label>
                <span
                  className={`text-[11px] font-mono ${
                    descLength > 160 ? 'text-amber-400' : 'text-slate-400'
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
                className="w-full px-4 py-2.5 rounded-xl bg-[#070B14] border border-white/10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all leading-relaxed"
              />
            </div>

            {/* Meta Keywords */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Meta Keywords (Comma separated)
              </label>
              <input
                type="text"
                value={formData.metaKeywords}
                onChange={(e) => handleChange('metaKeywords', e.target.value)}
                placeholder="strategy, enterprise growth, custom software, engineering pods"
                className="w-full px-4 py-2.5 rounded-xl bg-[#070B14] border border-white/10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
              />
            </div>

            {/* Canonical URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Canonical URL (Optional)
              </label>
              <input
                type="url"
                value={formData.canonicalUrl}
                onChange={(e) => handleChange('canonicalUrl', e.target.value)}
                placeholder="https://mightywarner.com/insights/example-slug"
                className="w-full px-4 py-2.5 rounded-xl bg-[#070B14] border border-white/10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all font-mono text-xs"
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/8 pt-6">
          {/* Section 2: Custom Header Scripts, Meta Tags & Schema (Head Code) */}
          <div className="mb-2">
            <h3 className="text-sm font-bold font-mono tracking-wider text-slate-100 uppercase flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span>CUSTOM HEADER SCRIPTS, META TAGS & SCHEMA (HEAD CODE)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Paste any custom <code className="text-slate-300">&lt;meta&gt;</code> tags (verification, geo tags), tracking scripts (GTM, Meta Pixel), or <code className="text-slate-300">&lt;script type=&quot;application/ld+json&quot;&gt;</code> schema for this {entityLabel}.
            </p>
          </div>

          <div className="mt-3">
            <textarea
              rows={8}
              value={formData.headCode}
              onChange={(e) => handleChange('headCode', e.target.value)}
              placeholder={`<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "Article",\n  "mainEntityOfPage": {\n    "@type": "WebPage",\n    "@id": "https://mightywarner.com/..."\n  }\n}\n</script>`}
              className="w-full p-4 rounded-xl bg-[#05080F] border border-white/10 font-mono text-xs text-emerald-300 placeholder:text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all leading-relaxed"
            />
            <p className="text-[11px] text-slate-400 italic mt-1.5 flex items-center gap-1.5">
              <span>* All tags and scripts placed here will be injected directly into the &lt;head&gt; section when viewing this {entityLabel}.</span>
            </p>
          </div>
        </div>

        {/* Bottom Actions & Status */}
        <div className="pt-4 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs">
            {saveStatus === 'success' && (
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium animate-fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>SEO settings saved and page revalidated!</span>
              </span>
            )}
            {saveStatus === 'error' && (
              <span className="flex items-center gap-1.5 text-rose-400 font-medium animate-fade-in">
                <AlertCircle className="w-4 h-4" />
                <span>{errorMessage || 'Failed to save changes'}</span>
              </span>
            )}
            {saveStatus === 'idle' && (
              <span className="text-slate-400 text-xs">
                Changes take effect instantly on live URLs.
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={isSaving}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-lg hover:shadow-sky-500/25 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save SEO Settings'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
