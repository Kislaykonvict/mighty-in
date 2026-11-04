'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { analytics } from '@/lib/analytics';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DropdownBusinessItem {
  name: string;
  href: string;
  tagline?: string;
  description?: string;
}

const defaultItems: DropdownBusinessItem[] = [
  {
    name: 'Digital & Growth',
    href: '/businesses/digital-growth',
    tagline: 'Brand strategy, web development & SEO dominance',
    description: 'Brand strategy, web development & SEO dominance',
  },
  {
    name: 'Technology',
    href: '/businesses/technology',
    tagline: 'Custom software platforms, web & mobile applications',
    description: 'Custom software platforms, web & mobile applications',
  },
  {
    name: 'Talent Solutions',
    href: '/businesses/talent-solutions',
    tagline: 'Dedicated engineering pods, direct hire & staffing',
    description: 'Dedicated engineering pods, direct hire & staffing',
  },
];

export function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  const [businessItems, setBusinessItems] = useState<DropdownBusinessItem[]>(defaultItems);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/businesses')
      .then((res) => res.json())
      .then((json) => {
        if (isMounted && json?.success && Array.isArray(json.data) && json.data.length > 0) {
          setBusinessItems(json.data);
        }
      })
      .catch((err) => {
        console.error('Error fetching dynamic business items for MegaMenu:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-full left-0 sm:left-1/2 sm:-translate-x-1/2 w-[340px] sm:w-[380px] max-h-[85vh] overflow-y-auto mt-2.5 p-2 rounded-2xl bg-white dark:bg-[#0B101B] border border-slate-200 dark:border-white/10 shadow-[0_15px_35px_-5px_rgba(15,23,42,0.12),0_4px_12px_rgba(0,0,0,0.04)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] z-50 before:content-[''] before:absolute before:-top-3 before:inset-x-0 before:h-3"
    >
      {/* Vertical list of businesses */}
      <div className="space-y-1">
        {businessItems.map((item) => {
          const subtitle = item.tagline || item.description;

          return (
            <Link
              key={item.href}
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
              {subtitle && (
                <p className="text-xs text-slate-500 dark:text-slate-400 font-normal leading-relaxed mt-1 transition-colors group-hover:text-slate-700 dark:group-hover:text-slate-300">
                  {subtitle}
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}
