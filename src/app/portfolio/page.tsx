import React from 'react';
import { constructMetadata } from '@/lib/utils/seo';
import { projectsData } from '@/data/projects';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { Badge } from '@/components/ui/Badge';
import { PortfolioClientView } from './PortfolioClientView';
import { FinalCtaSection } from '@/components/cta/FinalCtaSection';

export const metadata = constructMetadata({
  title: 'Complete Production Portfolio & Case Studies',
  description:
    'Explore the complete portfolio of verified e-commerce stores, custom web applications, real estate platforms, and corporate solutions delivered by Mighty Warner.',
  canonical: '/portfolio',
});

export default function PortfolioPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#060A12]">
      {/* Editorial Header */}
      <section className="pt-28 sm:pt-36 pb-16 sm:pb-20 bg-[#080C14] border-b border-white/8 relative overflow-hidden">
        <div className="absolute inset-0 subtle-grid-bg opacity-15 pointer-events-none" />
        
        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <SectionContainer width="default" paddingY="none" className="relative z-10">
          <div className="max-w-3xl">
            <Badge variant="subtle" dot className="mb-4">
              VERIFIED PORTFOLIO • 450+ PRODUCTION OUTCOMES
            </Badge>
            <h1 className="text-display-h1 font-black text-white tracking-tight mb-5">
              Work that moves <span className="gradient-text-brand">businesses forward.</span>
            </h1>
            <p className="text-body-lg text-slate-300 leading-relaxed font-normal">
              From high-concurrency multi-vendor marketplaces to luxury real estate platforms and sovereign portals. Explore our complete portfolio of live client solutions.
            </p>
          </div>
        </SectionContainer>
      </section>

      {/* Main Interactive Portfolio Section */}
      <section className="py-14 sm:py-20 relative">
        <SectionContainer width="default" paddingY="none">
          <PortfolioClientView initialProjects={projectsData} />
        </SectionContainer>
      </section>

      {/* Conversion Banner */}
      <FinalCtaSection />
    </div>
  );
}
