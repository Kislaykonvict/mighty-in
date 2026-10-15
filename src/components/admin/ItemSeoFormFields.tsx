'use client';

import React, { useState } from 'react';
import { Sparkles, Code2, Globe, Eye, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';

export interface ItemSeoFieldsState {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  canonicalUrl: string;
  headCode: string;
}

interface ItemSeoFormFieldsProps {
  values: ItemSeoFieldsState;
  onChange: (field: keyof ItemSeoFieldsState, value: string) => void;
  entityName?: string;
  defaultSlug?: string;
  baseUrl?: string;
}

/**
 * Premium SEO & Meta Tags Editor Component for Entity Edit Modals
 * Features:
 * - Real-time Google SERP Snippet Preview
 * - Dynamic character counters with color-coded guidelines
 * - Canonical URL helper with live preview
 * - Custom script, tracking pixel & JSON-LD schema injection area
 */
export function ItemSeoFormFields({
  values,
  onChange,
  entityName = 'Item',
  defaultSlug = '',
  baseUrl = 'https://mightywarner.com',
}: ItemSeoFormFieldsProps) {
  const [activePreview, setActivePreview] = useState<'desktop' | 'mobile'>('desktop');

  const titleLength = values.metaTitle?.length || 0;
  const descLength = values.metaDescription?.length || 0;

  // SERP preview computed values
  const previewTitle = values.metaTitle.trim() || `${entityName} | Mighty Warner`;
  const previewDescription =
    values.metaDescription.trim() ||
    'Discover transformative solutions, verified industry case studies, and enterprise-grade execution with Mighty Warner.';
  const previewUrl =
    values.canonicalUrl.trim() ||
    (defaultSlug ? `${baseUrl}/${defaultSlug}` : `${baseUrl}`);

  return (
    <div className="space-y-6 text-slate-200">
      {/* 1. Live Google Search Result Preview */}
      <div className="rounded-2xl bg-gradient-to-br from-[#0c1222] to-[#080d18] border border-cyan-500/20 p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Eye className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white tracking-wide uppercase font-mono">
                Live Google SERP Preview
              </h4>
              <p className="text-[11px] text-slate-400">
                How this will appear on search engine result pages
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-[#050811] p-1 rounded-lg border border-white/8 text-[11px]">
            <button
              type="button"
              onClick={() => setActivePreview('desktop')}
              className={`px-2.5 py-1 rounded-md transition-all font-mono ${
                activePreview === 'desktop'
                  ? 'bg-cyan-500/20 text-cyan-300 font-medium'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Desktop
            </button>
            <button
              type="button"
              onClick={() => setActivePreview('mobile')}
              className={`px-2.5 py-1 rounded-md transition-all font-mono ${
                activePreview === 'mobile'
                  ? 'bg-cyan-500/20 text-cyan-300 font-medium'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Mobile
            </button>
          </div>
        </div>

        {/* Snippet Card */}
        <div
          className={`rounded-xl bg-[#141d2e] border border-white/10 p-4 transition-all ${
            activePreview === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'
          }`}
        >
          <div className="flex items-center gap-2 mb-1.5 text-xs text-slate-400 truncate">
            <span className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[9px] text-cyan-400 font-bold">
              M
            </span>
            <span className="text-slate-300 font-medium truncate">Mighty Warner</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400 font-mono text-[11px] truncate">
              {previewUrl}
            </span>
          </div>

          <h5 className="text-base text-[#8ab4f8] font-medium hover:underline cursor-pointer truncate mb-1">
            {previewTitle}
          </h5>

          <p className="text-xs text-[#bdc1c6] line-clamp-2 leading-relaxed">
            {previewDescription}
          </p>
        </div>
      </div>

      {/* 2. Meta Title Input */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <span>Meta Title</span>
            <span className="text-slate-500 font-normal">(Page headline in browser tab & Google)</span>
          </label>
          <span
            className={`text-[11px] font-mono px-2 py-0.5 rounded ${
              titleLength >= 50 && titleLength <= 60
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : titleLength > 60
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'bg-white/5 text-slate-400'
            }`}
          >
            {titleLength}/60 chars (Recommended: 50–60)
          </span>
        </div>
        <input
          type="text"
          value={values.metaTitle}
          onChange={(e) => onChange('metaTitle', e.target.value)}
          placeholder={`e.g. ${entityName} | Case Study & Digital Transformation`}
          className="w-full px-4 py-2.5 rounded-xl bg-[#070B14] border border-white/10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
        />
      </div>

      {/* 3. Meta Description Input */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <span>Meta Description</span>
            <span className="text-slate-500 font-normal">(Search snippet summary)</span>
          </label>
          <span
            className={`text-[11px] font-mono px-2 py-0.5 rounded ${
              descLength >= 120 && descLength <= 160
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : descLength > 160
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'bg-white/5 text-slate-400'
            }`}
          >
            {descLength}/160 chars (Recommended: 120–160)
          </span>
        </div>
        <textarea
          rows={3}
          value={values.metaDescription}
          onChange={(e) => onChange('metaDescription', e.target.value)}
          placeholder={`Explore details and deliverables for ${entityName}. Discover outcomes, core capabilities, and strategic metrics.`}
          className="w-full px-4 py-2.5 rounded-xl bg-[#070B14] border border-white/10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all leading-relaxed"
        />
      </div>

      {/* 4. Two-Column: Keywords & Canonical URL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-1.5">
            Meta Keywords <span className="text-slate-500 font-normal">(Comma-separated)</span>
          </label>
          <input
            type="text"
            value={values.metaKeywords}
            onChange={(e) => onChange('metaKeywords', e.target.value)}
            placeholder="e.g. Fintech, Enterprise Cloud, Digital Strategy"
            className="w-full px-4 py-2.5 rounded-xl bg-[#070B14] border border-white/10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-1.5">
            Canonical URL <span className="text-slate-500 font-normal">(Optional override)</span>
          </label>
          <input
            type="text"
            value={values.canonicalUrl}
            onChange={(e) => onChange('canonicalUrl', e.target.value)}
            placeholder={`e.g. ${baseUrl}/${defaultSlug || 'page'}`}
            className="w-full px-4 py-2.5 rounded-xl bg-[#070B14] border border-white/10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono text-xs"
          />
        </div>
      </div>

      {/* 5. Custom Header Scripts, Meta Tags & Schema (Head Code) */}
      <div className="rounded-2xl bg-[#070B14] border border-white/10 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-emerald-400" />
            <label className="text-xs font-bold text-slate-100 uppercase tracking-wider font-mono">
              Custom Header Scripts, Meta Tags & Schema (Head Code)
            </label>
          </div>
          <span className="text-[11px] font-mono text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Injected in SSR &lt;head&gt;
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Paste any custom &lt;meta&gt; tags (geo tags, robots override, verification), tracking pixels, or
          JSON-LD structured data (<code>&lt;script type=&quot;application/ld+json&quot;&gt;</code>) for this specific item.
        </p>

        <div className="relative rounded-xl overflow-hidden border border-white/10 bg-[#04060C]">
          <textarea
            rows={5}
            value={values.headCode}
            onChange={(e) => onChange('headCode', e.target.value)}
            placeholder={`<!-- Example: JSON-LD Schema or custom meta -->\n<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "Article",\n  "headline": "${previewTitle}"\n}\n</script>`}
            className="w-full p-4 font-mono text-xs text-emerald-300 placeholder:text-slate-700 bg-transparent focus:outline-none leading-relaxed"
          />
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>All tags and scripts placed here are securely sanitized and injected into the page HTML.</span>
        </div>
      </div>
    </div>
  );
}
