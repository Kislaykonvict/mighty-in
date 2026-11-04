'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type AdminTheme = 'light' | 'dark';

interface AdminThemeContextType {
  theme: AdminTheme;
  toggleTheme: () => void;
  setAdminTheme: (theme: AdminTheme) => void;
}

const AdminThemeContext = createContext<AdminThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  setAdminTheme: () => {},
});

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [adminTheme, setAdminThemeState] = useState<AdminTheme>('light');

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('mw_admin_theme') as AdminTheme | null;
    if (saved === 'dark' || saved === 'light') {
      setAdminThemeState(saved);
    }
  }, []);

  const toggleTheme = () => {
    const next: AdminTheme = adminTheme === 'light' ? 'dark' : 'light';
    setAdminThemeState(next);
    localStorage.setItem('mw_admin_theme', next);
  };

  const setAdminTheme = (newTheme: AdminTheme) => {
    setAdminThemeState(newTheme);
    localStorage.setItem('mw_admin_theme', newTheme);
  };

  const activeTheme: AdminTheme = mounted ? adminTheme : 'light';

  useEffect(() => {
    if (!mounted) return;
    if (adminTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }

    return () => {
      // Restore public storefront theme preference if leaving admin panel
      try {
        const siteTheme = localStorage.getItem('theme');
        if (siteTheme === 'dark') {
          document.documentElement.classList.add('dark');
          document.documentElement.style.colorScheme = 'dark';
        } else if (siteTheme === 'light') {
          document.documentElement.classList.remove('dark');
          document.documentElement.style.colorScheme = 'light';
        }
      } catch {
        // Ignore localStorage error in restricted environments
      }
    };
  }, [adminTheme, mounted]);

  return (
    <AdminThemeContext.Provider value={{ theme: activeTheme, toggleTheme, setAdminTheme }}>
      <div className={activeTheme === 'dark' ? 'dark' : ''} data-theme={activeTheme}>
        {children}
      </div>
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme() {
  return useContext(AdminThemeContext);
}

