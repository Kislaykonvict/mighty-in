'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, ArrowRight } from 'lucide-react';
import { navItems } from '@/data/navigation';
import { MegaMenu } from './MegaMenu';
import { MobileNav } from './MobileNav';
import { Button } from '@/components/ui/Button';
import { analytics } from '@/lib/analytics';

import { ThemeToggle } from '@/components/theme/ThemeToggle';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMegaMenuOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleMouseEnterBusinesses = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMegaMenuOpen(true);
  };

  const handleMouseLeaveBusinesses = () => {
    timeoutRef.current = setTimeout(() => {
      setMegaMenuOpen(false);
    }, 250);
  };

  const isTransparentTopPage = pathname === '/' || pathname === '/about';
  const isOpaque = scrolled || !isTransparentTopPage;

  return (
    <>
      <header
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-200 ${
          isOpaque
            ? 'bg-[#DBDBDB] dark:bg-[#080C14] border-b border-neutral-300 dark:border-white/10 py-3.5 shadow-md dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
            : 'bg-transparent border-b border-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center group py-1"
            aria-label="Mighty Warner Homepage"
          >
            <div className="transition-transform group-hover:scale-[1.03] duration-200 flex items-center">
              <Image
                src="/images/mw-logo.webp"
                alt="Mighty Warner"
                width={180}
                height={52}
                priority
                className="h-11 sm:h-12 w-auto object-contain"
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 relative" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

              if (item.isDropdown) {
                return (
                  <div
                    key={item.name}
                    className="relative"
                    onMouseEnter={handleMouseEnterBusinesses}
                    onMouseLeave={handleMouseLeaveBusinesses}
                  >
                    <button
                      type="button"
                      onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors ${
                        isOpaque
                          ? megaMenuOpen || isActive
                            ? 'text-rose-600 bg-black/5 dark:text-white dark:bg-white/10'
                            : 'text-slate-800 hover:text-rose-600 hover:bg-black/5 dark:text-slate-200 dark:hover:text-white dark:hover:bg-white/5'
                          : megaMenuOpen || isActive
                            ? 'text-white bg-white/20'
                            : 'text-white/90 hover:text-white hover:bg-white/10'
                      }`}
                      aria-expanded={megaMenuOpen}
                    >
                      <span>{item.name}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          megaMenuOpen
                            ? 'rotate-180 text-rose-500 dark:text-sky-400'
                            : isOpaque
                              ? 'text-slate-500 dark:text-slate-400'
                              : 'text-white/80'
                        }`}
                      />
                    </button>

                    <MegaMenu isOpen={megaMenuOpen} onClose={() => setMegaMenuOpen(false)} />
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    isOpaque
                      ? isActive
                        ? 'text-rose-600 bg-black/5 dark:text-white dark:bg-white/10'
                        : 'text-slate-800 hover:text-rose-600 hover:bg-black/5 dark:text-slate-200 dark:hover:text-white dark:hover:bg-white/5'
                      : isActive
                        ? 'text-white bg-white/20'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/assessment"
              className={`text-xs font-mono font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                isOpaque
                  ? 'text-slate-800 hover:text-rose-600 dark:text-slate-200 dark:hover:text-sky-400 border-neutral-300 hover:border-slate-400 dark:border-white/10 dark:hover:border-sky-400/40 bg-white/60 dark:bg-transparent'
                  : 'text-white/95 hover:text-white border-white/20 hover:border-white/40 bg-white/10 hover:bg-white/15'
              }`}
            >
              Diagnostic 72/100
            </Link>

            <ThemeToggle
              className={
                !isOpaque
                  ? 'border-white/20 bg-white/10 text-white hover:bg-white/20 dark:border-white/20 dark:bg-white/10'
                  : ''
              }
            />

            <Button
              href="/contact"
              variant={isOpaque ? 'white' : 'white'}
              size="sm"
              className={
                !isOpaque
                  ? '!bg-white !text-slate-950 hover:!bg-slate-100 !border-white shadow-lg'
                  : ''
              }
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              onClick={() => analytics.trackCtaClick('Start a Conversation', 'Navbar')}
            >
              Start a conversation
            </Button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle
              className={
                !isOpaque
                  ? 'border-white/20 bg-white/10 text-white hover:bg-white/20 dark:border-white/20 dark:bg-white/10'
                  : ''
              }
            />

            <Button
              href="/contact"
              variant="white"
              size="sm"
              className={`text-xs px-3 py-1.5 ${
                !isOpaque ? '!bg-white !text-slate-950 hover:!bg-slate-100' : ''
              }`}
            >
              Contact
            </Button>

            <button
              onClick={() => setMobileMenuOpen(true)}
              className={`p-2 rounded-lg border transition-colors ${
                isOpaque
                  ? 'bg-white/70 dark:bg-white/5 border-neutral-300 dark:border-white/10 text-slate-800 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
              }`}
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
