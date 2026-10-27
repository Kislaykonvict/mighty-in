'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { AdminThemeProvider, useAdminTheme } from '@/components/admin/AdminThemeContext';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';

  // Standalone layout for login screen
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const getHeaderInfo = () => {
    if (pathname?.startsWith('/admin/hero')) {
      return {
        title: 'Hero Section',
        subtitle: 'Configure dynamic full-screen video background, typography & call-to-actions',
      };
    }
    if (pathname?.startsWith('/admin/track-record')) {
      return {
        title: 'Proven Track Record',
        subtitle: 'Manage verified metrics, dynamic cards, custom logos and trusted industry sectors',
      };
    }
    if (pathname?.startsWith('/admin/core-business')) {
      return {
        title: 'Core Business Verticals',
        subtitle: 'Manage homepage services showcase, scroll stacking cards, and diagram assets',
      };
    }
    if (pathname?.startsWith('/admin/about')) {
      return {
        title: 'About Page Management',
        subtitle: 'Manage the Versett hero, brand evolution trajectory, and philosophy story cards',
      };
    }
    if (pathname?.startsWith('/admin/sections')) {
      return {
        title: 'Site Sections (Builder)',
        subtitle: 'Build and customize modular homepage layout blocks and interactive components',
      };
    }
    if (pathname?.startsWith('/admin/work')) {
      return {
        title: 'Case Studies / Work',
        subtitle: 'Manage client portfolio items, case study metrics and showcase assets',
      };
    }
    if (pathname?.startsWith('/admin/businesses')) {
      return {
        title: 'Business Verticals',
        subtitle: 'Manage specialized agency offerings, capabilities and service stacks',
      };
    }
    if (pathname?.startsWith('/admin/faqs')) {
      return {
        title: 'FAQs & Schema',
        subtitle: 'Manage structured knowledge base, interactive accordions and FAQPage schema',
      };
    }
    if (pathname?.startsWith('/admin/policies')) {
      return {
        title: 'Legal & Policy Pages',
        subtitle: 'Configure dynamic full-bleed hero covers, bottom-left typography & rich content editor',
      };
    }
    if (pathname?.startsWith('/admin/seo')) {
      return {
        title: 'SEO & Metadata Hub',
        subtitle: 'Audit meta tags, OpenGraph previews, canonical links and indexation settings',
      };
    }
    if (pathname?.startsWith('/admin/leads')) {
      return {
        title: 'Lead Submissions',
        subtitle: 'Review incoming contact inquiries, consultation requests and client briefs',
      };
    }
    if (pathname?.startsWith('/admin/settings')) {
      return {
        title: 'Global Site Settings',
        subtitle: 'Configure branding, navigation links, global contact info and analytics keys',
      };
    }
    if (pathname?.startsWith('/admin/users')) {
      return {
        title: 'User Management',
        subtitle: 'Manage administrators, roles and team permissions',
      };
    }
    return {
      title: 'Admin Console',
      subtitle: 'Manage website content, growth sections, and settings',
    };
  };

  const headerInfo = getHeaderInfo();

  return (
    <div
      className={`min-h-screen font-sans flex transition-colors ${
        isDark ? 'bg-[#070B14] text-slate-100' : 'bg-[#EEF2F6] text-slate-900'
      }`}
    >
      {/* Sidebar Navigation */}
      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        {/* Top Header */}
        <AdminHeader
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          title={headerInfo.title}
          subtitle={headerInfo.subtitle}
        />

        {/* Page Content */}
        <main className="p-4 sm:p-8 flex-1 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminThemeProvider>
      <AdminShell>{children}</AdminShell>
    </AdminThemeProvider>
  );
}
