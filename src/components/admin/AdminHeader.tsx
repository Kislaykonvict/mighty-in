'use client';

import React, { useState } from 'react';
import {
  Menu,
  Search,
  Sun,
  Moon,
  Bell,
  ChevronDown,
  Shield,
  User,
  LogOut,
  CheckCircle2,
} from 'lucide-react';
import { useAdminTheme } from './AdminThemeContext';

interface AdminHeaderProps {
  onOpenMobileSidebar: () => void;
  title?: string;
  subtitle?: string;
}

export function AdminHeader({
  onOpenMobileSidebar,
  title = 'User Management',
  subtitle = 'Manage team administrators, roles, and permissions',
}: AdminHeaderProps) {
  const { theme, toggleTheme } = useAdminTheme();
  const isDark = theme === 'dark';

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header
      className={`h-[76px] sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between border-b transition-colors shadow-xs ${
        isDark
          ? 'bg-[#0F172A] border-slate-800 text-white'
          : 'bg-white border-slate-200 text-slate-900'
      }`}
    >
      {/* Left Column: Mobile menu trigger + Page Title */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1
            className={`text-lg sm:text-xl font-black tracking-tight truncate ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right Column: Search bar, Theme Switcher, Notifications, User Profile */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Rounded Search Input */}
        <div className="relative hidden md:block w-48 lg:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search..."
            className={`w-full pl-9 pr-4 py-2 text-xs rounded-full font-medium transition-all focus:outline-none ${
              isDark
                ? 'bg-slate-800 border border-slate-700 text-white placeholder:text-slate-400 focus:border-indigo-500'
                : 'bg-slate-100 border border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-100'
            }`}
          />
        </div>

        {/* Theme Toggle Pill (Sun / Moon) */}
        <div
          className={`flex items-center p-1 rounded-full border transition-colors ${
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-300'
          }`}
        >
          <button
            type="button"
            onClick={toggleTheme}
            className={`p-1.5 rounded-full transition-all ${
              !isDark
                ? 'bg-white text-amber-600 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Light theme"
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            className={`p-1.5 rounded-full transition-all ${
              isDark
                ? 'bg-slate-700 text-indigo-300 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Dark theme"
          >
            <Moon className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Notification Bell with Red Badge */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className={`p-2 rounded-full transition-colors relative border ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
            }`}
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div
              className={`absolute right-0 mt-2 w-72 rounded-2xl p-4 shadow-2xl border text-xs z-50 animate-fade-in ${
                isDark ? 'bg-[#0F172A] border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 mb-2">
                <span className="font-extrabold text-slate-900 dark:text-white">System Alerts</span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-sans font-bold">All systems active</span>
              </div>
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-start gap-2 border border-slate-200 dark:border-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">Neon PostgreSQL Connected</div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400">Database synchronization active</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Badge */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className={`flex items-center gap-2.5 p-1 sm:pr-3 rounded-full sm:rounded-xl border transition-all cursor-pointer ${
              isDark
                ? 'border-slate-700 hover:bg-slate-800 text-white'
                : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-900'
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-700 to-sky-500 flex items-center justify-center text-white font-black text-xs shadow-sm">
              SA
            </div>

            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight font-sans">
                Super Admin
              </div>
              <div className="text-[11px] font-sans text-slate-500 dark:text-slate-400 leading-tight">
                admin@mightywarner.com
              </div>
            </div>

            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-500 hidden sm:block transition-transform duration-200 ${
                profileDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* User Profile Dropdown Menu */}
          {profileDropdownOpen && (
            <div
              className={`absolute right-0 mt-2 w-56 rounded-2xl p-2 shadow-2xl border text-xs z-50 animate-fade-in ${
                isDark ? 'bg-[#0F172A] border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800 mb-1">
                <div className="font-extrabold text-slate-900 dark:text-white">Mighty SuperAdmin</div>
                <div className="text-[10px] font-mono text-indigo-700 dark:text-indigo-400 font-extrabold uppercase">
                  SUPERADMIN PRIVILEGES
                </div>
              </div>

              <div className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>Admin Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 text-slate-500" />
                  <span>Role Permissions</span>
                </button>

                <div className="pt-1 mt-1 border-t border-slate-200 dark:border-slate-800">
                  <a
                    href="/"
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors font-bold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Exit Admin</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
