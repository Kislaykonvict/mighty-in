import React from 'react';
import Link from 'next/link';
import { constructMetadata } from '@/lib/utils/seo';
import { methodSteps } from '@/data/company';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MethodSection } from '@/components/method/MethodSection';
import { StrategyBuilder } from '@/components/interactive/StrategyBuilder';
import { WhySection } from '@/components/why/WhySection';
import { FinalCtaSection } from '@/components/cta/FinalCtaSection';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata = constructMetadata({
  title: 'Our Approach | The Mighty Warner Method',
  description:
    'Discover the battle-tested 5-stage Mighty Warner Method: Discover, Define, Build, Activate, and Optimize. Engineered for measurable business momentum.',
  canonical: '/approach',
});

export default function ApproachPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="pt-16 pb-20 bg-[#080C14] border-b border-white/8 relative overflow-hidden">
        <div className="absolute inset-0 subtle-grid-bg opacity-20 pointer-events-none" />
        <SectionContainer width="default" paddingY="none">
          <Badge variant="subtle" dot className="mb-4">
            OPERATIONAL METHODOLOGY
          </Badge>
          <h1 className="text-display-h1 font-extrabold text-white tracking-tight mb-6 max-w-4xl">
            A battle-tested framework for <span className="gradient-text-brand">predictable momentum.</span>
          </h1>
          <p className="text-body-lg text-slate-300 max-w-2xl leading-relaxed mb-8">
            We don’t guess. Every engagement follows our systematic 5-stage lifecycle designed to de-risk investment, align stakeholders, and maximize long-term commercial upside.
          </p>
        </SectionContainer>
      </section>

      {/* Interactive Method Timeline */}
      <MethodSection />

      {/* 5 Stages Breakdown Deep Dive */}
      <SectionContainer width="default" paddingY="lg">
        <SectionHeader
          eyebrow="SYSTEMATIC EXECUTION"
          badgeVariant="subtle"
          title="From initial discovery to compounding optimization."
          subtitle="A detailed look at what happens in each phase of our partnership."
          align="left"
        />

        <div className="space-y-8">
          {methodSteps.map((step) => (
            <div
              key={step.stepNumber}
              className="p-8 sm:p-10 rounded-3xl bg-[#0F1626] border border-white/8 shadow-xl"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-4 space-y-2">
                  <span className="text-xs font-mono font-bold text-sky-400 uppercase">
                    PHASE {step.stepNumber}
                  </span>
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    {step.name}
                  </h3>
                  <div className="text-sm font-semibold text-slate-300">
                    {step.headline}
                  </div>
                </div>

                <div className="lg:col-span-8 space-y-4">
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                    {step.description}
                  </p>

                  <div className="pt-2">
                    <div className="text-xs font-mono uppercase text-slate-400 font-semibold mb-3">
                      Deliverables Produced:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {step.deliverables.map((del) => (
                        <div
                          key={del}
                          className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.03] border border-white/5 text-xs text-slate-200"
                        >
                          <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                          <span>{del}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionContainer>

      {/* Interactive 90-Day Strategy Blueprint Synthesizer */}
      <SectionContainer width="default" paddingY="lg">
        <StrategyBuilder />
      </SectionContainer>

      {/* Why Mighty Warner Core Principles */}
      <WhySection />

      <FinalCtaSection />
    </div>
  );
}
