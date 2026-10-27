'use client';

import React from 'react';
import Link from 'next/link';
import {
  Layers,
  Video,
  Award,
  Building2,
  MessageSquareQuote,
  Briefcase,
  Globe2,
  ArrowRight,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Sliders,
  Eye,
} from 'lucide-react';
import { useAdminTheme } from '@/components/admin/AdminThemeContext';

interface SectionCard {
  id: string;
  order: number;
  name: string;
  key: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  editHref?: string;
  previewHref?: string;
  isActive: boolean;
  type: string;
}

const HOMEPAGE_SECTIONS: SectionCard[] = [
  {
    id: 'sec-hero',
    order: 1,
    name: 'Hero Section',
    key: 'hero',
    description: 'Full-screen cinematic background video, high-impact headline, primary and secondary call-to-actions.',
    icon: Video,
    editHref: '/admin/hero',
    previewHref: '/',
    isActive: true,
    type: 'Cinema Video & Typography',
  },
  {
    id: 'sec-track-record',
    order: 2,
    name: 'Proven Track Record',
    key: 'trust',
    description: 'Verified enterprise metrics (e.g. 500+ Launches, $2.4B+ Volume), custom logos, and trusted industry sectors.',
    icon: Award,
    editHref: '/admin/track-record',
    previewHref: '/#track-record',
    isActive: true,
    type: 'Verified Institutional Metrics',
  },
  {
    id: 'sec-core-business',
    order: 3,
    name: 'Core Business Verticals',
    key: 'core_business',
    description: '3 primary pillars (Digital & Growth, Technology, Talent Solutions) with interactive scroll-stacking card animation.',
    icon: Building2,
    editHref: '/admin/core-business',
    previewHref: '/#core-business',
    isActive: true,
    type: 'Scroll Stacking Showcase',
  },
  {
    id: 'sec-portfolio',
    order: 4,
    name: 'Client Case Studies & Work',
    key: 'work',
    description: 'Curated enterprise project highlights with interactive filtering, metrics, and case study detail drawers.',
    icon: Briefcase,
    editHref: '/admin/homepage-projects',
    previewHref: '/#work',
    isActive: true,
    type: 'Portfolio Showcase Grid',
  },
  {
    id: 'sec-testimonials',
    order: 5,
    name: 'Testimonials & Social Proof',
    key: 'testimonials',
    description: 'Verified executive endorsements, client quotes, author credentials, and 5-star ratings.',
    icon: MessageSquareQuote,
    editHref: '/admin/testimonials',
    previewHref: '/#testimonials',
    isActive: true,
    type: 'Client Endorsements & Proof',
  },
  {
    id: 'sec-globe',
    order: 6,
    name: 'Global Footprint & Offices',
    key: 'global_offices',
    description: 'Interactive 3D rotating globe featuring Mighty Warner international studios and development centers.',
    icon: Globe2,
    previewHref: '/#offices',
    isActive: true,
    type: '3D WebGL Globe Experience',
  },
  {
    id: 'sec-cta',
    order: 7,
    name: 'Final Conversion CTA',
    key: 'final_cta',
    description: 'Bottom page lead capture prompt driving direct consultation bookings and partnership inquiries.',
    icon: Sparkles,
    previewHref: '/#contact',
    isActive: true,
    type: 'Lead Acceleration Banner',
  },
];

export default function AdminSectionsPage() {
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner / Breadcrumb */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border transition-colors relative overflow-hidden ${
          isDark
            ? 'bg-gradient-to-br from-[#0F172A] to-[#0A0F1D] border-slate-800 text-white'
            : 'bg-gradient-to-br from-white to-slate-50 border-slate-200 text-slate-900 shadow-sm'
        }`}
      >
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/20">
            <Layers className="w-3.5 h-3.5" />
            <span>Homepage Visual Architecture</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Site Sections &amp; Page Layout Builder
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            Manage the modular sections that assemble the primary Homepage experience. Each block corresponds to a dedicated section editor with real-time updates to your live storefront.
          </p>
        </div>

        <div className="absolute right-6 -bottom-10 opacity-5 dark:opacity-10 pointer-events-none">
          <Layers className="w-64 h-64 text-indigo-500" />
        </div>
      </div>

      {/* Sections Stacking Order Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              Homepage Layout Sequence ({HOMEPAGE_SECTIONS.length} Modules)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Arranged in visual top-to-bottom rendering order on the live website.
            </p>
          </div>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-xs ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-slate-200 hover:text-white hover:bg-slate-700'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-indigo-700'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Live Page</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {HOMEPAGE_SECTIONS.map((sec) => {
            const Icon = sec.icon;

            return (
              <div
                key={sec.id}
                className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isDark
                    ? 'bg-[#0F172A] border-slate-800/90 hover:border-indigo-500/50'
                    : 'bg-white border-slate-200/90 hover:border-indigo-300 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-4 min-w-0">
                  {/* Sequence Order Badge */}
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-400 flex items-center justify-center font-mono font-extrabold text-xs shrink-0 border border-indigo-200/80 dark:border-indigo-800/60 shadow-xs">
                    0{sec.order}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <div className="font-extrabold text-sm text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                        <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span>{sec.name}</span>
                      </div>

                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                          isDark
                            ? 'bg-slate-800 text-slate-300 border-slate-700'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {sec.type}
                      </span>

                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Active</span>
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl font-medium">
                      {sec.description}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2.5 shrink-0 sm:self-center">
                  {sec.editHref ? (
                    <Link
                      href={sec.editHref}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 shadow-sm shadow-indigo-600/30 flex items-center gap-1.5 transition-all cursor-pointer group"
                    >
                      <span>Configure Section</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  ) : (
                    <span
                      className={`text-[11px] font-medium px-3 py-1.5 rounded-xl border ${
                        isDark ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'
                      }`}
                    >
                      Built-in Component
                    </span>
                  )}

                  {sec.previewHref && (
                    <a
                      href={sec.previewHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                        isDark
                          ? 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                          : 'border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                      title="Preview on storefront"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
