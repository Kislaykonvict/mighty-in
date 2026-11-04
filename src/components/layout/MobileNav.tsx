'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, ArrowRight, Sparkles, Cpu, Users, Layers, Building } from 'lucide-react';
import { navItems } from '@/data/navigation';
import { Button } from '@/components/ui/Button';
import { analytics } from '@/lib/analytics';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MobileBusinessItem {
  name: string;
  href: string;
  tagline?: string;
  description?: string;
}

const defaultMobileBusinesses: MobileBusinessItem[] = [
  {
    name: 'Digital & Growth',
    href: '/businesses/digital-growth',
    tagline: 'Build a brand • Strategy & Web',
  },
  {
    name: 'Technology',
    href: '/businesses/technology',
    tagline: 'Build a product • Custom Apps & APIs',
  },
  {
    name: 'Talent Solutions',
    href: '/businesses/talent-solutions',
    tagline: 'Build a team • Staffing & SOW Pods',
  },
];

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const [businessesExpanded, setBusinessesExpanded] = useState(true);
  const [businessItems, setBusinessItems] = useState<MobileBusinessItem[]>(defaultMobileBusinesses);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/businesses')
      .then((res) => res.json())
      .then((json) => {
        if (isMounted && json?.success && Array.isArray(json.data) && json.data.length > 0) {
          setBusinessItems(json.data);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  if (!isOpen) return null;

  const getBusinessIcon = (href: string) => {
    if (href.includes('digital-growth')) {
      return <Sparkles className="w-5 h-5 text-orange-500 dark:text-orange-400 mt-0.5 shrink-0" />;
    }
    if (href.includes('technology')) {
      return <Cpu className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-0.5 shrink-0" />;
    }
    if (href.includes('talent-solutions')) {
      return <Users className="w-5 h-5 text-emerald-500 dark:text-emerald-400 mt-0.5 shrink-0" />;
    }
    return <Building className="w-5 h-5 text-sky-500 dark:text-sky-400 mt-0.5 shrink-0" />;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-white dark:bg-[#080C14] flex flex-col justify-between overflow-y-auto"
      >
        {/* Mobile Nav Header */}
        <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
          <Link href="/" onClick={onClose}>
            <Image
              src="/images/mw-logo.webp"
              alt="Mighty Warner"
              width={160}
              height={45}
              className="h-10 w-auto object-contain"
            />
          </Link>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Nav Content */}
        <div className="p-6 flex-1">
          <div className="space-y-4">
            {/* Businesses Accordion */}
            <div className="border-b border-slate-200 dark:border-white/10 pb-4">
              <button
                onClick={() => setBusinessesExpanded(!businessesExpanded)}
                className="w-full flex items-center justify-between text-xl font-bold text-slate-900 dark:text-white tracking-tight py-2 text-left cursor-pointer"
              >
                <span>Businesses</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                    businessesExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {businessesExpanded && (
                <div className="mt-3 space-y-3 pl-2">
                  {businessItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 active:bg-slate-100"
                    >
                      {getBusinessIcon(item.href)}
                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white">{item.name}</div>
                        {(item.tagline || item.description) && (
                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            {item.tagline || item.description}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Other standard nav items */}
            {navItems
              .filter((i) => i.name !== 'Businesses')
              .map((item) => (
                <div key={item.name} className="border-b border-slate-200 dark:border-white/10 pb-4">
                  <Link
                    href={item.href}
                    onClick={() => {
                      analytics.trackCtaClick(`MobileNav: ${item.name}`, 'MobileNav', item.href);
                      onClose();
                    }}
                    className="block text-xl font-bold text-slate-900 dark:text-white hover:text-rose-600 dark:hover:text-sky-400 transition-colors py-1"
                  >
                    {item.name}
                  </Link>
                </div>
              ))}

            <div className="border-b border-slate-200 dark:border-white/10 pb-4">
              <Link
                href="/assessment"
                onClick={onClose}
                className="flex items-center justify-between text-base font-semibold text-rose-600 dark:text-sky-400 py-1"
              >
                <span>3-Minute Growth Assessment</span>
                <span className="px-2 py-0.5 text-xs font-mono rounded bg-rose-50 text-rose-600 border border-rose-200 dark:bg-sky-400/10 dark:border-sky-400/30 dark:text-sky-300">
                  Interactive
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Footer CTAs */}
        <div className="p-6 bg-slate-50 dark:bg-[#0B101E] border-t border-slate-200 dark:border-white/10 space-y-3">
          <Button
            href="/contact"
            variant="growth"
            size="lg"
            fullWidth
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={() => {
              analytics.trackCtaClick('MobileNav CTA', 'MobileNav');
              onClose();
            }}
          >
            Start a Conversation
          </Button>

          <p className="text-center text-xs font-mono text-slate-500 tracking-wider">
            Building businesses since 2013 • Global Offices
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
