'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  X,
  Lock,
  Mail,
  User,
  Power,
  KeyRound,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAdminTheme } from './AdminThemeContext';

export interface AdminUserData {
  id: string;
  name: string;
  email: string;
  role: 'SUPERADMIN' | 'ADMIN' | 'EDITOR';
  isActive: boolean;
  avatarUrl?: string | null;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export function UserManagementView() {
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';

  const [users, setUsers] = useState<AdminUserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<'ALL' | 'SUPERADMIN' | 'ADMIN' | 'EDITOR'>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

  const handleExecuteSearch = (customVal?: string) => {
    const val = typeof customVal === 'string' ? customVal : searchInput;
    setAppliedSearch(val.trim());
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setAppliedSearch('');
  };

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeUser, setActiveUser] = useState<AdminUserData | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<'SUPERADMIN' | 'ADMIN' | 'EDITOR'>('ADMIN');
  const [formPassword, setFormPassword] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);
  const [formAvatarUrl, setFormAvatarUrl] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Fetch users from API
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setUsers(json.data);
      } else {
        throw new Error(json.error || 'Failed to fetch users');
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error loading users' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users with pattern matching across name and email
  const filteredUsers = users.filter((u) => {
    const matchesSearch = (() => {
      const query = appliedSearch.trim().toLowerCase();
      if (!query) return true;
      const terms = query.split(/\s+/);
      return terms.every(
        (term) =>
          u.name.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term)
      );
    })();

    const matchesRole =
      selectedRoleFilter === 'ALL' || u.role === selectedRoleFilter;

    const matchesStatus =
      selectedStatusFilter === 'ALL' ||
      (selectedStatusFilter === 'ACTIVE' && u.isActive) ||
      (selectedStatusFilter === 'INACTIVE' && !u.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Role counts
  const totalCount = users.length;
  const superadminCount = users.filter((u) => u.role === 'SUPERADMIN').length;
  const adminCount = users.filter((u) => u.role === 'ADMIN').length;
  const editorCount = users.filter((u) => u.role === 'EDITOR').length;

  // Open Create Modal
  const openCreateModal = () => {
    setFormName('');
    setFormEmail('');
    setFormRole('ADMIN');
    setFormPassword('');
    setFormIsActive(true);
    setFormAvatarUrl('');
    setShowPassword(false);
    setIsCreateModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (user: AdminUserData) => {
    setActiveUser(user);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormRole(user.role);
    setFormPassword('');
    setFormIsActive(user.isActive);
    setFormAvatarUrl(user.avatarUrl || '');
    setShowPassword(false);
    setIsEditModalOpen(true);
  };

  // Open Delete Modal
  const openDeleteModal = (user: AdminUserData) => {
    setActiveUser(user);
    setIsDeleteModalOpen(true);
  };

  // Handle Create User
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          password: formPassword,
          role: formRole,
          isActive: formIsActive,
          avatarUrl: formAvatarUrl,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to create user');
      }

      setUsers((prev) => [json.data, ...prev]);
      setIsCreateModalOpen(false);
      setFeedback({ type: 'success', message: `User "${json.data.name}" created successfully!` });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error creating user' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Edit User
  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeUser) return;
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/admin/users/${activeUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          role: formRole,
          isActive: formIsActive,
          avatarUrl: formAvatarUrl,
          password: formPassword.trim() ? formPassword.trim() : undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to update user');
      }

      setUsers((prev) =>
        prev.map((u) => (u.id === activeUser.id ? { ...u, ...json.data } : u))
      );
      setIsEditModalOpen(false);
      setFeedback({ type: 'success', message: `User "${json.data.name}" updated successfully!` });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error updating user' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Toggle Active Status
  const handleToggleActive = async (user: AdminUserData) => {
    const nextStatus = !user.isActive;
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: nextStatus }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to update status');
      }

      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, isActive: nextStatus } : u))
      );
      setFeedback({
        type: 'success',
        message: `Account status set to ${nextStatus ? 'Active' : 'Inactive'}`,
      });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error updating status' });
      setTimeout(() => setFeedback(null), 3500);
    }
  };

  // Handle Delete User
  const handleDeleteUser = async () => {
    if (!activeUser) return;
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/admin/users/${activeUser.id}`, {
        method: 'DELETE',
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to delete user');
      }

      setUsers((prev) => prev.filter((u) => u.id !== activeUser.id));
      setIsDeleteModalOpen(false);
      setFeedback({ type: 'success', message: `User "${activeUser.name}" deleted` });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error deleting user' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // High contrast role badges
  const getRoleBadge = (role: AdminUserData['role']) => {
    switch (role) {
      case 'SUPERADMIN':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold font-sans bg-purple-100 text-purple-900 border border-purple-200/80 dark:bg-purple-950/70 dark:text-purple-200 dark:border-purple-800 shadow-xs">
            <ShieldAlert className="w-3.5 h-3.5 text-purple-700 dark:text-purple-300" />
            SUPERADMIN
          </span>
        );
      case 'ADMIN':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold font-sans bg-blue-100 text-blue-900 border border-blue-200/80 dark:bg-blue-950/70 dark:text-blue-200 dark:border-blue-800 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-700 dark:text-blue-300" />
            ADMIN
          </span>
        );
      case 'EDITOR':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold font-sans bg-emerald-100 text-emerald-900 border border-emerald-200/80 dark:bg-emerald-950/70 dark:text-emerald-200 dark:border-emerald-800 shadow-xs">
            <Shield className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-300" />
            EDITOR
          </span>
        );
    }
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between border-2 shadow-lg animate-fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-500 text-emerald-900 dark:bg-emerald-950/80 dark:border-emerald-500 dark:text-emerald-200'
              : 'bg-rose-50 border-rose-500 text-rose-900 dark:bg-rose-950/80 dark:border-rose-500 dark:text-rose-200'
          }`}
        >
          <div className="flex items-center gap-3 text-sm font-bold">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Role Counts Summary Header (Executive Metric Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Users */}
        <button
          type="button"
          onClick={() => setSelectedRoleFilter('ALL')}
          className={`relative overflow-hidden p-5 sm:p-6 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
            selectedRoleFilter === 'ALL'
              ? isDark
                ? 'bg-[#0F172A] border-indigo-500 ring-2 ring-indigo-500/20 shadow-md -translate-y-0.5'
                : 'bg-white border-indigo-600 ring-2 ring-indigo-500/20 shadow-md -translate-y-0.5'
              : isDark
              ? 'bg-[#0F172A] border-slate-800 hover:border-slate-700 shadow-sm'
              : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-sm'
          } before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-gradient-to-r before:from-indigo-500 before:to-indigo-600`}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-[11px] font-bold font-sans uppercase tracking-wider ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Total Users
            </span>
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center border shadow-xs ${
                isDark
                  ? 'bg-indigo-950/70 text-indigo-400 border-indigo-800/60'
                  : 'bg-indigo-50 text-indigo-600 border-indigo-100'
              }`}
            >
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div
            className={`text-3xl sm:text-4xl font-extrabold tracking-tight font-sans ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            {totalCount}
          </div>
        </button>

        {/* Superadmin */}
        <button
          type="button"
          onClick={() => setSelectedRoleFilter('SUPERADMIN')}
          className={`relative overflow-hidden p-5 sm:p-6 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
            selectedRoleFilter === 'SUPERADMIN'
              ? isDark
                ? 'bg-[#0F172A] border-purple-500 ring-2 ring-purple-500/20 shadow-md -translate-y-0.5'
                : 'bg-white border-purple-600 ring-2 ring-purple-500/20 shadow-md -translate-y-0.5'
              : isDark
              ? 'bg-[#0F172A] border-slate-800 hover:border-slate-700 shadow-sm'
              : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-sm'
          } before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-gradient-to-r before:from-purple-500 before:to-fuchsia-600`}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-[11px] font-bold font-sans uppercase tracking-wider ${
                isDark ? 'text-purple-300' : 'text-purple-700'
              }`}
            >
              Superadmin
            </span>
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center border shadow-xs ${
                isDark
                  ? 'bg-purple-950/70 text-purple-400 border-purple-800/60'
                  : 'bg-purple-50 text-purple-600 border-purple-100'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div
            className={`text-3xl sm:text-4xl font-extrabold tracking-tight font-sans ${
              isDark ? 'text-purple-200' : 'text-purple-950'
            }`}
          >
            {superadminCount}
          </div>
        </button>

        {/* Admin */}
        <button
          type="button"
          onClick={() => setSelectedRoleFilter('ADMIN')}
          className={`relative overflow-hidden p-5 sm:p-6 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
            selectedRoleFilter === 'ADMIN'
              ? isDark
                ? 'bg-[#0F172A] border-blue-500 ring-2 ring-blue-500/20 shadow-md -translate-y-0.5'
                : 'bg-white border-blue-600 ring-2 ring-blue-500/20 shadow-md -translate-y-0.5'
              : isDark
              ? 'bg-[#0F172A] border-slate-800 hover:border-slate-700 shadow-sm'
              : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-sm'
          } before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-gradient-to-r before:from-blue-500 before:to-sky-600`}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-[11px] font-bold font-sans uppercase tracking-wider ${
                isDark ? 'text-blue-300' : 'text-blue-700'
              }`}
            >
              Admin
            </span>
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center border shadow-xs ${
                isDark
                  ? 'bg-blue-950/70 text-blue-400 border-blue-800/60'
                  : 'bg-blue-50 text-blue-600 border-blue-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div
            className={`text-3xl sm:text-4xl font-extrabold tracking-tight font-sans ${
              isDark ? 'text-blue-200' : 'text-blue-950'
            }`}
          >
            {adminCount}
          </div>
        </button>

        {/* Editor */}
        <button
          type="button"
          onClick={() => setSelectedRoleFilter('EDITOR')}
          className={`relative overflow-hidden p-5 sm:p-6 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
            selectedRoleFilter === 'EDITOR'
              ? isDark
                ? 'bg-[#0F172A] border-emerald-500 ring-2 ring-emerald-500/20 shadow-md -translate-y-0.5'
                : 'bg-white border-emerald-600 ring-2 ring-emerald-500/20 shadow-md -translate-y-0.5'
              : isDark
              ? 'bg-[#0F172A] border-slate-800 hover:border-slate-700 shadow-sm'
              : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-sm'
          } before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-gradient-to-r before:from-emerald-500 before:to-teal-600`}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-[11px] font-bold font-sans uppercase tracking-wider ${
                isDark ? 'text-emerald-300' : 'text-emerald-700'
              }`}
            >
              Editor
            </span>
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center border shadow-xs ${
                isDark
                  ? 'bg-emerald-950/70 text-emerald-400 border-emerald-800/60'
                  : 'bg-emerald-50 text-emerald-600 border-emerald-100'
              }`}
            >
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <div
            className={`text-3xl sm:text-4xl font-extrabold tracking-tight font-sans ${
              isDark ? 'text-emerald-200' : 'text-emerald-950'
            }`}
          >
            {editorCount}
          </div>
        </button>
      </div>

      {/* Main Table Card (High Contrast) */}
      <div
        className={`rounded-2xl border shadow-sm overflow-hidden transition-colors ${
          isDark ? 'bg-[#0F172A] border-slate-800/80' : 'bg-white border-slate-200/90'
        }`}
      >
        {/* Table Action Controls Header */}
        <div
          className={`p-4 sm:p-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isDark ? 'border-slate-800/80 bg-[#0B111E]/70' : 'border-slate-200/80 bg-slate-50/60'
          }`}
        >
          {/* Search Input & Button on Left */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleExecuteSearch();
            }}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <div className="relative w-full sm:w-72 lg:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  if (e.target.value === '') {
                    setAppliedSearch('');
                  }
                }}
                className={`w-full pl-9 pr-8 py-2.5 rounded-xl text-xs font-medium transition-all focus:outline-none border ${
                  isDark
                    ? 'bg-slate-800/80 border-slate-700/80 text-white placeholder:text-slate-500 focus:border-indigo-500'
                    : 'bg-white border-slate-300/80 text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100'
                }`}
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              type="submit"
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm shrink-0 cursor-pointer ${
                isDark
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/30'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>
          </form>

          {/* Right: Status Filter, Refresh, Add User */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {/* Status Filter */}
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value as any)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold focus:outline-none border transition-colors cursor-pointer ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-slate-200'
                  : 'bg-white border-slate-300 text-slate-800 hover:border-slate-400'
              }`}
            >
              <option value="ALL">Status: All</option>
              <option value="ACTIVE">Status: Active</option>
              <option value="INACTIVE">Status: Inactive</option>
            </select>

            {/* Refresh Button */}
            <button
              onClick={fetchUsers}
              disabled={isLoading}
              className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400'
              }`}
              title="Refresh users"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            {/* + Add New User Button (Vibrant Indigo Highlight) */}
            <button
              onClick={openCreateModal}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold font-sans tracking-normal transition-all shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/35 hover:scale-[1.01] flex items-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add New User</span>
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr
                className={`border-b font-sans font-bold uppercase tracking-wider text-[11px] ${
                  isDark
                    ? 'border-slate-800/80 bg-[#0A0F1D] text-slate-400'
                    : 'border-slate-200/90 bg-slate-50/80 text-slate-600'
                }`}
              >
                <th className="py-3.5 px-6">User Details</th>
                <th className="py-3.5 px-6">Assigned Role</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Joined Date</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredUsers.map((user) => {
                const initials = getInitials(user.name);

                return (
                  <tr
                    key={user.id}
                    className={`transition-colors ${
                      isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50/70'
                    }`}
                  >
                    {/* User Identity Column with Avatar & Status Dot */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5">
                        <div className="relative">
                          {user.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              alt={user.name}
                              className="w-10 h-10 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 shadow-sm"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-700 to-sky-500 flex items-center justify-center text-white font-extrabold text-xs shadow-sm">
                              {initials}
                            </div>
                          )}
                          {/* Live Presence Indicator */}
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${
                              user.isActive ? 'bg-emerald-500' : 'bg-slate-400'
                            }`}
                          />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white text-sm tracking-tight font-sans">
                            {user.name}
                          </div>
                          <div className="font-sans text-slate-500 dark:text-slate-400 text-xs font-medium flex items-center gap-1.5 mt-0.5">
                            <Mail className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                            <span>{user.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role Column */}
                    <td className="py-4 px-6">{getRoleBadge(user.role)}</td>

                    {/* Status Column */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold font-sans border ${
                          user.isActive
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200/80 dark:bg-emerald-950/70 dark:text-emerald-200 dark:border-emerald-800'
                            : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            user.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                          }`}
                        />
                        <span>{user.isActive ? 'Active' : 'Inactive'}</span>
                      </span>
                    </td>

                    {/* Joined Date */}
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-300 font-sans text-xs font-medium">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>

                    {/* Actions Column */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Quick Toggle Active Status */}
                        <button
                          onClick={() => handleToggleActive(user)}
                          className={`p-2 rounded-xl border transition-all cursor-pointer ${
                            user.isActive
                              ? 'border-emerald-300/80 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                              : 'border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                          title={user.isActive ? 'Deactivate user' : 'Activate user'}
                        >
                          <Power className="w-4 h-4" />
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => openEditModal(user)}
                          className={`p-2 rounded-xl border transition-all cursor-pointer ${
                            isDark
                              ? 'border-indigo-800 bg-indigo-950/50 hover:bg-indigo-900 text-indigo-300'
                              : 'border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-800 shadow-xs'
                          }`}
                          title="Edit user details"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => openDeleteModal(user)}
                          className="p-2 rounded-xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-rose-800 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300 transition-all cursor-pointer shadow-xs"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {isLoading && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-600 dark:text-slate-400">
                    <RefreshCw className="w-7 h-7 text-indigo-600 animate-spin mx-auto mb-2" />
                    <div className="text-sm font-extrabold text-slate-800 dark:text-slate-200">Loading platform users...</div>
                  </td>
                </tr>
              )}

              {filteredUsers.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-600 dark:text-slate-400">
                    <Users className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto mb-2" />
                    <div className="text-base font-extrabold text-slate-800 dark:text-slate-200">No users found</div>
                    <div className="text-xs text-slate-500 mt-1">
                      Try adjusting your search query or role filter.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination & Count Footer */}
        <div
          className={`px-6 py-3.5 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${
            isDark
              ? 'border-slate-800/80 bg-[#0B111E]/70 text-slate-400'
              : 'border-slate-200/90 bg-slate-50/60 text-slate-600'
          }`}
        >
          <div className="font-medium">
            Showing <span className="font-bold text-slate-900 dark:text-white">{filteredUsers.length}</span> of{' '}
            <span className="font-bold text-slate-900 dark:text-white">{users.length}</span> platform accounts
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-600 text-xs font-semibold cursor-not-allowed opacity-60"
            >
              Previous
            </button>
            <button
              disabled
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-600 text-xs font-semibold cursor-not-allowed opacity-60"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* CREATE USER MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`w-full max-w-lg rounded-2xl border-2 shadow-2xl p-6 sm:p-7 space-y-6 animate-fade-in ${
              isDark ? 'bg-[#0F172A] border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b-2 border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 flex items-center justify-center border border-indigo-200">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">Add New User</h3>
                  <p className="text-xs font-semibold text-slate-500">Create an administrator or editor account</p>
                </div>
              </div>

              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-xs font-bold border-2 focus:outline-none focus:ring-2 transition-all ${
                      isDark
                        ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500'
                        : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-600 focus:ring-indigo-100'
                    }`}
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="sarah@mightywarner.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-xs font-bold border-2 focus:outline-none focus:ring-2 transition-all font-mono ${
                      isDark
                        ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500'
                        : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-600 focus:ring-indigo-100'
                    }`}
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  Assigned Role & Permissions *
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'SUPERADMIN', label: 'Superadmin', desc: 'Full root access' },
                    { id: 'ADMIN', label: 'Admin', desc: 'Manage content & leads' },
                    { id: 'EDITOR', label: 'Editor', desc: 'Articles & pages only' },
                  ].map((r) => (
                    <button
                      type="button"
                      key={r.id}
                      onClick={() => setFormRole(r.id as any)}
                      className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                        formRole === r.id
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                          : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                      }`}
                    >
                      <div className="font-black text-xs">{r.label}</div>
                      <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{r.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  Initial Password (Min 6 characters) *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="••••••••••••"
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    className={`w-full pl-9 pr-10 py-2.5 rounded-xl text-xs font-bold border-2 focus:outline-none focus:ring-2 transition-all font-mono ${
                      isDark
                        ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500'
                        : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-600 focus:ring-indigo-100'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Active Status Checkbox */}
              <div className="flex items-center gap-3 pt-1">
                <input
                  type="checkbox"
                  id="create-active"
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                <label htmlFor="create-active" className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Account is Active (User can log in immediately)
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t-2 border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black font-mono uppercase tracking-wider transition-all shadow-md shadow-indigo-600/30 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {isEditModalOpen && activeUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`w-full max-w-lg rounded-2xl border-2 shadow-2xl p-6 sm:p-7 space-y-6 animate-fade-in ${
              isDark ? 'bg-[#0F172A] border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b-2 border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 flex items-center justify-center border border-indigo-200">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">Edit User</h3>
                  <p className="text-xs font-semibold text-slate-500">Update account credentials and access level</p>
                </div>
              </div>

              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditUser} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-xs font-bold border-2 focus:outline-none focus:ring-2 transition-all ${
                      isDark
                        ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500'
                        : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-600 focus:ring-indigo-100'
                    }`}
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-xs font-bold border-2 focus:outline-none focus:ring-2 transition-all font-mono ${
                      isDark
                        ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500'
                        : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-600 focus:ring-indigo-100'
                    }`}
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  Assigned Role *
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'SUPERADMIN', label: 'Superadmin', desc: 'Full root access' },
                    { id: 'ADMIN', label: 'Admin', desc: 'Manage content & leads' },
                    { id: 'EDITOR', label: 'Editor', desc: 'Articles & pages only' },
                  ].map((r) => (
                    <button
                      type="button"
                      key={r.id}
                      onClick={() => setFormRole(r.id as any)}
                      className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                        formRole === r.id
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                          : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                      }`}
                    >
                      <div className="font-black text-xs">{r.label}</div>
                      <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{r.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Password Reset (Optional) */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 flex items-center justify-between">
                  <span>Reset Password (Optional)</span>
                  <span className="text-[11px] text-slate-500 font-medium">Leave blank to retain current password</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter new password..."
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    className={`w-full pl-9 pr-10 py-2.5 rounded-xl text-xs font-bold border-2 focus:outline-none focus:ring-2 transition-all font-mono ${
                      isDark
                        ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500'
                        : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-600 focus:ring-indigo-100'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Active Status Checkbox */}
              <div className="flex items-center gap-3 pt-1">
                <input
                  type="checkbox"
                  id="edit-active"
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                <label htmlFor="edit-active" className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Account is Active
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t-2 border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black font-mono uppercase tracking-wider transition-all shadow-md shadow-indigo-600/30 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && activeUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`w-full max-w-md rounded-2xl border-2 shadow-2xl p-6 space-y-5 animate-fade-in ${
              isDark ? 'bg-[#0F172A] border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-200">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Delete User Account?
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Are you sure you want to delete <strong className="text-slate-900 dark:text-white">{activeUser.name}</strong> ({activeUser.email})? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t-2 border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black font-mono uppercase tracking-wider transition-all shadow-md shadow-rose-600/30 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
