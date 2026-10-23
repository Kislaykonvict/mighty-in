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

  return (
    <>
      <header
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#060A12]/35 backdrop-blur-2xl border-b border-white/[0.08] py-3.5 shadow-[0_4px_30px_rgba(0,0,0,0.2)]'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 py-1 group"
            aria-label="Mighty Warner Homepage"
          >
            <div className="px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/12 backdrop-blur-md transition-all group-hover:border-white/25 flex items-center shadow-inner">
              <Image
                src="/images/mw-logo.webp"
                alt="Mighty Warner"
                width={132}
                height={34}
                priority
                className="h-7 sm:h-8 w-auto object-contain"
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
                      className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                        megaMenuOpen || isActive
                          ? 'text-white bg-white/10'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                      aria-expanded={megaMenuOpen}
                    >
                      <span>{item.name}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          megaMenuOpen ? 'rotate-180 text-sky-400' : 'text-slate-400'
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
                  className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'text-white bg-white/10'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
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
              className="text-xs font-mono text-slate-300 hover:text-sky-400 px-3 py-1.5 rounded-lg border border-white/10 hover:border-sky-400/40 transition-colors"
            >
              Diagnostic 72/100
            </Link>

            <Button
              href="/contact"
              variant="white"
              size="sm"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              onClick={() => analytics.trackCtaClick('Start a Conversation', 'Navbar')}
            >
              Start a conversation
            </Button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center gap-2 md:hidden">
            <Button
              href="/contact"
              variant="white"
              size="sm"
              className="text-xs px-3 py-1.5"
            >
              Contact
            </Button>

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white"
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
