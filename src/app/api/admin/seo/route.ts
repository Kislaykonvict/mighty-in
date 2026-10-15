import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');

    if (path) {
      const seo = await prisma.pageSeo.findUnique({
        where: { path },
      });

      if (!seo) {
        return NextResponse.json({ error: 'Page SEO not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, data: seo });
    }

    const allSeoPages = await prisma.pageSeo.findMany({
      orderBy: { pageName: 'asc' },
    });

    return NextResponse.json({ success: true, data: allSeoPages });
  } catch (error) {
    console.error('Error fetching PageSeo:', error);
    return NextResponse.json({ error: 'Failed to fetch SEO configuration' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      path,
      pageName,
      metaTitle,
      metaDescription,
      metaKeywords,
      canonicalUrl,
      headCode,
      ogTitle,
      ogDescription,
      ogImage,
      noIndex,
      noFollow,
    } = body;

    if (!path) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 });
    }

    const updated = await prisma.pageSeo.upsert({
      where: { path },
      update: {
        pageName: pageName || undefined,
        metaTitle,
        metaDescription,
        metaKeywords,
        canonicalUrl,
        headCode,
        ogTitle,
        ogDescription,
        ogImage,
        noIndex: Boolean(noIndex),
        noFollow: Boolean(noFollow),
      },
      create: {
        path,
        pageName: pageName || path,
        metaTitle,
        metaDescription,
        metaKeywords,
        canonicalUrl,
        headCode,
        ogTitle,
        ogDescription,
        ogImage,
        noIndex: Boolean(noIndex),
        noFollow: Boolean(noFollow),
      },
    });

    // Revalidate the page so changes take effect immediately
    try {
      revalidatePath(path);
    } catch (e) {
      // Revalidation silent catch in development/build
    }

    return NextResponse.json({
      success: true,
      message: 'SEO metadata updated successfully',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating PageSeo:', error);
    return NextResponse.json({ error: 'Failed to update SEO configuration' }, { status: 500 });
  }
}
