'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calculator,
  Sparkles,
  Sliders,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Users,
  DollarSign,
  Loader2,
} from 'lucide-react';
import { useAdminTheme } from '@/components/admin/AdminThemeContext';
import {
  HomeGrowthToolsSectionData,
  defaultHomeGrowthToolsSectionData,
} from '@/types/growthTools';
import { AssessmentQuestion, AssessmentOption } from '@/types/assessment';
import { HomeGrowthToolsClient } from '@/components/home/HomeGrowthToolsClient';

export default function AdminGrowthToolsPage() {
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<'section' | 'diagnostic' | 'roi' | 'preview'>('section');
  const [data, setData] = useState<HomeGrowthToolsSectionData>(defaultHomeGrowthToolsSectionData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Diagnostic Question editing state
  const [expandedQuestionIdx, setExpandedQuestionIdx] = useState<number | null>(0);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch data
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const res = await fetch('/api/admin/growth-tools');
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
        }
      } catch (err) {
        showToast('error', 'Failed to load configuration from server');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Save handler
  const handleSave = async () => {
    try {
      setIsSaving(true);
      const res = await fetch('/api/admin/growth-tools', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
        showToast('success', 'Homepage Growth Tools configuration saved successfully!');
      } else {
        showToast('error', json.error || 'Failed to save configuration');
      }
    } catch (err: any) {
      showToast('error', 'Network error while saving');
    } finally {
      setIsSaving(false);
    }
  };

  // Update Diagnostic Questions Helper
  const updateQuestion = (qIdx: number, updated: Partial<AssessmentQuestion>) => {
    setData((prev) => {
      const questions = [...(prev.diagnostic.questions || [])];
      questions[qIdx] = { ...questions[qIdx], ...updated };
      return {
        ...prev,
        diagnostic: {
          ...prev.diagnostic,
          questions,
        },
      };
    });
  };

  // Update Option in Question Helper
  const updateOption = (qIdx: number, oIdx: number, updated: Partial<AssessmentOption>) => {
    setData((prev) => {
      const questions = [...(prev.diagnostic.questions || [])];
      const options = [...(questions[qIdx]?.options || [])];
      options[oIdx] = { ...options[oIdx], ...updated };
      questions[qIdx] = { ...questions[qIdx], options };
      return {
        ...prev,
        diagnostic: {
          ...prev.diagnostic,
          questions,
        },
      };
    });
  };

  // Add Question
  const addQuestion = () => {
    setData((prev) => {
      const questions = [...(prev.diagnostic.questions || [])];
      const newQ: AssessmentQuestion = {
        id: `custom-q-${Date.now()}`,
        number: questions.length + 1,
        question: 'New Diagnostic Question',
        subtext: 'Select the option that best describes your current state.',
        category: 'challenge',
        options: [
          {
            id: `opt-1-${Date.now()}`,
            label: 'Initial stage / Developing baseline',
            description: 'We are currently planning or building foundations.',
            scoreWeight: 5,
            categoryFocus: 'growth',
            capabilityKey: 'brand_strategy',
          },
          {
            id: `opt-2-${Date.now()}`,
            label: 'Advanced stage / Scaling rapidly',
            description: 'Established systems in place, optimizing for efficiency.',
            scoreWeight: 15,
            categoryFocus: 'growth',
            capabilityKey: 'brand_strategy',
          },
        ],
      };
      return {
        ...prev,
        diagnostic: {
          ...prev.diagnostic,
          questions: [...questions, newQ],
        },
      };
    });
    setExpandedQuestionIdx((data.diagnostic.questions || []).length);
  };

  // Remove Question
  const removeQuestion = (qIdx: number) => {
    setData((prev) => {
      const questions = [...(prev.diagnostic.questions || [])];
      questions.splice(qIdx, 1);
      return {
        ...prev,
        diagnostic: {
          ...prev.diagnostic,
          questions,
        },
      };
    });
    setExpandedQuestionIdx(null);
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-rose-500 mx-auto" />
        <p className="text-sm text-slate-400">Loading Growth Tools Configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-sm font-medium transition-all animate-in slide-in-from-bottom-3 ${
            toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border transition-colors ${
          isDark ? 'bg-[#0F1626]/80 border-white/8 text-white' : 'bg-white border-slate-200 text-slate-900'
        } shadow-sm`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <Calculator className="w-3.5 h-3.5" />
              <span>Homepage Interactive Growth Suite</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Growth Diagnostic &amp; ROI Calculator
            </h1>
            <p className={`text-sm max-w-2xl leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Manage the two interactive tools mounted on the Homepage below the FAQs section. Control diagnostic questions, scoring algorithms, and ROI revenue impact parameters.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/#growth-tools"
              target="_blank"
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                isDark
                  ? 'border-white/10 hover:bg-white/5 text-slate-300'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View on Homepage</span>
            </Link>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save &amp; Publish</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 pt-6 mt-6 border-t border-slate-200 dark:border-white/8 overflow-x-auto pb-1">
          {[
            { id: 'section', label: '1. Section Header & Layout', icon: Sliders },
            { id: 'diagnostic', label: '2. Growth Diagnostic Wizard', icon: Sparkles },
            { id: 'roi', label: '3. Revenue ROI Calculator', icon: Calculator },
            { id: 'preview', label: '4. Live Interactive Preview', icon: Eye },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-sm'
                    : isDark
                    ? 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: SECTION HEADER & LAYOUT */}
      {activeTab === 'section' && (
        <div
          className={`p-6 sm:p-8 rounded-3xl border ${
            isDark ? 'bg-[#0B101D] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
          } shadow-sm space-y-6`}
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/8">
            <div>
              <h2 className="text-lg font-bold">Homepage Section Copy &amp; Switcher Settings</h2>
              <p className="text-xs text-slate-400">Controls the headline, introductory text, and tabs on the homepage.</p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold uppercase text-slate-400">Section Enabled</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.isActive}
                  onChange={(e) => setData((p) => ({ ...p, isActive: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-600" />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Eyebrow Badge
              </label>
              <input
                type="text"
                value={data.badge}
                onChange={(e) => setData((p) => ({ ...p, badge: e.target.value }))}
                placeholder="INTERACTIVE ENTERPRISE GROWTH SUITE"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm font-mono focus:outline-none focus:ring-1 focus:ring-rose-500 ${
                  isDark ? 'bg-[#0F1626] border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Headline Title
              </label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => setData((p) => ({ ...p, title: e.target.value }))}
                placeholder="Evaluate Commercial Readiness or"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 ${
                  isDark ? 'bg-[#0F1626] border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Highlighted Title (Gradient Accent)
              </label>
              <input
                type="text"
                value={data.highlightedTitle}
                onChange={(e) => setData((p) => ({ ...p, highlightedTitle: e.target.value }))}
                placeholder="Forecast Your ROI."
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 ${
                  isDark ? 'bg-[#0F1626] border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Supporting Description Paragraph
              </label>
              <textarea
                rows={3}
                value={data.description}
                onChange={(e) => setData((p) => ({ ...p, description: e.target.value }))}
                placeholder="Explain the benefits of running the diagnostic or calculating ROI..."
                className={`w-full px-4 py-2.5 rounded-xl border text-sm leading-relaxed focus:outline-none focus:ring-1 focus:ring-rose-500 ${
                  isDark ? 'bg-[#0F1626] border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Diagnostic Tab Button Label
              </label>
              <input
                type="text"
                value={data.diagnosticTabLabel}
                onChange={(e) => setData((p) => ({ ...p, diagnosticTabLabel: e.target.value }))}
                placeholder="Growth Diagnostic"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 ${
                  isDark ? 'bg-[#0F1626] border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                ROI Calculator Tab Button Label
              </label>
              <input
                type="text"
                value={data.roiTabLabel}
                onChange={(e) => setData((p) => ({ ...p, roiTabLabel: e.target.value }))}
                placeholder="Revenue ROI Calculator"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 ${
                  isDark ? 'bg-[#0F1626] border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Default Selected Tab on Page Load
              </label>
              <select
                value={data.defaultActiveTab || 'diagnostic'}
                onChange={(e) => setData((p) => ({ ...p, defaultActiveTab: e.target.value as any }))}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 ${
                  isDark ? 'bg-[#0F1626] border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                <option value="diagnostic">Growth Diagnostic</option>
                <option value="roi">Revenue ROI Calculator</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GROWTH DIAGNOSTIC */}
      {activeTab === 'diagnostic' && (
        <div
          className={`p-6 sm:p-8 rounded-3xl border ${
            isDark ? 'bg-[#0B101D] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
          } shadow-sm space-y-8`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/8">
            <div>
              <h2 className="text-lg font-bold">Growth Diagnostic Questions &amp; Logic</h2>
              <p className="text-xs text-slate-400">
                Manage the diagnostic questions, response options, pillar weightings, and score feedback.
              </p>
            </div>

            <button
              type="button"
              onClick={addQuestion}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-colors cursor-pointer self-start sm:self-center"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Question</span>
            </button>
          </div>

          {/* Diagnostic Questions List */}
          <div className="space-y-4">
            {(data.diagnostic.questions || []).map((q, qIdx) => {
              const isExpanded = expandedQuestionIdx === qIdx;
              return (
                <div
                  key={q.id || qIdx}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isExpanded
                      ? isDark
                        ? 'bg-[#0F1626] border-rose-500/40 shadow-md ring-1 ring-rose-500/10'
                        : 'bg-white border-rose-300 shadow-md ring-1 ring-rose-500/10'
                      : isDark
                      ? 'bg-white/[0.02] border-white/8 hover:border-white/15'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Collapsible Header */}
                  <div
                    onClick={() => setExpandedQuestionIdx(isExpanded ? null : qIdx)}
                    className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                        {qIdx + 1}
                      </span>
                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white">{q.question}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Category: <span className="uppercase font-mono">{q.category}</span> • {q.options.length}{' '}
                          Options
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeQuestion(qIdx);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete Question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="text-slate-400">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Body */}
                  {isExpanded && (
                    <div className="p-5 sm:p-6 pt-0 border-t border-slate-200 dark:border-white/8 space-y-5 mt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                        <div className="sm:col-span-8 space-y-1">
                          <label className="text-xs font-mono font-semibold text-slate-500">Question Headline</label>
                          <input
                            type="text"
                            value={q.question}
                            onChange={(e) => updateQuestion(qIdx, { question: e.target.value })}
                            className={`w-full px-3.5 py-2 rounded-xl border text-sm ${
                              isDark ? 'bg-black/30 border-white/10 text-white' : 'bg-white border-slate-200'
                            }`}
                          />
                        </div>

                        <div className="sm:col-span-4 space-y-1">
                          <label className="text-xs font-mono font-semibold text-slate-500">Pillar Category</label>
                          <select
                            value={q.category}
                            onChange={(e) => updateQuestion(qIdx, { category: e.target.value as any })}
                            className={`w-full px-3.5 py-2 rounded-xl border text-sm ${
                              isDark ? 'bg-black/30 border-white/10 text-white' : 'bg-white border-slate-200'
                            }`}
                          >
                            <option value="growth">Digital Growth (Branding, SEO, Ads)</option>
                            <option value="technology">Technology &amp; Software Platforms</option>
                            <option value="talent">Talent Solutions &amp; Engineering Pods</option>
                          </select>
                        </div>

                        <div className="sm:col-span-12 space-y-1">
                          <label className="text-xs font-mono font-semibold text-slate-500">Supporting Subtitle</label>
                          <input
                            type="text"
                            value={q.subtext || ''}
                            onChange={(e) => updateQuestion(qIdx, { subtext: e.target.value })}
                            className={`w-full px-3.5 py-2 rounded-xl border text-sm ${
                              isDark ? 'bg-black/30 border-white/10 text-white' : 'bg-white border-slate-200'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Options */}
                      <div className="space-y-3 pt-2">
                        <div className="text-xs font-mono font-bold uppercase text-slate-500 dark:text-slate-400">
                          Options &amp; Scoring Logic ({q.options.length})
                        </div>

                        {q.options.map((opt, oIdx) => (
                          <div
                            key={opt.id || oIdx}
                            className="p-4 rounded-xl bg-slate-100/70 dark:bg-black/20 border border-slate-200 dark:border-white/5 space-y-3"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                              <div className="sm:col-span-8">
                                <label className="text-[10px] font-mono text-slate-400 uppercase">Option Label</label>
                                <input
                                  type="text"
                                  value={opt.label}
                                  onChange={(e) => updateOption(qIdx, oIdx, { label: e.target.value })}
                                  className={`w-full px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                                    isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200'
                                  }`}
                                />
                              </div>

                              <div className="sm:col-span-4">
                                <label className="text-[10px] font-mono text-slate-400 uppercase">Score (0-20)</label>
                                <input
                                  type="number"
                                  value={opt.scoreWeight}
                                  onChange={(e) => updateOption(qIdx, oIdx, { scoreWeight: Number(e.target.value) })}
                                  className={`w-full px-3 py-1.5 rounded-lg border text-xs font-mono font-bold ${
                                    isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200'
                                  }`}
                                />
                              </div>

                              <div className="sm:col-span-12">
                                <label className="text-[10px] font-mono text-slate-400 uppercase">
                                  Supporting Description
                                </label>
                                <input
                                  type="text"
                                  value={opt.description}
                                  onChange={(e) => updateOption(qIdx, oIdx, { description: e.target.value })}
                                  className={`w-full px-3 py-1.5 rounded-lg border text-xs ${
                                    isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200'
                                  }`}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: REVENUE ROI CALCULATOR */}
      {activeTab === 'roi' && (
        <div
          className={`p-6 sm:p-8 rounded-3xl border ${
            isDark ? 'bg-[#0B101D] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
          } shadow-sm space-y-6`}
        >
          <div className="pb-4 border-b border-slate-200 dark:border-white/8">
            <h2 className="text-lg font-bold">Revenue ROI Calculator Benchmarks &amp; Sliders</h2>
            <p className="text-xs text-slate-400">
              Configure initial baseline values, slider step bounds, and multiplier lift percentages.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* 1. Traffic Multiplier */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/8 space-y-2">
              <label className="text-xs font-mono font-bold uppercase text-sky-600 dark:text-sky-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>Projected Traffic Lift (%)</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={data.roi.trafficLiftPercent}
                  onChange={(e) =>
                    setData((p) => ({
                      ...p,
                      roi: { ...p.roi, trafficLiftPercent: Number(e.target.value) },
                    }))
                  }
                  className={`w-full px-3 py-2 rounded-xl border text-sm font-mono font-bold ${
                    isDark ? 'bg-[#0F1626] border-white/10 text-white' : 'bg-white border-slate-200'
                  }`}
                />
                <span className="text-xs font-mono text-slate-400">%</span>
              </div>
              <p className="text-[11px] text-slate-400">Default: 40 (represents +40% visitor expansion).</p>
            </div>

            {/* 2. CRO Multiplier */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/8 space-y-2">
              <label className="text-xs font-mono font-bold uppercase text-orange-600 dark:text-orange-400 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Projected CRO Lift (%)</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={data.roi.croLiftPercent}
                  onChange={(e) =>
                    setData((p) => ({
                      ...p,
                      roi: { ...p.roi, croLiftPercent: Number(e.target.value) },
                    }))
                  }
                  className={`w-full px-3 py-2 rounded-xl border text-sm font-mono font-bold ${
                    isDark ? 'bg-[#0F1626] border-white/10 text-white' : 'bg-white border-slate-200'
                  }`}
                />
                <span className="text-xs font-mono text-slate-400">%</span>
              </div>
              <p className="text-[11px] text-slate-400">Default: 55 (represents +55% conversion rate lift).</p>
            </div>

            {/* 3. Default Baseline Visitors */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/8 space-y-2">
              <label className="text-xs font-mono font-bold uppercase text-slate-500">
                Default Monthly Visitors
              </label>
              <input
                type="number"
                value={data.roi.defaultVisitors}
                onChange={(e) =>
                  setData((p) => ({
                    ...p,
                    roi: { ...p.roi, defaultVisitors: Number(e.target.value) },
                  }))
                }
                className={`w-full px-3 py-2 rounded-xl border text-sm font-mono ${
                  isDark ? 'bg-[#0F1626] border-white/10 text-white' : 'bg-white border-slate-200'
                }`}
              />
              <p className="text-[11px] text-slate-400">Starting baseline visitor count slider position.</p>
            </div>

            {/* 4. Default Conversion Rate */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/8 space-y-2">
              <label className="text-xs font-mono font-bold uppercase text-slate-500">
                Default Conversion Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={data.roi.defaultConversionRate}
                onChange={(e) =>
                  setData((p) => ({
                    ...p,
                    roi: { ...p.roi, defaultConversionRate: Number(e.target.value) },
                  }))
                }
                className={`w-full px-3 py-2 rounded-xl border text-sm font-mono ${
                  isDark ? 'bg-[#0F1626] border-white/10 text-white' : 'bg-white border-slate-200'
                }`}
              />
              <p className="text-[11px] text-slate-400">Starting baseline conversion rate slider position.</p>
            </div>

            {/* 5. Default Deal Size */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/8 space-y-2">
              <label className="text-xs font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5" />
                <span>Default Deal Size / LTV ($)</span>
              </label>
              <input
                type="number"
                value={data.roi.defaultDealSize}
                onChange={(e) =>
                  setData((p) => ({
                    ...p,
                    roi: { ...p.roi, defaultDealSize: Number(e.target.value) },
                  }))
                }
                className={`w-full px-3 py-2 rounded-xl border text-sm font-mono ${
                  isDark ? 'bg-[#0F1626] border-white/10 text-white' : 'bg-white border-slate-200'
                }`}
              />
              <p className="text-[11px] text-slate-400">Starting average transaction or annual contract value.</p>
            </div>

            {/* 6. CTA Button Text & Destination */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/8 space-y-2">
              <label className="text-xs font-mono font-bold uppercase text-slate-500">
                Calculator CTA Button Label
              </label>
              <input
                type="text"
                value={data.roi.ctaText}
                onChange={(e) =>
                  setData((p) => ({
                    ...p,
                    roi: { ...p.roi, ctaText: e.target.value },
                  }))
                }
                className={`w-full px-3 py-2 rounded-xl border text-sm font-bold ${
                  isDark ? 'bg-[#0F1626] border-white/10 text-white' : 'bg-white border-slate-200'
                }`}
              />
              <p className="text-[11px] text-slate-400">Destination link: {data.roi.ctaLink || '/contact'}</p>
            </div>

            {/* 7. Disclaimer */}
            <div className="sm:col-span-2 lg:col-span-3 p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/8 space-y-2">
              <label className="text-xs font-mono font-bold uppercase text-slate-500">
                Methodology &amp; Disclaimer Note
              </label>
              <input
                type="text"
                value={data.roi.disclaimer}
                onChange={(e) =>
                  setData((p) => ({
                    ...p,
                    roi: { ...p.roi, disclaimer: e.target.value },
                  }))
                }
                className={`w-full px-3 py-2 rounded-xl border text-xs ${
                  isDark ? 'bg-[#0F1626] border-white/10 text-white' : 'bg-white border-slate-200'
                }`}
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LIVE PREVIEW */}
      {activeTab === 'preview' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-xs font-medium text-rose-700 dark:text-rose-300 flex items-center justify-between">
            <span>
              <strong>Interactive Preview Mode</strong>: Test questions, scoring calculations, and ROI simulation with your current draft settings.
            </span>
            <button
              onClick={handleSave}
              className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs hover:bg-rose-500 cursor-pointer"
            >
              Save These Settings
            </button>
          </div>

          <div className="p-6 sm:p-10 rounded-3xl bg-[#DBDBDB] dark:bg-[#060A12] border border-slate-200 dark:border-white/10">
            <HomeGrowthToolsClient data={data} />
          </div>
        </div>
      )}
    </div>
  );
}
