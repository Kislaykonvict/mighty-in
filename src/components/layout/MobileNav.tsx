'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, ArrowRight, Sparkles, Cpu, Users, Layers } from 'lucide-react';
import { navItems } from '@/data/navigation';
import { Button } from '@/components/ui/Button';
import { analytics } from '@/lib/analytics';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const [businessesExpanded, setBusinessesExpanded] = useState(true);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-white dark:bg-[#080C14] flex flex-col justify-between overflow-y-auto"
      >
        {/* Mobile Nav Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-white/10">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center"
          >
            <div className="transition-transform active:scale-95 duration-200 flex items-center">
              <Image
                src="/images/mw-logo.webp"
                alt="Mighty Warner"
                width={170}
                height={48}
                priority
                className="h-10 w-auto object-contain"
              />
            </div>
          </Link>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="px-6 py-6 space-y-6 flex-1">
          <div className="space-y-4">
            {/* Businesses Accordion */}
            <div className="border-b border-slate-200 dark:border-white/10 pb-4">
              <button
                onClick={() => setBusinessesExpanded(!businessesExpanded)}
                className="w-full flex items-center justify-between text-xl font-bold text-slate-900 dark:text-white tracking-tight py-2 text-left"
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
                  <Link
                    href="/businesses/digital-growth"
                    onClick={onClose}
                    className="flex items-start gap-3 p-3 rounded-xl bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 active:bg-orange-100"
                  >
                    <Sparkles className="w-5 h-5 text-orange-500 dark:text-orange-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">Digital & Growth</div>
                      <div className="text-xs text-orange-600 dark:text-orange-300/80">Build a brand • Strategy & Web</div>
                    </div>
                  </Link>

                  <Link
                    href="/businesses/technology"
                    onClick={onClose}
                    className="flex items-start gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 active:bg-blue-100"
                  >
                    <Cpu className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">Technology</div>
                      <div className="text-xs text-blue-600 dark:text-blue-300/80">Build a product • Custom Apps & APIs</div>
                    </div>
                  </Link>

                  <Link
                    href="/businesses/talent-solutions"
                    onClick={onClose}
                    className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 active:bg-emerald-100"
                  >
                    <Users className="w-5 h-5 text-emerald-500 dark:text-emerald-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">Talent Solutions</div>
                      <div className="text-xs text-emerald-600 dark:text-emerald-300/80">Build a team • Staffing & SOW Pods</div>
                    </div>
                  </Link>
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
