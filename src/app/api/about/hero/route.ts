import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { defaultAboutHeroData, AboutHeroData } from '@/types/aboutHero';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const section = await prisma.siteSection.findUnique({
      where: {
        pageSlug_sectionKey: {
          pageSlug: 'about',
          sectionKey: 'hero',
        },
      },
    });

    if (!section || !section.content) {
      return NextResponse.json({
        success: true,
        data: defaultAboutHeroData,
        source: 'default',
      });
    }

    const content = section.content as any;

    const data: AboutHeroData = {
      headline: section.title || content.headline || defaultAboutHeroData.headline,
      subheadline: section.subtitle || content.subheadline || defaultAboutHeroData.subheadline,
      ctaText: section.ctaText || content.ctaText || defaultAboutHeroData.ctaText,
      ctaLink: section.ctaLink || content.ctaLink || defaultAboutHeroData.ctaLink,
      backgroundImage: content.backgroundImage || defaultAboutHeroData.backgroundImage,
      imageAlt: content.imageAlt || defaultAboutHeroData.imageAlt,
      scrollTarget: content.scrollTarget || defaultAboutHeroData.scrollTarget,
      isActive: section.isActive ?? true,
    };

    return NextResponse.json({
      success: true,
      data,
      source: 'database',
    });
  } catch (error) {
    console.error('Error fetching dynamic about hero:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch about hero data',
        fallback: defaultAboutHeroData,
      },
      { status: 500 }
    );
  }
}
