'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { analytics } from '@/lib/analytics';
import { FinalCtaData, defaultFinalCtaData } from '@/types/finalCta';
import { RichTextContent } from '@/components/ui/RichTextContent';

export interface FinalCtaSectionProps {
  data?: FinalCtaData;
}

export function FinalCtaSection({ data }: FinalCtaSectionProps) {
  const cta = data || defaultFinalCtaData;

  // If section is explicitly toggled off in admin panel, do not render
  if (cta.isActive === false) {
    return null;
  }

  return (
    <section
      id="contact"
      className="py-24 sm:py-32 bg-[#DBDBDB] dark:bg-[#05080E] relative overflow-hidden"
    >
      {/* Background dynamic ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-rose-500/5 dark:bg-gradient-to-r dark:from-orange-500/10 dark:via-blue-500/10 dark:to-emerald-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute inset-0 subtle-grid-bg opacity-15 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Eyebrow Pill Badge */}
        {cta.badge && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-300 text-xs font-mono text-rose-700 dark:bg-white/5 dark:border-white/10 dark:text-slate-300 uppercase tracking-widest mb-8 shadow-xs"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <RichTextContent content={cta.badge} inline />
          </motion.div>
        )}

        {/* Main Display Headline */}
        {cta.title && (
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-display-h1 font-extrabold text-slate-900 dark:text-white tracking-tight mb-8"
          >
            <RichTextContent content={cta.title} inline />
          </motion.h2>
        )}

        {/* Narrative & Persuasion Subtitle Paragraphs */}
        {cta.subtitle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl mx-auto text-body-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-10 space-y-2 [&>p]:mb-2 [&_strong]:text-slate-900 dark:[&_strong]:text-white [&_strong]:font-bold"
          >
            <RichTextContent content={cta.subtitle} />
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {cta.primaryCtaText && (
            <Button
              href={cta.primaryCtaLink || '/contact'}
              variant="growth"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => analytics.trackCtaClick(cta.primaryCtaText, 'FinalCTA')}
            >
              {cta.primaryCtaText}
            </Button>
          )}

          {cta.showSecondaryCta && cta.secondaryCtaText && (
            <Button
              href={cta.secondaryCtaLink || '/assessment'}
              variant="outline"
              size="lg"
              leftIcon={<Sparkles className="w-4 h-4 text-rose-600 dark:text-sky-400" />}
              onClick={() => analytics.trackCtaClick(cta.secondaryCtaText, 'FinalCTA')}
            >
              {cta.secondaryCtaText}
            </Button>
          )}
        </motion.div>

        {/* Trust Guarantee / Monospace Disclaimer Note */}
        {cta.guaranteeNote && (
          <div className="mt-12 text-xs font-mono text-slate-500">
            <RichTextContent content={cta.guaranteeNote} inline />
          </div>
        )}
      </div>
    </section>
  );
}
