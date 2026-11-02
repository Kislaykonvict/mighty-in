import React from 'react';
import { constructMetadata } from '@/lib/utils/seo';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { PortfolioClientView } from './PortfolioClientView';
import { FinalCtaSection } from '@/components/cta/FinalCtaSection';
import { prisma } from '@/lib/db/prisma';
import { defaultWorkPageSettings, WorkPageSettings } from '@/types/workPage';

export const revalidate = 0;

export const metadata = constructMetadata({
  title: 'Complete Production Portfolio & Case Studies | Mighty Warner',
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
        where: { published: true },
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      }),
    ]);

    const content = (section?.content as any) || {};

    const settings: WorkPageSettings = {
      badge: section?.badge || 'PORTFOLIO',
      title: section?.title || 'Selected',
      highlightedTitle: content.highlightedTitle || 'client projects',
      description: section?.subtitle || content.description || defaultWorkPageSettings.description,
    };

    const projects = dbProjects as any;

    return { settings, projects };
  } catch (err) {
    return {
      settings: {
        badge: 'PORTFOLIO',
        title: 'Selected',
        highlightedTitle: 'client projects',
        description: defaultWorkPageSettings.description,
      },
      projects: [],
    };
  }
}

export default async function PortfolioPage() {
  const { settings, projects } = await getPortfolioPageData();

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFC] dark:bg-[#060A12] transition-colors duration-200">
      <main className="pt-32 sm:pt-40 pb-20 sm:pb-28">
        <SectionContainer width="default" paddingY="none">
          <PortfolioClientView
            initialProjects={projects}
            badge={settings.badge || 'PORTFOLIO'}
            title={settings.title || 'Selected'}
            highlightedTitle={settings.highlightedTitle || 'client projects'}
          />
        </SectionContainer>
      </main>

      <FinalCtaSection />
    </div>
  );
}
