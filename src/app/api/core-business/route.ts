import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { CoreBusinessData, defaultCoreBusinessData, CoreBusinessCard } from '@/types/coreBusiness';

export const revalidate = 60; // Cache for 60 seconds

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

    if (!section || !section.isActive) {
      return NextResponse.json(defaultCoreBusinessData);
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

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in public /api/core-business:', error);
    return NextResponse.json(defaultCoreBusinessData);
  }
}
