'use client';

import React, { useState, useEffect } from 'react';
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
  ChevronDown,
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
  Home,
} from 'lucide-react';
import { useAdminTheme } from './AdminThemeContext';

interface NavigationChild {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavigationItem {
  name: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavigationChild[];
}

interface NavigationGroup {
  groupTitle: string;
  items: NavigationItem[];
}

const NAVIGATION_GROUPS: NavigationGroup[] = [
  {
    groupTitle: 'PAGE-WISE CONTENT',
    items: [
      {
        name: 'Homepage',
        icon: Home,
        children: [
          {
            name: 'Hero Section',
            href: '/admin/hero',
            icon: Video,
          },
          {
            name: 'Track Record',
            href: '/admin/track-record',
            icon: Award,
          },
          {
            name: 'Core Business',
            href: '/admin/core-business',
            icon: Building2,
          },
          {
            name: 'Testimonials',
            href: '/admin/testimonials',
            icon: MessageSquareQuote,
          },
          {
            name: 'Site Sections (Builder)',
            href: '/admin/sections',
            icon: Layers,
          },
        ],
      },
      {
        name: 'About Page',
        href: '/admin/about',
        icon: Sparkles,
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
        name: 'Legal & Policies',
        href: '/admin/policies',
        icon: FileText,
      },
      {
        name: 'FAQs & Schema',
        href: '/admin/faqs',
        icon: HelpCircle,
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
      },
      {
        name: 'Lead Submissions',
        href: '/admin/leads',
        icon: Inbox,
      },
    ],
  },
  {
    groupTitle: 'WORKSPACE & ACCESS',
    items: [
      {
        name: 'User Management',
        href: '/admin/users',
        icon: Users,
      },
      {
        name: 'Global Site Settings',
        href: '/admin/settings',
        icon: Sliders,
      },
    ],
  },
];

interface AdminSidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function AdminSidebar({ mobileOpen, onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';

  // Collapsible accordions state for page-wise groups
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    Homepage: true, // Default open on initial load
  });

  const toggleAccordion = (name: string) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  // Auto-expand accordion when a child route is active
  useEffect(() => {
    NAVIGATION_GROUPS.forEach((group) => {
      group.items.forEach((item) => {
        if (item.children) {
          const hasActiveChild = item.children.some(
            (c) => pathname === c.href || pathname.startsWith(`${c.href}/`)
          );
          if (hasActiveChild) {
            setOpenAccordions((prev) => ({ ...prev, [item.name]: true }));
          }
        }
      });
    });
  }, [pathname]);

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
            className={`relative h-[76px] px-6 flex items-center justify-center border-b shrink-0 ${
              isDark
                ? 'border-slate-800 bg-[#0B101D]'
                : 'border-slate-200 bg-white'
            }`}
          >
            <Link href="/admin/users" className="flex items-center justify-center group">
              <div className="transition-transform group-hover:scale-[1.02] duration-200">
                <Image
                  src="/images/mw-logo.webp"
                  alt="Mighty Warner"
                  width={160}
                  height={44}
                  priority
                  className="h-11 w-auto object-contain"
                />
              </div>
            </Link>

            <button
              onClick={onCloseMobile}
              className="absolute right-4 lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links Scrollable Area */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
            {NAVIGATION_GROUPS.map((group) => (
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
                    const Icon = item.icon;

                    // If item has child sub-sections (e.g. Homepage)
                    if (item.children && item.children.length > 0) {
                      const isChildActive = item.children.some(
                        (c) => pathname === c.href || pathname.startsWith(`${c.href}/`)
                      );
                      const isOpen = !!openAccordions[item.name];

                      return (
                        <div key={item.name} className="space-y-1">
                          {/* Accordion Parent Trigger Button */}
                          <button
                            type="button"
                            onClick={() => toggleAccordion(item.name)}
                            className={`w-full group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-[-0.01em] transition-all duration-150 cursor-pointer ${
                              isChildActive
                                ? isDark
                                  ? 'bg-slate-800/80 text-white border border-slate-700/80 shadow-xs'
                                  : 'bg-indigo-50/80 text-indigo-900 border border-indigo-200/80 shadow-xs'
                                : isDark
                                ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                                : 'text-slate-700 hover:text-indigo-700 hover:bg-slate-100/70'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <Icon
                                className={`w-4 h-4 shrink-0 transition-colors ${
                                  isChildActive
                                    ? isDark ? 'text-indigo-400' : 'text-indigo-600'
                                    : isDark ? 'text-slate-400 group-hover:text-white' : 'text-slate-500 group-hover:text-indigo-600'
                                }`}
                              />
                              <span className="truncate">{item.name}</span>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span
                                className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md font-semibold transition-colors ${
                                  isChildActive
                                    ? isDark
                                      ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-800/60'
                                      : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                                    : isDark
                                    ? 'bg-slate-800 text-slate-400 border border-slate-700'
                                    : 'bg-slate-200/70 text-slate-600 border border-slate-300/60'
                                }`}
                              >
                                {item.children.length}
                              </span>
                              <ChevronDown
                                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                  isOpen
                                    ? 'rotate-180 text-indigo-600 dark:text-indigo-400'
                                    : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                                }`}
                              />
                            </div>
                          </button>

                          {/* Accordion Children Container */}
                          {isOpen && (
                            <div className="ml-4 pl-3.5 border-l-2 border-slate-200 dark:border-slate-800 space-y-1 pt-0.5 pb-1 animate-fade-in">
                              {item.children.map((child) => {
                                const isSubActive =
                                  pathname === child.href || pathname.startsWith(`${child.href}/`);
                                const ChildIcon = child.icon;

                                return (
                                  <Link
                                    key={child.href}
                                    href={child.href}
                                    onClick={() => onCloseMobile()}
                                    className={`group flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold tracking-[-0.01em] transition-all duration-150 ${
                                      isSubActive
                                        ? 'bg-gradient-to-r from-indigo-600 via-indigo-600 to-indigo-700 text-white font-bold shadow-md shadow-indigo-600/25 ring-1 ring-indigo-500/20'
                                        : isDark
                                        ? 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                                        : 'text-slate-600 hover:text-indigo-700 hover:bg-indigo-50/70'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <ChildIcon
                                        className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                                          isSubActive
                                            ? 'text-white'
                                            : isDark
                                            ? 'text-slate-500 group-hover:text-white'
                                            : 'text-slate-400 group-hover:text-indigo-600'
                                        }`}
                                      />
                                      <span className="truncate">{child.name}</span>
                                    </div>

                                    {isSubActive && (
                                      <ChevronRight className="w-3 h-3 text-white/80 shrink-0" />
                                    )}
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    }

                    // Top-level direct page link
                    const isActive = pathname === item.href || (item.href ? pathname.startsWith(`${item.href}/`) : false);

                    return (
                      <Link
                        key={item.href || item.name}
                        href={item.href || '#'}
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

                        {isActive && (
                          <ChevronRight className="w-3.5 h-3.5 text-white/80 shrink-0" />
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

          {/* Sign Out Button */}
          <button
            type="button"
            onClick={async () => {
              try {
                await fetch('/api/auth/logout', { method: 'POST' });
              } finally {
                window.location.href = '/admin/login';
              }
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              isDark
                ? 'border-slate-800 bg-slate-900/60 hover:bg-rose-950/30 hover:border-rose-900/50 text-slate-400 hover:text-rose-400'
                : 'border-slate-200 bg-slate-100/70 hover:bg-rose-50 hover:border-rose-200 text-slate-600 hover:text-rose-600'
            }`}
          >
            <div className="flex items-center gap-2">
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </div>
            <span className="text-[10px] font-mono opacity-60">ESC</span>
          </button>

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
