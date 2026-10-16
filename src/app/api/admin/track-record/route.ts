import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db/prisma';
import { TrackRecordData, defaultTrackRecordData, TrackRecordCard } from '@/types/trackRecord';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const section = await prisma.siteSection.findUnique({
      where: {
        pageSlug_sectionKey: {
          pageSlug: 'home',
          sectionKey: 'trust',
        },
      },
    });

    if (!section) {
      return NextResponse.json({ success: true, data: defaultTrackRecordData });
    }

    const content = (section.content as any) || {};

    // Support both headlineLine1/headlineLine2 and legacy single title string
    let headlineLine1 = content.headlineLine1;
    let headlineLine2 = content.headlineLine2;

    if (!headlineLine1 && section.title) {
      if (section.title.includes('\n')) {
        const parts = section.title.split('\n');
        headlineLine1 = parts[0];
        headlineLine2 = parts.slice(1).join(' ');
      } else if (section.title.includes('since')) {
        const idx = section.title.indexOf('since');
        headlineLine1 = section.title.slice(0, idx).trim();
        headlineLine2 = section.title.slice(idx).trim();
      } else {
        headlineLine1 = section.title;
        headlineLine2 = '';
      }
    }

    // Map stats cards
    const rawStats: any[] = Array.isArray(content.stats) ? content.stats : defaultTrackRecordData.cards;
    const cards: TrackRecordCard[] = rawStats.map((item, index) => ({
      id: item.id || `stat-${index + 1}`,
      value: item.value || '',
      label: item.label || '',
      subtext: item.subtext || '',
      iconName: item.iconName || item.icon || 'Award',
      iconUrl: item.iconUrl || null,
      tag: item.tag || 'VERIFIED',
    }));

    // Map industries
    const industries: string[] = Array.isArray(content.industries) && content.industries.length > 0
      ? content.industries
      : defaultTrackRecordData.industries;

    const data: TrackRecordData = {
      badge: section.badge || defaultTrackRecordData.badge,
      headlineLine1: headlineLine1 || defaultTrackRecordData.headlineLine1,
      headlineLine2: headlineLine2 !== undefined ? headlineLine2 : defaultTrackRecordData.headlineLine2,
      subtitle: section.subtitle || defaultTrackRecordData.subtitle,
      cards: cards.length > 0 ? cards : defaultTrackRecordData.cards,
      industries,
      isActive: section.isActive ?? true,
    };

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('Error fetching track record section:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch track record configuration' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body: TrackRecordData = await request.json();

    const badge = (body.badge || '').trim() || defaultTrackRecordData.badge;
    const headlineLine1 = (body.headlineLine1 || '').trim() || defaultTrackRecordData.headlineLine1;
    const headlineLine2 = (body.headlineLine2 || '').trim();
    const fullTitle = headlineLine2 ? `${headlineLine1}\n${headlineLine2}` : headlineLine1;
    const subtitle = (body.subtitle || '').trim() || defaultTrackRecordData.subtitle;
    const isActive = typeof body.isActive === 'boolean' ? body.isActive : true;

    const cards: TrackRecordCard[] = Array.isArray(body.cards) ? body.cards : defaultTrackRecordData.cards;
    const industries: string[] = Array.isArray(body.industries) ? body.industries : defaultTrackRecordData.industries;

    const content = {
      headlineLine1,
      headlineLine2,
      stats: cards,
      industries,
    };

    const updated = await prisma.siteSection.upsert({
      where: {
        pageSlug_sectionKey: {
          pageSlug: 'home',
          sectionKey: 'trust',
        },
      },
      update: {
        name: 'Track Record Section',
        badge,
        title: fullTitle,
        subtitle,
        isActive,
        content: content as any,
      },
      create: {
        pageSlug: 'home',
        sectionKey: 'trust',
        name: 'Track Record Section',
        badge,
        title: fullTitle,
        subtitle,
        isActive,
        content: content as any,
        order: 2,
      },
    });

    try {
      revalidatePath('/');
    } catch {
      // Ignore during development
    }

    return NextResponse.json({
      success: true,
      message: 'Track Record section updated and published to storefront!',
      data: {
        badge: updated.badge,
        headlineLine1,
        headlineLine2,
        subtitle: updated.subtitle,
        cards,
        industries,
        isActive: updated.isActive,
      },
    });
  } catch (err: any) {
    console.error('Error updating track record section:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to update track record section' },
      { status: 500 }
    );
  }
}
