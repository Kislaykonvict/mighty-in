import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { defaultHeroData, HeroData } from '@/types/hero';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const section = await prisma.siteSection.findUnique({
      where: {
        pageSlug_sectionKey: {
          pageSlug: 'home',
          sectionKey: 'hero',
        },
      },
    });

    if (!section || !section.isActive) {
      return NextResponse.json({ success: true, data: defaultHeroData });
    }

    const content = (section.content as any) || {};

    const data: HeroData = {
      badge: section.badge || defaultHeroData.badge,
      title: section.title || defaultHeroData.title,
      subtitle: section.subtitle || defaultHeroData.subtitle,
      ctaText: section.ctaText || defaultHeroData.ctaText,
      ctaLink: section.ctaLink || defaultHeroData.ctaLink,
      secondaryCtaText: content.secondaryCtaText || defaultHeroData.secondaryCtaText,
      secondaryCtaLink: content.secondaryCtaLink || defaultHeroData.secondaryCtaLink,
      videoUrl: content.videoUrl ?? '',
      fallbackImageUrl: content.fallbackImageUrl ?? '',
      overlayOpacity: typeof content.overlayOpacity === 'number' ? content.overlayOpacity : defaultHeroData.overlayOpacity,
      isActive: section.isActive ?? true,
    };

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: true, data: defaultHeroData });
  }
}
