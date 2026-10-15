'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ArrowRight, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { testimonialsData } from '@/data/testimonials';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Badge } from '@/components/ui/Badge';

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const current = testimonialsData[currentIndex] || testimonialsData[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonialsData.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length);
  };

  const badgeVariant =
    current.verticalId === 'digital-growth'
      ? 'growth'
      : current.verticalId === 'technology'
      ? 'tech'
      : 'talent';

  return (
    <section className="py-20 sm:py-28 bg-[#060A12] relative border-t border-white/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="CLIENT REPUTATION & PROOF"
          badgeVariant="subtle"
          title="Endorsed by executive leadership."
          subtitle="Real testimonials from enterprise CMOs, CTOs, and founders who partnered with Mighty Warner."
          align="left"
        />

        {/* Featured Testimonial Card */}
        <div className="p-8 sm:p-14 rounded-3xl bg-[#0F1626] border border-white/10 shadow-2xl relative overflow-hidden mb-8">
          <Quote className="absolute top-8 right-8 w-24 h-24 text-white/[0.03] pointer-events-none" />

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <Badge variant={badgeVariant as any} dot>
                  {current.verticalId === 'digital-growth'
                    ? 'Digital & Growth'
                    : current.verticalId === 'technology'
                    ? 'Technology'
                    : 'Talent Solutions'}
                </Badge>

                {/* 5 Star Rating */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
              </div>

              {/* Quote text */}
              <blockquote className="text-xl sm:text-2xl lg:text-3xl font-medium text-white leading-relaxed tracking-tight">
                &ldquo;{current.quote}&rdquo;
              </blockquote>

              {/* Client & Project Details */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 border-t border-white/8">
                <div className="flex items-center gap-4">
                  {current.avatarUrl && (
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border border-white/20 shrink-0">
                      <Image
                        src={current.avatarUrl}
                        alt={current.clientName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <div className="text-base font-bold text-white">
                      {current.clientName}
                    </div>
                    <div className="text-xs text-slate-400">
                      {current.role} • <span className="text-slate-200">{current.company}</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 uppercase mt-0.5">
                      {current.industry}
                    </div>
                  </div>
                </div>

                {current.relatedProjectSlug && (
                  <Link
                    href={`/work/${current.relatedProjectSlug}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-xs font-semibold text-slate-200 hover:text-white transition-colors self-start sm:self-center"
                  >
                    <span>Read case study</span>
                    <ArrowRight className="w-3.5 h-3.5 text-sky-400" />
                  </Link>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {testimonialsData.map((t, idx) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-8 bg-sky-400' : 'w-2 bg-slate-700 hover:bg-slate-600'
                }`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="p-3 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-3 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
