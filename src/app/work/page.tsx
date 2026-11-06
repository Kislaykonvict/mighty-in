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
    const [headerSection, categorySection, dbProjects] = await Promise.all([
      prisma.siteSection.findUnique({
        where: {
          pageSlug_sectionKey: {
            pageSlug: 'work',
            sectionKey: 'header',
          },
        },
      }),
      prisma.siteSection.findUnique({
        where: {
          pageSlug_sectionKey: {
            pageSlug: 'work',
            sectionKey: 'categories',
          },
        },
      }),
      prisma.project.findMany({
        where: { published: true },
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      }),
    ]);

    const headerContent = (headerSection?.content as any) || {};

    const settings: WorkPageSettings = {
      badge: headerSection?.badge || defaultWorkPageSettings.badge,
      title: headerSection?.title || defaultWorkPageSettings.title,
      highlightedTitle: headerContent.highlightedTitle || defaultWorkPageSettings.highlightedTitle,
      description: headerSection?.subtitle || headerContent.description || defaultWorkPageSettings.description,
    };

    const categoryContent = (categorySection?.content as any) || {};
    const officialCategories: string[] = Array.isArray(categoryContent.categories)
      ? categoryContent.categories
      : [];

    const projects = dbProjects as any;

    return { settings, officialCategories, projects };
  } catch (err) {
    return {
      settings: defaultWorkPageSettings,
      officialCategories: [],
      projects: [],
    };
  }
}

export default async function WorkPage() {
  const { settings, officialCategories, projects } = await getWorkPageData();

  return (
    <div className="flex flex-col min-h-screen bg-[#DBDBDB] dark:bg-[#060A12] transition-colors duration-200">
      <CustomHeadCode path="/work" />
      {/* Main Portfolio Showcase */}
      <main className="pt-32 sm:pt-40 pb-20 sm:pb-28">
        <SectionContainer width="default" paddingY="none">
          <PortfolioClientView
            initialProjects={projects}
            badge={settings.badge}
            title={settings.title}
            highlightedTitle={settings.highlightedTitle}
            description={settings.description}
            categories={officialCategories}
          />
        </SectionContainer>
      </main>

      {/* Conversion Banner */}
      <FinalCtaSection />
    </div>
  );
}
