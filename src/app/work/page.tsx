import React from 'react';
import { constructMetadata } from '@/lib/utils/seo';
import { projectsData } from '@/data/projects';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { Badge } from '@/components/ui/Badge';
import { PortfolioClientView } from '@/app/portfolio/PortfolioClientView';
import { FinalCtaSection } from '@/components/cta/FinalCtaSection';
import { prisma } from '@/lib/db/prisma';
import { defaultWorkPageSettings, WorkPageSettings } from '@/types/workPage';
import { RichTextContent } from '@/components/ui/RichTextContent';

export const revalidate = 0;

export const metadata = constructMetadata({
  title: 'Selected Work & Production Portfolio',
  description:
    'Explore verified case studies and production outcomes across e-commerce, web development, real estate, and digital solutions delivered by Mighty Warner.',
  canonical: '/work',
});

async function getWorkPageData() {
  try {
    const [section, catSection, dbProjects] = await Promise.all([
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

    const catContent = (catSection?.content as any) || {};
    const categories: string[] = Array.isArray(catContent.categories) && catContent.categories.length > 0
      ? catContent.categories
      : Array.from(new Set(dbProjects.map((p) => p.industry?.trim()).filter(Boolean)));
    const categoriesTitle: string = catSection?.title || catContent.title || 'TRUSTED ACROSS:';

    const projects = dbProjects.length > 0 ? (dbProjects as any) : projectsData;

    return { settings, projects, categories, categoriesTitle };
  } catch (err) {
    return {
      settings: defaultWorkPageSettings,
      projects: projectsData,
      categories: [],
      categoriesTitle: 'TRUSTED ACROSS:',
    };
  }
}

export default async function WorkPage() {
  const { settings, projects, categories, categoriesTitle } = await getWorkPageData();

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
              <RichTextContent content={settings.badge} inline />
            </Badge>
            <h1 className="text-display-h1 font-black text-white tracking-tight mb-5">
              <RichTextContent content={settings.title} inline />{' '}
              <RichTextContent content={settings.highlightedTitle} className="gradient-text-brand" inline />
            </h1>
            <RichTextContent
              content={settings.description}
              as="p"
              className="text-body-lg text-slate-300 leading-relaxed font-normal"
            />
          </div>
        </SectionContainer>
      </section>

      {/* Horizontal Categories Showcase (Styled like the screenshot) */}
      {categories.length > 0 && (
        <section className="py-6 bg-[#080C14]/90 border-b border-white/8 backdrop-blur-xs relative z-10">
          <SectionContainer width="default" paddingY="none">
            <div className="flex flex-wrap items-center justify-start gap-2.5 sm:gap-3">
              {/* Leading Line Accent & Monospace Label */}
              <div className="flex items-center gap-3 mr-1">
                <span className="w-12 h-[1px] bg-white/20 hidden sm:block" />
                <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase font-semibold whitespace-nowrap">
                  {categoriesTitle}
                </span>
              </div>

              {/* Category Capsule Pills */}
              {categories.map((cat) => (
                <div
                  key={cat}
                  className="px-4 py-2 rounded-full border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/30 text-xs font-semibold text-slate-200 transition-all duration-200 cursor-default shadow-xs"
                >
                  {cat}
                </div>
              ))}
            </div>
          </SectionContainer>
        </section>
      )}

      {/* Projects Grid with Interactive Search & Category Filter */}
      <section className="py-14 sm:py-20 relative">
        <SectionContainer width="default" paddingY="none">
          <PortfolioClientView initialProjects={projects} />
        </SectionContainer>
      </section>

      <FinalCtaSection />
    </div>
  );
}
