import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import {
  defaultAssessmentSectionData,
  AssessmentSectionData,
} from '@/types/assessmentSection';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const section = await prisma.siteSection.findUnique({
      where: {
        pageSlug_sectionKey: {
          pageSlug: 'assessment',
          sectionKey: 'main',
        },
      },
    });

    if (!section) {
      return NextResponse.json({ success: true, data: defaultAssessmentSectionData });
    }

    const content = (section.content as any) || {};

    const data: AssessmentSectionData = {
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

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error fetching public assessment section:', error);
    return NextResponse.json({ success: true, data: defaultAssessmentSectionData });
  }
}
