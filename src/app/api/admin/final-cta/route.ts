import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db/prisma';
import { defaultFinalCtaData, FinalCtaData } from '@/types/finalCta';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const section = await prisma.siteSection.findUnique({
      where: {
        pageSlug_sectionKey: {
          pageSlug: 'home',
          sectionKey: 'final_cta',
        },
      },
    });

    if (!section) {
      return NextResponse.json({ success: true, data: defaultFinalCtaData });
    }

    const content = (section.content as any) || {};

    const data: FinalCtaData = {
      badge: section.badge !== null && section.badge !== undefined ? section.badge : defaultFinalCtaData.badge,
      title: section.title !== null && section.title !== undefined ? section.title : defaultFinalCtaData.title,
      subtitle: section.subtitle !== null && section.subtitle !== undefined ? section.subtitle : defaultFinalCtaData.subtitle,
      primaryCtaText: section.ctaText !== null && section.ctaText !== undefined ? section.ctaText : defaultFinalCtaData.primaryCtaText,
      primaryCtaLink: section.ctaLink !== null && section.ctaLink !== undefined ? section.ctaLink : defaultFinalCtaData.primaryCtaLink,
      secondaryCtaText: typeof content.secondaryCtaText === 'string' ? content.secondaryCtaText : defaultFinalCtaData.secondaryCtaText,
      secondaryCtaLink: typeof content.secondaryCtaLink === 'string' ? content.secondaryCtaLink : defaultFinalCtaData.secondaryCtaLink,
      showSecondaryCta: typeof content.showSecondaryCta === 'boolean' ? content.showSecondaryCta : defaultFinalCtaData.showSecondaryCta,
      guaranteeNote: typeof content.guaranteeNote === 'string' ? content.guaranteeNote : defaultFinalCtaData.guaranteeNote,
      isActive: section.isActive ?? true,
    };

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error fetching Conversion CTA data:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch Conversion CTA data' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const badge = typeof body.badge === 'string' ? body.badge : defaultFinalCtaData.badge;
    const title = typeof body.title === 'string' ? body.title : defaultFinalCtaData.title;
    const subtitle = typeof body.subtitle === 'string' ? body.subtitle : defaultFinalCtaData.subtitle;
    const primaryCtaText = typeof body.primaryCtaText === 'string' ? body.primaryCtaText : defaultFinalCtaData.primaryCtaText;
    const primaryCtaLink = typeof body.primaryCtaLink === 'string' ? body.primaryCtaLink : defaultFinalCtaData.primaryCtaLink;
    const secondaryCtaText = typeof body.secondaryCtaText === 'string' ? body.secondaryCtaText : defaultFinalCtaData.secondaryCtaText;
    const secondaryCtaLink = typeof body.secondaryCtaLink === 'string' ? body.secondaryCtaLink : defaultFinalCtaData.secondaryCtaLink;
    const showSecondaryCta = typeof body.showSecondaryCta === 'boolean' ? body.showSecondaryCta : true;
    const guaranteeNote = typeof body.guaranteeNote === 'string' ? body.guaranteeNote : defaultFinalCtaData.guaranteeNote;
    const isActive = typeof body.isActive === 'boolean' ? body.isActive : true;

    const content = {
      secondaryCtaText,
      secondaryCtaLink,
      showSecondaryCta,
      guaranteeNote,
    };

    const updated = await prisma.siteSection.upsert({
      where: {
        pageSlug_sectionKey: {
          pageSlug: 'home',
          sectionKey: 'final_cta',
        },
      },
      update: {
        name: 'Conversion CTA',
        badge,
        title,
        subtitle,
        ctaText: primaryCtaText,
        ctaLink: primaryCtaLink,
        content: content as any,
        isActive,
        order: 7,
      },
      create: {
        pageSlug: 'home',
        sectionKey: 'final_cta',
        name: 'Conversion CTA',
        badge,
        title,
        subtitle,
        ctaText: primaryCtaText,
        ctaLink: primaryCtaLink,
        content: content as any,
        isActive,
        order: 7,
      },
    });

    try {
      revalidatePath('/');
    } catch {
      // Ignore during development
    }

    const responseData: FinalCtaData = {
      badge: updated.badge ?? badge,
      title: updated.title ?? title,
      subtitle: updated.subtitle ?? subtitle,
      primaryCtaText: updated.ctaText ?? primaryCtaText,
      primaryCtaLink: updated.ctaLink ?? primaryCtaLink,
      secondaryCtaText,
      secondaryCtaLink,
      showSecondaryCta,
      guaranteeNote,
      isActive: updated.isActive,
    };

    return NextResponse.json({
      success: true,
      message: 'Conversion CTA section updated and published to storefront!',
      data: responseData,
    });
  } catch (error: any) {
    console.error('Error updating Conversion CTA data:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update Conversion CTA data' },
      { status: 500 }
    );
  }
}
