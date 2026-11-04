import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db/prisma';
import {
  DEFAULT_BUSINESS_SLUGS,
  businessVerticalDefaults,
  createDefaultVerticalData,
  BusinessHeroData,
  BusinessPhilosophyData,
} from '@/types/businessVertical';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const isDefault = DEFAULT_BUSINESS_SLUGS.includes(slug as any);

    let title = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    let tagline = '';
    let fallback = businessVerticalDefaults[slug];

    if (isDefault && fallback) {
      title = fallback.title;
      tagline = fallback.tagline;
    } else {
      try {
        const dbVertical = await prisma.businessVertical.findUnique({
          where: { slug },
        });
        if (dbVertical) {
          title = dbVertical.name;
          tagline = dbVertical.tagline || '';
        }
      } catch (e) {}

      fallback = createDefaultVerticalData(slug, title, tagline);
    }

    const pageSlug = `business-${slug}`;

    const [heroSection, philosophySection] = await Promise.all([
      prisma.siteSection.findUnique({
        where: {
          pageSlug_sectionKey: {
            pageSlug,
            sectionKey: 'hero',
          },
        },
      }),
      prisma.siteSection.findUnique({
        where: {
          pageSlug_sectionKey: {
            pageSlug,
            sectionKey: 'philosophy',
          },
        },
      }),
    ]);

    let heroData: BusinessHeroData = fallback.hero;
    if (heroSection) {
      const content = (heroSection.content as any) || {};
      heroData = {
        headline: heroSection.title || content.headline || fallback.hero.headline,
        subheadline: heroSection.subtitle || content.subheadline || fallback.hero.subheadline,
        ctaText: heroSection.ctaText || content.ctaText || fallback.hero.ctaText,
        ctaLink: heroSection.ctaLink || content.ctaLink || fallback.hero.ctaLink,
        backgroundImage: content.backgroundImage || fallback.hero.backgroundImage,
        imageAlt: content.imageAlt || fallback.hero.imageAlt,
        scrollTarget: content.scrollTarget || fallback.hero.scrollTarget,
        isActive: heroSection.isActive ?? true,
      };
    }

    let philosophyData: BusinessPhilosophyData = fallback.philosophy;
    if (philosophySection) {
      const content = (philosophySection.content as any) || {};
      philosophyData = {
        badge: philosophySection.badge || content.badge || fallback.philosophy.badge,
        title: philosophySection.title || content.title || fallback.philosophy.title,
        subtitle: philosophySection.subtitle || content.subtitle || fallback.philosophy.subtitle,
        cards:
          Array.isArray(content.cards) && content.cards.length > 0
            ? content.cards
            : fallback.philosophy.cards,
        isActive: philosophySection.isActive ?? true,
      };
    }

    return NextResponse.json({
      success: true,
      data: {
        slug,
        title,
        tagline,
        hero: heroData,
        philosophy: philosophyData,
        isCustom: !isDefault,
      },
    });
  } catch (error: any) {
    console.error('Error fetching business vertical data:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch business vertical' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const pageSlug = `business-${slug}`;
    const body = await req.json();
    const { section, hero, philosophy } = body;

    let title = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    let tagline = '';
    const fallback = businessVerticalDefaults[slug] || createDefaultVerticalData(slug, title, tagline);
    title = fallback.title;

    // Save Hero
    if (section === 'hero' || section === 'all') {
      if (hero) {
        const headline = hero.headline || fallback.hero.headline;
        const subheadline = hero.subheadline || '';
        const ctaText = hero.ctaText || fallback.hero.ctaText;
        const ctaLink = hero.ctaLink || fallback.hero.ctaLink;
        const backgroundImage = hero.backgroundImage || fallback.hero.backgroundImage;
        const imageAlt = hero.imageAlt || fallback.hero.imageAlt;
        const scrollTarget = hero.scrollTarget || fallback.hero.scrollTarget;
        const isActive = typeof hero.isActive === 'boolean' ? hero.isActive : true;

        await prisma.siteSection.upsert({
          where: {
            pageSlug_sectionKey: {
              pageSlug,
              sectionKey: 'hero',
            },
          },
          update: {
            name: `${title} Hero Section`,
            title: headline,
            subtitle: subheadline,
            ctaText,
            ctaLink,
            isActive,
            content: {
              headline,
              subheadline,
              ctaText,
              ctaLink,
              backgroundImage,
              imageAlt,
              scrollTarget,
            },
          },
          create: {
            pageSlug,
            sectionKey: 'hero',
            name: `${title} Hero Section`,
            title: headline,
            subtitle: subheadline,
            ctaText,
            ctaLink,
            isActive,
            order: 1,
            content: {
              headline,
              subheadline,
              ctaText,
              ctaLink,
              backgroundImage,
              imageAlt,
              scrollTarget,
            },
          },
        });
      }
    }

    // Save Philosophy & Craft
    if (section === 'philosophy' || section === 'all') {
      if (philosophy) {
        const badge = philosophy.badge || fallback.philosophy.badge;
        const titleText = philosophy.title || fallback.philosophy.title;
        const subtitle = philosophy.subtitle || fallback.philosophy.subtitle;
        const cards = Array.isArray(philosophy.cards) ? philosophy.cards : fallback.philosophy.cards;
        const isActive = typeof philosophy.isActive === 'boolean' ? philosophy.isActive : true;

        await prisma.siteSection.upsert({
          where: {
            pageSlug_sectionKey: {
              pageSlug,
              sectionKey: 'philosophy',
            },
          },
          update: {
            name: `${title} Philosophy & Craft`,
            badge,
            title: titleText,
            subtitle,
            isActive,
            content: {
              badge,
              title: titleText,
              subtitle,
              cards,
            },
          },
          create: {
            pageSlug,
            sectionKey: 'philosophy',
            name: `${title} Philosophy & Craft`,
            badge,
            title: titleText,
            subtitle,
            isActive,
            order: 2,
            content: {
              badge,
              title: titleText,
              subtitle,
              cards,
            },
          },
        });
      }
    }

    // Bust Next.js cache for the pages
    try {
      revalidatePath(`/businesses/${slug}`);
      revalidatePath('/businesses');
      revalidatePath('/admin/businesses');
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: `${title} updated successfully`,
    });
  } catch (error: any) {
    console.error('Error updating business vertical:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update business vertical' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Guard core defaults
    if (DEFAULT_BUSINESS_SLUGS.includes(slug as any)) {
      return NextResponse.json(
        { success: false, error: 'The core business verticals cannot be deleted.' },
        { status: 400 }
      );
    }

    // 1. Delete all siteSection entries for this vertical
    await prisma.siteSection.deleteMany({
      where: {
        pageSlug: `business-${slug}`,
      },
    });

    // 2. Delete BusinessVertical record if exists
    try {
      await prisma.businessVertical.delete({
        where: { slug },
      });
    } catch (e) {}

    // Revalidate paths
    try {
      revalidatePath(`/businesses/${slug}`);
      revalidatePath('/businesses');
      revalidatePath('/admin/businesses');
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: `Business vertical ${slug} deleted successfully`,
    });
  } catch (error: any) {
    console.error('Error deleting business vertical:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete business vertical' },
      { status: 500 }
    );
  }
}
