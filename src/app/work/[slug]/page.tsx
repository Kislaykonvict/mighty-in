import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft, ArrowRight, CheckCircle2, Star, Quote, ExternalLink, Calendar, Building, Layers } from 'lucide-react';
import { prisma } from '@/lib/db/prisma';
import { projectsData } from '@/data/projects';
import { testimonialsData } from '@/data/testimonials';
import { constructDynamicMetadata } from '@/lib/utils/seo';
import { CustomHeadCode } from '@/components/seo/CustomHeadCode';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProjectCard } from '@/components/work/ProjectCard';
import { FinalCtaSection } from '@/components/cta/FinalCtaSection';

interface CaseStudyPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return projectsData.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const project = projectsData.find((p) => p.slug === params.slug);
  if (!project) return { title: 'Case Study Not Found' };

  let dbProject = null;
  try {
    dbProject = await prisma.project.findUnique({
      where: { slug: params.slug },
      select: {
        metaTitle: true,
        metaDescription: true,
        metaKeywords: true,
        canonicalUrl: true,
      },
    });
  } catch (e) {
    // Fallback if db offline or during static build
  }

  const fallbackKeywords = dbProject?.metaKeywords
    ? dbProject.metaKeywords.split(',').map((k) => k.trim())
    : undefined;

  return constructDynamicMetadata(`/work/${project.slug}`, {
    title: dbProject?.metaTitle || `${project.title} | Case Study`,
    description: dbProject?.metaDescription || project.summary,
    canonical: dbProject?.canonicalUrl || `/work/${project.slug}`,
    keywords: fallbackKeywords,
    ogImage: project.heroImage,
  });
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const project = projectsData.find((p) => p.slug === params.slug);

  if (!project) {
    notFound();
  }

  let dbHeadCode: string | null = null;
  try {
    const dbProject = await prisma.project.findUnique({
      where: { slug: params.slug },
      select: { headCode: true },
    });
    dbHeadCode = dbProject?.headCode || null;
  } catch (e) {
    // Fallback gracefully
  }

  const testimonial = testimonialsData.find((t) => t.id === project.testimonialId);
  const relatedProjects = projectsData
    .filter(
      (p) =>
        (p.industry === project.industry || (project.verticalId && p.verticalId === project.verticalId)) &&
        p.slug !== project.slug
    )
    .slice(0, 2);

  const themeBadgeVariant =
    project.verticalId === 'digital-growth'
      ? 'growth'
      : project.verticalId === 'talent-solutions'
      ? 'talent'
      : 'tech';

  return (
    <div className="flex flex-col min-h-screen bg-[#DBDBDB] dark:bg-[#060A12]">
      {/* Custom Head Scripts, Meta Tags & Schema (Head Code) */}
      <CustomHeadCode path={`/work/${project.slug}`} rawHeadCode={dbHeadCode} />

      {/* 1. Hero & Breadcrumbs */}
      <section className="pt-28 sm:pt-32 pb-16 bg-[#DBDBDB] dark:bg-[#080C14] border-b border-neutral-300 dark:border-white/8 relative overflow-hidden">
        <SectionContainer width="default" paddingY="none">
          <div className="mb-6">
            <Link
              href="/work"
              className="inline-flex items-center gap-2 text-xs font-mono text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to all case studies</span>
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant={themeBadgeVariant as any} dot>
              {project.verticalName}
            </Badge>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              {project.industry} • {project.year}
            </span>
          </div>

          <h1 className="text-display-h1 font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 max-w-4xl">
            {project.title}
          </h1>

          <p className="text-body-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed mb-8">
            {project.tagline}
          </p>

          {/* Quick Meta Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-white dark:bg-[#0F1626] border border-slate-200 dark:border-white/8 shadow-xs">
            <div>
              <div className="text-[10px] font-mono text-slate-500 uppercase">CLIENT</div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">{project.client}</div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-500 uppercase">INDUSTRY</div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">{project.industry}</div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-500 uppercase">DISCIPLINE</div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">{project.verticalName}</div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-500 uppercase">TIMELINE</div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">{project.year}</div>
            </div>
          </div>

          {project.liveUrl && (
            <div className="mt-4 flex justify-end">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100 dark:text-sky-400 dark:bg-sky-500/10 dark:border-sky-500/20 dark:hover:bg-sky-500/20 transition-colors"
              >
                <span>Visit Live Platform</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </SectionContainer>
      </section>

      {/* 2. Hero Visual Showcase */}
      <section className="py-10 bg-[#DBDBDB] dark:bg-[#060910]">
        <SectionContainer width="default" paddingY="none">
          <div className="relative h-[350px] sm:h-[500px] w-full rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-lg">
            <Image
              src={project.heroImage}
              alt={project.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        </SectionContainer>
      </section>

      {/* 3. Verified Outcomes Metrics Banner */}
      <section className="py-12 bg-[#DBDBDB] dark:bg-[#060A12] border-y border-neutral-300 dark:border-white/8">
        <SectionContainer width="default" paddingY="none">
          <div className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-4 font-semibold text-center sm:text-left">
            VERIFIED PRODUCTION RESULTS
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {project.metrics.map((metric) => (
              <div
                key={metric.label}
                className="p-5 rounded-2xl bg-white dark:bg-[#0F1626] border border-slate-300 dark:border-white/8 shadow-xs"
              >
                <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono mb-1">
                  {metric.value}
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">{metric.label}</div>
                {metric.description && (
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                    {metric.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </SectionContainer>
      </section>

      {/* 4. Challenge & Objectives */}
      <SectionContainer width="default" paddingY="lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-6 space-y-6">
            <div className="text-xs font-mono uppercase tracking-widest text-rose-600 dark:text-rose-400 font-bold">
              01. THE CHALLENGE
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              The operational and market friction holding the business back.
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {project.challenge}
            </p>
          </div>

          <div className="lg:col-span-6 p-8 rounded-3xl bg-white dark:bg-[#0F1626] border border-slate-300 dark:border-white/8 shadow-xs space-y-4">
            <div className="text-xs font-mono uppercase tracking-widest text-rose-600 dark:text-sky-400 font-bold">
              02. STRATEGIC OBJECTIVES
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Target Milestones</h3>
            <div className="space-y-3">
              {project.objectives.map((obj) => (
                <div key={obj} className="flex items-start gap-3 text-sm text-slate-800 dark:text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-rose-600 dark:text-sky-400 shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* 5. Strategy & Engineering Solution */}
      <section className="py-16 bg-[#DBDBDB] dark:bg-[#060910] border-y border-neutral-300 dark:border-white/8">
        <SectionContainer width="default" paddingY="none">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-6 space-y-4">
              <div className="text-xs font-mono uppercase tracking-widest text-orange-600 dark:text-orange-400 font-bold">
                03. THE STRATEGY
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                Our architectural and commercial roadmap.
              </h2>
              <div className="space-y-3 pt-2">
                {project.strategy.map((strat, idx) => (
                  <div key={strat} className="p-4 rounded-xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 shadow-xs space-y-1">
                    <div className="text-xs font-mono text-slate-500">PHASE 0{idx + 1}</div>
                    <div className="text-sm text-slate-800 dark:text-slate-200 font-medium">{strat}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <div className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold">
                04. THE SOLUTION &amp; EXECUTION
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                Engineered for immediate commercial impact.
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {project.solution}
              </p>

              {/* Technologies Used */}
              <div className="pt-4">
                <div className="text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3 font-semibold">
                  Technologies &amp; Frameworks Deployed
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.technologiesUsed.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-700 dark:text-slate-300 shadow-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* 6. Gallery / Visual Work */}
      {project.galleryImages && project.galleryImages.length > 0 && (
        <SectionContainer width="default" paddingY="lg">
          <div className="text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4 font-bold">
            05. VISUAL ARTIFACTS &amp; INTERFACES
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.galleryImages.map((imgUrl, i) => (
              <div
                key={i}
                className="relative h-72 sm:h-80 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-md"
              >
                <Image
                  src={imgUrl}
                  alt={`${project.title} preview ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </SectionContainer>
      )}

      {/* 7. Client Testimonial */}
      {testimonial && (
        <section className="py-16 bg-[#DBDBDB] dark:bg-[#060910] border-t border-neutral-300 dark:border-white/8">
          <SectionContainer width="narrow" paddingY="none">
            <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#0F1626] border border-slate-200 dark:border-white/10 text-center space-y-6 shadow-sm">
              <Quote className="w-10 h-10 text-rose-500/40 dark:text-sky-400/40 mx-auto" />
              <blockquote className="text-lg sm:text-xl font-medium text-slate-900 dark:text-white italic leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <div className="pt-2">
                <div className="text-base font-bold text-slate-900 dark:text-white">{testimonial.clientName}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {testimonial.role} • {testimonial.company}
                </div>
              </div>
            </div>
          </SectionContainer>
        </section>
      )}

      {/* 8. Related Case Studies */}
      {relatedProjects.length > 0 && (
        <section className="py-20 bg-[#DBDBDB] dark:bg-[#080C14] border-t border-neutral-300 dark:border-white/8">
          <SectionContainer width="default" paddingY="none">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Related Case Studies</h3>
              <Link href="/work" className="text-xs font-bold text-rose-600 dark:text-sky-400 hover:text-rose-700 dark:hover:text-sky-300 flex items-center gap-1">
                <span>All Projects</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedProjects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </SectionContainer>
        </section>
      )}

      {/* 9. Final CTA */}
      <FinalCtaSection />
    </div>
  );
}
