import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db/prisma';
import { deleteFromCloudinary } from '@/lib/cloudinary';
import { HeroData, defaultHeroData } from '@/types/hero';

export const dynamic = 'force-dynamic';

// GET /api/admin/hero - Fetch current Hero section configuration
export async function GET() {
  try {
    const section = await prisma.siteSection.findUnique({
      where: {
        pageSlug_sectionKey: {
          pageSlug: 'home',
          sectionKey: 'hero',
        },
      },
    });

    if (!section) {
      return NextResponse.json({ success: true, data: defaultHeroData });
    }

    const content = (section.content as any) || {};

    const data: HeroData = {
      badge: section.badge || defaultHeroData.badge,
      title: section.title || defaultHeroData.title,
      subtitle: section.subtitle || defaultHeroData.subtitle,
      ctaText: section.ctaText || defaultHeroData.ctaText,
      ctaLink: section.ctaLink || defaultHeroData.ctaLink,
      secondaryCtaText: content.secondaryCtaText || defaultHeroData.secondaryCtaText,
      secondaryCtaLink: content.secondaryCtaLink || defaultHeroData.secondaryCtaLink,
      videoUrl: content.videoUrl ?? '',
      fallbackImageUrl: content.fallbackImageUrl ?? '',
      overlayOpacity: typeof content.overlayOpacity === 'number' ? content.overlayOpacity : defaultHeroData.overlayOpacity,
      isActive: section.isActive ?? true,
    };

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('Error fetching hero section:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch hero config' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/hero - Update Hero section configuration
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const title = (body.title || '').trim() || defaultHeroData.title;
    const subtitle = (body.subtitle || '').trim();
    const badge = (body.badge || '').trim();
    const ctaText = (body.ctaText || '').trim();
    const ctaLink = (body.ctaLink || '').trim() || '/work';
    const secondaryCtaText = (body.secondaryCtaText || '').trim();
    const secondaryCtaLink = (body.secondaryCtaLink || '').trim() || '/contact';
    const videoUrl = (body.videoUrl || '').trim();
    const fallbackImageUrl = (body.fallbackImageUrl || '').trim();
    const overlayOpacity = typeof body.overlayOpacity === 'number' ? Math.min(100, Math.max(0, body.overlayOpacity)) : 55;
    const isActive = typeof body.isActive === 'boolean' ? body.isActive : true;

    const content = {
      videoUrl,
      fallbackImageUrl,
      secondaryCtaText,
      secondaryCtaLink,
      overlayOpacity,
    };

    // Clean up replaced Cloudinary media if URLs changed
    try {
      const existing = await prisma.siteSection.findUnique({
        where: { pageSlug_sectionKey: { pageSlug: 'home', sectionKey: 'hero' } },
      });
      const prevContent = (existing?.content as any) || {};

      // If previous video was on Cloudinary and was changed, delete it
      if (
        prevContent.videoUrl &&
        prevContent.videoUrl !== videoUrl &&
        prevContent.videoUrl.includes('res.cloudinary.com')
      ) {
        await deleteFromCloudinary(prevContent.videoUrl, 'video');
        await prisma.mediaAsset.deleteMany({
          where: { OR: [{ url: prevContent.videoUrl }, { secureUrl: prevContent.videoUrl }] },
        });
      }

      // If previous fallback image was on Cloudinary and was changed, delete it
      if (
        prevContent.fallbackImageUrl &&
        prevContent.fallbackImageUrl !== fallbackImageUrl &&
        prevContent.fallbackImageUrl.includes('res.cloudinary.com')
      ) {
        await deleteFromCloudinary(prevContent.fallbackImageUrl, 'image');
        await prisma.mediaAsset.deleteMany({
          where: { OR: [{ url: prevContent.fallbackImageUrl }, { secureUrl: prevContent.fallbackImageUrl }] },
        });
      }
    } catch (cleanupErr) {
      console.warn('[Admin Hero PUT] Error cleaning up replaced media:', cleanupErr);
    }

    const updated = await prisma.siteSection.upsert({
      where: {
        pageSlug_sectionKey: {
          pageSlug: 'home',
          sectionKey: 'hero',
        },
      },
      update: {
        title,
        subtitle,
        badge,
        ctaText,
        ctaLink,
        isActive,
        content,
      },
      create: {
        pageSlug: 'home',
        sectionKey: 'hero',
        name: 'Hero Section',
        title,
        subtitle,
        badge,
        ctaText,
        ctaLink,
        isActive,
        content,
        order: 0,
      },
    });

    // Revalidate home page cache
    try {
      revalidatePath('/');
    } catch (e) {
      // Ignore in dev
    }

    return NextResponse.json({
      success: true,
      message: 'Hero section updated successfully',
      data: {
        badge: updated.badge,
        title: updated.title,
        subtitle: updated.subtitle,
        ctaText: updated.ctaText,
        ctaLink: updated.ctaLink,
        secondaryCtaText,
        secondaryCtaLink,
        videoUrl,
        fallbackImageUrl,
        overlayOpacity,
        isActive: updated.isActive,
      },
    });
  } catch (err: any) {
    console.error('Error updating hero section:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to update hero config' },
      { status: 500 }
    );
  }
}
