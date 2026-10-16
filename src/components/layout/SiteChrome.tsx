'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { StickyBottomCta } from './StickyBottomCta';
import { GrowthTerminal } from '@/components/interactive/GrowthTerminal';

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <div className="min-h-screen w-full">{children}</div>;
  }

  const isHome = pathname === '/';

  return (
    <>
      <Navbar />
      <main className={`flex-grow ${isHome ? '' : 'pt-20'}`}>{children}</main>
      <Footer />
      <StickyBottomCta />
      <GrowthTerminal />
    </>
  );
}
