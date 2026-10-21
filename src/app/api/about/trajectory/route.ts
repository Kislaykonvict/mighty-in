import { NextResponse } from 'next/server';
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
    console.error('Error fetching Trajectory data:', error);
    return NextResponse.json(
      { success: true, data: defaultTrajectoryData, error: error.message },
      { status: 200 }
    );
  }
}
