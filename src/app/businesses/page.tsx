import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Cpu, Users, CheckCircle2 } from 'lucide-react';
import { constructMetadata } from '@/lib/utils/seo';
import { businessesData } from '@/data/businesses';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { EcosystemSection } from '@/components/ecosystem/EcosystemSection';
import { ChallengeSelector } from '@/components/challenge/ChallengeSelector';
import { FinalCtaSection } from '@/components/cta/FinalCtaSection';

export const metadata = constructMetadata({
  title: 'Businesses & Core Capabilities',
  description:
    'Explore the three business verticals of Mighty Warner: Digital & Growth, Technology, and Talent Solutions. One company with multiple ways to move your enterprise forward.',
  canonical: '/businesses',
});

export default function BusinessesPage() {
  const icons = {
    'digital-growth': Sparkles,
    technology: Cpu,
    'talent-solutions': Users,
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#DBDBDB] dark:bg-[#080C14]">
      {/* Hero Header */}
      <section className="pt-28 sm:pt-32 pb-20 bg-[#DBDBDB] dark:bg-[#080C14] border-b border-neutral-300 dark:border-white/8 relative overflow-hidden">
        <div className="absolute inset-0 subtle-grid-bg opacity-15 pointer-events-none" />
        <SectionContainer width="default" paddingY="none">
          <Badge variant="subtle" dot className="mb-4">
            THE MIGHTY WARNER ECOSYSTEM
          </Badge>
          <h1 className="text-display-h1 font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 max-w-4xl">
            Three businesses. One unified engine for growth.
          </h1>
          <p className="text-body-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed mb-8">
            Whether your immediate constraint is market visibility, software scalability, or hiring execution speed, our three specialized divisions provide surgical capabilities backed by unified accountability.
          </p>
        </SectionContainer>
      </section>

      {/* 3 Detailed Vertical Deep Dives */}
      <SectionContainer width="default" paddingY="lg">
        <div className="space-y-16">
          {businessesData.map((business, idx) => {
            const Icon = icons[business.id] || Sparkles;
            const themeConfig = {
              'digital-growth': {
                badge: 'growth' as const,
                accentColor: 'text-rose-600 dark:text-orange-400',
                btnVariant: 'growth' as const,
                borderColor: 'border-rose-200 dark:border-orange-500/25',
              },
              technology: {
                badge: 'tech' as const,
                accentColor: 'text-blue-600 dark:text-blue-400',
                btnVariant: 'tech' as const,
                borderColor: 'border-blue-200 dark:border-blue-500/25',
              },
              'talent-solutions': {
                badge: 'talent' as const,
                accentColor: 'text-emerald-600 dark:text-emerald-400',
                btnVariant: 'talent' as const,
                borderColor: 'border-emerald-200 dark:border-emerald-500/25',
              },
            }[business.id];

            return (
              <div
                key={business.id}
                id={business.id}
                className={`p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#0F1626] border ${themeConfig.borderColor} shadow-sm relative overflow-hidden`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                  <div className="lg:col-span-7 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-800 dark:text-white">
                        <Icon className="w-5 h-5" />
                      </div>
                      <Badge variant={themeConfig.badge} dot>
                        {business.pillarHeadline}
                      </Badge>
                      <span className="text-xs font-mono text-slate-400 dark:text-slate-500">VERTICAL 0{idx + 1}</span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      {business.name}
                    </h2>

                    <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                      {business.description}
                    </p>

                    {/* Detailed Services Grid */}
                    <div className="space-y-3 pt-2">
                      <div className="text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold">
                        Specialized Capabilities
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {business.services.map((srv) => (
                          <div
                            key={srv.id}
                            className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 space-y-1"
                          >
                            <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                              <CheckCircle2 className={`w-4 h-4 ${themeConfig.accentColor} shrink-0`} />
                              <span>{srv.name}</span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                              {srv.shortDescription}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 flex flex-wrap items-center gap-4">
                      <Button
                        href={`/businesses/${business.slug}`}
                        variant={themeConfig.btnVariant}
                        size="md"
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                      >
                        Explore Detailed {business.name} Page
                      </Button>

                      <Button
                        href={`/contact?topic=${business.id}`}
                        variant="outline"
                        size="md"
                      >
                        Inquire About {business.name}
                      </Button>
                    </div>
                  </div>

                  {/* Right Column: Outcomes & Image */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm">
                      <Image
                        src={business.heroImage}
                        alt={business.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="p-5 rounded-2xl bg-[#F8FAFC] dark:bg-[#080C14] border border-slate-200 dark:border-white/8 space-y-3 shadow-xs">
                      <div className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                        Key Performance Metrics
                      </div>
                      {business.outcomes.map((out) => (
                        <div key={out.label} className="border-b border-slate-200 dark:border-white/5 last:border-0 pb-2 last:pb-0">
                          <div className="text-xl font-black text-slate-900 dark:text-white">{out.metric}</div>
                          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">{out.label}</div>
                          <div className="text-[11px] text-slate-500">{out.context}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SectionContainer>

      {/* Narrative Ecosystem: People + Tech + Growth = Momentum */}
      <EcosystemSection />

      {/* Self-Identification: Challenge Selector */}
      <ChallengeSelector />

      <FinalCtaSection />
    </div>
  );
}
