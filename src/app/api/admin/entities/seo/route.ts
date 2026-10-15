import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      entityType,
      id,
      metaTitle,
      metaDescription,
      metaKeywords,
      canonicalUrl,
      headCode,
    } = body;

    if (!entityType || !id) {
      return NextResponse.json(
        { error: 'Missing required fields: entityType and id' },
        { status: 400 }
      );
    }

    const data = {
      metaTitle: metaTitle || null,
      metaDescription: metaDescription || null,
      metaKeywords: metaKeywords || null,
      canonicalUrl: canonicalUrl || null,
      headCode: headCode || null,
    };

    let updatedRecord = null;

    if (entityType === 'project') {
      updatedRecord = await prisma.project.update({
        where: { id },
        data,
      });
    } else if (entityType === 'insight') {
      updatedRecord = await prisma.insight.update({
        where: { id },
        data,
      });
    } else if (entityType === 'vertical') {
      updatedRecord = await prisma.businessVertical.update({
        where: { id },
        data,
      });
    } else {
      return NextResponse.json(
        { error: `Unsupported entity type: ${entityType}` },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedRecord,
    });
  } catch (error: any) {
    console.error('Error updating item-level SEO:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update item-level SEO' },
      { status: 500 }
    );
  }
}
