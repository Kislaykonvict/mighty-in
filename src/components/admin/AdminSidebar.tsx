'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Users,
  Globe,
  Layers,
  Briefcase,
  Building,
  HelpCircle,
  Inbox,
  Sliders,
  ExternalLink,
  X,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Command,
  CheckCircle2,
  LogOut,
  Video,
  Award,
  Building2,
  FileText,
  MessageSquareQuote,
} from 'lucide-react';
import { useAdminTheme } from './AdminThemeContext';

interface AdminSidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function AdminSidebar({ mobileOpen, onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';

  const navigationGroups = [
    {
      groupTitle: 'WORKSPACE & ACCESS',
      items: [
        {
          name: 'User Management',
          href: '/admin/users',
          icon: Users,
          // No CRUD badge per user request
        },
        {
          name: 'Global Site Settings',
          href: '/admin/settings',
          icon: Sliders,
        },
      ],
    },
    {
      groupTitle: 'GROWTH & CONTENT STUDIO',
      items: [
        {
          name: 'Hero Section',
          href: '/admin/hero',
          icon: Video,
          badge: 'Video',
          badgeType: 'indigo',
        },
        {
          name: 'Track Record',
          href: '/admin/track-record',
          icon: Award,
          badge: 'Metrics',
          badgeType: 'emerald',
        },
        {
          name: 'Core Business',
          href: '/admin/core-business',
          icon: Building2,
          badge: 'Showcase',
          badgeType: 'indigo',
        },
        {
          name: 'About Page',
          href: '/admin/about',
          icon: Sparkles,
          badge: 'Dynamic',
          badgeType: 'indigo',
        },
        {
          name: 'Site Sections (Builder)',
          href: '/admin/sections',
          icon: Layers,
        },
        {
          name: 'Case Studies / Work',
          href: '/admin/work',
          icon: Briefcase,
        },
        {
          name: 'Business Verticals',
          href: '/admin/businesses',
          icon: Building,
        },
        {
          name: 'FAQs & Schema',
          href: '/admin/faqs',
          icon: HelpCircle,
        },
        {
          name: 'Legal & Policies',
          href: '/admin/policies',
          icon: FileText,
          badge: 'Dynamic',
          badgeType: 'indigo',
        },
        {
          name: 'Testimonials',
          href: '/admin/testimonials',
          icon: MessageSquareQuote,
          badge: 'Dynamic',
          badgeType: 'indigo',
        },
      ],
    },
    {
      groupTitle: 'DISCOVERY & LEADS',
      items: [
        {
          name: 'SEO & Metadata Hub',
          href: '/admin/seo',
          icon: Globe,
          badge: 'Live',
          badgeType: 'emerald',
        },
        {
          name: 'Lead Submissions',
          href: '/admin/leads',
          icon: Inbox,
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col justify-between font-sans ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          isDark
            ? 'bg-[#0B101D] border-r border-slate-800/80 text-slate-100 shadow-2xl'
            : 'bg-white border-r border-slate-200/90 text-slate-800 shadow-[1px_0_20px_rgba(0,0,0,0.03)]'
        }`}
      >
        <div className="flex flex-col min-h-0 flex-1">
          {/* Logo Brand Header */}
          <div
            className={`h-20 px-6 flex items-center justify-between border-b shrink-0 ${
              isDark
                ? 'border-slate-800/80 bg-[#080D18]/70 backdrop-blur-md'
                : 'border-slate-200/80 bg-slate-50/50 backdrop-blur-md'
            }`}
          >
            <Link href="/admin/users" className="flex items-center gap-3 group">
              <div className="transition-transform group-hover:scale-[1.02] duration-200">
                <Image
                  src="/images/mw-logo.webp"
                  alt="Mighty Warner"
                  width={132}
                  height={34}
                  priority
                  className="h-7 w-auto object-contain"
                />
              </div>

              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase border transition-colors ${
                  isDark
                    ? 'bg-slate-900 border-slate-700/80 text-slate-200'
                    : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Console</span>
              </div>
            </Link>

            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Workspace Pill */}
          <div className="px-4 pt-4 shrink-0">
            <div
              className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                isDark
                  ? 'bg-slate-900/60 border-slate-800/80 text-slate-200'
                  : 'bg-slate-50/80 border-slate-200/90 text-slate-800 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-sky-500 text-white flex items-center justify-center font-extrabold text-xs shadow-sm shrink-0">
                  MW
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate tracking-tight">
                    Mighty Warner Inc.
                  </div>
                  <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Global Production</span>
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800 shrink-0">
                PRO
              </span>
            </div>
          </div>

          {/* Navigation Links Scrollable Area */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
            {navigationGroups.map((group) => (
              <div key={group.groupTitle} className="space-y-1.5">
                <div
                  className={`px-3 text-[10px] font-extrabold tracking-[0.08em] uppercase ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  {group.groupTitle}
                </div>

                <nav className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => onCloseMobile()}
                        className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-[-0.01em] transition-all duration-150 ${
                          isActive
                            ? 'bg-gradient-to-r from-indigo-600 via-indigo-600 to-indigo-700 text-white font-bold shadow-md shadow-indigo-600/25 ring-1 ring-indigo-500/20'
                            : isDark
                            ? 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                            : 'text-slate-700 hover:text-indigo-700 hover:bg-indigo-50/70'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Icon
                            className={`w-4 h-4 shrink-0 transition-colors ${
                              isActive
                                ? 'text-white'
                                : isDark
                                ? 'text-slate-400 group-hover:text-white'
                                : 'text-slate-500 group-hover:text-indigo-600'
                            }`}
                          />
                          <span className="truncate">{item.name}</span>
                        </div>

                        {item.badge ? (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide flex items-center gap-1 ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : item.badgeType === 'emerald'
                                ? isDark
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : isDark
                                ? 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                                : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            }`}
                          >
                            {item.badgeType === 'emerald' && (
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            )}
                            <span>{item.badge}</span>
                          </span>
                        ) : (
                          isActive && (
                            <ChevronRight className="w-3.5 h-3.5 text-white/80 shrink-0" />
                          )
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Actions: Live Storefront + DB & Admin Profile Snapshot */}
        <div
          className={`p-4 border-t shrink-0 space-y-3 ${
            isDark ? 'border-slate-800/80 bg-[#080D18]' : 'border-slate-200/90 bg-slate-50/70'
          }`}
        >
          {/* Live Storefront Link */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={`group w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
              isDark
                ? 'border-slate-700/80 bg-slate-800/80 hover:bg-slate-700 text-slate-200'
                : 'border-slate-300 bg-white hover:bg-indigo-50/50 hover:border-indigo-300 text-slate-800 hover:text-indigo-700 shadow-xs'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Live Storefront</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
          </a>

          {/* Database Connectivity Indicator */}
          <div className="px-1 flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Neon PostgreSQL</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 font-bold">
              v1.2.0
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
