'use client';

import React, { useState, useEffect } from 'react';
import {
  Mail,
  Search,
  Download,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Users,
  UserCheck,
  UserX,
  X,
} from 'lucide-react';
import { useAdminTheme } from '@/components/admin/AdminThemeContext';

interface SubscriberItem {
  id: string;
  email: string;
  source: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminNewsletterPage() {
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';

  const [subscribers, setSubscribers] = useState<SubscriberItem[]>([]);
  const [counts, setCounts] = useState({ total: 0, active: 0, unsubscribed: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'UNSUBSCRIBED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const url = new URL('/api/admin/newsletter', window.location.origin);
      if (statusFilter !== 'ALL') url.searchParams.set('status', statusFilter);
      if (searchQuery.trim()) url.searchParams.set('search', searchQuery.trim());

      const res = await fetch(url.toString());
      const data = await res.json();

      if (data.success) {
        setSubscribers(data.data || []);
        setCounts(data.counts || { total: 0, active: 0, unsubscribed: 0 });
      } else {
        showToast(data.error || 'Failed to load subscribers', 'error');
      }
    } catch {
      showToast('Network error while loading subscribers', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSubscribers();
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'UNSUBSCRIBED' : 'ACTIVE';
    try {
      const res = await fetch('/api/admin/newsletter', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Subscriber marked as ${nextStatus}`);
        fetchSubscribers();
      } else {
        showToast(data.error || 'Failed to update status', 'error');
      }
    } catch {
      showToast('Network error while updating status', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/newsletter?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showToast('Subscriber removed successfully');
        setDeleteConfirmId(null);
        fetchSubscribers();
      } else {
        showToast(data.error || 'Failed to delete subscriber', 'error');
      }
    } catch {
      showToast('Network error while deleting subscriber', 'error');
    }
  };

  const exportCSV = () => {
    if (subscribers.length === 0) {
      showToast('No subscriber data to export', 'error');
      return;
    }

    const headers = ['Email', 'Source', 'Status', 'Date Subscribed'];
    const rows = subscribers.map((s) => [
      s.email,
      s.source || 'footer',
      s.status,
      new Date(s.createdAt).toISOString(),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `mighty-warner-subscribers-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl transition-all ${
            toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Newsletter Subscribers</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Dedicated subscriber database from website footer and blog sidebar forms.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/25 flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0D1321] border border-slate-200 dark:border-white/10 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Total Subscribers
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {counts.total}
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0D1321] border border-slate-200 dark:border-white/10 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Active Subscribers
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {counts.active}
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0D1321] border border-slate-200 dark:border-white/10 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center shrink-0">
            <UserX className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Unsubscribed
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {counts.unsubscribed}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#0D1321] border border-slate-200 dark:border-white/10 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          {(['ALL', 'ACTIVE', 'UNSUBSCRIBED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                statusFilter === st
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-rose-500"
          />
        </form>
      </div>

      {/* Subscribers Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-rose-600 dark:text-sky-400" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading subscribers...</p>
        </div>
      ) : subscribers.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#0D1321] border border-slate-200 dark:border-white/10">
          <Mail className="w-12 h-12 text-slate-300 dark:text-white/20 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No subscribers found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Submissions via the footer form or the blog sidebar will appear here.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl bg-white dark:bg-[#0D1321] border border-slate-200 dark:border-white/10 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-white/[0.02] border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Email Address</th>
                  <th className="py-3.5 px-6">Source</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Subscribed Date</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {subscribers.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-colors"
                  >
                    <td className="py-4 px-6 font-semibold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-400 font-mono">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-[11px]">
                        {item.source || 'footer'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => toggleStatus(item.id, item.status)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                          item.status === 'ACTIVE'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40'
                            : 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400'
                        }`}
                        title="Click to toggle status"
                      >
                        {item.status === 'ACTIVE' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        <span>{item.status}</span>
                      </button>
                    </td>
                    <td className="py-4 px-6 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                      {new Date(item.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {deleteConfirmId === item.id ? (
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="px-2 py-1 rounded-md text-[11px] font-bold bg-rose-600 text-white hover:bg-rose-700 transition-colors"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="p-1 rounded-md text-slate-400 hover:text-slate-200"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(item.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                          title="Delete subscriber"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

