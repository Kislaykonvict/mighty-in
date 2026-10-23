'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Cpu, Users, CheckCircle2, TrendingUp, ShieldCheck } from 'lucide-react';
import { businessesData } from '@/data/businesses';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { analytics } from '@/lib/analytics';

export function BusinessCardsSection() {
  const icons = {
    'digital-growth': Sparkles,
    technology: Cpu,
    'talent-solutions': Users,
  };

  return (
    <section className="py-20 sm:py-28 bg-white dark:bg-[#060A12] relative border-t border-slate-200 dark:border-white/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="CORE BUSINESS VERTICALS"
          badgeVariant="subtle"
          title="Engineered for every stage of your growth."
          subtitle="Whether you need category-defining branding, robust enterprise software architecture, or specialized engineering pods, our verticals operate independently or in unified harmony."
          align="left"
        />

        <div className="space-y-12">
          {businessesData.map((business, idx) => {
            const Icon = icons[business.id] || Sparkles;
            const isReversed = idx % 2 !== 0;

            const accentClasses = {
              'digital-growth': {
                badge: 'growth',
                border: 'border-rose-200 dark:border-orange-500/25 hover:border-rose-300 dark:hover:border-orange-500/50',
                glow: 'from-rose-500/10 dark:from-orange-500/10 via-transparent to-transparent',
                btnVariant: 'growth' as const,
                textColor: 'text-rose-600 dark:text-orange-400',
              },
              technology: {
                badge: 'tech',
                border: 'border-blue-200 dark:border-blue-500/25 hover:border-blue-300 dark:hover:border-blue-500/50',
                glow: 'from-blue-500/10 via-transparent to-transparent',
                btnVariant: 'tech' as const,
                textColor: 'text-blue-600 dark:text-blue-400',
              },
              'talent-solutions': {
                badge: 'talent',
                border: 'border-emerald-200 dark:border-emerald-500/25 hover:border-emerald-300 dark:hover:border-emerald-500/50',
                glow: 'from-emerald-500/10 via-transparent to-transparent',
                btnVariant: 'talent' as const,
                textColor: 'text-emerald-600 dark:text-emerald-400',
              },
            }[business.id];

            return (
              <motion.div
                key={business.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`p-8 sm:p-12 rounded-3xl bg-[#F8FAFC] dark:bg-[#0F1626]/70 border ${accentClasses.border} shadow-sm relative overflow-hidden transition-all`}
              >
                {/* Subtle vertical glow accent */}
                <div
                  className={`absolute top-0 right-0 w-96 h-96 rounded-full bg-gradient-to-br ${accentClasses.glow} blur-3xl pointer-events-none`}
                />

                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${isReversed ? 'lg:flex-row-reverse' : ''}`}>
                  {/* Text Content Area */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-200/60 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-800 dark:text-white">
                        <Icon className="w-5 h-5" />
                      </div>
                      <Badge variant={accentClasses.badge as any} dot>
                        {business.pillarHeadline}
                      </Badge>
                      <span className="text-xs font-mono text-slate-400 dark:text-slate-500">0{idx + 1}</span>
                    </div>

                    <div>
                      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
                        {business.headline}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                        {business.description}
                      </p>
                    </div>

                    {/* Services / Capabilities Grid */}
                    <div>
                      <div className="text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3 font-semibold">
                        Core Capabilities
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {business.coreCapabilities.slice(0, 6).map((cap) => (
                          <div
                            key={cap}
                            className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 text-xs text-slate-700 dark:text-slate-200 font-medium shadow-xs"
                          >
                            <CheckCircle2 className={`w-3.5 h-3.5 ${accentClasses.textColor} shrink-0`} />
                            <span className="truncate">{cap}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Dual Audience Journey for Talent Solutions */}
                    {business.audiences && (
                      <div className="p-4 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-3 shadow-xs">
                        <div className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">
                          Tailored Journeys:
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {business.audiences.map((aud) => (
                            <Link
                              key={aud.label}
                              href={aud.ctaHref}
                              onClick={() => analytics.trackCtaClick(`Talent Journey: ${aud.label}`, 'BusinessCardsSection')}
                              className="p-3 rounded-lg bg-slate-50 hover:bg-emerald-50 dark:bg-white/5 dark:hover:bg-emerald-500/10 border border-slate-200 hover:border-emerald-300 dark:border-white/5 dark:hover:border-emerald-500/30 transition-all group"
                            >
                              <div className="text-xs font-bold text-slate-900 dark:text-white mb-0.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-300">
                                {aud.label} →
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                                {aud.description}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Primary CTA */}
                    <div className="pt-2 flex flex-wrap items-center gap-4">
                      <Button
                        href={`/businesses/${business.slug}`}
                        variant={accentClasses.btnVariant}
                        size="md"
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                        onClick={() => analytics.trackBusinessPageView(business.slug)}
                      >
                        Explore {business.name}
                      </Button>

                      <Link
                        href={`/contact?topic=${business.id}`}
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                      >
                        Inquire about this vertical →
                      </Link>
                    </div>
                  </div>

                  {/* Visual / Outcomes Card */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm">
                      <Image
                        src={business.heroImage}
                        alt={business.name}
                        fill
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 dark:from-[#0F1626] via-transparent to-transparent opacity-80" />
                    </div>

                    {/* Outcome Metric Snapshot */}
                    <div className="p-4 rounded-xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/8 space-y-2 shadow-xs">
                      <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest font-semibold">
                        Verified Benchmark
                      </div>
                      <div className="flex items-baseline gap-3">
                        <span className="text-2xl font-black text-slate-900 dark:text-white">
                          {business.outcomes[0].metric}
                        </span>
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                          {business.outcomes[0].label}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                        {business.outcomes[0].context}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
