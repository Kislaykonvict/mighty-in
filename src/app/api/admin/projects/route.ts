import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const categoryFilter = searchParams.get('category') || searchParams.get('industry') || '';

    const where: any = {};
    if (query.trim()) {
      where.OR = [
        { title: { contains: query.trim(), mode: 'insensitive' } },
        { category: { contains: query.trim(), mode: 'insensitive' } },
      ];
    }
    if (categoryFilter && categoryFilter !== 'ALL') {
      where.category = categoryFilter;
    }

    const [projects, distinctCategories, categorySection] = await Promise.all([
      prisma.project.findMany({
        where,
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      }),
      prisma.project.findMany({
        select: { category: true },
        distinct: ['category'],
      }),
      prisma.siteSection.findUnique({
        where: {
          pageSlug_sectionKey: {
            pageSlug: 'work',
            sectionKey: 'categories',
          },
        },
      }),
    ]);

    const sectionCategories = (categorySection?.content as any)?.categories;
    const categories = Array.isArray(sectionCategories) && sectionCategories.length > 0
      ? sectionCategories
      : distinctCategories
          .map((p) => p.category?.trim())
          .filter((cat): cat is string => Boolean(cat));

    return NextResponse.json({
      success: true,
      projects,
      categories,
      industries: categories, // Keep backwards compatibility if needed
    });
  } catch (error: any) {
    console.error('Error fetching admin projects:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const title = body.title?.trim();
    if (!title) {
      return NextResponse.json({ success: false, error: 'Project title is required' }, { status: 400 });
    }

    const category = body.category?.trim() || body.industry?.trim() || 'General';
    const thumbnailImage = body.thumbnailImage?.trim() || '/images/hero/mw-hero-bg.webp';
    const liveUrl = body.liveUrl?.trim() || '#';

    // Get max order
    const lastProject = await prisma.project.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    });
    const order = typeof body.order === 'number' ? body.order : (lastProject?.order ?? 0) + 1;

    const project = await prisma.project.create({
      data: {
        title,
        category,
        thumbnailImage,
        liveUrl,
        published: body.published !== undefined ? Boolean(body.published) : true,
        featured: Boolean(body.featured),
        order,
      },
    });

    revalidatePath('/');
    revalidatePath('/work');
    revalidatePath('/portfolio');

    return NextResponse.json({ success: true, project });
  } catch (error: any) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create project' },
      { status: 500 }
    );
  }
}
