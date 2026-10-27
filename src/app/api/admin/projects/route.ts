import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const verticalFilter = searchParams.get('vertical') || '';

    const where: any = {};
    if (query.trim()) {
      where.OR = [
        { title: { contains: query.trim(), mode: 'insensitive' } },
        { client: { contains: query.trim(), mode: 'insensitive' } },
        { industry: { contains: query.trim(), mode: 'insensitive' } },
      ];
    }
    if (verticalFilter) {
      where.verticalId = verticalFilter;
    }

    const [projects, verticals] = await Promise.all([
      prisma.project.findMany({
        where,
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
        include: {
          vertical: {
            select: { id: true, name: true, themeColor: true, accentHex: true },
          },
        },
      }),
      prisma.businessVertical.findMany({
        select: { id: true, name: true, themeColor: true, accentHex: true },
        orderBy: { order: 'asc' },
      }),
    ]);

    return NextResponse.json({
      success: true,
      projects,
      verticals,
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

    const client = body.client?.trim() || 'Enterprise Client';
    const industry = body.industry?.trim() || 'General';
    const verticalId = body.verticalId || 'technology';

    // Verify or fetch vertical
    const vertical = await prisma.businessVertical.findUnique({
      where: { id: verticalId },
    });
    const verticalName = vertical?.name || body.verticalName || 'Technology';

    // Generate or format slug
    const baseSlug = (body.slug || title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    // Ensure slug uniqueness
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.project.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    // Get max order
    const lastProject = await prisma.project.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    });
    const order = typeof body.order === 'number' ? body.order : (lastProject?.order ?? 0) + 1;

    const project = await prisma.project.create({
      data: {
        slug,
        title,
        client,
        industry,
        verticalId,
        verticalName,
        year: body.year || new Date().getFullYear().toString(),
        heroImage: body.heroImage || '/images/hero/mw-hero-bg.webp',
        thumbnailImage: body.thumbnailImage || body.heroImage || '/images/hero/mw-hero-bg.webp',
        galleryImages: Array.isArray(body.galleryImages) ? body.galleryImages : [],
        shortDescription: body.shortDescription || body.tagline || title,
        tagline: body.tagline || title,
        summary: body.summary || body.shortDescription || '',
        challenge: body.challenge || '',
        solution: body.solution || '',
        objectives: Array.isArray(body.objectives) ? body.objectives : [],
        strategy: Array.isArray(body.strategy) ? body.strategy : [],
        technologiesUsed: Array.isArray(body.technologiesUsed) ? body.technologiesUsed : [],
        metrics: Array.isArray(body.metrics) ? body.metrics : [],
        featured: Boolean(body.featured),
        liveUrl: body.liveUrl || null,
        order,
        metaTitle: body.metaTitle || `${title} | Case Study | Mighty Warner`,
        metaDescription: body.metaDescription || body.shortDescription || '',
      },
      include: {
        vertical: true,
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
