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

