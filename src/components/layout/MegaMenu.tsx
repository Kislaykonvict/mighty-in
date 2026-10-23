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
      style={{
        backgroundColor: 'rgba(8, 12, 22, 0.98)',
        backdropFilter: 'blur(32px)',
        WebkitBackdropFilter: 'blur(32px)',
      }}
      className="absolute top-full left-0 sm:left-1/2 sm:-translate-x-1/2 w-[340px] sm:w-[380px] mt-2.5 p-2 rounded-2xl border border-white/12 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.12)] z-50 overflow-hidden before:content-[''] before:absolute before:-top-3 before:inset-x-0 before:h-3"
    >
      {/* Top subtle glass highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

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
              className="group block p-3 rounded-xl transition-all duration-150 hover:bg-white/[0.05]"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white tracking-tight group-hover:text-white transition-colors">
                  {item.name}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-white transition-all shrink-0" />
              </div>
              <p className="text-xs text-slate-400 font-normal leading-relaxed mt-1 transition-colors group-hover:text-slate-300">
                {subtitle}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Neutral monochrome bottom bar */}
      <div className="mt-1 pt-1.5 border-t border-white/[0.06]">
        <Link
          href="/businesses"
          onClick={() => {
            analytics.trackCtaClick('View All Businesses', 'MegaMenu');
            onClose();
          }}
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all group/footer"
        >
          <span>All Capabilities Overview</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover/footer:text-white group-hover/footer:translate-x-1 transition-all" />
        </Link>
      </div>
    </motion.div>
  );
}
