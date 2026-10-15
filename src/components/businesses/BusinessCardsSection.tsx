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
    <section className="py-20 sm:py-28 bg-[#060A12] relative border-t border-white/8">
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
                border: 'border-orange-500/25 hover:border-orange-500/50',
                glow: 'from-orange-500/10 via-transparent to-transparent',
                btnVariant: 'growth' as const,
                textColor: 'text-orange-400',
              },
              technology: {
                badge: 'tech',
                border: 'border-blue-500/25 hover:border-blue-500/50',
                glow: 'from-blue-500/10 via-transparent to-transparent',
                btnVariant: 'tech' as const,
                textColor: 'text-blue-400',
              },
              'talent-solutions': {
                badge: 'talent',
                border: 'border-emerald-500/25 hover:border-emerald-500/50',
                glow: 'from-emerald-500/10 via-transparent to-transparent',
                btnVariant: 'talent' as const,
                textColor: 'text-emerald-400',
              },
            }[business.id];

            return (
              <motion.div
                key={business.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`p-8 sm:p-12 rounded-3xl bg-[#0F1626]/70 border ${accentClasses.border} backdrop-blur-xl relative overflow-hidden transition-all`}
              >
                {/* Subtle vertical glow accent */}
                <div
                  className={`absolute top-0 right-0 w-96 h-96 rounded-full bg-gradient-to-br ${accentClasses.glow} blur-3xl pointer-events-none`}
                />

                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${isReversed ? 'lg:flex-row-reverse' : ''}`}>
                  {/* Text Content Area */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                        <Icon className="w-5 h-5" />
                      </div>
                      <Badge variant={accentClasses.badge as any} dot>
                        {business.pillarHeadline}
                      </Badge>
                      <span className="text-xs font-mono text-slate-500">0{idx + 1}</span>
                    </div>

                    <div>
                      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-3">
                        {business.headline}
                      </h3>
                      <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                        {business.description}
                      </p>
                    </div>

                    {/* Services / Capabilities Grid */}
                    <div>
                      <div className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-3 font-semibold">
                        Core Capabilities
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {business.coreCapabilities.slice(0, 6).map((cap) => (
                          <div
                            key={cap}
                            className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.03] border border-white/5 text-xs text-slate-200 font-medium"
                          >
                            <CheckCircle2 className={`w-3.5 h-3.5 ${accentClasses.textColor} shrink-0`} />
                            <span className="truncate">{cap}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Dual Audience Journey for Talent Solutions */}
                    {business.audiences && (
                      <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                        <div className="text-xs font-mono uppercase tracking-wider text-emerald-400">
                          Tailored Journeys:
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {business.audiences.map((aud) => (
                            <Link
                              key={aud.label}
                              href={aud.ctaHref}
                              onClick={() => analytics.trackCtaClick(`Talent Journey: ${aud.label}`, 'BusinessCardsSection')}
                              className="p-3 rounded-lg bg-white/5 hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 transition-all group"
                            >
                              <div className="text-xs font-bold text-white mb-0.5 group-hover:text-emerald-300">
                                {aud.label} →
                              </div>
                              <div className="text-[11px] text-slate-400 leading-tight">
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
                        className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                      >
                        Inquire about this vertical →
                      </Link>
                    </div>
                  </div>

                  {/* Visual / Outcomes Card */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                      <Image
                        src={business.heroImage}
                        alt={business.name}
                        fill
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F1626] via-transparent to-transparent opacity-80" />
                    </div>

                    {/* Outcome Metric Snapshot */}
                    <div className="p-4 rounded-xl bg-white/[0.04] border border-white/8 space-y-2">
                      <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                        Verified Benchmark
                      </div>
                      <div className="flex items-baseline gap-3">
                        <span className="text-2xl font-black text-white">
                          {business.outcomes[0].metric}
                        </span>
                        <span className="text-xs font-medium text-slate-300">
                          {business.outcomes[0].label}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-tight">
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
