'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  Save,
  X,
  Check,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Clock,
  Calendar,
  Sparkles,
  Tag,
  Eye,
  Star,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Loader2,
  User,
} from 'lucide-react';
import { useAdminTheme } from '@/components/admin/AdminThemeContext';
import { TipTapEditor } from '@/components/admin/TipTapEditor';
import { convertContentToHtml } from '@/lib/utils/blogContent';

interface ArticleItem {
  id: string;
  slug: string;
  title: string;
  titleAccent?: string | null;
  subtitle?: string | null;
  category: string;
  readTime: string;
  publishedAt: string;
  authorName: string;
  authorRole?: string | null;
  authorAvatar?: string | null;
  coverImage: string;
  excerpt: string;
  content: string[] | any;
  keyTakeaways: string[] | any;
  tags: string[] | any;
  featured: boolean;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  canonicalUrl?: string | null;
  headCode?: string | null;
}

export default function AdminInsightsPage() {
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';

  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal / Editor State
  const [editingArticle, setEditingArticle] = useState<ArticleItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showSeo, setShowSeo] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form fields
  const [formTitle, setFormTitle] = useState('');
  const [formTitleAccent, setFormTitleAccent] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formReadTime, setFormReadTime] = useState('5 min read');
  const [formPublishedAt, setFormPublishedAt] = useState('');
  const [formAuthorName, setFormAuthorName] = useState('Team Mighty Warner');
  const [formAuthorRole, setFormAuthorRole] = useState('Strategic Director');
  const [formAuthorAvatar, setFormAuthorAvatar] = useState('');
  const [formCoverImage, setFormCoverImage] = useState('');
  const [formExcerpt, setFormExcerpt] = useState('');
  const [formContent, setFormContent] = useState('<p></p>');
  const [formTakeaways, setFormTakeaways] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formFeatured, setFormFeatured] = useState(false);

  // SEO fields
  const [formMetaTitle, setFormMetaTitle] = useState('');
  const [formMetaDesc, setFormMetaDesc] = useState('');
  const [formMetaKeywords, setFormMetaKeywords] = useState('');
  const [formCanonicalUrl, setFormCanonicalUrl] = useState('');
  const [formHeadCode, setFormHeadCode] = useState('');

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Category Taxonomy State
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [isSavingCategories, setIsSavingCategories] = useState(false);
  const [editingCategoryIndex, setEditingCategoryIndex] = useState<number | null>(null);
  const [editingCategoryValue, setEditingCategoryValue] = useState('');
  const [categoryWarning, setCategoryWarning] = useState<string | null>(null);
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);
  const [hasMoreThanTwoRows, setHasMoreThanTwoRows] = useState(false);
  const [twoRowsHeight, setTwoRowsHeight] = useState<number | null>(null);
  const categoryInputRef = React.useRef<HTMLInputElement>(null);
  const categoriesContainerRef = React.useRef<HTMLDivElement>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/insights');
      const data = await res.json();
      if (data.success) {
        setArticles(data.data || []);
        if (data.categories && data.categories.length > 0 && categories.length === 0) {
          setCategories(data.categories);
        }
      } else {
        showToast(data.error || 'Failed to fetch insights', 'error');
      }
    } catch {
      showToast('Network error while loading insights', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/insights/categories');
      const data = await res.json();
      if (data.success && Array.isArray(data.categories)) {
        setCategories(data.categories);
      }
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, []);

  // Measure if categories wrap to more than 2 rows
  useEffect(() => {
    const checkCategoryRows = () => {
      if (!categoriesContainerRef.current) return;
      const items = categoriesContainerRef.current.children;
      if (items.length <= 1) {
        setHasMoreThanTwoRows(false);
        setTwoRowsHeight(null);
        return;
      }

      const row1Top = (items[0] as HTMLElement).offsetTop;
      let row2Top: number | null = null;
      let row2Item: HTMLElement | null = null;
      let hasRow3 = false;

      for (let i = 1; i < items.length; i++) {
        const item = items[i] as HTMLElement;
        const top = item.offsetTop;
        if (top > row1Top) {
          if (row2Top === null) {
            row2Top = top;
            row2Item = item;
          } else if (top > row2Top) {
            hasRow3 = true;
            break;
          }
        }
      }

      if (row2Top !== null && row2Item) {
        const calculatedTwoRowHeight = row2Top - row1Top + row2Item.offsetHeight + 4;
        setTwoRowsHeight(calculatedTwoRowHeight);
      } else {
        setTwoRowsHeight(null);
      }

      setHasMoreThanTwoRows(hasRow3);
    };

    checkCategoryRows();
    const timer = setTimeout(checkCategoryRows, 150);
    window.addEventListener('resize', checkCategoryRows);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkCategoryRows);
    };
  }, [categories, isCategoriesExpanded]);

  const handleSaveCategories = async (
    updatedCategories: string[],
    renamedFrom?: string,
    renamedTo?: string
  ) => {
    setIsSavingCategories(true);
    setCategoryWarning(null);
    try {
      const res = await fetch('/api/admin/insights/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categories: updatedCategories,
          renamedFrom,
          renamedTo,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
        showToast('Categories updated successfully');
        if (renamedFrom && renamedTo) {
          fetchArticles();
        }
      } else {
        showToast(data.error || 'Failed to update categories', 'error');
        if (data.error && data.error.includes('connected')) {
          setCategoryWarning(data.error);
        }
      }
    } catch {
      showToast('Network error while saving categories', 'error');
    } finally {
      setIsSavingCategories(false);
    }
  };

  const handleAddCategory = async () => {
    const trimmed = newCategoryInput.trim();
    if (!trimmed) {
      categoryInputRef.current?.focus();
      showToast('Please enter a category name first', 'error');
      return;
    }
    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      showToast('Category already exists', 'error');
      return;
    }
    const next = [...categories, trimmed];
    setCategories(next);
    setNewCategoryInput('');
    await handleSaveCategories(next);
  };

  const handleStartEditCategory = (index: number) => {
    setEditingCategoryIndex(index);
    setEditingCategoryValue(categories[index]);
  };

  const handleSaveEditCategory = async (index: number) => {
    const trimmed = editingCategoryValue.trim();
    if (!trimmed) return;
    const oldCat = categories[index];
    if (oldCat === trimmed) {
      setEditingCategoryIndex(null);
      return;
    }
    const next = [...categories];
    next[index] = trimmed;
    setCategories(next);
    setEditingCategoryIndex(null);
    await handleSaveCategories(next, oldCat, trimmed);
  };

  const handleDeleteCategory = async (catToDelete: string) => {
    setCategoryWarning(null);

    if (categories.length <= 1) {
      const msg = 'You must keep at least one category.';
      setCategoryWarning(msg);
      showToast(msg, 'error');
      return;
    }

    // Check if any article is currently assigned to this category
    const connected = articles.filter(
      (a) => a.category?.trim().toLowerCase() === catToDelete.trim().toLowerCase()
    );

    if (connected.length > 0) {
      const sample = connected.slice(0, 2).map((a) => `"${a.title}"`).join(', ');
      const extra = connected.length > 2 ? ` and ${connected.length - 2} more` : '';
      const msg = `Cannot delete category "${catToDelete}". It is currently connected to ${connected.length} article(s) (${sample}${extra}). Please reassign or delete these articles first.`;
      setCategoryWarning(msg);
      showToast(msg, 'error');
      return;
    }

    const next = categories.filter((c) => c !== catToDelete);
    setCategories(next);
    await handleSaveCategories(next);
  };

  const openCreateModal = () => {
    setEditingArticle(null);
    setIsCreating(true);
    setFormTitle('');
    setFormTitleAccent('');
    setFormCategory(categories[0] || 'Strategy');
    setFormSlug('');
    setFormReadTime('5 min read');
    setFormPublishedAt(new Date().toISOString().slice(0, 10));
    setFormAuthorName('Team Mighty Warner');
    setFormAuthorRole('Strategy & Growth Practice');
    setFormAuthorAvatar('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80');
    setFormCoverImage('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=85');
    setFormExcerpt('');
    setFormContent('<p></p>');
    setFormTakeaways('');
    setFormTags('Strategy, Business, Growth');
    setFormFeatured(false);
    setFormMetaTitle('');
    setFormMetaDesc('');
    setFormMetaKeywords('');
    setFormCanonicalUrl('');
    setFormHeadCode('');
    setShowSeo(false);
  };

  const openEditModal = (article: ArticleItem) => {
    setEditingArticle(article);
    setIsCreating(false);
    setFormTitle(article.title || '');
    setFormTitleAccent(article.titleAccent || '');
    setFormCategory(article.category || categories[0] || 'Strategy');
    setFormSlug(article.slug || '');
    setFormReadTime(article.readTime || '5 min read');
    setFormPublishedAt(article.publishedAt ? new Date(article.publishedAt).toISOString().slice(0, 10) : '');
    setFormAuthorName(article.authorName || 'Team Mighty Warner');
    setFormAuthorRole(article.authorRole || '');
    setFormAuthorAvatar(article.authorAvatar || '');
    setFormCoverImage(article.coverImage || '');
    setFormExcerpt(article.excerpt || '');

    // Convert legacy array or HTML string into clean HTML for TipTap editor
    const contentHtml = convertContentToHtml(article.content);
    setFormContent(contentHtml || '<p></p>');

    // Format takeaways
    const takeawaysText = Array.isArray(article.keyTakeaways)
      ? article.keyTakeaways.join('\n')
      : '';
    setFormTakeaways(takeawaysText);

    // Format tags
    const tagsText = Array.isArray(article.tags) ? article.tags.join(', ') : '';
    setFormTags(tagsText);

    setFormFeatured(!!article.featured);
    setFormMetaTitle(article.metaTitle || '');
    setFormMetaDesc(article.metaDescription || '');
    setFormMetaKeywords(article.metaKeywords || '');
    setFormCanonicalUrl(article.canonicalUrl || '');
    setFormHeadCode(article.headCode || '');
    setShowSeo(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      showToast('Article title is required', 'error');
      return;
    }
    if (!formCategory.trim()) {
      showToast('Please specify a category (you can type any custom category)', 'error');
      return;
    }
    if (!formContent || formContent === '<p></p>' || !formContent.trim()) {
      showToast('Article content cannot be empty', 'error');
      return;
    }

    setSaving(true);

    const payload = {
      id: editingArticle?.id,
      title: formTitle,
      titleAccent: formTitleAccent || null,
      category: formCategory,
      slug: formSlug,
      readTime: formReadTime,
      publishedAt: formPublishedAt ? new Date(formPublishedAt).toISOString() : new Date().toISOString(),
      authorName: formAuthorName,
      authorRole: formAuthorRole,
      authorAvatar: formAuthorAvatar,
      coverImage: formCoverImage,
      excerpt: formExcerpt,
      content: formContent,
      keyTakeaways: formTakeaways.split('\n').map((t) => t.replace(/^[-*]\s*/, '').trim()).filter(Boolean),
      tags: formTags.split(',').map((t) => t.trim()).filter(Boolean),
      featured: formFeatured,
      metaTitle: formMetaTitle || null,
      metaDescription: formMetaDesc || null,
      metaKeywords: formMetaKeywords || null,
      canonicalUrl: formCanonicalUrl || null,
      headCode: formHeadCode || null,
    };

    try {
      const method = editingArticle ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/insights', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        showToast(
          editingArticle ? 'Article updated successfully' : 'Article created successfully'
        );
        setEditingArticle(null);
        setIsCreating(false);
        fetchArticles();
      } else {
        showToast(data.error || 'Failed to save article', 'error');
      }
    } catch {
      showToast('Network error while saving article', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/insights?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showToast('Article deleted successfully');
        setDeleteConfirmId(null);
        fetchArticles();
      } else {
        showToast(data.error || 'Failed to delete article', 'error');
      }
    } catch {
      showToast('Network error while deleting article', 'error');
    }
  };

  const filteredArticles = articles.filter((a) => {
    const matchesCat =
      filterCategory === 'All' || a.category.toLowerCase() === filterCategory.toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      !q ||
      a.title.toLowerCase().includes(q) ||
      (a.titleAccent && a.titleAccent.toLowerCase().includes(q)) ||
      a.category.toLowerCase().includes(q) ||
      (a.excerpt && a.excerpt.toLowerCase().includes(q));
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl transition-all ${
            toast.type === 'success'
              ? 'bg-emerald-600 text-white'
              : 'bg-rose-600 text-white'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Articles &amp; Thought Leadership</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Dynamic Insights management. Add articles, manage official category taxonomy, and write with TipTap editor.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            href="/insights"
            target="_blank"
            className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/25 flex items-center gap-1.5 transition-colors"
          >
            <span>Live Blog</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={openCreateModal}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Article</span>
          </button>
        </div>
      </div>

      {/* Insight Categories & Topic Taxonomy Management Card */}
      <div
        className={`p-6 rounded-2xl border space-y-6 ${
          isDark ? 'bg-[#0B101D] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        {/* Category Header & Add Input */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-900 dark:text-white">
                  Insight Categories &amp; Topic Taxonomy
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {categories.length} Active
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage blog categories. These populate the article dropdown and display horizontally on the live blog.
              </p>
            </div>
          </div>

          {/* Add Category Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddCategory();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={categoryInputRef}
              type="text"
              placeholder="New category name..."
              value={newCategoryInput}
              onChange={(e) => setNewCategoryInput(e.target.value)}
              className={`px-3 py-2 rounded-xl border text-xs focus:ring-2 focus:ring-rose-500/20 focus:outline-none w-52 sm:w-64 transition-all ${
                isDark
                  ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            />
            <button
              type="submit"
              disabled={isSavingCategories}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 active:scale-95 disabled:opacity-50 text-white transition-all cursor-pointer shrink-0 shadow-xs hover:shadow-md"
            >
              {isSavingCategories ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Plus className="w-3.5 h-3.5" />
              )}
              <span>Add Category</span>
            </button>
          </form>
        </div>

        {/* Categories Showcase */}
        <div className="space-y-2">
          {categoryWarning && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-start justify-between gap-3 animate-fade-in shadow-xs">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-amber-900 dark:text-amber-100">Category in Use</p>
                  <p className="text-amber-800 dark:text-amber-300/90 leading-relaxed">{categoryWarning}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCategoryWarning(null)}
                className="text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200 p-1 rounded-md text-xs font-bold shrink-0 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Hover over the categories to manage them.
          </p>

          <div
            className={`p-5 rounded-2xl border transition-colors ${
              isDark
                ? 'bg-[#080C14]/80 border-slate-800'
                : 'bg-gradient-to-r from-slate-50 via-slate-100/60 to-slate-50 border-slate-200'
            }`}
          >
            <div
              className={`transition-all duration-300 ease-in-out ${
                !isCategoriesExpanded && hasMoreThanTwoRows
                  ? 'overflow-hidden'
                  : 'overflow-visible'
              }`}
              style={
                !isCategoriesExpanded && hasMoreThanTwoRows && twoRowsHeight
                  ? { maxHeight: `${twoRowsHeight}px` }
                  : undefined
              }
            >
              <div
                ref={categoriesContainerRef}
                className="flex flex-wrap items-center justify-start gap-2.5 sm:gap-3"
              >
                {categories.map((cat, index) => {
                  const isEditing = editingCategoryIndex === index;

                  if (isEditing) {
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-rose-500 bg-white dark:bg-slate-900 shadow-md ring-2 ring-rose-500/20"
                      >
                        <input
                          type="text"
                          autoFocus
                          value={editingCategoryValue}
                          onChange={(e) => setEditingCategoryValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleSaveEditCategory(index);
                            } else if (e.key === 'Escape') {
                              setEditingCategoryIndex(null);
                            }
                          }}
                          className="text-xs font-semibold bg-transparent border-none outline-none text-slate-900 dark:text-white w-36 sm:w-44"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveEditCategory(index)}
                          className="p-1 rounded-full text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                          title="Save name"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingCategoryIndex(null)}
                          className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                          title="Cancel"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={cat}
                      className="group relative px-4 py-2 rounded-full border border-slate-200 dark:border-white/20 bg-white dark:bg-white/[0.05] hover:bg-slate-50 dark:hover:bg-white/[0.1] hover:border-slate-300 dark:hover:border-white/40 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all duration-200 shadow-xs flex items-center gap-2"
                    >
                      <span>{cat}</span>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-1 pl-1.5 border-l border-slate-200 dark:border-white/10">
                        <button
                          type="button"
                          onClick={() => handleStartEditCategory(index)}
                          className="p-0.5 rounded text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                          title={`Rename "${cat}"`}
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(cat)}
                          className="p-0.5 rounded text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                          title={`Delete "${cat}"`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {hasMoreThanTwoRows && (
              <div className="flex items-center justify-center pt-3 mt-3 border-t border-slate-200/60 dark:border-slate-800/60">
                <button
                  type="button"
                  onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 transition-colors cursor-pointer"
                >
                  <span>
                    {isCategoriesExpanded
                      ? 'Show Less'
                      : `See All Categories (${categories.length})`}
                  </span>
                  {isCategoriesExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#0D1321] border border-slate-200 dark:border-white/10 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setFilterCategory('All')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors shrink-0 ${
              filterCategory === 'All'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
            }`}
          >
            All ({articles.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors shrink-0 ${
                filterCategory === cat
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
              }`}
            >
              {cat} ({articles.filter((a) => a.category === cat).length})
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-rose-500"
          />
        </div>
      </div>

      {/* Articles Grid / Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-rose-600 dark:text-sky-400" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading articles from database...</p>
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#0D1321] border border-slate-200 dark:border-white/10">
          <FileText className="w-12 h-12 text-slate-300 dark:text-white/20 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No articles found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Try choosing another category or create your first dynamic article by clicking &quot;Add Article&quot;.
          </p>
          <button
            onClick={openCreateModal}
            className="mt-4 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Article</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              className="rounded-2xl bg-white dark:bg-[#0D1321] border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col justify-between shadow-xs hover:border-slate-300 dark:hover:border-white/20 transition-all group"
            >
              <div>
                {/* Cover Image */}
                <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                  {article.coverImage ? (
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <ImageIcon className="w-8 h-8 opacity-40" />
                    </div>
                  )}

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/20">
                      {article.category}
                    </span>
                    {article.featured && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 flex items-center gap-1 shadow-xs">
                        <Star className="w-3 h-3 fill-current" />
                        <span>Featured</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Article Info */}
                <div className="p-5">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2 font-mono">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <Clock className="w-3 h-3" />
                    <span>{article.readTime}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 mb-2 group-hover:text-rose-600 dark:group-hover:text-sky-400 transition-colors">
                    {article.title}{' '}
                    {article.titleAccent && (
                      <i className="text-rose-600 dark:text-rose-400 font-light font-serif">
                        {article.titleAccent}
                      </i>
                    )}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-white/5 pt-3">
                    <User className="w-3.5 h-3.5" />
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {article.authorName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="px-5 py-3.5 bg-slate-50 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                <Link
                  href={`/insights/${article.slug}`}
                  target="_blank"
                  className="text-xs font-semibold text-rose-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </Link>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(article)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                    title="Edit article"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  {deleteConfirmId === article.id ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="px-2 py-1 rounded-md text-[11px] font-bold bg-rose-600 text-white hover:bg-rose-700 transition-colors"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-200"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(article.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      title="Delete article"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal / Drawer */}
      {(isCreating || editingArticle) && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-5xl bg-white dark:bg-[#0D1321] rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/40 flex items-center justify-center text-rose-600 dark:text-rose-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {editingArticle ? 'Edit Insight Article' : 'Create New Insight Article'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Full rich text editing, custom categories, accent styling, and SEO fields.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setEditingArticle(null);
                  setIsCreating(false);
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-grow">
              {/* Row 1: Title and Title Accent */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-8">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. How the right partnership becomes your"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="md:col-span-4">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Title Accent (Italicized)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. strongest growth channel"
                    value={formTitleAccent}
                    onChange={(e) => setFormTitleAccent(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 font-serif italic text-rose-600 dark:text-rose-400"
                  />
                </div>
              </div>

              {/* Row 2: Category & Slug & Read Time */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={formCategory || categories[0] || ''}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 font-medium cursor-pointer"
                  >
                    {formCategory && !categories.includes(formCategory) && (
                      <option value={formCategory} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                        {formCategory} (Legacy)
                      </option>
                    )}
                    {categories.map((c) => (
                      <option key={c} value={c} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                        {c}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                    Only active categories managed above are available for articles.
                  </p>
                </div>

                <div className="md:col-span-4">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Custom Slug
                  </label>
                  <input
                    type="text"
                    placeholder="leave blank to auto-generate"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Read Time
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 6 min read"
                    value={formReadTime}
                    onChange={(e) => setFormReadTime(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Row 3: Author and Published Date */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-4">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Author Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Team Mighty Warner"
                    value={formAuthorName}
                    onChange={(e) => setFormAuthorName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="md:col-span-4">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Author Role / Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Strategic Director"
                    value={formAuthorRole}
                    onChange={(e) => setFormAuthorRole(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="md:col-span-4">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Published Date
                  </label>
                  <input
                    type="date"
                    value={formPublishedAt}
                    onChange={(e) => setFormPublishedAt(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Row 4: Cover Image & Featured Toggle */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Cover Image URL
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formFeatured}
                      onChange={(e) => setFormFeatured(e.target.checked)}
                      className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300"
                    />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Feature on Home / Top of Blog
                    </span>
                  </label>
                </div>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={formCoverImage}
                  onChange={(e) => setFormCoverImage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Row 5: Excerpt */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Excerpt (Lead Summary for Blog Cards)
                </label>
                <textarea
                  rows={2}
                  placeholder="A practical look at how SEO, performance ads and social media work together..."
                  value={formExcerpt}
                  onChange={(e) => setFormExcerpt(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Row 6: Article Content with TipTap Rich Text Editor */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Article Content (Rich Text Editor) *
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Supports Headings (H1–H4), Lists, Blockquotes, Links, Tables &amp; Images
                  </span>
                </div>

                <div className="rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-xs">
                  <TipTapEditor
                    content={formContent}
                    onChange={(html) => setFormContent(html)}
                    isDark={isDark}
                  />
                </div>
              </div>

              {/* Row 7: Tags */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Tags (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="Strategy, SEO, Growth, B2B"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* SEO Collapsible Section */}
              <div className="rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowSeo(!showSeo)}
                  className="w-full p-4 bg-slate-50 dark:bg-white/[0.02] flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-rose-600 dark:text-sky-400" />
                    <span>Search Engine Optimization (SEO) &amp; Custom Head Code</span>
                  </span>
                  {showSeo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showSeo && (
                  <div className="p-5 space-y-4 bg-white dark:bg-[#0D1321]">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Meta Title
                      </label>
                      <input
                        type="text"
                        placeholder="Article title | The Mighty Blog"
                        value={formMetaTitle}
                        onChange={(e) => setFormMetaTitle(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Meta Description
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Search engine preview description..."
                        value={formMetaDesc}
                        onChange={(e) => setFormMetaDesc(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Meta Keywords
                      </label>
                      <input
                        type="text"
                        placeholder="seo, growth, b2b marketing, engineering"
                        value={formMetaKeywords}
                        onChange={(e) => setFormMetaKeywords(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Custom Head Code (JSON-LD Schema, Tracking Pixels, Meta Tags)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="<script type='application/ld+json'>{...}</script>"
                        value={formHeadCode}
                        onChange={(e) => setFormHeadCode(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingArticle(null);
                    setIsCreating(false);
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-2 shadow-sm disabled:opacity-50 transition-colors"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{editingArticle ? 'Save Changes' : 'Publish Article'}</span>
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
