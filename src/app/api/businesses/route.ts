import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { DEFAULT_BUSINESS_SLUGS, businessVerticalDefaults } from '@/types/businessVertical';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const dbVerticals = await prisma.businessVertical.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });

    const map = new Map<
      string,
      {
        name: string;
        href: string;
        tagline: string;
        description: string;
      }
    >();

    // 1. Seed with defaults in correct order
    DEFAULT_BUSINESS_SLUGS.forEach((slug) => {
      const def = businessVerticalDefaults[slug];
      if (def) {
        map.set(slug, {
          name: def.title,
          href: `/businesses/${slug}`,
          tagline: def.tagline,
          description: def.tagline || def.hero.subheadline,
        });
      }
    });

    // 2. Merge or append all DB verticals
    dbVerticals.forEach((v) => {
      const existing = map.get(v.slug);
      map.set(v.slug, {
        name: v.name || existing?.name || v.slug,
        href: `/businesses/${v.slug}`,
        tagline: v.tagline || existing?.tagline || '',
        description: v.tagline || v.subheadline || v.description || existing?.description || '',
      });
    });

    return NextResponse.json({
      success: true,
      data: Array.from(map.values()),
    });
  } catch (error) {
    console.error('Error fetching public businesses list:', error);
    return NextResponse.json({ success: false, data: [] });
  }
}

