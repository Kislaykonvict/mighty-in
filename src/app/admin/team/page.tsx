'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Users,
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
  Upload,
  ArrowUp,
  ArrowDown,
  Loader2,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { useAdminTheme } from '@/components/admin/AdminThemeContext';
import { MinimalRichTextEditor } from '@/components/admin/MinimalRichTextEditor';
import { uploadMedia } from '@/lib/clientUpload';
import { TeamMemberItem, TeamPageSettings, defaultTeamPageSettings } from '@/types/team';

export default function AdminTeamPage() {
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';

  const [members, setMembers] = useState<TeamMemberItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Editorial Banner state
  const [bannerSettings, setBannerSettings] = useState<TeamPageSettings>(defaultTeamPageSettings);
  const [isSavingBanner, setIsSavingBanner] = useState(false);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMemberItem | null>(null);
  const [isSavingMember, setIsSavingMember] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form inputs
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formSpecialty, setFormSpecialty] = useState('');
  const [formBio, setFormBio] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formDepartment, setFormDepartment] = useState('Leadership');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/team');
      const data = await res.json();
      if (data.success && Array.isArray(data.members)) {
        setMembers(data.members);
      }
    } catch {
      showToast('Error loading team members', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchBannerSettings = async () => {
    try {
      const res = await fetch('/api/admin/team/settings');
      const data = await res.json();
      if (data.success && data.data) {
        setBannerSettings(data.data);
      }
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchBannerSettings();
  }, []);

  const handleSaveBanner = async () => {
    setIsSavingBanner(true);
    try {
      const res = await fetch('/api/admin/team/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bannerSettings),
      });
      const data = await res.json();
      if (data.success) {
        setBannerSettings(data.data);
        showToast('Team page banner updated successfully!');
      } else {
        showToast(data.error || 'Failed to update page banner', 'error');
      }
    } catch {
      showToast('Network error while saving page banner', 'error');
    } finally {
      setIsSavingBanner(false);
    }
  };

  const openCreateModal = () => {
    setEditingMember(null);
    setFormName('');
    setFormRole('');
    setFormSpecialty('');
    setFormBio('');
    setFormImage('');
    setFormDepartment('Leadership');
    setIsModalOpen(true);
  };

  const openEditModal = (member: TeamMemberItem) => {
    setEditingMember(member);
    setFormName(member.name);
    setFormRole(member.role);
    setFormSpecialty(member.specialty);
    setFormBio(member.bio);
    setFormImage(member.image);
    setFormDepartment(member.department || 'Leadership');
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const result = await uploadMedia({
        file,
        folder: 'mighty-warner/team',
        resourceType: 'image',
        previousUrl: formImage || '',
      });

      setFormImage(result.url);
      showToast('Picture uploaded successfully!');
    } catch (err: any) {
      showToast(err.message || 'Error uploading image', 'error');
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmitMember = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim()) {
      showToast('Please enter the team member name', 'error');
      return;
    }
    if (!formRole.trim()) {
      showToast('Please enter the designation / role', 'error');
      return;
    }
    if (!formSpecialty.trim()) {
      showToast('Please enter the domain / title specialty', 'error');
      return;
    }
    if (!formImage.trim()) {
      showToast('Please provide a picture for this member', 'error');
      return;
    }
    if (!formBio.trim()) {
      showToast('Please provide a description / bio', 'error');
      return;
    }

    setIsSavingMember(true);
    try {
      const payload = {
        name: formName.trim(),
        role: formRole.trim(),
        specialty: formSpecialty.trim(),
        image: formImage.trim(),
        bio: formBio.trim(),
        department: formDepartment.trim() || 'Leadership',
      };

      let res;
      if (editingMember) {
        res = await fetch('/api/admin/team', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingMember.id, ...payload }),
        });
      } else {
        res = await fetch('/api/admin/team', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (data.success) {
        showToast(
          editingMember
            ? 'Team member updated successfully!'
            : 'New team member added successfully!'
        );
        setIsModalOpen(false);
        fetchMembers();
      } else {
        showToast(data.error || 'Failed to save team member', 'error');
      }
    } catch {
      showToast('Network error while saving team member', 'error');
    } finally {
      setIsSavingMember(false);
    }
  };

  const handleDeleteMember = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/team?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showToast('Team member removed successfully');
        setDeleteConfirmId(null);
        fetchMembers();
      } else {
        showToast(data.error || 'Failed to delete member', 'error');
      }
    } catch {
      showToast('Network error while deleting member', 'error');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= members.length) return;

    const newMembers = [...members];
    const [moved] = newMembers.splice(index, 1);
    newMembers.splice(targetIndex, 0, moved);

    const reordered = newMembers.map((m, idx) => ({ ...m, order: idx }));
    setMembers(reordered);

    try {
      await fetch('/api/admin/team', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: reordered.map((m) => ({ id: m.id, order: m.order })),
        }),
      });
    } catch {
      showToast('Failed to save member sequence', 'error');
      fetchMembers();
    }
  };

  const filteredMembers = members.filter((m) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      m.name.toLowerCase().includes(q) ||
      m.role.toLowerCase().includes(q) ||
      m.specialty.toLowerCase().includes(q) ||
      m.bio.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl transition-all ${
            toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            <span>Leadership &amp; Team Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage multidisciplinary leadership profiles, titles, pictures, and the editorial banner displayed on /team.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            href="/team"
            target="_blank"
            className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/25 flex items-center gap-1.5 transition-colors"
          >
            <span>Live /team</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={openCreateModal}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Team Member</span>
          </button>
        </div>
      </div>

      {/* ── 1. Team Page Editorial Banner ── */}
      <div
        className={`p-6 rounded-2xl border space-y-4 ${
          isDark ? 'bg-[#0B101D] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-rose-500" />
              <span>Team Page Editorial Banner</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Controls the top eyebrow, headline, and subtitle paragraph on /team.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSaveBanner}
            disabled={isSavingBanner}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
          >
            {isSavingBanner ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Update Banner</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Badge Eyebrow
            </label>
            <MinimalRichTextEditor
              value={bannerSettings.eyebrow}
              onChange={(val) => setBannerSettings({ ...bannerSettings, eyebrow: val })}
              placeholder="CROSS-FUNCTIONAL EXPERTISE"
              variant="inline"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Headline Title
            </label>
            <MinimalRichTextEditor
              value={bannerSettings.title}
              onChange={(val) => setBannerSettings({ ...bannerSettings, title: val })}
              placeholder="Behind the work are people who care about the outcome."
              variant="inline"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Subtitle Paragraph
            </label>
            <MinimalRichTextEditor
              value={bannerSettings.subtitle}
              onChange={(val) => setBannerSettings({ ...bannerSettings, subtitle: val })}
              placeholder="Our multidisciplinary leadership unifies brand architects..."
              variant="multiline"
              minHeight="68px"
            />
          </div>
        </div>
      </div>

      {/* ── 2. Team Member Catalog ── */}
      <div
        className={`p-6 rounded-2xl border space-y-6 ${
          isDark ? 'bg-[#0B101D] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-900 dark:text-white">
                  Team Members Catalog
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {members.length} Members
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Organize member cards. Click arrow buttons to reorder how they appear on the live site.
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search member, role, title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-8 pr-7 py-2 rounded-xl border text-xs focus:ring-2 focus:ring-rose-500/20 focus:outline-none transition-all ${
                isDark
                  ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Member Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mb-3 text-rose-500" />
            <p className="text-xs font-medium">Loading team members...</p>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <Users className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              {searchQuery ? 'No matching team members found' : 'No team members added yet'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              {searchQuery ? 'Try clearing your search query' : 'Click the button below to add your first member.'}
            </p>
            {!searchQuery && (
              <button
                onClick={openCreateModal}
                className="mt-4 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add First Member</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredMembers.map((member, index) => (
              <div
                key={member.id}
                className={`p-5 rounded-2xl border flex flex-col justify-between transition-all group ${
                  isDark
                    ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div>
                  {/* Picture Preview */}
                  <div className="relative h-56 w-full rounded-xl overflow-hidden mb-4 bg-slate-100 dark:bg-slate-800">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <Users className="w-10 h-10 opacity-30" />
                      </div>
                    )}

                    {/* Order Badge */}
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-black/70 text-white backdrop-blur-xs">
                      #{index + 1}
                    </span>
                  </div>

                  {/* Specialty / Domain Title */}
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 line-clamp-1 mb-1">
                    {member.specialty}
                  </div>

                  {/* Name */}
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-0.5">
                    {member.name}
                  </h3>

                  {/* Role / Designation */}
                  <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2.5">
                    {member.role}
                  </div>

                  {/* Bio / Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {member.bio}
                  </p>
                </div>

                {/* Actions Footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMove(index, 'up')}
                      title="Move up"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === members.length - 1}
                      onClick={() => handleMove(index, 'down')}
                      title="Move down"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEditModal(member)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(member.id)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── 3. Add / Edit Member Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div
            className={`w-full max-w-xl rounded-2xl border p-6 my-8 shadow-2xl transition-all ${
              isDark ? 'bg-[#0E1524] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {editingMember ? 'Edit Team Member' : 'Add New Team Member'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Configure title, name, designation, picture, and description.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitMember} className="space-y-4">
              {/* Title / Specialty */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Title / Domain Specialty <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. ENTERPRISE STRATEGY & BRAND ARCHITECTURE"
                  value={formSpecialty}
                  onChange={(e) => setFormSpecialty(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-rose-500/20 focus:outline-none transition-all ${
                    isDark
                      ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                  required
                />
                <p className="text-[11px] text-slate-400">
                  Displays as the uppercase red eyebrow tag above the member&apos;s name.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Alexander Warner"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-rose-500/20 focus:outline-none transition-all ${
                      isDark
                        ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
                        : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                    }`}
                    required
                  />
                </div>

                {/* Designation / Role */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Designation / Role <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Managing Director & Strategic Lead"
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-rose-500/20 focus:outline-none transition-all ${
                      isDark
                        ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
                        : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                    }`}
                    required
                  />
                </div>
              </div>

              {/* Picture (URL or File Upload) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Picture (Image URL or Upload) <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    placeholder="https://... or upload a photo"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    className={`flex-1 px-3.5 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-rose-500/20 focus:outline-none transition-all ${
                      isDark
                        ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
                        : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                    }`}
                    required
                  />

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage}
                    className="px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 text-xs font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors"
                  >
                    {isUploadingImage ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>Upload</span>
                  </button>
                </div>

                {/* Picture Preview */}
                {formImage && (
                  <div className="relative h-28 w-24 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 mt-2">
                    <Image
                      src={formImage}
                      alt="Preview"
                      fill
                      className="object-cover object-center"
                      unoptimized
                    />
                  </div>
                )}
              </div>

              {/* Description / Bio */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Description / Bio <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="15+ years guiding Fortune 500 and high-growth scale-ups through high-stakes brand repositioning..."
                  value={formBio}
                  onChange={(e) => setFormBio(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-rose-500/20 focus:outline-none transition-all leading-relaxed resize-none ${
                    isDark
                      ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                  required
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingMember}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 shadow-sm"
                >
                  {isSavingMember ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>{editingMember ? 'Save Changes' : 'Create Member'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 4. Delete Confirmation Modal ── */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div
            className={`w-full max-w-sm rounded-2xl border p-6 shadow-2xl transition-all ${
              isDark ? 'bg-[#0E1524] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Delete Team Member?
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
              Are you sure you want to permanently delete this team member? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteMember(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
              >
                Delete Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
