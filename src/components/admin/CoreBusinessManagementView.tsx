'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Building2,
  Save,
  RotateCcw,
  ExternalLink,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Layers,
  Type,
  Sparkles,
} from 'lucide-react';
import { useAdminTheme } from './AdminThemeContext';
import { CoreBusinessData, CoreBusinessCard, defaultCoreBusinessData } from '@/types/coreBusiness';
import { MinimalRichTextEditor } from './MinimalRichTextEditor';

export function CoreBusinessManagementView() {
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState<CoreBusinessData>(defaultCoreBusinessData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingCardId, setUploadingCardId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Fetch initial data
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/admin/core-business');
        const json = await res.json();
        if (json.success && json.data) {
          setFormData(json.data);
        }
      } catch (err) {
        console.error('Failed to load core business data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleFieldChange = (field: keyof CoreBusinessData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCardChange = (cardId: string, field: keyof CoreBusinessCard, value: any) => {
    setFormData((prev) => ({
      ...prev,
      cards: prev.cards.map((card) => (card.id === cardId ? { ...card, [field]: value } : card)),
    }));
  };

  const handleAddCard = () => {
    const nextIdx = formData.cards.length + 1;
    const newCard: CoreBusinessCard = {
      id: `card-${Date.now()}`,
      indexNumber: String(nextIdx).padStart(2, '0'),
      title: `New Service ${nextIdx}`,
      description: 'Enter a compelling description of this capability, deliverable, or technical pod.',
      ctaText: 'more information',
      ctaLink: '/businesses',
      imageUrl: null,
      diagramType: 'sitemap',
    };
    setFormData((prev) => ({
      ...prev,
      cards: [...prev.cards, newCard],
    }));
  };

  const handleDeleteCard = (cardId: string) => {
    if (formData.cards.length <= 1) {
      alert('You must have at least one business card in the showcase.');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      cards: prev.cards
        .filter((c) => c.id !== cardId)
        .map((c, i) => ({ ...c, indexNumber: String(i + 1).padStart(2, '0') })),
    }));
  };

  const handleMoveCard = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= formData.cards.length) return;

    const updated = [...formData.cards];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);

    // Auto-update index numbers
    const reindexed = updated.map((c, i) => ({
      ...c,
      indexNumber: String(i + 1).padStart(2, '0'),
    }));

    setFormData((prev) => ({ ...prev, cards: reindexed }));
  };

  // Upload image/diagram for a specific card
  const handleDiagramUpload = async (cardId: string, file: File) => {
    setUploadingCardId(cardId);
    setFeedback(null);

    try {
      const data = new FormData();
      data.append('file', file);
      data.append('folder', 'mighty-warner/core-business');
      data.append('resource_type', 'image');

      const currentCard = formData.cards.find((c) => c.id === cardId);
      if (currentCard?.imageUrl) {
        data.append('previousUrl', currentCard.imageUrl);
      }

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: data,
      });

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error || 'Upload failed');
      }

      handleCardChange(cardId, 'imageUrl', json.url);
      setFeedback({
        type: 'success',
        message: 'Diagram image uploaded successfully to Cloudinary!',
      });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error uploading card diagram' });
    } finally {
      setUploadingCardId(null);
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/admin/core-business', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (json.success) {
        setFeedback({
          type: 'success',
          message: 'Core Business section saved & published to live storefront!',
        });
      } else {
        throw new Error(json.error || 'Failed to save core business section');
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error saving core business' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset Core Business section to default values?')) {
      setFormData(defaultCoreBusinessData);
      setFeedback({
        type: 'success',
        message: 'Reset to defaults (click Save & Publish to apply to live site)',
      });
    }
  };



  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      {/* Top Header Card */}
      <div
        className={`p-6 rounded-2xl border transition-all ${isDark
            ? 'bg-[#0F172A]/80 border-slate-800 shadow-xl'
            : 'bg-white border-slate-200 shadow-sm'
          }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight">Core Business Showcase</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1.5">
                  {isLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                  {isLoading ? 'Syncing...' : 'Dynamic Showcase'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage scroll stacking cards, headline copy, custom diagram uploads, and call-to-actions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${isDark
                  ? 'border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700'
                  : 'border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${isDark
                  ? 'border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700'
                  : 'border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Live</span>
            </Link>

            <button
              type="button"
              onClick={() => handleSave()}
              disabled={isSaving}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/25 flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-50"
            >
              <Save className={`w-3.5 h-3.5 ${isSaving ? 'animate-spin' : ''}`} />
              <span>{isSaving ? 'Publishing...' : 'Save & Publish'}</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`mt-4 p-3 rounded-xl text-xs font-medium flex items-center justify-between border ${feedback.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
              }`}
          >
            <div className="flex items-center gap-2">
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="p-1 hover:opacity-75 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Centered Form Editor */}
      <form onSubmit={handleSave} className="max-w-4xl mx-auto space-y-6">
          {/* Section 1: Top Headline & Copy */}
          <div
            className={`p-6 rounded-2xl border space-y-5 shadow-sm ${isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200'
              }`}
          >
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-sm font-bold">
                <Type className="w-4 h-4 text-indigo-400" />
                <span>Section Header & Title</span>
              </div>
            </div>

            {/* Main Title (Headline) */}
            <div>
              <label className="block text-xs font-bold mb-1.5">
                Main Title Headline (All Caps Centered)
              </label>
              <MinimalRichTextEditor
                value={formData.title}
                onChange={(val) => handleFieldChange('title', val)}
                placeholder="CORE BUSINESSES"
                variant="inline"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Eyebrow Badge (optional) */}
              <div>
                <label className="block text-xs font-bold mb-1.5">Eyebrow Pill Badge (Optional)</label>
                <MinimalRichTextEditor
                  value={formData.badge || ''}
                  onChange={(val) => handleFieldChange('badge', val)}
                  placeholder="WHAT WE DO"
                  variant="inline"
                />
              </div>

              {/* Subtitle (optional) */}
              <div>
                <label className="block text-xs font-bold mb-1.5">Section Subtitle (Optional)</label>
                <MinimalRichTextEditor
                  value={formData.subtitle || ''}
                  onChange={(val) => handleFieldChange('subtitle', val)}
                  placeholder="Three integrated disciplines engineered for commercial growth."
                  variant="inline"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Stacking Cards Manager */}
          <div
            className={`p-6 rounded-2xl border space-y-5 shadow-sm ${isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200'
              }`}
          >
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-sm font-bold">
                <Layers className="w-4 h-4 text-rose-500" />
                <span>Showcase Cards ({formData.cards.length})</span>
              </div>
              <button
                type="button"
                onClick={handleAddCard}
                className="px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1 cursor-pointer transition-all shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Card</span>
              </button>
            </div>

            <div className="space-y-4">
              {formData.cards.map((card, idx) => {
                const isUploading = uploadingCardId === card.id;

                return (
                  <div
                    key={card.id}
                    className={`p-4 rounded-xl border transition-all ${isDark
                        ? 'bg-slate-800/50 border-slate-700/80 hover:border-slate-600'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                  >
                    {/* Card Header & Controls */}
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80 dark:border-slate-700/80">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-rose-500 font-mono">
                          #{card.indexNumber || String(idx + 1).padStart(2, '0')}
                        </span>
                        <span
                          className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'
                            }`}
                        >
                          {card.title || `Card #${idx + 1}`}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        {/* Move Up */}
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveCard(idx, 'up')}
                          className="p-1 text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:hover:text-slate-400 cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        {/* Move Down */}
                        <button
                          type="button"
                          disabled={idx === formData.cards.length - 1}
                          onClick={() => handleMoveCard(idx, 'down')}
                          className="p-1 text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:hover:text-slate-400 cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        {/* Delete Card */}
                        <button
                          type="button"
                          onClick={() => handleDeleteCard(card.id)}
                          className={`p-1 cursor-pointer transition-colors ${isDark ? 'text-slate-400 hover:text-rose-400' : 'text-slate-400 hover:text-rose-600'
                            }`}
                          title="Delete Card"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-3">
                      {/* Index Number */}
                      <div>
                        <label
                          className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'
                            }`}
                        >
                          Index (e.g. 01)
                        </label>
                        <input
                          type="text"
                          value={card.indexNumber}
                          onChange={(e) => handleCardChange(card.id, 'indexNumber', e.target.value)}
                          placeholder="01"
                          className={`w-full px-3 py-2 rounded-lg text-xs font-mono font-bold text-rose-500 transition-all focus:outline-none border ${isDark
                              ? 'bg-slate-900 border-slate-700 focus:border-indigo-500'
                              : 'bg-white border-slate-300 focus:border-indigo-600'
                            }`}
                        />
                      </div>

                      {/* Title */}
                      <div className="sm:col-span-3">
                        <label
                          className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'
                            }`}
                        >
                          Card Title
                        </label>
                        <MinimalRichTextEditor
                          value={card.title}
                          onChange={(val) => handleCardChange(card.id, 'title', val)}
                          placeholder="Digital & Growth"
                          variant="inline"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-3">
                      <label
                        className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'
                          }`}
                      >
                        Description
                      </label>
                      <MinimalRichTextEditor
                        value={card.description}
                        onChange={(val) => handleCardChange(card.id, 'description', val)}
                        placeholder="Detail the capabilities and value proposition of this business vertical..."
                        variant="multiline"
                        minHeight="68px"
                      />
                    </div>

                    {/* CTA Button Text & Link */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      <div>
                        <label
                          className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'
                            }`}
                        >
                          Button Text
                        </label>
                        <input
                          type="text"
                          value={card.ctaText}
                          onChange={(e) => handleCardChange(card.id, 'ctaText', e.target.value)}
                          placeholder="more information"
                          className={`w-full px-3 py-2 rounded-lg text-xs transition-all focus:outline-none border ${isDark
                              ? 'bg-slate-900 border-slate-700 text-white focus:border-indigo-500'
                              : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-600'
                            }`}
                        />
                      </div>

                      <div>
                        <label
                          className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'
                            }`}
                        >
                          Button Link
                        </label>
                        <input
                          type="text"
                          value={card.ctaLink}
                          onChange={(e) => handleCardChange(card.id, 'ctaLink', e.target.value)}
                          placeholder="/businesses/digital-growth"
                          className={`w-full px-3 py-2 rounded-lg text-xs font-mono transition-all focus:outline-none border ${isDark
                              ? 'bg-slate-900 border-slate-700 text-white focus:border-indigo-500'
                              : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-600'
                            }`}
                        />
                      </div>
                    </div>

                    {/* Right-Side Media / Diagram Controls */}
                    <div
                      className={`p-3 rounded-xl border space-y-2.5 transition-all ${isDark
                          ? 'bg-slate-900/60 border-slate-700/60'
                          : 'bg-slate-100/90 border-slate-200'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[11px] font-bold flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'
                            }`}
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Card Visual Picture (Cloudinary)</span>
                        </span>

                        {card.imageUrl && (
                          <button
                            type="button"
                            onClick={() => handleCardChange(card.id, 'imageUrl', null)}
                            className="text-[10px] text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 font-medium cursor-pointer"
                          >
                            Remove Picture
                          </button>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        {/* Current Display Preview */}
                        <div
                          className={`w-20 h-14 rounded-xl border flex items-center justify-center shrink-0 overflow-hidden ${
                            isDark
                              ? 'bg-slate-800 border-white/10 text-slate-200'
                              : 'bg-white border-slate-300 text-slate-700 shadow-xs'
                          }`}
                        >
                          {card.imageUrl ? (
                            <img
                              src={card.imageUrl}
                              alt={card.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-center p-1">
                              <ImageIcon className="w-5 h-5 mx-auto text-slate-400" />
                              <span className="text-[9px] text-slate-400 block mt-0.5">No image</span>
                            </div>
                          )}
                        </div>

                        {/* File Upload Dropzone / Button */}
                        <div className="space-y-1">
                          <input
                            type="file"
                            accept="image/png,image/svg+xml,image/jpeg,image/webp"
                            ref={(el) => {
                              fileInputRefs.current[card.id] = el;
                            }}
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleDiagramUpload(card.id, file);
                            }}
                          />

                          <button
                            type="button"
                            disabled={isUploading}
                            onClick={() => fileInputRefs.current[card.id]?.click()}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 cursor-pointer transition-all ${
                              card.imageUrl
                                ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-600/30'
                                : isDark
                                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
                                : 'bg-white border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-50 shadow-xs'
                            }`}
                          >
                            {isUploading ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Upload className="w-3.5 h-3.5" />
                            )}
                            <span>{card.imageUrl ? 'Replace Picture' : 'Upload Card Picture (Cloudinary)'}</span>
                          </button>

                          <p className="text-[10px] text-slate-400 leading-tight">
                            When uploaded, this image extends across the entire card as an immersive cover. If empty, text smoothly expands.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              <Save className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
              <span>{isSaving ? 'Publishing to Storefront...' : 'Save & Publish Core Business'}</span>
            </button>
          </div>
        </form>
    </div>
  );
}
