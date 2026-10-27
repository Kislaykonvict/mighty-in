import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        vertical: true,
      },
    });

    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, project });
  } catch (error: any) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const existing = await prisma.project.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    // Determine verticalName if verticalId changed
    let verticalName = body.verticalName || existing.verticalName;
    if (body.verticalId && body.verticalId !== existing.verticalId) {
      const v = await prisma.businessVertical.findUnique({
        where: { id: body.verticalId },
      });
      if (v) verticalName = v.name;
    }

    // Check slug uniqueness if changed
    if (body.slug && body.slug !== existing.slug) {
      const slugTaken = await prisma.project.findUnique({
        where: { slug: body.slug },
      });
      if (slugTaken && slugTaken.id !== id) {
        return NextResponse.json({ success: false, error: 'A project with this URL slug already exists' }, { status: 400 });
      }
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        title: body.title !== undefined ? body.title : existing.title,
        slug: body.slug !== undefined ? body.slug : existing.slug,
        client: body.client !== undefined ? body.client : existing.client,
        industry: body.industry !== undefined ? body.industry : existing.industry,
        verticalId: body.verticalId !== undefined ? body.verticalId : existing.verticalId,
        verticalName,
        year: body.year !== undefined ? body.year : existing.year,
        heroImage: body.heroImage !== undefined ? body.heroImage : existing.heroImage,
        thumbnailImage: body.thumbnailImage !== undefined ? body.thumbnailImage : existing.thumbnailImage,
        galleryImages: body.galleryImages !== undefined ? body.galleryImages : existing.galleryImages,
        shortDescription: body.shortDescription !== undefined ? body.shortDescription : existing.shortDescription,
        tagline: body.tagline !== undefined ? body.tagline : existing.tagline,
        summary: body.summary !== undefined ? body.summary : existing.summary,
        challenge: body.challenge !== undefined ? body.challenge : existing.challenge,
        solution: body.solution !== undefined ? body.solution : existing.solution,
        objectives: body.objectives !== undefined ? body.objectives : existing.objectives,
        strategy: body.strategy !== undefined ? body.strategy : existing.strategy,
        technologiesUsed: body.technologiesUsed !== undefined ? body.technologiesUsed : existing.technologiesUsed,
        metrics: body.metrics !== undefined ? body.metrics : existing.metrics,
        featured: body.featured !== undefined ? Boolean(body.featured) : existing.featured,
        liveUrl: body.liveUrl !== undefined ? body.liveUrl : existing.liveUrl,
        order: body.order !== undefined ? Number(body.order) : existing.order,
        metaTitle: body.metaTitle !== undefined ? body.metaTitle : existing.metaTitle,
        metaDescription: body.metaDescription !== undefined ? body.metaDescription : existing.metaDescription,
      },
      include: {
        vertical: true,
      },
    });

    revalidatePath('/');
    revalidatePath('/work');
    revalidatePath('/portfolio');

    return NextResponse.json({ success: true, project: updated });
  } catch (error: any) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const existing = await prisma.project.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    await prisma.project.delete({
      where: { id },
    });

    revalidatePath('/');
    revalidatePath('/work');
    revalidatePath('/portfolio');

    return NextResponse.json({ success: true, message: 'Project successfully deleted' });
  } catch (error: any) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete project' },
      { status: 500 }
    );
  }
}
