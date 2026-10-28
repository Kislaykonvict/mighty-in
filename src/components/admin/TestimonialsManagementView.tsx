'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquareQuote,
  Save,
  RotateCcw,
  ExternalLink,
  Plus,
  Trash2,
  Upload,
  ChevronDown,
  ChevronUp,
  Star,
  Quote,
  CheckCircle2,
  AlertCircle,
  X,
  Monitor,
  Smartphone,
  Loader2,
  Sparkles,
  Building,
  User,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
} from 'lucide-react';
import { useAdminTheme } from './AdminThemeContext';
import {
  TestimonialsSectionData,
  defaultTestimonialsSectionData,
  TestimonialCard,
} from '@/types/testimonialsSection';
import { MinimalRichTextEditor } from './MinimalRichTextEditor';
import { uploadMedia } from '@/lib/clientUpload';

export function TestimonialsManagementView() {
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState<TestimonialsSectionData>(defaultTestimonialsSectionData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [uploadingCardId, setUploadingCardId] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Prompt before unload if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Fetch initial config
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/admin/testimonials?t=${Date.now()}`, {
          cache: 'no-store',
          headers: {
            'Pragma': 'no-cache',
            'Cache-Control': 'no-cache',
          },
        });
        const json = await res.json();
        if (json.success && json.data) {
          setFormData(json.data);
          if (json.data.cards && json.data.cards.length > 0) {
            setExpandedCardId(json.data.cards[0].id);
          }
        }
      } catch (err: any) {
        console.error('Failed to load testimonials:', err);
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

  // Header field change
  const handleFieldChange = <K extends keyof TestimonialsSectionData>(
    key: K,
    value: TestimonialsSectionData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  // Card field change
  const handleCardChange = (cardId: string, field: keyof TestimonialCard, value: any) => {
    setFormData((prev) => ({
      ...prev,
      cards: prev.cards.map((c) => (c.id === cardId ? { ...c, [field]: value } : c)),
    }));
    setIsDirty(true);
  };

  // Add new card
  const handleAddCard = () => {
    const newId = `testimonial-${Date.now()}`;
    const newCard: TestimonialCard = {
      id: newId,
      clientName: '',
      role: '',
      company: '',
      industry: '',
      quote: '',
      verticalId: 'technology',
      rating: 5,
      avatarUrl: '',
      featured: true,
      order: formData.cards.length,
    };

    setFormData((prev) => ({
      ...prev,
      cards: [...prev.cards, newCard],
    }));
    setIsDirty(true);
    setExpandedCardId(newId);
  };

  // Delete card
  const handleDeleteCard = (cardId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (formData.cards.length <= 1) {
      alert('You must have at least one testimonial card.');
      return;
    }
    if (confirm('Are you sure you want to delete this testimonial?')) {
      setFormData((prev) => ({
        ...prev,
        cards: prev.cards.filter((c) => c.id !== cardId),
      }));
      setIsDirty(true);
    }
  };

  // Reorder card up
  const handleMoveCardUp = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (index === 0) return;
    const newCards = [...formData.cards];
    const temp = newCards[index - 1];
    newCards[index - 1] = newCards[index];
    newCards[index] = temp;
    setFormData((prev) => ({ ...prev, cards: newCards }));
    setIsDirty(true);
  };

  // Reorder card down
  const handleMoveCardDown = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (index === formData.cards.length - 1) return;
    const newCards = [...formData.cards];
    const temp = newCards[index + 1];
    newCards[index + 1] = newCards[index];
    newCards[index] = temp;
    setFormData((prev) => ({ ...prev, cards: newCards }));
    setIsDirty(true);
  };

  // Upload author portrait photo
  const handlePhotoUpload = async (cardId: string, file: File) => {
    setUploadingCardId(cardId);
    try {
      const currentCard = formData.cards.find((c) => c.id === cardId);
      const result = await uploadMedia({
        file,
        folder: 'mighty-warner/testimonials',
        resourceType: 'image',
        previousUrl: currentCard?.avatarUrl || '',
      });

      handleCardChange(cardId, 'avatarUrl', result.url);
      setFeedback({
        type: 'success',
        message: 'Author portrait uploaded successfully to Cloudinary CDN!',
      });
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'Error uploading author photo',
      });
    } finally {
      setUploadingCardId(null);
    }
  };

  // Save changes
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/admin/testimonials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (json.success) {
        if (json.data) {
          setFormData(json.data);
        }
        setIsDirty(false);
        setFeedback({
          type: 'success',
          message: 'Testimonials section updated and published live to storefront!',
        });
      } else {
        throw new Error(json.error || 'Failed to save testimonials');
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'Error saving testimonials',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to default data
  const handleReset = () => {
    if (confirm('Reset testimonials section and cards to default system template?')) {
      setFormData(defaultTestimonialsSectionData);
      setIsDirty(true);
      setFeedback({
        type: 'success',
        message: 'Reset to default template. Click "Save & Publish" to commit changes to storefront.',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Loading testimonials configuration...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24 font-sans">
      {/* Sticky Top Header Container */}
      <div className="sticky top-[76px] z-20 space-y-3 pb-2 -mt-2 pt-2">
        {/* Feedback Banner */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs font-medium shadow-xl backdrop-blur-md ${
                feedback.type === 'success'
                  ? isDark
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : isDark
                  ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                  : 'bg-rose-50 border-rose-300 text-rose-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {feedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span>{feedback.message}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Header Bar */}
        <div
          className={`p-5 sm:p-6 rounded-2xl border shadow-lg backdrop-blur-xl transition-all ${
            isDark
              ? 'bg-[#0F172A]/95 border-slate-800 shadow-black/40'
              : 'bg-white/95 border-slate-200 shadow-slate-200/50'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <MessageSquareQuote className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight">Testimonials & Social Proof</h1>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      formData.isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {formData.isActive ? 'Active on Home' : 'Hidden'}
                  </span>
                </div>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Configure executive endorsements, full-height fading portraits, quotes, and 3D stack
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href="/"
                target="_blank"
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  isDark
                    ? 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-300'
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                }`}
              >
                <span>Live Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <button
                type="button"
                onClick={handleReset}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isDark
                    ? 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-300'
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <button
                type="button"
                onClick={() => handleSave()}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-sky-500 hover:bg-sky-400 shadow-lg shadow-sky-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save & Publish</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form Configuration Layout */}
      <div className="max-w-4xl mx-auto space-y-6">
          {/* Section 1: Section Header Details */}
          <div
            className={`p-6 rounded-2xl border transition-all ${
              isDark
                ? 'bg-[#0F172A]/80 border-slate-800 shadow-xl'
                : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b mb-5 border-slate-700/40">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-400" />
                <h2 className="text-sm font-bold tracking-tight">Section Headline & Metadata</h2>
              </div>

              {/* Active Toggle */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Section Visibility
                </span>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => handleFieldChange('isActive', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-500 relative" />
              </label>
            </div>

            <div className="space-y-4">
              {/* Eyebrow / Badge */}
              <div>
                <label
                  className={`block text-xs font-semibold mb-1.5 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  Section Eyebrow Badge
                </label>
                <MinimalRichTextEditor
                  value={formData.badge}
                  onChange={(val) => handleFieldChange('badge', val)}
                  placeholder="e.g. CLIENT REPUTATION & PROOF"
                  variant="inline"
                />
              </div>

              {/* Title */}
              <div>
                <label
                  className={`block text-xs font-semibold mb-1.5 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  Section Main Headline
                </label>
                <MinimalRichTextEditor
                  value={formData.title}
                  onChange={(val) => handleFieldChange('title', val)}
                  placeholder="e.g. Endorsed by executive leadership."
                  variant="inline"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label
                  className={`block text-xs font-semibold mb-1.5 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  Section Subtitle / Description
                </label>
                <MinimalRichTextEditor
                  value={formData.subtitle}
                  onChange={(val) => handleFieldChange('subtitle', val)}
                  placeholder="Supporting narrative describing your client proof and reputation..."
                  variant="multiline"
                  minHeight="68px"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Testimonial Cards Manager */}
          <div
            className={`p-6 rounded-2xl border transition-all ${
              isDark
                ? 'bg-[#0F172A]/80 border-slate-800 shadow-xl'
                : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b mb-5 border-slate-700/40">
              <div className="flex items-center gap-2">
                <Quote className="w-4 h-4 text-sky-400" />
                <h2 className="text-sm font-bold tracking-tight">
                  Testimonial Cards ({formData.cards.length})
                </h2>
              </div>

              <button
                type="button"
                onClick={handleAddCard}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Testimonial</span>
              </button>
            </div>

            {/* List of Cards Accordion */}
            <div className="space-y-4">
              {formData.cards.map((card, index) => {
                const isExpanded = expandedCardId === card.id;

                return (
                  <div
                    key={card.id}
                    className={`rounded-xl border transition-all overflow-hidden ${
                      isDark
                        ? isExpanded
                          ? 'bg-slate-900/90 border-sky-500/40 shadow-lg'
                          : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                        : isExpanded
                        ? 'bg-slate-50 border-sky-400 shadow-sm'
                        : 'bg-slate-50/50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* Card Accordion Header */}
                    <div
                      onClick={() => {
                        setExpandedCardId(isExpanded ? null : card.id);
                      }}
                      className="p-4 flex items-center justify-between gap-3 cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Order pill */}
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold shrink-0 ${
                            isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {index + 1}
                        </div>

                        {/* Thumbnail */}
                        {card.avatarUrl ? (
                          <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-white/10 shrink-0">
                            <Image
                              src={card.avatarUrl}
                              alt={card.clientName}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-white text-xs shrink-0">
                            {card.clientName ? card.clientName.charAt(0) : '#'}
                          </div>
                        )}

                        <div className="min-w-0">
                          <div className="text-xs font-bold truncate">
                            {card.clientName || `Testimonial #${index + 1}`}
                          </div>
                          {(card.role || card.company) && (
                            <div
                              className={`text-[11px] truncate ${
                                isDark ? 'text-slate-400' : 'text-slate-500'
                              }`}
                            >
                              {[card.role, card.company].filter(Boolean).join(' • ')}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Controls: Up/Down, Delete, Expand */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={(e) => handleMoveCardUp(index, e)}
                          className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move card up"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={index === formData.cards.length - 1}
                          onClick={(e) => handleMoveCardDown(index, e)}
                          className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move card down"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteCard(card.id, e)}
                          className="p-1 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors ml-1"
                          title="Delete card"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="text-slate-400 pl-1">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-sky-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Card Editor */}
                    {isExpanded && (
                      <div
                        className={`p-5 border-t space-y-4 ${
                          isDark
                            ? 'border-slate-800 bg-slate-950/40'
                            : 'border-slate-200 bg-white/60'
                        }`}
                      >
                        {/* Row 1: Author Portrait Upload & URL */}
                        <div className="p-4 rounded-xl border border-dashed border-sky-500/30 bg-sky-500/[0.02]">
                          <label
                            className={`block text-xs font-semibold mb-2 flex items-center gap-1.5 ${
                              isDark ? 'text-slate-200' : 'text-slate-800'
                            }`}
                          >
                            <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
                            <span>Author Portrait Photo (Full-Height Fading Column)</span>
                          </label>

                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            {/* Preview Thumbnail */}
                            {card.avatarUrl ? (
                              <div className="relative w-16 h-20 rounded-xl overflow-hidden border border-white/15 shadow-md shrink-0">
                                <Image
                                  src={card.avatarUrl}
                                  alt={card.clientName}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-16 h-20 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 text-xs shrink-0 border border-dashed border-slate-700">
                                No Photo
                              </div>
                            )}

                            <div className="flex-1 w-full space-y-2">
                              {/* Direct URL input */}
                              <input
                                type="text"
                                value={card.avatarUrl || ''}
                                onChange={(e) =>
                                  handleCardChange(card.id, 'avatarUrl', e.target.value)
                                }
                                placeholder="Paste image URL (Unsplash or direct image URL)..."
                                className={`w-full px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                                  isDark
                                    ? 'bg-slate-900 border-slate-700 text-white focus:border-sky-400'
                                    : 'bg-white border-slate-300 text-slate-900 focus:border-sky-500'
                                }`}
                              />

                              {/* Upload from Computer */}
                              <div className="flex items-center gap-2">
                                <input
                                  type="file"
                                  ref={(el) => {
                                    fileInputRefs.current[card.id] = el;
                                  }}
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handlePhotoUpload(card.id, file);
                                  }}
                                />

                                <button
                                  type="button"
                                  disabled={uploadingCardId === card.id}
                                  onClick={() => fileInputRefs.current[card.id]?.click()}
                                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer disabled:opacity-50"
                                >
                                  {uploadingCardId === card.id ? (
                                    <>
                                      <Loader2 className="w-3 h-3 animate-spin text-sky-400" />
                                      <span>Uploading...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Upload className="w-3 h-3 text-sky-400" />
                                      <span>Upload from Computer</span>
                                    </>
                                  )}
                                </button>

                                {card.avatarUrl && (
                                  <button
                                    type="button"
                                    onClick={() => handleCardChange(card.id, 'avatarUrl', '')}
                                    className="text-xs text-rose-400 hover:underline cursor-pointer"
                                  >
                                    Remove Photo
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Row 2: Client Name & Executive Role */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label
                              className={`block text-xs font-semibold mb-1 ${
                                isDark ? 'text-slate-300' : 'text-slate-700'
                              }`}
                            >
                              Author Full Name
                            </label>
                            <input
                              type="text"
                              value={card.clientName}
                              onChange={(e) =>
                                handleCardChange(card.id, 'clientName', e.target.value)
                              }
                              placeholder="e.g. Marcus Vance"
                              className={`w-full px-3 py-2 rounded-lg text-xs font-medium border ${
                                isDark
                                  ? 'bg-slate-900 border-slate-700 text-white focus:border-sky-400'
                                  : 'bg-white border-slate-300 text-slate-900 focus:border-sky-500'
                              }`}
                            />
                          </div>

                          <div>
                            <label
                              className={`block text-xs font-semibold mb-1 ${
                                isDark ? 'text-slate-300' : 'text-slate-700'
                              }`}
                            >
                              Executive Role / Title
                            </label>
                            <input
                              type="text"
                              value={card.role}
                              onChange={(e) => handleCardChange(card.id, 'role', e.target.value)}
                              placeholder="e.g. Chief Marketing Officer"
                              className={`w-full px-3 py-2 rounded-lg text-xs font-medium border ${
                                isDark
                                  ? 'bg-slate-900 border-slate-700 text-white focus:border-sky-400'
                                  : 'bg-white border-slate-300 text-slate-900 focus:border-sky-500'
                              }`}
                            />
                          </div>
                        </div>

                        {/* Row 3: Company & Industry */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label
                              className={`block text-xs font-semibold mb-1 ${
                                isDark ? 'text-slate-300' : 'text-slate-700'
                              }`}
                            >
                              Enterprise Company
                            </label>
                            <input
                              type="text"
                              value={card.company}
                              onChange={(e) =>
                                handleCardChange(card.id, 'company', e.target.value)
                              }
                              placeholder="e.g. Strata Financial Group"
                              className={`w-full px-3 py-2 rounded-lg text-xs font-medium border ${
                                isDark
                                  ? 'bg-slate-900 border-slate-700 text-white focus:border-sky-400'
                                  : 'bg-white border-slate-300 text-slate-900 focus:border-sky-500'
                              }`}
                            />
                          </div>

                          <div>
                            <label
                              className={`block text-xs font-semibold mb-1 ${
                                isDark ? 'text-slate-300' : 'text-slate-700'
                              }`}
                            >
                              Industry Tag
                            </label>
                            <input
                              type="text"
                              value={card.industry}
                              onChange={(e) =>
                                handleCardChange(card.id, 'industry', e.target.value)
                              }
                              placeholder="e.g. Financial Services & Wealth Management"
                              className={`w-full px-3 py-2 rounded-lg text-xs font-medium border ${
                                isDark
                                  ? 'bg-slate-900 border-slate-700 text-white focus:border-sky-400'
                                  : 'bg-white border-slate-300 text-slate-900 focus:border-sky-500'
                              }`}
                            />
                          </div>
                        </div>

                        {/* Row 4: Star Rating & Vertical */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                          <div>
                            <label
                              className={`block text-xs font-semibold mb-1.5 ${
                                isDark ? 'text-slate-300' : 'text-slate-700'
                              }`}
                            >
                              Star Rating (1 to 5)
                            </label>
                            <div className="flex items-center gap-1.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => handleCardChange(card.id, 'rating', star)}
                                  className="p-1 hover:scale-110 transition-transform cursor-pointer"
                                >
                                  <Star
                                    className={`w-5 h-5 ${
                                      star <= (card.rating || 5)
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'text-slate-600'
                                    }`}
                                  />
                                </button>
                              ))}
                              <span className="text-xs font-mono ml-2 text-slate-400">
                                {card.rating || 5}/5
                              </span>
                            </div>
                          </div>

                          <div>
                            <label
                              className={`block text-xs font-semibold mb-1 ${
                                isDark ? 'text-slate-300' : 'text-slate-700'
                              }`}
                            >
                              Business Vertical
                            </label>
                            <select
                              value={card.verticalId}
                              onChange={(e) =>
                                handleCardChange(card.id, 'verticalId', e.target.value)
                              }
                              className={`w-full px-3 py-2 rounded-lg text-xs font-medium border ${
                                isDark
                                  ? 'bg-slate-900 border-slate-700 text-white focus:border-sky-400'
                                  : 'bg-white border-slate-300 text-slate-900 focus:border-sky-500'
                              }`}
                            >
                              <option value="digital-growth">Digital & Growth</option>
                              <option value="technology">Technology</option>
                              <option value="talent-solutions">Talent Solutions</option>
                            </select>
                          </div>
                        </div>

                        {/* Row 5: Testimonial Quote */}
                        <div>
                          <label
                            className={`block text-xs font-semibold mb-1 ${
                              isDark ? 'text-slate-300' : 'text-slate-700'
                            }`}
                          >
                            Testimonial Endorsement Quote
                          </label>
                          <MinimalRichTextEditor
                            value={card.quote}
                            onChange={(val) => handleCardChange(card.id, 'quote', val)}
                            placeholder="Quote text describing outcomes, impact, and executive feedback..."
                            variant="multiline"
                            minHeight="72px"
                          />
                        </div>

                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
  );
}
