import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { defaultGlobalOfficesData, GlobalOfficesData } from '@/types/globalOffices';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const section = await prisma.siteSection.findUnique({
      where: {
        pageSlug_sectionKey: {
          pageSlug: 'home',
          sectionKey: 'global_offices',
        },
      },
    });

    if (!section) {
      return NextResponse.json({ success: true, data: defaultGlobalOfficesData });
    }

    const content = (section.content as any) || {};

    const data: GlobalOfficesData = {
      badge: section.badge || defaultGlobalOfficesData.badge,
      title: section.title || defaultGlobalOfficesData.title,
      highlightedTitle:
        typeof content.highlightedTitle === 'string'
          ? content.highlightedTitle
          : defaultGlobalOfficesData.highlightedTitle,
      description:
        section.subtitle ||
        (typeof content.description === 'string' ? content.description : defaultGlobalOfficesData.description),
      cycleBannerText:
        typeof content.cycleBannerText === 'string'
          ? content.cycleBannerText
          : defaultGlobalOfficesData.cycleBannerText,
      stats:
        Array.isArray(content.stats) && content.stats.length > 0
          ? content.stats
          : defaultGlobalOfficesData.stats,
      offices:
        Array.isArray(content.offices) && content.offices.length > 0
          ? content.offices
          : defaultGlobalOfficesData.offices,
      isActive: section.isActive ?? true,
    };

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error in public /api/global-offices:', error);
    return NextResponse.json({ success: true, data: defaultGlobalOfficesData });
  }
}
