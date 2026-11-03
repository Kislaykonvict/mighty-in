import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db/prisma';
import {
  defaultAssessmentSectionData,
  AssessmentSectionData,
  AssessmentFeaturePill,
  AssessmentRatingTier,
  AssessmentScoreBreakdownConfig,
  AssessmentCtaConfig,
} from '@/types/assessmentSection';
import { AssessmentQuestion, OpportunityItem } from '@/types/assessment';

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
    console.error('Error fetching Assessment section data:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch Assessment section data' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const badge =
      typeof body.badge === 'string' ? body.badge.trim() : defaultAssessmentSectionData.badge;
    const title =
      typeof body.title === 'string' ? body.title.trim() : defaultAssessmentSectionData.title;
    const highlightedTitle =
      typeof body.highlightedTitle === 'string'
        ? body.highlightedTitle.trim()
        : defaultAssessmentSectionData.highlightedTitle;
    const description =
      typeof body.description === 'string'
        ? body.description.trim()
        : defaultAssessmentSectionData.description;
    const isActive = typeof body.isActive === 'boolean' ? body.isActive : true;

    // Feature Pills
    const rawPills = Array.isArray(body.featurePills)
      ? body.featurePills
      : defaultAssessmentSectionData.featurePills;
    const featurePills: AssessmentFeaturePill[] = rawPills.map((pill: any, i: number) => ({
      id: String(pill.id || `pill-${i + 1}`).trim(),
      icon: String(pill.icon || 'Sparkles').trim(),
      text: String(pill.text || '').trim(),
    }));

    // Questions and Options
    const rawQuestions = Array.isArray(body.questions)
      ? body.questions
      : defaultAssessmentSectionData.questions;
    const questions: AssessmentQuestion[] = rawQuestions.map((q: any, qIdx: number) => {
      const rawOptions = Array.isArray(q.options) ? q.options : [];
      return {
        id: String(q.id || `q${qIdx + 1}`).trim(),
        number: typeof q.number === 'number' ? q.number : qIdx + 1,
        question: String(q.question || `Question ${qIdx + 1}`).trim(),
        subtext: typeof q.subtext === 'string' ? q.subtext.trim() : '',
        category: (['challenge', 'presence', 'bottleneck', 'priority', 'capability'].includes(q.category)
          ? q.category
          : 'challenge') as any,
        options: rawOptions.map((opt: any, oIdx: number) => ({
          id: String(opt.id || `opt-${qIdx + 1}-${oIdx + 1}`).trim(),
          label: String(opt.label || `Option ${oIdx + 1}`).trim(),
          description: typeof opt.description === 'string' ? opt.description.trim() : '',
          scoreWeight:
            typeof opt.scoreWeight === 'number' && !isNaN(opt.scoreWeight)
              ? Math.max(0, Math.min(30, opt.scoreWeight))
              : 15,
          categoryFocus: (['growth', 'tech', 'talent', 'strategy'].includes(opt.categoryFocus)
            ? opt.categoryFocus
            : 'growth') as any,
          capabilityKey: String(opt.capabilityKey || 'Digital & Growth').trim(),
        })),
      };
    });

    // Score Breakdown Labels
    const rawBreakdown = body.scoreBreakdownLabels || {};
    const scoreBreakdownLabels: AssessmentScoreBreakdownConfig = {
      digitalVisibilityLabel: String(
        rawBreakdown.digitalVisibilityLabel ||
          defaultAssessmentSectionData.scoreBreakdownLabels.digitalVisibilityLabel
      ).trim(),
      technologyReadinessLabel: String(
        rawBreakdown.technologyReadinessLabel ||
          defaultAssessmentSectionData.scoreBreakdownLabels.technologyReadinessLabel
      ).trim(),
      teamScalabilityLabel: String(
        rawBreakdown.teamScalabilityLabel ||
          defaultAssessmentSectionData.scoreBreakdownLabels.teamScalabilityLabel
      ).trim(),
      conversionPowerLabel: String(
        rawBreakdown.conversionPowerLabel ||
          defaultAssessmentSectionData.scoreBreakdownLabels.conversionPowerLabel
      ).trim(),
    };

    // Rating Tiers
    const rawTiers = Array.isArray(body.ratingTiers)
      ? body.ratingTiers
      : defaultAssessmentSectionData.ratingTiers;
    const ratingTiers: AssessmentRatingTier[] = rawTiers.map((tier: any) => ({
      minScore:
        typeof tier.minScore === 'number' && !isNaN(tier.minScore)
          ? Math.max(0, Math.min(100, tier.minScore))
          : 0,
      title: String(tier.title || '').trim(),
      summary: String(tier.summary || '').trim(),
    }));

    // Opportunities
    const rawOpps = Array.isArray(body.opportunities)
      ? body.opportunities
      : defaultAssessmentSectionData.opportunities;
    const opportunities: OpportunityItem[] = rawOpps.map((opp: any, idx: number) => ({
      id: String(opp.id || `opp-${idx + 1}`).trim(),
      number: String(opp.number || `0${idx + 1}`).trim(),
      title: String(opp.title || '').trim(),
      description: String(opp.description || '').trim(),
      recommendedVertical: String(opp.recommendedVertical || 'Digital & Growth').trim() as any,
      actionStep: String(opp.actionStep || '').trim(),
    }));

    // CTA
    const rawCta = body.cta || {};
    const cta: AssessmentCtaConfig = {
      title: String(rawCta.title || defaultAssessmentSectionData.cta.title).trim(),
      subtitle: String(rawCta.subtitle || defaultAssessmentSectionData.cta.subtitle).trim(),
      retakeButtonText: String(
        rawCta.retakeButtonText || defaultAssessmentSectionData.cta.retakeButtonText
      ).trim(),
      primaryButtonText: String(
        rawCta.primaryButtonText || defaultAssessmentSectionData.cta.primaryButtonText
      ).trim(),
      primaryButtonLink: String(
        rawCta.primaryButtonLink || defaultAssessmentSectionData.cta.primaryButtonLink
      ).trim(),
    };

    const contentPayload = {
      highlightedTitle,
      description,
      featurePills,
      questions,
      scoreBreakdownLabels,
      ratingTiers,
      opportunities,
      cta,
    };

    const saved = await prisma.siteSection.upsert({
      where: {
        pageSlug_sectionKey: {
          pageSlug: 'assessment',
          sectionKey: 'main',
        },
      },
      create: {
        pageSlug: 'assessment',
        sectionKey: 'main',
        name: 'Assessment & Growth Diagnostic',
        badge,
        title,
        subtitle: description,
        content: contentPayload as any,
        isActive,
        order: 1,
      },
      update: {
        badge,
        title,
        subtitle: description,
        content: contentPayload as any,
        isActive,
        updatedAt: new Date(),
      },
    });

    // Revalidate public pages and cache
    revalidatePath('/assessment');
    revalidatePath('/growth-lab');
    revalidatePath('/admin/assessment');

    const resultData: AssessmentSectionData = {
      badge,
      title,
      highlightedTitle,
      description,
      featurePills,
      questions,
      scoreBreakdownLabels,
      ratingTiers,
      opportunities,
      cta,
      isActive,
    };

    return NextResponse.json({
      success: true,
      message: 'Assessment configuration saved successfully',
      data: resultData,
    });
  } catch (error: any) {
    console.error('Error saving Assessment section data:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save Assessment section data' },
      { status: 500 }
    );
  }
}
