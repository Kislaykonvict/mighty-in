'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FaqItemData } from '@/types/faq';

interface FaqAccordionClientProps {
  faqs: FaqItemData[];
}

export function FaqAccordionClient({ faqs }: FaqAccordionClientProps) {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => {
        const isOpen = Boolean(openIds[faq.id]);

        return (
          <div
            key={faq.id}
            className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
              isOpen
                ? 'bg-white dark:bg-[#0F1626] border-rose-300 dark:border-rose-500/30 shadow-md ring-1 ring-rose-500/10'
                : 'bg-white/80 dark:bg-white/[0.02] border-slate-200 dark:border-white/8 hover:border-slate-300 dark:hover:border-white/15'
            }`}
          >
            <button
              type="button"
              onClick={() => toggleItem(faq.id)}
              className="w-full text-left p-6 sm:p-7 flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
              aria-expanded={isOpen}
            >
              <div className="flex items-start gap-3 sm:gap-4 flex-1">
                <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 mt-1 shrink-0">
                  {String(index + 1).padStart(2, '0')}.
                </span>
                <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                  {faq.question}
                </span>
              </div>

              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 mt-0.5 ${
                  isOpen
                    ? 'bg-rose-500 text-white rotate-180 shadow-xs'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400'
                }`}
              >
                <ChevronDown className="w-4 h-4" />
              </div>
            </button>

            {isOpen && (
              <div className="px-6 pb-6 sm:px-7 sm:pb-7 pt-0 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-white/5 mt-1 pt-4">
                <p className="whitespace-pre-line leading-relaxed">
                  {faq.answer}
                </p>

                {faq.category && faq.category !== 'general' && (
                  <div className="pt-4 flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 font-semibold">
                      Topic: {faq.category}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
