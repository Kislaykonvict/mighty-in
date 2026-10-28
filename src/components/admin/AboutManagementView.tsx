'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Sparkles,
  Save,
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
  Milestone,
  BookOpen,
  Type,
  Link as LinkIcon,
} from 'lucide-react';
import { useAdminTheme } from './AdminThemeContext';
import { AboutHeroData, defaultAboutHeroData } from '@/types/aboutHero';
import { TrajectoryData, TrajectoryEpoch, defaultTrajectoryData } from '@/types/trajectory';
import { AboutStoryData, AboutStoryCard, defaultAboutStoryData } from '@/types/aboutStory';
import { MinimalRichTextEditor } from './MinimalRichTextEditor';

type ActiveTab = 'hero' | 'trajectory' | 'story';

export function AboutManagementView() {
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<ActiveTab>('hero');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form states
  const [heroData, setHeroData] = useState<AboutHeroData>(defaultAboutHeroData);
  const [trajectoryData, setTrajectoryData] = useState<TrajectoryData>(defaultTrajectoryData);
  const [storyData, setStoryData] = useState<AboutStoryData>(defaultAboutStoryData);

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

  // Auto-dismiss toast feedback after 4 seconds
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

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
  };

  const handleMoveEpoch = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= trajectoryData.epochs.length) return;
    const updated = [...trajectoryData.epochs];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setTrajectoryData((prev) => ({ ...prev, epochs: updated }));
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
    <div className="space-y-4 pb-16">
      {/* Sticky Top Header Container: Action Bar + Toast Message */}
      <div className="sticky top-[76px] z-20 space-y-2 pb-2 pt-2 -mt-2 bg-[#EEF2F6]/95 dark:bg-[#070B14]/95 backdrop-blur-md transition-colors">
        {/* Feedback Banner */}
        {feedback && (
          <div
            className={`px-3.5 py-2 rounded-lg flex items-center justify-between gap-2.5 text-xs font-semibold border shadow-lg backdrop-blur-md animate-in fade-in duration-200 ${
              feedback.type === 'success'
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/15 border-rose-500/30 text-rose-400'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              )}
              <span>{feedback.message}</span>
            </div>
          </div>
        )}

        {/* Compact Razor-sharp Command Bar */}
        <div
          className={`px-3.5 py-2 sm:px-4 sm:py-2 rounded-xl border shadow-sm backdrop-blur-xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
            isDark
              ? 'bg-[#0F172A]/95 border-slate-800/90 shadow-black/30'
              : 'bg-white/95 border-slate-200 shadow-slate-200/40'
          }`}
        >
          {/* Left: Active Section Breadcrumb & Status */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-md bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0 border border-sky-500/20">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center gap-1.5 min-w-0 text-xs">
              <span className="text-slate-400 dark:text-slate-500 font-medium">About</span>
              <span className="text-slate-300 dark:text-slate-600">/</span>
              <span className="font-bold text-slate-800 dark:text-slate-100 truncate">
                {activeTab === 'hero' && '1. Hero Section'}
                {activeTab === 'trajectory' && '2. Brand Trajectory'}
                {activeTab === 'story' && '3. Story & Craft Cards'}
              </span>
              <span className="ml-1 px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-sky-500/10 text-sky-500 border border-sky-500/20 hidden sm:inline-block">
                Live Engine
              </span>
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleSaveActiveTab}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 disabled:opacity-50 transition-all shadow-xs shadow-sky-600/25 cursor-pointer"
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2-Column Section Layout: Left Vertical Navigation Sidebar + Right Content Column */}
      <div className="flex flex-col lg:flex-row gap-4 items-start">
        {/* Left Column: Compact Vertical Section Navigation */}
        <aside className="w-full lg:w-48 shrink-0 sticky top-[136px] z-10">
          <div
            className={`p-1.5 rounded-xl border transition-all ${
              isDark
                ? 'bg-[#0F172A]/90 border-slate-800/80 shadow-sm backdrop-blur-xl'
                : 'bg-white border-slate-200 shadow-2xs'
            }`}
          >
            <div className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">
              Sections
            </div>

            <nav className="flex flex-col gap-0.5 mt-0.5">
              {/* Tab 1: Hero Section */}
              <button
                type="button"
                onClick={() => setActiveTab('hero')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-all cursor-pointer text-xs ${
                  activeTab === 'hero'
                    ? isDark
                      ? 'bg-sky-500/15 text-sky-400 font-bold border border-sky-500/30'
                      : 'bg-sky-50 text-sky-700 font-bold border border-sky-200 shadow-2xs'
                    : isDark
                    ? 'border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    : 'border border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Layers className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">1. Hero Section</span>
                </div>
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
              </button>

              {/* Tab 2: Brand Trajectory */}
              <button
                type="button"
                onClick={() => setActiveTab('trajectory')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-all cursor-pointer text-xs ${
                  activeTab === 'trajectory'
                    ? isDark
                      ? 'bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30'
                      : 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 shadow-2xs'
                    : isDark
                    ? 'border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    : 'border border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Milestone className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">2. Trajectory</span>
                </div>
                <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/25 shrink-0">
                  {trajectoryData.epochs.length}
                </span>
              </button>

              {/* Tab 3: Story Cards */}
              <button
                type="button"
                onClick={() => setActiveTab('story')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-all cursor-pointer text-xs ${
                  activeTab === 'story'
                    ? isDark
                      ? 'bg-indigo-500/15 text-indigo-400 font-bold border border-indigo-500/30'
                      : 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200 shadow-2xs'
                    : isDark
                    ? 'border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    : 'border border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <BookOpen className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">3. Story Cards</span>
                </div>
                <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-indigo-500/15 text-indigo-500 border border-indigo-500/25 shrink-0">
                  {storyData.cards.length}
                </span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Right Column: Tab Content */}
        <div className="flex-1 min-w-0">
          {/* ========================================================= */}
          {/* TAB 1: HERO SECTION CONFIGURATION */}
          {/* ========================================================= */}
          {activeTab === 'hero' && (
            <div className="space-y-3">
              <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-3">
                <div className="pb-2.5 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    Hero Typography &amp; Visuals
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Versett-style full-bleed photo hero with cinematic vignette.
                  </p>
                </div>

                {/* Headline */}
                <div>
                  <label className="block text-[11px] font-semibold mb-1 text-slate-600 dark:text-slate-300">
                    Main Headline (H1)
                  </label>
                  <MinimalRichTextEditor
                    value={heroData.headline}
                    onChange={(val) => setHeroData((p) => ({ ...p, headline: val }))}
                    placeholder="Enter the main hero headline..."
                    variant="multiline"
                    minHeight="38px"
                  />
                </div>

                {/* Subheadline (Optional) */}
                <div>
                  <label className="block text-[11px] font-semibold mb-1 text-slate-600 dark:text-slate-300">
                    Subheadline / Narrative (Optional)
                  </label>
                  <MinimalRichTextEditor
                    value={heroData.subheadline || ''}
                    onChange={(val) => setHeroData((p) => ({ ...p, subheadline: val }))}
                    placeholder="Optional supporting narrative below headline..."
                    variant="multiline"
                    minHeight="38px"
                  />
                </div>

                {/* CTA Link & Text */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold mb-1 text-slate-600 dark:text-slate-300">
                      CTA Underlined Text
                    </label>
                    <input
                      type="text"
                      value={heroData.ctaText}
                      onChange={(e) => setHeroData((p) => ({ ...p, ctaText: e.target.value }))}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1.5 focus:ring-sky-500"
                      placeholder="e.g. Explore Our Method"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold mb-1 text-slate-600 dark:text-slate-300">
                      CTA Link Destination
                    </label>
                    <input
                      type="text"
                      value={heroData.ctaLink}
                      onChange={(e) => setHeroData((p) => ({ ...p, ctaLink: e.target.value }))}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1.5 focus:ring-sky-500 font-mono"
                      placeholder="/approach"
                    />
                  </div>
                </div>

                {/* Background Image Upload & URL */}
                <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300">
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
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 transition-colors cursor-pointer"
                    >
                      {uploadingTarget === 'hero' ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Upload className="w-3 h-3" />
                      )}
                      <span>Upload Image</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={heroData.backgroundImage}
                      onChange={(e) => setHeroData((p) => ({ ...p, backgroundImage: e.target.value }))}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-1.5 focus:ring-sky-500"
                      placeholder="/images/about/hero-versett.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold mb-1 text-slate-500 dark:text-slate-400">
                      Image Alt Description
                    </label>
                    <input
                      type="text"
                      value={heroData.imageAlt}
                      onChange={(e) => setHeroData((p) => ({ ...p, imageAlt: e.target.value }))}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1.5 focus:ring-sky-500"
                      placeholder="Descriptive alt text for accessibility & SEO"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

      {/* ========================================================= */}
      {/* TAB 2: BRAND TRAJECTORY CONFIGURATION */}
      {/* ========================================================= */}
      {activeTab === 'trajectory' && (
        <div className="space-y-3">
          {/* Section Heading Settings */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-2.5">
            <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Trajectory Section Header
              </h3>
            </div>

            <div>
              <label className="block text-[11px] font-semibold mb-1 text-slate-600 dark:text-slate-300">
                Header Title
              </label>
              <input
                type="text"
                value={trajectoryData.title}
                onChange={(e) => setTrajectoryData((p) => ({ ...p, title: e.target.value }))}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1.5 focus:ring-sky-500 font-semibold"
                placeholder="Our Evolution Through Time"
              />
            </div>
          </div>

          {/* Epochs List */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Milestone className="w-3.5 h-3.5 text-emerald-500" />
                <span>Milestones / Epochs ({trajectoryData.epochs.length})</span>
              </h3>
              <button
                type="button"
                onClick={handleAddEpoch}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-2xs cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Year Milestone</span>
              </button>
            </div>

            {trajectoryData.epochs.map((epoch, idx) => (
              <div
                key={epoch.id || idx}
                className="p-3 sm:p-3.5 rounded-xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-2.5"
              >
                {/* Epoch Top Bar */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/60">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {epoch.year}
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {epoch.phaseTitle}
                    </span>
                  </div>

                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => handleMoveEpoch(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                      title="Move earlier"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveEpoch(idx, 'down')}
                      disabled={idx === trajectoryData.epochs.length - 1}
                      className="p-1 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                      title="Move later"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteEpoch(idx)}
                      className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors ml-0.5 cursor-pointer"
                      title="Delete epoch"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Epoch Fields */}
                <div className="space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold mb-1 text-slate-600 dark:text-slate-400">
                        Year / Tag
                      </label>
                      <input
                        type="text"
                        value={epoch.year}
                        onChange={(e) => handleUpdateEpoch(idx, 'year', e.target.value)}
                        className="w-full px-2.5 py-1 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:ring-1 focus:ring-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold mb-1 text-slate-600 dark:text-slate-400">
                        Phase Title
                      </label>
                      <input
                        type="text"
                        value={epoch.phaseTitle}
                        onChange={(e) => handleUpdateEpoch(idx, 'phaseTitle', e.target.value)}
                        className="w-full px-2.5 py-1 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-1 focus:ring-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold mb-1 text-slate-600 dark:text-slate-400">
                        Hub / Region
                      </label>
                      <input
                        type="text"
                        value={epoch.hubLocation}
                        onChange={(e) => handleUpdateEpoch(idx, 'hubLocation', e.target.value)}
                        className="w-full px-2.5 py-1 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-sky-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold mb-1 text-slate-600 dark:text-slate-400">
                      Milestone Headline
                    </label>
                    <MinimalRichTextEditor
                      value={epoch.headline}
                      onChange={(val) => handleUpdateEpoch(idx, 'headline', val)}
                      placeholder="e.g. Scaled Enterprise Next.js Engineering Architecture"
                      variant="inline"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold mb-1 text-slate-600 dark:text-slate-400">
                      Narrative Description
                    </label>
                    <MinimalRichTextEditor
                      value={epoch.narrative}
                      onChange={(val) => handleUpdateEpoch(idx, 'narrative', val)}
                      placeholder="Epoch narrative description..."
                      variant="multiline"
                      minHeight="38px"
                    />
                  </div>

                  {/* Dual Metrics */}
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/60 space-y-1">
                      <span className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400">Primary Metric</span>
                      <div className="grid grid-cols-2 gap-1.5">
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
                          className="px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-sky-500"
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
                          className="px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-[11px] focus:outline-none focus:ring-1 focus:ring-sky-500"
                        />
                      </div>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/60 space-y-1">
                      <span className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400">Secondary Metric</span>
                      <div className="grid grid-cols-2 gap-1.5">
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
                          className="px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs font-mono font-bold text-emerald-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
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
                          className="px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-[11px] focus:outline-none focus:ring-1 focus:ring-sky-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: STORY & PICTURE CARDS CONFIGURATION */}
      {/* ========================================================= */}
      {activeTab === 'story' && (
        <div className="space-y-3">
          {/* Header config */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-2.5">
            <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Story Section Header
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold mb-1 text-slate-600 dark:text-slate-300">
                  Badge Pill Tag (Optional)
                </label>
                <MinimalRichTextEditor
                  value={storyData.badge || ''}
                  onChange={(val) => setStoryData((p) => ({ ...p, badge: val }))}
                  placeholder="OUR PHILOSOPHY"
                  variant="inline"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold mb-1 text-slate-600 dark:text-slate-300">
                  Section Title
                </label>
                <MinimalRichTextEditor
                  value={storyData.title}
                  onChange={(val) => setStoryData((p) => ({ ...p, title: val }))}
                  placeholder="Our Philosophy & Craft"
                  variant="inline"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold mb-1 text-slate-600 dark:text-slate-300">
                Subtitle / Mission Statement
              </label>
              <MinimalRichTextEditor
                value={storyData.subtitle}
                onChange={(val) => setStoryData((p) => ({ ...p, subtitle: val }))}
                placeholder="Mission statement and philosophy narrative..."
                variant="multiline"
                minHeight="42px"
              />
            </div>
          </div>

          {/* Story Cards List */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                <span>Alternating Story Cards ({storyData.cards.length})</span>
              </h3>
              <button
                type="button"
                onClick={handleAddStoryCard}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-2xs cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Story Card</span>
              </button>
            </div>

            {storyData.cards.map((card, idx) => {
              const isImageRight = idx % 2 === 0;

              return (
                <div
                  key={card.id || idx}
                  className="p-3 sm:p-3.5 rounded-xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-2.5"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        Card {idx + 1}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {isImageRight ? 'Text Left, Photo Right' : 'Photo Left, Text Right'}
                      </span>
                    </div>

                    <div className="flex items-center gap-0.5">
                      <button
                        type="button"
                        onClick={() => handleMoveStoryCard(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                        title="Move up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveStoryCard(idx, 'down')}
                        disabled={idx === storyData.cards.length - 1}
                        className="p-1 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                        title="Move down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteStoryCard(idx)}
                        className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors ml-0.5 cursor-pointer"
                        title="Delete card"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold mb-1 text-slate-600 dark:text-slate-400">
                        Card Badge
                      </label>
                      <MinimalRichTextEditor
                        value={card.badge || ''}
                        onChange={(val) => handleUpdateStoryCard(idx, 'badge', val)}
                        placeholder="e.g. 01 / SYSTEMIC DEPTH"
                        variant="inline"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold mb-1 text-slate-600 dark:text-slate-400">
                        Card Headline
                      </label>
                      <MinimalRichTextEditor
                        value={card.title}
                        onChange={(val) => handleUpdateStoryCard(idx, 'title', val)}
                        placeholder="Headline"
                        variant="inline"
                      />
                    </div>
                  </div>

                  {/* Paragraphs */}
                  <div>
                    <label className="block text-[11px] font-semibold mb-1 text-slate-600 dark:text-slate-400">
                      Paragraphs
                    </label>
                    <MinimalRichTextEditor
                      value={card.paragraphs.map((p) => (p.startsWith('<p') ? p : `<p>${p}</p>`)).join('')}
                      onChange={(val) => {
                        const pMatches = val.match(/<p[^>]*>([\s\S]*?)<\/p>/gi);
                        if (pMatches && pMatches.length > 0) {
                          const cleaned = pMatches
                            .map((m) => m.replace(/<\/?p[^>]*>/gi, '').trim())
                            .filter((p) => p.length > 0);
                          handleUpdateStoryCard(idx, 'paragraphs', cleaned.length > 0 ? cleaned : [val]);
                        } else {
                          handleUpdateStoryCard(
                            idx,
                            'paragraphs',
                            val.split('\n\n').filter((p) => p.trim().length > 0)
                          );
                        }
                      }}
                      placeholder="First paragraph... Enter to start second paragraph..."
                      variant="multiline"
                      minHeight="48px"
                    />
                  </div>

                  {/* Image Settings */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
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
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 transition-colors cursor-pointer"
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
                        className="flex-1 px-2.5 py-1 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-sky-500"
                        placeholder="/images/about/story-engineer.jpg"
                      />
                      {card.image && (
                        <div className="relative w-8 h-8 rounded-md overflow-hidden border border-white/20 shrink-0">
                          <Image src={card.image} alt={card.title} fill className="object-cover" />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] font-medium mb-0.5 text-slate-500">
                        Image Alt Description
                      </label>
                      <input
                        type="text"
                        value={card.imageAlt || ''}
                        onChange={(e) => handleUpdateStoryCard(idx, 'imageAlt', e.target.value)}
                        className="w-full px-2.5 py-1 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-[11px] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                        placeholder="Photo alt text for screen readers"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
}
