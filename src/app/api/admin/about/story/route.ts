import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db/prisma';
import { AboutStoryData, defaultAboutStoryData } from '@/types/aboutStory';

export const dynamic = 'force-dynamic';

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
      return NextResponse.json({ success: true, data: defaultAboutStoryData });
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

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error fetching admin about story data:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch about story data' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body: AboutStoryData = await req.json();

    const title = body.title || defaultAboutStoryData.title;
    const subtitle = body.subtitle || defaultAboutStoryData.subtitle;
    const badge = body.badge || defaultAboutStoryData.badge;
    const isActive = typeof body.isActive === 'boolean' ? body.isActive : true;
    const cards = Array.isArray(body.cards) && body.cards.length > 0
      ? body.cards
      : defaultAboutStoryData.cards;

    const content = {
      badge,
      title,
      subtitle,
      cards,
    };

    const updated = await prisma.siteSection.upsert({
      where: {
        pageSlug_sectionKey: {
          pageSlug: 'about',
          sectionKey: 'story',
        },
      },
      update: {
        name: 'About Story & Philosophy',
        title,
        subtitle,
        badge,
        content: content as any,
        isActive,
        order: 3,
      },
      create: {
        pageSlug: 'about',
        sectionKey: 'story',
        name: 'About Story & Philosophy',
        title,
        subtitle,
        badge,
        content: content as any,
        isActive,
        order: 3,
      },
    });

    // Invalidate ISR caches for the about page
    revalidatePath('/about');
    revalidatePath('/api/about/story');

    return NextResponse.json({
      success: true,
      message: 'About story section updated successfully',
      data: updated,
    });
  } catch (error: any) {
    console.error('Error updating admin about story data:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update about story data' },
      { status: 500 }
    );
  }
}
