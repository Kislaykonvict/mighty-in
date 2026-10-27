'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

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
  const { theme: nextTheme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [adminTheme, setAdminThemeState] = useState<AdminTheme>('light');

  useEffect(() => {
    setMounted(true);

    // Read stored admin preference, default to 'light'
    const saved = localStorage.getItem('mw_admin_theme') as AdminTheme | null;
    const initialTheme: AdminTheme = saved === 'dark' ? 'dark' : 'light';
    setAdminThemeState(initialTheme);

    // Synchronize next-themes, documentElement classes, and localStorage keys
    setTheme(initialTheme);
    localStorage.setItem('mw_admin_theme', initialTheme);
    localStorage.setItem('theme', initialTheme);

    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [setTheme]);

  const toggleTheme = () => {
    const next: AdminTheme = adminTheme === 'light' ? 'dark' : 'light';
    setAdminThemeState(next);
    localStorage.setItem('mw_admin_theme', next);
    localStorage.setItem('theme', next);
    setTheme(next);

    if (next === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  };

  const setAdminTheme = (newTheme: AdminTheme) => {
    setAdminThemeState(newTheme);
    localStorage.setItem('mw_admin_theme', newTheme);
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  };

  const activeTheme: AdminTheme = mounted ? adminTheme : 'light';

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

