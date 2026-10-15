import React from 'react';
import { constructMetadata } from '@/lib/utils/seo';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { Badge } from '@/components/ui/Badge';
import { AssessmentWizard } from '@/components/assessment/AssessmentWizard';
import { Sparkles, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';

export const metadata = constructMetadata({
  title: 'Digital Growth & Systems Diagnostic | 3-Minute Assessment',
  description:
    'Take the Mighty Warner 3-minute business momentum diagnostic across branding, software architecture, and talent scaling.',
  canonical: '/assessment',
});

export default function AssessmentPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <section className="pt-16 pb-12 bg-[#080C14] border-b border-white/8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[500px] rounded-full bg-sky-500/10 blur-[130px] pointer-events-none" />
        <div className="absolute inset-0 subtle-grid-bg opacity-20 pointer-events-none" />

        <SectionContainer width="narrow" paddingY="none" className="text-center relative z-10">
          <Badge variant="subtle" dot className="mb-4">
            SIGNATURE DIAGNOSTIC TOOL
          </Badge>
          <h1 className="text-display-h1 font-extrabold text-white tracking-tight mb-4">
            How ready is your business for its <span className="gradient-text-brand">next stage of growth?</span>
          </h1>
          <p className="text-body-lg text-slate-300 max-w-xl mx-auto leading-relaxed mb-6">
            Evaluate your commercial readiness across brand positioning, technology scalability, and team velocity in under 3 minutes.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              Takes ~3 minutes
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              100% Confidential
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              Instant Score & Action Plan
            </span>
          </div>
        </SectionContainer>
      </section>

      {/* Main Assessment Container */}
      <SectionContainer width="narrow" paddingY="lg">
        <AssessmentWizard />
      </SectionContainer>
    </div>
  );
}
