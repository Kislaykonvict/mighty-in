'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Globe,
  MapPin,
  Building2,
  Clock,
  Phone,
  Mail,
  MessageSquare,
  Users,
  Copy,
  Check,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  ArrowUp,
  ArrowDown,
  Navigation,
  Compass,
  Sparkles,
  Sliders,
  Eye,
  Calendar,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { useAdminTheme } from './AdminThemeContext';
import { GlobalOfficesData, defaultGlobalOfficesData, OfficeLocation, GlobalNetworkStat } from '@/types/globalOffices';

const TIMEZONE_PRESETS = [
  { label: 'Dubai (GST, UTC+4)', tz: 'Asia/Dubai', labelName: 'GST (Gulf Standard Time)', offset: 'UTC+4' },
  { label: 'New York (EST/EDT, UTC-5)', tz: 'America/New_York', labelName: 'EST / EDT (Eastern Time)', offset: 'UTC-5' },
  { label: 'Toronto (EDT/EST, UTC-5)', tz: 'America/Toronto', labelName: 'EDT / EST', offset: 'UTC-5' },
  { label: 'London (GMT/BST, UTC+0)', tz: 'Europe/London', labelName: 'GMT / BST (UK Time)', offset: 'UTC+0' },
  { label: 'India (IST, UTC+5:30)', tz: 'Asia/Kolkata', labelName: 'IST (Indian Standard Time)', offset: 'UTC+5:30' },
  { label: 'Singapore (SGT, UTC+8)', tz: 'Asia/Singapore', labelName: 'SGT (Singapore Time)', offset: 'UTC+8' },
  { label: 'Sydney (AEST, UTC+10)', tz: 'Australia/Sydney', labelName: 'AEST (Australian Eastern)', offset: 'UTC+10' },
  { label: 'San Francisco (PST, UTC-8)', tz: 'America/Los_Angeles', labelName: 'PST / PDT (Pacific Time)', offset: 'UTC-8' },
];

export function GlobalOfficesManagementView() {
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState<GlobalOfficesData>(defaultGlobalOfficesData);
  const [selectedOfficeIndex, setSelectedOfficeIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'narrative' | 'offices' | 'stats' | 'preview'>('offices');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [newSpecialty, setNewSpecialty] = useState('');
  const [previewTime, setPreviewTime] = useState<string>('');
  const [copiedPreview, setCopiedPreview] = useState(false);

  // Load existing data
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/admin/global-offices');
        const json = await res.json();
        if (json.success && json.data) {
          setFormData(json.data);
        }
      } catch (err: any) {
        console.error('Failed to load Global Offices configuration:', err);
        setFeedback({
          type: 'error',
          message: 'Failed to load existing configuration. Default settings loaded.',
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Auto-dismiss feedback toast
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Live clock simulation for active office in preview
  const currentOffice: OfficeLocation | undefined = formData.offices[selectedOfficeIndex] || formData.offices[0];

  useEffect(() => {
    if (!currentOffice?.timezone) return;
    const update = () => {
      try {
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: currentOffice.timezone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        });
        setPreviewTime(formatter.format(new Date()));
      } catch {
        setPreviewTime('--:--:--');
      }
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [currentOffice?.timezone]);

  // Save changes
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/admin/global-offices', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const json = await res.json();

      if (json.success) {
        setFeedback({
          type: 'success',
          message: 'Global Office Presence updated and published to storefront!',
        });
        if (json.data) {
          setFormData(json.data);
        }
      } else {
        throw new Error(json.error || 'Failed to save Global Offices settings');
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'Error saving Global Offices settings.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Revert defaults
  const handleRevert = () => {
    if (window.confirm('Reset all Global Offices data to original system defaults? Unsaved edits will be lost.')) {
      setFormData(defaultGlobalOfficesData);
      setSelectedOfficeIndex(0);
      setFeedback({
        type: 'success',
        message: 'Reverted to system defaults. Click Save & Publish to apply.',
      });
    }
  };

  // Office updates
  const updateCurrentOffice = (updater: (prev: OfficeLocation) => OfficeLocation) => {
    setFormData((prev) => {
      const updated = [...prev.offices];
      if (updated[selectedOfficeIndex]) {
        updated[selectedOfficeIndex] = updater(updated[selectedOfficeIndex]);
      }
      return { ...prev, offices: updated };
    });
  };

  // Add office
  const handleAddOffice = () => {
    const newId = `hub-${Date.now().toString(36)}`;
    const newOffice: OfficeLocation = {
      id: newId,
      city: 'New City',
      country: 'Country',
      countryCode: 'XX',
      flag: '📍',
      role: 'Regional Executive Hub',
      description: 'Regional corporate center driving strategic growth, local enterprise partnerships, and delivery oversight.',
      address: 'Suite #100, Innovation Tower, Central District',
      fullAddress: 'Suite #100, Innovation Tower, Central District - City, Country',
      coordinates: { lat: 20.0, lng: 0.0 },
      cobeLocation: [20.0, 0.0],
      timezone: 'UTC',
      timezoneLabel: 'UTC (Coordinated Universal Time)',
      utcOffset: 'UTC+0',
      phoneNumbers: [
        { label: 'Main Desk', number: '+1 800 000 0000', link: 'tel:+18000000000', isPrimary: true },
      ],
      whatsapp: { number: '+18000000000', link: 'https://wa.me/18000000000' },
      email: 'contact@mightywarner.com',
      specialties: ['Enterprise Technology', 'Regional Strategy'],
      teamSizeBadge: '25+ Specialists',
      established: new Date().getFullYear().toString(),
    };

    setFormData((prev) => ({
      ...prev,
      offices: [...prev.offices, newOffice],
    }));
    setSelectedOfficeIndex(formData.offices.length);
  };

  // Remove office
  const handleRemoveOffice = (index: number) => {
    if (formData.offices.length <= 1) {
      alert('You must have at least one office location.');
      return;
    }
    const target = formData.offices[index];
    if (window.confirm(`Delete "${target.city} (${target.country})"?`)) {
      setFormData((prev) => ({
        ...prev,
        offices: prev.offices.filter((_, i) => i !== index),
      }));
      setSelectedOfficeIndex(Math.max(0, index - 1));
    }
  };

  // Reorder offices
  const handleMoveOffice = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= formData.offices.length) return;

    setFormData((prev) => {
      const list = [...prev.offices];
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return { ...prev, offices: list };
    });
    setSelectedOfficeIndex(targetIndex);
  };

  // Add specialty
  const handleAddSpecialty = () => {
    if (!newSpecialty.trim() || !currentOffice) return;
    updateCurrentOffice((prev) => ({
      ...prev,
      specialties: [...(prev.specialties || []), newSpecialty.trim()],
    }));
    setNewSpecialty('');
  };

  // Remove specialty
  const handleRemoveSpecialty = (sIndex: number) => {
    updateCurrentOffice((prev) => ({
      ...prev,
      specialties: (prev.specialties || []).filter((_, i) => i !== sIndex),
    }));
  };

  // Add phone number
  const handleAddPhone = () => {
    updateCurrentOffice((prev) => ({
      ...prev,
      phoneNumbers: [
        ...(prev.phoneNumbers || []),
        { label: 'Direct Desk', number: '+1 000 000 0000', link: 'tel:+10000000000' },
      ],
    }));
  };

  // Remove phone number
  const handleRemovePhone = (pIndex: number) => {
    updateCurrentOffice((prev) => ({
      ...prev,
      phoneNumbers: (prev.phoneNumbers || []).filter((_, i) => i !== pIndex),
    }));
  };

  // Update phone number
  const handleUpdatePhone = (pIndex: number, field: string, value: any) => {
    updateCurrentOffice((prev) => {
      const phones = [...(prev.phoneNumbers || [])];
      phones[pIndex] = { ...phones[pIndex], [field]: value };
      return { ...prev, phoneNumbers: phones };
    });
  };

  // Stats update
  const handleUpdateStat = (idx: number, field: keyof GlobalNetworkStat, val: string) => {
    setFormData((prev) => {
      const updated = [...prev.stats];
      updated[idx] = { ...updated[idx], [field]: val };
      return { ...prev, stats: updated };
    });
  };

  const handleAddStat = () => {
    setFormData((prev) => ({
      ...prev,
      stats: [...prev.stats, { label: 'New Metric', value: '100+', subtext: 'Global description' }],
    }));
  };

  const handleRemoveStat = (idx: number) => {
    if (formData.stats.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== idx),
    }));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-rose-600" />
        <p className="text-sm text-slate-500 font-medium">Loading Global Offices configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      {/* Top Banner Alert / Toast */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between border shadow-sm animate-fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
              : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
          }`}
        >
          <div className="flex items-center gap-3">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
            )}
            <span className="text-sm font-semibold">{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header & Main Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-700 text-white shadow-sm shadow-rose-600/30">
              <Globe className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Global Office Presence
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                formData.isActive
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {formData.isActive ? 'Active on Storefront' : 'Hidden'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl">
            Configure regional hubs, interactive 3D globe coordinates, contact desks, timezones, and metric cards displayed on the homepage and contact page.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Active Status Switch */}
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, isActive: !prev.isActive }))}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 cursor-pointer ${
              formData.isActive
                ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${formData.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
            <span>{formData.isActive ? 'Section Enabled' : 'Section Disabled'}</span>
          </button>

          {/* Revert Defaults */}
          <button
            type="button"
            onClick={handleRevert}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Reset to default locations"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          {/* View Live */}
          <Link
            href="/#global-offices"
            target="_blank"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live</span>
          </Link>

          {/* Save Button */}
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 shadow-md shadow-rose-600/25 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>{isSaving ? 'Publishing...' : 'Save & Publish'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('offices')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'offices'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Building2 className="w-3.5 h-3.5 text-rose-600" />
          <span>Executive Hubs & Offices ({formData.offices.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('stats')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'stats'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-blue-500" />
          <span>Metric Stats ({formData.stats.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('narrative')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'narrative'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Section Header & Copy</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'preview'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-emerald-500" />
          <span>Live Card Preview</span>
        </button>
      </div>

      {/* TAB 1: OFFICES & HUBS */}
      {activeTab === 'offices' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Office Selector List */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs font-bold font-mono uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                Configured Locations
              </span>
              <button
                type="button"
                onClick={handleAddOffice}
                className="px-2.5 py-1 rounded-lg text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Office</span>
              </button>
            </div>

            <div className="space-y-2">
              {formData.offices.map((office, idx) => {
                const isSelected = selectedOfficeIndex === idx;
                return (
                  <div
                    key={office.id || idx}
                    onClick={() => setSelectedOfficeIndex(idx)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative group ${
                      isSelected
                        ? 'bg-rose-50/70 dark:bg-slate-800 border-rose-500 dark:border-rose-500/80 shadow-sm'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{office.flag || '📍'}</span>
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {office.city || 'Untitled City'}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                        {office.countryCode || 'LOC'}
                      </span>
                    </div>

                    <div className="text-xs text-rose-600 dark:text-rose-400 font-medium truncate mb-1">
                      {office.role || 'Regional Hub'}
                    </div>

                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {office.address}
                    </div>

                    {/* Action buttons (Move & Delete) */}
                    <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-mono">
                        {office.timezone} ({office.utcOffset})
                      </span>
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => handleMoveOffice(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 disabled:opacity-30 cursor-pointer"
                          title="Move up"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveOffice(idx, 'down')}
                          disabled={idx === formData.offices.length - 1}
                          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 disabled:opacity-30 cursor-pointer"
                          title="Move down"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveOffice(idx)}
                          className="p-1 rounded hover:bg-rose-100 dark:hover:bg-rose-950/50 text-rose-600 cursor-pointer"
                          title="Delete office"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Office Detailed Form */}
          {currentOffice && (
            <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{currentOffice.flag || '📍'}</span>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">
                      Editing {currentOffice.city || 'Office'}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Configure coordinates, live timezone, contact channels, and addresses.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                    ID: {currentOffice.id}
                  </span>
                </div>
              </div>

              {/* Basic Details */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                  1. City, Country & Role
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      City Name
                    </label>
                    <input
                      type="text"
                      value={currentOffice.city}
                      onChange={(e) => updateCurrentOffice((prev) => ({ ...prev, city: e.target.value }))}
                      placeholder="e.g. Dubai, Albany, NY"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Country Name
                    </label>
                    <input
                      type="text"
                      value={currentOffice.country}
                      onChange={(e) => updateCurrentOffice((prev) => ({ ...prev, country: e.target.value }))}
                      placeholder="e.g. United Arab Emirates"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Flag Emoji
                      </label>
                      <input
                        type="text"
                        value={currentOffice.flag}
                        onChange={(e) => updateCurrentOffice((prev) => ({ ...prev, flag: e.target.value }))}
                        placeholder="🇦🇪"
                        className="w-full px-3 py-2 text-sm text-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Code
                      </label>
                      <input
                        type="text"
                        value={currentOffice.countryCode}
                        onChange={(e) => updateCurrentOffice((prev) => ({ ...prev, countryCode: e.target.value.toUpperCase() }))}
                        placeholder="AE"
                        maxLength={4}
                        className="w-full px-3 py-2 text-xs uppercase text-center font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Role / Hub Hierarchy Designation
                    </label>
                    <input
                      type="text"
                      value={currentOffice.role}
                      onChange={(e) => updateCurrentOffice((prev) => ({ ...prev, role: e.target.value }))}
                      placeholder="e.g. Middle East & Regional HQ"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Team Size Badge
                    </label>
                    <input
                      type="text"
                      value={currentOffice.teamSizeBadge}
                      onChange={(e) => updateCurrentOffice((prev) => ({ ...prev, teamSizeBadge: e.target.value }))}
                      placeholder="e.g. 45+ Specialists"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>
              </div>

              {/* Geolocation & Timezone */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                    2. Geolocation Coordinates & Timezone
                  </h3>
                  <span className="text-[11px] text-slate-400">Used for 3D Globe camera focus & live clock</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Latitude (-90 to 90)
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={currentOffice.coordinates?.lat ?? 0}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        updateCurrentOffice((prev) => ({
                          ...prev,
                          coordinates: { lat: val, lng: prev.coordinates?.lng ?? 0 },
                          cobeLocation: [val, prev.coordinates?.lng ?? 0],
                        }));
                      }}
                      placeholder="25.1872"
                      className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Longitude (-180 to 180)
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={currentOffice.coordinates?.lng ?? 0}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        updateCurrentOffice((prev) => ({
                          ...prev,
                          coordinates: { lat: prev.coordinates?.lat ?? 0, lng: val },
                          cobeLocation: [prev.coordinates?.lat ?? 0, val],
                        }));
                      }}
                      placeholder="55.2744"
                      className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      UTC Offset
                    </label>
                    <input
                      type="text"
                      value={currentOffice.utcOffset}
                      onChange={(e) => updateCurrentOffice((prev) => ({ ...prev, utcOffset: e.target.value }))}
                      placeholder="e.g. UTC+4, UTC-5, UTC+5:30"
                      className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      IANA Timezone Identifier
                    </label>
                    <input
                      type="text"
                      value={currentOffice.timezone}
                      onChange={(e) => updateCurrentOffice((prev) => ({ ...prev, timezone: e.target.value }))}
                      placeholder="e.g. Asia/Dubai, America/New_York"
                      className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                    <div className="flex flex-wrap gap-1 mt-2">
                      <span className="text-[10px] text-slate-400 mr-1 self-center">Presets:</span>
                      {TIMEZONE_PRESETS.map((p, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => {
                            updateCurrentOffice((prev) => ({
                              ...prev,
                              timezone: p.tz,
                              timezoneLabel: p.labelName,
                              utcOffset: p.offset,
                            }));
                          }}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 transition-colors"
                        >
                          {p.label.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Timezone Label
                    </label>
                    <input
                      type="text"
                      value={currentOffice.timezoneLabel}
                      onChange={(e) => updateCurrentOffice((prev) => ({ ...prev, timezoneLabel: e.target.value }))}
                      placeholder="e.g. GST (Gulf Standard Time)"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>
              </div>

              {/* Addresses */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                  3. Physical Address & Narrative
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Display Address (Card View)
                  </label>
                  <input
                    type="text"
                    value={currentOffice.address}
                    onChange={(e) => updateCurrentOffice((prev) => ({ ...prev, address: e.target.value }))}
                    placeholder="e.g. Office #816, 8th Floor, The Burlington Tower, Marasi Drive, Business Bay"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Address (Clipboard Copy Button)
                  </label>
                  <input
                    type="text"
                    value={currentOffice.fullAddress || currentOffice.address}
                    onChange={(e) => updateCurrentOffice((prev) => ({ ...prev, fullAddress: e.target.value }))}
                    placeholder="e.g. Office #816, 8th Floor, The Burlington Tower, Marasi Drive, Business Bay - Dubai, UAE"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Hub Overview Narrative
                  </label>
                  <textarea
                    rows={3}
                    value={currentOffice.description}
                    onChange={(e) => updateCurrentOffice((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe regional operations, leadership focus, and delivery capabilities..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              {/* Contact Channels */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                    4. Direct Contact Channels
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddPhone}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Phone Number</span>
                  </button>
                </div>

                {/* Phone Numbers List */}
                <div className="space-y-2.5">
                  {(currentOffice.phoneNumbers || []).map((phone, pIdx) => (
                    <div
                      key={pIdx}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center"
                    >
                      <div className="sm:col-span-4">
                        <input
                          type="text"
                          value={phone.label}
                          onChange={(e) => handleUpdatePhone(pIdx, 'label', e.target.value)}
                          placeholder="Label (e.g. UAE Toll Free)"
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                      </div>
                      <div className="sm:col-span-4">
                        <input
                          type="text"
                          value={phone.number}
                          onChange={(e) => {
                            const val = e.target.value;
                            handleUpdatePhone(pIdx, 'number', val);
                            handleUpdatePhone(pIdx, 'link', `tel:${val.replace(/\s+/g, '')}`);
                          }}
                          placeholder="Number (e.g. 800-644-489)"
                          className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                      </div>
                      <div className="sm:col-span-3 flex items-center gap-3">
                        <label className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(phone.isTollFree)}
                            onChange={(e) => handleUpdatePhone(pIdx, 'isTollFree', e.target.checked)}
                            className="rounded text-rose-600"
                          />
                          <span>Toll Free</span>
                        </label>
                      </div>
                      <div className="sm:col-span-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleRemovePhone(pIdx)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                          title="Remove phone"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Direct Email Address
                    </label>
                    <input
                      type="email"
                      value={currentOffice.email}
                      onChange={(e) => updateCurrentOffice((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="dubai@mightywarner.com"
                      className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      WhatsApp Desk Number
                    </label>
                    <input
                      type="text"
                      value={currentOffice.whatsapp?.number || ''}
                      onChange={(e) => {
                        const num = e.target.value;
                        updateCurrentOffice((prev) => ({
                          ...prev,
                          whatsapp: {
                            number: num,
                            link: `https://wa.me/${num.replace(/[^0-9]/g, '')}`,
                          },
                        }));
                      }}
                      placeholder="+971 54 586 4310"
                      className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>
              </div>

              {/* Regional Specialties */}
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                  5. Regional Capabilities & Specialties
                </h3>

                <div className="flex flex-wrap gap-2">
                  {(currentOffice.specialties || []).map((spec, sIdx) => (
                    <span
                      key={sIdx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium"
                    >
                      <span>{spec}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecialty(sIdx)}
                        className="hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 max-w-md">
                  <input
                    type="text"
                    value={newSpecialty}
                    onChange={(e) => setNewSpecialty(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSpecialty();
                      }
                    }}
                    placeholder="Add specialty tag (e.g. AI & Digital Growth)..."
                    className="flex-1 px-3.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddSpecialty}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: METRIC STATS */}
      {activeTab === 'stats' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Global Network Highlights (4 Cards)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Metric cards displayed right above the 3D Globe section across the storefront.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddStat}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Metric Card</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.stats.map((stat, sIdx) => (
              <div
                key={sIdx}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-rose-600 dark:text-rose-400">
                    Card #{sIdx + 1}
                  </span>
                  {formData.stats.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveStat(sIdx)}
                      className="p-1 rounded text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Label (Uppercase Eyebrow)
                  </label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => handleUpdateStat(sIdx, 'label', e.target.value)}
                    placeholder="e.g. GLOBAL HUBS"
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Prominent Metric Value
                  </label>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => handleUpdateStat(sIdx, 'value', e.target.value)}
                    placeholder="e.g. 4 Offices, 24/7 Follow-the-Sun"
                    className="w-full px-3 py-1.5 text-sm font-bold font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Supporting Subtext
                  </label>
                  <input
                    type="text"
                    value={stat.subtext}
                    onChange={(e) => handleUpdateStat(sIdx, 'subtext', e.target.value)}
                    placeholder="e.g. Continuous delivery across 3 continents"
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SECTION HEADER & COPY */}
      {activeTab === 'narrative' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Section Header & Narrative Messaging
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Customize the titles, badges, and follow-the-sun handoff banner text.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Eyebrow Badge
              </label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) => setFormData((prev) => ({ ...prev, badge: e.target.value }))}
                placeholder="GLOBAL PRESENCE & REGIONAL HUBS"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Main Headline (Leading Text)
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Local Proximity."
                  className="w-full px-3.5 py-2 text-sm font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Highlighted Accent Headline (Crimson / Gradient)
                </label>
                <input
                  type="text"
                  value={formData.highlightedTitle}
                  onChange={(e) => setFormData((prev) => ({ ...prev, highlightedTitle: e.target.value }))}
                  placeholder="Global Velocity."
                  className="w-full px-3.5 py-2 text-sm font-bold text-rose-600 dark:text-rose-400 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Description / Editorial Intro
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Enter lead paragraph..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                24/7 Hand-off Cycle Banner Text
              </label>
              <input
                type="text"
                value={formData.cycleBannerText}
                onChange={(e) => setFormData((prev) => ({ ...prev, cycleBannerText: e.target.value }))}
                placeholder="EST (US) ➔ GST (UAE) ➔ IST (India)"
                className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Shown below the 3D globe indicating continuous follow-the-sun timezone handoff.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LIVE PREVIEW */}
      {activeTab === 'preview' && currentOffice && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Storefront Office Card Simulation
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Real-time interactive preview of the selected office card with active timezone clock and address copying.
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              {formData.offices.map((o, idx) => (
                <button
                  key={o.id || idx}
                  type="button"
                  onClick={() => setSelectedOfficeIndex(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedOfficeIndex === idx
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <span className="mr-1">{o.flag}</span>
                  <span>{o.city.split(',')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Rendered Office Card */}
          <div className="max-w-2xl mx-auto p-7 md:p-8 rounded-3xl bg-white dark:bg-[#141D30] border border-slate-200 dark:border-white/15 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-600 via-blue-600 to-emerald-500" />

            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="text-3xl">{currentOffice.flag}</span>
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    {currentOffice.city}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 dark:bg-brand-crimson/15 dark:text-brand-crimson dark:border-brand-crimson/25 text-xs font-semibold">
                    {currentOffice.country}
                  </span>
                </div>
                <div className="text-sm font-semibold text-rose-600 dark:text-brand-royal flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-rose-600" />
                  <span>{currentOffice.role}</span>
                </div>
              </div>

              {/* Live Clock Pill */}
              <div className="flex flex-col items-end px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider">
                  <Clock className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Local Time</span>
                </div>
                <div className="text-lg font-bold text-slate-900 dark:text-white font-mono tracking-tight">
                  {previewTime || '--:--:--'}
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  ● Active Desk ({currentOffice.utcOffset})
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-normal">
              {currentOffice.description}
            </p>

            <div className="space-y-4 mb-7 bg-slate-50 dark:bg-white/[0.02] p-5 rounded-2xl border border-slate-200 dark:border-white/6">
              {/* Address */}
              <div className="flex items-start justify-between gap-3 text-sm">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span className="text-slate-800 dark:text-slate-200 font-medium">{currentOffice.address}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(currentOffice.fullAddress || currentOffice.address);
                    setCopiedPreview(true);
                    setTimeout(() => setCopiedPreview(false), 2000);
                  }}
                  className="p-1.5 rounded-lg bg-slate-200/60 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors shrink-0 flex items-center gap-1 text-xs cursor-pointer"
                >
                  {copiedPreview ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600 text-[11px]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Phone Numbers */}
              <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-200 dark:border-white/5 text-sm">
                {(currentOffice.phoneNumbers || []).map((phone, pIdx) => (
                  <div key={pIdx} className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-mono text-xs">
                    <Phone className="w-3.5 h-3.5 text-rose-600" />
                    <span className="text-xs text-slate-500 dark:text-slate-400">{phone.label}:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{phone.number}</span>
                  </div>
                ))}
              </div>

              {/* Email & Team */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-200 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <Mail className="w-3.5 h-3.5 text-rose-600" />
                  <span>{currentOffice.email}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                  <Users className="w-3.5 h-3.5 text-rose-600" />
                  <span>{currentOffice.teamSizeBadge}</span>
                </div>
              </div>
            </div>

            {/* Specialties */}
            <div className="mb-6">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Regional Capabilities & Focus:
              </div>
              <div className="flex flex-wrap gap-2">
                {(currentOffice.specialties || []).map((spec, sIdx) => (
                  <span
                    key={sIdx}
                    className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
              {currentOffice.whatsapp && (
                <div className="flex-1 min-w-[160px] py-2 px-4 rounded-xl text-center bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-bold text-xs flex items-center justify-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp Desk</span>
                </div>
              )}
              <div className="flex-1 min-w-[160px] py-2 px-4 rounded-xl text-center bg-rose-600 text-white font-bold text-xs flex items-center justify-center gap-2">
                <span>Connect with {currentOffice.city.split(',')[0]}</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
