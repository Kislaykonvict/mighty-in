import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Users, CheckCircle2, UserCheck, Briefcase, Award, Building, UserPlus } from 'lucide-react';
import { constructMetadata } from '@/lib/utils/seo';
import { businessesData } from '@/data/businesses';
import { projectsData } from '@/data/projects';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProjectCard } from '@/components/work/ProjectCard';
import { FinalCtaSection } from '@/components/cta/FinalCtaSection';

const talentData = businessesData.find((b) => b.id === 'talent-solutions')!;
const relatedProjects = projectsData.filter((p) => p.verticalId === 'talent-solutions');

export const metadata = constructMetadata({
  title: 'Talent Solutions | Build the Team Behind the Business',
  description:
    'Dedicated engineering pods, contingent technical staffing, direct hire executive recruitment, and embedded talent acquisition for ambitious technology companies.',
  canonical: '/businesses/talent-solutions',
});

export default function TalentSolutionsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="pt-28 sm:pt-32 pb-20 bg-[#080C14] border-b border-white/8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[500px] rounded-full bg-emerald-500/10 blur-[130px] pointer-events-none" />
        <div className="absolute inset-0 subtle-grid-bg opacity-20 pointer-events-none" />

        <SectionContainer width="default" paddingY="none" className="relative z-10">
          <Badge variant="talent" dot className="mb-4">
            BUILD A TEAM • TALENT SOLUTIONS
          </Badge>
          <h1 className="text-display-h1 font-extrabold text-white tracking-tight mb-6 max-w-4xl">
            Build the team <span className="gradient-text-talent">behind the business.</span>
          </h1>
          <p className="text-body-lg text-slate-300 max-w-2xl leading-relaxed mb-8">
            {talentData.description}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Button
              href="/contact?topic=talent-solutions&type=employer"
              variant="talent"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Hire Elite Talent (Employer)
            </Button>
            <Button
              href="/contact?topic=talent-solutions&type=candidate"
              variant="outline"
              size="lg"
            >
              Join Talent Network (Candidate)
            </Button>
          </div>
        </SectionContainer>
      </section>

      {/* Dual Audience Journey Cards (Employers vs Candidates) */}
      <section className="py-16 bg-[#060910] border-b border-white/8">
        <SectionContainer width="default" paddingY="none">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Employer Pathway */}
            <div className="p-8 rounded-3xl bg-[#0F1626] border border-emerald-500/30 shadow-xl space-y-6 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                  <Building className="w-6 h-6" />
                </div>
                <div className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider mb-1">
                  FOR COMPANIES & HIRING MANAGERS
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Need to scale your team or hire senior specialists?
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  Deploy pre-vetted full-stack developers, cloud architects, product leaders, or dedicated SOW project squads in under 14 days.
                </p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Rigorously evaluated technical scenario assessments</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Flexible contracts: Staff Augmentation, SOW, Direct Hire</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>94% first-year candidate retention rate</span>
                  </div>
                </div>
              </div>

              <Button
                href="/contact?topic=talent-solutions&type=employer"
                variant="talent"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                fullWidth
              >
                Request Candidate Shortlist
              </Button>
            </div>

            {/* Candidate Pathway */}
            <div className="p-8 rounded-3xl bg-[#0F1626] border border-white/10 shadow-xl space-y-6 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mb-4">
                  <UserPlus className="w-6 h-6" />
                </div>
                <div className="text-xs font-mono text-sky-400 font-bold uppercase tracking-wider mb-1">
                  FOR SENIOR PRACTITIONERS & LEADERS
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Looking for high-impact roles at premier companies?
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  Join our curated network of top 5% engineers, product designers, and growth leaders placed at high-growth tech firms.
                </p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>Direct access to unlisted senior and leadership positions</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>Transparent compensation and career trajectory matching</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>Dedicated career advisor and contract management</span>
                  </div>
                </div>
              </div>

              <Button
                href="/contact?topic=talent-solutions&type=candidate"
                variant="outline"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                fullWidth
              >
                Join Candidate Network
              </Button>
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* Services Grid */}
      <SectionContainer width="default" paddingY="lg">
        <SectionHeader
          eyebrow="TALENT ENGAGEMENT MODELS"
          badgeVariant="talent"
          title="Flexible staffing models tailored to your sprint velocity."
          subtitle="Whether you need a single specialized DevOps expert or an entire cross-functional squad, our engagement models adapt to your budget and organizational structure."
          align="left"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {talentData.services.map((srv, idx) => (
            <div
              key={srv.id}
              className="p-6 rounded-2xl bg-[#0F1626] border border-white/8 hover:border-emerald-500/40 transition-all flex flex-col justify-between shadow-lg group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-slate-500">0{idx + 1}</span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                  {srv.name}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  {srv.fullDescription || srv.shortDescription}
                </p>

                {srv.deliverables && (
                  <div className="space-y-1.5 pt-4 border-t border-white/5">
                    {srv.deliverables.map((del) => (
                      <div key={del} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{del}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </SectionContainer>

      {/* Case Studies */}
      <section className="py-20 bg-[#060A12] border-t border-white/8">
        <SectionContainer width="default" paddingY="none">
          <SectionHeader
            eyebrow="TALENT CASE STUDIES"
            badgeVariant="talent"
            title="Accelerating product velocity with elite talent."
            subtitle="Explore how our contingent and SOW engineering pods helped scale-ups beat critical compliance deadlines."
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
