'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Award,
  FileText,
  Globe,
  Users,
  ShieldCheck,
  TrendingUp,
  Zap,
  Building2,
  Sparkles,
  Layers,
  Save,
  RotateCcw,
  ExternalLink,
  Plus,
  Trash2,
  Upload,
  Eye,
  Monitor,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  X,
  Type,
  Tag,
  ImageIcon,
  Loader2,
} from 'lucide-react';
import { useAdminTheme } from './AdminThemeContext';
import { defaultTrackRecordData, TrackRecordData, TrackRecordCard } from '@/types/trackRecord';
import { MinimalRichTextEditor } from './MinimalRichTextEditor';

// Icon mapping for presets
const ICON_COMPONENTS: Record<string, React.ElementType> = {
  Award,
  FileText,
  Globe,
  Users,
  ShieldCheck,
  TrendingUp,
  Zap,
  Building2,
  Sparkles,
  Layers,
};

const PRESET_ICONS = [
  'Award',
  'FileText',
  'Globe',
  'Users',
  'ShieldCheck',
  'TrendingUp',
  'Zap',
  'Building2',
  'Sparkles',
  'Layers',
];

export function TrackRecordManagementView() {
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState<TrackRecordData>(defaultTrackRecordData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [newIndustry, setNewIndustry] = useState('');
  const [uploadingCardId, setUploadingCardId] = useState<string | null>(null);

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Fetch track record config
  useEffect(() => {
    async function loadConfig() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/admin/track-record');
        const json = await res.json();
        if (json.success && json.data) {
          setFormData(json.data);
        }
      } catch (err: any) {
        console.error('Failed to load track record config:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadConfig();
  }, []);

  const handleFieldChange = <K extends keyof TrackRecordData>(key: K, value: TrackRecordData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleCardChange = (cardId: string, field: keyof TrackRecordCard, value: any) => {
    setFormData((prev) => ({
      ...prev,
      cards: prev.cards.map((c) => (c.id === cardId ? { ...c, [field]: value } : c)),
    }));
  };

  const handleAddCard = () => {
    const newCard: TrackRecordCard = {
      id: `stat-${Date.now()}`,
      value: '100+',
      label: 'New Metric',
      subtext: 'High-impact enterprise delivery',
      iconName: 'Award',
      iconUrl: null,
      tag: 'VERIFIED',
    };
    setFormData((prev) => ({
      ...prev,
      cards: [...prev.cards, newCard],
    }));
  };

  const handleDeleteCard = (cardId: string) => {
    if (formData.cards.length <= 1) {
      alert('You must have at least one metric card.');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      cards: prev.cards.filter((c) => c.id !== cardId),
    }));
  };

  // Upload custom logo for a card
  const handleLogoUpload = async (cardId: string, file: File) => {
    setUploadingCardId(cardId);
    try {
      const data = new FormData();
      data.append('file', file);
      data.append('folder', 'mighty-warner/track-record');
      data.append('resource_type', 'image');

      const currentCard = formData.cards.find((c) => c.id === cardId);
      if (currentCard?.iconUrl) {
        data.append('previousUrl', currentCard.iconUrl);
      }

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: data,
      });

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error || 'Upload failed');
      }

      handleCardChange(cardId, 'iconUrl', json.url);
      setFeedback({
        type: 'success',
        message: 'Logo icon uploaded successfully to Cloudinary!',
      });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error uploading card logo' });
    } finally {
      setUploadingCardId(null);
    }
  };

  // Add an industry pill
  const handleAddIndustry = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newIndustry.trim();
    if (!trimmed) return;
    if (formData.industries.includes(trimmed)) {
      setNewIndustry('');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      industries: [...prev.industries, trimmed],
    }));
    setNewIndustry('');
  };

  // Remove an industry pill
  const handleRemoveIndustry = (ind: string) => {
    setFormData((prev) => ({
      ...prev,
      industries: prev.industries.filter((item) => item !== ind),
    }));
  };

  // Save to DB
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/admin/track-record', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (json.success) {
        setFeedback({
          type: 'success',
          message: 'Proven Track Record section saved & published to live storefront!',
        });
      } else {
        throw new Error(json.error || 'Failed to save track record');
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error saving track record' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset track record section fields to defaults?')) {
      setFormData(defaultTrackRecordData);
      setFeedback({
        type: 'success',
        message: 'Reset to default track record data (click Save & Publish to apply to live site)',
      });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      {/* Top Header Card */}
      <div
        className={`p-6 rounded-2xl border transition-all ${
          isDark
            ? 'bg-[#0F172A]/80 border-slate-800 shadow-xl'
            : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight">Proven Track Record Section</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Dynamic CMS
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage institutional stats, custom card logos, two-line headlines, and trusted industry sectors
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                isDark
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
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                isDark
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
            className={`mt-4 p-3 rounded-xl text-xs font-medium flex items-center justify-between border ${
              feedback.type === 'success'
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

      {/* Main Form Editor */}
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: Header & Typography */}
          <div
            className={`p-6 rounded-2xl border space-y-5 shadow-sm ${
              isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-sm font-bold">
                <Type className="w-4 h-4 text-emerald-400" />
                <span>Section Header & Headline</span>
              </div>
            </div>

            {/* Eyebrow Badge Text */}
            <div>
              <label className="block text-xs font-bold mb-1.5">Eyebrow Pill Badge</label>
              <MinimalRichTextEditor
                value={formData.badge}
                onChange={(val) => handleFieldChange('badge', val)}
                placeholder="PROVEN TRACK RECORD"
                variant="inline"
              />
            </div>

            {/* Two-Line Headline (Per User Selection) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1.5">Headline Line 1</label>
                <MinimalRichTextEditor
                  value={formData.headlineLine1}
                  onChange={(val) => handleFieldChange('headlineLine1', val)}
                  placeholder="Building businesses"
                  variant="inline"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5">Headline Line 2</label>
                <MinimalRichTextEditor
                  value={formData.headlineLine2}
                  onChange={(val) => handleFieldChange('headlineLine2', val)}
                  placeholder="since 2013."
                  variant="inline"
                />
              </div>
            </div>

            {/* Description Subtitle */}
            <div>
              <label className="block text-xs font-bold mb-1.5">Institutional Track Record Description</label>
              <MinimalRichTextEditor
                value={formData.subtitle}
                onChange={(val) => handleFieldChange('subtitle', val)}
                placeholder="Verified institutional track record across enterprise software delivery..."
                variant="multiline"
                minHeight="72px"
              />
            </div>
          </div>

          {/* Section 2: Metric Cards (Dynamic + Logo Upload) */}
          <div
            className={`p-6 rounded-2xl border space-y-5 shadow-sm ${
              isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-sm font-bold">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>Metric Cards ({formData.cards.length})</span>
              </div>
              <button
                type="button"
                onClick={handleAddCard}
                className="px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1 cursor-pointer transition-all shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Metric Card</span>
              </button>
            </div>

            <div className="space-y-4">
              {formData.cards.map((card, idx) => {
                const IconComponent = ICON_COMPONENTS[card.iconName || 'Award'] || Award;
                const isUploading = uploadingCardId === card.id;

                return (
                  <div
                    key={card.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isDark
                        ? 'bg-slate-800/50 border-slate-700/80 hover:border-slate-600'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* Card Card Header */}
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80 dark:border-slate-700/80">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-5 h-5 rounded-full text-[10px] font-mono flex items-center justify-center font-bold ${
                            isDark ? 'bg-slate-700/70 text-slate-300' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <span
                          className={`text-xs font-bold ${
                            isDark ? 'text-slate-200' : 'text-slate-800'
                          }`}
                        >
                          {card.label || `Card #${idx + 1}`}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteCard(card.id)}
                        className={`p-1 cursor-pointer transition-colors ${
                          isDark ? 'text-slate-400 hover:text-rose-400' : 'text-slate-400 hover:text-rose-600'
                        }`}
                        title="Delete Card"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      {/* Metric Value */}
                      <div>
                        <label
                          className={`block text-[11px] font-bold mb-1 ${
                            isDark ? 'text-slate-400' : 'text-slate-600'
                          }`}
                        >
                          Metric Value (e.g. 13+, 450+, 98%)
                        </label>
                        <input
                          type="text"
                          value={card.value}
                          onChange={(e) => handleCardChange(card.id, 'value', e.target.value)}
                          placeholder="13+"
                          className={`w-full px-3 py-2 rounded-lg text-sm font-black transition-all focus:outline-none border ${
                            isDark
                              ? 'bg-slate-900 border-slate-700 text-white focus:border-indigo-500'
                              : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-600'
                          }`}
                        />
                      </div>

                      {/* Title / Label */}
                      <div>
                        <label
                          className={`block text-[11px] font-bold mb-1 ${
                            isDark ? 'text-slate-400' : 'text-slate-600'
                          }`}
                        >
                          Card Title / Label
                        </label>
                        <MinimalRichTextEditor
                          value={card.label}
                          onChange={(val) => handleCardChange(card.id, 'label', val)}
                          placeholder="Years in Business"
                          variant="inline"
                        />
                      </div>
                    </div>

                    {/* Subtext & Verification Tag */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                      <div className="sm:col-span-2">
                        <label
                          className={`block text-[11px] font-bold mb-1 ${
                            isDark ? 'text-slate-400' : 'text-slate-600'
                          }`}
                        >
                          Subtext / Description
                        </label>
                        <MinimalRichTextEditor
                          value={card.subtext}
                          onChange={(val) => handleCardChange(card.id, 'subtext', val)}
                          placeholder="Continuous innovation since 2013"
                          variant="inline"
                        />
                      </div>

                      <div>
                        <label
                          className={`block text-[11px] font-bold mb-1 ${
                            isDark ? 'text-slate-400' : 'text-slate-600'
                          }`}
                        >
                          Badge Tag
                        </label>
                        <input
                          type="text"
                          value={card.tag || 'VERIFIED'}
                          onChange={(e) => handleCardChange(card.id, 'tag', e.target.value)}
                          placeholder="VERIFIED"
                          className={`w-full px-3 py-2 rounded-lg text-xs font-mono uppercase transition-all focus:outline-none border ${
                            isDark
                              ? 'bg-slate-900 border-slate-700 text-white focus:border-indigo-500'
                              : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-600'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Logo Upload & Icon Selection */}
                    <div
                      className={`p-3 rounded-xl border space-y-2.5 transition-all ${
                        isDark
                          ? 'bg-slate-900/60 border-slate-700/60'
                          : 'bg-slate-100/90 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[11px] font-bold flex items-center gap-1.5 ${
                            isDark ? 'text-slate-300' : 'text-slate-700'
                          }`}
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Card Logo / Icon</span>
                        </span>

                        {card.iconUrl && (
                          <button
                            type="button"
                            onClick={() => handleCardChange(card.id, 'iconUrl', null)}
                            className="text-[10px] text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 font-medium cursor-pointer"
                          >
                            Remove Custom Logo
                          </button>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        {/* Current Display */}
                        <div
                          className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 overflow-hidden ${
                            isDark
                              ? 'bg-slate-800 border-white/10 text-slate-200'
                              : 'bg-white border-slate-300 text-slate-700 shadow-xs'
                          }`}
                        >
                          {card.iconUrl ? (
                            <img
                              src={card.iconUrl}
                              alt={card.label}
                              className="w-7 h-7 object-contain"
                            />
                          ) : (
                            <IconComponent className="w-5 h-5" />
                          )}
                        </div>

                        {/* Direct File Upload Dropzone / Button */}
                        <div>
                          <input
                            type="file"
                            accept="image/png,image/svg+xml,image/jpeg,image/webp"
                            ref={(el) => {
                              fileInputRefs.current[card.id] = el;
                            }}
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleLogoUpload(card.id, file);
                            }}
                          />

                          <button
                            type="button"
                            disabled={isUploading}
                            onClick={() => fileInputRefs.current[card.id]?.click()}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 cursor-pointer transition-all ${
                              card.iconUrl
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
                            <span>{card.iconUrl ? 'Replace Custom Logo' : 'Upload Custom Logo (Cloudinary)'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Quick Preset Icon Picker (if not using custom image) */}
                      {!card.iconUrl && (
                        <div className={`pt-2 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                          <span
                            className={`text-[10px] block mb-1.5 font-medium ${
                              isDark ? 'text-slate-400' : 'text-slate-600'
                            }`}
                          >
                            Or select standard icon:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {PRESET_ICONS.map((iconKey) => {
                              const IconPreview = ICON_COMPONENTS[iconKey];
                              const isSelected = card.iconName === iconKey;
                              return (
                                <button
                                  key={iconKey}
                                  type="button"
                                  onClick={() => handleCardChange(card.id, 'iconName', iconKey)}
                                  className={`p-1.5 rounded-lg text-xs flex items-center gap-1 border transition-all cursor-pointer ${
                                    isSelected
                                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs'
                                      : isDark
                                      ? 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200 hover:bg-slate-750'
                                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-xs'
                                  }`}
                                  title={iconKey}
                                >
                                  <IconPreview className="w-3.5 h-3.5" />
                                  <span className="text-[10px]">{iconKey}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: "Trusted Across" Industry Pills */}
          <div
            className={`p-6 rounded-2xl border space-y-5 shadow-sm ${
              isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <div className="flex items-center gap-2 text-sm font-bold">
                <Tag className="w-4 h-4 text-cyan-500" />
                <span>&quot;Trusted Across&quot; Industry Sectors ({formData.industries.length})</span>
              </div>
            </div>

            {/* Existing Pills */}
            <div className="flex flex-wrap gap-2.5">
              {formData.industries.map((ind) => (
                <div
                  key={ind}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all shadow-xs group ${
                    isDark
                      ? 'bg-slate-800/90 border-slate-700 text-slate-200 hover:border-cyan-500/50 hover:bg-slate-800'
                      : 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200/80 hover:border-slate-400'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />
                  <span>{ind}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveIndustry(ind)}
                    aria-label={`Remove ${ind}`}
                    className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                      isDark
                        ? 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/20'
                        : 'text-slate-500 hover:text-rose-600 hover:bg-rose-100'
                    }`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Sector Input */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                placeholder="Add new industry sector (e.g. CleanTech, Automotive)..."
                value={newIndustry}
                onChange={(e) => setNewIndustry(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddIndustry();
                  }
                }}
                className={`flex-1 px-3.5 py-2.5 rounded-xl text-xs transition-all focus:outline-none border ${
                  isDark
                    ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500'
                    : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-indigo-600'
                }`}
              />
              <button
                type="button"
                onClick={handleAddIndustry}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all cursor-pointer shadow-xs"
              >
                + Add
              </button>
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
              <span>{isSaving ? 'Publishing to Storefront...' : 'Save & Publish Track Record'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
