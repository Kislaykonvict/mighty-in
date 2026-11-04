'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Building,
  Save,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  BookOpen,
  Sparkles,
  Layers,
  X,
} from 'lucide-react';
import { useAdminTheme } from './AdminThemeContext';
import {
  DEFAULT_BUSINESS_SLUGS,
  BusinessSlug,
  businessVerticalDefaults,
  createDefaultVerticalData,
  BusinessHeroData,
  BusinessPhilosophyData,
  BusinessPhilosophyCard,
  VerticalListItem,
} from '@/types/businessVertical';
import { uploadMedia } from '@/lib/clientUpload';

type ActiveTab = 'hero' | 'philosophy';

export function BusinessManagementView() {
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';

  // Dynamic list of all business verticals
  const [verticalsList, setVerticalsList] = useState<VerticalListItem[]>([
    {
      id: 'digital-growth',
      slug: 'digital-growth',
      name: 'Digital & Growth',
      tagline: 'Brand strategy, web development & SEO dominance',
      isCustom: false,
    },
    {
      id: 'technology',
      slug: 'technology',
      name: 'Technology',
      tagline: 'Custom software platforms, web & mobile applications',
      isCustom: false,
    },
    {
      id: 'talent-solutions',
      slug: 'talent-solutions',
      name: 'Talent Solutions',
      tagline: 'Dedicated engineering pods, direct hire & staffing',
      isCustom: false,
    },
  ]);

  const [activeBusiness, setActiveBusiness] = useState<BusinessSlug>('digital-growth');
  const [activeTab, setActiveTab] = useState<ActiveTab>('hero');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal State for adding a new business vertical
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newTagline, setNewTagline] = useState('');
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Business state dictionary
  const [businessData, setBusinessData] = useState<
    Record<
      string,
      {
        hero: BusinessHeroData;
        philosophy: BusinessPhilosophyData;
      }
    >
  >({
    'digital-growth': {
      hero: businessVerticalDefaults['digital-growth'].hero,
      philosophy: businessVerticalDefaults['digital-growth'].philosophy,
    },
    technology: {
      hero: businessVerticalDefaults.technology.hero,
      philosophy: businessVerticalDefaults.technology.philosophy,
    },
    'talent-solutions': {
      hero: businessVerticalDefaults['talent-solutions'].hero,
      philosophy: businessVerticalDefaults['talent-solutions'].philosophy,
    },
  });

  // File upload state & refs
  const heroImageInputRef = useRef<HTMLInputElement | null>(null);
  const cardImageInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [uploadingTarget, setUploadingTarget] = useState<string | null>(null);

  // Auto-slug generation from title
  const handleTitleChange = (val: string) => {
    setNewTitle(val);
    if (!isSlugManual) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      setNewSlug(generated);
    }
  };

  // Fetch all business verticals and their data
  useEffect(() => {
    async function loadAllBusinesses() {
      setIsLoading(true);
      try {
        // 1. Fetch dynamic list of verticals
        const listRes = await fetch('/api/admin/businesses');
        const listJson = await listRes.json();
        let list: VerticalListItem[] = [];

        if (listJson.success && Array.isArray(listJson.data) && listJson.data.length > 0) {
          list = listJson.data;
          setVerticalsList(list);
        } else {
          list = [
            {
              id: 'digital-growth',
              slug: 'digital-growth',
              name: 'Digital & Growth',
              tagline: 'Brand strategy, web development & SEO dominance',
              isCustom: false,
            },
            {
              id: 'technology',
              slug: 'technology',
              name: 'Technology',
              tagline: 'Custom software platforms, web & mobile applications',
              isCustom: false,
            },
            {
              id: 'talent-solutions',
              slug: 'talent-solutions',
              name: 'Talent Solutions',
              tagline: 'Dedicated engineering pods, direct hire & staffing',
              isCustom: false,
            },
          ];
        }

        // 2. Fetch section data for each vertical
        const results = await Promise.all(
          list.map(async (v) => {
            try {
              const res = await fetch(`/api/admin/businesses/${v.slug}`);
              const json = await res.json();
              return { slug: v.slug, data: json?.data };
            } catch {
              return { slug: v.slug, data: null };
            }
          })
        );

        setBusinessData((prev) => {
          const updated = { ...prev };
          results.forEach(({ slug, data }) => {
            if (data?.hero && data?.philosophy) {
              updated[slug] = {
                hero: data.hero,
                philosophy: data.philosophy,
              };
            } else if (!updated[slug]) {
              const def =
                businessVerticalDefaults[slug] ||
                createDefaultVerticalData(slug, slug);
              updated[slug] = {
                hero: def.hero,
                philosophy: def.philosophy,
              };
            }
          });
          return updated;
        });
      } catch (err) {
        console.error('Failed to load business vertical data:', err);
        setFeedback({
          type: 'error',
          message: 'Failed to load business vertical data from database.',
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadAllBusinesses();
  }, []);

  // Auto-dismiss feedback toast
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Current active data shorthand
  const currentVerticalMeta =
    verticalsList.find((v) => v.slug === activeBusiness) || {
      id: activeBusiness,
      slug: activeBusiness,
      name: activeBusiness,
      tagline: '',
      isCustom: !DEFAULT_BUSINESS_SLUGS.includes(activeBusiness as any),
    };

  const currentData =
    businessData[activeBusiness] ||
    (businessVerticalDefaults[activeBusiness]
      ? {
          hero: businessVerticalDefaults[activeBusiness].hero,
          philosophy: businessVerticalDefaults[activeBusiness].philosophy,
        }
      : {
          hero: createDefaultVerticalData(activeBusiness, currentVerticalMeta.name).hero,
          philosophy: createDefaultVerticalData(activeBusiness, currentVerticalMeta.name).philosophy,
        });

  const currentHero = currentData.hero;
  const currentPhilosophy = currentData.philosophy;
  const liveUrl = `/businesses/${activeBusiness}`;

  // Update Hero fields
  const handleUpdateHero = (field: keyof BusinessHeroData, val: any) => {
    setBusinessData((prev) => ({
      ...prev,
      [activeBusiness]: {
        ...currentData,
        hero: {
          ...currentHero,
          [field]: val,
        },
      },
    }));
  };

  // Update Philosophy section meta
  const handleUpdatePhilosophy = (field: keyof BusinessPhilosophyData, val: any) => {
    setBusinessData((prev) => ({
      ...prev,
      [activeBusiness]: {
        ...currentData,
        philosophy: {
          ...currentPhilosophy,
          [field]: val,
        },
      },
    }));
  };

  // Philosophy Cards management
  const handleAddPhilosophyCard = () => {
    const newId = `card-${Date.now()}`;
    const nextIdx = (currentPhilosophy.cards?.length || 0) + 1;
    const newCard: BusinessPhilosophyCard = {
      id: newId,
      badge: `0${nextIdx} / CRAFT & METHOD`,
      title: 'New Strategic Capability',
      paragraphs: [
        'Enter the first paragraph describing your approach, architecture, or craftsmanship in this vertical.',
        'Enter the second paragraph explaining how this accelerates the client roadmap and provides commercial advantage.',
      ],
      image: '/images/about/story-engineer.jpg',
      imageAlt: 'Mighty Warner engineers collaborating on product architecture',
    };

    setBusinessData((prev) => ({
      ...prev,
      [activeBusiness]: {
        ...currentData,
        philosophy: {
          ...currentPhilosophy,
          cards: [...(currentPhilosophy.cards || []), newCard],
        },
      },
    }));
  };

  const handleDeletePhilosophyCard = (cardIdx: number) => {
    if ((currentPhilosophy.cards?.length || 0) <= 1) {
      alert('You must keep at least one philosophy/craft card.');
      return;
    }

    setBusinessData((prev) => ({
      ...prev,
      [activeBusiness]: {
        ...currentData,
        philosophy: {
          ...currentPhilosophy,
          cards: currentPhilosophy.cards.filter((_, i) => i !== cardIdx),
        },
      },
    }));
  };

  const handleMovePhilosophyCard = (cardIdx: number, direction: 'up' | 'down') => {
    const cards = [...(currentPhilosophy.cards || [])];
    const targetIdx = direction === 'up' ? cardIdx - 1 : cardIdx + 1;
    if (targetIdx < 0 || targetIdx >= cards.length) return;

    const temp = cards[cardIdx];
    cards[cardIdx] = cards[targetIdx];
    cards[targetIdx] = temp;

    setBusinessData((prev) => ({
      ...prev,
      [activeBusiness]: {
        ...currentData,
        philosophy: {
          ...currentPhilosophy,
          cards,
        },
      },
    }));
  };

  const handleUpdateCardField = (cardIdx: number, field: keyof BusinessPhilosophyCard, val: any) => {
    setBusinessData((prev) => ({
      ...prev,
      [activeBusiness]: {
        ...currentData,
        philosophy: {
          ...currentPhilosophy,
          cards: currentPhilosophy.cards.map((c, i) =>
            i === cardIdx ? { ...c, [field]: val } : c
          ),
        },
      },
    }));
  };

  const handleUpdateCardParagraph = (cardIdx: number, pIdx: number, text: string) => {
    setBusinessData((prev) => {
      const cards = [...currentPhilosophy.cards];
      const card = { ...cards[cardIdx] };
      const paragraphs = [...card.paragraphs];
      paragraphs[pIdx] = text;
      card.paragraphs = paragraphs;
      cards[cardIdx] = card;

      return {
        ...prev,
        [activeBusiness]: {
          ...currentData,
          philosophy: {
            ...currentPhilosophy,
            cards,
          },
        },
      };
    });
  };

  const handleAddCardParagraph = (cardIdx: number) => {
    setBusinessData((prev) => {
      const cards = [...currentPhilosophy.cards];
      const card = { ...cards[cardIdx] };
      card.paragraphs = [...card.paragraphs, 'Enter next narrative paragraph...'];
      cards[cardIdx] = card;

      return {
        ...prev,
        [activeBusiness]: {
          ...currentData,
          philosophy: {
            ...currentPhilosophy,
            cards,
          },
        },
      };
    });
  };

  const handleDeleteCardParagraph = (cardIdx: number, pIdx: number) => {
    setBusinessData((prev) => {
      const cards = [...currentPhilosophy.cards];
      const card = { ...cards[cardIdx] };
      if (card.paragraphs.length <= 1) return prev;
      card.paragraphs = card.paragraphs.filter((_, i) => i !== pIdx);
      cards[cardIdx] = card;

      return {
        ...prev,
        [activeBusiness]: {
          ...currentData,
          philosophy: {
            ...currentPhilosophy,
            cards,
          },
        },
      };
    });
  };

  // Upload handler for hero & card images
  const handleFileUpload = async (file: File, target: 'hero' | string) => {
    setUploadingTarget(target);
    setFeedback(null);
    try {
      const previousUrl =
        target === 'hero'
          ? currentHero.backgroundImage
          : currentPhilosophy.cards.find((c) => c.id === target)?.image || '';

      const result = await uploadMedia({
        file,
        folder: `mighty-warner/businesses/${activeBusiness}`,
        resourceType: 'image',
        previousUrl,
      });

      if (target === 'hero') {
        handleUpdateHero('backgroundImage', result.secureUrl || result.url);
      } else {
        const cardIdx = currentPhilosophy.cards.findIndex((c) => c.id === target);
        if (cardIdx !== -1) {
          handleUpdateCardField(cardIdx, 'image', result.secureUrl || result.url);
        }
      }

      setFeedback({ type: 'success', message: 'Image uploaded successfully.' });
    } catch (err: any) {
      console.error('File upload failed:', err);
      setFeedback({ type: 'error', message: err.message || 'Image upload failed.' });
    } finally {
      setUploadingTarget(null);
    }
  };

  // Save changes to backend
  const handleSaveActiveTab = async () => {
    setIsSaving(true);
    setFeedback(null);
    try {
      const payload = {
        section: activeTab,
        hero: currentHero,
        philosophy: currentPhilosophy,
      };

      const res = await fetch(`/api/admin/businesses/${activeBusiness}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to save business vertical');
      }

      setFeedback({
        type: 'success',
        message: `${currentVerticalMeta.name} (${
          activeTab === 'hero' ? 'Hero' : 'Philosophy & Craft'
        }) saved and live on ${liveUrl}!`,
      });
    } catch (err: any) {
      console.error('Save error:', err);
      setFeedback({
        type: 'error',
        message: err.message || 'Failed to save changes.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Create a new business vertical
  const handleCreateVertical = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSlug.trim()) {
      alert('Please enter a vertical title and URL slug.');
      return;
    }

    setIsCreating(true);
    try {
      const res = await fetch('/api/admin/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          slug: newSlug.trim(),
          tagline: newTagline.trim(),
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to create business vertical');
      }

      const created = json.data;
      const newListItem: VerticalListItem = {
        id: created.slug,
        slug: created.slug,
        name: created.name,
        tagline: created.tagline,
        isCustom: true,
      };

      setVerticalsList((prev) => [...prev, newListItem]);
      setBusinessData((prev) => ({
        ...prev,
        [created.slug]: {
          hero: created.hero,
          philosophy: created.philosophy,
        },
      }));

      setActiveBusiness(created.slug);
      setShowAddModal(false);
      setNewTitle('');
      setNewSlug('');
      setNewTagline('');
      setIsSlugManual(false);

      setFeedback({
        type: 'success',
        message: `Business vertical "${created.name}" created! Route /businesses/${created.slug} is now live.`,
      });
    } catch (err: any) {
      console.error('Error creating vertical:', err);
      alert(err.message || 'Failed to create business vertical');
    } finally {
      setIsCreating(false);
    }
  };

  // Delete custom vertical
  const handleDeleteVertical = async () => {
    if (!currentVerticalMeta.isCustom) {
      alert('Core business verticals cannot be deleted.');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${currentVerticalMeta.name}"? This will delete its page and route /businesses/${activeBusiness}.`
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/businesses/${activeBusiness}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to delete business vertical');
      }

      // Remove from list & select first vertical
      setVerticalsList((prev) => prev.filter((v) => v.slug !== activeBusiness));
      setActiveBusiness('digital-growth');

      setFeedback({
        type: 'success',
        message: `Business vertical "${currentVerticalMeta.name}" deleted.`,
      });
    } catch (err: any) {
      console.error('Error deleting vertical:', err);
      alert(err.message || 'Failed to delete vertical');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Loading Business Verticals configurations...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20">
      {/* Sticky Top Header Container */}
      <div
        className={`sticky top-[76px] z-20 space-y-2 pb-2 pt-2 -mt-2 backdrop-blur-md transition-colors ${
          isDark ? 'bg-[#070B14]/95' : 'bg-[#EEF2F6]/95'
        }`}
      >
        {/* Toast Feedback */}
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

        {/* Command Bar */}
        <div
          className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl border shadow-sm backdrop-blur-xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isDark
              ? 'bg-[#0F172A]/95 border-slate-800/90 shadow-black/30'
              : 'bg-white/95 border-slate-200 shadow-slate-200/40'
          }`}
        >
          {/* Left: Breadcrumbs & Live Link */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0 border border-sky-500/20">
              <Building className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1.5 min-w-0 text-xs">
              <span className={`font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Business Verticals
              </span>
              <span className={isDark ? 'text-slate-600' : 'text-slate-300'}>/</span>
              <span className={`font-bold truncate ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                {currentVerticalMeta.name}
              </span>
              <span className={isDark ? 'text-slate-600' : 'text-slate-300'}>/</span>
              <span className={`font-semibold ${isDark ? 'text-sky-400' : 'text-sky-600'}`}>
                {activeTab === 'hero' ? 'Hero Section' : 'Philosophy & Craft'}
              </span>
            </div>
          </div>

          {/* Right: View Live & Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* View Live Page */}
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                isDark
                  ? 'border-slate-700 bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                  : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <span>View Live</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            {/* Delete Custom Vertical button */}
            {currentVerticalMeta.isCustom && (
              <button
                type="button"
                onClick={handleDeleteVertical}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
                title="Delete this custom vertical"
              >
                {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>Delete</span>
              </button>
            )}

            {/* Save Button */}
            <button
              type="button"
              onClick={handleSaveActiveTab}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 disabled:opacity-50 transition-all shadow-xs shadow-sky-600/25 cursor-pointer"
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save Changes</span>
            </button>
          </div>
        </div>

        {/* Business Selector Pills + Add Button */}
        <div
          className={`p-1.5 rounded-xl border flex flex-wrap items-center gap-1.5 transition-colors ${
            isDark ? 'bg-[#0B1120] border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          {verticalsList.map((vert) => {
            const isSelected = activeBusiness === vert.slug;
            return (
              <button
                key={vert.slug}
                type="button"
                onClick={() => setActiveBusiness(vert.slug)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-2 ${
                  isSelected
                    ? isDark
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30 shadow-xs'
                      : 'bg-slate-900 text-white shadow-xs'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isSelected ? 'bg-sky-400 animate-pulse' : 'bg-slate-400 opacity-50'
                  }`}
                />
                <span>{vert.name}</span>
                {vert.isCustom && (
                  <span className="text-[9px] px-1 py-0.2 rounded font-mono uppercase bg-rose-500/20 text-rose-400">
                    Custom
                  </span>
                )}
              </button>
            );
          })}

          {/* "+ Add Business Vertical" Button */}
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-sky-600 dark:text-sky-400 border border-dashed border-sky-500/40 hover:bg-sky-500/10 transition-all cursor-pointer ml-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Business Vertical</span>
          </button>
        </div>

        {/* Section Tabs Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-1 gap-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('hero')}
            className={`pb-2.5 pt-1 transition-colors relative cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'hero'
                ? isDark
                  ? 'text-sky-400 font-bold'
                  : 'text-sky-600 font-bold'
                : isDark
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>1. Hero Section</span>
            {activeTab === 'hero' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500 rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('philosophy')}
            className={`pb-2.5 pt-1 transition-colors relative cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'philosophy'
                ? isDark
                  ? 'text-sky-400 font-bold'
                  : 'text-sky-600 font-bold'
                : isDark
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>2. Philosophy & Craft Cards</span>
            {activeTab === 'philosophy' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500 rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* ============================================================= */}
      {/* TAB 1: HERO SECTION CONFIGURATION */}
      {/* ============================================================= */}
      {activeTab === 'hero' && (
        <div className="space-y-6">
          <div
            className={`p-5 sm:p-6 rounded-2xl border ${
              isDark ? 'bg-[#0B1120] border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-500" />
                  <span>Versett-Style Cinematic Hero</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Configure the primary full-height hero section with background imagery, display headline, and subheadline.
                </p>
              </div>

              {/* Active Toggle */}
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>Section Active</span>
                <input
                  type="checkbox"
                  checked={currentHero.isActive ?? true}
                  onChange={(e) => handleUpdateHero('isActive', e.target.checked)}
                  className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300 dark:border-slate-700"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Text Content */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Main Headline
                  </label>
                  <input
                    type="text"
                    value={currentHero.headline}
                    onChange={(e) => handleUpdateHero('headline', e.target.value)}
                    placeholder="Headline for this business vertical..."
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      isDark
                        ? 'bg-slate-900/80 border-slate-700 text-white focus:border-sky-500'
                        : 'bg-white border-slate-200 text-slate-900 focus:border-sky-600'
                    }`}
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Display headline rendered over the cinematic background image.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Subheadline / Value Statement
                  </label>
                  <textarea
                    rows={4}
                    value={currentHero.subheadline}
                    onChange={(e) => handleUpdateHero('subheadline', e.target.value)}
                    placeholder="Enter detailed value narrative..."
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm leading-relaxed transition-all ${
                      isDark
                        ? 'bg-slate-900/80 border-slate-700 text-white focus:border-sky-500'
                        : 'bg-white border-slate-200 text-slate-900 focus:border-sky-600'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      CTA Button Text
                    </label>
                    <input
                      type="text"
                      value={currentHero.ctaText}
                      onChange={(e) => handleUpdateHero('ctaText', e.target.value)}
                      placeholder="Explore Our Method"
                      className={`w-full px-3.5 py-2 rounded-xl border text-xs font-medium transition-all ${
                        isDark
                          ? 'bg-slate-900/80 border-slate-700 text-white focus:border-sky-500'
                          : 'bg-white border-slate-200 text-slate-900 focus:border-sky-600'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      CTA Link / Anchor Target
                    </label>
                    <input
                      type="text"
                      value={currentHero.ctaLink}
                      onChange={(e) => handleUpdateHero('ctaLink', e.target.value)}
                      placeholder="#philosophy"
                      className={`w-full px-3.5 py-2 rounded-xl border text-xs font-medium transition-all ${
                        isDark
                          ? 'bg-slate-900/80 border-slate-700 text-white focus:border-sky-500'
                          : 'bg-white border-slate-200 text-slate-900 focus:border-sky-600'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Scroll Down Arrow Target
                  </label>
                  <input
                    type="text"
                    value={currentHero.scrollTarget || '#philosophy'}
                    onChange={(e) => handleUpdateHero('scrollTarget', e.target.value)}
                    placeholder="#philosophy"
                    className={`w-full px-3.5 py-2 rounded-xl border text-xs font-medium transition-all ${
                      isDark
                        ? 'bg-slate-900/80 border-slate-700 text-white focus:border-sky-500'
                        : 'bg-white border-slate-200 text-slate-900 focus:border-sky-600'
                    }`}
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Element ID for smooth scrolling when user clicks the down arrow (default: #philosophy).
                  </p>
                </div>
              </div>

              {/* Right Column: Hero Background Image */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Background Photo
                  </label>

                  {/* Image Preview Box */}
                  <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-950 flex flex-col justify-end p-4">
                    {currentHero.backgroundImage ? (
                      <Image
                        src={currentHero.backgroundImage}
                        alt={currentHero.imageAlt || 'Hero background'}
                        fill
                        className="object-cover object-center"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                        <ImageIcon className="w-8 h-8 opacity-40" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

                    <div className="relative z-10 text-white text-xs font-mono truncate max-w-full">
                      {currentHero.backgroundImage || 'No image set'}
                    </div>
                  </div>

                  {/* Upload Controls */}
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      type="file"
                      ref={heroImageInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, 'hero');
                      }}
                    />

                    <button
                      type="button"
                      disabled={uploadingTarget === 'hero'}
                      onClick={() => heroImageInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      {uploadingTarget === 'hero' ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Upload className="w-3.5 h-3.5" />
                      )}
                      <span>Upload New Image</span>
                    </button>

                    <input
                      type="text"
                      value={currentHero.backgroundImage}
                      onChange={(e) => handleUpdateHero('backgroundImage', e.target.value)}
                      placeholder="/images/about/story-designer.jpg or URL"
                      className={`flex-1 px-3 py-2 rounded-xl border text-xs font-mono ${
                        isDark
                          ? 'bg-slate-900/80 border-slate-700 text-white'
                          : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Image Alt Description
                  </label>
                  <input
                    type="text"
                    value={currentHero.imageAlt}
                    onChange={(e) => handleUpdateHero('imageAlt', e.target.value)}
                    placeholder="Strategic delivery and engineering team at work"
                    className={`w-full px-3.5 py-2 rounded-xl border text-xs font-medium ${
                      isDark
                        ? 'bg-slate-900/80 border-slate-700 text-white'
                        : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* TAB 2: PHILOSOPHY & CRAFT SECTION CONFIGURATION */}
      {/* ============================================================= */}
      {activeTab === 'philosophy' && (
        <div className="space-y-6">
          {/* Section Heading Card */}
          <div
            className={`p-5 sm:p-6 rounded-2xl border ${
              isDark ? 'bg-[#0B1120] border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-sky-500" />
                  <span>Philosophy & Craft Section Header</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Configure the section eyebrow badge, main title, and introductory narrative paragraph.
                </p>
              </div>

              {/* Active Toggle */}
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>Section Active</span>
                <input
                  type="checkbox"
                  checked={currentPhilosophy.isActive ?? true}
                  onChange={(e) => handleUpdatePhilosophy('isActive', e.target.checked)}
                  className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300 dark:border-slate-700"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Section Pill Badge
                </label>
                <input
                  type="text"
                  value={currentPhilosophy.badge || ''}
                  onChange={(e) => handleUpdatePhilosophy('badge', e.target.value)}
                  placeholder="OUR PHILOSOPHY & CRAFT"
                  className={`w-full px-3.5 py-2 rounded-xl border text-xs font-mono font-bold tracking-wider ${
                    isDark
                      ? 'bg-slate-900/80 border-slate-700 text-white'
                      : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Section Title
                </label>
                <input
                  type="text"
                  value={currentPhilosophy.title || ''}
                  onChange={(e) => handleUpdatePhilosophy('title', e.target.value)}
                  placeholder="A deliberate approach to excellence"
                  className={`w-full px-3.5 py-2 rounded-xl border text-xs font-bold ${
                    isDark
                      ? 'bg-slate-900/80 border-slate-700 text-white'
                      : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Section Subtitle
                </label>
                <textarea
                  rows={2}
                  value={currentPhilosophy.subtitle || ''}
                  onChange={(e) => handleUpdatePhilosophy('subtitle', e.target.value)}
                  placeholder="We eliminate disjointed tactics..."
                  className={`w-full px-3.5 py-2 rounded-xl border text-xs leading-relaxed ${
                    isDark
                      ? 'bg-slate-900/80 border-slate-700 text-white'
                      : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Cards Header & Add Button */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-500" />
                <span>Alternating Narrative Cards ({currentPhilosophy.cards?.length || 0})</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Each card displays a photo opposite rich narrative paragraphs, alternating sequentially down the page.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddPhilosophyCard}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Narrative Card</span>
            </button>
          </div>

          {/* Cards List */}
          <div className="space-y-6">
            {(currentPhilosophy.cards || []).map((card, cardIdx) => (
              <div
                key={card.id || cardIdx}
                className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                  isDark ? 'bg-[#0B1120] border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                {/* Card Top Action Bar */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-sky-500/10 text-sky-500 flex items-center justify-center font-mono text-[11px] font-bold">
                      {cardIdx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-md">
                      {card.title || 'Untitled Card'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Reorder Up */}
                    <button
                      type="button"
                      disabled={cardIdx === 0}
                      onClick={() => handleMovePhilosophyCard(cardIdx, 'up')}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    {/* Reorder Down */}
                    <button
                      type="button"
                      disabled={cardIdx === currentPhilosophy.cards.length - 1}
                      onClick={() => handleMovePhilosophyCard(cardIdx, 'down')}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleDeletePhilosophyCard(cardIdx)}
                      className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer ml-1"
                      title="Delete Card"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left 7 Cols: Card Metadata & Paragraphs */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          Card Eyebrow Badge
                        </label>
                        <input
                          type="text"
                          value={card.badge || ''}
                          onChange={(e) => handleUpdateCardField(cardIdx, 'badge', e.target.value)}
                          placeholder="01 / ARCHITECTURE"
                          className={`w-full px-3 py-1.5 rounded-lg border text-xs font-mono uppercase ${
                            isDark
                              ? 'bg-slate-900 border-slate-700 text-white'
                              : 'bg-white border-slate-200 text-slate-900'
                          }`}
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          Card Title
                        </label>
                        <input
                          type="text"
                          value={card.title}
                          onChange={(e) => handleUpdateCardField(cardIdx, 'title', e.target.value)}
                          placeholder="Strategic depth and velocity"
                          className={`w-full px-3 py-1.5 rounded-lg border text-xs font-bold ${
                            isDark
                              ? 'bg-slate-900 border-slate-700 text-white'
                              : 'bg-white border-slate-200 text-slate-900'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Paragraphs Editor */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          Narrative Paragraphs ({card.paragraphs?.length || 0})
                        </label>
                        <button
                          type="button"
                          onClick={() => handleAddCardParagraph(cardIdx)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Paragraph</span>
                        </button>
                      </div>

                      {card.paragraphs.map((p, pIdx) => (
                        <div key={pIdx} className="flex items-start gap-2">
                          <span className="text-[10px] font-mono text-slate-400 pt-2 shrink-0">
                            P{pIdx + 1}
                          </span>
                          <textarea
                            rows={3}
                            value={p}
                            onChange={(e) => handleUpdateCardParagraph(cardIdx, pIdx, e.target.value)}
                            placeholder="Enter paragraph text..."
                            className={`flex-1 px-3 py-2 rounded-lg border text-xs leading-relaxed ${
                              isDark
                                ? 'bg-slate-900 border-slate-700 text-white'
                                : 'bg-white border-slate-200 text-slate-900'
                            }`}
                          />
                          {card.paragraphs.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleDeleteCardParagraph(cardIdx, pIdx)}
                              className="text-slate-400 hover:text-rose-500 pt-2 cursor-pointer"
                              title="Delete Paragraph"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right 5 Cols: Card Photo */}
                  <div className="lg:col-span-5 space-y-3">
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                      Card Photo
                    </label>

                    <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-950 flex flex-col justify-end p-3">
                      {card.image ? (
                        <Image
                          src={card.image}
                          alt={card.imageAlt || card.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                          <ImageIcon className="w-6 h-6 opacity-40" />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

                      <div className="relative z-10 text-white text-[10px] font-mono truncate max-w-full">
                        {card.image || 'No image set'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={(el) => {
                          cardImageInputRefs.current[card.id] = el;
                        }}
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, card.id);
                        }}
                      />

                      <button
                        type="button"
                        disabled={uploadingTarget === card.id}
                        onClick={() => cardImageInputRefs.current[card.id]?.click()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                      >
                        {uploadingTarget === card.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Upload className="w-3 h-3" />
                        )}
                        <span>Upload Photo</span>
                      </button>

                      <input
                        type="text"
                        value={card.image}
                        onChange={(e) => handleUpdateCardField(cardIdx, 'image', e.target.value)}
                        placeholder="/images/about/story-designer.jpg or URL"
                        className={`flex-1 px-2.5 py-1.5 rounded-lg border text-xs font-mono ${
                          isDark
                            ? 'bg-slate-900 border-slate-700 text-white'
                            : 'bg-white border-slate-200 text-slate-900'
                        }`}
                      />
                    </div>

                    <input
                      type="text"
                      value={card.imageAlt || ''}
                      onChange={(e) => handleUpdateCardField(cardIdx, 'imageAlt', e.target.value)}
                      placeholder="Photo alt description"
                      className={`w-full px-2.5 py-1.5 rounded-lg border text-[11px] ${
                        isDark
                          ? 'bg-slate-900 border-slate-700 text-white'
                          : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL: ADD BUSINESS VERTICAL */}
      {/* ============================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl transition-all ${
              isDark ? 'bg-[#0F172A] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-sky-500" />
                <h3 className="text-base font-bold">Add Business Vertical</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVertical} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Vertical Name / Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. AI & Intelligent Automation"
                  className={`w-full px-3.5 py-2 rounded-xl border text-sm font-medium ${
                    isDark
                      ? 'bg-slate-900 border-slate-700 text-white focus:border-sky-500'
                      : 'bg-white border-slate-200 text-slate-900 focus:border-sky-600'
                  }`}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold">
                    URL Route Slug <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Live URL: /businesses/<span className="font-mono text-sky-500">{newSlug || 'example'}</span>
                  </span>
                </div>
                <input
                  type="text"
                  required
                  value={newSlug}
                  onChange={(e) => {
                    setIsSlugManual(true);
                    setNewSlug(
                      e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9-]/g, '-')
                        .replace(/-+/g, '-')
                    );
                  }}
                  placeholder="e.g. ai-intelligent-automation"
                  className={`w-full px-3.5 py-2 rounded-xl border text-sm font-mono ${
                    isDark
                      ? 'bg-slate-900 border-slate-700 text-white focus:border-sky-500'
                      : 'bg-white border-slate-200 text-slate-900 focus:border-sky-600'
                  }`}
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  This sets the live route URL. Must be lowercase letters, numbers, and hyphens.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">
                  Short Tagline / Subtitle
                </label>
                <input
                  type="text"
                  value={newTagline}
                  onChange={(e) => setNewTagline(e.target.value)}
                  placeholder="e.g. Enterprise AI agents, models & automated workflows"
                  className={`w-full px-3.5 py-2 rounded-xl border text-xs ${
                    isDark
                      ? 'bg-slate-900 border-slate-700 text-white focus:border-sky-500'
                      : 'bg-white border-slate-200 text-slate-900 focus:border-sky-600'
                  }`}
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || !newTitle.trim() || !newSlug.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {isCreating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>Create Vertical Page</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
