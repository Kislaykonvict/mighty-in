'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Loader2,
  Globe,
  Layers,
  Sparkles,
  Eye,
  EyeOff,
  Filter,
  Code2,
} from 'lucide-react';
import { useAdminTheme } from '@/components/admin/AdminThemeContext';
import {
  FaqItemData,
  STANDARD_FAQ_PAGES,
  STANDARD_FAQ_CATEGORIES,
} from '@/types/faq';

export default function AdminFaqsPage() {
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';

  const [faqs, setFaqs] = useState<FaqItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPageFilter, setSelectedPageFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqItemData | null>(null);
  const [isSavingFaq, setIsSavingFaq] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form inputs
  const [formQuestion, setFormQuestion] = useState('');
  const [formAnswer, setFormAnswer] = useState('');
  const [formPageSlug, setFormPageSlug] = useState('global');
  const [formCustomPageSlug, setFormCustomPageSlug] = useState('');
  const [isCustomPage, setIsCustomPage] = useState(false);
  const [formCategory, setFormCategory] = useState('general');
  const [formOrder, setFormOrder] = useState<number>(0);
  const [formIsActive, setFormIsActive] = useState(true);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch FAQs from API
  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/faqs');
      const data = await res.json();
      if (data.success && Array.isArray(data.faqs)) {
        setFaqs(data.faqs);
      } else {
        showToast(data.error || 'Failed to fetch FAQs', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error connecting to server', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  // Filter FAQs
  const filteredFaqs = faqs.filter((faq) => {
    const matchesPage =
      selectedPageFilter === 'all' ? true : faq.pageSlug === selectedPageFilter;

    const matchesSearch =
      searchQuery.trim() === ''
        ? true
        : faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.pageSlug.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesPage && matchesSearch;
  });

  // Open modal for Create
  const handleOpenCreateModal = () => {
    setEditingFaq(null);
    setFormQuestion('');
    setFormAnswer('');

    // Preselect current filter if viewing a specific page
    const initialPage = selectedPageFilter !== 'all' ? selectedPageFilter : 'global';
    const isStandard = STANDARD_FAQ_PAGES.some((p) => p.value === initialPage);
    if (isStandard) {
      setFormPageSlug(initialPage);
      setIsCustomPage(false);
      setFormCustomPageSlug('');
    } else {
      setFormPageSlug('custom');
      setIsCustomPage(true);
      setFormCustomPageSlug(initialPage);
    }

    setFormCategory('general');

    // Pre-calculate order
    const pageFaqs = faqs.filter((f) => f.pageSlug === initialPage);
    setFormOrder(pageFaqs.length);

    setFormIsActive(true);
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEditModal = (faq: FaqItemData) => {
    setEditingFaq(faq);
    setFormQuestion(faq.question);
    setFormAnswer(faq.answer);

    const isStandard = STANDARD_FAQ_PAGES.some((p) => p.value === faq.pageSlug);
    if (isStandard) {
      setFormPageSlug(faq.pageSlug);
      setIsCustomPage(false);
      setFormCustomPageSlug('');
    } else {
      setFormPageSlug('custom');
      setIsCustomPage(true);
      setFormCustomPageSlug(faq.pageSlug);
    }

    setFormCategory(faq.category || 'general');
    setFormOrder(faq.order);
    setFormIsActive(faq.isActive);
    setIsModalOpen(true);
  };

  // Save (Create or Update)
  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formQuestion.trim()) {
      showToast('Question is required', 'error');
      return;
    }
    if (!formAnswer.trim()) {
      showToast('Answer is required', 'error');
      return;
    }

    const finalPageSlug = isCustomPage
      ? formCustomPageSlug.trim() || 'global'
      : formPageSlug;

    try {
      setIsSavingFaq(true);
      const isEdit = Boolean(editingFaq);
      const method = isEdit ? 'PUT' : 'POST';

      const payload: any = {
        question: formQuestion.trim(),
        answer: formAnswer.trim(),
        pageSlug: finalPageSlug,
        category: formCategory.trim() || 'general',
        order: Number(formOrder) || 0,
        isActive: formIsActive,
      };

      if (isEdit && editingFaq) {
        payload.id = editingFaq.id;
      }

      const res = await fetch('/api/admin/faqs', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        showToast(
          isEdit ? 'FAQ updated successfully' : 'FAQ created successfully',
          'success'
        );
        setIsModalOpen(false);
        fetchFaqs();
      } else {
        showToast(data.error || 'Failed to save FAQ', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to save FAQ', 'error');
    } finally {
      setIsSavingFaq(false);
    }
  };

  // Toggle Active
  const handleToggleActive = async (faq: FaqItemData) => {
    try {
      const updatedStatus = !faq.isActive;
      // Optimistic update
      setFaqs((prev) =>
        prev.map((f) => (f.id === faq.id ? { ...f, isActive: updatedStatus } : f))
      );

      const res = await fetch('/api/admin/faqs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: faq.id, isActive: updatedStatus }),
      });
      const data = await res.json();
      if (!data.success) {
        showToast('Failed to update status', 'error');
        fetchFaqs();
      }
    } catch (err: any) {
      showToast('Failed to update status', 'error');
      fetchFaqs();
    }
  };

  // Move up/down within same page
  const handleMoveOrder = async (faq: FaqItemData, direction: 'up' | 'down') => {
    const pageFaqs = faqs
      .filter((f) => f.pageSlug === faq.pageSlug)
      .sort((a, b) => a.order - b.order);

    const index = pageFaqs.findIndex((f) => f.id === faq.id);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === pageFaqs.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const targetFaq = pageFaqs[targetIndex];

    const currentOrder = faq.order;
    const targetOrder = targetFaq.order === currentOrder
      ? direction === 'up'
        ? currentOrder - 1
        : currentOrder + 1
      : targetFaq.order;

    try {
      const reorderItems = [
        { id: faq.id, order: targetOrder },
        { id: targetFaq.id, order: currentOrder },
      ];

      // Optimistic
      setFaqs((prev) =>
        prev.map((f) => {
          if (f.id === faq.id) return { ...f, order: targetOrder };
          if (f.id === targetFaq.id) return { ...f, order: currentOrder };
          return f;
        })
      );

      await fetch('/api/admin/faqs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reorder', items: reorderItems }),
      });
      fetchFaqs();
    } catch (err: any) {
      showToast('Failed to reorder', 'error');
      fetchFaqs();
    }
  };

  // Delete FAQ
  const handleDeleteFaq = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/faqs?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showToast('FAQ deleted successfully', 'success');
        setDeleteConfirmId(null);
        fetchFaqs();
      } else {
        showToast(data.error || 'Failed to delete FAQ', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to delete FAQ', 'error');
    }
  };

  // Count FAQs by page
  const pageCounts: Record<string, number> = {};
  faqs.forEach((f) => {
    pageCounts[f.pageSlug] = (pageCounts[f.pageSlug] || 0) + 1;
  });

  // Helper for page badge label
  const getPageLabel = (slug: string) => {
    const found = STANDARD_FAQ_PAGES.find((p) => p.value === slug);
    return found ? found.label : slug;
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-sm font-medium transition-all animate-in slide-in-from-bottom-3 ${
            toast.type === 'success'
              ? 'bg-emerald-600 text-white'
              : 'bg-rose-600 text-white'
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

      {/* Top Banner / Header */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border transition-colors ${
          isDark
            ? 'bg-[#0F1626]/80 border-white/8 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        } shadow-sm`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Multi-Page Dynamic Knowledge Base</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Frequently Asked Questions &amp; Schema
            </h1>
            <p
              className={`text-sm max-w-2xl leading-relaxed ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              Set questions and answers for specific pages or across the entire platform. Every page with FAQs automatically renders an interactive accordion and Google <code className="text-xs px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10 font-mono">FAQPage</code> structured rich snippet data.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New FAQ</span>
            </button>
          </div>
        </div>

        {/* Live Stats Pills */}
        <div className="pt-6 mt-6 border-t border-slate-200 dark:border-white/8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase font-semibold">
              Total FAQs
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {faqs.length}
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase font-semibold">
              Active Questions
            </div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {faqs.filter((f) => f.isActive).length}
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase font-semibold">
              Covered Pages
            </div>
            <div className="text-2xl font-black text-sky-600 dark:text-sky-400 mt-1">
              {Object.keys(pageCounts).length}
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase font-semibold">
              Google Schema
            </div>
            <div className="text-xs font-bold text-rose-600 dark:text-orange-400 mt-2 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5" />
              <span>FAQPage Enabled</span>
            </div>
          </div>
        </div>
      </div>

      {/* Target Page Filter Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter by Target Page</span>
          </label>
          <span className="text-xs text-slate-400">
            Showing {filteredFaqs.length} of {faqs.length}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <button
            onClick={() => setSelectedPageFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedPageFilter === 'all'
                ? 'bg-rose-600 text-white shadow-sm'
                : isDark
                ? 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Pages ({faqs.length})
          </button>

          {STANDARD_FAQ_PAGES.map((page) => {
            const count = pageCounts[page.value] || 0;
            const isSelected = selectedPageFilter === page.value;
            return (
              <button
                key={page.value}
                onClick={() => setSelectedPageFilter(page.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-rose-600 text-white shadow-sm font-semibold'
                    : isDark
                    ? 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{page.label}</span>
                {count > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : isDark
                        ? 'bg-white/10 text-slate-300'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search question, answer, category, or page route..."
          className={`w-full pl-10 pr-4 py-2.5 rounded-2xl border text-sm transition-all focus:outline-none focus:ring-1 focus:ring-rose-500 ${
            isDark
              ? 'bg-[#0F1626] border-white/10 text-white placeholder-slate-500'
              : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
          }`}
        />
      </div>

      {/* FAQ Items List */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-rose-500 mx-auto" />
          <p className="text-sm text-slate-400">Loading FAQs...</p>
        </div>
      ) : filteredFaqs.length === 0 ? (
        <div
          className={`p-12 text-center rounded-3xl border ${
            isDark ? 'bg-[#0F1626]/40 border-white/8' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            No FAQs Found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            {selectedPageFilter !== 'all'
              ? `No FAQs are currently assigned to "${getPageLabel(selectedPageFilter)}". Click below to add the first question for this page.`
              : 'Start building your structured knowledge base by creating your first FAQ item.'}
          </p>
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add FAQ for this Page</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => {
            const pageItem = STANDARD_FAQ_PAGES.find((p) => p.value === faq.pageSlug);
            const isFirst = index === 0;
            const isLast = index === filteredFaqs.length - 1;

            return (
              <div
                key={faq.id}
                className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                  !faq.isActive
                    ? isDark
                      ? 'bg-white/[0.01] border-white/5 opacity-60'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                    : isDark
                    ? 'bg-[#0F1626] border-white/8 hover:border-white/15'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                } shadow-xs`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Left Column: Question & Metadata */}
                  <div className="space-y-2.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Target Page Badge */}
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400">
                        <Globe className="w-3 h-3" />
                        <span>{pageItem?.label || faq.pageSlug}</span>
                      </span>

                      {/* Category Badge */}
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300">
                        {faq.category}
                      </span>

                      {/* Order Badge */}
                      <span className="text-[10px] font-mono text-slate-400">
                        Order #{faq.order}
                      </span>

                      {/* Status */}
                      {!faq.isActive && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold">
                          Draft / Inactive
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                      {faq.question}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line line-clamp-3">
                      {faq.answer}
                    </p>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-white/5 shrink-0">
                    <div className="flex items-center gap-1">
                      {/* Move Up */}
                      <button
                        onClick={() => handleMoveOrder(faq, 'up')}
                        disabled={isFirst}
                        title="Move Up"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      {/* Move Down */}
                      <button
                        onClick={() => handleMoveOrder(faq, 'down')}
                        disabled={isLast}
                        title="Move Down"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Toggle Active */}
                      <button
                        onClick={() => handleToggleActive(faq)}
                        title={faq.isActive ? 'Set to Inactive' : 'Set to Active'}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          faq.isActive
                            ? 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'
                            : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                      >
                        {faq.isActive ? (
                          <Eye className="w-3.5 h-3.5" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => handleOpenEditModal(faq)}
                        title="Edit FAQ"
                        className="p-1.5 rounded-lg text-sky-600 hover:text-sky-700 hover:bg-sky-50 dark:hover:bg-sky-500/10 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      {deleteConfirmId === faq.id ? (
                        <div className="flex items-center gap-1 bg-rose-50 dark:bg-rose-500/10 p-1 rounded-lg border border-rose-200 dark:border-rose-500/20">
                          <button
                            onClick={() => handleDeleteFaq(faq.id)}
                            className="text-[11px] font-bold text-rose-600 px-1.5 py-0.5 hover:underline cursor-pointer"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="p-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(faq.id)}
                          title="Delete FAQ"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* View on Page Link if not global */}
                    {faq.pageSlug && faq.pageSlug !== 'global' && (
                      <Link
                        href={faq.pageSlug}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-600 dark:hover:text-sky-400 transition-colors mt-1"
                      >
                        <span>View Page</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Add / Edit FAQ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div
            className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border p-6 sm:p-8 shadow-2xl ${
              isDark
                ? 'bg-[#0B101D] border-white/10 text-white'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/8 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">
                    {editingFaq ? 'Edit FAQ Item' : 'Create New FAQ Item'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Assign this question to a specific page or make it global across the entire site.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="space-y-5">
              {/* Target Page Selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Target Page Destination <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <select
                    value={isCustomPage ? 'custom' : formPageSlug}
                    onChange={(e) => {
                      if (e.target.value === 'custom') {
                        setIsCustomPage(true);
                      } else {
                        setIsCustomPage(false);
                        setFormPageSlug(e.target.value);
                      }
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium focus:outline-none focus:ring-1 focus:ring-rose-500 ${
                      isDark
                        ? 'bg-[#0F1626] border-white/10 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    <optgroup label="General">
                      <option value="global">All Pages (Global)</option>
                    </optgroup>
                    <optgroup label="Core Pages">
                      <option value="/">Homepage (/)</option>
                      <option value="/about">About Us (/about)</option>
                      <option value="/team">Team (/team)</option>
                      <option value="/work">Work &amp; Portfolio (/work)</option>
                      <option value="/contact">Contact (/contact)</option>
                      <option value="/growth-lab">Growth Lab (/growth-lab)</option>
                      <option value="/insights">Insights &amp; Blog (/insights)</option>
                    </optgroup>
                    <optgroup label="Business Verticals">
                      <option value="/businesses/digital-growth">
                        Digital &amp; Growth (/businesses/digital-growth)
                      </option>
                      <option value="/businesses/technology">
                        Technology (/businesses/technology)
                      </option>
                      <option value="/businesses/talent-solutions">
                        Talent Solutions (/businesses/talent-solutions)
                      </option>
                    </optgroup>
                    <optgroup label="Other">
                      <option value="custom">Custom Route URL...</option>
                    </optgroup>
                  </select>

                  {isCustomPage && (
                    <input
                      type="text"
                      required
                      value={formCustomPageSlug}
                      onChange={(e) => setFormCustomPageSlug(e.target.value)}
                      placeholder="e.g. /privacy-policy"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono focus:outline-none focus:ring-1 focus:ring-rose-500 ${
                        isDark
                          ? 'bg-[#0F1626] border-white/10 text-white placeholder-slate-500'
                          : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                      }`}
                    />
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  This FAQ will render automatically on the selected page&apos;s FAQ accordion and inject into its Google SEO Schema.
                </p>
              </div>

              {/* Question */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Question <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formQuestion}
                  onChange={(e) => setFormQuestion(e.target.value)}
                  placeholder="e.g. How does your agile engineering sprint model work?"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 ${
                    isDark
                      ? 'bg-[#0F1626] border-white/10 text-white placeholder-slate-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>

              {/* Answer */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Answer <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={5}
                  required
                  value={formAnswer}
                  onChange={(e) => setFormAnswer(e.target.value)}
                  placeholder="Write a clear, authoritative answer. Newlines and paragraph breaks are preserved."
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm leading-relaxed focus:outline-none focus:ring-1 focus:ring-rose-500 resize-y ${
                    isDark
                      ? 'bg-[#0F1626] border-white/10 text-white placeholder-slate-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>

              {/* Category & Order Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Category Tag
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 ${
                      isDark
                        ? 'bg-[#0F1626] border-white/10 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    {STANDARD_FAQ_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Display Sequence Order
                  </label>
                  <input
                    type="number"
                    value={formOrder}
                    onChange={(e) => setFormOrder(Number(e.target.value))}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 ${
                      isDark
                        ? 'bg-[#0F1626] border-white/10 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Publish Status
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Active questions are immediately visible to users and indexed by search engines.
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-600" />
                </label>
              </div>

              {/* Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-white/8">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingFaq}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
                >
                  {isSavingFaq ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{editingFaq ? 'Update FAQ' : 'Save FAQ'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
