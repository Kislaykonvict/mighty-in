import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';
import { defaultTeamPageSettings, TeamPageSettings } from '@/types/team';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const section = await prisma.siteSection.findUnique({
      where: {
        pageSlug_sectionKey: {
          pageSlug: 'team',
          sectionKey: 'header',
        },
      },
    });

    if (!section) {
      return NextResponse.json({ success: true, data: defaultTeamPageSettings });
    }

    const content = (section.content as any) || {};

    const data: TeamPageSettings = {
      eyebrow: section.badge || content.eyebrow || defaultTeamPageSettings.eyebrow,
      title: section.title || defaultTeamPageSettings.title,
      subtitle: section.subtitle || content.subtitle || defaultTeamPageSettings.subtitle,
    };

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error fetching team page settings:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch team page settings' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body: TeamPageSettings = await req.json();

    const eyebrow = body.eyebrow?.trim() || defaultTeamPageSettings.eyebrow;
    const title = body.title?.trim() || defaultTeamPageSettings.title;
    const subtitle = body.subtitle?.trim() || defaultTeamPageSettings.subtitle;

    const content = {
      eyebrow,
      title,
      subtitle,
    };

    await prisma.siteSection.upsert({
      where: {
        pageSlug_sectionKey: {
          pageSlug: 'team',
          sectionKey: 'header',
        },
      },
      update: {
        badge: eyebrow,
        title,
        subtitle,
        content,
      },
      create: {
        pageSlug: 'team',
        sectionKey: 'header',
        name: 'Team Page Editorial Header',
        badge: eyebrow,
        title,
        subtitle,
        content,
      },
    });

    revalidatePath('/team');
    revalidatePath('/about');

    return NextResponse.json({
      success: true,
      data: {
        eyebrow,
        title,
        subtitle,
      },
    });
  } catch (error: any) {
    console.error('Error updating team page settings:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update team page settings' },
      { status: 500 }
    );
  }
}

