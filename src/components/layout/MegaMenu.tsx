'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { navItems } from '@/data/navigation';
import { analytics } from '@/lib/analytics';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const subtitles = [
  'Brand strategy, web development & SEO dominance',
  'Custom software platforms, web & mobile applications',
  'Dedicated engineering pods, direct hire & staffing',
];

export function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  const businessesItem = navItems.find((item) => item.name === 'Businesses');
  if (!isOpen || !businessesItem?.dropdownItems) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-full left-0 sm:left-1/2 sm:-translate-x-1/2 w-[340px] sm:w-[380px] mt-2.5 p-2 rounded-2xl bg-white dark:bg-[#0B101B] border border-slate-200 dark:border-white/10 shadow-[0_15px_35px_-5px_rgba(15,23,42,0.12),0_4px_12px_rgba(0,0,0,0.04)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] z-50 overflow-hidden before:content-[''] before:absolute before:-top-3 before:inset-x-0 before:h-3"
    >
      {/* Vertical list without icons or colored accents */}
      <div className="space-y-1">
        {businessesItem.dropdownItems.map((item, idx) => {
          const subtitle = subtitles[idx] || item.description;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => {
                analytics.trackCtaClick(`MegaMenu: ${item.name}`, 'MegaMenu', item.href);
                onClose();
              }}
              className="group block p-3 rounded-xl transition-all duration-150 hover:bg-slate-50 dark:hover:bg-white/[0.05]"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900 dark:text-white tracking-tight group-hover:text-rose-600 dark:group-hover:text-white transition-colors">
                  {item.name}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-rose-600 dark:group-hover:text-white transition-all shrink-0" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-normal leading-relaxed mt-1 transition-colors group-hover:text-slate-700 dark:group-hover:text-slate-300">
                {subtitle}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Neutral monochrome bottom bar */}
      <div className="mt-1 pt-1.5 border-t border-slate-100 dark:border-white/[0.06]">
        <Link
          href="/businesses"
          onClick={() => {
            analytics.trackCtaClick('View All Businesses', 'MegaMenu');
            onClose();
          }}
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-all group/footer"
        >
          <span>All Capabilities Overview</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover/footer:text-slate-900 dark:group-hover/footer:text-white group-hover/footer:translate-x-1 transition-all" />
        </Link>
      </div>
    </motion.div>
  );
}
