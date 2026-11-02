'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MousePointerClick,
  Sparkles,
  Save,
  RotateCcw,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Type,
  Link2,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  Sliders,
  Check,
} from 'lucide-react';
import { useAdminTheme } from './AdminThemeContext';
import { FinalCtaData, defaultFinalCtaData } from '@/types/finalCta';
import { MinimalRichTextEditor } from './MinimalRichTextEditor';
import { RichTextContent } from '@/components/ui/RichTextContent';

export function FinalCtaManagementView() {
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState<FinalCtaData>(defaultFinalCtaData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showLivePreview, setShowLivePreview] = useState(true);

  // Fetch current data on load
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/admin/final-cta');
        const json = await res.json();
        if (json.success && json.data) {
          setFormData(json.data);
        }
      } catch (err: any) {
        console.error('Failed to load Conversion CTA config:', err);
        setFeedback({
          type: 'error',
          message: 'Failed to load existing configuration. Default settings loaded.',
        });
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
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/admin/final-cta', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const json = await res.json();

      if (json.success) {
        setFeedback({
          type: 'success',
          message: 'Conversion CTA saved & published to live storefront!',
        });
      } else {
        throw new Error(json.error || 'Failed to save Conversion CTA');
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'Error saving Conversion CTA settings.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to default presets
  const handleReset = () => {
    if (confirm('Are you sure you want to reset the Conversion CTA section back to default settings?')) {
      setFormData(defaultFinalCtaData);
      setFeedback({
        type: 'success',
        message: 'Reset back to default template. Click Save Changes to publish.',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
        <p className="text-sm text-slate-400">Loading Conversion CTA configurations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      {/* Sticky Top Header Container: Action Bar + Toast Message */}
      <div className="sticky top-[76px] z-20 space-y-3 pb-2 -mt-2 pt-2 bg-[#EEF2F6]/95 dark:bg-[#070B14]/95 backdrop-blur-md transition-colors">
        {/* Top Feedback Banner with 4s auto-dismiss */}
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
            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-inherit"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Top Header Command Card */}
        <div
          className={`backdrop-blur-xl p-4 sm:p-5 rounded-2xl border shadow-lg transition-all ${
            isDark
              ? 'bg-[#0F172A]/95 border-slate-800 shadow-black/40'
              : 'bg-white/95 border-slate-200 shadow-slate-200/50'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
                <MousePointerClick className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-bold tracking-tight">Conversion CTA Section</h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                    Live Engine
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                      formData.isActive
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                    }`}
                  >
                    {formData.isActive ? 'Active on Storefront' : 'Hidden'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure the high-converting final action prompt, headline copy, rich text persuasion, and CTA buttons
                </p>
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-2">
              {/* Section Visibility Toggle */}
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, isActive: !prev.isActive }))}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                  formData.isActive
                    ? isDark
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                      : 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    : isDark
                    ? 'border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700'
                    : 'border-slate-300 bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                title={formData.isActive ? 'Click to hide from storefront' : 'Click to display on storefront'}
              >
                {formData.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{formData.isActive ? 'Visible' : 'Hidden'}</span>
              </button>

              {/* Toggle Live Preview */}
              <button
                type="button"
                onClick={() => setShowLivePreview((prev) => !prev)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                  showLivePreview
                    ? isDark
                      ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400'
                      : 'border-indigo-300 bg-indigo-50 text-indigo-700'
                    : isDark
                    ? 'border-slate-700 bg-slate-800/80 text-slate-400'
                    : 'border-slate-300 bg-slate-100 text-slate-600'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{showLivePreview ? 'Hide Preview' : 'Show Preview'}</span>
              </button>

              {/* Reset Button */}
              <button
                type="button"
                onClick={handleReset}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                  isDark
                    ? 'border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700'
                    : 'border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              {/* View Live Storefront */}
              <Link
                href="/#contact"
                target="_blank"
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                  isDark
                    ? 'border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700'
                    : 'border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Live</span>
              </Link>

              {/* Save Button */}
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 disabled:opacity-50 transition-all shadow-md shadow-rose-600/30 flex items-center gap-1.5 cursor-pointer"
              >
                {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>{isSaving ? 'Publishing...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Real-Time Visual Preview Card */}
      {showLivePreview && (
        <div
          className={`rounded-2xl border p-5 sm:p-8 relative overflow-hidden transition-all shadow-lg ${
            isDark
              ? 'bg-[#05080E] border-slate-800'
              : 'bg-[#DBDBDB] border-neutral-300'
          }`}
        >
          {/* Top Label */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-slate-500 dark:text-slate-400">
                Interactive Storefront Simulation
              </span>
            </div>
            {!formData.isActive && (
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                Section Currently Inactive (Hidden on Live Site)
              </span>
            )}
          </div>

          {/* Ambient Glow Simulation */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full bg-rose-500/10 dark:bg-gradient-to-r dark:from-orange-500/10 dark:via-blue-500/10 dark:to-emerald-500/10 blur-[90px] pointer-events-none" />

          <div className="max-w-3xl mx-auto text-center relative z-10 py-6 sm:py-10">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-300 text-xs font-mono text-rose-700 dark:bg-white/5 dark:border-white/10 dark:text-slate-300 uppercase tracking-widest mb-6 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <RichTextContent content={formData.badge} inline />
            </div>

            {/* Headline */}
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
              <RichTextContent content={formData.title} inline />
            </h2>

            {/* Subtitle / Paragraphs */}
            <div className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-8 space-y-2 [&>p]:mb-2 [&_strong]:text-slate-900 dark:[&_strong]:text-white [&_strong]:font-bold">
              <RichTextContent content={formData.subtitle} />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {formData.primaryCtaText && (
                <div className="px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-rose-600 shadow-md shadow-rose-600/20 inline-flex items-center gap-2">
                  <span>{formData.primaryCtaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}

              {formData.showSecondaryCta && formData.secondaryCtaText && (
                <div className="px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-800 dark:text-white bg-white/60 dark:bg-white/10 border border-slate-300 dark:border-white/20 inline-flex items-center gap-2 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-rose-600 dark:text-sky-400" />
                  <span>{formData.secondaryCtaText}</span>
                </div>
              )}
            </div>

            {/* Guarantee Microcopy */}
            {formData.guaranteeNote && (
              <div className="mt-8 text-[11px] font-mono text-slate-500">
                <RichTextContent content={formData.guaranteeNote} inline />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content Form Editor */}
      <div className="grid grid-cols-1 gap-6">
        {/* Section 1: Core Copy & Typography (Rich Text) */}
        <div
          className={`p-5 sm:p-6 rounded-2xl border transition-all ${
            isDark ? 'bg-[#0F172A]/90 border-slate-800 shadow-sm' : 'bg-white border-slate-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-slate-200 dark:border-slate-800">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-xs border border-indigo-500/20">
              <Type className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Core Copy & Persuasion (Rich Text Enabled)
              </h2>
              <p className="text-xs text-slate-400">
                Format text with bold punchlines, curated brand highlights, custom colors, and formatted paragraphs
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Eyebrow Badge */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Eyebrow Pill Badge (Upper Tagline)
              </label>
              <MinimalRichTextEditor
                value={formData.badge}
                onChange={(val) => setFormData((prev) => ({ ...prev, badge: val }))}
                placeholder="YOUR GROWTH ACCELERATOR"
                variant="inline"
                isDark={isDark}
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Rendered at the top inside a floating pill badge accompanied by the signature pulsating green status dot.
              </p>
            </div>

            {/* Main Headline */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Main Headline (Display H1)
              </label>
              <MinimalRichTextEditor
                value={formData.title}
                onChange={(val) => setFormData((prev) => ({ ...prev, title: val }))}
                placeholder="What’s next for your business?"
                variant="inline"
                isDark={isDark}
              />
              <p className="text-[11px] text-slate-400 mt-1">
                The primary high-impact headline. Supports rich text color presets, underlines, and links.
              </p>
            </div>

            {/* Subtitle / Paragraphs */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Narrative & Persuasive Copy (Paragraphs & Punchline)
              </label>
              <MinimalRichTextEditor
                value={formData.subtitle}
                onChange={(val) => setFormData((prev) => ({ ...prev, subtitle: val }))}
                placeholder="Enter compelling conversion copy..."
                variant="multiline"
                minHeight="140px"
                isDark={isDark}
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Press Enter to create new paragraphs. Use bold or colors to emphasize key punchlines like{' '}
                <span className="font-mono text-indigo-400">
                  &quot;Or a combination of all three. Let’s figure it out.&quot;
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Call to Action Buttons */}
        <div
          className={`p-5 sm:p-6 rounded-2xl border transition-all ${
            isDark ? 'bg-[#0F172A]/90 border-slate-800 shadow-sm' : 'bg-white border-slate-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-slate-200 dark:border-slate-800">
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-xs border border-rose-500/20">
              <Link2 className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Call to Action Triggers & Navigation
              </h2>
              <p className="text-xs text-slate-400">
                Configure primary conversation starter and optional secondary diagnostic assessment buttons
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primary Action Button */}
            <div
              className={`p-4 rounded-xl border ${
                isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Primary Action Button
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  Growth Style
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Button Label
                  </label>
                  <input
                    type="text"
                    value={formData.primaryCtaText}
                    onChange={(e) => setFormData((prev) => ({ ...prev, primaryCtaText: e.target.value }))}
                    placeholder="Start a conversation"
                    className={`w-full px-3 py-2 rounded-lg text-xs font-medium border transition-colors outline-hidden focus:ring-1 focus:ring-rose-500 ${
                      isDark
                        ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                        : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Destination Link
                  </label>
                  <input
                    type="text"
                    value={formData.primaryCtaLink}
                    onChange={(e) => setFormData((prev) => ({ ...prev, primaryCtaLink: e.target.value }))}
                    placeholder="/contact"
                    className={`w-full px-3 py-2 rounded-lg text-xs font-medium border transition-colors outline-hidden focus:ring-1 focus:ring-rose-500 ${
                      isDark
                        ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                        : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Secondary Action Button */}
            <div
              className={`p-4 rounded-xl border ${
                isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  Secondary Diagnostic Button
                </span>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showSecondaryCta}
                    onChange={(e) => setFormData((prev) => ({ ...prev, showSecondaryCta: e.target.checked }))}
                    className="w-3.5 h-3.5 rounded text-sky-600 focus:ring-0 cursor-pointer"
                  />
                  <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                    {formData.showSecondaryCta ? 'Enabled' : 'Disabled'}
                  </span>
                </label>
              </div>

              <div className={`space-y-3 transition-opacity ${formData.showSecondaryCta ? 'opacity-100' : 'opacity-40'}`}>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Button Label
                  </label>
                  <input
                    type="text"
                    disabled={!formData.showSecondaryCta}
                    value={formData.secondaryCtaText}
                    onChange={(e) => setFormData((prev) => ({ ...prev, secondaryCtaText: e.target.value }))}
                    placeholder="Take the 3-minute assessment"
                    className={`w-full px-3 py-2 rounded-lg text-xs font-medium border transition-colors outline-hidden focus:ring-1 focus:ring-sky-500 ${
                      isDark
                        ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                        : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Destination Link
                  </label>
                  <input
                    type="text"
                    disabled={!formData.showSecondaryCta}
                    value={formData.secondaryCtaLink}
                    onChange={(e) => setFormData((prev) => ({ ...prev, secondaryCtaLink: e.target.value }))}
                    placeholder="/assessment"
                    className={`w-full px-3 py-2 rounded-lg text-xs font-medium border transition-colors outline-hidden focus:ring-1 focus:ring-sky-500 ${
                      isDark
                        ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                        : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Trust & Assurance Microcopy */}
        <div
          className={`p-5 sm:p-6 rounded-2xl border transition-all ${
            isDark ? 'bg-[#0F172A]/90 border-slate-800 shadow-sm' : 'bg-white border-slate-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-slate-200 dark:border-slate-800">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Trust Guarantee & Friction-Reduction Microcopy
              </h2>
              <p className="text-xs text-slate-400">
                Monospace disclaimer beneath the buttons to reassure corporate enterprise prospects
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Assurance Microcopy (Rich Text)
            </label>
            <MinimalRichTextEditor
              value={formData.guaranteeNote}
              onChange={(val) => setFormData((prev) => ({ ...prev, guaranteeNote: val }))}
              placeholder="Average initial strategic consultation booked within 24 business hours • Non-disclosure agreement guaranteed"
              variant="inline"
              isDark={isDark}
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Formatted with subtle monospace font on the storefront to build credibility and ease friction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
