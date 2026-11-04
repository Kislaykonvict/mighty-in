import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db/prisma';
import {
  DEFAULT_BUSINESS_SLUGS,
  businessVerticalDefaults,
  createDefaultVerticalData,
  VerticalListItem,
} from '@/types/businessVertical';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Fetch all verticals from the database
    let dbVerticals: any[] = [];
    try {
      dbVerticals = await prisma.businessVertical.findMany({
        orderBy: { order: 'asc' },
      });
    } catch (e) {
      console.warn('Could not query BusinessVertical table:', e);
    }

    // 2. Build list ensuring the core 3 defaults are always present
    const map = new Map<string, VerticalListItem>();

    // Add core defaults
    DEFAULT_BUSINESS_SLUGS.forEach((slug) => {
      const def = businessVerticalDefaults[slug];
      map.set(slug, {
        id: slug,
        slug,
        name: def?.title || slug,
        tagline: def?.tagline || '',
        isCustom: false,
      });
    });

    // Merge or add DB verticals
    dbVerticals.forEach((v) => {
      const isCustom = !DEFAULT_BUSINESS_SLUGS.includes(v.slug as any);
      map.set(v.slug, {
        id: v.id || v.slug,
        slug: v.slug,
        name: v.name,
        tagline: v.tagline || '',
        isCustom,
      });
    });

    const verticals = Array.from(map.values());

    return NextResponse.json({
      success: true,
      data: verticals,
    });
  } catch (error: any) {
    console.error('Error fetching business verticals list:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch business verticals' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const title = (body.title || '').trim();
    let slug = (body.slug || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    const tagline = (body.tagline || '').trim();

    if (!title) {
      return NextResponse.json(
        { success: false, error: 'Business title is required.' },
        { status: 400 }
      );
    }

    if (!slug) {
      slug = title
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    }

    // Check slug collision
    if (DEFAULT_BUSINESS_SLUGS.includes(slug as any)) {
      return NextResponse.json(
        { success: false, error: `The slug "${slug}" is already reserved for a core business vertical.` },
        { status: 400 }
      );
    }

    const existingDb = await prisma.businessVertical.findUnique({
      where: { slug },
    });
    if (existingDb) {
      return NextResponse.json(
        { success: false, error: `A business vertical with the slug "${slug}" already exists.` },
        { status: 400 }
      );
    }

    // Generate defaults
    const defaults = createDefaultVerticalData(slug, title, tagline);
    const pageSlug = `business-${slug}`;

    // 1. Create BusinessVertical record
    await prisma.businessVertical.create({
      data: {
        id: slug,
        slug,
        name: title,
        tagline: defaults.tagline,
        pillarHeadline: title,
        headline: defaults.hero.headline,
        subheadline: defaults.hero.subheadline,
        description: defaults.tagline,
        themeColor: 'growth',
        accentHex: '#8B1E2D',
        gradient: 'from-rose-500 to-orange-500',
        bgGradient: 'from-slate-950 to-slate-900',
        heroImage: defaults.hero.backgroundImage,
        services: [],
        outcomes: [],
        coreCapabilities: [],
        isActive: true,
      },
    });

    // 2. Create SiteSection Hero record
    await prisma.siteSection.create({
      data: {
        pageSlug,
        sectionKey: 'hero',
        name: `${title} Hero Section`,
        title: defaults.hero.headline,
        subtitle: defaults.hero.subheadline,
        ctaText: defaults.hero.ctaText,
        ctaLink: defaults.hero.ctaLink,
        isActive: true,
        order: 1,
        content: {
          headline: defaults.hero.headline,
          subheadline: defaults.hero.subheadline,
          ctaText: defaults.hero.ctaText,
          ctaLink: defaults.hero.ctaLink,
          backgroundImage: defaults.hero.backgroundImage,
          imageAlt: defaults.hero.imageAlt,
          scrollTarget: defaults.hero.scrollTarget,
        },
      },
    });

    // 3. Create SiteSection Philosophy record
    await prisma.siteSection.create({
      data: {
        pageSlug,
        sectionKey: 'philosophy',
        name: `${title} Philosophy & Craft`,
        badge: defaults.philosophy.badge,
        title: defaults.philosophy.title,
        subtitle: defaults.philosophy.subtitle,
        isActive: true,
        order: 2,
        content: {
          badge: defaults.philosophy.badge,
          title: defaults.philosophy.title,
          subtitle: defaults.philosophy.subtitle,
          cards: defaults.philosophy.cards,
        } as any,
      },
    });

    // Revalidate paths
    try {
      revalidatePath(`/businesses/${slug}`);
      revalidatePath('/businesses');
      revalidatePath('/admin/businesses');
    } catch (e) {}

    return NextResponse.json({
      success: true,
      data: {
        id: slug,
        slug,
        name: title,
        tagline: defaults.tagline,
        isCustom: true,
        hero: defaults.hero,
        philosophy: defaults.philosophy,
      },
    });
  } catch (error: any) {
    console.error('Error creating business vertical:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create business vertical' },
      { status: 500 }
    );
  }
}
