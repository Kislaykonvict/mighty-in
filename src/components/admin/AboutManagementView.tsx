'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
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
  Eye,
  Monitor,
  Smartphone,
  Loader2,
  Layers,
  Milestone,
  BookOpen,
  ArrowRight,
  Type,
  Link as LinkIcon,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { useAdminTheme } from './AdminThemeContext';
import { AboutHeroData, defaultAboutHeroData } from '@/types/aboutHero';
import { TrajectoryData, TrajectoryEpoch, defaultTrajectoryData } from '@/types/trajectory';
import { AboutStoryData, AboutStoryCard, defaultAboutStoryData } from '@/types/aboutStory';

type ActiveTab = 'hero' | 'trajectory' | 'story';

export function AboutManagementView() {
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<ActiveTab>('hero');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Form states
  const [heroData, setHeroData] = useState<AboutHeroData>(defaultAboutHeroData);
  const [trajectoryData, setTrajectoryData] = useState<TrajectoryData>(defaultTrajectoryData);
  const [storyData, setStoryData] = useState<AboutStoryData>(defaultAboutStoryData);

  // Active preview state for trajectory
  const [previewEpochIdx, setPreviewEpochIdx] = useState(0);

  // File upload refs
  const heroImageInputRef = useRef<HTMLInputElement | null>(null);
  const storyImageInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [uploadingTarget, setUploadingTarget] = useState<string | null>(null);

  // Fetch initial data for all 3 sections
  useEffect(() => {
    async function loadAllData() {
      setIsLoading(true);
      try {
        const [heroRes, trajRes, storyRes] = await Promise.all([
          fetch('/api/admin/about/hero'),
          fetch('/api/admin/about/trajectory'),
          fetch('/api/admin/about/story'),
        ]);

        const [heroJson, trajJson, storyJson] = await Promise.all([
          heroRes.json(),
          trajRes.json(),
          storyRes.json(),
        ]);

        if (heroJson.success && heroJson.data) setHeroData(heroJson.data);
        if (trajJson.success && trajJson.data) setTrajectoryData(trajJson.data);
        if (storyJson.success && storyJson.data) setStoryData(storyJson.data);
      } catch (err: any) {
        console.error('Failed to load about sections data:', err);
        setFeedback({ type: 'error', message: 'Failed to load existing about page data.' });
      } finally {
        setIsLoading(false);
      }
    }
    loadAllData();
  }, []);

  // Generic file uploader
  const handleFileUpload = async (file: File, target: 'hero' | string) => {
    setUploadingTarget(target);
    setFeedback(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'about');

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Upload failed');
      }

      const uploadedUrl = data.url || data.secureUrl;

      if (target === 'hero') {
        setHeroData((prev) => ({ ...prev, backgroundImage: uploadedUrl }));
      } else {
        // target is story card ID
        setStoryData((prev) => ({
          ...prev,
          cards: prev.cards.map((c) => (c.id === target ? { ...c, image: uploadedUrl } : c)),
        }));
      }

      setFeedback({
        type: 'success',
        message: 'Image uploaded successfully.',
      });
    } catch (err: any) {
      console.error('Image upload error:', err);
      setFeedback({
        type: 'error',
        message: err.message || 'Image upload failed. Please try again.',
      });
    } finally {
      setUploadingTarget(null);
    }
  };

  // Save current active tab or all tabs
  const handleSaveActiveTab = async () => {
    setIsSaving(true);
    setFeedback(null);

    try {
      let endpoint = '';
      let bodyData: any = null;

      if (activeTab === 'hero') {
        endpoint = '/api/admin/about/hero';
        bodyData = heroData;
      } else if (activeTab === 'trajectory') {
        endpoint = '/api/admin/about/trajectory';
        bodyData = trajectoryData;
      } else if (activeTab === 'story') {
        endpoint = '/api/admin/about/story';
        bodyData = storyData;
      }

      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to save section changes');
      }

      setFeedback({
        type: 'success',
        message: `${activeTab === 'hero' ? 'Hero' : activeTab === 'trajectory' ? 'Trajectory' : 'Story'
          } section saved and live on /about!`,
      });
    } catch (err: any) {
      console.error('Save error:', err);
      setFeedback({
        type: 'error',
        message: err.message || 'Error occurred while saving changes.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Reset active tab to default
  const handleResetActiveTab = () => {
    if (!confirm(`Are you sure you want to reset the ${activeTab} section to system defaults?`)) {
      return;
    }
    if (activeTab === 'hero') setHeroData(defaultAboutHeroData);
    if (activeTab === 'trajectory') setTrajectoryData(defaultTrajectoryData);
    if (activeTab === 'story') setStoryData(defaultAboutStoryData);

    setFeedback({
      type: 'success',
      message: `Reset ${activeTab} to defaults. Click "Save Changes" to publish.`,
    });
  };

  // -------------------------------------------------------------
  // Trajectory Epoch Handlers
  // -------------------------------------------------------------
  const handleAddEpoch = () => {
    const newId = `epoch-${Date.now()}`;
    const nextNum = String(trajectoryData.epochs.length + 1).padStart(2, '0');
    const newEpoch: TrajectoryEpoch = {
      id: newId,
      year: '2025+',
      epochNumber: nextNum,
      phaseTitle: 'NEW HORIZON',
      hubLocation: 'Global Hub',
      headline: 'New Evolutionary Milestone Headline',
      narrative: 'Describe the pivotal expansion, technological achievement, or strategic leap for this phase.',
      primaryMetric: { label: 'Metric One', value: '100+' },
      secondaryMetric: { label: 'Metric Two', value: '99%' },
      pillars: [
        { title: 'Core Pod Delivery', subtitle: 'Dedicated Engineering', tag: 'Core' },
        { title: 'Advanced Automation', subtitle: 'AI Automation Workflows', tag: 'AI' },
      ],
      themeColor: 'sky',
    };
    setTrajectoryData((prev) => ({
      ...prev,
      epochs: [...prev.epochs, newEpoch],
    }));
    setPreviewEpochIdx(trajectoryData.epochs.length);
  };

  const handleDeleteEpoch = (idx: number) => {
    if (trajectoryData.epochs.length <= 1) {
      alert('You must keep at least one epoch in the trajectory.');
      return;
    }
    setTrajectoryData((prev) => ({
      ...prev,
      epochs: prev.epochs.filter((_, i) => i !== idx),
    }));
    setPreviewEpochIdx(0);
  };

  const handleMoveEpoch = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= trajectoryData.epochs.length) return;
    const updated = [...trajectoryData.epochs];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setTrajectoryData((prev) => ({ ...prev, epochs: updated }));
    setPreviewEpochIdx(targetIdx);
  };

  const handleUpdateEpoch = (idx: number, field: keyof TrajectoryEpoch, val: any) => {
    setTrajectoryData((prev) => ({
      ...prev,
      epochs: prev.epochs.map((ep, i) => (i === idx ? { ...ep, [field]: val } : ep)),
    }));
  };

  // -------------------------------------------------------------
  // Story Card Handlers
  // -------------------------------------------------------------
  const handleAddStoryCard = () => {
    const newId = `card-${Date.now()}`;
    const newCard: AboutStoryCard = {
      id: newId,
      badge: `0${storyData.cards.length + 1} / CRAFT`,
      title: 'New Narrative Title',
      paragraphs: [
        'Enter the first paragraph describing this dimension of your craft, methodology, or engineering standard.',
        'Enter the second paragraph explaining the real-world client outcome and strategic value.',
      ],
      image: '/images/about/story-engineer.jpg',
      imageAlt: 'Mighty Warner studio and engineering team',
    };
    setStoryData((prev) => ({
      ...prev,
      cards: [...prev.cards, newCard],
    }));
  };

  const handleDeleteStoryCard = (idx: number) => {
    if (storyData.cards.length <= 1) {
      alert('You must keep at least one story card.');
      return;
    }
    setStoryData((prev) => ({
      ...prev,
      cards: prev.cards.filter((_, i) => i !== idx),
    }));
  };

  const handleMoveStoryCard = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= storyData.cards.length) return;
    const updated = [...storyData.cards];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setStoryData((prev) => ({ ...prev, cards: updated }));
  };

  const handleUpdateStoryCard = (idx: number, field: keyof AboutStoryCard, val: any) => {
    setStoryData((prev) => ({
      ...prev,
      cards: prev.cards.map((c, i) => (i === idx ? { ...c, [field]: val } : c)),
    }));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
        <p className="text-sm text-slate-400">Loading About Page configurations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Top Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase tracking-wider bg-sky-500/10 text-sky-500 border border-sky-500/20">
              Live Content Engine
            </span>
            <span className="text-xs text-slate-400 font-mono">page: /about</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            About Us Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Dynamically configure the three core sections of Mighty Warner’s About page with instant live previews.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/about"
            target="_blank"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Site</span>
          </Link>

          <button
            type="button"
            onClick={handleResetActiveTab}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Tab</span>
          </button>

          <button
            type="button"
            onClick={handleSaveActiveTab}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 disabled:opacity-50 transition-all shadow-md shadow-sky-600/20 cursor-pointer"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between gap-3 text-sm border animate-in fade-in duration-200 ${feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
            }`}
        >
          <div className="flex items-center gap-2.5">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            )}
            <span className="font-medium">{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tabs Switcher */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-200/60 dark:bg-slate-900/60 border border-slate-300/80 dark:border-slate-800 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('hero')}
          className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${activeTab === 'hero'
              ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
        >
          <Layers className="w-4 h-4" />
          <span>1. Hero Section</span>
          <span className="w-2 h-2 rounded-full bg-sky-500" />
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('trajectory')}
          className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${activeTab === 'trajectory'
              ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
        >
          <Milestone className="w-4 h-4" />
          <span>2. Brand Trajectory ({trajectoryData.epochs.length})</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('story')}
          className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${activeTab === 'story'
              ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>3. Story & Picture Cards ({storyData.cards.length})</span>
          <span className="w-2 h-2 rounded-full bg-indigo-500" />
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: HERO SECTION CONFIGURATION */}
      {/* ========================================================= */}
      {activeTab === 'hero' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Form Fields */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Hero Typography & Copy
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Versett-style full-bleed photo hero with cinematic vignette.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-mono">Active</span>
                  <button
                    type="button"
                    onClick={() => setHeroData((p) => ({ ...p, isActive: !p.isActive }))}
                    className="cursor-pointer text-slate-400 hover:text-white"
                  >
                    {heroData.isActive !== false ? (
                      <ToggleRight className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-slate-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Headline */}
              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Main Headline (H1)
                </label>
                <textarea
                  rows={3}
                  value={heroData.headline}
                  onChange={(e) => setHeroData((p) => ({ ...p, headline: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                  placeholder="Enter the main hero headline..."
                />
              </div>

              {/* Subheadline (Optional) */}
              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Subheadline / Narrative (Optional)
                </label>
                <textarea
                  rows={2}
                  value={heroData.subheadline || ''}
                  onChange={(e) => setHeroData((p) => ({ ...p, subheadline: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Optional supporting narrative below headline..."
                />
              </div>

              {/* CTA Link & Text */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    CTA Underlined Text
                  </label>
                  <input
                    type="text"
                    value={heroData.ctaText}
                    onChange={(e) => setHeroData((p) => ({ ...p, ctaText: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="e.g. Explore Our Method"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    CTA Link Destination
                  </label>
                  <input
                    type="text"
                    value={heroData.ctaLink}
                    onChange={(e) => setHeroData((p) => ({ ...p, ctaLink: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono text-xs"
                    placeholder="/approach"
                  />
                </div>
              </div>

              {/* Background Image Upload & URL */}
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Background Cinematic Image
                  </label>
                  <input
                    ref={heroImageInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'hero');
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => heroImageInputRef.current?.click()}
                    disabled={uploadingTarget === 'hero'}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 transition-colors cursor-pointer"
                  >
                    {uploadingTarget === 'hero' ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>Upload Image</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={heroData.backgroundImage}
                    onChange={(e) => setHeroData((p) => ({ ...p, backgroundImage: e.target.value }))}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="/images/about/hero-versett.jpg"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-mono text-slate-400">
                    Image Alt Description
                  </label>
                  <input
                    type="text"
                    value={heroData.imageAlt}
                    onChange={(e) => setHeroData((p) => ({ ...p, imageAlt: e.target.value }))}
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="Descriptive alt text for accessibility & SEO"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Live Visual Preview */}
          <div className="lg:col-span-5 sticky top-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-sky-400" /> Live Hero Preview
              </span>
              <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-900 p-1 rounded-lg border border-slate-300 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1 rounded ${previewDevice === 'desktop' ? 'bg-white dark:bg-slate-800 text-sky-400' : 'text-slate-400'
                    }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1 rounded ${previewDevice === 'mobile' ? 'bg-white dark:bg-slate-800 text-sky-400' : 'text-slate-400'
                    }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div
              className={`relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-[#080C14] text-white transition-all ${previewDevice === 'mobile' ? 'max-w-[340px] mx-auto min-h-[380px]' : 'w-full min-h-[360px]'
                }`}
            >
              {/* Background preview */}
              <div className="absolute inset-0 pointer-events-none">
                {heroData.backgroundImage && (
                  <Image
                    src={heroData.backgroundImage}
                    alt={heroData.imageAlt || 'Hero background'}
                    fill
                    className="object-cover object-right opacity-100 brightness-[1.12] contrast-[1.05]"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-[#080C14]/90 via-[#080C14]/40 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-[#080C14] to-transparent" />
              </div>

              {/* Content preview */}
              <div className="relative z-10 p-6 sm:p-8 flex flex-col justify-between min-h-[360px]">
                <div className="space-y-4 pt-6">
                  <h2 className="text-lg sm:text-2xl font-normal text-white leading-snug">
                    {heroData.headline || 'Your Headline Here...'}
                  </h2>

                  {heroData.subheadline && (
                    <p className="text-xs text-slate-300 font-light">{heroData.subheadline}</p>
                  )}

                  {heroData.ctaText && (
                    <div>
                      <span className="inline-block text-xs text-slate-200 pb-0.5 border-b border-white/60">
                        {heroData.ctaText}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-8">
                  <span className="inline-flex items-center text-slate-400">
                    <ArrowDown className="w-4 h-4 animate-bounce" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: BRAND TRAJECTORY CONFIGURATION */}
      {/* ========================================================= */}
      {activeTab === 'trajectory' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Section Header & Epoch Cards */}
          <div className="lg:col-span-7 space-y-6">
            {/* Section Heading Settings */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Trajectory Section Header
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-mono">Active</span>
                  <button
                    type="button"
                    onClick={() => setTrajectoryData((p) => ({ ...p, isActive: !p.isActive }))}
                    className="cursor-pointer text-slate-400 hover:text-white"
                  >
                    {trajectoryData.isActive !== false ? (
                      <ToggleRight className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-slate-600" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Header Title
                </label>
                <input
                  type="text"
                  value={trajectoryData.title}
                  onChange={(e) => setTrajectoryData((p) => ({ ...p, title: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-semibold"
                  placeholder="Our Evolution Through Time"
                />
              </div>
            </div>

            {/* Epochs List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Milestones / Epochs ({trajectoryData.epochs.length})
                </h3>
                <button
                  type="button"
                  onClick={handleAddEpoch}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Year Milestone</span>
                </button>
              </div>

              {trajectoryData.epochs.map((epoch, idx) => {
                const isSelected = previewEpochIdx === idx;

                return (
                  <div
                    key={epoch.id || idx}
                    className={`p-5 rounded-2xl border transition-all ${isSelected
                        ? 'bg-slate-50 dark:bg-slate-900/90 border-sky-500/50 shadow-md'
                        : 'bg-white dark:bg-[#0B101D] border-slate-200 dark:border-slate-800/80 hover:border-slate-400 dark:hover:border-slate-700'
                      }`}
                  >
                    {/* Epoch Top Bar */}
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800/60">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPreviewEpochIdx(idx)}
                          className={`px-3 py-1 rounded-full text-xs font-mono font-bold cursor-pointer ${isSelected
                              ? 'bg-sky-500 text-white'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                        >
                          {epoch.year}
                        </button>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {epoch.phaseTitle}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveEpoch(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                          title="Move earlier"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveEpoch(idx, 'down')}
                          disabled={idx === trajectoryData.epochs.length - 1}
                          className="p-1 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                          title="Move later"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteEpoch(idx)}
                          className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors ml-1 cursor-pointer"
                          title="Delete epoch"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Epoch Fields */}
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                            Year / Tag
                          </label>
                          <input
                            type="text"
                            value={epoch.year}
                            onChange={(e) => handleUpdateEpoch(idx, 'year', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-mono font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                            Phase Title
                          </label>
                          <input
                            type="text"
                            value={epoch.phaseTitle}
                            onChange={(e) => handleUpdateEpoch(idx, 'phaseTitle', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-semibold"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                            Hub / Region
                          </label>
                          <input
                            type="text"
                            value={epoch.hubLocation}
                            onChange={(e) => handleUpdateEpoch(idx, 'hubLocation', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                          Milestone Headline
                        </label>
                        <input
                          type="text"
                          value={epoch.headline}
                          onChange={(e) => handleUpdateEpoch(idx, 'headline', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                          Narrative Description
                        </label>
                        <textarea
                          rows={2}
                          value={epoch.narrative}
                          onChange={(e) => handleUpdateEpoch(idx, 'narrative', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white leading-relaxed"
                        />
                      </div>

                      {/* Dual Metrics */}
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/60 space-y-1.5">
                          <span className="text-[10px] font-mono text-slate-400">Primary Metric</span>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={epoch.primaryMetric.value}
                              onChange={(e) =>
                                handleUpdateEpoch(idx, 'primaryMetric', {
                                  ...epoch.primaryMetric,
                                  value: e.target.value,
                                })
                              }
                              placeholder="Value (e.g. 450+)"
                              className="px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs font-mono font-bold"
                            />
                            <input
                              type="text"
                              value={epoch.primaryMetric.label}
                              onChange={(e) =>
                                handleUpdateEpoch(idx, 'primaryMetric', {
                                  ...epoch.primaryMetric,
                                  label: e.target.value,
                                })
                              }
                              placeholder="Label"
                              className="px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-[11px]"
                            />
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/60 space-y-1.5">
                          <span className="text-[10px] font-mono text-slate-400">Secondary Metric</span>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={epoch.secondaryMetric.value}
                              onChange={(e) =>
                                handleUpdateEpoch(idx, 'secondaryMetric', {
                                  ...epoch.secondaryMetric,
                                  value: e.target.value,
                                })
                              }
                              placeholder="Value (e.g. 98%)"
                              className="px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs font-mono font-bold text-emerald-400"
                            />
                            <input
                              type="text"
                              value={epoch.secondaryMetric.label}
                              onChange={(e) =>
                                handleUpdateEpoch(idx, 'secondaryMetric', {
                                  ...epoch.secondaryMetric,
                                  label: e.target.value,
                                })
                              }
                              placeholder="Label"
                              className="px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-[11px]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Live Trajectory Preview */}
          <div className="lg:col-span-5 sticky top-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-emerald-400" /> Live Trajectory Preview
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Pill Hover Activated
              </span>
            </div>

            {/* Trajectory Preview Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#080C14] border border-white/10 text-white space-y-5">
              <div className="border-b border-white/10 pb-3">
                <h4 className="text-sm font-bold text-white tracking-tight">
                  {trajectoryData.title || 'Our Evolution Through Time'}
                </h4>
              </div>

              {/* Scrubber pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {trajectoryData.epochs.map((ep, i) => {
                  const isActive = i === previewEpochIdx;
                  return (
                    <button
                      key={i}
                      type="button"
                      onMouseEnter={() => setPreviewEpochIdx(i)}
                      onClick={() => setPreviewEpochIdx(i)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-mono transition-all shrink-0 cursor-pointer ${isActive
                          ? 'bg-white text-slate-950 font-bold'
                          : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
                        }`}
                    >
                      {ep.year}
                    </button>
                  );
                })}
              </div>

              {/* Preview stage */}
              {trajectoryData.epochs[previewEpochIdx] && (
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-white/10 font-bold">
                      {trajectoryData.epochs[previewEpochIdx].year}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-300 uppercase">
                      {trajectoryData.epochs[previewEpochIdx].phaseTitle}
                    </span>
                  </div>

                  <h5 className="text-sm sm:text-base font-bold text-white leading-snug">
                    {trajectoryData.epochs[previewEpochIdx].headline}
                  </h5>

                  <p className="text-xs text-slate-300 font-light leading-relaxed">
                    {trajectoryData.epochs[previewEpochIdx].narrative}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                    <div className="p-2 rounded bg-white/[0.02]">
                      <div className="text-sm font-mono font-black text-white">
                        {trajectoryData.epochs[previewEpochIdx].primaryMetric.value}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {trajectoryData.epochs[previewEpochIdx].primaryMetric.label}
                      </div>
                    </div>
                    <div className="p-2 rounded bg-white/[0.02]">
                      <div className="text-sm font-mono font-black text-emerald-400">
                        {trajectoryData.epochs[previewEpochIdx].secondaryMetric.value}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {trajectoryData.epochs[previewEpochIdx].secondaryMetric.label}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: STORY & PICTURE CARDS CONFIGURATION */}
      {/* ========================================================= */}
      {activeTab === 'story' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Section Header & Story Cards */}
          <div className="lg:col-span-7 space-y-6">
            {/* Header config */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Story Section Header
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-mono">Active</span>
                  <button
                    type="button"
                    onClick={() => setStoryData((p) => ({ ...p, isActive: !p.isActive }))}
                    className="cursor-pointer text-slate-400 hover:text-white"
                  >
                    {storyData.isActive !== false ? (
                      <ToggleRight className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-slate-600" />
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-mono uppercase text-slate-400">
                    Badge Tag
                  </label>
                  <input
                    type="text"
                    value={storyData.badge || ''}
                    onChange={(e) => setStoryData((p) => ({ ...p, badge: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-mono"
                    placeholder="OUR PHILOSOPHY"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-mono uppercase text-slate-400">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={storyData.title}
                    onChange={(e) => setStoryData((p) => ({ ...p, title: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-bold"
                    placeholder="Our Philosophy & Craft"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-mono uppercase text-slate-400">
                  Subtitle / Mission Statement
                </label>
                <textarea
                  rows={2}
                  value={storyData.subtitle}
                  onChange={(e) => setStoryData((p) => ({ ...p, subtitle: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white leading-relaxed"
                />
              </div>
            </div>

            {/* Story Cards List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Alternating Story Cards ({storyData.cards.length})
                </h3>
                <button
                  type="button"
                  onClick={handleAddStoryCard}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Story Card</span>
                </button>
              </div>

              {storyData.cards.map((card, idx) => {
                const isImageRight = idx % 2 === 0;

                return (
                  <div
                    key={card.id || idx}
                    className="p-5 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-4"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          Card {idx + 1}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">
                          Layout: {isImageRight ? 'Text Left, Photo Right' : 'Photo Left, Text Right'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveStoryCard(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                          title="Move up"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveStoryCard(idx, 'down')}
                          disabled={idx === storyData.cards.length - 1}
                          className="p-1 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                          title="Move down"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteStoryCard(idx)}
                          className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors ml-1 cursor-pointer"
                          title="Delete card"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                          Card Badge
                        </label>
                        <input
                          type="text"
                          value={card.badge || ''}
                          onChange={(e) => handleUpdateStoryCard(idx, 'badge', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-mono"
                          placeholder="e.g. 01 / SYSTEMIC DEPTH"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                          Card Headline
                        </label>
                        <input
                          type="text"
                          value={card.title}
                          onChange={(e) => handleUpdateStoryCard(idx, 'title', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-bold"
                          placeholder="Headline"
                        />
                      </div>
                    </div>

                    {/* Paragraphs */}
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono uppercase text-slate-400">
                        Paragraphs (Separate paragraphs with a blank line)
                      </label>
                      <textarea
                        rows={4}
                        value={card.paragraphs.join('\n\n')}
                        onChange={(e) =>
                          handleUpdateStoryCard(
                            idx,
                            'paragraphs',
                            e.target.value.split('\n\n').filter((p) => p.trim().length > 0)
                          )
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white leading-relaxed"
                        placeholder="First paragraph...&#10;&#10;Second paragraph..."
                      />
                    </div>

                    {/* Image Settings */}
                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                      <div className="flex items-center justify-between">
                        <label className="block text-[10px] font-mono uppercase text-slate-400">
                          Card Photo (Path or Upload)
                        </label>
                        <input
                          ref={(el) => {
                            storyImageInputRefs.current[card.id] = el;
                          }}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, card.id);
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => storyImageInputRefs.current[card.id]?.click()}
                          disabled={uploadingTarget === card.id}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 transition-colors cursor-pointer"
                        >
                          {uploadingTarget === card.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Upload className="w-3 h-3" />
                          )}
                          <span>Upload Photo</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={card.image}
                          onChange={(e) => handleUpdateStoryCard(idx, 'image', e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-mono"
                          placeholder="/images/about/story-engineer.jpg"
                        />
                        {card.image && (
                          <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-white/20 shrink-0">
                            <Image src={card.image} alt={card.title} fill className="object-cover" />
                          </div>
                        )}
                      </div>

                      <div>
                        <input
                          type="text"
                          value={card.imageAlt || ''}
                          onChange={(e) => handleUpdateStoryCard(idx, 'imageAlt', e.target.value)}
                          className="w-full px-3 py-1 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-[11px] text-slate-900 dark:text-white"
                          placeholder="Photo alt text for screen readers"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Live Story Cards Preview */}
          <div className="lg:col-span-5 sticky top-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-indigo-400" /> Live Story Preview
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Alternating Flow
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#080C14] border border-white/10 text-white space-y-6 max-h-[600px] overflow-y-auto no-scrollbar">
              <div className="text-center space-y-1.5 border-b border-white/10 pb-4">
                {storyData.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-widest bg-white/5 border border-white/10 text-sky-400">
                    {storyData.badge}
                  </span>
                )}
                <h4 className="text-base font-black text-white">{storyData.title}</h4>
                <p className="text-[11px] text-slate-300 font-light leading-relaxed line-clamp-2">
                  {storyData.subtitle}
                </p>
              </div>

              {storyData.cards.map((card, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-16 h-20 rounded-xl overflow-hidden border border-white/10 shrink-0 bg-slate-900">
                      {card.image && (
                        <Image src={card.image} alt={card.title} fill className="object-cover" />
                      )}
                    </div>
                    <div className="space-y-1 min-w-0">
                      {card.badge && (
                        <div className="text-[9px] font-mono text-slate-400">{card.badge}</div>
                      )}
                      <h5 className="text-xs font-bold text-white truncate">{card.title}</h5>
                      <p className="text-[10px] text-slate-300 line-clamp-2 font-light">
                        {card.paragraphs[0]}
                      </p>
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
}
