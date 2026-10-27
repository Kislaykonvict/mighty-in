import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db/prisma';
import { defaultWorkPageSettings, WorkPageSettings } from '@/types/workPage';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const section = await prisma.siteSection.findUnique({
      where: {
        pageSlug_sectionKey: {
          pageSlug: 'work',
          sectionKey: 'header',
        },
      },
    });

    if (!section) {
      return NextResponse.json({ success: true, data: defaultWorkPageSettings });
    }

    const content = (section.content as any) || {};

    const data: WorkPageSettings = {
      badge: section.badge || defaultWorkPageSettings.badge,
      title: section.title || defaultWorkPageSettings.title,
      highlightedTitle: content.highlightedTitle || defaultWorkPageSettings.highlightedTitle,
      description: section.subtitle || content.description || defaultWorkPageSettings.description,
    };

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error fetching work page settings:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch work page settings' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body: WorkPageSettings = await req.json();

    const badge = body.badge?.trim() || defaultWorkPageSettings.badge;
    const title = body.title?.trim() || defaultWorkPageSettings.title;
    const highlightedTitle = body.highlightedTitle?.trim() || defaultWorkPageSettings.highlightedTitle;
    const description = body.description?.trim() || defaultWorkPageSettings.description;

    const content = {
      highlightedTitle,
      description,
    };

    await prisma.siteSection.upsert({
      where: {
        pageSlug_sectionKey: {
          pageSlug: 'work',
          sectionKey: 'header',
        },
      },
      update: {
        badge,
        title,
        subtitle: description,
        content,
      },
      create: {
        pageSlug: 'work',
        sectionKey: 'header',
        name: 'Work Portfolio Editorial Header',
        badge,
        title,
        subtitle: description,
        content,
      },
    });

    revalidatePath('/work');
    revalidatePath('/portfolio');

    return NextResponse.json({
      success: true,
      data: {
        badge,
        title,
        highlightedTitle,
        description,
      },
    });
  } catch (error: any) {
    console.error('Error updating work page settings:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update work page settings' },
      { status: 500 }
    );
  }
}
