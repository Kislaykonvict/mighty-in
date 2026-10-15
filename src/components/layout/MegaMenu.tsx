'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Cpu, Users, Layers } from 'lucide-react';
import { navItems } from '@/data/navigation';
import { analytics } from '@/lib/analytics';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  const businessesItem = navItems.find((item) => item.name === 'Businesses');
  if (!isOpen || !businessesItem?.dropdownItems) return null;

  const icons = [Sparkles, Cpu, Users];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.98 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-full left-1/2 -translate-x-1/2 w-[92vw] max-w-5xl mt-3 p-6 rounded-2xl bg-[#0B101E]/95 backdrop-blur-2xl border border-white/12 shadow-2xl shadow-black/80 z-50 overflow-hidden"
    >
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/8">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
            One Ecosystem • Three Core Disciplines
          </span>
        </div>
        <Link
          href="/businesses"
          onClick={() => {
            analytics.trackCtaClick('View All Businesses', 'MegaMenu');
            onClose();
          }}
          className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 group transition-colors"
        >
          <span>All Capabilities Overview</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {businessesItem.dropdownItems.map((item, idx) => {
          const Icon = icons[idx] || Sparkles;
          const borderHighlight =
            idx === 0
              ? 'hover:border-orange-500/40'
              : idx === 1
              ? 'hover:border-blue-500/40'
              : 'hover:border-emerald-500/40';

          const bgHighlight =
            idx === 0
              ? 'group-hover:text-orange-400'
              : idx === 1
              ? 'group-hover:text-blue-400'
              : 'group-hover:text-emerald-400';

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => {
                analytics.trackCtaClick(`MegaMenu: ${item.name}`, 'MegaMenu', item.href);
                onClose();
              }}
              className={`group flex flex-col justify-between p-5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/8 ${borderHighlight} transition-all duration-200`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 group-hover:scale-105 group-hover:border-white/20 transition-all">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                    0{idx + 1}
                  </span>
                </div>

                <h3 className={`text-base font-bold text-white mb-1 transition-colors ${bgHighlight}`}>
                  {item.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {item.subItems.slice(0, 4).map((sub) => (
                    <span
                      key={sub}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/5"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center text-xs font-semibold text-slate-400 group-hover:text-white pt-2 border-t border-white/5 transition-colors">
                <span>Explore vertical</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}
