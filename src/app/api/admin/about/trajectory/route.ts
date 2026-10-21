import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db/prisma';
import { TrajectoryData, defaultTrajectoryData } from '@/types/trajectory';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const section = await prisma.siteSection.findUnique({
      where: {
        pageSlug_sectionKey: {
          pageSlug: 'about',
          sectionKey: 'trajectory',
        },
      },
    });

    if (!section || !section.content) {
      return NextResponse.json({ success: true, data: defaultTrajectoryData });
    }

    const content = section.content as any;

    const data: TrajectoryData = {
      badge: section.badge || content.badge || defaultTrajectoryData.badge,
      title: section.title || content.title || defaultTrajectoryData.title,
      subtitle: section.subtitle || content.subtitle || defaultTrajectoryData.subtitle,
      epochs: Array.isArray(content.epochs) && content.epochs.length > 0
        ? content.epochs
        : defaultTrajectoryData.epochs,
      isActive: section.isActive ?? true,
    };

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error fetching admin trajectory data:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch trajectory data' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body: TrajectoryData = await req.json();

    const title = body.title || defaultTrajectoryData.title;
    const subtitle = body.subtitle || defaultTrajectoryData.subtitle;
    const badge = body.badge || defaultTrajectoryData.badge;
    const isActive = typeof body.isActive === 'boolean' ? body.isActive : true;
    const epochs = Array.isArray(body.epochs) && body.epochs.length > 0
      ? body.epochs
      : defaultTrajectoryData.epochs;

    const content = {
      badge,
      title,
      subtitle,
      epochs,
    };

    const updated = await prisma.siteSection.upsert({
      where: {
        pageSlug_sectionKey: {
          pageSlug: 'about',
          sectionKey: 'trajectory',
        },
      },
      update: {
        name: 'Brand Trajectory Horizon Engine',
        title,
        subtitle,
        badge,
        content: content as any,
        isActive,
        order: 2,
      },
      create: {
        pageSlug: 'about',
        sectionKey: 'trajectory',
        name: 'Brand Trajectory Horizon Engine',
        title,
        subtitle,
        badge,
        content: content as any,
        isActive,
        order: 2,
      },
    });

    revalidatePath('/about');

    return NextResponse.json({
      success: true,
      message: 'Brand Trajectory section saved & published successfully!',
      data: {
        badge: updated.badge,
        title: updated.title,
        subtitle: updated.subtitle,
        epochs,
        isActive: updated.isActive,
      },
    });
  } catch (error: any) {
    console.error('Error saving admin trajectory data:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save trajectory data' },
      { status: 500 }
    );
  }
}
