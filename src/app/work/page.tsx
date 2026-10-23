import React from 'react';
import { constructMetadata } from '@/lib/utils/seo';
import { projectsData } from '@/data/projects';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { Badge } from '@/components/ui/Badge';
import { PortfolioClientView } from '@/app/portfolio/PortfolioClientView';
import { FinalCtaSection } from '@/components/cta/FinalCtaSection';

export const metadata = constructMetadata({
  title: 'Selected Work & Production Portfolio',
  description:
    'Explore verified case studies and production outcomes across e-commerce, web development, real estate, and digital solutions delivered by Mighty Warner.',
  canonical: '/work',
});

export default function WorkPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#060A12]">
      {/* Header */}
      <section className="pt-28 sm:pt-36 pb-16 sm:pb-20 bg-[#080C14] border-b border-white/8 relative overflow-hidden">
        <div className="absolute inset-0 subtle-grid-bg opacity-15 pointer-events-none" />
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <SectionContainer width="default" paddingY="none" className="relative z-10">
          <div className="max-w-3xl">
            <Badge variant="subtle" dot className="mb-4">
              PROVEN TRACK RECORD • 450+ DELIVERED PROJECTS
            </Badge>
            <h1 className="text-display-h1 font-black text-white tracking-tight mb-5">
              We’ve built things worth <span className="gradient-text-brand">talking about.</span>
            </h1>
            <p className="text-body-lg text-slate-300 leading-relaxed font-normal">
              Explore the complete showcase of high-performing e-commerce platforms, custom web applications, and corporate platforms we have helped bring to life.
            </p>
          </div>
        </SectionContainer>
      </section>

      {/* Projects Grid with Interactive Search & Category Filter */}
      <section className="py-14 sm:py-20 relative">
        <SectionContainer width="default" paddingY="none">
          <PortfolioClientView initialProjects={projectsData} />
        </SectionContainer>
      </section>

      <FinalCtaSection />
    </div>
  );
}
