import React from 'react';
import { constructMetadata } from '@/lib/utils/seo';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { Badge } from '@/components/ui/Badge';
import { PortfolioClientView } from './PortfolioClientView';
import { FinalCtaSection } from '@/components/cta/FinalCtaSection';
import { prisma } from '@/lib/db/prisma';
import { defaultWorkPageSettings, WorkPageSettings } from '@/types/workPage';

export const revalidate = 0;

export const metadata = constructMetadata({
  title: 'Complete Production Portfolio & Case Studies',
  description:
    'Explore the complete portfolio of verified e-commerce stores, custom web applications, real estate platforms, and corporate solutions delivered by Mighty Warner.',
  canonical: '/portfolio',
});

async function getPortfolioPageData() {
  try {
    const [section, dbProjects] = await Promise.all([
      prisma.siteSection.findUnique({
        where: {
          pageSlug_sectionKey: {
            pageSlug: 'work',
            sectionKey: 'header',
          },
        },
      }),
      prisma.project.findMany({
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      }),
    ]);

    const content = (section?.content as any) || {};

    const settings: WorkPageSettings = {
      badge: section?.badge || defaultWorkPageSettings.badge,
      title: section?.title || defaultWorkPageSettings.title,
      highlightedTitle: content.highlightedTitle || defaultWorkPageSettings.highlightedTitle,
      description: section?.subtitle || content.description || defaultWorkPageSettings.description,
    };

    const projects = dbProjects as any;

    return { settings, projects };
  } catch (err) {
    return { settings: defaultWorkPageSettings, projects: [] };
  }
}

export default async function PortfolioPage() {
  const { settings, projects } = await getPortfolioPageData();

  return (
    <div className="flex flex-col min-h-screen bg-[#DBDBDB] dark:bg-[#060A12]">
      {/* Editorial Header */}
      <section className="pt-28 sm:pt-36 pb-16 sm:pb-20 bg-[#DBDBDB] dark:bg-[#080C14] border-b border-neutral-300 dark:border-white/8 relative overflow-hidden">
        <div className="absolute inset-0 subtle-grid-bg opacity-15 pointer-events-none" />
        
        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-rose-500/5 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <SectionContainer width="default" paddingY="none" className="relative z-10">
          <div className="max-w-3xl">
            <Badge variant="subtle" dot className="mb-4">
              {settings.badge}
            </Badge>
            <h1 className="text-display-h1 font-black text-slate-900 dark:text-white tracking-tight mb-5">
              {settings.title} <span className="gradient-text-brand">{settings.highlightedTitle}</span>
            </h1>
            <p className="text-body-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {settings.description}
            </p>
          </div>
        </SectionContainer>
      </section>

      {/* Main Interactive Portfolio Section */}
      <section className="py-14 sm:py-20 relative">
        <SectionContainer width="default" paddingY="none">
          <PortfolioClientView initialProjects={projects} />
        </SectionContainer>
      </section>

      {/* Conversion Banner */}
      <FinalCtaSection />
    </div>
  );
}
