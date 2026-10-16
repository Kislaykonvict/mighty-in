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

  const getHeaderInfo = () => {
    if (pathname?.startsWith('/admin/hero')) {
      return {
        title: 'Hero Section',
        subtitle: 'Configure dynamic full-screen video background, typography & call-to-actions',
      };
    }
    return {
      title: 'User Management',
      subtitle: 'Manage administrators, roles and team permissions',
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
