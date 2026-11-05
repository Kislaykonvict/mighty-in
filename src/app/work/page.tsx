import React from 'react';
import { Metadata } from 'next';
import { getPageSEO, formatPageMetadata } from '@/lib/seo';
import { CustomHeadCode } from '@/components/seo/CustomHeadCode';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { PortfolioClientView } from '@/app/portfolio/PortfolioClientView';
import { FinalCtaSection } from '@/components/cta/FinalCtaSection';
import { prisma } from '@/lib/db/prisma';
import { defaultWorkPageSettings, WorkPageSettings } from '@/types/workPage';

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSEO('/work');
  return formatPageMetadata(seo, {
    title: 'Selected Client Projects & Portfolio | Mighty Warner',
    description:
      'Explore verified case studies and production outcomes across e-commerce, custom web applications, real estate platforms, and digital solutions delivered by Mighty Warner.',
    canonical: '/work',
  });
}

async function getWorkPageData() {
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

export default async function WorkPage() {
  const { settings, projects } = await getWorkPageData();

  return (
    <div className="flex flex-col min-h-screen bg-[#DBDBDB] dark:bg-[#060A12] transition-colors duration-200">
      <CustomHeadCode path="/work" />
      {/* Main Portfolio Showcase with Reference UI */}
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

      {/* Conversion Banner */}
      <FinalCtaSection />
    </div>
  );
}
