import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, CheckCircle2, TrendingUp, Search, Layout, Compass, ShieldCheck } from 'lucide-react';
import { constructMetadata } from '@/lib/utils/seo';
import { businessesData } from '@/data/businesses';
import { projectsData } from '@/data/projects';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProjectCard } from '@/components/work/ProjectCard';
import { FinalCtaSection } from '@/components/cta/FinalCtaSection';

const digitalData = businessesData.find((b) => b.id === 'digital-growth')!;
const relatedProjects = projectsData.filter((p) => p.verticalId === 'digital-growth');

export const metadata = constructMetadata({
  title: 'Digital & Growth | Make Your Business Impossible to Ignore',
  description:
    'Brand strategy, high-speed Next.js web experiences, technical SEO, and conversion optimization designed to attract high-intent buyers and turn attention into revenue.',
  canonical: '/businesses/digital-growth',
});

export default function DigitalGrowthPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="pt-28 sm:pt-32 pb-20 bg-[#080C14] border-b border-white/8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[500px] rounded-full bg-orange-500/10 blur-[130px] pointer-events-none" />
        <div className="absolute inset-0 subtle-grid-bg opacity-20 pointer-events-none" />

        <SectionContainer width="default" paddingY="none" className="relative z-10">
          <Badge variant="growth" dot className="mb-4">
            BUILD A BRAND • DIGITAL & GROWTH
          </Badge>
          <h1 className="text-display-h1 font-extrabold text-white tracking-tight mb-6 max-w-4xl">
            Make your business <span className="gradient-text-growth">impossible to ignore.</span>
          </h1>
          <p className="text-body-lg text-slate-300 max-w-2xl leading-relaxed mb-8">
            {digitalData.description}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Button
              href="/contact?topic=digital-growth"
              variant="growth"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Start Digital Growth Project
            </Button>
            <Button
              href="/assessment"
              variant="outline"
              size="lg"
            >
              Evaluate Brand Readiness
            </Button>
          </div>
        </SectionContainer>
      </section>

      {/* Verified Outcomes Metric Banner */}
      <section className="py-12 bg-[#060910] border-b border-white/8">
        <SectionContainer width="default" paddingY="none">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {digitalData.outcomes.map((item) => (
              <div
                key={item.label}
                className="p-6 rounded-2xl bg-[#0F1626] border border-orange-500/20 shadow-lg"
              >
                <div className="text-3xl sm:text-4xl font-black text-orange-400 font-mono mb-1">
                  {item.metric}
                </div>
                <div className="text-sm font-bold text-white mb-1">{item.label}</div>
                <div className="text-xs text-slate-400">{item.context}</div>
              </div>
            ))}
          </div>
        </SectionContainer>
      </section>

      {/* Detailed Services Deep Dive */}
      <SectionContainer width="default" paddingY="lg">
        <SectionHeader
          eyebrow="SPECIALIZED CAPABILITIES"
          badgeVariant="growth"
          title="Full-spectrum brand and acquisition services."
          subtitle="We eliminate disjointed marketing tactics by aligning your positioning, web architecture, and organic demand capture into one continuous conversion engine."
          align="left"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {digitalData.services.map((srv, idx) => (
            <div
              key={srv.id}
              className="p-6 sm:p-8 rounded-2xl bg-[#0F1626] border border-white/8 hover:border-orange-500/40 transition-all flex flex-col justify-between shadow-lg group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-slate-500">0{idx + 1}</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-300 transition-colors">
                  {srv.name}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                  {srv.fullDescription || srv.shortDescription}
                </p>

                {srv.deliverables && (
                  <div className="space-y-1.5 mb-6 pt-4 border-t border-white/5">
                    <div className="text-[11px] font-mono uppercase text-slate-400 font-semibold mb-2">
                      Deliverables:
                    </div>
                    {srv.deliverables.map((del) => (
                      <div key={del} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                        <span>{del}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {srv.technologies && (
                <div className="flex flex-wrap gap-1 pt-3 border-t border-white/5">
                  {srv.technologies.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400"
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

      {/* Case Studies in this vertical */}
      <section className="py-20 bg-[#060A12] border-t border-white/8">
        <SectionContainer width="default" paddingY="none">
          <SectionHeader
            eyebrow="SELECTED CASE STUDIES"
            badgeVariant="growth"
            title="Real brands. Measurable market momentum."
            subtitle="Explore how our digital and growth initiatives created verified revenue pipeline for our clients."
            align="left"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {relatedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </SectionContainer>
      </section>

      <FinalCtaSection />
    </div>
  );
}
