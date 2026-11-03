'use client';

import React, { useState, useEffect } from 'react';
import {
  Inbox,
  Search,
  Filter,
  Trash2,
  Mail,
  Phone,
  Building,
  User,
  Calendar,
  Clock,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Eye,
  RefreshCw,
  Sparkles,
  Cpu,
  Users,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useAdminTheme } from './AdminThemeContext';

interface LeadItem {
  id: string;
  type: string;
  topic: string | null;
  source: string | null;
  fullName: string;
  email: string;
  company: string | null;
  phone: string | null;
  message: string | null;
  data: any;
  status: 'NEW' | 'REVIEWED' | 'CONTACTED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
}

export function LeadsManagementView() {
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';

  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [counts, setCounts] = useState({
    total: 0,
    new: 0,
    reviewed: 0,
    contacted: 0,
    archived: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [topicFilter, setTopicFilter] = useState('ALL');
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);

  const fetchLeads = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      if (topicFilter !== 'ALL') params.set('topic', topicFilter);
      if (search.trim()) params.set('search', search.trim());

      const res = await fetch(`/api/admin/leads?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setLeads(json.data || []);
        if (json.counts) setCounts(json.counts);
      }
    } catch (err) {
      console.error('Failed to load leads:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [statusFilter, topicFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLeads();
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      setIsUpdatingStatus(id);
      const res = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setLeads((prev) =>
          prev.map((lead) => (lead.id === id ? { ...lead, status: newStatus as any } : lead))
        );
        if (selectedLead && selectedLead.id === id) {
          setSelectedLead({ ...selectedLead, status: newStatus as any });
        }
        // Refresh counts
        fetchLeads();
      }
    } catch (err) {
      console.error('Failed to update lead status:', err);
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this submission?')) return;
    try {
      const res = await fetch(`/api/admin/leads?id=${id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        setLeads((prev) => prev.filter((lead) => lead.id !== id));
        if (selectedLead?.id === id) setSelectedLead(null);
        fetchLeads();
      }
    } catch (err) {
      console.error('Failed to delete lead:', err);
    }
  };

  const getTopicBadge = (topic: string | null) => {
    switch (topic) {
      case 'digital-growth':
        return {
          label: 'Digital & Growth',
          color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
          icon: Sparkles,
        };
      case 'technology':
        return {
          label: 'Technology',
          color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
          icon: Cpu,
        };
      case 'talent-solutions':
        return {
          label: 'Talent Solutions',
          color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
          icon: Users,
        };
      case 'ecosystem':
        return {
          label: 'Connected Ecosystem',
          color: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
          icon: Layers,
        };
      default:
        return {
          label: topic || 'General Inquiry',
          color: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
          icon: Inbox,
        };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30';
      case 'REVIEWED':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'CONTACTED':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'ARCHIVED':
        return 'bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-500/20';
      default:
        return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0E1526] border border-slate-200 dark:border-white/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold tracking-wider uppercase bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              Inbound CRM
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              PostgreSQL • LeadSubmission
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Lead Submissions &amp; Client Inquiries
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Review incoming consultation inquiries, project briefs, client specifications, and practice requests
          </p>
        </div>

        <button
          type="button"
          onClick={fetchLeads}
          disabled={isLoading}
          className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0E1526] border border-slate-200 dark:border-white/10 shadow-xs">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            Total Inquiries
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {counts.total}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0E1526] border border-rose-500/30 dark:border-rose-500/30 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/10 rounded-bl-full pointer-events-none" />
          <div className="text-xs font-bold text-rose-600 dark:text-rose-400 mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>New / Unread</span>
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 font-mono">
            {counts.new}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0E1526] border border-emerald-500/30 shadow-xs">
          <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1">
            Contacted
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {counts.contacted}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0E1526] border border-slate-200 dark:border-white/10 shadow-xs">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            Reviewed / In Progress
          </div>
          <div className="text-2xl font-black text-slate-700 dark:text-slate-300 font-mono">
            {counts.reviewed}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#0E1526] border border-slate-200 dark:border-white/10 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Pills & Category Selector */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: 'ALL', label: 'All Inquiries' },
              { id: 'NEW', label: `New (${counts.new})` },
              { id: 'REVIEWED', label: 'Reviewed' },
              { id: 'CONTACTED', label: 'Contacted' },
              { id: 'ARCHIVED', label: 'Archived' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Category / Topic Dropdown */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-white/10">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
              Category:
            </span>
            <select
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              className="px-2.5 py-1 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="digital-growth">Digital & Growth</option>
              <option value="technology">Technology</option>
              <option value="talent-solutions">Talent Solutions</option>
              <option value="ecosystem">Connected Ecosystem</option>
            </select>
          </div>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="w-full md:w-72 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search name, company, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
          />
        </form>
      </div>

      {/* Leads Table / Cards */}
      <div className="rounded-2xl bg-white dark:bg-[#0E1526] border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400 text-sm flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-rose-500" />
            <span>Loading submissions...</span>
          </div>
        ) : leads.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/5 text-slate-400 flex items-center justify-center mx-auto">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              No submissions found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              When visitors fill out the Contact form on /contact, their inquiry details will appear here in real-time.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-3.5 px-4 font-semibold">Date &amp; Ref</th>
                  <th className="py-3.5 px-4 font-semibold">Lead Details</th>
                  <th className="py-3.5 px-4 font-semibold">Category / Practice</th>
                  <th className="py-3.5 px-4 font-semibold">Requirements Preview</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-xs">
                {leads.map((lead) => {
                  const topicBadge = getTopicBadge(lead.topic);
                  const Icon = topicBadge.icon;
                  const refId = lead.data?.referenceId || `MW-${lead.id.slice(-6).toUpperCase()}`;
                  const formattedDate = new Date(lead.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });
                  const formattedTime = new Date(lead.createdAt).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors"
                    >
                      {/* Date & Ref */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-mono text-[11px] font-bold text-slate-900 dark:text-white">
                          #{refId}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">
                          {formattedDate} • {formattedTime}
                        </div>
                      </td>

                      {/* Lead Details */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {lead.fullName}
                        </div>
                        {lead.company && (
                          <div className="text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-1">
                            <Building className="w-3 h-3 text-slate-400" />
                            <span>{lead.company}</span>
                          </div>
                        )}
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                          <a
                            href={`mailto:${lead.email}`}
                            className="hover:text-rose-600 dark:hover:text-sky-400 transition-colors flex items-center gap-1"
                          >
                            <Mail className="w-3 h-3" />
                            <span>{lead.email}</span>
                          </a>
                          {lead.phone && (
                            <span className="text-slate-300 dark:text-slate-600">•</span>
                          )}
                          {lead.phone && (
                            <a
                              href={`tel:${lead.phone}`}
                              className="hover:text-rose-600 dark:hover:text-sky-400 transition-colors flex items-center gap-1"
                            >
                              <Phone className="w-3 h-3" />
                              <span>{lead.phone}</span>
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Practice Area */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${topicBadge.color}`}
                        >
                          <Icon className="w-3 h-3" />
                          <span>{topicBadge.label}</span>
                        </span>
                      </td>

                      {/* Message Preview */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="line-clamp-2 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                          {lead.message || lead.data?.digitalDetails?.marketingChallenge || 'No additional note provided.'}
                        </p>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <select
                          value={lead.status}
                          disabled={isUpdatingStatus === lead.id}
                          onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${getStatusBadge(
                            lead.status
                          )}`}
                        >
                          <option value="NEW">NEW</option>
                          <option value="REVIEWED">REVIEWED</option>
                          <option value="CONTACTED">CONTACTED</option>
                          <option value="ARCHIVED">ARCHIVED</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedLead(lead)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Details</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteLead(lead.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Full Details Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl p-6 rounded-2xl bg-white dark:bg-[#0F1626] border border-slate-200 dark:border-white/10 shadow-2xl space-y-5 animate-scale-in max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                    #{selectedLead.data?.referenceId || `MW-${selectedLead.id.slice(-6).toUpperCase()}`}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                      getTopicBadge(selectedLead.topic).color
                    }`}
                  >
                    <span>Category: {getTopicBadge(selectedLead.topic).label}</span>
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(selectedLead.createdAt).toLocaleString()}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {selectedLead.fullName}
                </h3>
                {selectedLead.company && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {selectedLead.company}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Contact Coordinates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 text-xs">
              <div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5">
                  Email Address
                </span>
                <a
                  href={`mailto:${selectedLead.email}`}
                  className="font-bold text-slate-900 dark:text-white hover:text-rose-600 flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-rose-500" />
                  <span>{selectedLead.email}</span>
                </a>
              </div>

              <div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5">
                  Phone Number
                </span>
                {selectedLead.phone ? (
                  <a
                    href={`tel:${selectedLead.phone}`}
                    className="font-bold text-slate-900 dark:text-white hover:text-rose-600 flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{selectedLead.phone}</span>
                  </a>
                ) : (
                  <span className="text-slate-400 italic">Not provided</span>
                )}
              </div>
            </div>

            {/* Practice Specific Details */}
            {selectedLead.data?.digitalDetails && (
              <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20 space-y-2 text-xs">
                <div className="font-bold text-orange-600 dark:text-orange-400 uppercase text-[10px] tracking-wider">
                  Digital &amp; Growth Practice Specifics
                </div>
                {selectedLead.data.digitalDetails.websiteUrl && (
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Website: </span>
                    <a
                      href={selectedLead.data.digitalDetails.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-orange-600 underline"
                    >
                      {selectedLead.data.digitalDetails.websiteUrl}
                    </a>
                  </div>
                )}
                {selectedLead.data.digitalDetails.marketingChallenge && (
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Marketing Objective: </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {selectedLead.data.digitalDetails.marketingChallenge}
                    </span>
                  </div>
                )}
              </div>
            )}

            {selectedLead.data?.technologyDetails && (
              <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 space-y-2 text-xs">
                <div className="font-bold text-blue-600 dark:text-blue-400 uppercase text-[10px] tracking-wider">
                  Technology Practice Specifics
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Project Type: </span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {selectedLead.data.technologyDetails.projectType}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Target Timeline: </span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {selectedLead.data.technologyDetails.timeline}
                  </span>
                </div>
              </div>
            )}

            {selectedLead.data?.talentDetails && (
              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2 text-xs">
                <div className="font-bold text-emerald-600 dark:text-emerald-400 uppercase text-[10px] tracking-wider">
                  Talent Solutions Practice Specifics
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Audience: </span>
                  <span className="font-semibold text-slate-900 dark:text-white uppercase font-mono">
                    {selectedLead.data.talentDetails.audienceType}
                  </span>
                </div>
                {selectedLead.data.talentDetails.requirementType && (
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Engagement Model: </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {selectedLead.data.talentDetails.requirementType}
                    </span>
                  </div>
                )}
                {selectedLead.data.talentDetails.targetRoles && (
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Target Roles: </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {selectedLead.data.talentDetails.targetRoles}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* General Overview Message */}
            <div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Overview of Goals &amp; Requirements
              </span>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                {selectedLead.message || 'No additional message was written.'}
              </div>
            </div>

            {/* Status Change & Action in Modal */}
            <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Update Status:
                </span>
                <div className="flex items-center gap-1">
                  {(['NEW', 'REVIEWED', 'CONTACTED', 'ARCHIVED'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateStatus(selectedLead.id, st)}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                        selectedLead.status === st
                          ? 'bg-rose-600 text-white border-rose-600'
                          : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedLead.email}?subject=RE: Strategic Inquiry %23${selectedLead.data?.referenceId || selectedLead.id.slice(-6).toUpperCase()}`}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-colors flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Reply via Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
