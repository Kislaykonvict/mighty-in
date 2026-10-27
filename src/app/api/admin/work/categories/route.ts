import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

const DEFAULT_WORK_CATEGORIES = [
  'Fintech & Cross-Border Payments',
  'MedTech & Clinical Software',
  'HealthTech & Personalized Wellness',
  'Freight, Logistics & Warehousing',
  'Financial Services & Wealth Management',
  'Enterprise B2B Cloud & Logistics',
];

export async function GET() {
  try {
    const section = await prisma.siteSection.findUnique({
      where: {
        pageSlug_sectionKey: {
          pageSlug: 'work',
          sectionKey: 'categories',
        },
      },
    });

    if (!section) {
      // Find distinct industries from projects if available
      const projs = await prisma.project.findMany({
        select: { industry: true },
        distinct: ['industry'],
      });
      const dbIndustries = projs
        .map((p) => p.industry?.trim())
        .filter((ind): ind is string => Boolean(ind));

      const categories = dbIndustries.length > 0 ? dbIndustries : DEFAULT_WORK_CATEGORIES;

      return NextResponse.json({
        success: true,
        categories,
        title: 'TRUSTED ACROSS:',
      });
    }

    const content = (section.content as any) || {};
    const categories: string[] = Array.isArray(content.categories) && content.categories.length > 0
      ? content.categories
      : DEFAULT_WORK_CATEGORIES;

    return NextResponse.json({
      success: true,
      categories,
      title: section.title || content.title || 'TRUSTED ACROSS:',
    });
  } catch (error: any) {
    console.error('Error fetching work categories:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const categories: string[] = Array.isArray(body.categories)
      ? Array.from(new Set(body.categories.map((c: any) => String(c).trim()).filter(Boolean)))
      : [];

    if (categories.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one category is required' },
        { status: 400 }
      );
    }

    const title = typeof body.title === 'string' && body.title.trim()
      ? body.title.trim()
      : 'TRUSTED ACROSS:';

    const updated = await prisma.siteSection.upsert({
      where: {
        pageSlug_sectionKey: {
          pageSlug: 'work',
          sectionKey: 'categories',
        },
      },
      create: {
        pageSlug: 'work',
        sectionKey: 'categories',
        name: 'Work Categories & Industry Sectors',
        title,
        content: {
          categories,
          title,
        },
        isActive: true,
      },
      update: {
        title,
        content: {
          categories,
          title,
        },
        isActive: true,
      },
    });

    revalidatePath('/work');
    revalidatePath('/portfolio');
    revalidatePath('/admin/work');

    return NextResponse.json({
      success: true,
      categories,
      title,
      data: updated,
    });
  } catch (error: any) {
    console.error('Error updating work categories:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update categories' },
      { status: 500 }
    );
  }
}
