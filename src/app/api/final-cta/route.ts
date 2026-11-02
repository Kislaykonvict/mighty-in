import { NextResponse } from 'next/server';
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

    if (!section || !section.isActive) {
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
  } catch (err: any) {
    return NextResponse.json({ success: true, data: defaultFinalCtaData });
  }
}
