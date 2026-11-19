import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';
import {
  HomeGrowthToolsSectionData,
  defaultHomeGrowthToolsSectionData,
} from '@/types/growthTools';
import { defaultAssessmentSectionData } from '@/types/assessmentSection';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const section = await prisma.siteSection.findUnique({
      where: {
        pageSlug_sectionKey: {
          pageSlug: 'home',
          sectionKey: 'growth_tools',
        },
      },
    });

    if (!section) {
      // Check existing assessment section to carry over questions
      try {
        const assessmentSec = await prisma.siteSection.findUnique({
          where: {
            pageSlug_sectionKey: {
              pageSlug: 'assessment',
              sectionKey: 'main',
            },
          },
        });
        if (assessmentSec && assessmentSec.content) {
          const assContent = assessmentSec.content as any;
          return NextResponse.json({
            success: true,
            data: {
              ...defaultHomeGrowthToolsSectionData,
              diagnostic: {
                ...defaultAssessmentSectionData,
                ...assContent,
                badge: assessmentSec.badge || assContent.badge || defaultAssessmentSectionData.badge,
                title: assessmentSec.title || assContent.title || defaultAssessmentSectionData.title,
                description: assessmentSec.subtitle || assContent.description || defaultAssessmentSectionData.description,
              },
            },
          });
        }
      } catch {}

      return NextResponse.json({
        success: true,
        data: defaultHomeGrowthToolsSectionData,
      });
    }

    const content = (section.content as any) || {};

    const data: HomeGrowthToolsSectionData = {
      badge: section.badge || defaultHomeGrowthToolsSectionData.badge,
      title: section.title || defaultHomeGrowthToolsSectionData.title,
      highlightedTitle: content.highlightedTitle || defaultHomeGrowthToolsSectionData.highlightedTitle,
      description: section.subtitle || content.description || defaultHomeGrowthToolsSectionData.description,
      diagnosticTabLabel: content.diagnosticTabLabel || defaultHomeGrowthToolsSectionData.diagnosticTabLabel,
      roiTabLabel: content.roiTabLabel || defaultHomeGrowthToolsSectionData.roiTabLabel,
      defaultActiveTab: content.defaultActiveTab || defaultHomeGrowthToolsSectionData.defaultActiveTab,
      diagnostic: content.diagnostic || defaultHomeGrowthToolsSectionData.diagnostic,
      roi: content.roi || defaultHomeGrowthToolsSectionData.roi,
      isActive: section.isActive ?? true,
    };

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error fetching growth-tools config:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch growth-tools configuration' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body: HomeGrowthToolsSectionData = await req.json();

    const {
      badge = defaultHomeGrowthToolsSectionData.badge,
      title = defaultHomeGrowthToolsSectionData.title,
      highlightedTitle = defaultHomeGrowthToolsSectionData.highlightedTitle,
      description = defaultHomeGrowthToolsSectionData.description,
      diagnosticTabLabel = defaultHomeGrowthToolsSectionData.diagnosticTabLabel,
      roiTabLabel = defaultHomeGrowthToolsSectionData.roiTabLabel,
      defaultActiveTab = 'diagnostic',
      diagnostic = defaultHomeGrowthToolsSectionData.diagnostic,
      roi = defaultHomeGrowthToolsSectionData.roi,
      isActive = true,
    } = body;

    const contentToSave = {
      highlightedTitle,
      description,
      diagnosticTabLabel,
      roiTabLabel,
      defaultActiveTab,
      diagnostic,
      roi,
    };

    const updated = await prisma.siteSection.upsert({
      where: {
        pageSlug_sectionKey: {
          pageSlug: 'home',
          sectionKey: 'growth_tools',
        },
      },
      create: {
        pageSlug: 'home',
        sectionKey: 'growth_tools',
        name: 'Homepage Growth Diagnostic & ROI Calculator',
        badge: badge.trim(),
        title: title.trim(),
        subtitle: description.trim(),
        order: 6,
        isActive: Boolean(isActive),
        content: contentToSave as any,
      },
      update: {
        badge: badge.trim(),
        title: title.trim(),
        subtitle: description.trim(),
        isActive: Boolean(isActive),
        content: contentToSave as any,
      },
    });

    // Also sync the diagnostic questions to the assessment/main siteSection for full consistency
    try {
      if (diagnostic) {
        const diagnosticContent: any = {
          highlightedTitle: diagnostic.highlightedTitle || 'next stage of growth?',
          description: diagnostic.description || '',
          featurePills: diagnostic.featurePills || [],
          questions: diagnostic.questions || [],
          scoreBreakdownLabels: diagnostic.scoreBreakdownLabels || {},
          ratingTiers: diagnostic.ratingTiers || [],
          opportunities: diagnostic.opportunities || [],
          cta: diagnostic.cta || {},
        };

        await prisma.siteSection.upsert({
          where: {
            pageSlug_sectionKey: {
              pageSlug: 'assessment',
              sectionKey: 'main',
            },
          },
          create: {
            pageSlug: 'assessment',
            sectionKey: 'main',
            name: 'Growth Diagnostic Wizard',
            badge: diagnostic.badge || 'SIGNATURE DIAGNOSTIC TOOL',
            title: diagnostic.title || 'How ready is your business for its',
            subtitle: diagnostic.description || '',
            order: 1,
            isActive: true,
            content: diagnosticContent,
          },
          update: {
            badge: diagnostic.badge || 'SIGNATURE DIAGNOSTIC TOOL',
            title: diagnostic.title || 'How ready is your business for its',
            subtitle: diagnostic.description || '',
            content: diagnosticContent,
          },
        });
      }
    } catch (e) {
      console.warn('Sync to assessment/main failed:', e);
    }

    try {
      revalidatePath('/');
      revalidatePath('/admin/growth-tools');
    } catch (e) {
      // Ignore in dev
    }

    return NextResponse.json({
      success: true,
      data: {
        badge: updated.badge,
        title: updated.title,
        highlightedTitle,
        description,
        diagnosticTabLabel,
        roiTabLabel,
        defaultActiveTab,
        diagnostic,
        roi,
        isActive: updated.isActive,
      },
    });
  } catch (error: any) {
    console.error('Error saving growth-tools config:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save configuration' },
      { status: 500 }
    );
  }
}
