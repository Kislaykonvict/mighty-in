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
  Cpu,
  Users,
  Layers,
  Code,
  Rocket,
  Globe,
  ShieldCheck,
  Briefcase,
  Zap,
  Terminal,
  Compass,
  Target,
  Mail,
  Phone,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Eye,
  FileText,
  User,
  Building,
  Send,
} from 'lucide-react';
import { useAdminTheme } from './AdminThemeContext';
import {
  ContactSectionData,
  ContactTopicOption,
  defaultContactSectionData,
} from '@/types/contactSection';

const AVAILABLE_ICONS = [
  { name: 'Sparkles', icon: Sparkles },
  { name: 'Cpu', icon: Cpu },
  { name: 'Users', icon: Users },
  { name: 'Layers', icon: Layers },
  { name: 'Code', icon: Code },
  { name: 'Rocket', icon: Rocket },
  { name: 'Globe', icon: Globe },
  { name: 'ShieldCheck', icon: ShieldCheck },
  { name: 'Briefcase', icon: Briefcase },
  { name: 'Zap', icon: Zap },
  { name: 'Terminal', icon: Terminal },
  { name: 'Compass', icon: Compass },
  { name: 'Target', icon: Target },
];

function getIconComponent(iconName: string) {
  const found = AVAILABLE_ICONS.find((i) => i.name.toLowerCase() === (iconName || '').toLowerCase());
  return found ? found.icon : Sparkles;
}

export function ContactManagementView() {
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<'hero' | 'topics' | 'form' | 'channels' | 'preview'>('hero');
  const [data, setData] = useState<ContactSectionData>(defaultContactSectionData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Topic editing state
  const [editingTopicIndex, setEditingTopicIndex] = useState<number | null>(null);
  const [topicModalOpen, setTopicModalOpen] = useState(false);
  const [topicDraft, setTopicDraft] = useState<ContactTopicOption>({
    id: '',
    label: '',
    tagline: '',
    icon: 'Sparkles',
    color: '#FF5E3A',
  });

  // Fetch initial data
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const res = await fetch('/api/admin/contact');
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
        }
      } catch (err) {
        console.error('Failed to load contact section data:', err);
        showToast('error', 'Failed to load contact section from server');
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
      const res = await fetch('/api/admin/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        setData(json.data);
        showToast('success', 'Contact section updated and revalidated successfully!');
      } else {
        showToast('error', json.error || 'Failed to save changes');
      }
    } catch (err: any) {
      showToast('error', err.message || 'Network error occurred while saving');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefaults = () => {
    if (confirm('Are you sure you want to reset all Contact page fields to their default values?')) {
      setData(defaultContactSectionData);
      showToast('success', 'Reset to defaults. Remember to click "Save Changes".');
    }
  };

  // Topic card operations
  const handleOpenAddTopic = () => {
    setEditingTopicIndex(null);
    setTopicDraft({
      id: `topic-${data.topics.length + 1}`,
      label: 'New Capability',
      tagline: 'Strategic service description',
      icon: 'Sparkles',
      color: '#3B82F6',
    });
    setTopicModalOpen(true);
  };

  const handleOpenEditTopic = (index: number) => {
    setEditingTopicIndex(index);
    setTopicDraft({ ...data.topics[index] });
    setTopicModalOpen(true);
  };

  const handleSaveTopicDraft = () => {
    if (!topicDraft.label.trim()) {
      alert('Please provide a topic label');
      return;
    }
    const newTopics = [...data.topics];
    if (editingTopicIndex !== null) {
      newTopics[editingTopicIndex] = { ...topicDraft };
    } else {
      newTopics.push({ ...topicDraft });
    }
    setData({ ...data, topics: newTopics });
    setTopicModalOpen(false);
    showToast('success', editingTopicIndex !== null ? 'Topic updated' : 'Topic added');
  };

  const handleDeleteTopic = (index: number) => {
    if (data.topics.length <= 1) {
      alert('At least one topic option is required');
      return;
    }
    if (confirm(`Remove "${data.topics[index].label}"?`)) {
      const newTopics = data.topics.filter((_, i) => i !== index);
      setData({ ...data, topics: newTopics });
      showToast('success', 'Topic removed');
    }
  };

  const handleMoveTopic = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= data.topics.length) return;
    const newTopics = [...data.topics];
    const temp = newTopics[index];
    newTopics[index] = newTopics[targetIdx];
    newTopics[targetIdx] = temp;
    setData({ ...data, topics: newTopics });
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-slate-500 dark:text-slate-400">
          <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm">Loading Contact Page Configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium transition-all animate-fade-in ${
            toast.type === 'success'
              ? 'bg-emerald-600 text-white'
              : 'bg-rose-600 text-white'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0E1526] border border-slate-200 dark:border-white/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold tracking-wider uppercase bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              Page Experience
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">/contact</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Contact Page Configuration
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Manage header hero copy, topic cards, form inputs, direct channel details, and SLA guarantees
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href="/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Page</span>
          </a>

          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-brand-crimson hover:from-rose-500 hover:to-rose-600 shadow-sm transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-white/10 space-x-2 overflow-x-auto pb-1">
        {[
          { id: 'hero', label: 'Hero & Intro Copy' },
          { id: 'topics', label: 'Topic Options (Step 01)' },
          { id: 'form', label: 'Form Fields & Copy (Steps 02-03)' },
          { id: 'channels', label: 'Sidebar Channels & SLA' },
          { id: 'preview', label: 'Live Page Preview' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white dark:bg-[#0E1526] text-rose-600 dark:text-rose-400 border-t border-x border-slate-200 dark:border-white/10 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Hero & Intro Copy */}
      {activeTab === 'hero' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0E1526] border border-slate-200 dark:border-white/10 space-y-6 shadow-sm">
          <div className="border-b border-slate-200 dark:border-white/10 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Header Hero &amp; Subtitle
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure the top section badge, main headline, crimson gradient emphasis, and narrative description.
              </p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Section Active</span>
              <input
                type="checkbox"
                checked={data.isActive}
                onChange={(e) => setData({ ...data, isActive: e.target.checked })}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Top Pill Badge Text
              </label>
              <input
                type="text"
                value={data.badge}
                onChange={(e) => setData({ ...data, badge: e.target.value })}
                placeholder="INITIATE PARTNERSHIP"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-rose-500"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Rendered with an animated dot indicator above the primary headline.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Primary Headline (Prefix)
              </label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
                placeholder="Let’s figure out what’s"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-rose-500"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                First half of the display heading.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Highlighted Headline (Crimson Gradient)
              </label>
              <input
                type="text"
                value={data.highlightedTitle}
                onChange={(e) => setData({ ...data, highlightedTitle: e.target.value })}
                placeholder="next for your business."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-rose-500"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Highlighted with the signature Mighty Warner crimson brand gradient.
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Introductory Subtitle / Narrative
              </label>
              <textarea
                rows={3}
                value={data.description}
                onChange={(e) => setData({ ...data, description: e.target.value })}
                placeholder="Tell us about your brand goals, software requirements, or talent needs..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-rose-500 resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Topic Options (Step 01) */}
      {activeTab === 'topics' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0E1526] border border-slate-200 dark:border-white/10 space-y-6 shadow-sm">
          <div className="border-b border-slate-200 dark:border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Step 01: Service Topics &amp; Capabilities
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage the selectable practice cards in Step 01, their icons, border accent colors, and taglines.
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenAddTopic}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Topic Option</span>
            </button>
          </div>

          {/* Section Step Heading */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Step 01 Label / Question
            </label>
            <input
              type="text"
              value={data.form.step1Heading}
              onChange={(e) =>
                setData({
                  ...data,
                  form: { ...data.form, step1Heading: e.target.value },
                })
              }
              placeholder="01. What can we help you move forward?"
              className="w-full max-w-md px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Talent Audience Toggle Sub-Settings */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-500" />
              <span>Talent Solutions Dual Audience Toggle Copy</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                  Prompt Text
                </label>
                <input
                  type="text"
                  value={data.form.talentAudiencePrompt}
                  onChange={(e) =>
                    setData({
                      ...data,
                      form: { ...data.form, talentAudiencePrompt: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                  Option 1 (Employer)
                </label>
                <input
                  type="text"
                  value={data.form.talentEmployerLabel}
                  onChange={(e) =>
                    setData({
                      ...data,
                      form: { ...data.form, talentEmployerLabel: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                  Option 2 (Candidate)
                </label>
                <input
                  type="text"
                  value={data.form.talentCandidateLabel}
                  onChange={(e) =>
                    setData({
                      ...data,
                      form: { ...data.form, talentCandidateLabel: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* List of Topic Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.topics.map((topic, index) => {
              const IconComp = getIconComponent(topic.icon);
              return (
                <div
                  key={topic.id || index}
                  className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] flex items-start justify-between gap-3 relative group"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                      style={{
                        backgroundColor: `${topic.color}15`,
                        borderColor: `${topic.color}40`,
                        color: topic.color,
                      }}
                    >
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {topic.label}
                        </span>
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: topic.color }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {topic.tagline}
                      </p>
                      <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-mono bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                        id: {topic.id}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveTopic(index, 'up')}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-30 cursor-pointer"
                      title="Move up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === data.topics.length - 1}
                      onClick={() => handleMoveTopic(index, 'down')}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-30 cursor-pointer"
                      title="Move down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEditTopic(index)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-white/20 transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteTopic(index)}
                      className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Delete topic"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Form Fields & Microcopy (Steps 02-03 & Success) */}
      {activeTab === 'form' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0E1526] border border-slate-200 dark:border-white/10 space-y-6 shadow-sm">
          <div className="border-b border-slate-200 dark:border-white/10 pb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Form Fields, Placeholders &amp; Confirmation Copy
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Customize input labels, placeholder examples, security assurance badges, CTA buttons, and thank-you screen templates.
            </p>
          </div>

          {/* Step 2 Inputs */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Step 02: Contact Information Fields
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Step 02 Header
                </label>
                <input
                  type="text"
                  value={data.form.step2Heading}
                  onChange={(e) =>
                    setData({
                      ...data,
                      form: { ...data.form, step2Heading: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name Label
                </label>
                <input
                  type="text"
                  value={data.form.nameLabel}
                  onChange={(e) =>
                    setData({
                      ...data,
                      form: { ...data.form, nameLabel: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name Placeholder
                </label>
                <input
                  type="text"
                  value={data.form.namePlaceholder}
                  onChange={(e) =>
                    setData({
                      ...data,
                      form: { ...data.form, namePlaceholder: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Work Email Label
                </label>
                <input
                  type="text"
                  value={data.form.emailLabel}
                  onChange={(e) =>
                    setData({
                      ...data,
                      form: { ...data.form, emailLabel: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Work Email Placeholder
                </label>
                <input
                  type="text"
                  value={data.form.emailPlaceholder}
                  onChange={(e) =>
                    setData({
                      ...data,
                      form: { ...data.form, emailPlaceholder: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Company Label
                </label>
                <input
                  type="text"
                  value={data.form.companyLabel}
                  onChange={(e) =>
                    setData({
                      ...data,
                      form: { ...data.form, companyLabel: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Company Placeholder
                </label>
                <input
                  type="text"
                  value={data.form.companyPlaceholder}
                  onChange={(e) =>
                    setData({
                      ...data,
                      form: { ...data.form, companyPlaceholder: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number Label (Optional)
                </label>
                <input
                  type="text"
                  value={data.form.phoneLabel}
                  onChange={(e) =>
                    setData({
                      ...data,
                      form: { ...data.form, phoneLabel: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number Placeholder
                </label>
                <input
                  type="text"
                  value={data.form.phonePlaceholder}
                  onChange={(e) =>
                    setData({
                      ...data,
                      form: { ...data.form, phonePlaceholder: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Step 3 Inputs */}
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-white/10">
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Step 03: Requirements &amp; Submit Action
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Step 03 Header
                </label>
                <input
                  type="text"
                  value={data.form.step3Heading}
                  onChange={(e) =>
                    setData({
                      ...data,
                      form: { ...data.form, step3Heading: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Requirements Message Label
                </label>
                <input
                  type="text"
                  value={data.form.messageLabel}
                  onChange={(e) =>
                    setData({
                      ...data,
                      form: { ...data.form, messageLabel: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Requirements Message Textarea Placeholder
                </label>
                <input
                  type="text"
                  value={data.form.messagePlaceholder}
                  onChange={(e) =>
                    setData({
                      ...data,
                      form: { ...data.form, messagePlaceholder: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Security / Mutual NDA Assurance Note
                </label>
                <input
                  type="text"
                  value={data.form.ndaText}
                  onChange={(e) =>
                    setData({
                      ...data,
                      form: { ...data.form, ndaText: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Submit Button Label
                </label>
                <input
                  type="text"
                  value={data.form.submitButtonText}
                  onChange={(e) =>
                    setData({
                      ...data,
                      form: { ...data.form, submitButtonText: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Success State */}
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-white/10">
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Inquiry Received / Success Confirmation Screen</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Reference Pill Badge (supports {'{referenceId}'})
                </label>
                <input
                  type="text"
                  value={data.form.successBadge}
                  onChange={(e) =>
                    setData({
                      ...data,
                      form: { ...data.form, successBadge: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Thank You Heading (supports {'{fullName}'})
                </label>
                <input
                  type="text"
                  value={data.form.successHeading}
                  onChange={(e) =>
                    setData({
                      ...data,
                      form: { ...data.form, successHeading: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Success Message Body (supports {'{companyName}'})
                </label>
                <textarea
                  rows={2}
                  value={data.form.successMessage}
                  onChange={(e) =>
                    setData({
                      ...data,
                      form: { ...data.form, successMessage: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Return Home Button Label
                </label>
                <input
                  type="text"
                  value={data.form.returnHomeText}
                  onChange={(e) =>
                    setData({
                      ...data,
                      form: { ...data.form, returnHomeText: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Explore Case Studies Button Label
                </label>
                <input
                  type="text"
                  value={data.form.caseStudiesText}
                  onChange={(e) =>
                    setData({
                      ...data,
                      form: { ...data.form, caseStudiesText: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div className="md:col-span-2 p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/20">
                <label className="block text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-1">
                  Confirmation Auto-Dismiss Duration (Seconds)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={data.form.autoResetSeconds ?? 6}
                    onChange={(e) =>
                      setData({
                        ...data,
                        form: {
                          ...data.form,
                          autoResetSeconds: Math.max(0, parseInt(e.target.value, 10) || 0),
                        },
                      })
                    }
                    className="w-32 px-3 py-2 text-sm font-semibold rounded-xl bg-white dark:bg-[#0B111E] border border-emerald-300 dark:border-emerald-500/30 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    seconds (recommended: 5–8s. Set to <strong>0</strong> to keep it permanently visible until user navigates away).
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Sidebar Channels & SLA */}
      {activeTab === 'channels' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0E1526] border border-slate-200 dark:border-white/10 space-y-6 shadow-sm">
          <div className="border-b border-slate-200 dark:border-white/10 pb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Sidebar Direct Channels &amp; Confidentiality Guarantee
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure the right-hand sidebar cards: direct email inquiry channels, office network scope, SLA guarantee, and NDA statement.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Card 1: Direct Channels
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Card Title
                </label>
                <input
                  type="text"
                  value={data.directChannels.title}
                  onChange={(e) =>
                    setData({
                      ...data,
                      directChannels: { ...data.directChannels, title: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  General Inquiries Label
                </label>
                <input
                  type="text"
                  value={data.directChannels.emailLabel}
                  onChange={(e) =>
                    setData({
                      ...data,
                      directChannels: { ...data.directChannels, emailLabel: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Inquiries Email Address
                </label>
                <input
                  type="email"
                  value={data.directChannels.email}
                  onChange={(e) =>
                    setData({
                      ...data,
                      directChannels: { ...data.directChannels, email: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Office Network Label
                </label>
                <input
                  type="text"
                  value={data.directChannels.officesLabel}
                  onChange={(e) =>
                    setData({
                      ...data,
                      directChannels: { ...data.directChannels, officesLabel: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Office Network Description
                </label>
                <input
                  type="text"
                  value={data.directChannels.officesText}
                  onChange={(e) =>
                    setData({
                      ...data,
                      directChannels: { ...data.directChannels, officesText: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Office Network Anchor Link (optional)
                </label>
                <input
                  type="text"
                  value={data.directChannels.officesLink || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      directChannels: { ...data.directChannels, officesLink: e.target.value },
                    })
                  }
                  placeholder="/contact#global-offices"
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  SLA Label
                </label>
                <input
                  type="text"
                  value={data.directChannels.slaLabel}
                  onChange={(e) =>
                    setData({
                      ...data,
                      directChannels: { ...data.directChannels, slaLabel: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  SLA Guarantee Text
                </label>
                <input
                  type="text"
                  value={data.directChannels.slaText}
                  onChange={(e) =>
                    setData({
                      ...data,
                      directChannels: { ...data.directChannels, slaText: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Confidentiality */}
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-white/10">
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Card 2: Confidentiality Guarantee</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Card Heading
                </label>
                <input
                  type="text"
                  value={data.confidentiality.title}
                  onChange={(e) =>
                    setData({
                      ...data,
                      confidentiality: { ...data.confidentiality, title: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Guarantee Statement Body
                </label>
                <textarea
                  rows={2}
                  value={data.confidentiality.description}
                  onChange={(e) =>
                    setData({
                      ...data,
                      confidentiality: { ...data.confidentiality, description: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Live Preview */}
      {activeTab === 'preview' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300 flex items-center gap-2">
            <Eye className="w-4 h-4 shrink-0" />
            <span>
              Real-time simulated storefront preview. This is an exact preview of how the Contact Hero and Form will appear to visitors.
            </span>
          </div>

          <div className="p-8 sm:p-12 rounded-3xl bg-[#DBDBDB] dark:bg-[#080C14] border border-slate-300 dark:border-white/10 space-y-8">
            {/* Header Preview */}
            <div className="max-w-4xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/5 dark:bg-white/10 border border-slate-900/10 dark:border-white/20 text-[11px] font-mono font-bold tracking-wider uppercase text-slate-800 dark:text-white">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>{data.badge}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                {data.title}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-brand-crimson to-orange-500">
                  {data.highlightedTitle}
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                {data.description}
              </p>
            </div>

            {/* Layout Grid Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Form Preview */}
              <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0F1626] border border-slate-200 dark:border-white/10 space-y-6 shadow-sm">
                {/* Step 1 Preview */}
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold mb-3">
                    {data.form.step1Heading}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {data.topics.map((t, idx) => {
                      const IconComp = getIconComponent(t.icon);
                      const isSelected = idx === 0;
                      return (
                        <div
                          key={idx}
                          className={`p-3.5 rounded-2xl border transition-all ${
                            isSelected
                              ? 'bg-slate-50 dark:bg-white/10 shadow-sm'
                              : 'bg-white dark:bg-white/[0.02] border-slate-200 dark:border-white/10'
                          }`}
                          style={{ borderColor: isSelected ? t.color : undefined }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <IconComp className="w-5 h-5" style={{ color: t.color }} />
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: t.color }}
                            />
                          </div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white mb-0.5">
                            {t.label}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                            {t.tagline}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2 Preview */}
                <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-white/10">
                  <div className="text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold">
                    {data.form.step2Heading}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-600 dark:text-slate-300 font-medium">
                        {data.form.nameLabel} *
                      </span>
                      <div className="mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-400 text-xs">
                        {data.form.namePlaceholder}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-600 dark:text-slate-300 font-medium">
                        {data.form.emailLabel} *
                      </span>
                      <div className="mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-400 text-xs">
                        {data.form.emailPlaceholder}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-600 dark:text-slate-300 font-medium">
                        {data.form.companyLabel} *
                      </span>
                      <div className="mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-400 text-xs">
                        {data.form.companyPlaceholder}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-600 dark:text-slate-300 font-medium">
                        {data.form.phoneLabel}
                      </span>
                      <div className="mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-400 text-xs">
                        {data.form.phonePlaceholder}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3 Preview */}
                <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-white/10">
                  <div className="text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold">
                    {data.form.step3Heading}
                  </div>
                  <div>
                    <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                      {data.form.messageLabel}
                    </span>
                    <div className="mt-1 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-400 text-xs">
                      {data.form.messagePlaceholder}
                    </div>
                  </div>
                </div>

                {/* Submit Preview */}
                <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 dark:border-white/10">
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    {data.form.ndaText}
                  </span>
                  <button
                    type="button"
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-brand-crimson shadow-sm flex items-center gap-1.5"
                  >
                    <span>{data.form.submitButtonText}</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Sidebar Preview */}
              <div className="lg:col-span-4 space-y-4">
                <div className="p-5 rounded-3xl bg-white dark:bg-[#0F1626] border border-slate-200 dark:border-white/10 space-y-4 shadow-sm">
                  <div className="text-xs font-mono uppercase tracking-widest text-rose-600 dark:text-rose-400 font-bold">
                    {data.directChannels.title}
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">
                        {data.directChannels.emailLabel}
                      </div>
                      <div className="text-slate-900 dark:text-white font-semibold flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-rose-600" />
                        <span>{data.directChannels.email}</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">
                        {data.directChannels.officesLabel}
                      </div>
                      <div className="text-slate-900 dark:text-white font-semibold flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-blue-600" />
                        <span>{data.directChannels.officesText}</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">
                        {data.directChannels.slaLabel}
                      </div>
                      <div className="text-slate-700 dark:text-slate-200 flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{data.directChannels.slaText}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>{data.confidentiality.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    {data.confidentiality.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Add Topic Modal */}
      {topicModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-white dark:bg-[#0F1626] border border-slate-200 dark:border-white/10 shadow-xl space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {editingTopicIndex !== null ? 'Edit Practice / Topic Option' : 'Add New Topic Option'}
              </h3>
              <button
                type="button"
                onClick={() => setTopicModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Topic Unique ID (slug)
                </label>
                <input
                  type="text"
                  value={topicDraft.id}
                  onChange={(e) =>
                    setTopicDraft({
                      ...topicDraft,
                      id: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                    })
                  }
                  placeholder="e.g. digital-growth"
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Display Label (Headline)
                </label>
                <input
                  type="text"
                  value={topicDraft.label}
                  onChange={(e) => setTopicDraft({ ...topicDraft, label: e.target.value })}
                  placeholder="e.g. Digital & Growth"
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tagline / Capabilities Subtext
                </label>
                <input
                  type="text"
                  value={topicDraft.tagline}
                  onChange={(e) => setTopicDraft({ ...topicDraft, tagline: e.target.value })}
                  placeholder="e.g. Brand, Web, SEO & Acquisition"
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Icon
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {AVAILABLE_ICONS.map(({ name, icon: Icon }) => {
                    const isSelected = topicDraft.icon.toLowerCase() === name.toLowerCase();
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setTopicDraft({ ...topicDraft, icon: name })}
                        className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1 border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-rose-50 dark:bg-rose-500/20 border-rose-500 text-rose-600 dark:text-rose-400'
                            : 'bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-[9px] font-mono truncate max-w-full">{name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Accent Hex Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={topicDraft.color}
                    onChange={(e) => setTopicDraft({ ...topicDraft, color: e.target.value })}
                    className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={topicDraft.color}
                    onChange={(e) => setTopicDraft({ ...topicDraft, color: e.target.value })}
                    className="w-32 px-3 py-2 text-sm font-mono rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                  />
                  <div className="flex items-center gap-1.5">
                    {['#FF5E3A', '#3B82F6', '#10B981', '#38BDF8', '#8B5CF6', '#F59E0B'].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setTopicDraft({ ...topicDraft, color: preset })}
                        className="w-6 h-6 rounded-full border border-white/20 hover:scale-110 transition-transform cursor-pointer"
                        style={{ backgroundColor: preset }}
                        title={preset}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setTopicModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveTopicDraft}
                className="px-4 py-2 text-xs font-bold rounded-xl text-white bg-rose-600 hover:bg-rose-500 cursor-pointer"
              >
                {editingTopicIndex !== null ? 'Save Changes' : 'Add Topic'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
