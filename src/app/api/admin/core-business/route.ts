import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db/prisma';
import { CoreBusinessData, defaultCoreBusinessData, CoreBusinessCard } from '@/types/coreBusiness';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const section = await prisma.siteSection.findUnique({
      where: {
        pageSlug_sectionKey: {
          pageSlug: 'home',
          sectionKey: 'core_business',
        },
      },
    });

    if (!section) {
      return NextResponse.json({ success: true, data: defaultCoreBusinessData });
    }

    const content = (section.content as any) || {};

    const rawCards: any[] = Array.isArray(content.cards) && content.cards.length > 0
      ? content.cards
      : defaultCoreBusinessData.cards;

    const cards: CoreBusinessCard[] = rawCards.map((item, index) => ({
      id: item.id || `business-card-${index + 1}`,
      indexNumber: item.indexNumber || String(index + 1).padStart(2, '0'),
      title: item.title || '',
      description: item.description || '',
      ctaText: item.ctaText || 'more information',
      ctaLink: item.ctaLink || '/businesses',
      imageUrl: item.imageUrl || null,
      diagramType: item.diagramType || 'sitemap',
    }));

    const data: CoreBusinessData = {
      title: section.title || defaultCoreBusinessData.title,
      badge: section.badge || defaultCoreBusinessData.badge || '',
      subtitle: section.subtitle || defaultCoreBusinessData.subtitle || '',
      cards,
      isActive: section.isActive ?? true,
    };

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error fetching Core Business data:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch Core Business data' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const title = typeof body.title === 'string' && body.title.trim()
      ? body.title.trim()
      : defaultCoreBusinessData.title;

    const badge = typeof body.badge === 'string' ? body.badge.trim() : '';
    const subtitle = typeof body.subtitle === 'string' ? body.subtitle.trim() : '';
    const isActive = typeof body.isActive === 'boolean' ? body.isActive : true;

    const rawCards: any[] = Array.isArray(body.cards) ? body.cards : defaultCoreBusinessData.cards;
    const cards: CoreBusinessCard[] = rawCards.map((c, i) => ({
      id: c.id || `card-${i + 1}-${Date.now()}`,
      indexNumber: c.indexNumber || String(i + 1).padStart(2, '0'),
      title: c.title || `Service ${i + 1}`,
      description: c.description || '',
      ctaText: c.ctaText || 'more information',
      ctaLink: c.ctaLink || '/businesses',
      imageUrl: c.imageUrl || null,
      diagramType: c.diagramType || 'sitemap',
    }));

    const content = {
      cards,
    };

    const updated = await prisma.siteSection.upsert({
      where: {
        pageSlug_sectionKey: {
          pageSlug: 'home',
          sectionKey: 'core_business',
        },
      },
      update: {
        name: 'Core Business Verticals',
        title,
        badge,
        subtitle,
        content: content as any,
        isActive,
        order: 3,
      },
      create: {
        pageSlug: 'home',
        sectionKey: 'core_business',
        name: 'Core Business Verticals',
        title,
        badge,
        subtitle,
        content: content as any,
        isActive,
        order: 3,
      },
    });

    revalidatePath('/');
    revalidatePath('/admin/core-business');

    return NextResponse.json({
      success: true,
      data: {
        title: updated.title,
        badge: updated.badge,
        subtitle: updated.subtitle,
        cards,
        isActive: updated.isActive,
      },
    });
  } catch (error: any) {
    console.error('Error saving Core Business data:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save Core Business data' },
      { status: 500 }
    );
  }
}
