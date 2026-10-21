import React from 'react';
import { constructMetadata } from '@/lib/utils/seo';
import { projectsData } from '@/data/projects';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Badge } from '@/components/ui/Badge';
import { ProjectCard } from '@/components/work/ProjectCard';
import { FinalCtaSection } from '@/components/cta/FinalCtaSection';

export const metadata = constructMetadata({
  title: 'Selected Work & Case Studies',
  description:
    'Explore verified case studies and production outcomes across Digital & Growth, Technology, and Talent Solutions delivered by Mighty Warner.',
  canonical: '/work',
});

export default function WorkPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <section className="pt-28 sm:pt-32 pb-20 bg-[#080C14] border-b border-white/8 relative overflow-hidden">
        <div className="absolute inset-0 subtle-grid-bg opacity-20 pointer-events-none" />
        <SectionContainer width="default" paddingY="none">
          <Badge variant="subtle" dot className="mb-4">
            PROVEN TRACK RECORD • 450+ DELIVERED PROJECTS
          </Badge>
          <h1 className="text-display-h1 font-extrabold text-white tracking-tight mb-6 max-w-4xl">
            We’ve built things worth <span className="gradient-text-brand">talking about.</span>
          </h1>
          <p className="text-body-lg text-slate-300 max-w-2xl leading-relaxed mb-4">
            From brand repositionings that drove $140M+ in pipeline to high-throughput cloud microservices and rapid engineering pod deployments.
          </p>
        </SectionContainer>
      </section>

      {/* Projects Grid */}
      <SectionContainer width="default" paddingY="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsData.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </SectionContainer>

      <FinalCtaSection />
    </div>
  );
}
