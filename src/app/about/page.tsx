import React from 'react';
import Image from 'next/image';
import { constructMetadata } from '@/lib/utils/seo';
import { companyMilestones, leadershipTeam, coreValues } from '@/data/company';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Badge } from '@/components/ui/Badge';
import { PeopleSection } from '@/components/people/PeopleSection';
import { WhySection } from '@/components/why/WhySection';
import { FinalCtaSection } from '@/components/cta/FinalCtaSection';
import { Award, Globe, Building2, ShieldCheck, MapPin } from 'lucide-react';

export const metadata = constructMetadata({
  title: 'About Mighty Warner | Building Businesses Since 2013',
  description:
    'Learn about Mighty Warner’s journey since 2013: our multidisciplinary team, global offices, founding vision, and connected business ecosystem.',
  canonical: '/about',
});

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="pt-16 pb-20 bg-[#080C14] border-b border-white/8 relative overflow-hidden">
        <div className="absolute inset-0 subtle-grid-bg opacity-20 pointer-events-none" />
        <SectionContainer width="default" paddingY="none">
          <Badge variant="subtle" dot className="mb-4">
            ESTABLISHED 2013 • 13+ YEARS OF EXCELLENCE
          </Badge>
          <h1 className="text-display-h1 font-extrabold text-white tracking-tight mb-6 max-w-4xl">
            One company. Multiple ways to <span className="gradient-text-brand">move forward.</span>
          </h1>
          <p className="text-body-lg text-slate-300 max-w-2xl leading-relaxed mb-4">
            Mighty Warner was founded in 2013 to bridge the gap between high-level brand strategy, deep software engineering, and rapid talent deployment.
          </p>
        </SectionContainer>
      </section>

      {/* Verified Historical Timeline */}
      <SectionContainer width="default" paddingY="lg">
        <SectionHeader
          eyebrow="OUR JOURNEY"
          badgeVariant="subtle"
          title="Milestones since 2013."
          subtitle="How a boutique digital consultancy evolved into an integrated multi-business powerhouse."
          align="left"
        />

        <div className="relative border-l border-white/10 pl-8 space-y-12 max-w-3xl">
          {companyMilestones.map((m) => (
            <div key={m.year} className="relative group">
              <div className="absolute -left-[39px] top-1.5 w-4 h-4 rounded-full bg-[#080C14] border-2 border-sky-400 group-hover:bg-sky-400 transition-colors" />

              <div className="flex items-center gap-3 mb-1">
                <span className="text-base font-mono font-bold text-sky-400">{m.year}</span>
                {m.badge && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-white/10 text-slate-300">
                    {m.badge}
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{m.title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{m.description}</p>
            </div>
          ))}
        </div>
      </SectionContainer>

      {/* Leadership & Culture */}
      <PeopleSection />

      {/* Core Principles */}
      <WhySection />

      <FinalCtaSection />
    </div>
  );
}
