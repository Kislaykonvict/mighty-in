import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db/prisma';
import { AboutHeroData, defaultAboutHeroData } from '@/types/aboutHero';

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
      return NextResponse.json({ success: true, data: defaultAboutHeroData });
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

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error fetching admin about hero data:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch about hero data' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body: AboutHeroData = await req.json();

    const headline = body.headline || defaultAboutHeroData.headline;
    const subheadline = body.subheadline || '';
    const ctaText = body.ctaText || defaultAboutHeroData.ctaText;
    const ctaLink = body.ctaLink || defaultAboutHeroData.ctaLink;
    const backgroundImage = body.backgroundImage || defaultAboutHeroData.backgroundImage;
    const imageAlt = body.imageAlt || defaultAboutHeroData.imageAlt;
    const scrollTarget = body.scrollTarget || defaultAboutHeroData.scrollTarget;
    const isActive = typeof body.isActive === 'boolean' ? body.isActive : true;

    const content = {
      headline,
      subheadline,
      ctaText,
      ctaLink,
      backgroundImage,
      imageAlt,
      scrollTarget,
    };

    const updated = await prisma.siteSection.upsert({
      where: {
        pageSlug_sectionKey: {
          pageSlug: 'about',
          sectionKey: 'hero',
        },
      },
      update: {
        name: 'About Hero Section',
        title: headline,
        subtitle: subheadline,
        ctaText,
        ctaLink,
        content: content as any,
        isActive,
        order: 1,
      },
      create: {
        pageSlug: 'about',
        sectionKey: 'hero',
        name: 'About Hero Section',
        title: headline,
        subtitle: subheadline,
        ctaText,
        ctaLink,
        content: content as any,
        isActive,
        order: 1,
      },
    });

    revalidatePath('/about');
    revalidatePath('/api/about/hero');

    return NextResponse.json({
      success: true,
      message: 'About hero section updated successfully',
      data: updated,
    });
  } catch (error: any) {
    console.error('Error updating admin about hero data:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update about hero data' },
      { status: 500 }
    );
  }
}
