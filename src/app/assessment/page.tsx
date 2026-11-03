import React from 'react';
import { constructMetadata } from '@/lib/utils/seo';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { Badge } from '@/components/ui/Badge';
import { AssessmentWizard } from '@/components/assessment/AssessmentWizard';
import {
  Sparkles,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Award,
  Zap,
  Target,
  Compass,
  Users,
  Cpu,
  Layers,
  FileCheck,
} from 'lucide-react';
import { prisma } from '@/lib/db/prisma';
import {
  defaultAssessmentSectionData,
  AssessmentSectionData,
} from '@/types/assessmentSection';

export const revalidate = 0;

export const metadata = constructMetadata({
  title: 'Digital Growth & Systems Diagnostic | 3-Minute Assessment',
  description:
    'Take the Mighty Warner 3-minute business momentum diagnostic across branding, software architecture, and talent scaling.',
  canonical: '/assessment',
});

const PILL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  clock: Clock,
  shieldcheck: ShieldCheck,
  sparkles: Sparkles,
  checkcircle2: CheckCircle2,
  award: Award,
  zap: Zap,
  target: Target,
  compass: Compass,
  users: Users,
  cpu: Cpu,
  layers: Layers,
  filecheck: FileCheck,
};

function resolveIcon(name: string) {
  const key = (name || '').toLowerCase();
  return PILL_ICONS[key] || Sparkles;
}

async function getAssessmentSectionData(): Promise<AssessmentSectionData> {
  try {
    const section = await prisma.siteSection.findUnique({
      where: {
        pageSlug_sectionKey: {
          pageSlug: 'assessment',
          sectionKey: 'main',
        },
      },
    });

    if (!section) return defaultAssessmentSectionData;

    const content = (section.content as any) || {};

    return {
      badge:
        section.badge !== null && section.badge !== undefined
          ? section.badge
          : defaultAssessmentSectionData.badge,
      title:
        section.title !== null && section.title !== undefined
          ? section.title
          : defaultAssessmentSectionData.title,
      highlightedTitle:
        typeof content.highlightedTitle === 'string'
          ? content.highlightedTitle
          : defaultAssessmentSectionData.highlightedTitle,
      description:
        section.subtitle !== null && section.subtitle !== undefined
          ? section.subtitle
          : typeof content.description === 'string'
          ? content.description
          : defaultAssessmentSectionData.description,
      featurePills:
        Array.isArray(content.featurePills) && content.featurePills.length > 0
          ? content.featurePills
          : defaultAssessmentSectionData.featurePills,
      questions:
        Array.isArray(content.questions) && content.questions.length > 0
          ? content.questions
          : defaultAssessmentSectionData.questions,
      scoreBreakdownLabels: {
        ...defaultAssessmentSectionData.scoreBreakdownLabels,
        ...(content.scoreBreakdownLabels || {}),
      },
      ratingTiers:
        Array.isArray(content.ratingTiers) && content.ratingTiers.length > 0
          ? content.ratingTiers
          : defaultAssessmentSectionData.ratingTiers,
      opportunities:
        Array.isArray(content.opportunities) && content.opportunities.length > 0
          ? content.opportunities
          : defaultAssessmentSectionData.opportunities,
      cta: {
        ...defaultAssessmentSectionData.cta,
        ...(content.cta || {}),
      },
      isActive: section.isActive ?? true,
    };
  } catch (error) {
    console.error('Error fetching assessment data from database:', error);
    return defaultAssessmentSectionData;
  }
}

export default async function AssessmentPage() {
  const sectionData = await getAssessmentSectionData();

  return (
    <div className="flex flex-col min-h-screen bg-[#DBDBDB] dark:bg-[#060A12]">
      {/* Header */}
      <section className="pt-28 sm:pt-32 pb-12 bg-[#DBDBDB] dark:bg-[#080C14] border-b border-neutral-300 dark:border-white/8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[500px] rounded-full bg-rose-500/5 dark:bg-sky-500/10 blur-[130px] pointer-events-none" />
        <div className="absolute inset-0 subtle-grid-bg opacity-15 pointer-events-none" />

        <SectionContainer width="narrow" paddingY="none" className="text-center relative z-10">
          <Badge variant="subtle" dot className="mb-4">
            {sectionData.badge || 'SIGNATURE DIAGNOSTIC TOOL'}
          </Badge>

          <h1 className="text-display-h1 font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            {sectionData.title}{' '}
            <span className="gradient-text-brand">{sectionData.highlightedTitle}</span>
          </h1>

          <p className="text-body-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed mb-6">
            {sectionData.description}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-600 dark:text-slate-400">
            {sectionData.featurePills.map((pill, idx) => {
              const Icon = resolveIcon(pill.icon);
              return (
                <span key={pill.id || idx} className="flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-rose-600 dark:text-sky-400" />
                  <span>{pill.text}</span>
                </span>
              );
            })}
          </div>
        </SectionContainer>
      </section>

      {/* Main Assessment Container */}
      <SectionContainer width="narrow" paddingY="lg">
        <AssessmentWizard sectionData={sectionData} />
      </SectionContainer>
    </div>
  );
}
