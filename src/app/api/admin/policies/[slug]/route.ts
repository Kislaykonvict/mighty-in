import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { defaultPolicyPages } from '@/data/defaultPolicyPages';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    let page = await prisma.policyPage.findUnique({
      where: { slug },
    });

    if (!page) {
      const def = defaultPolicyPages[slug];
      if (def) {
        try {
          page = await prisma.policyPage.create({
            data: {
              slug: def.slug,
              title: def.title,
              heroImage: def.heroImage,
              heroTitle: def.heroTitle,
              heroSubtitle: def.heroSubtitle,
              heroBadge: def.heroBadge,
              content: def.content,
              metaTitle: def.metaTitle,
              metaDescription: def.metaDescription,
              isActive: def.isActive,
              order: def.order ?? 0,
            },
          });
        } catch {
          return NextResponse.json({ success: true, data: def });
        }
      } else {
        return NextResponse.json(
          { success: false, error: 'Policy page not found' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json({ success: true, data: page });
  } catch (error: any) {
    console.error(`Error fetching policy page ${params.slug}:`, error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch policy page' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const body = await request.json();

    const {
      title,
      heroImage,
      heroTitle,
      heroSubtitle,
      heroBadge,
      content,
      metaTitle,
      metaDescription,
      isActive,
      order,
    } = body;

    const page = await prisma.policyPage.upsert({
      where: { slug },
      update: {
        title: title !== undefined ? title : undefined,
        heroImage: heroImage !== undefined ? heroImage : undefined,
        heroTitle: heroTitle !== undefined ? heroTitle : null,
        heroSubtitle: heroSubtitle !== undefined ? heroSubtitle : null,
        heroBadge: heroBadge !== undefined ? heroBadge : null,
        content: content !== undefined ? content : undefined,
        metaTitle: metaTitle !== undefined ? metaTitle : null,
        metaDescription: metaDescription !== undefined ? metaDescription : null,
        isActive: isActive !== undefined ? isActive : true,
        order: order !== undefined ? Number(order) : undefined,
      },
      create: {
        slug,
        title: title || slug,
        heroImage: heroImage || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=2000&q=80',
        heroTitle: heroTitle || null,
        heroSubtitle: heroSubtitle || null,
        heroBadge: heroBadge || null,
        content: content || '<p>Content coming soon...</p>',
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        isActive: isActive !== undefined ? isActive : true,
        order: order !== undefined ? Number(order) : 0,
      },
    });

    return NextResponse.json({
      success: true,
      data: page,
      message: `${page.title} updated successfully`,
    });
  } catch (error: any) {
    console.error(`Error updating policy page ${params.slug}:`, error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update policy page' },
      { status: 500 }
    );
  }
}
