import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Cpu, CheckCircle2, Code, Server, Smartphone, Workflow, ShieldCheck } from 'lucide-react';
import { constructMetadata } from '@/lib/utils/seo';
import { businessesData } from '@/data/businesses';
import { prisma } from '@/lib/db/prisma';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProjectCard } from '@/components/work/ProjectCard';
import { FinalCtaSection } from '@/components/cta/FinalCtaSection';

const techData = businessesData.find((b) => b.id === 'technology')!;

export const metadata = constructMetadata({
  title: 'Technology & Custom Software | Build the Systems You Need Next',
  description:
    'Full-stack web application engineering, custom enterprise platforms, high-throughput microservices, API integrations, and workflow automation.',
  canonical: '/businesses/technology',
});

export default async function TechnologyPage() {
  let relatedProjects: any[] = [];
  try {
    relatedProjects = await prisma.project.findMany({
      where: {
        published: true,
        category: { contains: 'Tech', mode: 'insensitive' },
      },
      take: 2,
    });
  } catch (e) {}

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] dark:bg-[#080C14]">
      {/* Hero Section */}
      <section className="pt-28 sm:pt-32 pb-20 bg-white dark:bg-[#080C14] border-b border-slate-200 dark:border-white/8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[500px] rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-[130px] pointer-events-none" />
        <div className="absolute inset-0 subtle-grid-bg opacity-15 pointer-events-none" />

        <SectionContainer width="default" paddingY="none" className="relative z-10">
          <Badge variant="tech" dot className="mb-4">
            BUILD A PRODUCT • TECHNOLOGY
          </Badge>
          <h1 className="text-display-h1 font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 max-w-4xl">
            Build the systems your business <span className="gradient-text-tech">needs next.</span>
          </h1>
          <p className="text-body-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed mb-8">
            {techData.description}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Button
              href="/contact?topic=technology"
              variant="tech"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Start Technology Project
            </Button>
            <Button
              href="/portfolio"
              variant="outline"
              size="lg"
            >
              Explore Engineering Case Studies
            </Button>
          </div>
        </SectionContainer>
      </section>

      {/* Verified Uptime & Performance Benchmarks */}
      <section className="py-12 bg-slate-50 dark:bg-[#060910] border-b border-slate-200 dark:border-white/8">
        <SectionContainer width="default" paddingY="none">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {techData.outcomes.map((item) => (
              <div
                key={item.label}
                className="p-6 rounded-2xl bg-white dark:bg-[#0F1626] border border-blue-200 dark:border-blue-500/20 shadow-sm"
              >
                <div className="text-3xl sm:text-4xl font-black text-blue-600 dark:text-blue-400 font-mono mb-1">
                  {item.metric}
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white mb-1">{item.label}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">{item.context}</div>
              </div>
            ))}
          </div>
        </SectionContainer>
      </section>

      {/* Detailed Services Deep Dive */}
      <SectionContainer width="default" paddingY="lg">
        <SectionHeader
          eyebrow="ENGINEERING SERVICES"
          badgeVariant="tech"
          title="Architected for reliability, speed, and scale."
          subtitle="From high-concurrency web applications to custom ERP software and automated webhook meshes, we write clean, maintainable code designed to grow with your business."
          align="left"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techData.services.map((srv, idx) => (
            <div
              key={srv.id}
              className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#0F1626] border border-slate-200 dark:border-white/8 hover:border-blue-400 dark:hover:border-blue-500/40 transition-all flex flex-col justify-between shadow-sm group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-slate-400 dark:text-slate-500">0{idx + 1}</span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                  {srv.name}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  {srv.fullDescription || srv.shortDescription}
                </p>

                {srv.deliverables && (
                  <div className="space-y-1.5 mb-6 pt-4 border-t border-slate-200 dark:border-white/5">
                    <div className="text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400 font-semibold mb-2">
                      Technical Deliverables:
                    </div>
                    {srv.deliverables.map((del) => (
                      <div key={del} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span>{del}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {srv.technologies && (
                <div className="flex flex-wrap gap-1 pt-3 border-t border-slate-200 dark:border-white/5">
                  {srv.technologies.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </SectionContainer>

      {/* Case Studies */}
      {relatedProjects.length > 0 && (
        <section className="py-20 bg-white dark:bg-[#060A12] border-t border-slate-200 dark:border-white/8">
          <SectionContainer width="default" paddingY="none">
            <SectionHeader
              eyebrow="ENGINEERING CASE STUDIES"
              badgeVariant="tech"
              title="Systems built for mission-critical operations."
              subtitle="Explore how our platform engineering modernized legacy monoliths and automated enterprise logistics."
              align="left"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedProjects.map((project) => (
                <ProjectCard key={project.id} project={project as any} />
              ))}
            </div>
          </SectionContainer>
        </section>
      )}

      <FinalCtaSection />
    </div>
  );
}
