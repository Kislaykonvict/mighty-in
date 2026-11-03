'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  RotateCcw,
  ExternalLink,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Award,
  Zap,
  Target,
  Compass,
  Users,
  Cpu,
  Layers,
  HelpCircle,
  Eye,
  AlertCircle,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Sliders,
  Check,
  ArrowRight,
} from 'lucide-react';
import { useAdminTheme } from './AdminThemeContext';
import {
  AssessmentSectionData,
  AssessmentFeaturePill,
  AssessmentRatingTier,
  defaultAssessmentSectionData,
} from '@/types/assessmentSection';
import { AssessmentQuestion, AssessmentOption, OpportunityItem } from '@/types/assessment';

const AVAILABLE_PILL_ICONS = [
  { name: 'Clock', icon: Clock },
  { name: 'ShieldCheck', icon: ShieldCheck },
  { name: 'Sparkles', icon: Sparkles },
  { name: 'CheckCircle2', icon: CheckCircle2 },
  { name: 'Award', icon: Award },
  { name: 'Zap', icon: Zap },
  { name: 'Target', icon: Target },
  { name: 'Compass', icon: Compass },
  { name: 'Users', icon: Users },
  { name: 'Cpu', icon: Cpu },
  { name: 'Layers', icon: Layers },
  { name: 'FileCheck', icon: FileCheck },
];

function resolvePillIcon(name: string) {
  const found = AVAILABLE_PILL_ICONS.find(
    (i) => i.name.toLowerCase() === (name || '').toLowerCase()
  );
  return found ? found.icon : Sparkles;
}

export function AssessmentManagementView() {
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<'hero' | 'questions' | 'scoring' | 'opportunities'>('hero');
  const [data, setData] = useState<AssessmentSectionData>(defaultAssessmentSectionData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Expanded question index in Tab 2
  const [expandedQuestionIdx, setExpandedQuestionIdx] = useState<number | null>(0);

  // Pill modal state
  const [pillModalOpen, setPillModalOpen] = useState(false);
  const [editingPillIdx, setEditingPillIdx] = useState<number | null>(null);
  const [pillDraft, setPillDraft] = useState<AssessmentFeaturePill>({
    id: '',
    icon: 'Sparkles',
    text: '',
  });

  // Fetch initial data
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const res = await fetch('/api/admin/assessment');
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
        }
      } catch (err) {
        console.error('Failed to load assessment section data:', err);
        showToast('error', 'Failed to load assessment data from server');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const res = await fetch('/api/admin/assessment', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (json.success) {
        setData(json.data);
        showToast('success', 'Assessment configuration saved successfully!');
      } else {
        showToast('error', json.error || 'Failed to save configuration');
      }
    } catch (err: any) {
      console.error('Error saving assessment configuration:', err);
      showToast('error', 'Network error while saving');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Discard all unsaved edits and reload default configuration?')) {
      setData(defaultAssessmentSectionData);
      showToast('success', 'Reset to initial defaults (remember to click Save).');
    }
  };

  // --- Feature Pill Handlers ---
  const handleOpenAddPill = () => {
    setEditingPillIdx(null);
    setPillDraft({
      id: `pill-${Date.now()}`,
      icon: 'Clock',
      text: '',
    });
    setPillModalOpen(true);
  };

  const handleOpenEditPill = (idx: number) => {
    setEditingPillIdx(idx);
    setPillDraft({ ...data.featurePills[idx] });
    setPillModalOpen(true);
  };

  const handleSavePill = () => {
    if (!pillDraft.text.trim()) {
      alert('Pill text cannot be blank');
      return;
    }

    const updated = [...data.featurePills];
    if (editingPillIdx !== null) {
      updated[editingPillIdx] = pillDraft;
    } else {
      updated.push(pillDraft);
    }

    setData({ ...data, featurePills: updated });
    setPillModalOpen(false);
  };

  const handleDeletePill = (idx: number) => {
    const updated = data.featurePills.filter((_, i) => i !== idx);
    setData({ ...data, featurePills: updated });
  };

  // --- Question Handlers ---
  const handleAddQuestion = () => {
    const newQ: AssessmentQuestion = {
      id: `q-${Date.now()}`,
      number: data.questions.length + 1,
      question: 'New Diagnostic Question?',
      subtext: 'Provide guidance or context for the respondent.',
      category: 'challenge',
      options: [
        {
          id: `opt-${Date.now()}-1`,
          label: 'Primary Option 1',
          description: 'Explanation of this situation or requirement.',
          scoreWeight: 15,
          categoryFocus: 'growth',
          capabilityKey: 'Digital & Growth',
        },
        {
          id: `opt-${Date.now()}-2`,
          label: 'Alternative Option 2',
          description: 'Explanation of this situation or requirement.',
          scoreWeight: 15,
          categoryFocus: 'tech',
          capabilityKey: 'Technology',
        },
      ],
    };

    const updated = [...data.questions, newQ];
    setData({ ...data, questions: updated });
    setExpandedQuestionIdx(updated.length - 1);
  };

  const handleDeleteQuestion = (idx: number) => {
    if (data.questions.length <= 1) {
      alert('You must have at least 1 question in the assessment.');
      return;
    }
    if (confirm(`Delete Question ${idx + 1}?`)) {
      const updated = data.questions.filter((_, i) => i !== idx);
      // Renumber
      const renumbered = updated.map((q, i) => ({ ...q, number: i + 1 }));
      setData({ ...data, questions: renumbered });
      if (expandedQuestionIdx === idx) {
        setExpandedQuestionIdx(null);
      }
    }
  };

  const handleMoveQuestion = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= data.questions.length) return;

    const updated = [...data.questions];
    const [moved] = updated.splice(idx, 1);
    updated.splice(targetIdx, 0, moved);
    const renumbered = updated.map((q, i) => ({ ...q, number: i + 1 }));
    setData({ ...data, questions: renumbered });
    setExpandedQuestionIdx(targetIdx);
  };

  // --- Question Option Handlers ---
  const handleAddOption = (qIdx: number) => {
    const updated = [...data.questions];
    const targetQ = updated[qIdx];
    const newOpt: AssessmentOption = {
      id: `opt-${Date.now()}`,
      label: `Option ${targetQ.options.length + 1}`,
      description: 'Describe this option for the assessment respondent.',
      scoreWeight: 15,
      categoryFocus: 'growth',
      capabilityKey: 'Digital & Growth',
    };
    targetQ.options.push(newOpt);
    setData({ ...data, questions: updated });
  };

  const handleDeleteOption = (qIdx: number, oIdx: number) => {
    const updated = [...data.questions];
    if (updated[qIdx].options.length <= 2) {
      alert('A question must have at least 2 options.');
      return;
    }
    updated[qIdx].options.splice(oIdx, 1);
    setData({ ...data, questions: updated });
  };

  // --- Rating Tier Handlers ---
  const handleAddTier = () => {
    const newTier: AssessmentRatingTier = {
      minScore: 50,
      title: 'NEW EVALUATION TIER',
      summary: 'Summary text explaining the findings and momentum at this score level.',
    };
    setData({ ...data, ratingTiers: [...data.ratingTiers, newTier] });
  };

  const handleDeleteTier = (idx: number) => {
    if (data.ratingTiers.length <= 1) {
      alert('You must have at least 1 evaluation tier.');
      return;
    }
    const updated = data.ratingTiers.filter((_, i) => i !== idx);
    setData({ ...data, ratingTiers: updated });
  };

  // --- Opportunity Item Handlers ---
  const handleAddOpportunity = () => {
    const newOpp: OpportunityItem = {
      id: `opp-${Date.now()}`,
      number: `0${data.opportunities.length + 1}`,
      title: 'New High-Leverage Strategic Initiative',
      description: 'Detail the high-value opportunity and where revenue or speed is unlocked.',
      recommendedVertical: 'Digital & Growth',
      actionStep: 'Describe the tactical first sprint or audit action to execute.',
    };
    setData({ ...data, opportunities: [...data.opportunities, newOpp] });
  };

  const handleDeleteOpportunity = (idx: number) => {
    if (data.opportunities.length <= 1) {
      alert('You must have at least 1 recommended opportunity.');
      return;
    }
    const updated = data.opportunities.filter((_, i) => i !== idx);
    setData({ ...data, opportunities: updated });
  };

  if (isLoading) {
    return (
      <div className="p-8 sm:p-12 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-sm">
          <div className="w-5 h-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading Assessment &amp; Diagnostic configuration...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-3 text-sm animate-fade-in ${
            toast.type === 'success'
              ? 'bg-emerald-500 text-white border-emerald-400'
              : 'bg-rose-500 text-white border-rose-400'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      {/* Top Action Bar */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0E1526] border border-slate-200 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900 dark:text-white">
                Assessment &amp; Growth Diagnostic
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                {data.questions.length} Questions
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage the 3-minute diagnostic hero, questions, option weights, scoring tiers, and conversion roadmap.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="/assessment"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Live</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>

          <button
            type="button"
            onClick={handleReset}
            disabled={isSaving}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-colors flex items-center gap-1.5 shadow-sm shadow-rose-600/30 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-[#0A0F1D] border border-slate-200 dark:border-white/10">
        <button
          type="button"
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'hero'
              ? 'bg-white dark:bg-rose-600 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          01. Hero &amp; Feature Badges
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('questions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'questions'
              ? 'bg-white dark:bg-rose-600 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          02. Questions &amp; Options ({data.questions.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('scoring')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'scoring'
              ? 'bg-white dark:bg-rose-600 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          03. Scoring &amp; Rating Tiers
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('opportunities')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'opportunities'
              ? 'bg-white dark:bg-rose-600 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          04. Opportunities &amp; CTA
        </button>
      </div>

      {/* Tab 1: Hero & Feature Badges */}
      {activeTab === 'hero' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0E1526] border border-slate-200 dark:border-white/10 space-y-6 shadow-sm">
          <div className="border-b border-slate-200 dark:border-white/10 pb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Hero Headlines, Badges &amp; Assurance Pills
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Customize the prominent top title, signature gradient accent, description, and trust badges shown on the diagnostic header.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Top Eyebrow Badge
              </label>
              <input
                type="text"
                value={data.badge}
                onChange={(e) => setData({ ...data, badge: e.target.value })}
                placeholder="SIGNATURE DIAGNOSTIC TOOL"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Headline Base Text
              </label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
                placeholder="How ready is your business for its"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Highlighted Title (Stylized with Brand Gradient)
              </label>
              <input
                type="text"
                value={data.highlightedTitle}
                onChange={(e) => setData({ ...data, highlightedTitle: e.target.value })}
                placeholder="next stage of growth?"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-rose-500 font-bold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Overview / Description Paragraph
              </label>
              <textarea
                rows={3}
                value={data.description}
                onChange={(e) => setData({ ...data, description: e.target.value })}
                placeholder="Evaluate your commercial readiness across brand positioning, technology scalability, and team velocity in under 3 minutes."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* Feature Pills Sub-Section */}
          <div className="pt-6 border-t border-slate-200 dark:border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  Header Trust &amp; Assurance Pills
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Micro-badges rendered beneath the headline (e.g. Takes ~3 minutes, 100% Confidential).
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenAddPill}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Badge</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {data.featurePills.map((pill, idx) => {
                const Icon = resolvePillIcon(pill.icon);
                return (
                  <div
                    key={pill.id || idx}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/8 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {pill.text || 'Untitled Badge'}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          Icon: {pill.icon}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenEditPill(idx)}
                        className="px-2 py-1 rounded text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePill(idx)}
                        className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Diagnostic Questions & Options */}
      {activeTab === 'questions' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0E1526] border border-slate-200 dark:border-white/10 space-y-6 shadow-sm">
          <div className="border-b border-slate-200 dark:border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Diagnostic Questions &amp; Card Options
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage each step of the wizard, question prompts, subtext descriptions, options, score weights, and capability mappings.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddQuestion}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Question</span>
            </button>
          </div>

          <div className="space-y-4">
            {data.questions.map((q, qIdx) => {
              const isExpanded = expandedQuestionIdx === qIdx;

              return (
                <div
                  key={q.id || qIdx}
                  className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] overflow-hidden"
                >
                  {/* Accordion Header */}
                  <div className="p-4 bg-white dark:bg-[#0B111E] border-b border-slate-200 dark:border-white/8 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setExpandedQuestionIdx(isExpanded ? null : qIdx)}
                      className="flex items-center gap-3 text-left flex-1 min-w-0 cursor-pointer"
                    >
                      <span className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                        {qIdx + 1}
                      </span>
                      <div className="truncate">
                        <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {q.question || `Question ${qIdx + 1}`}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {q.options.length} options • Category: {q.category}
                        </div>
                      </div>
                    </button>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMoveQuestion(qIdx, 'up')}
                        disabled={qIdx === 0}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveQuestion(qIdx, 'down')}
                        disabled={qIdx === data.questions.length - 1}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteQuestion(qIdx)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer"
                        title="Delete Question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setExpandedQuestionIdx(isExpanded ? null : qIdx)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Accordion Body */}
                  {isExpanded && (
                    <div className="p-5 space-y-5 bg-white dark:bg-[#0E1526]">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Question Prompt
                          </label>
                          <input
                            type="text"
                            value={q.question}
                            onChange={(e) => {
                              const updated = [...data.questions];
                              updated[qIdx].question = e.target.value;
                              setData({ ...data, questions: updated });
                            }}
                            className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Category Code
                          </label>
                          <select
                            value={q.category}
                            onChange={(e) => {
                              const updated = [...data.questions];
                              updated[qIdx].category = e.target.value as any;
                              setData({ ...data, questions: updated });
                            }}
                            className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-[#0B111E] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                          >
                            <option value="challenge">Business Challenge</option>
                            <option value="presence">Digital Presence</option>
                            <option value="bottleneck">Operational Bottleneck</option>
                            <option value="priority">Strategic Priority</option>
                            <option value="capability">High-ROI Capability</option>
                          </select>
                        </div>

                        <div className="md:col-span-3">
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Helper / Subtext Instructions
                          </label>
                          <input
                            type="text"
                            value={q.subtext || ''}
                            onChange={(e) => {
                              const updated = [...data.questions];
                              updated[qIdx].subtext = e.target.value;
                              setData({ ...data, questions: updated });
                            }}
                            className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>

                      {/* Options Section */}
                      <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-white/10">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                            Selectable Answer Options ({q.options.length})
                          </span>

                          <button
                            type="button"
                            onClick={() => handleAddOption(qIdx)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add Option</span>
                          </button>
                        </div>

                        <div className="space-y-3">
                          {q.options.map((opt, oIdx) => (
                            <div
                              key={opt.id || oIdx}
                              className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/8 space-y-2.5"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
                                  Option {oIdx + 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteOption(qIdx, oIdx)}
                                  className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>Remove</span>
                                </button>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                                <div className="sm:col-span-2 md:col-span-2">
                                  <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                                    Option Label / Headline
                                  </label>
                                  <input
                                    type="text"
                                    value={opt.label}
                                    onChange={(e) => {
                                      const updated = [...data.questions];
                                      updated[qIdx].options[oIdx].label = e.target.value;
                                      setData({ ...data, questions: updated });
                                    }}
                                    className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-medium"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                                    Score Weight (0-30)
                                  </label>
                                  <input
                                    type="number"
                                    min="0"
                                    max="30"
                                    value={opt.scoreWeight}
                                    onChange={(e) => {
                                      const updated = [...data.questions];
                                      updated[qIdx].options[oIdx].scoreWeight =
                                        parseInt(e.target.value, 10) || 0;
                                      setData({ ...data, questions: updated });
                                    }}
                                    className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-mono"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                                    Focus Vertical
                                  </label>
                                  <select
                                    value={opt.categoryFocus}
                                    onChange={(e) => {
                                      const updated = [...data.questions];
                                      updated[qIdx].options[oIdx].categoryFocus = e.target
                                        .value as any;
                                      setData({ ...data, questions: updated });
                                    }}
                                    className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-[#0B111E] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                                  >
                                    <option value="growth">Digital &amp; Growth</option>
                                    <option value="tech">Technology</option>
                                    <option value="talent">Talent Solutions</option>
                                    <option value="strategy">Integrated Strategy</option>
                                  </select>
                                </div>

                                <div className="sm:col-span-2 md:col-span-3">
                                  <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                                    Option Sub-description
                                  </label>
                                  <input
                                    type="text"
                                    value={opt.description || ''}
                                    onChange={(e) => {
                                      const updated = [...data.questions];
                                      updated[qIdx].options[oIdx].description = e.target.value;
                                      setData({ ...data, questions: updated });
                                    }}
                                    className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                                    Capability Badge
                                  </label>
                                  <input
                                    type="text"
                                    value={opt.capabilityKey}
                                    onChange={(e) => {
                                      const updated = [...data.questions];
                                      updated[qIdx].options[oIdx].capabilityKey = e.target.value;
                                      setData({ ...data, questions: updated });
                                    }}
                                    className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Scoring & Rating Tiers */}
      {activeTab === 'scoring' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0E1526] border border-slate-200 dark:border-white/10 space-y-6 shadow-sm">
          <div className="border-b border-slate-200 dark:border-white/10 pb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Ecosystem Breakdown Labels &amp; Evaluation Tiers
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure the 4 dimension labels displayed on the completion screen meters, along with customizable score rating tiers.
            </p>
          </div>

          {/* Breakdown Dimension Labels */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Ecosystem Capability Dimension Labels
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Dimension 1 (Digital/Growth)
                </label>
                <input
                  type="text"
                  value={data.scoreBreakdownLabels.digitalVisibilityLabel}
                  onChange={(e) =>
                    setData({
                      ...data,
                      scoreBreakdownLabels: {
                        ...data.scoreBreakdownLabels,
                        digitalVisibilityLabel: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Dimension 2 (Engineering/Tech)
                </label>
                <input
                  type="text"
                  value={data.scoreBreakdownLabels.technologyReadinessLabel}
                  onChange={(e) =>
                    setData({
                      ...data,
                      scoreBreakdownLabels: {
                        ...data.scoreBreakdownLabels,
                        technologyReadinessLabel: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Dimension 3 (Staff/Talent)
                </label>
                <input
                  type="text"
                  value={data.scoreBreakdownLabels.teamScalabilityLabel}
                  onChange={(e) =>
                    setData({
                      ...data,
                      scoreBreakdownLabels: {
                        ...data.scoreBreakdownLabels,
                        teamScalabilityLabel: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Dimension 4 (Conversion/Sales)
                </label>
                <input
                  type="text"
                  value={data.scoreBreakdownLabels.conversionPowerLabel}
                  onChange={(e) =>
                    setData({
                      ...data,
                      scoreBreakdownLabels: {
                        ...data.scoreBreakdownLabels,
                        conversionPowerLabel: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Rating Tiers Section */}
          <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  Rating Tiers &amp; Thresholds
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Dynamic evaluations matched based on respondent score (ordered by Min Score descending).
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddTier}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Tier</span>
              </button>
            </div>

            <div className="space-y-3">
              {data.ratingTiers.map((tier, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/8 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {tier.title || 'Untitled Tier'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteTier(idx)}
                      className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded cursor-pointer"
                      title="Delete Tier"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                        Min Score Required
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={tier.minScore}
                        onChange={(e) => {
                          const updated = [...data.ratingTiers];
                          updated[idx].minScore = parseInt(e.target.value, 10) || 0;
                          setData({ ...data, ratingTiers: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-mono font-bold"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                        Tier Headline Badge
                      </label>
                      <input
                        type="text"
                        value={tier.title}
                        onChange={(e) => {
                          const updated = [...data.ratingTiers];
                          updated[idx].title = e.target.value;
                          setData({ ...data, ratingTiers: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold"
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                        Executive Summary Findings
                      </label>
                      <textarea
                        rows={2}
                        value={tier.summary}
                        onChange={(e) => {
                          const updated = [...data.ratingTiers];
                          updated[idx].summary = e.target.value;
                          setData({ ...data, ratingTiers: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Opportunities & CTA */}
      {activeTab === 'opportunities' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0E1526] border border-slate-200 dark:border-white/10 space-y-6 shadow-sm">
          <div className="border-b border-slate-200 dark:border-white/10 pb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Recommended Initiatives &amp; Consultation CTA Box
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Customize the personalized strategic opportunity cards shown to clients alongside the bottom conversion banner.
            </p>
          </div>

          {/* Opportunities Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  Highest-Leverage Opportunities
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Cards listed under &quot;Your Highest-Leverage Opportunities&quot;.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddOpportunity}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Opportunity</span>
              </button>
            </div>

            <div className="space-y-3">
              {data.opportunities.map((opp, idx) => (
                <div
                  key={opp.id || idx}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/8 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
                      Opportunity #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteOpportunity(idx)}
                      className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                        Numeral Badge (e.g. 01)
                      </label>
                      <input
                        type="text"
                        value={opp.number}
                        onChange={(e) => {
                          const updated = [...data.opportunities];
                          updated[idx].number = e.target.value;
                          setData({ ...data, opportunities: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-mono"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                        Opportunity Title
                      </label>
                      <input
                        type="text"
                        value={opp.title}
                        onChange={(e) => {
                          const updated = [...data.opportunities];
                          updated[idx].title = e.target.value;
                          setData({ ...data, opportunities: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                        Agency Pillar
                      </label>
                      <select
                        value={opp.recommendedVertical}
                        onChange={(e) => {
                          const updated = [...data.opportunities];
                          updated[idx].recommendedVertical = e.target.value as any;
                          setData({ ...data, opportunities: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-[#0B111E] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                      >
                        <option value="Digital & Growth">Digital &amp; Growth</option>
                        <option value="Technology">Technology</option>
                        <option value="Talent Solutions">Talent Solutions</option>
                        <option value="Integrated Ecosystem">Integrated Ecosystem</option>
                      </select>
                    </div>

                    <div className="sm:col-span-4">
                      <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                        Problem / Lever Description
                      </label>
                      <input
                        type="text"
                        value={opp.description}
                        onChange={(e) => {
                          const updated = [...data.opportunities];
                          updated[idx].description = e.target.value;
                          setData({ ...data, opportunities: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                        Tactical Action Step
                      </label>
                      <input
                        type="text"
                        value={opp.actionStep}
                        onChange={(e) => {
                          const updated = [...data.opportunities];
                          updated[idx].actionStep = e.target.value;
                          setData({ ...data, opportunities: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Consultation CTA Banner */}
          <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-white/10">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Bottom Consultation Discovery CTA
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  CTA Headline
                </label>
                <input
                  type="text"
                  value={data.cta.title}
                  onChange={(e) =>
                    setData({
                      ...data,
                      cta: { ...data.cta, title: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  CTA Subtitle
                </label>
                <input
                  type="text"
                  value={data.cta.subtitle}
                  onChange={(e) =>
                    setData({
                      ...data,
                      cta: { ...data.cta, subtitle: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Retake Button Text
                </label>
                <input
                  type="text"
                  value={data.cta.retakeButtonText}
                  onChange={(e) =>
                    setData({
                      ...data,
                      cta: { ...data.cta, retakeButtonText: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Primary Action Button Text
                </label>
                <input
                  type="text"
                  value={data.cta.primaryButtonText}
                  onChange={(e) =>
                    setData({
                      ...data,
                      cta: { ...data.cta, primaryButtonText: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Primary Action Button Destination Link
                </label>
                <input
                  type="text"
                  value={data.cta.primaryButtonLink}
                  onChange={(e) =>
                    setData({
                      ...data,
                      cta: { ...data.cta, primaryButtonLink: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feature Pill Edit Modal */}
      {pillModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-[#0F1626] border border-slate-200 dark:border-white/10 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {editingPillIdx !== null ? 'Edit Header Badge' : 'Add Header Badge'}
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Badge Text
              </label>
              <input
                type="text"
                value={pillDraft.text}
                onChange={(e) => setPillDraft({ ...pillDraft, text: e.target.value })}
                placeholder="e.g. Takes ~3 minutes"
                className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Select Icon
              </label>
              <div className="grid grid-cols-4 gap-2">
                {AVAILABLE_PILL_ICONS.map((item) => {
                  const Icon = item.icon;
                  const isSelected = pillDraft.icon.toLowerCase() === item.name.toLowerCase();

                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => setPillDraft({ ...pillDraft, icon: item.name })}
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1 text-[10px] cursor-pointer ${
                        isSelected
                          ? 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold'
                          : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
              <button
                type="button"
                onClick={() => setPillModalOpen(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePill}
                className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
