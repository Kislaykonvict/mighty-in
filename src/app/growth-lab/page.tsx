import React, { Suspense } from 'react';
import { constructMetadata } from '@/lib/utils/seo';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { Badge } from '@/components/ui/Badge';
import { GrowthLabClient } from './GrowthLabClient';
import { Sparkles, Calculator, Layers, ArrowLeftRight, Crown } from 'lucide-react';
import { FinalCtaSection } from '@/components/cta/FinalCtaSection';

export const metadata = constructMetadata({
  title: 'Mighty Warner Growth Lab | Interactive Strategy & Diagnostics',
  description:
    'Interactive tools for enterprise growth: 3-Minute Growth Assessment, 90-Day Strategy Blueprint Builder, ROI Impact Calculator, and Executive Perspectives.',
  canonical: '/growth-lab',
});

export default function GrowthLabPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Lab Header */}
      <section className="pt-16 pb-14 bg-[#080C14] border-b border-white/8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[500px] rounded-full bg-gradient-to-r from-orange-500/10 via-blue-500/10 to-emerald-500/10 blur-[130px] pointer-events-none" />
        <div className="absolute inset-0 subtle-grid-bg opacity-20 pointer-events-none" />

        <SectionContainer width="default" paddingY="none" className="text-center relative z-10">
          <Badge variant="subtle" dot className="mb-4">
            MIGHTY WARNER GROWTH LAB
          </Badge>
          <h1 className="text-display-h1 font-extrabold text-white tracking-tight mb-4 max-w-4xl mx-auto">
            Interactive Diagnostics, Strategy & <span className="gradient-text-brand">ROI Modeling.</span>
          </h1>
          <p className="text-body-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-6">
            Explore our signature suite of interactive utilities designed to evaluate your business momentum, synthesize 90-day execution roadmaps, and forecast revenue acceleration.
          </p>
        </SectionContainer>
      </section>

      {/* Main Interactive Workspace */}
      <SectionContainer width="default" paddingY="lg">
        <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading Growth Lab workspace...</div>}>
          <GrowthLabClient />
        </Suspense>
      </SectionContainer>

      <FinalCtaSection />
    </div>
  );
}
