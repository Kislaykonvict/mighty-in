import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db/prisma';
import { defaultInsightPageSettings, InsightPageSettings } from '@/types/insight';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const section = await prisma.siteSection.findUnique({
      where: {
        pageSlug_sectionKey: {
          pageSlug: 'insights',
          sectionKey: 'header',
        },
      },
    });

    if (!section) {
      return NextResponse.json({ success: true, data: defaultInsightPageSettings });
    }

    const content = (section.content as any) || {};

    const data: InsightPageSettings = {
      title: section.title || defaultInsightPageSettings.title,
      titleAccent:
        content.titleAccent !== undefined ? content.titleAccent : defaultInsightPageSettings.titleAccent,
      description: section.subtitle || content.description || defaultInsightPageSettings.description,
    };

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error fetching insights page settings:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch insights page settings' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body: InsightPageSettings = await req.json();

    const title = body.title?.trim() || defaultInsightPageSettings.title;
    const titleAccent =
      body.titleAccent !== undefined ? body.titleAccent.trim() : defaultInsightPageSettings.titleAccent;
    const description = body.description?.trim() || defaultInsightPageSettings.description;

    const content = {
      titleAccent,
      description,
    };

    await prisma.siteSection.upsert({
      where: {
        pageSlug_sectionKey: {
          pageSlug: 'insights',
          sectionKey: 'header',
        },
      },
      update: {
        title,
        subtitle: description,
        content,
      },
      create: {
        pageSlug: 'insights',
        sectionKey: 'header',
        name: 'Insights & Blog Editorial Header',
        title,
        subtitle: description,
        content,
      },
    });

    revalidatePath('/insights');

    return NextResponse.json({
      success: true,
      data: {
        title,
        titleAccent,
        description,
      },
    });
  } catch (error: any) {
    console.error('Error updating insights page settings:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update insights page settings' },
      { status: 500 }
    );
  }
}

