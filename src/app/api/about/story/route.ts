import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { defaultAboutStoryData, AboutStoryData } from '@/types/aboutStory';

export async function GET() {
  try {
    const section = await prisma.siteSection.findUnique({
      where: {
        pageSlug_sectionKey: {
          pageSlug: 'about',
          sectionKey: 'story',
        },
      },
    });

    if (!section || !section.content) {
      return NextResponse.json({
        success: true,
        data: defaultAboutStoryData,
        source: 'default',
      });
    }

    const content = section.content as any;

    const data: AboutStoryData = {
      badge: section.badge || content.badge || defaultAboutStoryData.badge,
      title: section.title || content.title || defaultAboutStoryData.title,
      subtitle: section.subtitle || content.subtitle || defaultAboutStoryData.subtitle,
      cards: Array.isArray(content.cards) && content.cards.length > 0
        ? content.cards
        : defaultAboutStoryData.cards,
      isActive: section.isActive ?? true,
    };

    return NextResponse.json({
      success: true,
      data,
      source: 'database',
    });
  } catch (error) {
    console.error('Error fetching dynamic about story:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch about story data',
        fallback: defaultAboutStoryData,
      },
      { status: 500 }
    );
  }
}
