import { NextResponse } from 'next/server';
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

    if (!section || !section.isActive) {
      return NextResponse.json({ success: true, data: defaultTrackRecordData });
    }

    const content = (section.content as any) || {};

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
    console.error('Error fetching public track record section:', err);
    return NextResponse.json({ success: true, data: defaultTrackRecordData });
  }
}
